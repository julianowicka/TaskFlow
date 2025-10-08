import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { IconComponent } from '../../../shared/ui/icon/icon.component';
import { ThemeToggleComponent } from '../../../shared/ui/theme-toggle/theme-toggle.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent, IconComponent, ThemeToggleComponent],
  styleUrls: ['./header.component.scss'],
  template: `
    <header class="app-header">
      <div class="header-container">
        <div class="header-logo">
          <a routerLink="/">
            <span class="logo-text">TaskFlow</span>
          </a>
        </div>

        <nav class="header-nav">
          <ul class="nav-list">
            <li class="nav-item">
              <a routerLink="/boards" routerLinkActive="active">Boards</a>
            </li>
            <li class="nav-item">
              <a routerLink="/tasks" routerLinkActive="active">Tasks</a>
            </li>
          </ul>
        </nav>

        <div class="header-actions">
          <app-ui-theme-toggle></app-ui-theme-toggle>

          <ng-container *ngIf="authService.isAuthenticated(); else loginButton">
            <app-ui-button variant="text" [routerLink]="['/profile']" routerLinkActive="active">
              <app-ui-icon name="user"></app-ui-icon>
              Profile
            </app-ui-button>

            <app-ui-button variant="text" (buttonClick)="authService.logout()">
              <app-ui-icon name="log-out"></app-ui-icon>
              Logout
            </app-ui-button>
          </ng-container>

          <ng-template #loginButton>
            <app-ui-button variant="primary" [routerLink]="['/auth/login']">
              <app-ui-icon name="log-in"></app-ui-icon>
              Login
            </app-ui-button>
          </ng-template>
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  authService = inject(AuthService);
}
