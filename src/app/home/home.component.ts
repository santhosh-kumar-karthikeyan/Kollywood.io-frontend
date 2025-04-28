import { Component, OnDestroy, OnInit } from '@angular/core';
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
    this.router.navigate(['matchup'])
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
