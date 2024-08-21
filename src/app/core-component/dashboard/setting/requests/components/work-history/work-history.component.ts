import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeWorkHistoryService } from '../../../../../../services/Employee/EmployeeWorkHistoryService/employee-work-history.service';
import { EmployeeService } from '../../../../../../services/employeeService/employee.service';
import { WorkExperience } from '../../../../../../../models/employees.Model';
import { TranslationService } from '../../../../../services/translationService/translation.service';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-work-history',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './work-history.component.html',
  styleUrl: './work-history.component.css'
})
export class WorkHistoryComponent {
  public data: any[] = [];
  currentLang: string = 'ar';
  employee?: WorkExperience;
  businessSizes: any[] = [];
  businessTypes: any[] = [];
  @Input() employeeId!: any;

  constructor(
    private translationService: TranslationService,
    private employeeWorkHistoryService: EmployeeWorkHistoryService,
    private employeeService: EmployeeService,
  ) {
  }

  ngOnInit(): void {
    if (this.employeeId) {
      this.getEmployeeWorkHistory();
      this.loadBusinessSizes();
      this.loadBusinessTypes();
    } else {
      console.error('Employee ID is required to fetch the work history.');
    }
  }

  private getEmployeeWorkHistory(): void {
    const requestData = { employeeId: this.employeeId, sortIsAsc: true };
    this.employeeWorkHistoryService.getEmployeeWorkHistory(requestData).subscribe(
      (response) => {
        if (response && response.data && response.data.list) {
          this.data = response.data.list;
        } else {
          console.error('Unexpected response structure:', response);
        }
        console.log('Employee Work History:', this.data); // Log the data to check the response
      },
      (error) => {
        console.error('Error fetching employee work history:', error);
      }
    );
  }
  loadBusinessSizes() {
    this.employeeService.getBusinessSizeDetails({ sortIsAsc: true }).subscribe({
      next: (response) => {
        if (response.status === 200 && response.data && response.data.list) {
          this.businessSizes = response.data.list;
        } else {
          console.error('Unexpected response structure:', response);
        }
      },
      error: (err) => console.error('Failed to load business sizes', err),
    });
  }

  loadBusinessTypes() {
    this.employeeService.getBusinessTypes({ sortIsAsc: true }).subscribe({
      next: (response) => {
        if (response.status === 200 && response.data && response.data.list) {
          this.businessTypes = response.data.list;
        } else {
          console.error('Unexpected response structure:', response);
        }
      },
      error: (err) => console.error('Failed to load business sizes', err),
    });
  }

  getBusinessSizeName(sizeId: number): string {
    const size = this.businessSizes.find(s => s.id === sizeId);
    return size ? (this.currentLang === 'ar' ? size.nameAr : size.name) : this.translationService.translate('NoDataEntered');
  }

  getBusinessTypeName(typeId: number): string {
    const type = this.businessTypes.find(t => t.id === typeId);
    return type ? (this.currentLang === 'ar' ? type.nameAr : type.name) : this.translationService.translate('NoDataEntered');
  }
}
