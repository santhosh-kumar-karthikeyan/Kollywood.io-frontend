import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { GameService } from '../services/GameSockets/socket.service';
import { CanComponentDeactivate } from '../guards/can-deactivate.guard';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/Authentication/authentication.service';

@Component({
  selector: 'app-matchup',
  standalone: false,
  templateUrl: './matchup.component.html',
  styleUrl: './matchup.component.css'
})
export class MatchupComponent implements OnInit, CanComponentDeactivate{
  statusMessage: string;
  isMatchMaking : boolean = true;
  constructor(private socket: GameService,private router: Router,private auth: AuthenticationService) {
    this.statusMessage = "";
  }
  ngOnInit(): void {
    this.startMatchmaking();
    this.listenForStartGame();
  }
  @HostListener('window:beforeunload', ['$event'])
  handleBeforeUnload(event: BeforeUnloadEvent):void {
    if(this.isMatchMaking) {
      event.preventDefault();
    }
  }
  getRoomCode() {
    return this.socket.roomCode;
  }
  private startMatchmaking(): void {
    const playerName = this.auth.getUsername();
    if(playerName) {
      console.log(playerName);
      console.log("Room code: " + this.socket.roomCode);
      if(this.socket.roomCode) {
        this.socket.joinRoom(playerName,this.socket.roomCode, joinResponse => {
          if(joinResponse.success) {
            this.socket.playerType = 'second';
            this.router.navigate(["matchup"]);
          }
        })
      }
      else {
        console.log("Entered else");
        this.socket.findRoomToJoin(response => {
          console.log("Checking for available games...");
          if(response.roomCode) {
            console.log("An existing room found...");
            this.socket.joinRoom(playerName,response.roomCode, joinResponse => {
              console.log("Join response: "+joinResponse.success + joinResponse.roomCode);
              if(joinResponse.success) {
                this.socket.playerType = "second";
                this.socket.roomCode = joinResponse.roomCode;
                this.router.navigate(["matchup"]);
              }
            });
          }
          else {
            console.log("No room found.");
            console.log("Creating a room...");
            this.socket.createRoom(playerName, createResponse => {
              if(createResponse.roomCode) {
                this.socket.playerType = "first";
                this.socket.roomCode = createResponse.roomCode;
                console.log("Navigating to the newly created room..."+createResponse.roomCode);
                this.router.navigate(['matchup']);
              }
            });
          }
        });
      }
    }
  }
  private listenForStartGame(): void {
    this.socket.onStartGame().subscribe((data) => {
      console.log('Game started:', data);
      this.socket.playerName = this.auth.getUsername();
      this.socket.roomCode = (data.roomCode);
      this.socket.opponentName = data.players.filter(playerName => playerName !== this.socket.playerName)[0];
      this.router.navigate([`/game/${data.roomCode}`]);
    });
  }
  canDeactivate() : boolean | Promise<boolean> | Observable<boolean> {
    if(this.isMatchMaking) {
      return window.confirm("You are in the middle of matchmaking. Do you really want to quit now?");
    }
    return true;
  }

}
