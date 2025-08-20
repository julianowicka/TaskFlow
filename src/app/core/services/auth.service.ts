import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly TOKEN_KEY = 'taskflow_auth_token';
  private readonly USER_KEY = 'taskflow_user';

  // State
  private userSignal = signal<User | null>(null);
  private authStateSignal = signal<boolean>(false);
  private loadingSignal = signal<boolean>(false);

  // Selectors
  readonly currentUser = this.userSignal.asReadonly();
  readonly isLoggedIn = this.authStateSignal.asReadonly();
  readonly isLoading = this.loadingSignal.asReadonly();

  // Public methods
  isAuthenticated(): boolean {
    return this.authStateSignal();
  }

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    // Check if user is already logged in from local storage
    this.checkAuthStatus();
  }

  login(credentials: LoginCredentials): Observable<User> {
    this.loadingSignal.set(true);

    // In a real app, this would be an API call
    // For now, we'll simulate a successful login with mock data
    return this.http.post<{ token: string; user: User }>('/api/auth/login', credentials).pipe(
      tap((response) => {
        this.setSession(response.token, response.user);
        this.loadingSignal.set(false);
      }),
      map((response) => response.user),
      catchError((error) => {
        this.loadingSignal.set(false);
        return throwError(() => new Error(error.error?.message || 'Login failed'));
      }),
    );
  }

  register(credentials: RegisterCredentials): Observable<User> {
    this.loadingSignal.set(true);

    return this.http.post<{ token: string; user: User }>('/api/auth/register', credentials).pipe(
      tap((response) => {
        this.setSession(response.token, response.user);
        this.loadingSignal.set(false);
      }),
      map((response) => response.user),
      catchError((error) => {
        this.loadingSignal.set(false);
        return throwError(() => new Error(error.error?.message || 'Registration failed'));
      }),
    );
  }

  logout(): void {
    // Clear auth data from local storage
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);

    // Reset state
    this.userSignal.set(null);
    this.authStateSignal.set(false);

    // Redirect to login page
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  checkAuthStatus(): Observable<boolean> {
    const token = this.getToken();

    if (!token) {
      this.authStateSignal.set(false);
      return of(false);
    }

    try {
      // Get user from local storage
      const userJson = localStorage.getItem(this.USER_KEY);
      if (userJson) {
        const user = JSON.parse(userJson) as User;
        this.userSignal.set(user);
        this.authStateSignal.set(true);
        return of(true);
      }

      // If we have a token but no user, validate the token with the server
      return this.http.get<User>('/api/auth/me').pipe(
        tap((user) => {
          this.userSignal.set(user);
          this.authStateSignal.set(true);
          localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        }),
        map(() => true),
        catchError(() => {
          // Invalid token, clear auth data
          this.logout();
          return of(false);
        }),
      );
    } catch (error) {
      this.logout();
      return of(false);
    }
  }

  private setSession(token: string, user: User): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.userSignal.set(user);
    this.authStateSignal.set(true);
  }

  // For demo purposes only - to simulate login without a backend
  simulateLogin(email: string, password: string): Observable<User> {
    this.loadingSignal.set(true);

    return new Observable<User>((observer) => {
      setTimeout(() => {
        if (password.length < 6) {
          this.loadingSignal.set(false);
          observer.error(new Error('Password must be at least 6 characters'));
          return;
        }

        const mockUser: User = {
          id: crypto.randomUUID(),
          email,
          name: email.split('@')[0],
        };

        const mockToken = `mock-jwt-token-${Date.now()}`;
        this.setSession(mockToken, mockUser);

        this.loadingSignal.set(false);
        observer.next(mockUser);
        observer.complete();
      }, 1000); // Simulate network delay
    });
  }

  simulateRegister(name: string, email: string, password: string): Observable<User> {
    this.loadingSignal.set(true);

    return new Observable<User>((observer) => {
      setTimeout(() => {
        if (password.length < 6) {
          this.loadingSignal.set(false);
          observer.error(new Error('Password must be at least 6 characters'));
          return;
        }

        const mockUser: User = {
          id: crypto.randomUUID(),
          email,
          name,
        };

        const mockToken = `mock-jwt-token-${Date.now()}`;
        this.setSession(mockToken, mockUser);

        this.loadingSignal.set(false);
        observer.next(mockUser);
        observer.complete();
      }, 1000); // Simulate network delay
    });
  }
}
