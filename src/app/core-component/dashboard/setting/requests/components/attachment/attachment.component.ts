import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeAttachmentService } from '../../../../../../services/Employee/EmployeeAttachmentService/employee-attachment.service';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-attachment',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './attachment.component.html',
  styleUrl: './attachment.component.css'
})
export class AttachmentComponent {
  public data: any[] = [];
  currentLang: string = localStorage.getItem('lang')!;

  @Input() employeeId!: any;

  constructor(
    private employeeAttachment: EmployeeAttachmentService,
  ) {
  }
  ngOnInit(): void {
    if (this.employeeId) {
      this.fetchAttachmentsData();
    } else {
      console.error('Employee ID is required to fetch attachments data.');
    }
  }

  fetchAttachmentsData(): void {
    const requestData = { employeeId: this.employeeId };
    this.employeeAttachment.getEmployeeAttachments(requestData).subscribe({
      next: (response) => {
        if (response.status === 200 && response.data && response.data.list) {
          this.data = response.data.list;
        } else {
          console.error('Unexpected response structure:', response);
        }
      },
      error: (err) => console.error('Failed to fetch employee attachments', err)
    });
  }

}
