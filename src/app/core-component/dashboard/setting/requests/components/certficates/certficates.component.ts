import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeCertificate } from '../../../../../../../models/employees.Model';
import { EmployeeService } from '../../../../../../services/employeeService/employee.service';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService } from '../../../../../services/translationService/translation.service';


@Component({
  selector: 'app-certficates',
  standalone: true,
  templateUrl: './certficates.component.html',
  styleUrls: ['./certficates.component.css'],
  imports: [CommonModule, TranslateModule]
})
export class CertficatesComponent implements OnInit {
  public data: EmployeeCertificate[] = [];
  public certificateTypes: any[] = [];
  public fileTypes: any[] = [];
  public fileDescriptions: Record<number, any[]> = {};
  currentLang: string = localStorage.getItem('lang') || 'ar';
  @Input() employeeId!: any;

  constructor(
    private employeeService: EmployeeService,
    private translateService: TranslationService
  ) {

  }

  ngOnInit(): void {
    if (this.employeeId) {
      this.getEmployeeCertificates();
      this.getCertificateTypes();
    } else {
      console.error('Employee ID is required to fetch the certificates.');
    }
  }

  private getEmployeeCertificates(): void {
    const requestData = { employeeId: this.employeeId, sortIsAsc: true };
    this.employeeService.getEmployeeCertificate(requestData).subscribe(
      (response) => {
        if (response && response.data && response.data.list) {
          this.data = response.data.list;
        } else {
          console.error('Unexpected response structure:', response);
        }
        console.log('Employee Certificates:', this.data); // Log the data to check the response
      },
      (error) => {
        console.error('Error fetching employee certificates:', error);
      }
    );
  }

  private getCertificateTypes(): void {
    this.employeeService.getCertificateTypes().subscribe(
      (response: any) => {
        if (response && response.data && response.data.list) {
          this.certificateTypes = response.data.list;
        } else {
          console.error('Unexpected response structure:', response);
        }
        console.log('Certificate Types:', this.certificateTypes); // Log the data to check the response
      },
      (error) => {
        console.error('Error fetching certificate types:', error);
      }
    );
  }

  getCertificateTypeName(typeId: number): string {
    const type = this.certificateTypes.find(t => t.id === typeId);
    return type ? (this.currentLang === 'ar' ? type.nameAr : type.name) : this.translateService.translate('NoDataEntered');
  }




}
