import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { PersonalInformationComponent } from '../../components/personal-information/personal-information.component';
import { AddressComponent } from '../../components/address/address.component';
import { SocialComponent } from '../../components/social/social.component';
import { MedicalInsuranceComponent } from '../../components/medical-insurance/medical-insurance.component';
import { CertficatesComponent } from '../../components/certficates/certficates.component';
import { WorkHistoryComponent } from '../../components/work-history/work-history.component';
import { SkillsComponent } from '../../components/skills/skills.component';
import { EducationalCertficateComponent } from '../../components/educational-certficate/educational-certficate.component';
import { AttachmentComponent } from '../../components/attachment/attachment.component';
import { UserTypeComponent } from '../../components/user-type/user-type.component';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EmployeeRequestsService } from '../../../../../../services/employeeRequestsService/employee-requests.service';
import { MessageService } from 'primeng/api';
import { EmployeeService } from '../../../../../../services/employeeService/employee.service';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    PersonalInformationComponent,
    AddressComponent,
    SocialComponent,
    MedicalInsuranceComponent,
    CertficatesComponent,
    WorkHistoryComponent, AttachmentComponent,
    SkillsComponent, ToastModule, EducationalCertficateComponent, UserTypeComponent
  ], providers: [
    MessageService
  ],
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css'],
})
export class EmployeeDetailsComponent {
  constructor(private activatedRoute: ActivatedRoute, private employeeRequestsService: EmployeeRequestsService, private messageService: MessageService, private employeeService: EmployeeService,) {
  }
  empId: string = ''
  employee?: Employee;
  isPending: boolean = false;
  fullbase?: string;
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.empId = params.get('id') || '';
    });
    this.employeeService
      .getEmployee({
        id: this.empId,
      })
      .subscribe({
        next: (response: any) => {
          this.employee = response[0];
          this.fullbase = response[0].referancePhoto;
          console.log(this.fullbase)
          console.log(this.employee)
        },
      })
  }
  accept(): void {
    this.employeeRequestsService.editAccountStatus(this.empId, AccountStatus.Accepted).subscribe(
      (data) => {
        this.showSuccess(
          "success",
          "تم قبول الطلب"//todo
        );
        location.reload();
      },
      (error) => {
        this.showError(
          "فشل",
          "فشلت العملية"
        );
      }
    );
  }
  reject(): void {
    this.employeeRequestsService.editAccountStatus(this.empId, AccountStatus.Rejected).subscribe(
      (data) => {
        this.showSuccess(
          "success",
          "تم رفض الطلب"
        );
        location.reload();
      },
      (error) => {
        this.showError(
          "فشل",
          "فشلت العملية"
        );
      }
    );
  }
  private showSuccess(message: string, details: string): void {
    this.messageService.add({
      severity: 'success',
      summary: message,
      detail: details,
    });
  }
  private showError(message: string, details: string): void {
    this.messageService.add({
      severity: 'error',
      summary: message,
      detail: details,
    });
  }
}
