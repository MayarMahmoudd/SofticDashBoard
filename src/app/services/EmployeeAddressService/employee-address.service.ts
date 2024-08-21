import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, throwError } from 'rxjs';
import { environment } from '../../environment/environment';
import { EmployeeAddress } from '../../../models/employees.Model';


@Injectable({
  providedIn: 'root',
})
export class EmployeeAddressService {
  constructor(private http: HttpClient) {}
  addEmployeeAddress(employeeAddress: EmployeeAddress): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http
      .post<any>(
        `${environment.apiBaseUrl}UserAddress/Add`,
        JSON.stringify(employeeAddress),
        { headers }
      )
      .pipe(
        map((response) => {
          if (response.status === 200) {
            return response.data;
          }
          return null;
        }),
      );
  }
  editEmployeeAddress(employeeAddress: EmployeeAddress): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http
      .post<any>(
        `${environment.apiBaseUrl}UserAddress/Edit`,
        JSON.stringify(employeeAddress),
        { headers }
      )
      .pipe(
        map((response) => {
          if (response.status === 200) {
            return response.data;
          }
          return null; // Or handle differently based on your application's needs
        }),
      );
  }
  getEmployeeAddress(requestData: any): Observable<any> {
    const token = localStorage.getItem('token'); // Retrieve the stored token
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http
      .post<any>(
        `${environment.apiBaseUrl}UserAddress/Get`,
        JSON.stringify(requestData),
        { headers }
      )
      .pipe(
        map((response) => {
          return response.data.list;
        }),
      );
  }
}
