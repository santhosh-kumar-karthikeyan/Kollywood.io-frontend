import { Injectable } from '@angular/core';
import { GameService } from '../GameSockets/socket.service';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../Authentication/authentication.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  playerType: string | null = null;
  constructor(private http: HttpClient, private auth: AuthenticationService) { }
  // getUserDetails():Observable<any> {
  //   return this.http.get<
  // }
}
