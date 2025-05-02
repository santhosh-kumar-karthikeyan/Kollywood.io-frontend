import { Component, Input, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/Authentication/authentication.service';
import { PlayerService } from '../services/Player/player.service';
import { ActivatedRoute } from '@angular/router';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
TimeAgo.addDefaultLocale(en);
const timeAgo = new TimeAgo('en-US');


@Component({
  selector: 'profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})

export class ProfileComponent implements OnInit {
  username: string = '';
  email: string = '';
  joined: string = '';
  joinedDate: Date = new Date();
  backendUrl : string = 'http://localhost:8080';
  showChangePasswordModal: boolean = false;
  oldPassword: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';
  history: [{player: string, playerScore: number, opponent: string, opponentScore: number, winner: string, time: Date}] = [{player: '', playerScore: 0, opponent: '', opponentScore: 0, winner: '', time: new Date()}];
  userDetails = {
    _id: '', username: '', email: '', role: '', totalScore: 0, createdAt: new Date(), updatedAt: new Date(), __v: 0
  }
  constructor(private auth: AuthenticationService, protected playerService: PlayerService, private route : ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.username = params.get('username') || 'Unknown';
    });
    this.getUserDetails(this.username);
    console.log("Username: " + this.username);
    console.log("Joined: "+this.joined);
    this.getMatchHistory(this.username);
  }

  openChangePasswordModal(): void {
    this.showChangePasswordModal = true;
  }

  closeChangePasswordModal(): void {
    this.showChangePasswordModal = false;
  }

  configTimeAgo() {

  }

  changePassword(): void {
    if (this.newPassword !== this.confirmNewPassword) {
      alert('New password and confirmation do not match!');
      return;
    }
    console.log('Old Password:', this.oldPassword);
    console.log('New Password:', this.newPassword);
    this.closeChangePasswordModal();
  }
  getUserDetails(username: string): void {
    this.playerService.getUserDetails(username).subscribe((data) => { 
      this.username = data.username;
      this.email = data.email;
      this.joinedDate = new Date(data.createdAt);
      this.joined = timeAgo.format(this.joinedDate);
    });
  }
  getMatchHistory(username: string): void {
    this.playerService.getUserHistory(username).subscribe((data) => this.history = data);
  }
}
