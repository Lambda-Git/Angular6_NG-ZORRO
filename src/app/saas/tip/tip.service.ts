import {Injectable} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {Tip} from './tip';

@Injectable({
  providedIn: 'root'
})
export class TipService {
  constructor(private modalService: NzModalService) {
  }

  openDialog(tip: Tip) {
    let nzCancelText = '取消';
    let nzOkText = '确定';
    if (['error', 'info', 'success'].indexOf(tip.type) >= 0) {
      nzCancelText = null;
      if (['info', 'success'].indexOf(tip.type) >= 0) {
        nzOkText = null;
      }
    }
    if (tip.type === 'info') {
      const modal = this.modalService.info({
        nzTitle: tip.title,
        nzContent: tip.content,
        nzOkText: nzOkText
      });
      setTimeout(() => modal.destroy(), 1500);
    } else if (tip.type === 'success') {
      const modal = this.modalService.success({
        nzTitle: tip.title,
        nzContent: tip.content,
        nzOkText: nzOkText
      });
      setTimeout(() => modal.destroy(), 1500);
    } else if (tip.type === 'error') {
      const modal = this.modalService.error({
        nzTitle: tip.title,
        nzContent: tip.content,
        nzCancelText: nzCancelText,
        nzOnOk: () => {
          if (tip.onOk) {
            tip.onOk();
          }
          modal.close();
        }
      });
    } else {
      const modal = this.modalService.confirm({
        nzTitle: tip.title,
        nzContent: tip.content,
        nzOnOk: () => {
          if (tip.onOk) {
            tip.onOk();
          }
          modal.destroy();
        },
        nzOnCancel: () => {
          if (tip.onCancel) {
            tip.onCancel();
          }
          modal.destroy();
        }
      });
    }
  }
}
