import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from './auth.guard';
import {NotfoundGuard} from './notfound.guard';

const routes: Routes = [
  {path: '', redirectTo: 'saas/login', pathMatch: 'full'},
  {path: 'saas/login', loadChildren: '../login/login.module#LoginModule', canActivate: [NotfoundGuard]},
  {path: 'saas/auth', loadChildren: '../auth/auth.module#AuthModule', canActivate: [AuthGuard]},
  {path: '**', redirectTo: '/saas/login'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class LazyLoadModule {
}
