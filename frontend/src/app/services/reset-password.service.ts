import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  sendForgotPasswordOtp(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/forgot-password`, { email });
  }

  resetPassword(data: { email: string; otp: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset-password`, data);
  }
}
