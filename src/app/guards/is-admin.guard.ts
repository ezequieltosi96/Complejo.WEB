import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class IsAdminGuard implements CanActivate {

  constructor(private readonly authService: AuthService, private readonly router: Router) {}
  
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if(!this.authService.isLoggedIn()) {
      this.router.navigate(['auth/login']);
      return false;
    }

    if(!this.authService.getUserContext()?.isAdmin) {
      this.router.navigate(['unauthorized']);
      return false;
    }

    return true;
  }
  
}
