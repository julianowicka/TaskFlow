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
          <ui-theme-toggle></ui-theme-toggle>

          <ng-container *ngIf="authService.isAuthenticated(); else loginButton">
            <ui-button variant="text" [routerLink]="['/profile']" routerLinkActive="active">
              <ui-icon name="user"></ui-icon>
              Profile
            </ui-button>

            <ui-button variant="text" (buttonClick)="authService.logout()">
              <ui-icon name="log-out"></ui-icon>
              Logout
            </ui-button>
          </ng-container>

          <ng-template #loginButton>
            <ui-button variant="primary" [routerLink]="['/auth/login']">
              <ui-icon name="log-in"></ui-icon>
              Login
            </ui-button>
          </ng-template>
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  authService = inject(AuthService);
}
