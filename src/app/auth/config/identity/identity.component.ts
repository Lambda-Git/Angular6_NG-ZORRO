import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {IdentityService} from '../../../services/identity.service';
import { identityConfig } from './identityConfig';
import {CommonService} from '../../../services/common.service';

@Component({
  selector: 'app-identity',
  templateUrl: './identity.component.html',
  styleUrls: ['./identity.component.css']
})
export class IdentityComponent implements OnInit {

  /*条件查询*/
  searchForm;
  page = {
    totalElements: 0,
    pageNum: 1,
    pageSize: 10
  };
  /*新增、编辑-表单*/
  validateForm: FormGroup;
  rootOptions = [
    {value: true, label: '是', isLeaf: true},
    {value: false, label: '否', isLeaf: true}
  ];
  useOptions = [
    {value: true, label: '是', isLeaf: true},
    {value: false, label: '否', isLeaf: true}
  ];
  //类型
  typeOptions = [
    {value: -1, label: '请选择', isLeaf: true},
    {value: true, label: '是', isLeaf: true},
    {value: false, label: '否', isLeaf: true}
  ];
  //配置MSP
  configOptions = [
    {value: -1, label: '请选择', isLeaf: true},
    {value: true, label: '是', isLeaf: true},
    {value: false, label: '否', isLeaf: true}
  ];
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
  /*我的身份*/
  row: identityConfig;
  dataSet = [];
  dataSetAll = [];
  /*弹框组件--增加、编辑---初始化状态*/
  isVisible = false;
  /*list表单css参数*/
  bordered = false;
  loading = false;
  pagination = true;
  header = true;
  title = true;
  fixHeader = false;
  size = 'Default';
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

  constructor(
    private fb: FormBuilder,
    private _identityService: IdentityService,
    private _commonService: CommonService
  ) {
    /*查询表单初始化赋值*/
    this.searchForm = this.fb.group({
      name: [''],
      type: [-1],
      config: [-1]
    });
    /*初始化增加、编辑弹出框*/
    this.validateForm = this.fb.group({
      name: ['', [Validators.required]],
      commonName: [''],
      country: [''],
      state: [''],
      locality: [''],
      organizationName: [''],
      organizationUnit: [''],
      root: [false,[Validators.required]],
      use: [false,[Validators.required]]
    });

  }

  ngOnInit() {
    this.getIdentityInfo();
    this.getAllIdentity();
  }

  /*我的身份增加、编辑弹出框表单--取值*/
  updateMyIdentityModel() {
    const val = this.validateForm.getRawValue();
    this.row.name = val.name;
    this.row.commonName = val.commonName;
    this.row.country = val.country;
    this.row.state = val.state;
    this.row.locality = val.locality;
    this.row.organizationName = val.organizationName;
    this.row.organizationUnit = val.organizationUnit;
    this.row.root = val.root;
    this.row.use = val.use;
  }

  /*全网身份查询条件表单--取值*/
  updateAllIdentityModel() {
    const query: any = {};
    const val = this.searchForm.getRawValue();
    if (val.name != '') {
      query.name = val.name;
    }
    if (val.type != -1) {
      query.type = val.type;
    }
    if (val.config != -1) {
      query.config = eval(val.config.toLowerCase());
    }
    return query;
  }

  /*弹出框*/
  showModal(row) {
    this.isVisible = true;
    if (row !== undefined) {
      this.isNew = false;
      this.row = new identityConfig(row);
    } else {
      this.isNew = true;
      this.row = new identityConfig();
    }
    this.validateForm = this.fb.group({
      name: [this.row.name, [Validators.required]],
      commonName: [this.row.commonName],
      country: [this.row.country],
      state: [this.row.state],
      locality: [this.row.locality],
      organizationName: [this.row.organizationName],
      organizationUnit: [this.row.organizationUnit],
      root: [this.row.root,[Validators.required]],
      use: [this.row.use,[Validators.required]]
    });
  }

  /*关闭增加、编辑弹出框*/
  handleCancel(): void {
    this.isVisible = false;
  }

  /*处理数据排序*/
  sortData(data) {
    /*先把为主的对象放到数组最前面--主只有一个*/
    let key;
    let rows = {};
    data.forEach((rowData, index) => {
      if (rowData.root == true) {
        key = index;
        rows = rowData;
      }
    });
    if (key) {
      data.splice(key, 1);
      data.unshift(rows);
      /*再把被使用use对象放到数组最前面--被使用有多个*/
      data.forEach((useData, useIndex) => {
        if (useData.use == true) {
          data.splice(useIndex, 1);
          data.unshift(useData);
        }
      });
      /*同时满足为主、被使用;再移到数组最前面*/
      data.forEach((useRootData, useRootIndex) => {
        if (useRootData.root == true && useRootData.use == true) {
          data.splice(useRootIndex, 1);
          data.unshift(useRootData);
        }
      });
    } else {
      /*再把被使用use对象放到数组最前面--被使用有多个*/
      data.forEach((useData, useIndex) => {
        if (useData.use == true) {
          data.splice(useIndex, 1);
          data.unshift(useData);
        }
      });
      return data;
    }
  }

  /*获取我的身份信息*/
  getIdentityInfo() {
    this._identityService.getIdentityInfo().subscribe(data => {
      this.sortData(data);
      this.dataSet = data;
    }, err => {
      this._commonService.handlerError('operation', err);
    })
  }



  /*增加、编辑表单提交*/
  doSave() {
    this.updateMyIdentityModel();
    this._identityService.doOrgCardSave(this.row).subscribe(data => {
      /*关闭、刷新表单*/
      this.handleCancel();
      this.getIdentityInfo();
    }, err => {
      this._commonService.handlerError('operation', err);
    })

  }


  /*获取全网身份*/
  getAllIdentity() {
    this._identityService.geAlltIdentityInfo(this.updateAllIdentityModel(),this.page).subscribe(data => {
      this.dataSetAll = data.data.datas;
      this.page.totalElements = data.data.count;
    }, err => {
      this._commonService.handlerError('operation', err);
    })
  }

}
