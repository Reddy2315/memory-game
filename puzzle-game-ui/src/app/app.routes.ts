import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';
import { Game } from './game/game';
import { Profile } from './auth/profile/profile';
import { Dashboard } from './auth/dashboard/dashboard';
import { Logout } from './auth/logout/logout'

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'game', component: Game, canActivate: [authGuard]  },
  { path: 'profile', component: Profile, canActivate: [authGuard]  },
  { path: 'logout', component: Logout },
  { path: 'dashboard', component: Dashboard },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
