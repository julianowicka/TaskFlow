import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { CardComponent } from '../../../../shared/ui/card/card.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { InputComponent } from '../../../../shared/ui/input/input.component';
import { IconComponent } from '../../../../shared/ui/icon/icon.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardComponent,
    ButtonComponent,
    InputComponent,
    IconComponent,
  ],
  template: `
    <div class="profile-container">
      <div class="profile-header">
        <h1>My Profile</h1>
      </div>

      <div class="profile-content">
        <ui-card [padding]="'large'" class="profile-card">
          <h2 class="section-title">Personal Information</h2>

          <form (ngSubmit)="saveProfile()" #profileForm="ngForm" class="profile-form">
            <div class="avatar-section">
              <div class="avatar">
                {{ getInitials() }}
              </div>
              <ui-button variant="secondary" size="sm">
                <ui-icon name="upload"></ui-icon>
                Change Avatar
              </ui-button>
            </div>

            <ui-input
              label="Full Name"
              [(ngModel)]="user.name"
              name="name"
              [required]="true"
              [error]="nameError"
            ></ui-input>

            <ui-input
              label="Email"
              [(ngModel)]="user.email"
              name="email"
              type="email"
              [required]="true"
              [error]="emailError"
              [disabled]="true"
              hint="Email cannot be changed"
            ></ui-input>

            <div class="form-actions">
              <ui-button type="submit" [disabled]="isLoading || !profileForm.form.dirty">
                {{ isLoading ? 'Saving...' : 'Save Changes' }}
              </ui-button>
            </div>
          </form>
        </ui-card>

        <ui-card [padding]="'large'" class="profile-card">
          <h2 class="section-title">Change Password</h2>

          <form (ngSubmit)="changePassword()" #passwordForm="ngForm" class="profile-form">
            <ui-input
              label="Current Password"
              [(ngModel)]="passwordData.currentPassword"
              name="currentPassword"
              type="password"
              [required]="true"
              [error]="currentPasswordError"
            ></ui-input>

            <ui-input
              label="New Password"
              [(ngModel)]="passwordData.newPassword"
              name="newPassword"
              type="password"
              [required]="true"
              [error]="newPasswordError"
              hint="Password must be at least 8 characters"
            ></ui-input>

            <ui-input
              label="Confirm New Password"
              [(ngModel)]="passwordData.confirmPassword"
              name="confirmPassword"
              type="password"
              [required]="true"
              [error]="confirmPasswordError"
            ></ui-input>

            <div class="form-error" *ngIf="passwordFormError">
              {{ passwordFormError }}
            </div>

            <div class="form-actions">
              <ui-button
                type="submit"
                [disabled]="
                  isPasswordLoading || !passwordForm.form.valid || !passwordForm.form.dirty
                "
              >
                {{ isPasswordLoading ? 'Changing Password...' : 'Change Password' }}
              </ui-button>
            </div>
          </form>
        </ui-card>

        <ui-card [padding]="'large'" class="profile-card danger-zone">
          <h2 class="section-title">Danger Zone</h2>

          <p class="danger-text">
            Once you delete your account, there is no going back. Please be certain.
          </p>

          <div class="danger-actions">
            <ui-button variant="danger" (buttonClick)="confirmDeleteAccount()">
              Delete Account
            </ui-button>
          </div>
        </ui-card>
      </div>
    </div>
  `,
  styles: [
    `
      .profile-container {
        max-width: 800px;
        margin: 0 auto;
        padding: var(--spacing-6);
      }

      .profile-header {
        margin-bottom: var(--spacing-6);

        h1 {
          font-size: var(--font-size-2xl);
          font-weight: var(--font-weight-bold);
          color: var(--color-text);
          margin: 0;
        }
      }

      .profile-content {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-6);
      }

      .profile-card {
        width: 100%;
      }

      .section-title {
        font-size: var(--font-size-lg);
        font-weight: var(--font-weight-semibold);
        color: var(--color-text);
        margin: 0 0 var(--spacing-4) 0;
      }

      .profile-form {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-4);
      }

      .avatar-section {
        display: flex;
        align-items: center;
        gap: var(--spacing-4);
        margin-bottom: var(--spacing-2);

        .avatar {
          width: 64px;
          height: 64px;
          border-radius: var(--border-radius-full);
          background-color: var(--color-primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-bold);
        }
      }

      .form-actions {
        display: flex;
        justify-content: flex-end;
        margin-top: var(--spacing-2);
      }

      .form-error {
        color: var(--color-danger);
        font-size: var(--font-size-sm);
      }

      .danger-zone {
        border-color: var(--color-danger-light);

        .section-title {
          color: var(--color-danger);
        }
      }

      .danger-text {
        color: var(--color-text-secondary);
        margin-bottom: var(--spacing-4);
      }

      .danger-actions {
        display: flex;
        justify-content: flex-start;
      }

      @media (max-width: 768px) {
        .profile-container {
          padding: var(--spacing-4);
        }
      }
    `,
  ],
})
export class UserProfileComponent implements OnInit {
  user = {
    name: '',
    email: '',
  };

  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  isLoading = false;
  isPasswordLoading = false;

  nameError = '';
  emailError = '';

  currentPasswordError = '';
  newPasswordError = '';
  confirmPasswordError = '';
  passwordFormError = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Get user data from auth service
    const userData = this.authService.getCurrentUser();
    if (userData) {
      this.user.name = userData.name;
      this.user.email = userData.email;
    }
  }

  getInitials(): string {
    if (!this.user.name) return '';

    return this.user.name
      .split(' ')
      .map((name) => name.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  saveProfile(): void {
    // Reset errors
    this.nameError = '';

    // Validate form
    let isValid = true;

    if (!this.user.name) {
      this.nameError = 'Name is required';
      isValid = false;
    }

    if (!isValid) return;

    // Submit form
    this.isLoading = true;

    // In a real app, this would call an API
    setTimeout(() => {
      this.authService.updateUserProfile(this.user).subscribe({
        next: () => {
          this.isLoading = false;
          // Show success message
          alert('Profile updated successfully');
        },
        error: (error) => {
          this.isLoading = false;
          this.nameError = error.message || 'Failed to update profile';
        },
      });
    }, 1000);
  }

  changePassword(): void {
    // Reset errors
    this.currentPasswordError = '';
    this.newPasswordError = '';
    this.confirmPasswordError = '';
    this.passwordFormError = '';

    // Validate form
    let isValid = true;

    if (!this.passwordData.currentPassword) {
      this.currentPasswordError = 'Current password is required';
      isValid = false;
    }

    if (!this.passwordData.newPassword) {
      this.newPasswordError = 'New password is required';
      isValid = false;
    } else if (this.passwordData.newPassword.length < 8) {
      this.newPasswordError = 'Password must be at least 8 characters';
      isValid = false;
    }

    if (!this.passwordData.confirmPassword) {
      this.confirmPasswordError = 'Please confirm your new password';
      isValid = false;
    } else if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.confirmPasswordError = 'Passwords do not match';
      isValid = false;
    }

    if (!isValid) return;

    // Submit form
    this.isPasswordLoading = true;

    // In a real app, this would call an API
    setTimeout(() => {
      this.authService
        .changePassword(this.passwordData.currentPassword, this.passwordData.newPassword)
        .subscribe({
          next: () => {
            this.isPasswordLoading = false;
            // Reset form
            this.passwordData = {
              currentPassword: '',
              newPassword: '',
              confirmPassword: '',
            };
            // Show success message
            alert('Password changed successfully');
          },
          error: (error) => {
            this.isPasswordLoading = false;
            this.passwordFormError = error.message || 'Failed to change password';
          },
        });
    }, 1000);
  }

  confirmDeleteAccount(): void {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // In a real app, this would call an API
      this.authService.deleteAccount().subscribe({
        next: () => {
          // Redirect to login page
          window.location.href = '/auth/login';
        },
        error: (error) => {
          alert(error.message || 'Failed to delete account');
        },
      });
    }
  }
}
