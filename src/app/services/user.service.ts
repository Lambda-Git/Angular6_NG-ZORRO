import {Injectable} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {Md5} from 'ts-md5';
import {RestService} from './rest.service';
import {environment} from '../../environments/environment';
import {UserAccessService} from './user-access.service';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  currentUser;
  private _tokenChecker: Subscription;

  constructor(private _rest: RestService,
              private _userAccess: UserAccessService,
              private _router: Router) {
  }

  // 登录
  public doLogin(user): Observable<any> {
    /*跳过后台校验-登录通过*/
    return Observable.create( observer => {
      this._userAccess.setToken('12345678901232331');
      observer.next(true);
      observer.complete();
    })

    /*const param = {
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
    });*/
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

  // 获取当前登录用户
  public getCurrentLoginUser(): Observable<any> {
    return Observable.create(observer => {
      this._rest.post('saas/user/info', {}, {auth: true}).subscribe(data => {
        if (data) {
          observer.next(data);
          observer.complete();
        } else {
          observer.next(false);
          observer.complete();
        }
      });
    });
  }

  // 获取的组织名称
  public getCurrentOrg(): Observable<any> {
    return Observable.create(observer => {
      this._rest.post('saas/org/self', {}, {auth: true}).subscribe(data => {
        if (data) {
          observer.next(data);
          observer.complete();
        } else {
          observer.next(false);
          observer.complete();
        }
      });
    });
  }


  // 获取的组织的类型
  public getCurrentOrgType(): Observable<any> {
    return Observable.create(observer => {
      this._rest.post('saas/org/type', {}, {auth: true}).subscribe(data => {
        if (data) {
          observer.next(data);
          observer.complete();
        } else {
          observer.next(false);
          observer.complete();
        }
      });
    });
  }


  /*添加或编辑用户*/
  public doCreateUser(user): Observable<any> {
    const u = {
      id: user.id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      active: user.active,
      role: user.role
    };
    if (u.id === undefined) {
      /*新增用户*/
      const key = 'password';
      const value = Md5.hashStr('1234$5678');
      u[key] = value;
      return Observable.create(observer => {
        this._rest.post('saas/user/add', u, {auth: true}).subscribe(data => {
          if (data.code !== 0) {
            observer.error(data.message);
            return;
          }
          observer.next(data);
          observer.complete();
        });
      });
    } else {
      /*修改用户*/
      return Observable.create(observer => {
        this._rest.post('saas/user/update', u, {auth: true}).subscribe(data => {
          if (data.code !== 0) {
            observer.error(data.message);
            return;
          }
          observer.next(data);
          observer.complete();
        });
      });
    }
  }

  /*删除用户*/
  public delUser(ids): Observable<any> {
    return Observable.create(observer => {
      this._rest.post('saas/user/delete', ids, {auth: true}).subscribe(data => {
        if (data.code !== 0) {
          observer.error(data.message);
          return;
        }
        observer.next(data);
        observer.complete();
      });
    });
  }

  /*查询用户列表*/
  public getUserList(q, page): Observable<any> {
    /*assign合并两个对象，过滤undefined*/
    const u = Object.assign({}, q, page);
    return Observable.create(observer => {
      this._rest.post('saas/user/list', u, {auth: true}).subscribe(data => {
        if (data.code !== 0) {
          observer.error(data.message);
          return;
        }
        observer.next(data);
        observer.complete();
      });
    });
  }

  /*启用或禁用用户*/
  public changeUserStatus(data): Observable<any> {
    const u = {
      id: data.id,
      active: data.active
    };
    return Observable.create(observer => {
      this._rest.post('saas/user/active', u, {auth: true}).subscribe(result => {
        if (result.code !== 0) {
          observer.error(result.message);
          return;
        }
        observer.next(result);
        observer.complete();
      });
    });
  }

  /*修改密码*/
  public changeUserPassword(data): Observable<any> {
    /*Md5处理后为32位*/
    const salt = environment.env['salt'];
    data['oldPass'] = Md5.hashStr(data['oldPass'] + salt);
    data['newPass'] = Md5.hashStr(data['newPass'] + salt);
    data['confirmPass'] = Md5.hashStr(data['confirmPass'] + salt);
    return Observable.create(observer => {
      this._rest.post('saas/user/changePass', data, {auth: true}).subscribe(result => {
        if (result.code !== 0) {
          observer.error(result.message);
          return;
        }
        observer.next(result);
        observer.complete();
      });
    });
  }
}
