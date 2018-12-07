import {Component, OnInit} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CommonService} from '../../../services/common.service';
import {UserConfig} from './userConfig';
import {UserService} from '../../../services/user.service';
import {TipService} from '../../../saas/tip/tip.service';
import {Tip} from '../../../saas/tip/tip';
import {PhoneValidator} from '../../validator/phonevalidator';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  /*条件查询*/
  searchForm;
  page = {
    totalElements: 0,
    pageNum: 1,
    pageSize: 10
  };
  activeOptions = [
    {value: -1, label: '请选择', isLeaf: true},
    {value: 1, label: '是', isLeaf: true},
    {value: 0, label: '否', isLeaf: true}
  ];
  activeOptionsAdd = [
    {value: 1, label: '是', isLeaf: true},
    {value: 0, label: '否', isLeaf: true}
  ];
  roleOptions = [
    {value: -1, label: '请选择', isLeaf: true},
    {value: 1, label: '系统管理员', isLeaf: true},
    {value: 0, label: '普通用户', isLeaf: true}
  ];
  roleOptionsAdd = [
    {value: 1, label: '系统管理员', isLeaf: true},
    {value: 0, label: '普通用户', isLeaf: true}
  ];
  /*新增、编辑-表单*/
  validateForm: FormGroup;
  isNew = true;
  row: UserConfig;
  dataSet = [];
  /*弹框组件--初始化不显示*/
  isVisible = false;
  /*list表单css参数*/
  bordered = false;
  loading = false;
  pagination = true;
  header = true;
  title = true;
  fixHeader = false;
  size = 'Default';
  checkbox = true;
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
              private _userService: UserService
  ) {

    /*弹出框数据增加、编辑--赋值+校验*/
    this.validateForm = this.fb.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.email]],
      phone: [''],
      active: [0, [Validators.required]],
      role: [0, [Validators.required]],
    });
  }

  /*初始化*/
  ngOnInit() {
    this.buildForm();
    this.getUsers();
  }

  /*表单初始化赋值*/
  buildForm() {
    /*查询表单初始化赋值*/
    this.searchForm = this.fb.group({
      username: [''],
      active: [-1],
      role: [-1]
    });
  }

  /*获取查询表单值*/
  updateModel() {
    const query: any = {};
    const val = this.searchForm.getRawValue();
    if (val.username != '') {
      query.username = val.username;
    }
    if (val.active != -1) {
      /*字符串转number类型*/
      query.active = parseInt(val.active, 10);
    }
    if (val.role != -1) {
      query.role = parseInt(val.role, 10);
    }
    return query;
  }

  /*获取增加、编辑表单值*/
  updateModelAdd() {
    const val = this.validateForm.getRawValue();
    if (val.username !== '') {
      this.row.username = val.username;
    }
    if (val.email == '') {
      delete this.row.email;
    }
    if (val.email != '') {
      this.row.email = val.email;
    }
    if (val.phone == '') {
      delete this.row.phone;
    }
    if (val.phone != '') {
      this.row.phone = val.phone;
    }
    this.row.active = parseInt(val.active, 10);
    this.row.role = parseInt(val.role, 10);
  }


  /*获取用户列表--条件选择+分页*/
  getUsers() {
    this._userService.getUserList(this.updateModel(), this.page).subscribe(users => {
      if (users.data.datas !== undefined) {
        this.dataSet = users.data.datas;
        this.page.totalElements = users.data.count;
      }
    });
  }


  /*弹框组件出触发事件*/
  showModal(row): void {
    this.isVisible = true;
    console.log(row);
    if (row !== undefined) {
      this.isNew = false;
      this.row = new UserConfig(row);
    } else {
      this.isNew = true;
      this.row = new UserConfig();
    }
    this.validateForm = this.fb.group({
      username: [this.row.username, [Validators.required, Validators.minLength(8)]],
      email: [this.row.email, [Validators.email]],
      phone: [this.row.phone],
      active: [this.row.active, [Validators.required]],
      role: [this.row.role, [Validators.required]],
    }, {validator: PhoneValidator});
  }

  /*关闭弹出框*/
  handleCancel(): void {
    this.isVisible = false;
  }

  /*增加、编辑-表单提交*/
  submitForm = ($event, value) => {
    $event.preventDefault();
    for (const key in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(key)) {
        this.validateForm.controls[key].markAsDirty();
        this.validateForm.controls[key].updateValueAndValidity();
      }
    }
  }

  /*重置表单填写数据*/
  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(key)) {
        this.validateForm.controls[key].markAsPristine();
        this.validateForm.controls[key].updateValueAndValidity();
      }
    }
  }

  /*删除*/
  doDel(curRow) {
    const delUserData = [];
    delUserData.push(curRow.id);
    this._tipService.openDialog({
      type: 'confirm',
      title: '确认！',
      content: '是否真正删除用户[' + curRow.username + ']?',
      onOk: () => {
        this._userService.delUser(delUserData).subscribe(data => {
          /*关闭、刷新表单*/
          this.handleCancel();
          this.getUsers();
        }, err => {
          /*err后台错误信息返回*/
          this._commonService.handlerError('operation', err);
        });
      },
    } as Tip);
  }

  /*批量删除*/
  doDels() {
    const delUserData = [];
    this.dataSet.forEach(data => {
      if (data.checked === true) {
        delUserData.push(data.id);
      }
    });
    this._tipService.openDialog({
      type: 'confirm',
      title: '用户信息！',
      content: '是否批量删除用户?',
      onOk: () => {
        this._userService.delUser(delUserData).subscribe(data => {
          /*关闭、刷新表单*/
          this.handleCancel();
          this.getUsers();
        }, err => {
          /*err后台错误信息返回*/
          this._commonService.handlerError('operation', err);
        });
      },
    } as Tip);
  }

  /*激活用户*/
  turnOn(curRow) {
    this._tipService.openDialog({
      type: 'confirm',
      title: '用户信息！',
      content: '是否激活用户[' + curRow.username + ']?',
      onOk: () => {
        curRow.active = 1;
        this._userService.changeUserStatus(curRow).subscribe(data => {
          /*关闭、刷新表单*/
          this.handleCancel();
          this.getUsers();
        }, err => {
          /*err后台错误信息返回*/
          this._commonService.handlerError('operation', err);
        });
      },
    } as Tip);
  }

  /*禁用用户*/
  turnOff(curRow) {
    this._tipService.openDialog({
      type: 'confirm',
      title: '用户信息！',
      content: '是否禁用用户[' + curRow.username + ']?',
      onOk: () => {
        curRow.active = 0;
        this._userService.changeUserStatus(curRow).subscribe(data => {
          /*关闭、刷新表单*/
          this.handleCancel();
          this.getUsers();
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
    this._userService.doCreateUser(this.row).subscribe(data => {
      /*关闭、刷新表单*/
      this.handleCancel();
      this.getUsers();
    }, err => {
      /*err后台错误信息返回*/
      this._commonService.handlerError('operation', err);
    });
  }
}



