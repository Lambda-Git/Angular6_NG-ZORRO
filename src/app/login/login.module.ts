import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgZorroAntdModule, NzFormModule} from 'ng-zorro-antd';
import {RouterModule, Routes} from '@angular/router';


const appRoutes: Routes = [
  {path: '', component: LoginComponent},
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NgZorroAntdModule,
    RouterModule.forChild(appRoutes),
  ],
  exports: [RouterModule],
  declarations: [LoginComponent]
})


export class LoginModule {

}
