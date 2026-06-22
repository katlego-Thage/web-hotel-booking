import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { map, Observable, take } from 'rxjs';
import { Auth } from '../services/auth';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private authService: Auth, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.checkAuth(route, state);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.checkAuth(route, state);
  }

  private checkAuth(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.isAuthenticated$.pipe(
      take(1),
      map(isAuthenticated => {
        if (!isAuthenticated) {
          this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
          return false;
        }

        const requiredRoles = route.data['roles'] as string[];
        if (requiredRoles?.length > 0) {
          const hasRole = this.authService.hasAnyRole(requiredRoles);
          if (!hasRole) {
            this.router.navigate(['/unauthorized']);
            return false;
          }
        }

        // Optional permission check
        const requiredPermission = route.data['permission'] as string;
        if (requiredPermission && !this.authService.hasPermission(requiredPermission)) {
          this.router.navigate(['/unauthorized']);
          return false;
        }

        return true;
      })
    );
  }
}