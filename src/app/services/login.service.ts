import {Injectable} from '@angular/core';
import {RestService} from './rest.service';
import {Observable, Subscription} from 'rxjs';
import {UserAccessService} from './user-access.service';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';
import {Md5} from 'ts-md5';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  currentUser;
  private _tokenChecker: Subscription;

  constructor(private _rest: RestService,
              private _userAccess: UserAccessService,
              private _router: Router) {
  }

  // 登录
  public doLogin(user): Observable<any> {
    const param = {
      username: user.username,
      password: Md5.hashStr(user.password + environment.env['salt']),
      code: user.code
    };
    return Observable.create(observer => {
      this._rest.post('saas/user/login', param, {auth: false}).subscribe(data => {
        if (data.code !== 0) {
          observer.error(data.message);
          return;
        } else {
          if (data.data === undefined) {
            observer.error(data.message);
            return;
          } else {
            this._userAccess.setToken(data.data);
            observer.next(true);
            observer.complete();
          }
        }
      }, err => {
          observer.error(err);
      });
    });
  }

  // 登出
  public doLogout() {
    this.currentUser = undefined;
    this._userAccess.clearToken();
    if (this._tokenChecker !== undefined) {
      this._tokenChecker.unsubscribe();
    }
    this._router.navigate([environment.env.token_err_url]);
  }
}
