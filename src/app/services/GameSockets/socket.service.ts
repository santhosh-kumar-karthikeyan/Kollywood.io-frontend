import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private socket: Socket | null;
  private backendUrl : string;
  private _playerType: string ;
  private isGameStarted: boolean = false;
  private _playerName:string;
  private _opponentName: string;
  private _roomCode: string;
  constructor(private http: HttpClient) {
    this.backendUrl = "http://localhost:8080";
    this.socket = null;
    this._playerType = "first";
    this._playerName = "";
    this._opponentName = "";
    this._roomCode = "";
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
   onStartGame(): Observable<{ roomCode: string; players: string[] }> {
    this.initializeSocket();
    return new Observable((observer) => {
      this.socket?.on('startGame', (data: { roomCode: string; players: string[] }) => {
        console.log('startGame event received:', data);
        observer.next(data);
        this.isGameStarted = true;
      });
    });
  }
  //  getGuess(callback: (response: any) => void) {
  //   return this.http
  //  }
   set playerType(type: string) {
    this._playerType = type;
   }
   set playerName(name:string) {
    this._playerName = name;
   }
   set opponentName(name: string) {
    this._opponentName = name;
   }
   set roomCode(code: string) {
    this._roomCode = code;
   }
   get playerType(): string {
    return this._playerType;
   }
   get playerName(): string {
    return this._playerName;
   }
   get roomCode(): string {
    return this._roomCode;
   }
   isSocketConnected(): boolean {
    return !!this.socket;
   }
   disconnectSocket(): void {
    if(this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log("Socket connection closed");
    }
   }
   getMovie(): void {
    if(this.isGameStarted) {
      this.socket?.emit("getMovie", this.roomCode, (clue: any) => {
        console.log(clue);
      });
    }
   }
   clearState(): void {
    this._playerType = '';
    this._playerName = '';
    this._opponentName = '';
    this._roomCode = '';
    this.disconnectSocket();
    console.log('Game state cleared.');
  }
  getMovieClue(roomCode: string, playerName: string): Observable<any> {
    return new Observable((observer) => {
      this.socket?.emit('getMovie', { roomCode,playerName }, (clue: any) => {
        console.log("getMovie emitted for " + roomCode);
        observer.next(clue);
        console.log("clue acquired: " + clue);
        observer.complete();
      });
    });
  }

  submitGuess(roomCode: string, guess: { index: number; value: string; playerName: string }): Observable<any> {
    return new Observable((observer) => {
      this.socket?.emit('submitGuess', { roomCode, guess }, (response: any) => {
        observer.next(response);
        observer.complete();
      });
    });
  }
  invalidateRoom(roomCode: string, playerName: string) :Observable<any> {
    return new Observable((observer) => {
      this.socket?.emit('invalidateRoom', {roomCode, playerName}, (response: any) => {
        observer.next(response);
        observer.complete();
      });
    });
  }
  hasWon(roomCode: string, playerName: string) : Observable<any> {
    return new Observable((observer) => {
      this.socket?.emit("hasWon", { roomCode}, (response: any) => {
        observer.next(response);
        observer.complete();
      });
    });
  }
}

