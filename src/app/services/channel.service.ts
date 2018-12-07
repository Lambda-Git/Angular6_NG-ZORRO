import {Injectable} from '@angular/core';
import {RestService} from './rest.service';
import {Channel} from '../auth/model/channel';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  constructor(private _restService: RestService) {
  }

  public add(channel: Channel): void {
    const channelJSON = JSON.stringify(channel);
    this._restService.post('saas/channel/add', channelJSON, {auth: true}).subscribe(result => {

    });
  }

  /*增加、更新通道*/
  public addPassWay(row): Observable<any> {
    /*增加通道*/
    const u = {
      genesisBlock: true,
    }
    const w = Object.assign({}, row, u);
    return Observable.create(observer => {
      this._restService
        .post('saas/channel/add', w,{auth: true})
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

  /*获取通道*/
  public getChannel(q,page): Observable<any> {
    /*assign合并两个对象，过滤undefined*/
    const u = Object.assign({}, q, page);
    return Observable.create(observer => {
      this._restService
        .post('saas/channel/page', u ,{auth: true})
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

  /*查询没有被使用共识名称consensus*/
  public getConsensus(): Observable<any> {
    const u = {
      used: false
    };
    return Observable.create(observer => {
      this._restService
        .post('saas/consensus/list', u ,{auth: true})
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
