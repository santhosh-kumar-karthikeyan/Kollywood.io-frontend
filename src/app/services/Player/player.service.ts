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
  backendUrl: string = 'http://localhost:8080';
  constructor(private http: HttpClient, private auth: AuthenticationService) { }
  getUserDetails(username: string):Observable<any> {
    return this.http.get<{_id: String, username: String, email: String, role: String, totalScore: Number, createdAt: Date, updatedAt: Date, __v: Number}>(`${this.backendUrl}/user/getUser?username=${username}`);
  }
  getUserHistory(username: string): Observable<any> {
    return this.http.get<[{player: string, playerScore: number, opponent: string, opponentScore: number, winner: string, time: number}]>(`${this.backendUrl}/game/getUserHistory?username=${username}`);
  }
}
