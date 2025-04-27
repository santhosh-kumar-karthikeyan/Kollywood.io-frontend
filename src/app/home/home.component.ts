import { Component, OnInit } from '@angular/core';
import { GameService } from '../services/GameSockets/socket.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/Authentication/authentication.service';
@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  showLoginModal: boolean;
  constructor(private auth: AuthenticationService, private socket: GameService, private router: Router) {
    this.showLoginModal = false;
  }
  ngOnInit(): void {
  }

  startGame() {
    if(!this.auth.isLoggedIn()) {
      console.log("Not logged in");
      this.showLoginModal = true;
      // this.router.navigate(["/login"]);
      return;
    }
    const token = localStorage.getItem('jwt');
    const payload: string | undefined = token?.split('.')[1];
    const playerName = payload ? atob(payload) : null ;
    if(playerName) {
      this.socket.findRoomToJoin(response => {
        if(response.roomCode)
          this.socket.joinRoom(playerName,response.roomCode, joinResponse => {
            if(joinResponse.success)
              this.router.navigate(['game', response.roomCode]);
          });
        else 
          this.socket.createRoom(playerName, createResponse => {
            if(createResponse.roomCode)
              this.router.navigate(['game',createResponse.roomCode]);
          });
      });
    }
  }
  navigateToLogin(): void {
    this.showLoginModal = true;
    this.router.navigate(['/login']);
  }
  closeModal(): void {
    this.showLoginModal = false;
  }
}
