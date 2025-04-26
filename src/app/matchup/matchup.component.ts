import { Component } from '@angular/core';

@Component({
  selector: 'app-matchup',
  standalone: false,
  templateUrl: './matchup.component.html',
  styleUrl: './matchup.component.css'
})
export class MatchupComponent {
  statusMessage: string;
  constructor() {
    this.statusMessage = "Searching for players...";
  }
  
}
