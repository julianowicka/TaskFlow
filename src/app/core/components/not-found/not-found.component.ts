import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardComponent } from '../../../shared/ui/card/card.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { IconComponent } from '../../../shared/ui/icon/icon.component';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule, CardComponent, ButtonComponent, IconComponent],
  template: `
    <div class="not-found-container">
      <app-ui-card [padding]="'large'" class="not-found-card">
        <div class="not-found-icon">
          <app-ui-icon name="search" [size]="'48'"></app-ui-icon>
        </div>

        <h1 class="not-found-title">Page Not Found</h1>

        <p class="not-found-message">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div class="not-found-actions">
          <app-ui-button [routerLink]="['/']">Go to Home</app-ui-button>
          <app-ui-button variant="text" (buttonClick)="goBack()">Go Back</app-ui-button>
        </div>
      </app-ui-card>
    </div>
  `,
  styles: [
    `
      .not-found-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        padding: var(--spacing-4);
        background-color: var(--color-background);
      }

      .not-found-card {
        width: 100%;
        max-width: 500px;
        text-align: center;
      }

      .not-found-icon {
        color: var(--color-primary);
        margin-bottom: var(--spacing-4);
      }

      .not-found-title {
        font-size: var(--font-size-2xl);
        font-weight: var(--font-weight-bold);
        color: var(--color-text);
        margin: 0 0 var(--spacing-4) 0;
      }

      .not-found-message {
        font-size: var(--font-size-lg);
        color: var(--color-text-secondary);
        margin: 0 0 var(--spacing-6) 0;
      }

      .not-found-actions {
        display: flex;
        justify-content: center;
        gap: var(--spacing-4);
      }
    `,
  ],
})
export class NotFoundComponent {
  goBack(): void {
    window.history.back();
  }
}
