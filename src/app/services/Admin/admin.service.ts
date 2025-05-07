import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../Authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl: string = "https://backend-kollywood-io.onrender.com/";
  // private apiUrl = 'http://localhost:8080/user/getUsers'; // Adjust to your backend URL

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService
  ) {}

  getUsers(): Observable<any> {
    const token = this.auth.getToken(); // Assumed method to get JWT token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(this.apiUrl, { headers });
  }
}