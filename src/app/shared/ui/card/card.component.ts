import { Component, Input } from '@angular/core';
import { NgClass, CommonModule } from '@angular/common';

@Component({
  selector: 'app-ui-card',
  standalone: true,
  imports: [NgClass, CommonModule],
  template: `
    <div
      class="ui-card"
      [ngClass]="{
        'ui-card--hoverable': hoverable,
        'ui-card--bordered': bordered,
        'ui-card--flat': flat,
        'ui-card--none': padding === 'none',
        'ui-card--small': padding === 'small',
        'ui-card--medium': padding === 'medium',
        'ui-card--large': padding === 'large',
      }"
    >
      <div *ngIf="title || subtitle" class="ui-card__header">
        <h3 *ngIf="title" class="ui-card__title">{{ title }}</h3>
        <p *ngIf="subtitle" class="ui-card__subtitle">{{ subtitle }}</p>
      </div>
      <div class="ui-card__content">
        <ng-content></ng-content>
      </div>
      <div *ngIf="footer" class="ui-card__footer">
        <ng-content select="[card-footer]"></ng-content>
      </div>
    </div>
  `,
  styles: [
    `
      .ui-card {
        background-color: var(--color-surface);
        border-radius: var(--border-radius-lg);
        overflow: hidden;

        &--bordered {
          border: var(--border-width-thin) solid var(--color-border);
        }

        &--hoverable {
          transition:
            transform var(--transition-base) var(--transition-timing),
            box-shadow var(--transition-base) var(--transition-timing);

          &:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-md);
          }
        }

        &--flat {
          box-shadow: none;
        }

        &:not(.ui-card--flat):not(.ui-card--bordered) {
          box-shadow: var(--shadow-base);
        }

        /* Padding variants */
        &--none {
          .ui-card__content {
            padding: 0;
          }
        }

        &--small {
          .ui-card__header,
          .ui-card__content,
          .ui-card__footer {
            padding: var(--spacing-2);
          }
        }

        &--medium {
          .ui-card__header,
          .ui-card__content,
          .ui-card__footer {
            padding: var(--spacing-4);
          }
        }

        &--large {
          .ui-card__header,
          .ui-card__content,
          .ui-card__footer {
            padding: var(--spacing-6);
          }
        }

        &__header {
          border-bottom: var(--border-width-thin) solid var(--color-border);
        }

        &__title {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-semibold);
          margin: 0;
          color: var(--color-text);
        }

        &__subtitle {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
          margin: var(--spacing-1) 0 0;
        }

        &__footer {
          border-top: var(--border-width-thin) solid var(--color-border);
        }
      }
    `,
  ],
})
export class CardComponent {
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() hoverable = false;
  @Input() bordered = false;
  @Input() flat = false;
  @Input() footer = false;
  @Input() padding: 'none' | 'small' | 'medium' | 'large' = 'medium';
}
