import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { InputComponent } from '../../../../shared/ui/input/input.component';

@Component({
  selector: 'app-register',
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
      <ui-card [padding]="'large'" class="auth-card">
        <h1 class="auth-title">Create an Account</h1>

        <form (ngSubmit)="register()" #registerForm="ngForm" class="auth-form">
          <ui-input
            label="Full Name"
            [(ngModel)]="name"
            name="name"
            [required]="true"
            [error]="nameError"
          ></ui-input>

          <ui-input
            label="Email"
            [(ngModel)]="email"
            name="email"
            type="email"
            [required]="true"
            [error]="emailError"
          ></ui-input>

          <ui-input
            label="Password"
            [(ngModel)]="password"
            name="password"
            type="password"
            [required]="true"
            [error]="passwordError"
            hint="Password must be at least 8 characters"
          ></ui-input>

          <ui-input
            label="Confirm Password"
            [(ngModel)]="confirmPassword"
            name="confirmPassword"
            type="password"
            [required]="true"
            [error]="confirmPasswordError"
          ></ui-input>

          <div class="form-error" *ngIf="formError">
            {{ formError }}
          </div>

          <div class="form-actions">
            <ui-button type="submit" [fullWidth]="true" [disabled]="isLoading">
              {{ isLoading ? 'Creating account...' : 'Create Account' }}
            </ui-button>
          </div>
        </form>

        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/auth/login">Login</a></p>
        </div>
      </ui-card>
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
      }
    `,
  ],
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  isLoading = false;

  nameError = '';
  emailError = '';
  passwordError = '';
  confirmPasswordError = '';
  formError = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  register(): void {
    // Reset errors
    this.nameError = '';
    this.emailError = '';
    this.passwordError = '';
    this.confirmPasswordError = '';
    this.formError = '';

    // Validate form
    let isValid = true;

    if (!this.name) {
      this.nameError = 'Name is required';
      isValid = false;
    }

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
    } else if (this.password.length < 8) {
      this.passwordError = 'Password must be at least 8 characters';
      isValid = false;
    }

    if (!this.confirmPassword) {
      this.confirmPasswordError = 'Please confirm your password';
      isValid = false;
    } else if (this.password !== this.confirmPassword) {
      this.confirmPasswordError = 'Passwords do not match';
      isValid = false;
    }

    if (!isValid) return;

    // Submit form
    this.isLoading = true;

    this.authService
      .register({ name: this.name, email: this.email, password: this.password })
      .subscribe({
        next: () => {
          this.router.navigate(['/boards']);
        },
        error: (error) => {
          this.formError = error.message || 'Registration failed. Please try again.';
          this.isLoading = false;
        },
      });
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }
}
