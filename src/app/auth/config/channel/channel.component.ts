import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {channelConfig} from './channelConfig';
import {TipService} from '../../../saas/tip/tip.service';
import {NzModalService} from 'ng-zorro-antd';
import {CommonService} from '../../../services/common.service';
import {ChannelService} from '../../../services/channel.service';
import {Tip} from '../../../saas/tip/tip';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css']
})
export class ChannelComponent implements OnInit {

  /*条件查询*/
  searchForm;
  page = {
    totalElements: 0,
    pageNum: 1,
    pageSize: 10
  };
  consensusPage = {
    totalElements: 0,
    pageNum: 1,
    pageSize: 10
  }
  statusOptions = [
    {value: -1, label: '请选择', isLeaf: true},
    {value: 0, label: 'INIT', isLeaf: true},
    {value: 1, label: 'CREATE', isLeaf: true},
    {value: 2, label: 'PROPOSAL', isLeaf: true},
    {value: 3, label: 'START', isLeaf: true},
    {value: 4, label: 'RUNNING', isLeaf: true},
  ];
  genesisBlockOptions = [
    {value: -1, label: '请选择', isLeaf: true},
    {value: true, label: '是', isLeaf: true},
    {value: false, label: '否', isLeaf: true},
  ];
  /*新增、编辑-表单*/
  validateForm: FormGroup;
  isNew = true;
  row: channelConfig;
  dataSet = [];
  consensusDataSet = [];
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

  constructor(
    private _tipService: TipService,
    private modalService: NzModalService,
    private fb: FormBuilder,
    private _commonService: CommonService,
    private _channelService: ChannelService
  ) {
    /*查询条件表单*/
    this.searchForm = this.fb.group({
      name: [''],
      status: [-1],
      genesisBlock: [-1],
    });
    /*弹出框数据增加、编辑--赋值+校验*/
    this.validateForm = this.fb.group({
      name: ['', [Validators.required]],
      timeout: [''],
      msgCount: [''],
      desc: ['']
    });
  }

  /*初始化*/
  ngOnInit() {
    this.getPassway();
  }


  /*获取查询表单值*/
  updateModel() {
    const query: any = {};
    const val = this.searchForm.getRawValue();
    if (val.name != '') {
      query.name = val.name;
    }
    if (val.status != -1) {
      query.status = val.status;
    }
    if (val.genesisBlock != -1) {
      /*字符串转boolean*/
      query.genesisBlock = val.genesisBlock;
    }
    return query;
  }

  /*获取通道--条件选择+分页*/
  getPassway() {
    this._channelService.getChannel(this.updateModel(), this.page).subscribe(data => {
      if (data.data.datas !== undefined) {
        this.dataSet = data.data.datas;
        this.page.totalElements = data.data.count;
      }
    });
  }

  /*查询没有被使用共识名称consensus*/
  getConsensus() {
    this._channelService.getConsensus().subscribe(data => {
      this.consensusDataSet = data.data.datas;
    })
  }

  /*弹框组件出触发事件*/
  showModal(row): void {
    this.isVisible = true;
    if (row != undefined) {
      this.isNew = false;
      this.row = new channelConfig(row);

    } else {
      this.isNew = true;
      this.row = new channelConfig();
    }
    /*弹出框数据增加、编辑--赋值+校验*/
    this.validateForm = this.fb.group({
      name: ['', [Validators.required]],
      timeout: [''],
      msgCount: [''],
      desc: ['']
    });
  }

  /*关闭增加、编辑弹出框*/
  handleCancel(): void {
    this.isVisible = false;
  }


  /*获取增加、编辑表单值*/
  updateModelAdd() {
    const val = this.validateForm.getRawValue();
    this.row.name = val.name;
    this.row.systemChannel = val.name;
    this.row.consensusName = val.consensusName;
    this.row.timeout = val.timeout;
    this.row.msgCount = val.msgCount;
    this.row.desc = val.desc;
  }

  /*增加通道、更新通道*/
  doSave() {
    this.updateModelAdd();
    this._channelService.addPassWay(this.row).subscribe(data => {
      /*关闭、刷新表单*/
      this.handleCancel();
      this.getPassway();
    }, err => {
      /*err后台错误信息返回*/
      this._commonService.handlerError('operation', err);
    });
  }

}
