import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProducts(page: number, search?: any): Observable<any> {
    let url = `${this.baseUrl}/product/get?page=${page}`;

    if (search) {
      const encodedSearch = encodeURIComponent(JSON.stringify(search));
      url += `&search=${encodedSearch}`;
    }

    return this.http.get(url);
  }

  getCategories(): Observable<any> {
    return this.http.get(`${this.baseUrl}/category/get?limit=1000`);
  }
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/product/delete/${id}`);
  }
  addProduct(data: any): Observable<any> {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('categoryName', data.categoryName);
    formData.append('price', data.price);
    formData.append('status', 'active');
    if (data.image instanceof File) {
      formData.append('image', data.image);
    }
    return this.http.post(`${this.baseUrl}/product/create`, formData);
  }
  editProduct(id: number, data: any): Observable<any> {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('categoryName', data.categoryName);
    formData.append('price', data.price);
    formData.append('status',  'active');
    if (data.image instanceof File) {
      formData.append('image', data.image);
    }
    return this.http.put(`${this.baseUrl}/product/update/${id}`, formData);
  }
}
