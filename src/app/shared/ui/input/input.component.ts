import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'ui-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  template: `
    <div class="ui-input-container" [class.ui-input-container--error]="error">
      <label *ngIf="label" [for]="id" class="ui-input-label">
        {{ label }}
        <span *ngIf="required" class="ui-input-required">*</span>
      </label>

      <div class="ui-input-wrapper">
        <input
          [id]="id"
          [type]="type"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [required]="required"
          [attr.aria-invalid]="error ? 'true' : null"
          [attr.aria-describedby]="error ? id + '-error' : null"
          [(ngModel)]="value"
          (blur)="onTouched()"
          class="ui-input"
        />

        <div *ngIf="suffix" class="ui-input-suffix">
          <ng-content select="[suffix]"></ng-content>
        </div>
      </div>

      <div *ngIf="hint && !error" class="ui-input-hint">{{ hint }}</div>
      <div *ngIf="error" [id]="id + '-error'" class="ui-input-error">{{ error }}</div>
    </div>
  `,
  styles: [
    `
      .ui-input-container {
        display: flex;
        flex-direction: column;
        margin-bottom: var(--spacing-4);

        &--error {
          .ui-input {
            border-color: var(--color-danger);

            &:focus {
              box-shadow: 0 0 0 3px
                rgba(var(--color-danger-h), var(--color-danger-s), var(--color-danger-l), 0.25);
            }
          }
        }
      }

      .ui-input-label {
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        margin-bottom: var(--spacing-1);
        color: var(--color-text);
      }

      .ui-input-required {
        color: var(--color-danger);
        margin-left: var(--spacing-1);
      }

      .ui-input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
      }

      .ui-input {
        width: 100%;
        padding: var(--spacing-2) var(--spacing-3);
        font-size: var(--font-size-base);
        line-height: var(--line-height-base);
        color: var(--color-text);
        background-color: var(--color-surface);
        border: var(--border-width-thin) solid var(--color-border);
        border-radius: var(--border-radius-base);
        transition:
          border-color var(--transition-fast) var(--transition-timing),
          box-shadow var(--transition-fast) var(--transition-timing);

        &::placeholder {
          color: var(--color-text-secondary);
          opacity: 0.7;
        }

        &:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px var(--color-primary-focus);
        }

        &:disabled {
          background-color: var(--color-surface-hover);
          cursor: not-allowed;
          opacity: 0.7;
        }
      }

      .ui-input-suffix {
        position: absolute;
        right: var(--spacing-3);
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        align-items: center;
        color: var(--color-text-secondary);
      }

      .ui-input-hint {
        font-size: var(--font-size-xs);
        color: var(--color-text-secondary);
        margin-top: var(--spacing-1);
      }

      .ui-input-error {
        font-size: var(--font-size-xs);
        color: var(--color-danger);
        margin-top: var(--spacing-1);
      }
    `,
  ],
})
export class InputComponent implements ControlValueAccessor {
  @Input() id = `input-${Math.random().toString(36).substring(2, 9)}`;
  @Input() label = '';
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() hint = '';
  @Input() error = '';
  @Input() suffix = false;

  private _value = '';

  get value(): string {
    return this._value;
  }

  set value(val: string) {
    this._value = val;
    this.onChange(val);
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: string): void {
    this._value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
