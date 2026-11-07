import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs'; // <-- Import these

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private apiUrl = 'http://localhost:5000/api/settings';

  // 1. Create a "Live Stream" to hold the settings
  private settingsSubject = new BehaviorSubject<any>(null);
  public settings$ = this.settingsSubject.asObservable();

  constructor(private http: HttpClient) { }

  // Fetch settings
  getSettings(): Observable<any> {
    return this.http.get(this.apiUrl).pipe(
      // 2. When data arrives, push it into the live stream
      tap(data => this.settingsSubject.next(data)) 
    );
  }

  // Update settings
  updateSettings(data: any): Observable<any> {
    return this.http.put(this.apiUrl, data).pipe(
      // 3. When the update is successful, immediately push the new data to the live stream
      tap(updatedData => this.settingsSubject.next(updatedData)) 
    );
  } 

    // Add this to your existing service
  uploadLogo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('logo', file); // 'logo' must match upload.single('logo') in backend
    
    return this.http.post(`${this.apiUrl}/upload-logo`, formData);
  }
}