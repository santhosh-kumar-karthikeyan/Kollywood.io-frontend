import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GameService } from '../services/GameSockets/socket.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CanComponentDeactivate } from '../guards/can-deactivate.guard';

@Component({
  selector: 'app-game',
  standalone: false,
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements OnInit,OnDestroy,CanComponentDeactivate {
  roomCode: string | null = null;
  movieNameInitial: string = '';
  heroNameInitial: string = '';
  heroineNameInitial: string = '';
  songNameInitial: string = '';
  activeField: string = 'movieName'; // Default active field
  activeIndex: number = 0; // Index of the active field
  inputValue: string = ''; // Value entered in the input field
  myRemaining: number = 0;
  oppRemaining: number = 0;

  constructor(private route: ActivatedRoute, private gameService: GameService) {}
  ngOnDestroy(): void {
    
  }

  ngOnInit(): void {
    this.roomCode = this.route.snapshot.paramMap.get('roomCode');
    console.log("RoomCode: "+this.roomCode);
    if (this.roomCode) {
      this.fetchMovieClue(this.roomCode);
    }
  }

  fetchMovieClue(roomCode: string): void {
    this.gameService.getMovieClue(roomCode).subscribe((clue) => {
      console.log("Clue" + clue);
      this.movieNameInitial = clue.movieNameInitial;
      this.heroNameInitial = clue.heroNameInitial;
      this.heroineNameInitial = clue.heroineNameInitial;
      this.songNameInitial = clue.songNameInitial;
    });
  }

  setActiveField(field: string, index: number): void {
    this.activeField = field;
    this.activeIndex = index;
    this.inputValue = ''; 
  }

  submitGuess(): void {
    if (!this.inputValue) {
      console.error('Input value is empty');
      return;
    }

    this.gameService.submitGuess(this.roomCode!, {
      index: this.activeIndex,
      value: this.inputValue,
      playerName: this.gameService.playerName
    }).subscribe(
      (response) => {
        console.log('Guess response:', response);
        this.myRemaining = response.myRemaining;
        this.oppRemaining = response.oppRemaining;

        if (response.won) {
          alert('You won!');
        } else if (response.lost) {
          alert('You lost!');
        } else if (response.correctness) {
          alert('Correct guess!');
        } else {
          alert('Incorrect guess!');
        }
      }
    );
  }
  canDeactivate() : boolean | Promise<boolean> | Observable<boolean> {
      const confirmation = window.confirm("You are in the middle of matchmaking. Do you really want to quit now?");
      if(confirmation) {
        this.gameService.invalidateRoom(this.gameService.roomCode, this.gameService.playerName).subscribe(response => {
          console.log(`${response.oppName} won`);
        });
      }
      return confirmation;
  }
}