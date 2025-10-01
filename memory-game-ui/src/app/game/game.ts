import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { Level } from './game.model';
import { Card } from './game.model';
import { TutorialComponent } from './tutorial/tutorial';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule,
    MatToolbarModule, MatGridListModule, MatProgressBarModule, MatIconModule, TutorialComponent],
  templateUrl: './game.html',
  styleUrls: ['./game.scss']
})
export class GameComponent implements OnInit {

  cards: Card[] = [];
  flippedCards: Card[] = [];
  lockBoard = false;
  level: Level = { pairs: 6, time: 60 };
  currentLevel = 1;
  score = 0;
  moves = 0;
  timer: any;
  timeLeft = this.level.time;
  gameStarted = false;
  gameOver = false;

  showTutorial = true;

  ngOnInit() { }

  onFinishTutorial() {
    this.showTutorial = false;
    this.startGame();
  }

  onSkipTutorial() {
    this.showTutorial = false;
    this.startGame();
  }

  exitGame() {
    if (confirm('Are you sure you want to exit the game?')) {
      window.location.href = '/login';
    }
  }

  startGame() {
    this.gameStarted = true;
    this.gameOver = false;
    this.moves = 0;
    this.score = 0;
    this.currentLevel = 1;
    this.setLevel(this.currentLevel);
  }

  restart() {
    this.startGame();
  }

  setLevel(levelNumber: number) {
    const levels: Level[] = [
      { pairs: 6, time: 60 },
      { pairs: 8, time: 75 },
      { pairs: 10, time: 90 },
      { pairs: 12, time: 120 }
    ];
    this.level = levels[levelNumber - 1] || levels[levels.length - 1];
    this.timeLeft = this.level.time;
    this.generateCards();
    this.startTimer();
  }

  generateCards() {
    const values = ['🍎', '🍌', '🍇', '🍊', '🍉', '🥑', '🍓', '🍍', '🥝', '🍒', '🥥', '🍋'].slice(0, this.level.pairs);
    this.cards = [...values, ...values]
      .map((value, index) => ({ id: index, value, flipped: false, matched: false }))
      .sort(() => Math.random() - 0.5);
  }

  flipCard(card: Card) {
    if (this.lockBoard || card.flipped || card.matched) return;
    card.flipped = true;
    this.flippedCards.push(card);
    if (this.flippedCards.length === 2) {
      this.moves++;
      this.checkMatch();
    }
  }

  checkMatch() {
    const [first, second] = this.flippedCards;
    if (first.value === second.value) {
      first.matched = second.matched = true;
      this.flippedCards = [];
      this.score += 10;
      if (this.cards.every(c => c.matched)) this.nextLevel();
    } else {
      this.lockBoard = true;
      setTimeout(() => {
        first.flipped = second.flipped = false;
        this.flippedCards = [];
        this.lockBoard = false;
      }, 800);
    }
  }

  startTimer() {
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) this.endGame();
    }, 1000);
  }

  nextLevel() {
    clearInterval(this.timer);
    this.currentLevel++;
    if (this.currentLevel > 4) this.endGame();
    else this.setLevel(this.currentLevel);
  }

  gridCols(): number {
    // Increase columns with level
    if (this.level.pairs <= 6) return 3;
    if (this.level.pairs <= 8) return 4;
    if (this.level.pairs <= 10) return 5;
    return 6;
  }

  endGame() {
    clearInterval(this.timer);
    this.gameOver = true;
    this.gameStarted = false;
  }
}
