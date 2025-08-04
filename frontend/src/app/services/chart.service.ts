import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  private baseUrl = `${environment.apiUrl}/graph`;

  constructor(private http: HttpClient) {}

  get(data:any) : Observable<any>{
    return this.http.get(`${this.baseUrl}/${data}Graph`)
  }
}
