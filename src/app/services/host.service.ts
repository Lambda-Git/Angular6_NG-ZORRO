import {Injectable} from '@angular/core';
import {RestService} from './rest.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HostService {

  constructor(private _restService: RestService) {
  }

  /*查询主机*/
  public getHostList(q, page): Observable<any> {
    const u = Object.assign({}, q, page);
    u.active = 1;
    return Observable.create(observer => {
      this._restService
        .post('saas/host/list', u, {auth: true})
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


  /*根据主机id查询容器*/
  public getContainerByHost(row): Observable<any> {
    const u = {
      id: row
    };
    return Observable.create(observer => {
      this._restService
        .post('saas/host/list/container', u ,{auth: true})
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

  /*根据主机id、容器id查询info*/
  public getContainerInfo(row): Observable<any> {
    const u = {
      containerID: row.containerID,
      hostID: row.hostID
    };
    return Observable.create(observer => {
      this._restService
        .post('saas/container/info', u ,{auth: true})
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


  /*新增或编辑主机*/
  public doCreateHost(host): Observable<any> {
    if (host.id === undefined) {
      /*新增主机*/
      const u = {
        active: 1,
        domain: host.domain,
        ip: host.ip,
        name: host.name,
        port: host.port,
        protocol: host.protocol,
        type: host.type,

      };
      return Observable.create(observer => {
        this._restService
          .post('saas/host/add', u ,{auth: true})
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
      /*修改主机*/
      const u = {
        id: host.id,
        active: 0,
        name: host.name,
        domain: host.domain,
      };
      return Observable.create(observer => {
        this._restService
          .post('saas/host/update', u ,{auth: true})
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

  /*删除主机*/
  public delHost(id): Observable<any> {
    const u = {
      id: id,
    };
    return Observable.create(observer => {
      this._restService
        .post('saas/host/delete', u ,{auth: true})
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
