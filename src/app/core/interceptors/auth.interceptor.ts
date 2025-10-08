import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Skip if the request is to a public endpoint
  if (isPublicEndpoint(req.url)) {
    return next(req);
  }

  // Get the auth token
  const token = authService.getToken();

  // Clone the request and add the authorization header if token exists
  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
    return next(authReq);
  }

  // No token, proceed with original request
  return next(req);
};

/**
 * Helper function to determine if a URL is a public endpoint
 * that doesn't require authentication
 */
function isPublicEndpoint(url: string): boolean {
  const publicEndpoints = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/forgot-password',
    '/api/auth/reset-password',
  ];

  return publicEndpoints.some((endpoint) => url.includes(endpoint));
}
