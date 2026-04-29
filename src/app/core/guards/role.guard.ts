import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const role = this.auth.getRol();
    const allowedRoles = route.data['roles'] as string[] | undefined;

    if (!allowedRoles?.length) {
      return true;
    }

    return role && allowedRoles.includes(role) ? true : this.router.createUrlTree(['/login']);
  }
}
