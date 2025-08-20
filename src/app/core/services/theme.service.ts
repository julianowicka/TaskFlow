import { Injectable, signal, computed, effect } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';
import { FEATURE_FLAGS } from '../tokens/config.token';

export type Theme = 'light' | 'dark' | 'high-contrast';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private document = inject(DOCUMENT);
  private featureFlags = inject(FEATURE_FLAGS);

  // State
  private currentTheme = signal<Theme>(this.getInitialTheme());

  // Computed values
  readonly theme = computed(() => this.currentTheme());
  readonly isDarkMode = computed(() => this.currentTheme() === 'dark');
  readonly isHighContrastMode = computed(() => this.currentTheme() === 'high-contrast');

  constructor() {
    // Apply theme on startup and whenever it changes
    effect(() => {
      this.applyTheme(this.currentTheme());
    });
  }

  /**
   * Set the current theme
   * @param theme The theme to set
   */
  setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
    this.saveThemePreference(theme);
  }

  /**
   * Toggle between light and dark themes
   */
  toggleDarkMode(): void {
    const newTheme = this.isDarkMode() ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  /**
   * Toggle high contrast mode
   */
  toggleHighContrastMode(): void {
    const newTheme = this.isHighContrastMode() ? 'light' : 'high-contrast';
    this.setTheme(newTheme);
  }

  /**
   * Get the initial theme from localStorage or system preference
   */
  private getInitialTheme(): Theme {
    // Check if dark mode is enabled in feature flags
    if (!this.featureFlags.enableDarkMode) {
      return 'light';
    }

    // Check localStorage first
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme && ['light', 'dark', 'high-contrast'].includes(savedTheme)) {
      return savedTheme;
    }

    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    // Default to light theme
    return 'light';
  }

  /**
   * Apply the theme to the document
   * @param theme The theme to apply
   */
  private applyTheme(theme: Theme): void {
    // Remove all theme data attributes
    this.document.documentElement.removeAttribute('data-theme');

    // Add the current theme data attribute
    if (theme !== 'light') {
      this.document.documentElement.setAttribute('data-theme', theme);
    }
  }

  /**
   * Save theme preference to localStorage
   * @param theme The theme to save
   */
  private saveThemePreference(theme: Theme): void {
    localStorage.setItem('theme', theme);
  }
}
