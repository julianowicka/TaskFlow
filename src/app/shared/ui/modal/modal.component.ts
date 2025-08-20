import { Component, Input, Output, EventEmitter, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'ui-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="ui-modal-backdrop" (click)="closeOnBackdrop && close()">
      <div
        class="ui-modal"
        [class.ui-modal--small]="size === 'small'"
        [class.ui-modal--large]="size === 'large'"
        (click)="$event.stopPropagation()"
        @modalAnimation
      >
        <div class="ui-modal__header">
          <h2 class="ui-modal__title">{{ title }}</h2>
          <button
            *ngIf="showCloseButton"
            class="ui-modal__close"
            aria-label="Close modal"
            (click)="close()"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="ui-modal__content">
          <ng-content></ng-content>
        </div>

        <div *ngIf="showFooter" class="ui-modal__footer">
          <ui-button *ngIf="showCancelButton" variant="secondary" (buttonClick)="cancel()">
            {{ cancelText }}
          </ui-button>

          <ui-button
            *ngIf="showConfirmButton"
            [variant]="confirmVariant"
            [loading]="confirmLoading()"
            (buttonClick)="confirm()"
          >
            {{ confirmText }}
          </ui-button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .ui-modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: var(--z-index-modal-backdrop);
        padding: var(--spacing-4);
      }

      .ui-modal {
        background-color: var(--color-surface);
        border-radius: var(--border-radius-lg);
        box-shadow: var(--shadow-xl);
        width: 100%;
        max-width: 500px;
        max-height: calc(100vh - var(--spacing-8));
        overflow-y: auto;
        z-index: var(--z-index-modal);
        display: flex;
        flex-direction: column;

        &--small {
          max-width: 400px;
        }

        &--large {
          max-width: 800px;
        }

        &__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--spacing-4);
          border-bottom: var(--border-width-thin) solid var(--color-border);
        }

        &__title {
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-semibold);
          margin: 0;
          color: var(--color-text);
        }

        &__close {
          background: none;
          border: none;
          cursor: pointer;
          padding: var(--spacing-1);
          color: var(--color-text-secondary);
          border-radius: var(--border-radius-base);
          display: flex;
          align-items: center;
          justify-content: center;
          transition:
            background-color var(--transition-fast) var(--transition-timing),
            color var(--transition-fast) var(--transition-timing);

          &:hover {
            background-color: var(--color-surface-hover);
            color: var(--color-text);
          }

          &:focus-visible {
            outline: none;
            box-shadow: 0 0 0 3px var(--color-primary-focus);
          }
        }

        &__content {
          padding: var(--spacing-4);
          overflow-y: auto;
          flex: 1;
        }

        &__footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: var(--spacing-2);
          padding: var(--spacing-4);
          border-top: var(--border-width-thin) solid var(--color-border);
        }
      }
    `,
  ],
  animations: [
    // We'll add animations later when we implement the animation module
  ],
})
export class ModalComponent {
  @Input() title = '';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() showCloseButton = true;
  @Input() closeOnBackdrop = true;
  @Input() closeOnEscape = true;

  @Input() showFooter = true;
  @Input() showCancelButton = true;
  @Input() showConfirmButton = true;
  @Input() cancelText = 'Cancel';
  @Input() confirmText = 'Confirm';
  @Input() confirmVariant: 'primary' | 'success' | 'danger' = 'primary';

  @Output() modalClose = new EventEmitter<void>();
  @Output() modalCancel = new EventEmitter<void>();
  @Output() modalConfirm = new EventEmitter<void>();

  confirmLoading = signal(false);

  @HostListener('document:keydown.escape')
  onEscapePress(): void {
    if (this.closeOnEscape) {
      this.close();
    }
  }

  close(): void {
    this.modalClose.emit();
  }

  cancel(): void {
    this.modalCancel.emit();
    this.close();
  }

  confirm(): void {
    this.modalConfirm.emit();
  }

  setLoading(loading: boolean): void {
    this.confirmLoading.set(loading);
  }
}
