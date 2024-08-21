import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Employee } from '../../../../../../../models/employees.Model';
import { EmployeeService } from '../../../../../../services/employeeService/employee.service';
import { Gender, MaritalStatus } from '../../../../../../../models/enums';
import { TranslationService } from '../../../../../services/translationService/translation.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-personal-information',
  standalone: true,
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.css'],
  imports: [CommonModule, TranslateModule]
})
export class PersonalInformationComponent implements OnInit {
  public data: any[] = [];
  currentLang: string = 'ar';
  employee?: Employee;
  @Input() employeeId: any;
  constructor(
    private translationService: TranslationService,
    private employeeService: EmployeeService,
  ) {
  }

  ngOnInit(): void {
    this.employeeService
      .getEmployeePersonalInfo({
        id: this.employeeId,
      })
      .subscribe({
        next: (response) => {
          this.employee = response[0];
        },
      });
    // Fetch or initialize data as needed
    this.data = this.getData(); // Replace with actual data fetching logic
  }

  private getData(): any[] {
    return [];
  }

  getGenderLabel(gender: Gender): string {
    switch (gender) {
      case Gender.Male:
        return this.translationService.translate('male');
      case Gender.Female:
        return this.translationService.translate('female');
      default:
        return '';
    }
  }
  getMaritalStatusLabel(status: string): string {
    switch (status.toLowerCase()) {
      case MaritalStatus.Married:
        return this.translationService.translate('married');
      case MaritalStatus.Single:
        return this.translationService.translate('Single');
      case MaritalStatus.Divorced:
        return this.translationService.translate('divorced');
      case MaritalStatus.Widower:
        return this.translationService.translate('Widower');
      default:
        return '';
    }
  }
}
