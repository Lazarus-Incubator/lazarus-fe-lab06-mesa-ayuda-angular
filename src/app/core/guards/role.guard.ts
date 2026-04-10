import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { UsuarioRol } from '../models/usuario.model';
import { AuthService } from '../services/auth.service';

function getRoles(route: ActivatedRouteSnapshot): UsuarioRol[] {
  return (route.data['roles'] as UsuarioRol[] | undefined) ?? [];
}

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const roles = getRoles(route);

  if (!roles.length || authService.hasRole(roles)) {
    return true;
  }

  return router.createUrlTree(['/dashboard']);
};
