import { Component, OnInit, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PositionService } from '../../../../../../services/positionService/position.service';
import { EmployeeService } from '../../../../../../services/employeeService/employee.service';
import { AssignEmployeesComponent } from '../../../../employee/assign-employees/assign-employees.component';
import { AddPositionComponent } from '../add-position/add-position.component';
import { employee } from '../../../../../../../models/employee';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Department } from '../../../../../../../models/department';
import { DepartmentService } from '../../../../../../services/lockupsServices/DepartmentService/department.service';
import { ModernTableComponent } from '../../../../components/modern-table/modern-table.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Position } from '../../../../../../../models/postion';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
@Component({
  selector: 'app-index',
  standalone: true,
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  providers: [PositionService, EmployeeService, MessageService,ConfirmationService],
  imports: [RouterLink, CommonModule, AssignEmployeesComponent, PaginationModule, AddPositionComponent, ToastModule, ModernTableComponent, FormsModule, TranslateModule,ConfirmDialogModule]
})
export class IndexComponent implements OnInit {
  isAdd: boolean = false;
  isEdit: boolean = false;
  isAddEmployee: boolean = false;
  showDetails: boolean = false;
  selectedPositionId?: string;
  selectedPositionData: any = {};
  directManger?: employee = {} as employee;
  employees: employee[] = [];
  @Input() companyId?: string = '';
  positions: Position[] = [];
  departments: Department[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  isArabic: boolean = false;
  positionData!: Position;
  constructor(
    private positionService: PositionService,
    private employeeService: EmployeeService,
    private messageService: MessageService,
    private departmentService: DepartmentService,
    private translate: TranslateService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.loadPositions();
    this.loadDepartments();

    this.isArabic = this.translate.currentLang === 'ar';

    this.translate.onLangChange.subscribe((event) => {
      this.isArabic = event.lang === 'ar';
    });
  }

  loadPositions(page: number = this.currentPage): void {
    this.positionService.getPosition({ companyId: this.companyId, pageSize: this.itemsPerPage, pageIndex: page }).subscribe({
      next: (response) => {
        this.positions = response.data.list;
        this.totalItems = response.data.totalRows;
        console.table(response.data)
      }
    });
  }

  loadUnassignedEmployees(): void {
    this.employeeService.loadEmployees({ companyId: this.companyId }).subscribe({
      next: (response) => {
        this.employees = response.data.list.filter(
          (employee: any) => !employee.positionId
        );
        console.log("Unassigned Employees:", this.employees);
      }
    });
  }

  handlePageChange(event: { page: number }): void {
    this.currentPage = event.page;
    this.loadPositions(this.currentPage);
  }

  loadEmployeesByPosition(positionId: string): void {
    this.employeeService.loadEmployees({ companyId: this.companyId }).subscribe({
      next: (response) => {
        this.employees = response.data.list.filter(
          (employee: any) => employee.positionId === positionId
        );
        console.log("Employees for Position:", this.employees);
      }
    });
  }

  loadDepartments(): void {
    if (this.companyId) {
      this.departmentService.getDepartment({ companyId: this.companyId }).subscribe({
        next: (response) => {
          this.departments = response.data.list;
        },
        error: (err) => {
          console.error('Error loading departments', err);
        }
      });
    }
  }

  getDepartmentName(departmentId: number): string {
    const department = this.departments.find(dep => dep.id === departmentId);
    return department?.name ?? 'Unknown';
  }

  addPosition(): void {
    this.isAdd = true;
  }

  editPosition(position: Position): void {
    this.isEdit = true;
    this.positionData = position;
  }


  addEmployee(positionId: string): void {
    this.selectedPositionId = positionId;
    this.selectedPositionData = this.positions.find(position => position.id === Number(positionId));
    this.loadUnassignedEmployees();
    this.isAddEmployee = true;
  }

  handleAction(isAdd: boolean): void {
    this.isAdd = isAdd;
    this.isEdit = isAdd;
    this.loadPositions();
  }

  closePopup(): void {
    this.isAddEmployee = false;
  }

  handleFormSubmit(formData: { employeeId: number, positionId: number }): void {
    this.employeeService.assginEmployeeToPosition({
      employeeId: formData.employeeId,
      positionId: formData.positionId
    }).subscribe({
      next: (response) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Employee assigned successfully' });
        this.closePopup();
        this.loadPositions();
        this.loadUnassignedEmployees();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error assigning employee' });
      }
    });
  }


  deletePosition(positionId: number): void {
    this.confirmationService.confirm({
      message: this.translate.instant('INDEX_POSITION.CONFIRM_DELETE_MESSAGE'),
      header: this.translate.instant('INDEX_POSITION.DELETE_CONFIRMATION_TITLE'),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: this.translate.instant('INDEX_POSITION.YES'),
      rejectLabel: this.translate.instant('INDEX_POSITION.NO'),
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        const companyId = this.companyId ? parseInt(this.companyId) : 0;
        this.positionService.deletePosition(positionId, companyId).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: this.translate.instant('INDEX_POSITION.DELETE_SUCCESS')
            });
            this.loadPositions();
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: this.translate.instant('position.ACTION_CANCELLED')
            });
          }
        });
      },
      reject: () => {
      }
    });
  }

  showDetailsPage(positionId: string): void {
    this.selectedPositionId = positionId;
    this.selectedPositionData = this.positions.find(position => position.id === Number(positionId));
    this.loadEmployeesByPosition(positionId);
    this.showDetails = true;
  }

  goBack(): void {
    this.showDetails = false;
  }
  toggleActivation(Position: Position): void {
    debugger
    Position.isActive ? this.deactivatePosition(Position) : this.activatePosition(Position);
  }

  activatePosition(Position: Position): void {
    debugger
    this.positionService.activatePosition(Position.id || 0, Position.companyId || 0).subscribe({
      next: () => {
        Position.isActive = true;
        this.showSuccess('Position activated successfully');
      }
    });
  }

  deactivatePosition(Position: Position): void {
    debugger
    this.positionService.deactivatePosition(Position.id || 0, Position.companyId || 0).subscribe({
      next: () => {
        Position.isActive = false;
        this.showSuccess('Position deactivated successfully');
      }
    });
  }
  private showSuccess(detail: string): void {
    this.messageService.add({ severity: 'success', summary: 'Success', detail });
  }
}
