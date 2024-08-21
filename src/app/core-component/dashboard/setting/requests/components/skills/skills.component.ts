import { Component, OnInit, Inject, Input } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { EmployeeSkillsService } from '../../../../../../services/Employee/EmployeeSkillsService/employee-skills-service.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-skills',
  standalone: true,
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css'],
  imports: [CommonModule, TranslateModule],
})
export class SkillsComponent implements OnInit {
  public data: any[] = [];
  currentLang: string = localStorage.getItem('lang')!;

  @Input() employeeId!: any;

  constructor(
    private employeeSkillsService: EmployeeSkillsService,
    @Inject(DOCUMENT) private document: Document
  ) {

  }

  ngOnInit(): void {
    if (this.employeeId) {
      this.fetchSkillsData();
    } else {
      console.error('Employee ID is required to fetch skills data.');
    }
  }

  fetchSkillsData(): void {
    const requestData = { employeeId: this.employeeId };
    this.employeeSkillsService.getEmployeeSkill(requestData).subscribe({
      next: (response) => {
        if (response.status === 200 && response.data && response.data.list) {
          this.data = response.data.list;
        } else {
          console.error('Unexpected response structure:', response);
        }
      },
      error: (err) => console.error('Failed to fetch employee skills', err)
    });
  }

}
