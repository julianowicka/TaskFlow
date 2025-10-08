import {
  ApplicationConfig,
  ErrorHandler,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { GlobalErrorHandler } from './core/services/global-error-handler.service';
import { API_URL, FEATURE_FLAGS } from './core/tokens/config.token';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Router with modern features
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),

    // HTTP with fetch API and interceptors
    provideHttpClient(withFetch(), withInterceptors([authInterceptor, errorInterceptor])),

    // Animations
    provideAnimations(),

    // Custom error handler
    { provide: ErrorHandler, useClass: GlobalErrorHandler },

    // Configuration
    { provide: API_URL, useValue: 'https://api.taskflow.example/v1' },
    {
      provide: FEATURE_FLAGS,
      useValue: {
        enableDarkMode: true,
        enableNotifications: true,
        enableOfflineMode: true,
        enableDragAndDrop: true,
        enableAdvancedFilters: false,
      },
    },
  ],
};
