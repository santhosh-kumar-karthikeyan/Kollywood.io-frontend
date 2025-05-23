import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private baseUrl: string = "https://backend-kollywood-io.onrender.com/";
  // private baseUrl: string = "http://localhost:8080/";
  private authUrl: string = this.baseUrl + "auth/";
  private loginUrl: string = this.authUrl + "login/";
  private signUpUrl: string = this.authUrl + "signup/"
  private checkUsernameUrl: string = this.authUrl + "/checkUsername";
  public userNameValidity: boolean = false;
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
  checkUsername(username: string) : Observable<any> {
    this.checkUsernameUrl += `?username=${username}`;
    return this.http.get<{exists: boolean, message: string}>(this.checkUsernameUrl).pipe(
      tap((response) => {
        this.userNameValidity = !response.exists;
      })
    )
  }

  logout(): void {
    localStorage.removeItem('jwt');
  }

  getToken(): string | null {
    return localStorage.getItem('jwt');
  }
  getUsername(): string  {
    const token = localStorage.getItem('jwt');
    if(!token)
      return "";
    const payload = JSON.parse(atob(token.split('.')[1]));
    const username = payload.username;
    return username;
  }
  getEmail(): string {
    const token = localStorage.getItem('jwt');
    if(!token)
      return "";
    const payload = JSON.parse(atob(token.split('.')[1]));
    const email = payload.email;
    return email;
  }
  isLoggedIn(): boolean {
    const token = this.getToken();
    if(!token)
      return false;
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp > currentTime;
  }
  getRole(): string {
    const token = this.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || '';
    }
    return '';
  }
}
