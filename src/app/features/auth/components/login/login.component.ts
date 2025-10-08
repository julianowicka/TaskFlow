import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { InputComponent } from '../../../../shared/ui/input/input.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CardComponent,
    ButtonComponent,
    InputComponent,
  ],
  template: `
    <div class="auth-container">
      <app-ui-card [padding]="'large'" class="auth-card">
        <h1 class="auth-title">Login to TaskFlow</h1>

        <form (ngSubmit)="login()" #loginForm="ngForm" class="auth-form">
          <app-ui-input
            label="Email"
            [(ngModel)]="email"
            name="email"
            type="email"
            [required]="true"
            [error]="emailError"
          ></app-ui-input>

          <app-ui-input
            label="Password"
            [(ngModel)]="password"
            name="password"
            type="password"
            [required]="true"
            [error]="passwordError"
          ></app-ui-input>

          <div class="form-error" *ngIf="formError">
            {{ formError }}
          </div>

          <div class="form-actions">
            <app-ui-button type="submit" [fullWidth]="true" [disabled]="isLoading">
              {{ isLoading ? 'Logging in...' : 'Login' }}
            </app-ui-button>
          </div>
        </form>

        <div class="auth-footer">
          <p>Don't have an account? <a routerLink="/auth/register">Register</a></p>
          <div class="skip-login">
            <app-ui-button variant="text" size="sm" (buttonClick)="skipLogin()">
              Skip Login (Development)
            </app-ui-button>
          </div>
        </div>
      </app-ui-card>
    </div>
  `,
  styles: [
    `
      .auth-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        padding: var(--spacing-4);
        background-color: var(--color-background);
      }

      .auth-card {
        width: 100%;
        max-width: 400px;
      }

      .auth-title {
        font-size: var(--font-size-2xl);
        font-weight: var(--font-weight-bold);
        color: var(--color-text);
        margin: 0 0 var(--spacing-6) 0;
        text-align: center;
      }

      .auth-form {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-4);
      }

      .form-error {
        color: var(--color-danger);
        font-size: var(--font-size-sm);
        margin-top: var(--spacing-2);
      }

      .form-actions {
        margin-top: var(--spacing-4);
      }

      .auth-footer {
        margin-top: var(--spacing-6);
        text-align: center;
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);

        a {
          color: var(--color-primary);
          text-decoration: none;
          font-weight: var(--font-weight-medium);

          &:hover {
            text-decoration: underline;
          }
        }

        .skip-login {
          margin-top: var(--spacing-4);
          padding-top: var(--spacing-4);
          border-top: 1px solid var(--color-border);
        }
      }
    `,
  ],
})
export class LoginComponent {
  email = '';
  password = '';
  isLoading = false;

  emailError = '';
  passwordError = '';
  formError = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  login(): void {
    // Reset errors
    this.emailError = '';
    this.passwordError = '';
    this.formError = '';

    // Validate form
    let isValid = true;

    if (!this.email) {
      this.emailError = 'Email is required';
      isValid = false;
    } else if (!this.isValidEmail(this.email)) {
      this.emailError = 'Please enter a valid email';
      isValid = false;
    }

    if (!this.password) {
      this.passwordError = 'Password is required';
      isValid = false;
    }

    if (!isValid) return;

    // Submit form
    this.isLoading = true;

    this.authService.simulateLogin(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/boards']);
      },
      error: (error) => {
        this.formError = error.message || 'Invalid email or password';
        this.isLoading = false;
      },
    });
  }

  skipLogin(): void {
    // Simulate login with dummy data for development
    this.authService.simulateLogin('dev@taskflow.com', 'password').subscribe({
      next: () => {
        this.router.navigate(['/boards']);
      },
      error: (error) => {
        this.formError = error.message || 'Failed to skip login';
      },
    });
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }
}
