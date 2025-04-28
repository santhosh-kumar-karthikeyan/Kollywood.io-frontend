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
    { text: 'Leaderboard', link: '#' },
    { text: 'How To Play?', link: '#' },
    { text: 'Contact', link: '#' }
  ];

  profileOptions = [
    { text: 'Login', link: '#' },
    { text: 'Sign Up', link: '#' },
    { text: 'Logout', link: '#' }
  ];
}
