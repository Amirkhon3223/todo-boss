import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private _authService: AuthService, private router: Router) {
  }

  canActivate(): Observable<boolean | UrlTree> {
    return this._authService.isLoggedIn$().pipe(
      map(isLoggedIn => {
        if (isLoggedIn && this._authService.isAdmin()) {
          return true;
        } else {
          return this.router.createUrlTree(['/access-denied']);
        }
      })
    );
  }
}
