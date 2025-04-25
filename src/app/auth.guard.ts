// auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const authGuard: CanActivateFn = () => {
  const cookieService = inject(CookieService);
  const router = inject(Router);

  const accessToken = cookieService.get('AccessToken');
  
  if (!accessToken) {
    router.navigate(['/login']); // Redirect if no token
    return false;
  }

  // Optional: Validate token expiry (if expiry time is stored)
  const expiry = new Date(cookieService.get('AccessToken_Expiry'));
  if (new Date() > expiry) {
    cookieService.delete('AccessToken');
    router.navigate(['/login']);
    return false;
  }

  return true; // Allow navigation
};