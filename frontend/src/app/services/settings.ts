import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // 👈 Import HttpHeaders
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private apiUrl = 'http://localhost:5000/api/settings';

  private settingsSubject = new BehaviorSubject<any>(null);
  public settings$ = this.settingsSubject.asObservable();

  constructor(private http: HttpClient) { }

  // 👇 Helper to attach the token
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  getSettings(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getAuthHeaders() }).pipe( // 👈 Added headers
      tap(data => this.settingsSubject.next(data)) 
    );
  }

  updateSettings(data: any): Observable<any> {
    return this.http.put(this.apiUrl, data, { headers: this.getAuthHeaders() }).pipe( // 👈 Added headers
      tap(updatedData => this.settingsSubject.next(updatedData)) 
    );
  } 

  uploadLogo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('logo', file); 
    return this.http.post(`${this.apiUrl}/upload-logo`, formData, { headers: this.getAuthHeaders() }); // 👈 Added headers
  } 

  saveUserPermissions(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/user-permissions`, data, { headers: this.getAuthHeaders() }); // 👈 Added headers
  }
}