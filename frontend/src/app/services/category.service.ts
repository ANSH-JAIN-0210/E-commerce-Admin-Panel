import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private baseUrl = `${environment.apiUrl}/category`;

  constructor(private http: HttpClient) {}

  getCategories(page:number,data:string): Observable<any> {
    return this.http.get(`${this.baseUrl}/get?page=${page}&search=${data}`);
  }
  deleteCategory(id:number):Observable<any>{
    return this.http.delete(`${this.baseUrl}/delete/${id}`)
  }
  addCategory(data : any):Observable<any>{
    return this.http.post(`${this.baseUrl}/create`,data)
  }
  editCategory(id:number,data:any):Observable<any>{
    return this.http.put(`${this.baseUrl}/update/${id}`,data)
  }
  fetchCategoryList():Observable<any>{
    return this.http.get(`${this.baseUrl}/getList`)
  }
}
