import { SocialInfoService } from './../../../../../../services/Employee/EmployeeSocialInfoService/social-info.service';
import { EmployeeRefrenceService } from './../../../../../../services/Employee/EmployeeRefrenceService/employee-refrence.service';
import { Component, OnInit, Input } from '@angular/core';
import { EmployeeCommunication } from '../../../../../../../models/employees.Model';
import { NoDataComponent } from '../../../../components/no-data/no-data.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-social',
  standalone: true,
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.css'],
  imports: [CommonModule, NoDataComponent, TranslateModule] // Add CommonModule here

})
export class SocialComponent implements OnInit {
  public data: any[] = [];
  currentLang: string = localStorage.getItem('lang') || 'ar';
  employee?: EmployeeCommunication;
  @Input() employeeId: any;
  referenceTypes: { id: number, name: string, nameAr: string }[] = [];

  constructor(
    private socialInfoService: SocialInfoService,
    private employeeReferenceService: EmployeeRefrenceService // Assuming you have a service to fetch reference types
  ) {
  }

  ngOnInit(): void {
    this.fetchSocialInfo();
    this.loadReferenceTypes(); // Load reference types
  }


  private fetchSocialInfo(): void {
    this.socialInfoService.getEmployeeSocilaInfo({ id: this.employeeId })
      .subscribe(
        data => {
          this.data = data;
        },
        error => {
          console.error('Error fetching social information:', error);
        }
      );
  }

  private loadReferenceTypes(): void {
    this.employeeReferenceService
      .getEmployeeReferenceTypes({ sortIsAsc: true })
      .subscribe({
        next: (response: any) => {
          if (response && response.data.list) {
            this.referenceTypes = response.data.list;
          } else {
            console.error('Unexpected response structure:', response);
          }
        },
        error: (error) => {
          console.error('There was an error fetching the reference types', error);
        },
      });
  }

  getReferenceTypeName(referenceTypeId: number): string {
    const referenceType = this.referenceTypes.find(type => type.id === referenceTypeId);
    return referenceType ? (this.currentLang === 'ar' ? referenceType.nameAr : referenceType.name) : '';
  }
}
