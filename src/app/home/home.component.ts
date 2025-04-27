import { Component, OnInit } from '@angular/core';
import { GameService } from '../services/GameSockets/socket.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/Authentication/authentication.service';
import { PlayerService } from '../services/Player/player.service';
@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  showLoginModal: boolean;
  remainingSeconds: number;
  countdownInterval: any;
  constructor(private auth: AuthenticationService, private socket: GameService, private router: Router) {
    this.showLoginModal = false;
    this.remainingSeconds = 5;
    // this.countdownInterval = setInterval
  }
  ngOnInit(): void {
  }

  startGame() {
    if(!this.auth.isLoggedIn()) {
      console.log("Not logged in");
      this.showLoginModal = true;
      this.startRedirectionCountdown();
      return;
    }
    const token = localStorage.getItem('jwt');
    const payload: string | undefined = token?.split('.')[1];
    const player = payload ? atob(payload) : null ;
    if(player) {
      console.log(player);
      const playerName = JSON.parse(player).username;
      this.socket.findRoomToJoin(response => {
        console.log("Checking for available games...");
        if(response.roomCode) {
          console.log("An existing room found...");
          this.socket.joinRoom(playerName,response.roomCode, joinResponse => {
            console.log("Join response: "+joinResponse);
            if(joinResponse.roomCode) {
              this.socket.playerType = "second";
              this.router.navigate(['game', joinResponse.roomCode]);
            }
          });
        }
        else {
          console.log("No room found.");
          console.log("Creating a room...");
          this.socket.createRoom(playerName, createResponse => {
            if(createResponse.roomCode) {
              this.socket.playerType = "first"
              this.router.navigate(['game',createResponse.roomCode]);
            }
          });
        }
      });
    }
  }
  navigateToLogin(): void {
    this.showLoginModal = true;
    this.router.navigate(['/login']);
  }
  startRedirectionCountdown(): void {
    this.remainingSeconds = 5;
    this.countdownInterval = setInterval(() => {
      this.remainingSeconds--;
      if(this.remainingSeconds <= 0) {
        clearInterval(this.countdownInterval);
        this.navigateToLogin();
      }
    },1000);
  }
  closeModal(): void {
    this.showLoginModal = false;
    clearInterval(this.countdownInterval);
  }
}
