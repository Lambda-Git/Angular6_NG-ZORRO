import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {HashLocationStrategy, LocationStrategy, registerLocaleData} from '@angular/common';
import zh from '@angular/common/locales/zh';
import {LazyLoadModule} from './lazy-load/lazy-load.module';
import {NgZorroAntdModule, NZ_I18N, zh_CN} from 'ng-zorro-antd';
import {SaasModule} from './saas/saas.module';
import {CookieModule} from 'ngx-cookie';
import {NgxSpinnerModule} from 'ngx-spinner';

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    LazyLoadModule,
    SaasModule,
    NgZorroAntdModule,
    NgxSpinnerModule,
    CookieModule.forRoot(),
  ],
  providers: [{provide: NZ_I18N, useValue: zh_CN}, {provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
