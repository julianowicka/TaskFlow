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
      <app-ui-card [padding]="'large'" class="error-card">
        <div class="error-icon">
          <app-ui-icon name="alert-triangle" [size]="'48'"></app-ui-icon>
        </div>

        <h1 class="error-title">Something went wrong</h1>

        <p class="error-message">{{ errorMessage }}</p>

        <div class="error-actions">
          <app-ui-button (buttonClick)="goHome()">Go to Home</app-ui-button>
          <app-ui-button variant="text" (buttonClick)="reload()">Reload Page</app-ui-button>
        </div>

        @if (showDetails) {
          <div class="error-details">
            <div class="error-details-header" (click)="toggleDetails()">
              <span>Technical Details</span>
              <app-ui-icon [name]="detailsExpanded ? 'chevron-up' : 'chevron-down'"></app-ui-icon>
            </div>

            @if (detailsExpanded) {
              <div class="error-details-content">
                <div class="error-timestamp"><strong>Time:</strong> {{ errorDetails?.timestamp }}</div>

                @if (errorDetails?.stack) {
                  <div class="error-stack">
                    <strong>Stack Trace:</strong>
                    <pre>{{ errorDetails?.stack }}</pre>
                  </div>
                }
              </div>
            }
          </div>
        }
      </app-ui-card>
    </div>
  `,
  styleUrl: './error-page.component.scss',
})
export class ErrorPageComponent implements OnInit {
  errorMessage = 'An unexpected error occurred while processing your request.';
  errorDetails: ErrorDetails | null = null;
  showDetails = false;
  detailsExpanded = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const errorDetailsStr = sessionStorage.getItem('appError');
    if (errorDetailsStr) {
      try {
        this.errorDetails = JSON.parse(errorDetailsStr);
        this.errorMessage = this.errorDetails?.message || this.errorMessage;
        this.showDetails = true;
      } catch (e) {
        console.error('Failed to parse error details', e);
      }

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
