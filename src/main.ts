import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';
import {environmentLoader as environmentLoaderPromise} from './environments/environmentLoader';

environmentLoaderPromise.then(env => {
  if (environment.production) {
    enableProdMode();
  }
  environment.env = env;
  platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.error(err));
});


