import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private baseUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  getUserDetails(): Observable<any> {
    return this.http.get(`${this.baseUrl}/usersdetails`);
  }
  getCategoryDetails(): Observable<any> {
    return this.http.get(`${this.baseUrl}/categoriesDetails`);
  }
  getOrderDetails(): Observable<any> {
    return this.http.get(`${this.baseUrl}/ordersDetails`);
  }
  getProductDetails(): Observable<any> {
    return this.http.get(`${this.baseUrl}/productsDetails`);
  }
}
