import { Injectable } from '@angular/core';
import { GameService } from '../GameSockets/socket.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  playerType: string | null = null;
  constructor(private game: GameService) { }
  set setPlayerType(type: string) {
    this.playerType = type;
  }
  get getPlayerType() {
    return this.playerType;
  }
}
