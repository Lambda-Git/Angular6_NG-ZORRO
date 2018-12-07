import {Injectable} from '@angular/core';
import {CookieService} from 'ngx-cookie';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserAccessService {

  token = undefined;
  token_key = 'saas_token';
  user_key = 'saas_user';
  org_key = 'saas_org';
  type_key = 'saas_org_type';

  constructor(private _cookieService: CookieService) {
    const ck = this._cookieService.get(this.token_key);
    if (ck) {
      this.token = ck;
    }
  }

  isLogin() {
    return this.token !== undefined;
  }

  getToken() {
    if (this.token === undefined) {
      this.token = this._cookieService.get(this.token_key);
    }
    return this.token;
  }

  setToken(t, user = {}) {
    const tout = environment.env['session_timeout'] ? environment.env['session_timeout'] : 600;
    const exDate = new Date((new Date().getTime()) + (tout * 1000));
    this._cookieService.put(this.token_key, t, {expires: exDate});
    this.token = t;
    if (user !== undefined) {
      this._cookieService.putObject(this.user_key, user, {expires: exDate});
    }
  }

  getUserInfo() {
    return this._cookieService.get(this.user_key);
  }

  setUserInfo(user) {
    const tout = environment.env['session_timeout'] ? environment.env['session_timeout'] : 600;
    const exDate = new Date((new Date().getTime()) + (tout * 1000));
    this._cookieService.put(this.user_key, user, {expires: exDate});
  }

  clearToken() {
    this._cookieService.remove(this.token_key);
    this._cookieService.remove(this.user_key);
    this.token = undefined;
  }

  setOrg(org) {
    const tout = environment.env['session_timeout'] ? environment.env['session_timeout'] : 600;
    const exDate = new Date((new Date().getTime()) + (tout * 1000));
    this._cookieService.put(this.org_key, org, {expires: exDate});
  }

  getOrg() {
    return this._cookieService.get(this.org_key);
  }

  setType(type) {
    const tout = environment.env['session_timeout'] ? environment.env['session_timeout'] : 600;
    const exDate = new Date((new Date().getTime()) + (tout * 1000));
    this._cookieService.put(this.type_key, type, {expires: exDate});
  }

  getType() {
    return this._cookieService.get(this.type_key);
  }
}
