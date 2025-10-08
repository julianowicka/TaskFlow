import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-ui-theme-toggle',
  standalone: true,
  imports: [CommonModule, IconComponent],
  styleUrls: ['./theme-toggle.component.scss'],
  template: `
    <button
      class="theme-toggle-button"
      type="button"
      [attr.aria-label]="themeService.isDarkMode() ? 'Switch to light mode' : 'Switch to dark mode'"
      (click)="themeService.toggleDarkMode()"
    >
      <app-ui-icon [name]="themeService.isDarkMode() ? 'sun' : 'moon'" [size]="'20'"></app-ui-icon>
    </button>
  `,
})
export class ThemeToggleComponent {
  themeService = inject(ThemeService);
}
