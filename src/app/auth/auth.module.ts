import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AuthComponent} from './auth.component';
import {OverviewComponent} from './overview/overview.component';
import {RouterModule} from '@angular/router';
import {appRoutes} from './lazyLoader.routes';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgZorroAntdModule, NzFormModule, NzLayoutModule} from 'ng-zorro-antd';
import {HostComponent} from './config/host/host.component';
import {IdentityComponent} from './config/identity/identity.component';
import {ContainerComponent} from './config/container/container.component';
import {ChannelComponent as ConfigChannelCompoent} from './config/channel/channel.component';
import {ChannelComponent as BrowserChannelComponent} from './browser/channel/channel.component';
import {ListComponent as MessageListComponent} from './message/list/list.component';
import {ListComponent as UserListComponent} from './user/list/list.component';
import {ListComponent as ContainerListComponent} from './container/list/list.component';
import {ChaincodeComponent} from './browser/chaincode/chaincode.component';
import {ChangepasswordComponent} from './user/changepassword/changepassword.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NgZorroAntdModule,
    NzLayoutModule,
    RouterModule.forChild(appRoutes),
  ],
  declarations: [AuthComponent, OverviewComponent, HostComponent, IdentityComponent,
    ContainerComponent, ConfigChannelCompoent, BrowserChannelComponent,
    MessageListComponent, UserListComponent, ContainerListComponent,
    ChaincodeComponent, ChangepasswordComponent],
  entryComponents: [ChangepasswordComponent]
})
export class AuthModule {
}
