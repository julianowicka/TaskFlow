import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    private zone: NgZone,
    private router: Router,
  ) {}

  handleError(error: unknown): void {
    // Log the error to console
    console.error('Global error handler caught an error:', error);

    // Extract meaningful error message
    const errorMessage = this.extractErrorMessage(error);

    // Run inside NgZone to ensure UI updates
    this.zone.run(() => {
      // Here you could show a toast notification, modal, etc.
      // For now, we'll just log it and navigate to an error page for critical errors

      // Check if this is a critical error that should redirect to error page
      if (this.isCriticalError(error)) {
        // Store error information in session storage for the error page to display
        sessionStorage.setItem(
          'lastError',
          JSON.stringify({
            message: errorMessage,
            timestamp: new Date().toISOString(),
            url: window.location.href,
          }),
        );

        // Navigate to error page
        this.router.navigate(['/error']);
      }

      // For non-critical errors, you could show a toast notification or snackbar
      // This would be implemented with a notification service
    });
  }

  private extractErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    } else if (typeof error === 'string') {
      return error;
    } else if (typeof error === 'object' && error !== null) {
      // Try to extract message from error object
      const errorObj = error as Record<string, unknown>;
      if ('message' in errorObj && typeof errorObj['message'] === 'string') {
        return errorObj['message'];
      }
    }

    return 'An unknown error occurred';
  }

  private isCriticalError(error: unknown): boolean {
    // Define logic to determine if an error is critical enough to redirect
    // For example, check if it's a ReferenceError or TypeError which might break the app

    if (error instanceof ReferenceError || error instanceof TypeError) {
      return true;
    }

    // Check for specific error messages that indicate critical failures
    const errorMessage = this.extractErrorMessage(error).toLowerCase();
    const criticalKeywords = [
      'fatal',
      'critical',
      'memory',
      'stack overflow',
      'maximum call stack',
      'cannot read property',
      'undefined is not an object',
      'null is not an object',
    ];

    return criticalKeywords.some((keyword) => errorMessage.includes(keyword));
  }
}
