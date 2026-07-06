import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { SuperAdminAuthService } from '../admin/services/superadmin-auth.service';

export const adminAuthGuard: CanActivateFn = () => {
  const superAdminAuthService = inject(SuperAdminAuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  if (superAdminAuthService.isAdminAuthenticated()) {
    return true;
  }

  router.navigate(['/superadmin-login']);
  return false;
};
