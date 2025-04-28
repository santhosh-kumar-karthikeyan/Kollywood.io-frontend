import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private baseUrl: string = "http://localhost:8080/";
  private authUrl: string = this.baseUrl + "auth/";
  private loginUrl: string = this.authUrl + "login/";
  private signUpUrl: string = this.authUrl + "signup/"

  constructor(private http: HttpClient) { }

  login(credentials : { username: string, password: string}) {
    return this.http.post<{token: string, message: string}>(this.loginUrl,credentials).pipe(
      tap(response => {
        console.log("New token recieved: " + response.token);
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
  getUsername(): string  {
    const token = localStorage.getItem('jwt');
    if(!token)
      return "";
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log(payload);
    const username = payload.username;
    console.log(username);
    return username;
  }
  isLoggedIn(): boolean {
    console.log(this.getToken());
    const token = this.getToken();
    if(!token)
      return false;
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    console.log("Token expired?: ", payload.exp <= currentTime);
    return payload.exp > currentTime;
  }
}
