import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private socket: Socket | null;
  private backendUrl : string;
  private _playerType: string ;
  constructor(private http: HttpClient) {
    this.backendUrl = "http://localhost:8080";
    this.socket = null;
    this._playerType = "first";
   }
   private initializeSocket(): void {
    if(!this.socket) {
      this.socket = io(this.backendUrl);
      console.log("New socket created: " + this.socket);
    }
   }
   createRoom(playerName: string, callback : (response: any) => void) : void {
    this.initializeSocket();
    this.playerType = "first";
    this.socket?.emit("createRoom",{playerName}, callback);
   }
   joinRoom(playerName: string, roomCode: string, callback: (response: any) => void) : void {
    this.initializeSocket();
    this.playerType = "second";
    this.socket?.emit("joinRoom", {playerName, roomCode},callback);
   }
   findRoomToJoin(callback: (response: any) => void) {
    return this.http.get<{roomCode: string}>(this.backendUrl+"/game/getRoomCode").subscribe(response => {
      callback(response);
    });
   }
   set playerType(type: string) {
    this._playerType = type;
   }
   get playerType(): string {
    return this._playerType;
   }
}

