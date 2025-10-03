import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard {
  username = '';
  highScore = 0;
  gamesPlayed = 0;
  fastestTime = '--';
  greeting = '';

  constructor(
    private auth: AuthService, 
    private router: Router, 
    private location: Location 
  ) {
     this.greeting = this.getGreeting();
    // Example: get username from JWT or backend
    const token = this.auth.getToken();
    if (token) {
      this.username = this.decodeJwt(token)?.sub || '';
    }
    // Example: load stats from localStorage or backend
    this.highScore = Number(localStorage.getItem('highScore')) || 0;
    this.gamesPlayed = Number(localStorage.getItem('gamesPlayed')) || 0;
    this.fastestTime = localStorage.getItem('fastestTime') || '--';
  }

  getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 16) return 'Good afternoon';
  return 'Good evening';
  }

  back() {
    this.location.back();
  }

  game() {
    if (this.auth.isAuthenticatedSignal()){
    this.router.navigate(['/game']);
    } else {
      window.alert("Please login!...")
      this.router.navigate(['/login'])
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  decodeJwt(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }
}