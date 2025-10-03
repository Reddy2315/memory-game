import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, ],
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss']
})
export class Profile {

  username: string | null = '';

  constructor(private auth: AuthService, private router: Router) {
    // You may want to fetch the username from a JWT or backend
    const token = this.auth.getToken();
    console.log("authToken :",token);
    if (token) {
      // Example: decode JWT to get username (implement decodeJwt if needed)
      this.username = this.decodeJwt(token)?.sub || '';
      console.log("username : ",this.username);
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  // Simple JWT decoder (for demo; use a library for production)
  decodeJwt(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }
}