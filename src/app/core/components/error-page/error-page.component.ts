import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CardComponent } from '../../../shared/ui/card/card.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { IconComponent } from '../../../shared/ui/icon/icon.component';

interface ErrorDetails {
  message: string;
  stack?: string;
  timestamp: string;
}

@Component({
  selector: 'app-error-page',
  standalone: true,
  imports: [CommonModule, RouterModule, CardComponent, ButtonComponent, IconComponent],
  template: `
    <div class="error-container">
      <ui-card [padding]="'large'" class="error-card">
        <div class="error-icon">
          <ui-icon name="alert-triangle" [size]="'48'"></ui-icon>
        </div>

        <h1 class="error-title">Something went wrong</h1>

        <p class="error-message">{{ errorMessage }}</p>

        <div class="error-actions">
          <ui-button (buttonClick)="goHome()">Go to Home</ui-button>
          <ui-button variant="text" (buttonClick)="reload()">Reload Page</ui-button>
        </div>

        <div class="error-details" *ngIf="showDetails">
          <div class="error-details-header" (click)="toggleDetails()">
            <span>Technical Details</span>
            <ui-icon [name]="detailsExpanded ? 'chevron-up' : 'chevron-down'"></ui-icon>
          </div>

          <div class="error-details-content" *ngIf="detailsExpanded">
            <div class="error-timestamp"><strong>Time:</strong> {{ errorDetails?.timestamp }}</div>

            <div class="error-stack" *ngIf="errorDetails?.stack">
              <strong>Stack Trace:</strong>
              <pre>{{ errorDetails?.stack }}</pre>
            </div>
          </div>
        </div>
      </ui-card>
    </div>
  `,
  styles: [
    `
      .error-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        padding: var(--spacing-4);
        background-color: var(--color-background);
      }

      .error-card {
        width: 100%;
        max-width: 600px;
        text-align: center;
      }

      .error-icon {
        color: var(--color-danger);
        margin-bottom: var(--spacing-4);
      }

      .error-title {
        font-size: var(--font-size-2xl);
        font-weight: var(--font-weight-bold);
        color: var(--color-text);
        margin: 0 0 var(--spacing-4) 0;
      }

      .error-message {
        font-size: var(--font-size-lg);
        color: var(--color-text-secondary);
        margin: 0 0 var(--spacing-6) 0;
      }

      .error-actions {
        display: flex;
        justify-content: center;
        gap: var(--spacing-4);
        margin-bottom: var(--spacing-6);
      }

      .error-details {
        margin-top: var(--spacing-4);
        text-align: left;
        border-top: 1px solid var(--color-border);
        padding-top: var(--spacing-4);
      }

      .error-details-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;
        color: var(--color-text-secondary);
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);

        &:hover {
          color: var(--color-text);
        }
      }

      .error-details-content {
        margin-top: var(--spacing-4);
        font-size: var(--font-size-sm);
      }

      .error-timestamp {
        margin-bottom: var(--spacing-2);
      }

      .error-stack {
        margin-top: var(--spacing-2);

        pre {
          background-color: var(--color-surface);
          padding: var(--spacing-2);
          border-radius: var(--border-radius-base);
          overflow-x: auto;
          white-space: pre-wrap;
          word-break: break-word;
          font-size: var(--font-size-xs);
          color: var(--color-text-secondary);
        }
      }
    `,
  ],
})
export class ErrorPageComponent implements OnInit {
  errorMessage = 'An unexpected error occurred while processing your request.';
  errorDetails: ErrorDetails | null = null;
  showDetails = false;
  detailsExpanded = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Try to get error details from session storage
    const errorDetailsStr = sessionStorage.getItem('appError');
    if (errorDetailsStr) {
      try {
        this.errorDetails = JSON.parse(errorDetailsStr);
        this.errorMessage = this.errorDetails?.message || this.errorMessage;
        this.showDetails = true;
      } catch (e) {
        console.error('Failed to parse error details', e);
      }

      // Clear the error from session storage
      sessionStorage.removeItem('appError');
    }
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  reload(): void {
    window.location.reload();
  }

  toggleDetails(): void {
    this.detailsExpanded = !this.detailsExpanded;
  }
}
