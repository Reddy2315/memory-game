import { Injectable ,signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/auth';
  private tokenKey = 'jwt_token';

  // Add a signal for authentication state
  isAuthenticatedSignal = signal(this.isAuthenticated());

  constructor(private http: HttpClient) {}

  register(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, password });
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password }).pipe(
      tap((res: any) => {
        localStorage.setItem(this.tokenKey, res.accessToken);
        this.isAuthenticatedSignal.set(true);
      })
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticatedSignal.set(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
