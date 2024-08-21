import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { EmployeeEducational } from '../../../../../../../models/employees.Model';
import { TranslationService } from '../../../../../../core/services/translationService/translation.service';
import { EmployeeService } from '../../../../../../services/employeeService/employee.service';
@Component({
  selector: 'app-educational-certficate',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './educational-certficate.component.html',
  styleUrl: './educational-certficate.component.css'
})
export class EducationalCertficateComponent {
  public data: EmployeeEducational[] = [];
  public certificateTypes: any[] = [];
  public fileTypes: any[] = [];
  public fileDescriptions: Record<number, any[]> = {};
  currentLang: string = 'ar';
  @Input() employeeId!: any;

  constructor(
    private router: Router,
    private translationService: TranslationService,
    private employeeService: EmployeeService,
  ) {
  }

  ngOnInit(): void {
    if (this.employeeId) {
      this.getEmployeeEducationalCertificates();
    } else {
      console.error('Employee ID is required to fetch the certificates.');
    }
  }

  private getEmployeeEducationalCertificates(): void {
    const requestData = { employeeId: this.employeeId, sortIsAsc: true };
    this.employeeService.getEmployeeEductional(requestData).subscribe(
      (response) => {
        if (response && response.data && response.data.list) {
          this.data = response.data.list;

          console.log("this.data", this.data)
        } else {
          console.error('Unexpected response structure:', response);
        }
        console.log('Employee Educational Certificates:', this.data); // Log the data to check the response
      },
      (error) => {
        console.error('Error fetching employee educational certificates:', error);
      }
    );
  }

}
