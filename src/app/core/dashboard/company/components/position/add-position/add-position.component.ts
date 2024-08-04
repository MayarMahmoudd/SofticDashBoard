import { Component, Output, EventEmitter, Input, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PositionTypeService } from '../../../../../../services/lockupsServices/positionTypeService/position-type.service';
import { DepartmentService } from '../../../../../../services/lockupsServices/DepartmentService/department.service';
import { PositionService } from '../../../../../../services/positionService/position.service';
import { Department } from '../../../../../../../models/department';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

interface Position {
  id: 0;
  name: string;
  nameAr: string;
}

@Component({
  selector: 'app-add-position',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastModule, ReactiveFormsModule],
  templateUrl: './add-position.component.html',
  styleUrls: ['./add-position.component.css'],
  providers: [MessageService],
})
export class AddPositionComponent implements OnInit {
  @Output() action = new EventEmitter<boolean>();
  @Input() companyId?: string = '';
  types: Position[] = [];
  departments: Department[] = [];
  form: FormGroup;

  positionTypeService = inject(PositionTypeService);
  departmentsService = inject(DepartmentService);
  positionService = inject(PositionService);
  messageService = inject(MessageService);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      position: ['', Validators.required],
      department: ['', Validators.required],
      isDirectManager: [false]
    });
  }

  ngOnInit(): void {
    this.loadPositionTypes();
    this.loadDepartments();
  }

  loadPositionTypes(): void {
    this.positionTypeService.getPositionTypes({ companyId: this.companyId }).subscribe({
      next: (response) => {
        this.types = response.data.list;
      },
      error: (err) => {
        console.error('Error loading position types', err);
      }
    });
  }

  loadDepartments(): void {
    this.departmentsService.getDepartment({ companyId: this.companyId }).subscribe({
      next: (response) => {
        this.departments = response.data.list;
      },
      error: (err) => {
        console.error('Error loading departments', err);
      }
    });
  }

  onSave(): void {
    if (this.form.invalid) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all required fields' });
      return;
    }

    const positionData = {
      id: 0,
      companyId: Number(this.companyId) || 0,
      positionTypeId: Number(this.form.value.position),
      departmentId: Number(this.form.value.department),
      positionManagerId: this.form.value.isDirectManager ? Number(this.form.value.position) : 0
    };
    
    console.log('Position data being sent:', positionData);
    
    this.positionService.addPosition(positionData).subscribe({
      next: (response) => {
        console.log('Position added successfully', response);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Position added successfully' });
        this.action.emit(false);
      },
      error: (err) => {
        console.error('Error adding position', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error adding position' });
      }
    });
    
  }













  onBack(): void {
    this.action.emit(false);
  }

  trackByPositionId(index: number, item: Position): number {
    return item.id;
  }

  trackByDepartmentId(index: number, item: Department): number {
    return item.id!;
  }
}
