import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Card {
  id: number;
  value: string;
  flipped: boolean;
  matched: boolean;
}

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game.html',
  styleUrls: ['./game.scss']
})
export class GameComponent implements OnInit {
  cards: Card[] = [];
  flippedCards: Card[] = [];
  lockBoard = false;

  ngOnInit() {
    this.startGame();
  }

  startGame() {
    const values = ['🍎', '🍌', '🍇', '🍊', '🍉', '🥑'];
    this.cards = [...values, ...values]
      .map((value, index) => ({ id: index, value, flipped: false, matched: false }))
      .sort(() => Math.random() - 0.5);
  }

  flipCard(card: Card) {
    if (this.lockBoard || card.flipped || card.matched) return;

    card.flipped = true;
    this.flippedCards.push(card);

    if (this.flippedCards.length === 2) {
      this.checkMatch();
    }
  }

  checkMatch() {
    const [first, second] = this.flippedCards;
    if (first.value === second.value) {
      first.matched = second.matched = true;
      this.flippedCards = [];
    } else {
      this.lockBoard = true;
      setTimeout(() => {
        first.flipped = second.flipped = false;
        this.flippedCards = [];
        this.lockBoard = false;
      }, 1000);
    }
  }

  resetGame() {
    this.startGame();
  }
}
