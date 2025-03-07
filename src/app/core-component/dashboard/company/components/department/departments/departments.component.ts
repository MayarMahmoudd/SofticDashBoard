import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Department } from '../../../../../../../models/department';
import { employee } from '../../../../../../../models/employee';
import { AddDepartmentComponent } from '../add-department/add-department.component';
import { DepartmentOverviewComponent } from '../department-overview/department-overview.component';
import { DepartmentService } from '../../../../../../services/lockupsServices/DepartmentService/department.service';
import { EmployeeService } from '../../../../../../services/employeeService/employee.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AssignEntityComponent } from '../assign-entity/assign-entity.component';
import { environment } from '../../../../../../environment/environment';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';


@Component({
  selector: 'app-departments',
  standalone: true,
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css'],
  providers: [DepartmentService, EmployeeService, MessageService,ConfirmationService],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    RouterOutlet,
    AddDepartmentComponent,
    DepartmentOverviewComponent,
    ToastModule,
    AssignEntityComponent,
    PaginationModule,
    TranslateModule,ConfirmDialogModule

  ]
})
export class DepartmentsComponent implements OnInit {
  @Input() companyId?: number;
  @Output() departmentAdded = new EventEmitter<void>();

  showOverView: boolean = false;
  isAdd: boolean = false;
  isEdit: boolean = false;
  isAssignEntity: boolean = false;

  departments: Department[] = [];
  department!: Department;
  employees: employee[] = [];

  selectedDepartment: Department | null = null;
  selectedEntityId: string | undefined = undefined;
  entityType: string = 'Employee';

  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  isArabic: boolean = false;


  constructor(
    private departmentService: DepartmentService,
    private employeeService: EmployeeService,
    private messageService: MessageService,
    private translate: TranslateService,
    private confirmationService: ConfirmationService
  ) { }
  private subscription: Subscription = new Subscription();

  ngOnInit(): void {
    this.isArabic = this.translate.currentLang === 'ar';
    this.loadDepartments();
    this.subscription.add(this.translate.onLangChange.subscribe(() => {
      this.checkLanguage();
    }));
  }
  checkLanguage(): void {
    this.isArabic = this.translate.currentLang === 'ar';
  }
  loadDepartments(page: number = this.currentPage): void {
    const companyId = this.getCompanyId();
    if (companyId) {
      this.departmentService.getDepartment({ companyId, pageIndex: page, pageSize: this.itemsPerPage }).subscribe({
        next: (response) => {
          this.departments = response.data.list;
          this.totalItems = response.data.totalRows;
          this.loadEmployees();
        }
      });
    }
  }

  handlePageChange(event: { page: number }): void {
    this.currentPage = event.page;
    this.loadDepartments(this.currentPage);
  }

  loadEmployees(): void {
    const companyId = this.getCompanyId();
    if (companyId) {
      this.employeeService.loadEmployees({ companyId }).subscribe({
        next: (response) => {
          this.employees = response.data.list.filter((employee: employee) => !employee.departmentId);
        }
      });
    }
  }

  addDepartment(): void {
    this.isAdd = true;
  }

  assignEntity(departmentId: string): void {
    this.selectedEntityId = departmentId;
    this.isAssignEntity = true;
    this.selectedDepartment = this.departments.find(dep => dep.id === Number(departmentId)) || null;
  }

  handleEntityAssigned(event: { entityId: number; relatedEntityId: number }): void {
    const requestPayload = {
      employeeId: event.entityId,
      departmentId: event.relatedEntityId
    };
    this.employeeService.assginEmployeeToDepartment(requestPayload).subscribe({
      next: () => {
        this.showSuccess('Employee assigned to department successfully');
        this.isAssignEntity = false;
        this.loadDepartments();
      }
    });
  }

  showDetails(departmentId: number): void {
    this.selectedDepartment = this.departments.find(dep => dep.id === departmentId) || null;
    this.showOverView = !!this.selectedDepartment;
  }

  goBack(): void {
    this.showOverView = this.isAdd = this.isAssignEntity = false;
  }

  handleAction(isAdd: boolean): void {
    this.isAdd = isAdd;
    this.isEdit = isAdd;
    this.loadDepartments();
  }



  toggleActivation(department: Department): void {
    department.isActive ? this.deactivateDepartment(department) : this.activateDepartment(department);
  }

  activateDepartment(department: Department): void {
    const companyId = this.getCompanyId();
    this.departmentService.activateDepartment(department.id, companyId || 0).subscribe({
      next: () => {
        department.isActive = true;
        this.showSuccess('Department activated successfully');
      }
    });
  }

  deactivateDepartment(department: Department): void {
    const companyId = this.getCompanyId();
    this.departmentService.deactivateDepartment(department.id, companyId || 0).subscribe({
      next: () => {
        department.isActive = false;
        this.showSuccess('Department deactivated successfully');
      }
    });
  }

  private getCompanyId(): number | null {
    const storedCompanyId = localStorage.getItem('companyId');
    return storedCompanyId ? Number(storedCompanyId) : null;
  }

  editDepartment(department: Department) {
    this.isEdit = true;
    this.department = department;
    console.log(department);
  }

  private showSuccess(detail: string): void {
    this.messageService.add({ severity: 'success', summary: 'Success', detail });
  }
  deleteDepartment(departmentId: number): void {
    this.confirmationService.confirm({
      message: this.translate.instant('DEPARTMENTS.CONFIRM_DELETE_MESSAGE'),
      header: this.translate.instant('DEPARTMENTS.DELETE_CONFIRMATION_TITLE'),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.translate.instant('DEPARTMENTS.YES'),
      rejectLabel: this.translate.instant('DEPARTMENTS.NO'),
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        const companyId = this.getCompanyId();
        if (companyId) {
          this.departmentService.deleteDepartment(departmentId, companyId).subscribe({
            next: () => {
              this.showSuccess(this.translate.instant('DEPARTMENTS.DELETE_SUCCESS'));
              this.loadDepartments();
            }
          });
        }
      },
      reject: () => {
      }
    });
  }

}
