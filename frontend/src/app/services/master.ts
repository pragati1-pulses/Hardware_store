import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MasterService {
  // This is the base URL for ALL your masters (units, customers, suppliers, etc.)
  private baseUrl = 'http://localhost:5000/api/masters';

  constructor(private http: HttpClient) { }

  // 1. Generic GET: Fetch all items (e.g., pass 'units' to get units, 'customers' to get customers)
  getAll<T>(endpoint: string): Observable<T[]> {
    return this.http.get<T[]>(`${this.baseUrl}/${endpoint}`);
  }

  // 2. Generic POST: Create a new item
  create<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, data);
  }

  // 3. Generic PUT: Update an existing item
  update<T>(endpoint: string, id: number, data: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}/${id}`, data);
  }

  // 4. Generic DELETE: Remove an item
  delete(endpoint: string, id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${endpoint}/${id}`);
  }
}