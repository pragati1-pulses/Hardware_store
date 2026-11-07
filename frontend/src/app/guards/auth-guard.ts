import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // 1. If not logged in, go to login page
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }

    // 2. Check if the route requires specific roles
    const user = this.authService.getUser();
    const requiredRoles = route.data['roles'] as Array<string>;

    if (requiredRoles && !requiredRoles.includes(user.role)) {
      // 🚀 INSTEAD OF alert(), REDIRECT TO THE NEW SCREEN
      this.router.navigate(['/access-denied']); 
      return false;
    }

    return true;
  }
}