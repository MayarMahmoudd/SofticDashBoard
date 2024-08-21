import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { ApiCall } from '../../core/services/http-service/HttpService';
import {
  Employee,
  EmployeeCertificate,
  EmployeeEducational,
  EmployeeLanguage,
  EmployeeSkill,
  EmployeeMedicalInfo,
  EmployeeCertificateTypes
} from '../../../models/employees.Model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private apiUrl = `${environment.apiBaseUrl}Employee`;

  constructor(private apiCall: ApiCall) { }

  loadEmployees(request: any): Observable<any> {
    return this.apiCall.request('POST', `${this.apiUrl}/Get`, request);
  }

  addEmployee(request: any): Observable<any> {
    return this.apiCall.request('POST', `${this.apiUrl}/Add`, request);
  }

  assignEmployeeToPosition(request: any): Observable<any> {
    return this.apiCall.request('POST', `${this.apiUrl}/AssignPosition`, request);
  }

  assignEmployeeToDepartment(request: any): Observable<any> {
    return this.apiCall.request('POST', `${this.apiUrl}/AssignDepartment`, request);
  }

  assignEmployeeToBranch(request: any): Observable<any> {
    return this.apiCall.request('POST', `${this.apiUrl}/AssignBranch`, request);
  }

  editPersonalInformation(employeeData: Employee): Observable<any> {
    return this.apiCall.request('POST', `${environment.apiBaseUrl}Users/EditPersonalInformation`, employeeData);
  }

  addEmployeeCertificate(employeeCertificate: EmployeeCertificate): Observable<any> {
    return this.apiCall.request('POST', `${environment.apiBaseUrl}EmployeeCertificate/Add`, employeeCertificate);
  }

  addEmployeeEducational(employeeEducational: EmployeeEducational): Observable<any> {
    return this.apiCall.request('POST', `${environment.apiBaseUrl}EmployeeEducational/Add`, employeeEducational);
  }

  addEmployeeLanguage(employeeLanguage: EmployeeLanguage): Observable<any> {
    return this.apiCall.request('POST', `${environment.apiBaseUrl}EmployeeLanguage/Add`, employeeLanguage);
  }

  addEmployeeSkill(employeeSkill: EmployeeSkill): Observable<any> {
    return this.apiCall.request('POST', `${environment.apiBaseUrl}EmployeeSkill/Add`, employeeSkill);
  }

  addEmployeeHealthInformation(employeeMedicalInfo: EmployeeMedicalInfo): Observable<any> {
    return this.apiCall.request('POST', `${environment.apiBaseUrl}EmployeeHealthInformation/Add`, employeeMedicalInfo);
  }

  // Get Functions
  getEmployeePersonalInfo(requestData: any): Observable<any[]> {
    return this.apiCall.request('POST', `${environment.apiBaseUrl}Users/GetPersonalInformation`, requestData);
  }

  getBusinessSizeDetails(requestData: any): Observable<any> {
    return this.apiCall.request('POST', `${environment.apiBaseUrl}BusinessSize/Get`, requestData);
  }

  getBusinessTypes(requestData: any): Observable<any> {
    return this.apiCall.request('POST', `${environment.apiBaseUrl}BusinessType/Get`, requestData);
  }

  getCertificateTypes(requestData: any = {}): Observable<any> {
    return this.apiCall.request('POST', `${environment.apiBaseUrl}CertificateType/Get`, requestData);
  }

  addCertificateType(certificateData: EmployeeCertificateTypes): Observable<any> {
    return this.apiCall.request('POST', `${environment.apiBaseUrl}CertificateType/Add`, certificateData);
  }

  editCertificateType(certificateData: EmployeeCertificateTypes): Observable<any> {
    return this.apiCall.request('POST', `${environment.apiBaseUrl}CertificateType/Edit`, certificateData);
  }

  deleteCertificateType(id: number): Observable<any> {
    return this.apiCall.request('POST', `${environment.apiBaseUrl}CertificateType/Delete/${id}`, null);
  }

  getDepartment(requestData: any): Observable<any> {
    return this.apiCall.request('POST', `${environment.apiBaseUrl}Department/Get`, requestData);
  }

  getEmployeeEducational(requestData: any): Observable<any> {
    return this.apiCall.request('POST', `${environment.apiBaseUrl}EmployeeEducational/Get`, requestData);
  }

  getEmployeeHealthInformation(requestData: any): Observable<any> {
    return this.apiCall.request('POST', `${environment.apiBaseUrl}EmployeeHealthInformation/Get`, requestData);
  }

  getEmployeeCertificate(requestData: any): Observable<any> {
    return this.apiCall.request('POST', `${environment.apiBaseUrl}EmployeeCertificate/Get`, requestData);
  }

  // Update Functions
  editEmployeeHealthInformation(employeeMedicalInfo: EmployeeMedicalInfo): Observable<any> {
    return this.apiCall.request('POST', `${environment.apiBaseUrl}EmployeeHealthInformation/Edit`, employeeMedicalInfo);
  }

  editEmployeeEducational(employeeEducational: EmployeeEducational): Observable<any> {
    return this.apiCall.request('POST', `${environment.apiBaseUrl}EmployeeEducational/Edit`, employeeEducational);
  }

  editEmployeeCertificate(workExperience: EmployeeCertificate[]): Observable<any> {
    return this.apiCall.request('POST', `${environment.apiBaseUrl}EmployeeCertificate/SaveRange`, workExperience);
  }

  getEmployee(requestData: any): Observable<Employee> {
    return this.apiCall.request('POST', `${environment.apiBaseUrl}Employee/Get`, requestData);
  }

  getCity(requestData: any): Observable<any> {
    return this.apiCall.request('POST', `${environment.apiBaseUrl}City/Get`, requestData);
  }

  getCountry(requestData: any = {}): Observable<any> {
    return this.apiCall.request('POST', `${environment.apiBaseUrl}Country/Get`, requestData);
  }

  getZone(requestData: any = {}): Observable<any> {
    return this.apiCall.request('POST', `${environment.apiBaseUrl}Zone/Get`, requestData);
  }
}
