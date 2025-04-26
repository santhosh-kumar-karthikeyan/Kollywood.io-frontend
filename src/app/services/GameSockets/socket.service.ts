import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private socket : Socket;
  private backendUrl : string;
  constructor(private http: HttpClient) {
    this.backendUrl = "http://localhost:8080";
    this.socket = io(this.backendUrl);
   }
   createRoom(playerName: string, callback : (response: any) => void) : void {
    this.socket.emit("createRoom",{playerName}, callback);
   }
   joinRoom(playerName: string, roomCode: string, callback: (response: any) => void) : void {
    this.socket.emit("joinRoom", {playerName, roomCode},callback);
   }
   findRoomToJoin(callback: (response: any) => void) {
    return this.http.get<{roomCode: string}>(this.backendUrl+"/game/getRoomCode").subscribe(response => {
      callback(response);
    });
   }
}

