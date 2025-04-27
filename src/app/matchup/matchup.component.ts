import { Component, OnInit } from '@angular/core';
import { GameService } from '../services/GameSockets/socket.service';

@Component({
  selector: 'app-matchup',
  standalone: false,
  templateUrl: './matchup.component.html',
  styleUrl: './matchup.component.css'
})
export class MatchupComponent implements OnInit{
  statusMessage: string;
  constructor(private gameService: GameService) {
    this.statusMessage = "";
  }
  ngOnInit(): void {
    if(this.gameService.playerType === "first")
      this.statusMessage = "Searching for players...";
    else
      this.statusMessage = "Joining a room...";
  }
  
}
