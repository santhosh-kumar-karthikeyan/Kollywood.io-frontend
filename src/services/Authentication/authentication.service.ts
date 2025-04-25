import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private baseUrl: string = "http://localhost:3000/";
  private authUrl: string = this.baseUrl + "auth/";
  private loginUrl: string = this.authUrl + "login/";
  private signUpUrl: string = this.authUrl + "signup/"


  constructor(private http: HttpClient) { }

  login(credentials : { username: string, password: string}) {
    return this.http.post<{token: string, message: string}>(this.loginUrl,credentials).pipe(
      tap(response => {
        localStorage.setItem('jwt',response.token);
      })
    );
  }

  signup(user: { username: string, email: string, domain: string, password: string}) : Observable<any> {
    return this.http.post<{token: string, message: string}>(this.signUpUrl,user).pipe(
      tap(response => {
        localStorage.setItem('jwt', response.token);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('jwt');
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
