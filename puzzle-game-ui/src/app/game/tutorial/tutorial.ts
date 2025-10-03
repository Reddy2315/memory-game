import { Component, EventEmitter, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';

export interface TutorialStep {
  title: string
  description: string;
  emoji?: string;
}

@Component({
  selector: 'app-tutorial',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatProgressBarModule, MatIconModule],
  templateUrl: './tutorial.html',
  styleUrls: ['./tutorial.scss'],
  animations: [
    trigger('flip', [
      state('front', style({ transform: 'rotateY(0)' })),
      state('back', style({ transform: 'rotateY(180deg)' })),
      transition('front <=> back', animate('600ms ease-in-out')),
    ]),
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(50px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('400ms ease-in', style({ opacity: 0, transform: 'translateX(-50px)' }))
      ])
    ])
  ]
})
export class TutorialComponent {
 
  @Output() finishTutorial = new EventEmitter<void>();
  @Output() skipTutorial = new EventEmitter<void>();

  currentStepIndex = 0;

  demoFlipped = [false, false];
  demoInterval: any;

  steps: TutorialStep[] = [
    { title: 'Welcome to Memory Game!', description: 'Match all pairs of cards to win each level.', emoji: '🧠' },
    { title: 'Flipping Cards', description: 'Click on a card to flip it. Click another to find a match.', emoji: '🎴' },
    { title: 'Score & Moves', description: 'Fewer moves = higher score. Try to complete each level fast!', emoji: '⭐' },
    { title: 'Timer', description: 'Each level has a time limit. Complete it before the timer runs out!', emoji: '⏱️' },
    { title: 'Level Progression', description: 'Complete the current level to unlock the next. Difficulty increases.', emoji: '🚀' }
  ];

  ngOnInit() {
    this.checkDemoStep();
  }

  nextStep() {
    if (this.currentStepIndex < this.steps.length - 1) {
      this.currentStepIndex++;
      this.checkDemoStep();
    } else {
      this.finishTutorial.emit();
    }
  }

  previousStep() {
    if (this.currentStepIndex > 0) {
      this.currentStepIndex--;
      this.checkDemoStep();
    }
  }

  skip() {
    this.skipTutorial.emit();
  }

  get progress() {
    return ((this.currentStepIndex + 1) / this.steps.length) * 100;
  }

  checkDemoStep() {
    clearInterval(this.demoInterval);
    if (this.steps[this.currentStepIndex].title === 'Flipping Cards') {
      this.demoFlipped = [false, false];
      this.demoInterval = setInterval(() => {
        this.demoFlipped = this.demoFlipped.map(f => !f);
      }, 1500);
    } else {
      this.demoFlipped = [false, false];
    }
  }

  jumpToStep(index: number) {
    this.currentStepIndex = index;
    this.checkDemoStep();
  }
}
