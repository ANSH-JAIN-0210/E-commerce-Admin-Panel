import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getAdminProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/getAdmin/`);
  }
  editAdminProfile(data:{name:string,email:string}): Observable<any> {
    return this.http.put(`${this.baseUrl}/update`,data);
  }
}
