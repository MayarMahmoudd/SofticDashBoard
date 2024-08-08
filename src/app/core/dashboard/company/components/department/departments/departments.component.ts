import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BasicTableComponent } from '../../../../components/basic-table/basic-table.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Department } from '../../../../../../../models/department';
import { employee } from '../../../../../../../models/employee';
import { AddDepartmentComponent } from '../add-department/add-department.component';
import { ApiCall } from '../../../../../../services/apiCall/apicall.service';
import { environment } from '../../../../../../environment/environment';
import { DepartmentOverviewComponent } from '../department-overview/department-overview.component';
import { DepartmentService } from '../../../../../../services/lockupsServices/DepartmentService/department.service';
import { EmployeeService } from '../../../../../../services/employeeService/employee.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AssignEmployeesComponent } from '../../../../employee/assign-employees/assign-employees.component';
 
@Component({
  selector: 'app-departments',
  standalone: true,
  templateUrl: './departments.component.html',
  styleUrls: ['./departments.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    BasicTableComponent,
    RouterOutlet,
    AddDepartmentComponent,
    DepartmentOverviewComponent,
    ToastModule,
    AssignEmployeesComponent 
  ],
  providers: [DepartmentService, EmployeeService, MessageService]
})
export class DepartmentsComponent implements OnInit {
  @Output() departmentAdded = new EventEmitter<void>();
  showOverView: boolean = false;
  selectedCard: any = null;
  isAdd: boolean = false;
  isAssignEmployee: boolean = false; // State to control the employee popup
  private apiUrl = `${environment.apiBaseUrl}Company`;
  department: Department = {} as Department;
  cards: any[] = [];
  active: boolean = true;
  headers: string[] = ['id', 'name', 'shortName', 'manager'];
  data: Department[] = [];
  employees: employee[] = []; // Separate state for employees
  title = 'Departments Overview';
  selectedPositionId: string | undefined = undefined; // State to hold selected position ID

  constructor(
    private apiCall: ApiCall,
    private router: Router,
    private departmentService: DepartmentService,
    private employeeService: EmployeeService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadDepartments();
    this.loadEmployees(); // Load employees data
  }

  loadDepartments(): void {
    const companyId = this.getCompanyId();
    if (companyId) {
      this.departmentService.getDepartment({ companyId }).subscribe({
        next: (response) => {
          this.cards = response.data.list.map((department: any) => ({
            id: department.id,
            title: department.name,
            department: department.shortName,
            active: department.active
          }));
        },
        error: (err) => {
          console.error('Error loading departments', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error loading departments' });
        }
      });
    }
  }

  loadEmployees(): void {
    const companyId = this.getCompanyId();
    if (companyId) {
      this.employeeService.loadEmployees({ companyId }).subscribe({
        next: (response) => {
          this.employees = response.data.list;
        },
        error: (err) => {
          console.error('Error loading employees', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error loading employees' });
        }
      });
    }
  }

  showDetails(cardId: number) {
    this.selectedCard = this.cards.find(card => card.id === cardId);
    this.fetchData(cardId);
    this.showOverView = true;
  }

  fetchData(cardId: number) {
    const useDemoData = true;

    if (useDemoData) {
      console.log(`Fetched mock data for card ${cardId}:`, this.data);
    } else {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      this.apiCall.request<any>(this.apiUrl + '/Get', 'post', {}, headers).subscribe(data => {
        console.log(data);
      });
    }
  }

  goBack() {
    if (this.showOverView) {
      this.showOverView = false;
    } else if (this.isAdd) {
      this.isAdd = false;
    } else if (this.isAssignEmployee) { // Handle the case for hiding employee popup
      this.isAssignEmployee = false;
    }
  }

  addDepartment(): void {
    this.isAdd = true;
  }

  handleAction(isAdd: boolean): void {
    this.isAdd = isAdd;
    console.log('Action emitted:', isAdd);
  }

  handleDepartmentAdded(): void {
    this.loadDepartments(); 
    this.isAdd = false;   
  }

  deleteDepartment(departmentId: number): void {
    const companyId = this.getCompanyId();
    if (companyId) {
      this.departmentService.deleteDepartment(departmentId, companyId).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Department deleted successfully' });
          this.loadDepartments(); // Reload departments after deletion
        },
        error: (err) => {
          console.error('Error deleting department', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error deleting department' });
        }
      });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Company ID is missing' });
    }
  }

  addEmployee(positionId: string): void {
    this.selectedPositionId = positionId;
    this.isAssignEmployee = true;
  }

  handleEmployeeAssigned(event: { employeeId: number, positionId: number }): void {
    console.log('Employee assigned:', event);
    // Handle employee assignment logic here
    this.isAssignEmployee = false;
  }

  private getCompanyId(): number | null {
    const storedCompanyId = localStorage.getItem('companyId');
    return storedCompanyId ? Number(storedCompanyId) : null;
  }
}
