import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'text';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [CommonModule, NgClass],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [attr.aria-label]="ariaLabel || null"
      [attr.data-testid]="testId || null"
      [ngClass]="[
        'ui-button',
        'ui-button--' + variant,
        'ui-button--' + size,
        { 'ui-button--loading': loading, 'ui-button--full-width': fullWidth },
      ]"
      (click)="onClick($event)"
    >
      <span class="ui-button__content" [class.ui-button__content--hidden]="loading">
        <ng-content></ng-content>
      </span>
      <span *ngIf="loading" class="ui-button__spinner"></span>
    </button>
  `,
  styles: [
    `
      .ui-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: relative;
        font-weight: var(--font-weight-medium);
        border-radius: var(--border-radius-base);
        transition:
          background-color var(--transition-fast) var(--transition-timing),
          border-color var(--transition-fast) var(--transition-timing),
          color var(--transition-fast) var(--transition-timing),
          box-shadow var(--transition-fast) var(--transition-timing);
        cursor: pointer;
        border: none;
        outline: none;
        white-space: nowrap;
        text-decoration: none;
        user-select: none;

        &:focus-visible {
          box-shadow: 0 0 0 3px var(--color-primary-focus);
        }

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        &--full-width {
          width: 100%;
        }

        /* Sizes */
        &--sm {
          font-size: var(--font-size-sm);
          padding: var(--spacing-1) var(--spacing-2);
          height: 32px;
        }

        &--md {
          font-size: var(--font-size-base);
          padding: var(--spacing-2) var(--spacing-4);
          height: 40px;
        }

        &--lg {
          font-size: var(--font-size-lg);
          padding: var(--spacing-3) var(--spacing-6);
          height: 48px;
        }

        /* Variants */
        &--primary {
          background-color: var(--color-primary);
          color: var(--color-primary-contrast);

          &:hover:not(:disabled) {
            background-color: var(--color-primary-hover);
          }

          &:active:not(:disabled) {
            background-color: var(--color-primary-active);
          }
        }

        &--secondary {
          background-color: transparent;
          color: var(--color-primary);
          border: var(--border-width-thin) solid var(--color-primary);

          &:hover:not(:disabled) {
            background-color: var(--color-primary-focus);
          }

          &:active:not(:disabled) {
            background-color: var(--color-primary-focus);
            border-color: var(--color-primary-active);
          }
        }

        &--success {
          background-color: var(--color-success);
          color: var(--color-success-contrast);

          &:hover:not(:disabled) {
            background-color: var(--color-success-hover);
          }

          &:active:not(:disabled) {
            background-color: var(--color-success-active);
          }
        }

        &--danger {
          background-color: var(--color-danger);
          color: var(--color-danger-contrast);

          &:hover:not(:disabled) {
            background-color: var(--color-danger-hover);
          }

          &:active:not(:disabled) {
            background-color: var(--color-danger-active);
          }
        }

        &--warning {
          background-color: var(--color-warning);
          color: var(--color-warning-contrast);

          &:hover:not(:disabled) {
            background-color: var(--color-warning-hover);
          }

          &:active:not(:disabled) {
            background-color: var(--color-warning-active);
          }
        }

        &--text {
          background-color: transparent;
          color: var(--color-primary);

          &:hover:not(:disabled) {
            background-color: var(--color-surface-hover);
          }

          &:active:not(:disabled) {
            background-color: var(--color-surface-active);
          }
        }

        /* Loading state */
        &--loading {
          .ui-button__content {
            visibility: hidden;
          }
        }

        &__spinner {
          position: absolute;
          width: 16px;
          height: 16px;
          border: 2px solid currentColor;
          border-radius: 50%;
          border-top-color: transparent;
          animation: button-spinner 0.8s linear infinite;
        }
      }

      @keyframes button-spinner {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() fullWidth = false;
  @Input() ariaLabel?: string;
  @Input() testId?: string;

  @Output() buttonClick = new EventEmitter<MouseEvent>();

  onClick(event: MouseEvent): void {
    this.buttonClick.emit(event);
  }
}
