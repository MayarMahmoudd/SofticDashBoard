import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environment/environment';
@Injectable({
  providedIn: 'root'
})
export class EmployeeRequestsService {

  constructor(private http: HttpClient) {}
  getEmployees(requestData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(
      `${environment.apiBaseUrl}Employee/Get`,
      JSON.stringify(requestData),
      { headers }
    ).pipe(
      map((response) => response),
      catchError((error) => throwError(() => new Error('Failed to fetch employee data: ' + error.message)))
    );
  }
  editAccountStatus(id: string, accountStatus: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    const requestBody = {
      id: id,
      accountStatus: accountStatus
    };
    return this.http.post<any>(
      `${environment.apiBaseUrl}Employee/EditAccountStatus`,
      JSON.stringify(requestBody),
      { headers }
    ).pipe(
      map(response => response),
      catchError(error => throwError(() => new Error('Failed to edit account status: ' + error.message)))
    );
  }
}
