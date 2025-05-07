import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, CanDeactivate } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { GameService } from '../services/GameSockets/socket.service';
import { AuthenticationService } from '../services/Authentication/authentication.service';
import { CanComponentDeactivate } from '../guards/can-deactivate.guard';

@Component({
  selector: 'app-game',
  standalone: false,
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy,CanComponentDeactivate {
  roomCode: string | null = null;
  activeField: string = 'movieName';
  activeIndex: number = 0;
  inputValue: string = '';
  myRemaining: number = 9;
  oppRemaining: number = 9;
  myFound: number = 0;
  oppFound: number = 0;
  gameStatus: 'win' | 'lose' | 'tie' | null = null;
  showModal: boolean = false;
  modalMessage: string = '';
  isGuessWrong: boolean = false;
  clues: { field: string; value: string; found: boolean }[] = [
    { field: 'movieName', value: '', found: false },
    { field: 'heroName', value: '', found: false },
    { field: 'heroineName', value: '', found: false },
    { field: 'songName', value: '', found: false }
  ];
  guesses: string[] = ['', '', '', '']; // Store player's guesses for each clue
  private subscriptions: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private auth: AuthenticationService
  ) {}
  canDeactivate() : boolean | Promise<boolean> | Observable<boolean> {
    return window.confirm("You are in the middle of matchmaking. Do you really want to quit now?");
  }

  ngOnInit(): void {
    this.roomCode = this.route.snapshot.paramMap.get('roomCode');
    if (this.roomCode) {
      this.fetchMovieClue(this.roomCode, this.auth.getUsername());
    }

    const gameStatusSub = this.gameService.listenToGameStatus().subscribe((gameStatus) => {
      const playerStatus = gameStatus[this.auth.getUsername()];
      const opponentStatus = gameStatus[this.getOpponentName(gameStatus)];

      this.myRemaining = playerStatus.remainingGuesses;
      this.oppRemaining = opponentStatus.remainingGuesses;
      this.myFound = playerStatus.found;
      this.oppFound = opponentStatus.found;

      if (playerStatus.won) {
        this.gameStatus = 'win';
        this.showModal = true;
        this.modalMessage = '🎉 You Won! 🎉';
      } else if (playerStatus.lost) {
        this.gameStatus = 'lose';
        this.showModal = true;
        this.modalMessage = '😢 You Lost! 😢';
      } else if (this.myRemaining === 0 && this.oppRemaining === 0) {
        this.gameStatus = 'tie';
        this.showModal = true;
        this.modalMessage = '🤝 It\'s a Tie! 🤝';
      }
    });

    this.subscriptions.add(gameStatusSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  fetchMovieClue(roomCode: string, playerName: string): void {
    this.gameService.getMovieClue(roomCode, playerName).subscribe({
      next: (clue) => {
        this.clues[0].value = clue[0];
        this.clues[1].value = clue[1];
        this.clues[2].value = clue[2];
        this.clues[3].value = clue[3];
      },
      error: (err) => {
        console.error('Error fetching movie clues:', err);
      }
    });
  }

  setActiveField(field: string, index: number): void {
    this.activeField = field;
    this.activeIndex = index;
    this.inputValue = this.clues[index].found ? this.guesses[index] : ''; // Show stored guess if found
    this.isGuessWrong = false; // Reset wrong guess indicator
  }

  submitGuess(): void {
    if (!this.inputValue) {
      console.error('Input value is empty');
      return;
    }

    this.guesses[this.activeIndex] = this.inputValue; // Store the guess
    this.gameService.submitGuess(this.roomCode!, {
      index: this.activeIndex,
      value: this.inputValue
    }).subscribe({
      next: (response) => {
        if (response.correctness) {
          this.clues[this.activeIndex].found = true;
          this.isGuessWrong = false; // Correct guess
        } else {
          this.isGuessWrong = true; // Wrong guess
        }
      },
      error: (err) => {
        console.error('Error submitting guess:', err);
      }
    });
  }

  getRemainingGuessesDisplay(remaining: number): string[] {
    const word = 'KOLLYWOOD';
    return word.split('');
  }

  getOpponentName(gameStatus: any): string {
    const usernames = Object.keys(gameStatus);
    return usernames.find((name) => name !== this.auth.getUsername()) || 'Opponent';
  }

  closeModal(): void {
    this.showModal = false;
  }
}