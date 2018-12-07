import {Component, OnInit} from '@angular/core';
import {UserService} from '../services/user.service';
import {UserAccessService} from '../services/user-access.service';
import {NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {ChangepasswordComponent} from './user/changepassword/changepassword.component';
import {WebSocketService} from '../services/web-socket.service';
import {environment} from '../../environments/environment';
import {CommonService} from '../services/common.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor(private _userService: UserService,
              private _userAccessService: UserAccessService,
              private _modalService: NzModalService,
              private _commonService: CommonService,
              private _webSocketService: WebSocketService,
              private _notification: NzNotificationService) {
  }


  ngOnInit() {
    this._webSocketService.createObservableSocket(environment.env['wsURL']).subscribe(data => {
      let title = '通知';
      title = '共识信息';
      if (data['type'] === 'ORG') {
        title = '组织信息';
      } else if (data['type'] === 'CHANNEL') {
        title = '通道信息';
      } else if (data['type'] === 'CHAINCODE') {
        title = '合约信息';
      } else if (data['type'] === 'CONSENSUS') {
      }
      this._notification.info(title, data['body']);
    }, err => {
      console.error(err);
    }, () => {
      console.log('流已经结束');
    });
    this._userService.getCurrentLoginUser().subscribe(result => {
      if (result) {
        if (result.code === 0) {
          this._userAccessService.setUserInfo(result.data);
          this._userService.getCurrentOrg().subscribe(res => {
            if (res && res.code === 0) {
              this._userAccessService.setOrg(res.data);
            } else {
              this._commonService.handlerError('后台错误', result.message);
            }
          }, err => {
            this._commonService.handlerError('获取当前组织', err);
          });
          this._userService.getCurrentOrgType().subscribe(res => {
            if (res && res.code === 0) {
              this._userAccessService.setType(res.data);
            } else {
              this._commonService.handlerError('后台错误', result.message);
            }
          }, err => {
            this._commonService.handlerError('获取当前组织', err);
          });
        } else {
          this._commonService.handlerError('后台错误', result.message);
        }
      }
    }, err => {
      this._commonService.handlerError('获取当前用户', err);
    });
  }

  public logout() {
    this._userService.doLogout();
  }

  public changePassword() {
    this._modalService.create({
      nzContent: ChangepasswordComponent,
      nzCancelText: null,
      nzOkText: null,
      nzWidth: 350,
      nzFooter: null,
      nzMaskClosable: false
    });
  }
}
