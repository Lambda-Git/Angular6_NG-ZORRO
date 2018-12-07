import {Routes} from '@angular/router';
import {AuthComponent} from './auth.component';
import {OverviewComponent} from './overview/overview.component';
import {HostComponent} from './config/host/host.component';
import {ChannelComponent} from './config/channel/channel.component';
import {ContainerComponent} from './config/container/container.component';
import {IdentityComponent} from './config/identity/identity.component';
import {ChannelComponent as BrowserChannelComponent} from './browser/channel/channel.component';
import {ListComponent as ContainerListComponent} from './container/list/list.component';
import {ListComponent as MessageListComponent} from './message/list/list.component';
import {ListComponent as UserListComponent} from './user/list/list.component';
import {ChaincodeComponent} from './browser/chaincode/chaincode.component';

export const appRoutes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {path: 'overview', component: OverviewComponent},
      {path: 'config/identity', component: IdentityComponent},
      {path: 'config/channel', component: ChannelComponent},
      {path: 'config/container', component: ContainerComponent},
      {path: 'config/host', component: HostComponent},
      {path: 'browser/channel', component: BrowserChannelComponent},
      {path: 'browser/chaincode', component: ChaincodeComponent},
      {path: 'container/list', component: ContainerListComponent},
      {path: 'message/list', component: MessageListComponent},
      {path: 'user/list', component: UserListComponent},
    ]
  }
];
