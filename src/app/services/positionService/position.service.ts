import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { ApiCall } from '../apiCall/apicall.service';
import { HttpHeaders } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PositionService {

  private PositionUrl = `${environment.apiBaseUrl}Position`;

  constructor(private apiCall: ApiCall) {}

  getPosition(request: any = {}): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.PositionUrl}/Get`, 'post', request, headers);
  }

  addPosition(position: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log('Position data being sent:', position);  // Add this log
    return this.apiCall.request<any>(`${this.PositionUrl}/Add`, 'post', position, headers)
      .pipe(
        catchError(this.handleError)
      );
  }

  editPosition(position: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.PositionUrl}/Edit`, 'post', position, headers);
  }

  deletePosition(id: number, companyId: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.apiCall.request<any>(`${this.PositionUrl}/Delete/${id}/${companyId}`, 'post', {}, headers);
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(error);
  }
}
