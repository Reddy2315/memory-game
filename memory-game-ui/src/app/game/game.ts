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
import { Level, Card } from './game.model';
import { TutorialComponent } from './tutorial/tutorial';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule,
    MatToolbarModule, MatGridListModule, MatProgressBarModule, MatIconModule, TutorialComponent
  ],
  templateUrl: './game.html',
  styleUrls: ['./game.scss']
})
export class GameComponent implements OnInit {

  // --- game state ---
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
  levelComplete = false;
  showTutorial = true;
  userInteracted = false;

  private soundTimers: number[] = [];

  // --- audio objects (ensure file names match exactly in src/assets/sounds) ---
  flipSound = new Audio('assets/sounds/flipSound.mp3');
  matchSound = new Audio('assets/sounds/matchSound.mp3');
  levelUpSound = new Audio('assets/sounds/levelUpSound.mp3');
  gameOverSound = new Audio('assets/sounds/gameOverSound.mp3');

  // long sequence audios (fixed durations implicit by file lengths / spec)
  levelStartSound = new Audio('assets/sounds/levelStartSound.mp3'); // you said 39s file
  continueSound = new Audio('assets/sounds/continueSound.mp3');     // you said 32s file (we will loop it)
  countdownSound = new Audio('assets/sounds/countDownSound.mp3');
  ngOnInit() {
    [this.flipSound, this.matchSound, this.levelUpSound, this.gameOverSound,
    this.levelStartSound, this.continueSound, this.countdownSound]
      .forEach(a => { try { a.preload = 'auto'; a.load(); a.volume = 0.8; } catch { } });
  }

  onFinishTutorial() { this.showTutorial = false; this.startGame(); }
  onSkipTutorial() { this.showTutorial = false; this.startGame(); }

  exitGame() {
    if (confirm('Are you sure you want to exit the game?')) window.location.href = '/login';
  }

  private safePlay(audio: HTMLAudioElement) {
    audio.play().catch(() => { });
  }

  private clearSoundTimers() {
    this.soundTimers.forEach(id => clearTimeout(id));
    this.soundTimers = [];
  }

  stopLevelSounds() {
    this.clearSoundTimers();
    [this.levelStartSound, this.continueSound, this.countdownSound].forEach(a => {
      try { a.pause(); a.currentTime = 0; a.loop = false; } catch { }
    });
  }

  /**
   * Sound scheme:
   * - 0–39s → levelStartSound
   * - 39s → (time-10s) → continueSound loop
   * - last 10s → countdownSound
   */
  startLevelSounds(levelTime: number) {
    this.stopLevelSounds();
    if (!this.userInteracted || this.gameOver) return;

    const LEVEL_START_FIXED = 39; // fixed
    const COUNTDOWN_FIXED = 10;

    if (levelTime <= LEVEL_START_FIXED + COUNTDOWN_FIXED) {
      this.safePlay(this.countdownSound);
      return;
    }

    const middleTime = levelTime - (LEVEL_START_FIXED + COUNTDOWN_FIXED);

    // Step 1: play level start
    this.levelStartSound.currentTime = 0;
    this.safePlay(this.levelStartSound);

    const t1 = window.setTimeout(() => {
      // Stop level start before moving on
      this.levelStartSound.pause();
      this.levelStartSound.currentTime = 0;

      // Step 2: play continue (loop)
      this.continueSound.currentTime = 0;
      this.continueSound.loop = true;
      this.safePlay(this.continueSound);

      const t2 = window.setTimeout(() => {
        // Stop continue before countdown
        this.continueSound.pause();
        this.continueSound.currentTime = 0;
        this.continueSound.loop = false;

        // Step 3: play countdown
        this.countdownSound.currentTime = 0;
        this.safePlay(this.countdownSound);

      }, middleTime * 1000);
      this.soundTimers.push(t2);

    }, LEVEL_START_FIXED * 1000);
    this.soundTimers.push(t1);
  }

  // ---------- game logic ----------
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
    if (this.userInteracted) this.startLevelSounds(this.level.time);
  }

  startGame() {
    this.userInteracted = true;
    this.gameStarted = true;
    this.gameOver = false;
    this.moves = 0;
    this.score = 0;
    this.currentLevel = 1;
    this.setLevel(this.currentLevel);
  }

  flipCard(card: Card) {
    if (this.lockBoard || card.flipped || card.matched) return;
    card.flipped = true;
    this.flippedCards.push(card);
    if (this.userInteracted) this.safePlay(this.flipSound);
    if (this.flippedCards.length === 2) {
      this.moves++;
      this.checkMatch();
    }
  }

  checkMatch() {
    const [first, second] = this.flippedCards;
    if (!first || !second) return;
    if (first.value === second.value) {
      first.matched = second.matched = true;
      this.flippedCards = [];
      this.score += 10;
      if (this.userInteracted) this.safePlay(this.matchSound);
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
    this.stopLevelSounds();
    this.currentLevel++;
    if (this.currentLevel > 4) {
      this.endGame();
    } else {
      this.levelComplete = true;
      if (this.userInteracted) this.safePlay(this.levelUpSound);
    }
  }

  continueLevel() {
    this.levelComplete = false;
    this.setLevel(this.currentLevel);
  }

  endGame() {
    clearInterval(this.timer);
    this.stopLevelSounds();
    this.gameOver = true;
    this.gameStarted = false;
    if (this.userInteracted) this.safePlay(this.gameOverSound);
  }

  restart() { this.startGame(); }

  generateCards() {
    const values = ['🍎', '🍌', '🍇', '🍊', '🍉', '🥑', '🍓', '🍍', '🥝', '🍒', '🥥', '🍋'].slice(0, this.level.pairs);
    this.cards = [...values, ...values]
      .map((value, index) => ({ id: index, value, flipped: false, matched: false }))
      .sort(() => Math.random() - 0.5);
  }

  gridCols(): number {
    const width = window.innerWidth;
    if (width <= 600) return Math.min(this.level.pairs, 3);
    if (this.level.pairs <= 6) return 3;
    if (this.level.pairs <= 8) return 4;
    if (this.level.pairs <= 10) return 5;
    return 6;
  }
}
