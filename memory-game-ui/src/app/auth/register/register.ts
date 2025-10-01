import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.html'
})
export class RegisterComponent {
  username = '';
  password = '';
  message = '';

  constructor(private authService: AuthService) {}

  register() {
    this.authService.register(this.username, this.password).subscribe({
      next: (res: any) => this.message = res.message,
      error: () => this.message = 'Registration failed!'
    });
  }
}
