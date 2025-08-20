import { Component, OnInit, signal, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardComponent } from '../../../shared/ui/card/card.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { IconComponent } from '../../../shared/ui/icon/icon.component';
import { InputComponent } from '../../../shared/ui/input/input.component';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  bio?: string;
  location?: string;
  website?: string;
  joinDate: Date;
}

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardComponent,
    ButtonComponent,
    IconComponent,
    InputComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrls: ['./user-profile.component.scss'],
  template: `
    <div class="profile-container">
      <h1 class="profile-title">User Profile</h1>

      <div class="profile-content">
        <ui-card class="profile-card">
          <div class="profile-header">
            <ui-avatar
              [src]="userProfile().avatar"
              [name]="userProfile().name"
              [size]="'xl'"
              data-testid="profile-avatar"
            >
            </ui-avatar>
            <div class="profile-header-info">
              <h2 class="profile-name">{{ userProfile().name }}</h2>
              <p class="profile-role">{{ userProfile().role }}</p>
              <p class="profile-joined">
                <ui-icon name="calendar" [size]="'16'"></ui-icon>
                Joined {{ userProfile().joinDate | date: 'mediumDate' }}
              </p>
            </div>
          </div>

          <ui-tabs>
            <ui-tab label="Profile Information" icon="user">
              <div class="profile-info">
                <div class="profile-info-item">
                  <span class="profile-info-label">Email</span>
                  <span class="profile-info-value">{{ userProfile().email }}</span>
                </div>

                <div class="profile-info-item" *ngIf="userProfile().location">
                  <span class="profile-info-label">Location</span>
                  <span class="profile-info-value">{{ userProfile().location }}</span>
                </div>

                <div class="profile-info-item" *ngIf="userProfile().website">
                  <span class="profile-info-label">Website</span>
                  <a [href]="userProfile().website" target="_blank" class="profile-info-link">
                    {{ userProfile().website }}
                  </a>
                </div>

                <div class="profile-info-item" *ngIf="userProfile().bio">
                  <span class="profile-info-label">Bio</span>
                  <p class="profile-info-bio">{{ userProfile().bio }}</p>
                </div>
              </div>
            </ui-tab>

            <ui-tab label="Edit Profile" icon="edit">
              <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="profile-form">
                <ui-input
                  label="Name"
                  formControlName="name"
                  [error]="getError('name')"
                  data-testid="profile-name-input"
                >
                </ui-input>

                <ui-input
                  label="Email"
                  type="email"
                  formControlName="email"
                  [error]="getError('email')"
                  data-testid="profile-email-input"
                >
                </ui-input>

                <ui-input
                  label="Location"
                  formControlName="location"
                  data-testid="profile-location-input"
                >
                </ui-input>

                <ui-input
                  label="Website"
                  formControlName="website"
                  data-testid="profile-website-input"
                >
                </ui-input>

                <ui-input
                  label="Bio"
                  type="textarea"
                  formControlName="bio"
                  data-testid="profile-bio-input"
                >
                </ui-input>

                <div class="profile-form-actions">
                  <ui-button
                    type="submit"
                    [disabled]="profileForm.invalid || !profileForm.dirty"
                    data-testid="profile-save-button"
                  >
                    Save Changes
                  </ui-button>
                  <ui-button
                    type="button"
                    variant="text"
                    (buttonClick)="resetForm()"
                    data-testid="profile-reset-button"
                  >
                    Reset
                  </ui-button>
                </div>
              </form>
            </ui-tab>

            <ui-tab label="Security" icon="lock">
              <div class="profile-security">
                <h3>Change Password</h3>
                <form
                  [formGroup]="passwordForm"
                  (ngSubmit)="onChangePassword()"
                  class="profile-form"
                >
                  <ui-input
                    label="Current Password"
                    type="password"
                    formControlName="currentPassword"
                    [error]="getPasswordError('currentPassword')"
                    data-testid="profile-current-password-input"
                  >
                  </ui-input>

                  <ui-input
                    label="New Password"
                    type="password"
                    formControlName="newPassword"
                    [error]="getPasswordError('newPassword')"
                    data-testid="profile-new-password-input"
                  >
                  </ui-input>

                  <ui-input
                    label="Confirm New Password"
                    type="password"
                    formControlName="confirmPassword"
                    [error]="getPasswordError('confirmPassword')"
                    data-testid="profile-confirm-password-input"
                  >
                  </ui-input>

                  <div class="profile-form-actions">
                    <ui-button
                      type="submit"
                      [disabled]="passwordForm.invalid"
                      data-testid="profile-change-password-button"
                    >
                      Change Password
                    </ui-button>
                  </div>
                </form>
              </div>
            </ui-tab>
          </ui-tabs>
        </ui-card>
      </div>
    </div>
  `,
  styles: [
    `
      .profile-container {
        padding: var(--space-6);
        max-width: 800px;
        margin: 0 auto;
      }

      .profile-title {
        font-size: var(--font-size-3xl);
        font-weight: var(--font-weight-bold);
        margin-bottom: var(--space-6);
        color: var(--color-text);
      }

      .profile-card {
        width: 100%;
      }

      .profile-header {
        display: flex;
        align-items: center;
        gap: var(--space-4);
        margin-bottom: var(--space-6);
        padding-bottom: var(--space-4);
        border-bottom: var(--border-width-thin) solid var(--color-border);
      }

      .profile-header-info {
        display: flex;
        flex-direction: column;
      }

      .profile-name {
        font-size: var(--font-size-xl);
        font-weight: var(--font-weight-semibold);
        margin: 0 0 var(--space-1) 0;
        color: var(--color-text);
      }

      .profile-role {
        font-size: var(--font-size-base);
        color: var(--color-primary);
        margin: 0 0 var(--space-2) 0;
      }

      .profile-joined {
        font-size: var(--font-size-sm);
        color: var(--color-text-secondary);
        display: flex;
        align-items: center;
        gap: var(--space-1);
        margin: 0;
      }

      .profile-info {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
      }

      .profile-info-item {
        display: flex;
        flex-direction: column;
        gap: var(--space-1);
      }

      .profile-info-label {
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        color: var(--color-text-secondary);
      }

      .profile-info-value {
        font-size: var(--font-size-base);
        color: var(--color-text);
      }

      .profile-info-link {
        color: var(--color-primary);
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }

      .profile-info-bio {
        font-size: var(--font-size-base);
        color: var(--color-text);
        margin: 0;
        white-space: pre-line;
      }

      .profile-form {
        display: flex;
        flex-direction: column;
        gap: var(--space-4);
      }

      .profile-form-actions {
        display: flex;
        justify-content: flex-start;
        gap: var(--space-4);
        margin-top: var(--space-4);
      }

      .profile-security {
        h3 {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-semibold);
          margin: 0 0 var(--space-4) 0;
          color: var(--color-text);
        }
      }
    `,
  ],
})
export class UserProfileComponent implements OnInit {
  userProfile = signal<UserProfile>({
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://i.pravatar.cc/300?u=1',
    role: 'Administrator',
    bio: 'Product manager with 5+ years of experience in SaaS applications. Passionate about user experience and agile methodologies.',
    location: 'San Francisco, CA',
    website: 'https://example.com',
    joinDate: new Date(2022, 0, 15),
  });

  profileForm!: FormGroup;
  passwordForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initProfileForm();
    this.initPasswordForm();
  }

  initProfileForm(): void {
    this.profileForm = this.fb.group({
      name: [this.userProfile().name, [Validators.required, Validators.minLength(2)]],
      email: [this.userProfile().email, [Validators.required, Validators.email]],
      location: [this.userProfile().location],
      website: [this.userProfile().website],
      bio: [this.userProfile().bio],
    });
  }

  initPasswordForm(): void {
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator,
      },
    );
  }

  passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (newPassword !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  getError(controlName: string): string {
    const control = this.profileForm.get(controlName);

    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.errors?.['required']) {
        return `${this.capitalizeFirstLetter(controlName)} is required`;
      }

      if (control.errors?.['minlength']) {
        return `${this.capitalizeFirstLetter(controlName)} must be at least ${control.errors?.['minlength'].requiredLength} characters`;
      }

      if (control.errors?.['email']) {
        return 'Please enter a valid email address';
      }
    }

    return '';
  }

  getPasswordError(controlName: string): string {
    const control = this.passwordForm.get(controlName);

    if (control?.invalid && (control.dirty || control.touched)) {
      if (control.errors?.['required']) {
        return `${this.capitalizeFirstLetter(controlName)} is required`;
      }

      if (control.errors?.['minlength']) {
        return `Password must be at least ${control.errors?.['minlength'].requiredLength} characters`;
      }

      if (control.errors?.['passwordMismatch']) {
        return 'Passwords do not match';
      }
    }

    return '';
  }

  capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      // In a real app, you would call a service to update the user profile
      this.userProfile.update((profile) => ({
        ...profile,
        ...this.profileForm.value,
      }));

      // Mark form as pristine after successful save
      this.profileForm.markAsPristine();

      console.log('Profile updated:', this.userProfile());
    }
  }

  onChangePassword(): void {
    if (this.passwordForm.valid) {
      // In a real app, you would call a service to change the password
      console.log('Password change requested:', {
        currentPassword: this.passwordForm.get('currentPassword')?.value,
        newPassword: this.passwordForm.get('newPassword')?.value,
      });

      // Reset form after successful password change
      this.passwordForm.reset();
    }
  }

  resetForm(): void {
    this.profileForm.reset({
      name: this.userProfile().name,
      email: this.userProfile().email,
      location: this.userProfile().location,
      website: this.userProfile().website,
      bio: this.userProfile().bio,
    });
  }
}
