import { Component, OnDestroy, OnInit } from '@angular/core';
import { GameService } from '../services/GameSockets/socket.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/Authentication/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  roomCodeForm: FormGroup;
  constructor(protected auth: AuthenticationService, private socket: GameService, private router: Router, private fb: FormBuilder) {
    this.showLoginModal = false;
    this.remainingSeconds = 5;
    this.roomCodeForm = this.fb.group({
      roomCode: ['', Validators.required]
    });
  }
  ngOnInit(): void {
  }

  startGame() {
    if(!this.auth.isLoggedIn()) {
      console.log("Not logged in");
      this.showLoginModal = true;
      this.startRedirectionCountdown("matchup");
      return;
    }
    this.router.navigate(['matchup'])
  }
  joinRoom(): void {
    if(this.roomCodeForm.valid) {
      const roomCode = this.roomCodeForm.get('roomCode')?.value;
      console.log("Room code: " + roomCode);
      this.socket.roomCode = roomCode;
      this.router.navigate(['matchup']);
    }
  }
  navigateToLogin(dest: string): void {
    this.showLoginModal = true;
    this.router.navigate(['/login'], {queryParams: {redirectTo: dest}});
  }
  navigateToSignup(): void {
    this.router.navigate(['/signup']);
  }
  startRedirectionCountdown(dest: string): void {
    this.remainingSeconds = 5;
    this.countdownInterval = setInterval(() => {
      this.remainingSeconds--;
      if(this.remainingSeconds <= 0) {
        clearInterval(this.countdownInterval);
        this.navigateToLogin(dest);
      }
    },1000);
  }
  signOut(): void {
    this.auth.logout();
  }
  navigateToProfile(): void {
    this.router.navigate(['/profile/:username']);
  }
  closeModal(): void {
    this.showLoginModal = false;
    clearInterval(this.countdownInterval);
  }
}
