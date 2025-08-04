import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/admin`; 
  constructor(private http: HttpClient) {}

  addUser(data: {name:string,email:string,password:string,gender:string,dob:string}): Observable<any> {
    return this.http.post(`${this.apiUrl}/addUser`, data);
  }
  deleteUser(id : number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteUser/${id}`);
  }
  editUserProfile(data:{_id:number,name:string,email:string,status:string,gender:string,dob:string}): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateUser`,data);
  }
  getUsers( page: number,payload:string): Observable<any> {
    return this.http.get(`${this.apiUrl}/getUsers?page=${page}&search=${payload}`);
  }
}
