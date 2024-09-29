import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { EmployeeService } from '../../../../services/employeeService/employee.service';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-shifts',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule, ToastModule],
  templateUrl: './shifts.component.html',
  styleUrls: ['./shifts.component.css'],
  providers: [MessageService]
})
export class ShiftsComponent implements OnInit {
  @Input() employeeId!: number;
  selectedEmployee: any = null;
  shift = {
    start: ' ',  
    end: ' '     
  };
  noShiftMessage = 'No Shift';  
  isDataLoaded = false;    

  constructor(
    private employeeService: EmployeeService,
    private translate: TranslateService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadEmployeeDetails(this.employeeId);
  }

  loadEmployeeDetails(employeeId: number) {
    const request = { id: employeeId };
    this.employeeService.loadEmployeeById(request).subscribe({
      next: (data) => {
        console.log('API response:', data);
        if (data && data.data && data.data.list && data.data.list.length > 0) {
          this.selectedEmployee = data.data.list[0];
          console.log('Selected Employee:', this.selectedEmployee);

          if (this.selectedEmployee?.startShift) {
            this.shift.start = typeof this.selectedEmployee.startShift === 'string' ?
              this.formatShiftTimeFromString(this.selectedEmployee.startShift) :
              this.formatShiftTimeFromObject(this.selectedEmployee.startShift);
          } else {
            this.shift.start = ' ';  
          }

          if (this.selectedEmployee?.endShift) {
            this.shift.end = typeof this.selectedEmployee.endShift === 'string' ?
              this.formatShiftTimeFromString(this.selectedEmployee.endShift) :
              this.formatShiftTimeFromObject(this.selectedEmployee.endShift);
          } else {
            this.shift.end = ' ';   
          }
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No employee data found.' });
        }
        this.isDataLoaded = true;  
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load employee details.' });
        console.error('Error loading employee details:', error);
        this.isDataLoaded = true;  
      }
    });
  }

  formatShiftTimeFromString(shiftTime: string): string {
    const timeParts = shiftTime.split(':');
    if (timeParts.length >= 2) {
      return `${timeParts[0]}:${timeParts[1]}`;   
    }
    return '00:00';   
  }

  formatShiftTimeFromObject(shift: { hour: number; minute: number }): string {
    const hour = shift.hour.toString().padStart(2, '0');   
    const minute = shift.minute.toString().padStart(2, '0');  
    return `${hour}:${minute}`;
  }

  isValidShift(): boolean {
    const [startHour, startMinute] = (this.shift.start || '').split(':').map(Number);
    const [endHour, endMinute] = (this.shift.end || '').split(':').map(Number);

    const startTime = new Date();
    startTime.setHours(startHour, startMinute, 0);

    const endTime = new Date();
    endTime.setHours(endHour, endMinute, 0);

    return startTime <= endTime;
  }

  saveShift() {
    if (!this.isValidShift()) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Start shift cannot be after end shift.' });
      return;
    }

    const request = {
      employeeId: this.selectedEmployee?.id || 0,
      startShiftHour: +(this.shift.start?.split(':')[0] || 0),
      startShiftMinute: +(this.shift.start?.split(':')[1] || 0),
      endShiftHour: +(this.shift.end?.split(':')[0] || 0),
      endShiftMinute: +(this.shift.end?.split(':')[1] || 0)
    };

    console.log('Request to be sent:', request);

    this.employeeService.assginShift(request).subscribe(response => {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Shift assigned successfully.' });
      console.log('Shift assigned successfully:', response);
    }, error => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to assign shift.' });
      console.error('Error assigning shift:', error);
    });
  }

  cancel() {
    // Handle cancel action
  }
}
