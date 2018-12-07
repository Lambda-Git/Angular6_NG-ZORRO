import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {RestService} from './rest.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private _restService: RestService) {
  }


  /*查询我的主身份*/
  public getIdentityInfo(q, page): Observable<any> {
    const u = Object.assign({}, q, page);
    return Observable.create(observer => {
      this._restService
        .post('saas/ca/list', u)
        .subscribe(data => {
          if (data.code !== 0) {
            observer.error(data.message);
            return;
          }
          observer.next(data.data);
          observer.complete();
        });
    });
  }

  /*我的身份保存--更新我的身份*/
  public doOrgCardSave(data): Observable<any> {
    if (data.id === undefined) {
      /*我的身份保存*/
      return Observable.create(observer => {
        this._restService
          .post('saas/ca/save', data)
          .subscribe(result => {
            if (result.code !== 0) {
              observer.error(result.message);
              return;
            }
            observer.next(result);
            observer.complete();
          });
      });
    } else {
      /*更新我的身份*/
      return Observable.create(observer => {
        this._restService
          .post('saas/ca/update', data)
          .subscribe(result => {
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

  /*查询所有的身份信息列表*/
  public geAlltIdentityInfo(q, page): Observable<any> {
    const u = Object.assign({}, q, page);
    return Observable.create(observer => {
      this._restService
        .post('saas/org/list', u)
        .subscribe(data => {
          if (data.code !== 0) {
            observer.error(data.message);
            return;
          }
          observer.next(data);
          observer.complete();
        });
    });
  }

  /*容器配置管理服务*/

  /*ca查询*/
  public getCa(q, page): Observable<any> {
    const u = Object.assign({}, q, page);
    u.type = 'CA';
    return Observable.create(observer => {
      this._restService
        .post('saas/config/list', u)
        .subscribe(data => {
          if (data.code !== 0) {
            observer.error(data.message);
            return;
          }
          observer.next(data);
          observer.complete();
        });
    });
  }

  /*新增或编辑ca*/
  public doCaSave(row): Observable<any> {
    if (row.id === undefined) {
      /*新增ca*/
      return Observable.create(observer => {
        this._restService
          .post('saas/config/ca', row)
          .subscribe(data => {
            if (data.code !== 0) {
              observer.error(data.message);
              return;
            }
            observer.next(data);
            observer.complete();
          });
      });
    } else {
      /*修改ca*/
      return Observable.create(observer => {
        this._restService
          .post('saas/config/ca', row)
          .subscribe(data => {
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

  /*启动ca*/
  public setOnHost(row): Observable<any> {
    const u = {
      configID: row.configID,
      hostID: row.id,
    };
    return Observable.create(observer => {
      this._restService
        .post('saas/container/start', u)
        .subscribe(data => {
          if (data.code !== 0) {
            observer.error(data.message);
            return;
          }
          observer.next(data);
          observer.complete();
        });
    });
  }

  /*peer查询*/
  public getPeer(q, page): Observable<any> {
    const u = Object.assign({}, q, page);
    u.type = 'PEER';
    return Observable.create(observer => {
      this._restService
        .post('saas/config/list', u)
        .subscribe(data => {
          if (data.code !== 0) {
            observer.error(data.message);
            return;
          }
          observer.next(data);
          observer.complete();
        });
    });
  }

  /*新增或编辑peer*/
  public doPeerSave(row): Observable<any> {
    if (row.id === undefined) {
      /*新增peer*/
      return Observable.create(observer => {
        this._restService
          .post('saas/config/peer', row)
          .subscribe(data => {
            if (data.code !== 0) {
              observer.error(data.message);
              return;
            }
            observer.next(data);
            observer.complete();
          });
      });
    } else {
      /*修改peer*/
      return Observable.create(observer => {
        this._restService
          .post('saas/config/peer', row)
          .subscribe(data => {
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


  /*couchdb查询*/
  public getCouchdb(q, page): Observable<any> {
    const u = Object.assign({}, q, page);
    u.type = 'COUCHDB';
    return Observable.create(observer => {
      this._restService
        .post('saas/config/list', u)
        .subscribe(data => {
          if (data.code !== 0) {
            observer.error(data.message);
            return;
          }
          observer.next(data);
          observer.complete();
        });
    });
  }

  /*新增或编辑couchdb*/
  public doCouchdbSave(row): Observable<any> {
    if (row.id === undefined) {
      /*新增couchdb*/
      return Observable.create(observer => {
        this._restService
          .post('saas/config/couchdb', row)
          .subscribe(data => {
            if (data.code !== 0) {
              observer.error(data.message);
              return;
            }
            observer.next(data);
            observer.complete();
          });
      });
    } else {
      /*修改couchdb*/
      return Observable.create(observer => {
        this._restService
          .post('saas/config/couchdb', row)
          .subscribe(data => {
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
}
