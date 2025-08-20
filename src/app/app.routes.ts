import { Routes } from '@angular/router';
import { authGuard, unauthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'boards',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    canActivate: [unauthGuard],
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/components/login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/components/register/register.component').then(
            (m) => m.RegisterComponent,
          ),
      },
    ],
  },
  {
    path: 'boards',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/board/components/board-list/board-list.component').then(
            (m) => m.BoardListComponent,
          ),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./features/board/components/board-detail/board-detail.component').then(
            (m) => m.BoardDetailComponent,
          ),
      },
    ],
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/user/components/user-profile/user-profile.component').then(
        (m) => m.UserProfileComponent,
      ),
  },
  {
    path: 'error',
    loadComponent: () =>
      import('./core/components/error-page/error-page.component').then((m) => m.ErrorPageComponent),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./core/components/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
