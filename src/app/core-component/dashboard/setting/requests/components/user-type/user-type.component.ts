import { Component, OnInit, Inject, Input } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { EmployeeLifeStyleService } from '../../../../../../services/Employee/EmployeeLifeStyle/employee-life-style.service';
import { TranslationService } from '../../../../../services/translationService/translation.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-user-type',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './user-type.component.html',
  styleUrls: ['./user-type.component.css']
})
export class UserTypeComponent implements OnInit {
  public lifestyleTypes: any[] = [];
  public employeeLifestyleTypes: any[] = [];
  public mappedLifestyleTypes: any[] = [];
  currentLang: string = localStorage.getItem('lang')!;
  @Input() employeeId!: any;

  constructor(
    private translationService: TranslationService,
    private employeeLifeStyleService: EmployeeLifeStyleService,
    @Inject(DOCUMENT) private document: Document
  ) {
  }

  ngOnInit(): void {
    this.loadLifeStyle();
    this.loadEmployeeLifeStyle();
  }

  loadEmployeeLifeStyle() {
    this.employeeLifeStyleService.getEmployeeLifeStyles({ employeeId: this.employeeId }).subscribe({
      next: (response) => {
        if (response.list) {
          this.employeeLifestyleTypes = response.list;
          this.mapLifestyleTypes();
        } else {
          console.error('No selected lifestyle types found in response');
        }
      },
      error: (err: any) => {
        console.error('Error fetching selected lifestyle types:', err);
      },
    });
  }

  loadLifeStyle() {
    this.employeeLifeStyleService.getLifeStyleTypes({ sortIsAsc: true }).subscribe({
      next: (response) => {
        if (response) {
          this.lifestyleTypes = response.list;
          this.mapLifestyleTypes();
        } else {
          console.error('No lifestyle types found in response');
        }
      },
      error: (err: any) => {
        console.error('Error fetching lifestyle types:', err);
      },
    });
  }

  mapLifestyleTypes() {
    if (this.lifestyleTypes.length > 0 && this.employeeLifestyleTypes.length > 0) {
      this.mappedLifestyleTypes = this.employeeLifestyleTypes.map(employeeType => {

        const lifestyle = this.lifestyleTypes.find(type => type.id === employeeType.lifeStyleTypeId);

        return { ...employeeType, ...lifestyle };
      });
    }
  }
}
