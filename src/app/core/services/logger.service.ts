import { Injectable, inject } from '@angular/core';
import { FEATURE_FLAGS } from '../tokens/config.token';

/**
 * Logger service that provides different logging levels
 * In production, only error logs are displayed
 * In development, all logs are displayed
 */
@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  private featureFlags = inject(FEATURE_FLAGS);
  private isProduction = false; // This would typically be injected from environment

  /**
   * Log informational message
   * @param message The message to log
   * @param optionalParams Additional parameters to log
   */
  info(message: string, ...optionalParams: any[]): void {
    if (!this.isProduction) {
      console.info(`%c[INFO] ${message}`, 'color: #3b82f6', ...optionalParams);
    }
  }

  /**
   * Log warning message
   * @param message The message to log
   * @param optionalParams Additional parameters to log
   */
  warn(message: string, ...optionalParams: any[]): void {
    if (!this.isProduction) {
      console.warn(`%c[WARN] ${message}`, 'color: #f59e0b', ...optionalParams);
    }
  }

  /**
   * Log error message (always logged regardless of environment)
   * @param message The message to log
   * @param optionalParams Additional parameters to log
   */
  error(message: string, ...optionalParams: any[]): void {
    console.error(`%c[ERROR] ${message}`, 'color: #ef4444', ...optionalParams);
  }

  /**
   * Log debug message
   * @param message The message to log
   * @param optionalParams Additional parameters to log
   */
  debug(message: string, ...optionalParams: any[]): void {
    if (!this.isProduction) {
      console.debug(`%c[DEBUG] ${message}`, 'color: #8b5cf6', ...optionalParams);
    }
  }

  /**
   * Log feature usage
   * @param featureName The name of the feature being used
   * @param data Optional data related to feature usage
   */
  logFeatureUsage(featureName: string, data?: any): void {
    if (!this.isProduction) {
      console.log(`%c[FEATURE] ${featureName}`, 'color: #10b981', data || '');
    }
    // In a real app, you might send this to analytics
  }
}
