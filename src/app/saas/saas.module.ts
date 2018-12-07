import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TipService} from './tip/tip.service';
import {NgZorroAntdModule, NzFormModule} from 'ng-zorro-antd';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NgZorroAntdModule,
  ],
  providers: [TipService]
})
export class SaasModule {
}
