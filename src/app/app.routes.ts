import { Routes } from '@angular/router';
import { HomeComponent } from './core-component/dashboard/home/home.component';
import { DashboardLayoutComponent } from './core-component/layouts/dashboard-layout/dashboard-layout.component';
import { AuthLayoutComponent } from './core-component/layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './core-component/authentication/login/login.component';
import { ResetPasswordComponent } from './core-component/authentication/reset-password/reset-password.component';
import { ForgetPasswordComponent } from './core-component/authentication/forget-password/forget-password.component';
import { IndexComponent } from './core-component/dashboard/company/index/index.component';
import { AddCompanyComponent } from './core-component/dashboard/company/add-company/add-company.component';
import { AddAdminComponent } from './core-component/dashboard/company/add-admin/add-admin.component';
import { GeneralLookupsComponent } from './core-component/dashboard/setting/general-lookups/general-lookups.component';
import { SubscriptionPlanManagmentComponent } from './core-component/dashboard/setting/Lockups/subscription-plan-managment/subscription-plan-managment.component';
import { LocationManagmentComponent } from './core-component/dashboard/setting/Lockups/location-managment/location-managment.component';
import { ProfileComponent } from './core-component/dashboard/profile/index/profile.component';
import { EditProfileComponent } from './core-component/dashboard/profile/edit-profile/edit-profile.component';
import { CompanyDetailsComponent } from './core-component/dashboard/company/company-details/company-details.component';
import { ProfileDetailsComponent } from './core-component/dashboard/company/components/profile-details/profile-details.component';
import { AddPositionComponent } from './core-component/dashboard/company/components/position/add-position/add-position.component';
import { DepartmentDetailsComponent } from './core-component/dashboard/company/components/department/department-details/department-details.component';
import { AddDepartmentComponent } from './core-component/dashboard/company/components/department/add-department/add-department.component';
import { DepartmentOverviewComponent } from './core-component/dashboard/company/components/department/department-overview/department-overview.component';
import { PositionTypeManagmentComponent } from './core-component/dashboard/setting/Lockups/position-type-managment/position-type-managment.component';
import { DepartmentManagmentComponent } from './core-component/dashboard/setting/Lockups/department-managment/department-managment.component';
import { BranchManagmentComponent } from './core-component/dashboard/setting/Lockups/branch-managment/branch-managment.component';
import { ViewEmployeesComponent } from './core-component/dashboard/employee/view-employees/view-employees.component';
import { AddEmployeeComponent } from './core-component/dashboard/employee/add-employee/add-employee.component';
import { OrganizationChartsComponent } from './core-component/dashboard/organization-charts/organization-charts.component';
import { AuthGuard } from './core/guard/auth.guard';
import { EmployeeDetailsComponent } from './core-component/dashboard/employee/employee-details/employee-details.component';
import { NoPermissionComponent } from './common-component/no-permission/no-permission.component';
import { ngxPermissionsGuard } from 'ngx-permissions';
import { SalaryTypeComponent } from './core-component/dashboard/setting/Lockups/salary-type/salary-type.component';
import { ComplaintsSuggestionsComponent } from './core-component/dashboard/complaints-suggestions/complaints-suggestions.component';
import { ComplainSuggestionDetailsComponent } from './core-component/dashboard/complaints-suggestions/complain-suggestion-details/complain-suggestion-details.component';
 
export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: '', component: LoginComponent },
      { path: 'ResetPassword', component: ResetPasswordComponent },
      { path: 'forgetPassword', component: ForgetPasswordComponent },
    ],
  }, {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'indexCompany', component: IndexComponent },
      { path: 'addCompany', component: AddCompanyComponent },
      { path: 'add-admin', component: AddAdminComponent },
      { path: 'generalLookups', component: GeneralLookupsComponent  ,canActivate: [ngxPermissionsGuard], data: { permissions: { only: ["Admin","SuperAdmin"], redirectTo: 'no-permission' }}},
      { path: 'SubscriptionPlan', component: SubscriptionPlanManagmentComponent },
      { path: 'addressManagement', component: LocationManagmentComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'EditProfile', component: EditProfileComponent },
      { path: 'company/:companyId', component: CompanyDetailsComponent },
      { path: 'ProfileDetails', component: ProfileDetailsComponent },
      { path: 'AddPosition', component: AddPositionComponent },
      { path: 'DepartmentDetails', component: DepartmentDetailsComponent },
      { path: 'AddDepartment', component: AddDepartmentComponent },
      { path: 'DepartmentOverview', component: DepartmentOverviewComponent  },
      { path: 'PositionTypeManagment', component: PositionTypeManagmentComponent  },
      { path: 'salary-type', component: SalaryTypeComponent  },
      { path: 'departmentManagment', component: DepartmentManagmentComponent  },
      { path: 'branchManagment', component: BranchManagmentComponent  },
      { path: 'ViewEmployees', component: ViewEmployeesComponent ,canActivate: [ngxPermissionsGuard], data: { permissions: { only: ["Admin","SuperAdmin"], redirectTo: 'no-permission' }}},
      { path: 'AddEmployee', component: AddEmployeeComponent  },
      { path: 'OrganizationCharts', component: OrganizationChartsComponent  },
      { path: 'ComplaintsSuggestions', component: ComplaintsSuggestionsComponent  },
      { path: 'ComplainSuggestionDetails/:id', component: ComplainSuggestionDetailsComponent },
      { path: 'employee-details/:id', component: EmployeeDetailsComponent },
        ],
  },{
    path: 'no-permission',
    component: NoPermissionComponent, pathMatch: 'full',
  },
];
