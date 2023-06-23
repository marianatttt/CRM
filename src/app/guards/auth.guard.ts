import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import { AuthService } from '../services';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (this.authService.isAuthenticated()) {
      if (state.url === '/' || state.url === '/auth/login') {
        this.router.navigateByUrl('/order');
      }
      return true;
    } else {
      this.router.navigateByUrl('/auth/login');
      return false;
    }
  }
}
