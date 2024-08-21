import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { GridModule, PageService } from '@syncfusion/ej2-angular-grids';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService } from '../../../../../../core/services/translationService/translation.service';
import { EmployeeRequestsService } from '../../../../../../services/employeeRequestsService/employee-requests.service';

@Component({
  selector: 'app-employee-requests',
  standalone: true,
  imports: [GridModule, RouterLink, CommonModule, FormsModule, PaginationModule, TranslateModule],
  providers: [PageService],
  templateUrl: './employee-requests.component.html',
  styleUrls: ['./employee-requests.component.css']
})
export class EmployeeRequestsComponent implements OnInit {
  public data: any[] = [];
  public currentPage: number = 1;
  public itemsPerPage: number = 10;
  public totalRecordsCount: number = 0;
  currentLang: string = 'ar';
  accountStatus: number | string = 'all';

  constructor(
    private translationService: TranslationService,
    private employeeRequestsService: EmployeeRequestsService,
    @Inject(DOCUMENT) private document: Document
  ) {
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    const requestData = {
      sortIsAsc: true,
      accountStatus: this.accountStatus === 'all' ? null : this.accountStatus,
      pageIndex: this.currentPage,
      pageSize: this.itemsPerPage
    };
    this.employeeRequestsService.getEmployees(requestData).subscribe(
      (response) => {
        this.data = response.list;
        this.totalRecordsCount = response.totalRows;
      },
      (error) => {
        console.error('Error fetching employee data:', error);
      }
    );
  }

  pageChanged(event: any): void {
    this.currentPage = event.page;
    this.fetchData();
  }

  onStatusChange(event: any): void {
    this.accountStatus = event.target.value;
    this.currentPage = 1;
    this.fetchData();
  }

  getAccountStatusLabel(status: number): string {
    switch (status) {
      case 1:
        return this.translationService.translate('active');
      case 2:
        return this.translationService.translate('pending');
      case 3:
        return this.translationService.translate('rejected');
      default:
        return this.translationService.translate('unknown');
    }
  }
}
