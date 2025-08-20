import { InjectionToken } from '@angular/core';

/**
 * Configuration token for API URL
 */
export const API_URL = new InjectionToken<string>('API_URL', {
  providedIn: 'root',
  factory: () => 'https://api.taskflow.example/v1',
});

/**
 * Feature flags configuration
 */
export interface FeatureFlags {
  enableDarkMode: boolean;
  enableNotifications: boolean;
  enableOfflineMode: boolean;
  enableDragAndDrop: boolean;
  enableAdvancedFilters: boolean;
}

/**
 * Default feature flags
 */
const defaultFeatureFlags: FeatureFlags = {
  enableDarkMode: true,
  enableNotifications: true,
  enableOfflineMode: true,
  enableDragAndDrop: true,
  enableAdvancedFilters: false,
};

/**
 * Configuration token for feature flags
 */
export const FEATURE_FLAGS = new InjectionToken<FeatureFlags>('FEATURE_FLAGS', {
  providedIn: 'root',
  factory: () => defaultFeatureFlags,
});
