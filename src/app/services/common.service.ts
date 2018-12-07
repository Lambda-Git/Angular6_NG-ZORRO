import {Injectable} from '@angular/core';
import {TipService} from '../saas/tip/tip.service';
import {Tip} from '../saas/tip/tip';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private _tipService: TipService) {

  }

  public handlerError(operation = 'operation', err: any) {
    if (typeof err !== 'string') {
      err = err.message;
    }

    this._tipService.openDialog({type: 'error', title: operation, content: err} as Tip);
  }
}
