import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/Authentication/authentication.service';

export const canActivateGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);
  const requiredRoles = route.data['roles'] as string[];

  if (authService.isLoggedIn() && requiredRoles.includes(authService.getRole())) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};