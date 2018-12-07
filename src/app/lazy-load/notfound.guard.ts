import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {UserAccessService} from '../services/user-access.service';

@Injectable({
  providedIn: 'root'
})
export class NotfoundGuard implements CanActivate {

  constructor(private _userAccess: UserAccessService,
              private _router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this._userAccess.getToken()) {
      this._router.navigate(['/saas/auth/overview']);
      return false;
    }
    return true;
  }
}
