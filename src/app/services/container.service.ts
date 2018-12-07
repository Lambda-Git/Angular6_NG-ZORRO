import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {RestService} from './rest.service';

@Injectable({
  providedIn: 'root'
})
export class ContainerService {

  constructor(private _restService: RestService) {
  }


  /*重启容器*/
  public rebootContainer(row): Observable<any> {
    const u = {
      hostID: row.hostID,
      containerID: row.containerID,
    };
    return Observable.create(observer => {
      this._restService
        .post('saas/container/restart', u ,{auth: true})
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


  /*kill容器*/
  public killContainer(row): Observable<any> {
    const u = {
      hostID: row.hostID,
      containerID: row.containerID,
    };
    return Observable.create(observer => {
      this._restService
        .post('saas/container/kill', u ,{auth: true})
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

  /*ca查询*/
  public getCa(): Observable<any> {
    const u = {
      type: 'CA'
    };
    return Observable.create(observer => {
      this._restService
        .post('saas/config/list', u ,{auth: true})
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

  /*新增或编辑ca*/
  public doCaSave(row): Observable<any> {
    if (row.id == undefined) {
      /*新增ca*/
      return Observable.create(observer => {
        this._restService
          .post('saas/config/ca', row ,{auth: true})
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
      /*修改ca*/
      return Observable.create(observer => {
        this._restService
          .post('saas/config/ca', row , {auth: true})
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

  /*启动ca*/
  public setOnHost(row): Observable<any> {
    const u = {
      configID: row.configID,
      hostID: row.id,
    };
    return Observable.create(observer => {
      this._restService
        .post('saas/container/start', u ,{auth: true})
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

  /*peer查询*/
  public getPeer(): Observable<any> {
    const u = {
      type: 'PEER'
    };
    return Observable.create(observer => {
      this._restService
        .post('saas/config/list', u ,{auth: true})
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

  /*新增或编辑peer*/
  public doPeerSave(row): Observable<any> {
    if (row.id == undefined) {
      /*新增peer*/
      return Observable.create(observer => {
        this._restService
          .post('saas/config/peer', row ,{auth: true})
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
      /*修改peer*/
      return Observable.create(observer => {
        this._restService
          .post('saas/config/peer', row ,{auth: true})
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

  /*peer ---设为anchorPeer/取消anchorPeer */
  public turnAnchorPeer(row): Observable<any> {
    const u = {
      id: row.id,
      anchorPeer: row.anchorPeer,
    };
    return Observable.create(observer => {
      this._restService
        .post('saas/config/peer/anchor', u ,{auth: true})
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

  /*couchdb查询*/
  public getCouchdb(q, page): Observable<any> {
    const u = {
      type: 'COUCHDB'
    };
    return Observable.create(observer => {
      this._restService
        .post('saas/config/list', u ,{auth: true})
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

  /*新增或编辑couchdb*/
  public doCouchdbSave(row): Observable<any> {
    if (row.id == undefined) {
      /*新增couchdb*/
      return Observable.create(observer => {
        this._restService
          .post('saas/config/couchdb', row ,{auth: true})
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
      /*修改couchdb*/
      return Observable.create(observer => {
        this._restService
          .post('saas/config/couchdb', row ,{auth: true})
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




}
