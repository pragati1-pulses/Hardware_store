import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // 1. Check if logged in
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    const user = this.authService.getUser();
    const requiredRoles = route.data['roles'] as Array<string>;
    const requiredModule = route.data['moduleKey'] as string; // <-- New

    // 2. Check Role Restrictions (e.g., only super_admin for settings)
    if (requiredRoles && !requiredRoles.includes(user.role)) {
      this.router.navigate(['/access-denied']); 
      return false;
    }

    // 3. Check Module Restrictions (e.g., does this user have 'sales' enabled?)
    if (requiredModule && !this.authService.hasModuleAccess(requiredModule)) {
      this.router.navigate(['/access-denied']); 
      return false;
    }

    return true;
  }
}