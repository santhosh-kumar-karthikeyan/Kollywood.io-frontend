import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Kollywood.io';
  navItems = [
    { text: 'Leaderboard', link: 'http://localhost:5000/leaderboard' },
    { text: 'How To Play?', link: 'http://localhost:5000/rules' },
    { text: 'Contact', link: 'http://localhost:5000/tac' }
  ];

  profileOptions = [
    { text: 'Login', link: 'login.html' },
    { text: 'Sign Up', link: 'http://localhost:5000/signUp' },
    { text: 'Logout', link: '#' }
  ];
}
