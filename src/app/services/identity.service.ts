import { Injectable } from '@angular/core';
import {RestService} from './rest.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IdentityService {

  constructor(private _restService: RestService
  ) {
  }

  /*查询我的主身份*/
  public getIdentityInfo(): Observable<any> {
    // const u = Object.assign({}, q, page);
    const u ={

    }
    return Observable.create(observer => {
      this._restService
        .post('saas/ca/list', u ,{auth: true})
        .subscribe(data => {
          if (data.code != 0) {
            observer.error(data.message);
            return;
          }
          observer.next(data.data);
          observer.complete();
        });
    });
  }


  /*我的身份新增、更新*/
  public doOrgCardSave(data): Observable<any> {
    if (data.id == undefined ) {
      /*我的身份-新增*/
      return Observable.create(observer => {
        this._restService
          .post('saas/ca/save', data ,{auth: true})
          .subscribe(data => {
            if (data.code != 0) {
              observer.error(data.message);
              return;
            }
            observer.next(data);
            observer.complete();
          });
      });
    } else {
      /*我的身份-更新*/
      return Observable.create(observer => {
        this._restService
          .post('saas/ca/update', data ,{auth: true})
          .subscribe(data => {
            if (data.code != 0) {
              observer.error(data.message);
              return;
            }
            observer.next(data);
            observer.complete();
          });
      });
    }

  }

  /*查询全网身份信息列表*/
  public geAlltIdentityInfo(q, page): Observable<any> {
    const u = Object.assign({}, q, page);
    return Observable.create(observer => {
      this._restService
        .post('saas/org/list', u ,{auth: true})
        .subscribe(data => {
          if (data.code != 0) {
            observer.error(data.message);
            return;
          }
          observer.next(data);
          observer.complete();
        });
    });
  }



}
