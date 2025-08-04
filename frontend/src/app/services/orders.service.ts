import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getOrders(page:number,payload:string): Observable<any> {
    return this.http.get(`${this.baseUrl}/order/getAll?page=${page}&search=${payload}`);
  }
  editOrders(id:number,data:any):Observable<any>{
    return this.http.put(`${this.baseUrl}/order/update/${id}`,data)
  }
}
