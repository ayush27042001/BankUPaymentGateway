import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  console.log('Auth Guard - Checking authentication...');

  // If on server (SSR), allow the route to pass - client will handle auth
  if (!isPlatformBrowser(platformId)) {
    console.log('Auth Guard - Server-side, allowing route');
    return true;
  }

  // On client, check authentication
  const isAuth = authService.isAuthenticated();
  console.log('Auth Guard - isAuthenticated:', isAuth);

  if (isAuth) {
    return true;
  }

  console.log('Auth Guard - Redirecting to login');
  router.navigate(['/login']);
  return false;
};
