import { Component, OnInit, Inject, Input } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { EmployeeService } from '../../../../../../services/employeeService/employee.service';
import { EmployeeMedicalInfo } from '../../../../../../../models/employees.Model';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../../../../services/translationService/translation.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-medical-insurance',
  standalone: true,
  templateUrl: './medical-insurance.component.html',
  styleUrls: ['./medical-insurance.component.css'],
  imports: [CommonModule, TranslateModule]

})
export class MedicalInsuranceComponent implements OnInit {
  public data: any[] = [];
  currentLang: string = localStorage.getItem('lang')!;
  @Input() employeeId!: string;
  employee?: EmployeeMedicalInfo;

  constructor(
    private employeeService: EmployeeService,
  ) {
    this.fetchHealthInformation();
  }
  fetchHealthInformation(): void {
    const requestData = {
      sortIsAsc: true,
      employeeId: this.employeeId
    };
    this.employeeService.getEmployeeHealthInformation(requestData).subscribe(
      response => {
        if (response && response.data && response.data.list.length > 0) {
          this.employee = response.data.list[0];
        } else {
          this.employee;
        }
      },
      error => {
        console.error('Error fetching health information:', error);
      }
    );
  }

  ngOnInit(): void {
    // Fetch or initialize data as needed
    this.data = this.getData(); // Replace with actual data fetching logic
  }


  private getData(): any[] {
    // Placeholder method for fetching or initializing data
    return [];
  }
}
