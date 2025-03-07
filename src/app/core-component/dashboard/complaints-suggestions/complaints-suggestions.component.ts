import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { LocalStorageService } from '../../../services/local-storage-service/local-storage.service';
import { CompliantsAndSuggestionsService } from '../../../services/ComplaintsSuggestionsService/compliants-and-suggestions.service';
import { IssueService } from '../../../services/issueService/issue.service';
import { Complaint, ComplaintStatus } from '../../../../models/complain';
import { RouterLink, Router } from '@angular/router';
import { IssueExcuterService } from '../../../services/IssueExcuter/issue-excuter.service';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import { issueStatus } from '../../../core/enums/IssueStatus';
import { EnumToStringPipe } from '../../../core/pipes/enum-to-string.pipe';

@Component({
  selector: 'app-complaints-suggestions',
  standalone: true,
  templateUrl: './complaints-suggestions.component.html',
  styleUrls: ['./complaints-suggestions.component.css'],
  imports: [TranslateModule, CommonModule, FormsModule, RouterLink, PaginationModule,EnumToStringPipe]
})
export class ComplaintsSuggestionsComponent {
  activeTab: string = 'complaints';
  issueTypeId: number = 1;
  issueStatus=issueStatus;
  complaints: (Complaint & { againstTypeName?: string })[] = [];
  filteredComplaints: (Complaint & { againstTypeName?: string })[] = [];
  selectedStatus: ComplaintStatus = ComplaintStatus.PENDING;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalComplaints: number = 0;
  public ComplaintStatus = ComplaintStatus;
  userImageUrl: string | null = null;
  userFirstName: string | null = null;
  userSecondName: string | null = null;
  userPosition: string | null = null;
  showDeletePopup: boolean = false;
  deleteId: number | null = null;
  againstTypeOptions: { id: number, name: string }[] = [];
  @Output() confirm = new EventEmitter<boolean>();
  loading: boolean = false;
  complaintDetails: any = null;
  constructor(
    private translate: TranslateService,
    private router: Router,
    private IssueExcuter: IssueExcuterService,
    private localStorageService: LocalStorageService,
    private complaintsService: CompliantsAndSuggestionsService,
    private IssueService:IssueService

  ) { }


  ngOnInit(): void {
    this.loadAllAgainstType();
    this.loadComplaints();
  }
  selectTab(tab: string): void {
    this.activeTab = tab;
    this.issueTypeId = tab === 'complaints' ? 1 : 2;
    this.loadComplaints();
  }



  loadComplaints(page: number = this.currentPage): void {
    this.loading = true;
    const companyId = Number(this.localStorageService.getItem('companyId'));
    const employeeId = Number(this.localStorageService.getItem('userId'));

    if (companyId && employeeId) {
      const params = {
        companyId,
        issueTypeId: this.issueTypeId,
        pageIndex: page,
        pageSize: this.itemsPerPage,
      };

      this.IssueExcuter.getIssueExcuter(params).subscribe({
        next: (response: any) => {
          this.loading = false;
          console.log("responsءشءشءششe", response)

          if (response?.data?.list) {
            console.log("compiantsadqdsss", response?.data?.list)
            console.log("response.data.list",response.data.list)
            this.complaints = response.data.list.map((item: any) => ({
              ...item,
              againstTypeName: this.matchAgainstTypeName(item.issue.againestTypeId),
            }));

            

            console.log("compiantssss", this.complaints)

            this.filteredComplaints = this.complaints;
            this.totalComplaints = response.data.totalRows || 0;
          }
        },
        error: (error) => {
          this.loading = false;
          console.error('Error fetching complaints/suggestions:', error);
        },
      });
    }
  }



  deleteComplaint(id: number, event: Event): void {
    event.stopPropagation();
    this.deleteId = id;
    this.showDeletePopup = true;

    if (this.activeTab === 'complaints') {
      console.log(`Deleting complaint with ID: ${id}`);
    } else if (this.activeTab === 'suggestions') {
      console.log(`Deleting suggestion with ID: ${id}`);
    }
  }


  onPopupConfirm(confirm: boolean): void {
    this.showDeletePopup = false;
    if (confirm && this.deleteId !== null) {
      const companyId = Number(this.localStorageService.getItem('companyId'));
      this.IssueExcuter.deleteIssueExcuter(this.deleteId, companyId).subscribe({
        next: () => {
          this.complaints = this.complaints.filter(complaint => complaint.id !== this.deleteId);
        },
      });
      this.deleteId = null;
    }
  }

  navigateToDetails(complaintId: number): void {
    //Change status first time to opened
    //1-Get the complaints or suggetion

    //2-check for status
      this.IssueExcuter.getIssueExcuterById(complaintId).subscribe({
        next: (response) => {
        console.log("my response data",complaintId)
         // if (response.data?.list[0].issue.issueStatusId == issueStatus.Submitted) {
            //3-Change status
            let ecucterId=response.data?.list[0].id;
           console.log("ExecuterId",ecucterId)
            this.IssueExcuter.performActionOnIssueExcuter(ecucterId, issueStatus.Opened).subscribe({
              next:data=>console.log(data)
            });
        //  }
          this.loading = false;
          console.log('Complaint details loaded:', this.complaintDetails);
        },
        error: (error) => {
          this.loading = false;
          console.error('Error fetching complaint details:', error);
        }
      });

    
    this.router.navigate(['/dashboard/ComplainSuggestionDetails', complaintId]);
  }

  handlePageChange(event: { page: number }): void {
    this.currentPage = event.page;
    this.loadComplaints(this.currentPage);
  }

  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = '../../../assets/images/default.jpeg';
  }

  getComplaintStatusName(issueStatusId: number): string {
    switch (issueStatusId) {
      case 1:
        return this.translate.instant('status.submitted');
      case 2:
        return this.translate.instant('status.opened');
      case 3:
        return this.translate.instant('status.in_progress');
      case 4:
        return this.translate.instant('status.closed');
      default:
        return this.translate.instant('status.unknown');
    }
  }



  loadAllAgainstType(): void {
    this.complaintsService.getAllAgainesType().subscribe({
      next: (response) => {
        this.againstTypeOptions = response.data.list || [];
      },
      error: (error) => console.error('Error loading against types:', error)
    });
  }

  matchAgainstTypeName(againstTypeId: number): string {
    const matchedType = this.againstTypeOptions.find(option => option.id === againstTypeId);
    return matchedType ? matchedType.name : 'Unknown';
  }

  getStatusStyles(status: number) {
    switch (status) {
      case issueStatus.Submitted:
        return 'badge-submitted';  // Blue
      case issueStatus.Opened:
        return 'badge-opened';     // Green
      case issueStatus.InProgress:
        return 'badge-in-progress';// Yellow
      case issueStatus.Closed:
        return 'badge-closed';     // Red
      default:
        return '';
    }
  }

}
