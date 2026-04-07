import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanActivateFn, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { map, Observable, take } from 'rxjs';
import { UserRole } from '../models';
import { Auth } from '../services/auth';
@Injectable({
  providedIn: 'root'
})

// export const authGuard: CanActivateFn = (route, state) => {
//   return true;
// };

export class AuthGuard implements CanActivate, CanActivateChild {
  
  constructor(
    private authService: Auth,
    private router: Router
  ) { }

    canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.checkAuth(route, state);
  }
    canActivateChild(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.checkAuth(route, state);
  }

    private checkAuth(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.isAuthenticated$.pipe(
      take(1),
      map((isAuthenticated: any) => {
        if (!isAuthenticated) {
          this.router.navigate(['/login'], { 
            queryParams: { returnUrl: state.url }
          });
          return false;
        }

        // Check for required roles
        const requiredRoles = route.data['roles'] as UserRole[];
        if (requiredRoles && requiredRoles.length > 0) {
          const hasRole = this.authService.hasAnyRole(requiredRoles);
          if (!hasRole) {
            this.router.navigate(['/unauthorized']);
            return false;
          }
        }

        // Check for specific permission
        const requiredPermission = route.data['permission'] as string;
        if (requiredPermission) {
          const hasPermission = this.authService.hasPermission(requiredPermission);
          if (!hasPermission) {
            this.router.navigate(['/unauthorized']);
            return false;
          }
        }

        return true;
      })
    );
  }
}

// Role-specific guards for convenience
@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: Auth, private router: Router) { }

  canActivate(): boolean {
    if (this.authService.hasRole(UserRole.Admin)) {
      return true;
    }
    this.router.navigate(['/unauthorized']);
    return false;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ManagerGuard implements CanActivate {
  constructor(private authService: Auth, private router: Router) { }

  canActivate(): boolean {
    if (this.authService.hasAnyRole([UserRole.Admin, UserRole.Manager])) {
      return true;
    }
    this.router.navigate(['/unauthorized']);
    return false;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ReceptionistGuard implements CanActivate {
  constructor(private authService: Auth, private router: Router) { }

  canActivate(): boolean {
    if (this.authService.hasAnyRole([UserRole.Admin, UserRole.Manager, UserRole.Receptionist])) {
      return true;
    }
    this.router.navigate(['/unauthorized']);
    return false;
  }
}
  // canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
  //   throw new Error('Method not implemented.');
  // }
  
  // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
  //   throw new Error('Method not implemented.');
  // }
