import {Component, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Observable, Observer} from 'rxjs';
import {RestService} from '../../../services/rest.service';
import {HostService} from '../../../services/host.service';
import {ContainerService} from '../../../services/container.service'
import {IpValidator} from '../../validator/ipvalidator';
import {DomainValidator} from '../../validator/domainvalidator';
import {hostConfig } from './hostConfig';
import {TipService} from '../../../saas/tip/tip.service';
import {CommonService} from '../../../services/common.service';
import {UserService} from '../../../services/user.service';
import {Tip} from '../../../saas/tip/tip';

@Component({
  selector: 'app-host',
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.css']
})
export class HostComponent implements OnInit {
  /*条件查询*/
  searchForm;
  page = {
    totalElements: 0,
    pageNum: 1,
    pageSize: 10
  };
  /*新增、编辑-表单*/
  validateForm: FormGroup;
  submitForm = ($event, value) => {
    $event.preventDefault();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[ key ].markAsDirty();
      this.validateForm.controls[ key ].updateValueAndValidity();
    }
    console.log(value);
  };
  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[ key ].markAsPristine();
      this.validateForm.controls[ key ].updateValueAndValidity();
    }
  }

  isNew = true;
  row: hostConfig;
  dataSet = [];
  /*弹框组件--增加、编辑---初始化状态*/
  isVisible = false;
  /*弹框组件--容器列表--初始化状态*/
  isContainerVisible = false;
  hostID;
  hostName;
  dataContainerSet = [];
  /*list表单css参数*/
  bordered = false;
  loading = false;
  pagination = true;
  header = true;
  title = true;
  fixHeader = false;
  size = 'Default';
  checkbox = false;
  allChecked = false;
  indeterminate = false;
  displayData = [];
  simple = false;

  currentPageDataChange($event: Array<{ name: string; age: number; address: string; checked: boolean; description: string; }>): void {
    this.displayData = $event;
    this.refreshStatus();
  }

  refreshStatus(): void {
    const validData = this.displayData.filter(value => !value.disabled);
    const allChecked = validData.length > 0 && validData.every(value => value.checked === true);
    const allUnChecked = validData.every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
  }

  /*checkBox全选*/
  checkAll(value: boolean): void {
    this.displayData.forEach(data => {
      if (!data.disabled) {
        data.checked = value;
      }
    });
    this.refreshStatus();
  }

  constructor(private _tipService: TipService,
              private modalService: NzModalService,
              private fb: FormBuilder,
              private _commonService: CommonService,
              private _hostService: HostService,
              private _containerService: ContainerService
  ) {
    /*弹出框数据增加、编辑--赋值+校验*/
    this.validateForm = this.fb.group({
      name: [ '', [ Validators.required ] ],
      ip   : [ '', [ Validators.required] ],
      domain: [ '', [ Validators.required ] ],
    });
  }

  /*初始化*/
  ngOnInit() {
    this.buildForm();
    this.getHosts();
  }

  /*表单初始化赋值*/
  buildForm() {
    /*查询表单初始化赋值*/
    this.searchForm = this.fb.group({
      name: [''],
      ip: ['']
    });
  }

  /*获取查询表单值*/
  updateModel() {
    const query: any = {};
    const val = this.searchForm.getRawValue();
    if (val.name != '') {
      query.name = val.name;
    }
    if (val.ip != '') {
      query.ip = val.ip;
    }
    return query;
  }

  /*获取增加、编辑表单值*/
  updateModelAdd() {
    const val = this.validateForm.getRawValue();
    if (val.name !== '') {
      this.row.name = val.name;
    }
    if (val.ip == '') {
      delete this.row.ip;
    }
    if (val.email != '') {
      this.row.ip = val.ip;
    }
    if (val.domain == '') {
      delete this.row.domain;
    }
    if (val.domain != '') {
      this.row.domain = val.domain;
    }
  }


  /*获取用户列表--条件选择+分页*/
  getHosts() {
    this._hostService.getHostList(this.updateModel(), this.page).subscribe(hosts => {
      if (hosts.data.datas !== undefined) {
        this.dataSet = hosts.data.datas;
        this.page.totalElements = hosts.data.count;
      }
    });
  }


  /*弹框组件出触发事件*/
  showModal(row): void {
    this.isVisible = true;
    if (row != undefined) {
      this.isNew = false;
      this.row = new hostConfig(row);

    } else {
      this.isNew = true;
      this.row = new hostConfig();
    }
    this.validateForm = this.fb.group({
      name: [ this.row.name, [ Validators.required ] ],
      ip   : [ this.row.ip, [ Validators.required] ],
      domain: [ this.row.domain, [ Validators.required ] ]
    });
  }

  /*关闭增加、编辑弹出框*/
  handleCancel(): void {
    this.isVisible = false;
  }


  /*删除*/
  doDel(curRow) {
    this._tipService.openDialog({
      type: 'confirm',
      title: '确认！',
      content: '是否删除主机[' + curRow.name + ']?',
      onOk: () => {
        this._hostService.delHost(curRow.id).subscribe(data => {
          /*关闭、刷新表单*/
          this.handleCancel();
          this.getHosts();
        }, err => {
          /*err后台错误信息返回*/
          this._commonService.handlerError('operation', err);
        });
      },
    } as Tip);
  }


  /*增加、编辑*/
  doSave() {
    this.updateModelAdd();
    this._hostService.doCreateHost(this.row).subscribe(data => {
      /*关闭、刷新表单*/
      this.handleCancel();
      this.getHosts();
    }, err => {
      /*err后台错误信息返回*/
      this._commonService.handlerError('operation', err);
    });
  }

  /*打开container弹出框*/
  showContainer(curRow): void {
    this.hostName = curRow.name;
    this.isContainerVisible = true;
    this.hostID = curRow.id;
    this.getContainer();
  }

  /*根据主机查询容器*/
  getContainer() {
    this._hostService.getContainerByHost(this.hostID).subscribe(data => {
      if (data.data.length != 0 ) {
        this.isContainerVisible = true;
        this.dataContainerSet = data.data;
      } else {
        this._commonService.handlerError('operation','该主机暂时没有容器！');
      }
    })
  }

  /*关闭容器列表弹出框*/
  handleContainerCancel(): void {
    this.isContainerVisible = false;
  }

  /*重新启动容器*/
  reboot(curRow) {
    curRow.hostID = this.hostID;
    this._tipService.openDialog({
      type: 'confirm',
      title: '确认！',
      content: '是否要重启该容器？',
      onOk: () => {
        this._containerService.rebootContainer(curRow).subscribe(data => {
          /*关闭、刷新表单*/
          this.handleContainerCancel();
          this.getContainer();
          this.getHosts();
        }, err => {
          /*err后台错误信息返回*/
          this._commonService.handlerError('operation', err);
        });
      },
    } as Tip);
  }


  /*kill*/
  kill(curRow) {
    curRow.hostID = this.hostID;
    this._tipService.openDialog({
      type: 'confirm',
      title: '确认！',
      content: '是否杀死该容器?',
      onOk: () => {
        this._containerService.killContainer(curRow).subscribe(data => {
          /*关闭、刷新表单*/
          this.handleContainerCancel();
          this.getContainer();
          this.getHosts();
        }, err => {
          /*err后台错误信息返回*/
          this._commonService.handlerError('operation', err);
        });
      },
    } as Tip);
  }
}



