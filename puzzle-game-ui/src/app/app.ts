import { Component, signal } from '@angular/core';
import { RouterOutlet ,Router} from '@angular/router';
import { AuthService } from './auth/auth.service';
import { MatToolbar } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatToolbar, MatIconModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent {

  protected readonly title = signal('puzzle-game-ui');
    year = new Date().getFullYear();

  constructor(public auth: AuthService, private router: Router) {}

  get isAuthenticated() {
    return this.auth.isAuthenticatedSignal();
  }

  register() {
    this.router.navigate(['/register']);
  }

  login() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/dashboard']);
  }

  profile() {
    if(this.isAuthenticated)
    this.router.navigate(['/profile']);
  }
}
