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
import { MatDialog } from '@angular/material/dialog';
import { SettingsDialogComponent, SettingsData } from '../settings-dialog/settings-dialog';


/**
 * GameComponent is the main component for the memory game.
 * Handles game state, audio, settings, and level progression.
 */
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
  /** Array of all cards in the current level */
  cards: Card[] = [];
  /** Currently flipped cards */
  flippedCards: Card[] = [];
  /** Prevents card flipping when true */
  lockBoard = false;
  /** Current level configuration */
  level: Level = { pairs: 6, time: 60 };
  /** Current level number */
  currentLevel = 1;
  /** Player's score */
  score = 0;
  /** Number of moves made */
  moves = 0;
  /** Timer interval reference */
  timer: any = null;
  /** Time left in the current level (seconds) */
  timeLeft = this.level.time;
  /** Whether the game has started */
  gameStarted = false;
  /** Whether the game is over */
  gameOver = false;
  /** Whether the current level is complete */
  levelComplete = false;
  /** Whether to show the tutorial overlay */
  showTutorial = true;
  /** Whether the user has interacted (for audio unlock) */
  userInteracted = false;
  /** Whether sound is enabled */
  soundEnabled = true;
  /** Whether the game is paused */
  paused = false;
  /** Music volume (0.0–1.0) */
  musicVolume = 0.8;
  /** SFX volume (0.0–1.0) */
  sfxVolume = 0.8;

  // --- audio objects (file names must match files in public/assets/sounds/) ---
  /** Flip sound effect */
  flipSound = new Audio('assets/sounds/flipSound.mp3');
  /** Match sound effect */
  matchSound = new Audio('assets/sounds/matchSound.mp3');
  /** Level up sound effect */
  levelUpSound = new Audio('assets/sounds/levelUpSound.mp3');
  /** Game over sound effect */
  gameOverSound = new Audio('assets/sounds/gameOverSound.mp3');
  /** Level start music */
  levelStartSound = new Audio('assets/sounds/levelStartSound.mp3');
  /** Continue music (main background loop) */
  continueSound = new Audio('assets/sounds/continueSound.mp3');
  /** Countdown sound effect */
  countdownSound = new Audio('assets/sounds/countDownSound.mp3');

  // audio activity flags
  /** Whether level start music is active */
  private levelStartActive = false;
  /** Whether continue music is active */
  private continueActive = false;
  /** Whether countdown sound is active */
  private countdownActive = false;

  /**
   * @param dialog Angular Material dialog service for settings
   */
  constructor(private dialog: MatDialog) { }

  // --- Music Volume Slider Binding ---
  /**
   * Gets the current music slider value.
   */
  get musicSliderValue(): number {
    // Always reflect the actual volume of the main music track
    return this.continueSound ? this.continueSound.volume : this.musicVolume;
  }
  /**
   * Sets the music slider value and updates settings.
   */
  set musicSliderValue(value: number) {
    this.musicVolume = value;
    this.applySettings();        // update all volumes
    this.updatePlayingAudioVolume(); // force update currently playing audio
  }

  // --- SFX Volume Slider Binding ---
  /**
   * Gets the current SFX slider value.
   */
  get sfxSliderValue(): number {
    // Return the volume of a representative SFX track
    return this.flipSound ? this.flipSound.volume : this.sfxVolume;
  }
  /**
   * Sets the SFX slider value and updates settings.
   */
  set sfxSliderValue(value: number) {
    this.sfxVolume = value;
    this.applySettings();
    this.updatePlayingAudioVolume();
  }

  /**
   * Initializes audio, loads saved settings, and prepares the game.
   */
  ngOnInit() {
    // ✅ load saved sound preference
    const saved = localStorage.getItem('gameSettings');
    if (saved) {
      const s: SettingsData = JSON.parse(saved);
      this.soundEnabled = s.soundEnabled;
      this.musicVolume = s.musicVolume;
      this.sfxVolume = s.sfxVolume;
    }
    // preload & basic setup
    const audios = [
      this.flipSound, this.matchSound, this.levelUpSound, this.gameOverSound,
      this.levelStartSound, this.continueSound, this.countdownSound
    ];
    audios.forEach(a => {
      try {
        a.preload = 'auto';
        a.load();
        a.loop = false;
        a.muted = !this.soundEnabled; // ✅ respect saved setting
      } catch { /* ignore */ }
    });
    this.musicVolume = Math.min(1, Math.max(0, this.musicVolume));
    this.sfxVolume = Math.min(1, Math.max(0, this.sfxVolume));
    this.applySettings();
    // continueSound is intended to be loopable when active
    this.continueSound.loop = true;
  }

  // ---------- SETTINGS ----------
  /**
   * Applies the current sound and music settings to all audio elements.
   */
  applySettings() {
    const sfx = [this.flipSound, this.matchSound, this.levelUpSound, this.gameOverSound, this.countdownSound];
    const music = [this.continueSound, this.levelStartSound];

    // Apply SFX volume
    sfx.forEach(a => {
      a.muted = !this.soundEnabled;
      a.volume = this.sfxVolume;
    });

    // Apply music volume
    music.forEach(a => {
      a.muted = !this.soundEnabled;
      a.volume = this.musicVolume;
    });

    // ✅ If audio is already playing, force it to adopt the new volume immediately
    [...sfx, ...music].forEach(a => {
      if (!a.paused) {
        a.volume = this.isMusicAudio(a) ? this.musicVolume : this.sfxVolume;
      }
    });
  }

  /**
   * Determines if the given audio element is a music track.
   * @param a Audio element
   * @returns True if music, false if SFX
   */
  private isMusicAudio(a: HTMLAudioElement): boolean {
    return a === this.continueSound || a === this.levelStartSound;
  }

  // ---------- Open settings----------
  /**
   * Opens the settings dialog for sound and music preferences.
   */
  openSettings() {
    const dialogRef = this.dialog.open(SettingsDialogComponent, {
      width: '350px',
      data: {
        soundEnabled: this.soundEnabled,
        musicVolume: this.musicVolume,
        sfxVolume: this.sfxVolume,
        // live change callback for real-time updates
        onLiveChange: (partial: Partial<SettingsData>) => {
          // apply incoming partial values to current state
          if (typeof partial.soundEnabled === 'boolean') this.soundEnabled = partial.soundEnabled;
          if (typeof partial.musicVolume === 'number') this.musicVolume = partial.musicVolume;
          if (typeof partial.sfxVolume === 'number') this.sfxVolume = partial.sfxVolume;

          // persist the live state so reloads reflect current sliders immediately
          localStorage.setItem('gameSettings', JSON.stringify({
            soundEnabled: this.soundEnabled,
            musicVolume: this.musicVolume,
            sfxVolume: this.sfxVolume
          }));

          // apply volumes/mute immediately (real-time)
          this.applySettings();
          // Also update currently playing audio to new volume
          this.updatePlayingAudioVolume();
        }
      }
    });

    // Keep your existing Save behavior
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.soundEnabled = result.soundEnabled;
        this.musicVolume = result.musicVolume;
        this.sfxVolume = result.sfxVolume;
        localStorage.setItem('gameSettings', JSON.stringify(result));
        this.applySettings();
      }
    });
  }

  /**
   * Updates the volume and mute state of currently playing audio.
   */
  private updatePlayingAudioVolume() {
    const allAudio = [
      this.flipSound, this.matchSound, this.levelUpSound, this.gameOverSound,
      this.levelStartSound, this.continueSound, this.countdownSound
    ];

    allAudio.forEach(a => {
      if (!a.paused) {
        a.volume = this.isMusicAudio(a) ? this.musicVolume : this.sfxVolume;
        a.muted = !this.soundEnabled;
      }
    });
  }


  // ---------- tutorial callbacks ----------
  /**
   * Callback for finishing the tutorial.
   */
  onFinishTutorial() { this.showTutorial = false; this.startGame(); }
  /**
   * Callback for skipping the tutorial.
   */
  onSkipTutorial() { this.showTutorial = false; this.startGame(); }

  /**
   * Exits the game and navigates to the login page.
   */
  exitGame() {
    if (confirm('Are you sure you want to exit the game?')) window.location.href = '/login';
  }

  /**
   * Toggles sound on/off and saves the preference.
   */
  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    localStorage.setItem('soundEnabled', String(this.soundEnabled));
    const audios = [
      this.flipSound, this.matchSound, this.levelUpSound, this.gameOverSound,
      this.levelStartSound, this.continueSound, this.countdownSound
    ];
    audios.forEach(a => {
      a.muted = !this.soundEnabled;
    });
  }

  // ---------- safe audio helper ----------
  /**
   * Safely plays an audio element, respecting user interaction and sound settings.
   * @param a Audio element to play
   */
  private safePlay(a: HTMLAudioElement) {
    if (!this.userInteracted || !this.soundEnabled) return; // browsers require gesture

    // enforce current volume and mute status before play
    a.volume = this.isMusicAudio(a) ? this.musicVolume : this.sfxVolume;
    a.muted = !this.soundEnabled;

    // play returns a promise in modern browsers
    a.play().catch(() => { /* ignore play errors (autoplay blocked) */ });
  }

  /**
   * Pauses all audio without resetting their currentTime.
   */
  private pauseAllButDoNotReset() {
    // used on pause: just pause everything (do not reset currentTime)
    [
      this.levelStartSound, this.continueSound, this.countdownSound,
      this.flipSound, this.matchSound, this.levelUpSound, this.gameOverSound
    ].forEach(a => {
      try { a.pause(); } catch { }
    });
  }

  /**
   * Sound scheme:
   * - 0–39s → levelStartSound
   * - 39s → (time-10s) → continueSound loop
   * - last 10s → countdownSound
   * Stops and resets all audio, used at end of level or game.
   */
  private stopAndResetAll() {
    // fully stop and reset audio (used on end/level end)
    [
      this.levelStartSound, this.continueSound, this.countdownSound,
      this.flipSound, this.matchSound, this.levelUpSound, this.gameOverSound
    ].forEach(a => {
      try { a.pause(); a.currentTime = 0; a.loop = false; } catch { }
    });
    // ensure continue sound stays loop=false until next time explicitly needed
    this.continueSound.loop = true;
    this.levelStartActive = false;
    this.continueActive = false;
    this.countdownActive = false;
  }

  /**
   * Stops all audio except the target, optionally resetting others.
   * @param target Audio element to keep playing
   * @param resetOthers Whether to reset currentTime of other audio
   */
  private stopOtherAudioExcept(target: HTMLAudioElement | null, resetOthers = true) {
    const all = [
      this.levelStartSound, this.continueSound, this.countdownSound,
      this.flipSound, this.matchSound, this.levelUpSound, this.gameOverSound
    ];
    all.forEach(a => {
      if (a === target) return;
      try {
        a.pause();
        if (resetOthers) a.currentTime = 0;
        a.loop = false;
      } catch { }
    });
  }

  // ---------- audio-phase manager (called every tick) ----------
  /**
   * Manages which audio should be playing based on the current game phase and time.
   */
  private manageAudioByTime() {
    if (!this.userInteracted || this.gameOver || this.levelComplete || this.paused) {
      // when paused or not interacting, do not start audio
      return;
    }

    const LEVEL_START_FIXED = 39; // seconds
    const COUNTDOWN_FIXED = 10; // seconds
    const total = this.level.time;
    const elapsed = total - this.timeLeft;

    // countdown zone (last COUNTDOWN_FIXED seconds)
    if (this.timeLeft <= COUNTDOWN_FIXED) {
      if (!this.countdownActive) {
        // switch to countdown (reset it)
        this.stopOtherAudioExcept(this.countdownSound, true);
        this.countdownSound.loop = false;
        this.countdownSound.currentTime = 0;
        this.safePlay(this.countdownSound);
        this.countdownActive = true;
        this.levelStartActive = false;
        this.continueActive = false;
      } else {
        // ensure it's playing if paused unexpectedly
        if (this.countdownSound.paused && !this.paused) this.safePlay(this.countdownSound);
      }
      return;
    }

    // stage: levelStart
    if (elapsed < LEVEL_START_FIXED) {
      if (!this.levelStartActive) {
        // start or resume levelStartSound (do not forcibly reset currentTime so resume works)
        this.stopOtherAudioExcept(this.levelStartSound, true);
        this.levelStartSound.loop = false;
        // do not reset levelStartSound.currentTime here so resume picks up where left off
        this.safePlay(this.levelStartSound);
        this.levelStartActive = true;
        this.continueActive = false;
        this.countdownActive = false;
      } else {
        // if it was active but got paused by OS, try to resume
        if (this.levelStartSound.paused && !this.paused) this.safePlay(this.levelStartSound);
      }
      return;
    }

    // middle stage: continueSound
    // (elapsed >= LEVEL_START_FIXED && timeLeft > COUNTDOWN_FIXED)
    if (!this.continueActive) {
      // switch to looping continue sound, reset continue to start
      this.stopOtherAudioExcept(this.continueSound, true);
      this.continueSound.loop = true;
      this.continueSound.currentTime = 0;
      this.safePlay(this.continueSound);
      this.continueActive = true;
      this.levelStartActive = false;
      this.countdownActive = false;
    } else {
      if (this.continueSound.paused && !this.paused) this.safePlay(this.continueSound);
    }
  }

  // ---------- pause / resume ----------
  /**
   * Pauses the game and all audio.
   */
  pauseGame() {
    if (!this.gameStarted || this.gameOver || this.levelComplete || this.paused) return;
    this.paused = true;
    clearInterval(this.timer);
    this.timer = null;
    // pause all audio but retain currentTime (so resume continues)
    this.pauseAllButDoNotReset();
  }

  /**
   * Resumes the game and audio from pause.
   */
  resumeGame() {
    if (!this.paused) return;
    this.paused = false;
    // immediately set audio according to current timeLeft
    this.manageAudioByTime();
    // restart timer
    this.startTimer();
  }

  // ---------- game control ----------
  /**
   * Starts a new game from level 1.
   */
  startGame() {
    this.userInteracted = true;
    this.paused = false;
    this.gameStarted = true;
    this.gameOver = false;
    this.moves = 0;
    this.score = 0;
    this.currentLevel = 1;
    this.setLevel(this.currentLevel);
  }

  /**
   * Restarts the game from the beginning.
   */
  restart() {
    this.stopAndResetAll();
    this.startGame();
  }

  /**
   * Sets up the specified level, generates cards, and starts the timer.
   * @param levelNumber Level number to set
   */
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
    // immediately start audio according to current phase (if user interacted)
    this.manageAudioByTime();
  }

  /**
   * Handles card flip logic and triggers match checking.
   * @param card Card to flip
   */
  flipCard(card: Card) {
    if (this.lockBoard || card.flipped || card.matched || this.paused) return;
    card.flipped = true;
    this.flippedCards.push(card);
    if (this.userInteracted) this.safePlay(this.flipSound);
    if (this.flippedCards.length === 2) {
      this.moves++;
      this.checkMatch();
    }
  }

  /**
   * Checks if the two flipped cards match and updates state accordingly.
   */
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

  /**
   * Starts the countdown timer for the current level.
   */
  startTimer() {
    // ensure only one timer
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
    // call manageAudioByTime immediately so audio starts at beginning of level
    this.manageAudioByTime();
    this.timer = window.setInterval(() => {
      if (this.paused) return;
      this.timeLeft--;
      // check audio phases based on new timeLeft
      this.manageAudioByTime();
      if (this.timeLeft <= 0) this.endGame();
    }, 1000);
  }

  /**
   * Advances to the next level or ends the game if last level is completed.
   */
  nextLevel() {
    clearInterval(this.timer);
    this.stopAndResetAll(); // reset audio state
    this.currentLevel++;
    if (this.currentLevel > 4) {
      this.endGame();
    } else {
      this.levelComplete = true;
      if (this.userInteracted) this.safePlay(this.levelUpSound);
    }
  }

  /**
   * Continues to the next level after completion.
   */
  continueLevel() {
    this.levelComplete = false;
    this.setLevel(this.currentLevel);
  }

  /**
   * Ends the game and shows the game over screen.
   */
  endGame() {
    clearInterval(this.timer);
    this.stopAndResetAll();
    this.gameOver = true;
    this.gameStarted = false;
    if (this.userInteracted) this.safePlay(this.gameOverSound);
  }

  /**
   * Generates a shuffled set of cards for the current level.
   */
  generateCards() {
    const values = ['🍎', '🍌', '🍇', '🍊', '🍉', '🥑', '🍓', '🍍', '🥝', '🍒', '🥥', '🍋'].slice(0, this.level.pairs);
    this.cards = [...values, ...values]
      .map((value, index) => ({ id: index, value, flipped: false, matched: false }))
      .sort(() => Math.random() - 0.5);
  }

  /**
   * Determines the number of columns for the card grid based on screen size and level.
   * @returns Number of columns
   */
  gridCols(): number {
    const width = window.innerWidth;
    if (width <= 600) return Math.min(this.level.pairs, 3);
    if (this.level.pairs <= 6) return 3;
    if (this.level.pairs <= 8) return 4;
    if (this.level.pairs <= 10) return 5;
    return 6;
  }
}
