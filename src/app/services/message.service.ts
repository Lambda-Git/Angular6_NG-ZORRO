import {Injectable} from '@angular/core';
import {RestService} from './rest.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private _restService: RestService) {
  }


  public getMessageList(q, page): Observable<any> {
    const u = Object.assign({}, q, page);
    console.log(u);
    return Observable.create(observer => {
      this._restService.post('saas/message/list', u, {auth: true}).subscribe(data => {
        if (data.code !== 0) {
          observer.error(data.message);
          return;
        }
        observer.next(data);
        observer.complete();
      });
    });
  }

  public delMsg(ids) {
    return Observable.create(observer => {
      this._restService.post('saas/message/delete', ids, {auth: true}).subscribe(data => {
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
