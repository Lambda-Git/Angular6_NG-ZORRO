import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {caConfig} from './caConfig';
import {peerConfig} from './peerConfig';
import {ContainerService} from '../../../services/container.service';
import {CommonService} from "../../../services/common.service";

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit {

  tlsOptionsCa = [
    {value: -1, label: '请选择', isLeaf: true},
    {value: true, label: '是', isLeaf: true},
    {value: false, label: '否', isLeaf: true},
  ];
  debugOptionsCa = [
    {value: -1, label: '请选择', isLeaf: true},
    {value: true, label: '是', isLeaf: true},
    {value: false, label: '否', isLeaf: true},
  ];
  debugOptionsPeer = [
    {value: -1, label: '请选择', isLeaf: true},
    {value: true, label: '是', isLeaf: true},
    {value: false, label: '否', isLeaf: true},
  ];
  ccDebugOptionsPeer = [
    {value: -1, label: '请选择', isLeaf: true},
    {value: true, label: '是', isLeaf: true},
    {value: false, label: '否', isLeaf: true},
  ];
  tlsOptionsPeer = [
    {value: -1, label: '请选择', isLeaf: true},
    {value: true, label: '是', isLeaf: true},
    {value: false, label: '否', isLeaf: true},
  ]
  cliOptionsPeer = [
    {value: -1, label: '请选择', isLeaf: true},
    {value: true, label: '是', isLeaf: true},
    {value: false, label: '否', isLeaf: true},
  ];
  anchorOptionsPeer = [
    {value: -1, label: '请选择', isLeaf: true},
    {value: true, label: '是', isLeaf: true},
    {value: false, label: '否', isLeaf: true},
  ];
  /*新增、编辑-表单*/
  validateFormCa: FormGroup;
  validateFormPeer: FormGroup;
  submitForm = ($event, value) => {
    $event.preventDefault();
    for (const key in this.validateFormCa.controls) {
      this.validateFormCa.controls[ key ].markAsDirty();
      this.validateFormCa.controls[ key ].updateValueAndValidity();
    }
    for (const key in this.validateFormPeer.controls) {
      this.validateFormPeer.controls[ key ].markAsDirty();
      this.validateFormPeer.controls[ key ].updateValueAndValidity();
    }
    console.log(value);
  };
  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateFormCa.reset();
    for (const key in this.validateFormCa.controls) {
      this.validateFormCa.controls[ key ].markAsPristine();
      this.validateFormCa.controls[ key ].updateValueAndValidity();
    }
    this.validateFormPeer.reset();
    for (const key in this.validateFormPeer.controls) {
      this.validateFormPeer.controls[ key ].markAsPristine();
      this.validateFormPeer.controls[ key ].updateValueAndValidity();
    }
  }

  isCaNew = true;
  isPeerNew = true;
  rowCa: caConfig;
  rowPeer: peerConfig;
  caDataSet = [];
  peerDataSet = [];
  /*弹框组件--增加、编辑---初始化状态*/
  isCaVisible = false;
  isPeerVisible = false;
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
    private _containerService: ContainerService,
    private _commonService: CommonService,
  ) {
    /*弹出框数据增加、编辑--赋值+校验*/
    this.validateFormCa = this.fb.group({
      /*ca*/
      name: [''],
      containerName: [''],
      tls: [false,[ Validators.required ]],
      debug: [false,[ Validators.required ]],
      port: [''],
      admin: [''],
      adminpw: [''],
    });
    this.validateFormPeer = this.fb.group({
      /*peer*/
      containerName: ['',[ Validators.required ]],
      debug: [false,[ Validators.required ]],
      ccDebug: [false,[ Validators.required ]],
      tls: [false,[ Validators.required ]],
      clientAuthEnable: [false,[ Validators.required ]],
      anchorPeer: [false,[ Validators.required ]],
      servicePort: [''],
      eventPort: [''],
      ccPort: [''],
      //couchdb
      couchdbUsername: [''],
      couchdbPassword: [''],
      port: [''],
      couchdbContainerName: []
    });
  }

  ngOnInit() {
    this.getCa();
    this.getPeer();
  }

  /*ca--表单取值*/
  updateCaModel() {
    const val = this.validateFormCa.getRawValue();
    this.rowCa.name = val.name;
    this.rowCa.containerName = val.containerName;
    this.rowCa.tls = val.tls;
    this.rowCa.debug = val.debug;
    this.rowCa.port = val.port;
    this.rowCa.admin = val.admin;
    this.rowCa.adminpw = val.adminpw;
  }

  /*获取ca列表*/
  getCa() {
    this._containerService.getCa().subscribe(data => {
      data.data.forEach((rowData,index) => {
        /*port赋值*/
        if(rowData.ports){
          rowData.port = rowData.ports[0];
        }
        rowData.envs.forEach((row,rowIndex) => {
          /*从envs获取admin、adminpw、debug*/
          let m = row.match('BOOTSTRAP_USER_PASS');
          if(m != null && m != ''){
            /*根据:截取，前面为admin 后面为adnminpw*/
            let begin = row.indexOf('=');
            let last = row.indexOf(':');
            let length = row.length;
            rowData.admin = row.substring(begin+1,last);
            rowData.adminpw = row.substring(last+1,length);
          }
          /*从envs获取debug*/
          let n = row.match('FABRIC_CA_SERVER_DEBUG');
          if(n != null && n != ''){
            let begin_ = row.indexOf('=');
            let length_ = row.length;
            rowData.debug = row.substring(begin_+1,length_);
          }
        })
      });
      this.caDataSet = data.data;
    })

  }

  /*ca--弹框组件出触发事件*/
  showCaModal(rowCa): void {
    this.isCaVisible = true;
    if (rowCa != undefined) {
      this.isCaNew = false;
      this.rowCa = new caConfig(rowCa);

    } else {
      this.isCaNew = true;
      this.rowCa = new caConfig();
    }
  }

  /*ca--关闭增加、编辑弹出框*/
  handleCaCancel(): void {
    this.isCaVisible = false;
  }

  /*ca--保存*/
  doCaSave() {
    this.updateCaModel();
    this._containerService.doCaSave(this.rowCa).subscribe(data => {
      /*关闭、刷新表单*/
      this.handleCaCancel();
      this.getCa();
    }, err => {
      /*err后台错误信息返回*/
      this._commonService.handlerError('operation', err);
    })
  }

  /*peer-表单取值*/
  updatePeerModel() {
    const val = this.validateFormPeer.getRawValue();
    //peer
    this.rowPeer.containerName = val.containerName;
    this.rowPeer.debug = val.debug;
    this.rowPeer.ccDebug = val.ccDebug;
    this.rowPeer.tls = val.tls;
    this.rowPeer.clientAuthEnable = val.clientAuthEnable;
    this.rowPeer.anchorPeer = val.anchorPeer;
    this.rowPeer.servicePort = val.servicePort;
    this.rowPeer.eventPort = val.eventPort;
    this.rowPeer.ccPort = val.ccPort;
    //couchdb
    this.rowPeer.couchdbUsername = val.couchdbUsername;
    this.rowPeer.couchdbPassword = val.couchdbPassword;
    this.rowPeer.port = val.port;
    if ( val.couchdbContainerName != '-1') {
      this.rowPeer.couchdbContainerName = val.couchdbContainerName;
    }
  }

  /*peer--获取*/
  getPeer() {
    this._containerService.getPeer().subscribe(data => {

      data.data.forEach( rowData => {
        if(rowData.ports.length == 3){
          /*端口赋值*/
          rowData.servicePort = rowData.ports[0];
          rowData.ccPort = rowData.ports[1];
          rowData.eventPort = rowData.ports[2];
        }

        rowData.envs.forEach((row,rowIndex) => {
          /*从envs获取debug、ccDebug、tls、clientAuthEnable*/
          //debug
          let a = row.match('CORE_LOGGING_LEVEL');
          if(a != null && a != ''){
            let begin = row.indexOf('=');
            let length = row.length;
            rowData.debug = row.substring(begin+1,length);
            if(rowData.debug == 'debug'){
              rowData.debug = true;
            }else {
              rowData.debug = false;
            }
          }
          //ccDebug
          let b = row.match('CORE_CHAINCODE_LOGGING_LEVEL');
          if(b != null && b != ''){
            let begin = row.indexOf('=');
            let length = row.length;
            rowData.ccDebug = row.substring(begin+1,length);
            if(rowData.ccDebug == 'debug'){
              rowData.ccDebug = true;
            }else {
              rowData.ccDebug = false;
            }
          }
          //tls
          let c = row.match('CORE_PEER_TLS_ENABLED');
          if(c != null && c != ''){
            let begin = row.indexOf('=');
            let length = row.length;
            rowData.tls = eval((row.substring(begin+1,length)).toLowerCase());
          }
          //clientAuthEnable
          let d = row.match('CORE_PEER_TLS_CLIENTAUTHREQUIRED');
          if(d != null && d != ''){
            let begin = row.indexOf('=');
            let length = row.length;
            rowData.clientAuthEnable = eval((row.substring(begin+1,length)).toLowerCase());
          }
          //couchdbUsername
          let e = row.match('COUCHDBCONFIG_USERNAME');
          if(e != null && e != ''){
            let begin = row.indexOf('=');
            let length = row.length;
            rowData.couchdbUsername = row.substring(begin+1,length);
          }
          //couchdbPassword
          let f = row.match('COUCHDBCONFIG_PASSWORD');
          if(f != null && f != ''){
            let begin = row.indexOf('=');
            let length = row.length;
            rowData.couchdbPassword = row.substring(begin+1,length);
          }
          //port
          let g = row.match('COUCHDBCONFIG_PORT');
          if(g != null && g != ''){
            let begin = row.indexOf('=');
            let length = row.length;
            rowData.port = row.substring(begin+1,length);
          }
          //couchdbContainerName
          let h = row.match('COUCHDBCONFIG_CONTAINERNAME');
          if(h != null && h != ''){
            let begin = row.indexOf('=');
            let length = row.length;
            rowData.couchdbContainerName = row.substring(begin+1,length);
          }

        })

      })
      this.peerDataSet = data.data;
    })

  }

  /*peer--弹框组件出触发事件*/
  showPeerModal(rowPeer): void {
    this.isPeerVisible = true;
    if (rowPeer != undefined) {
      this.isPeerNew = false;
      this.rowPeer = new peerConfig(rowPeer);

    } else {
      this.isPeerNew = true;
      this.rowPeer = new peerConfig();
    }
  }

  /*ca--关闭增加、编辑弹出框*/
  handlePeerCancel(): void {
    this.isPeerVisible = false;
  }

  /*peer--保存*/
  doPeerSave() {
    this.updatePeerModel();
    this._containerService.doPeerSave(this.rowPeer).subscribe(data => {
      /*关闭、刷新表单*/
      this.handlePeerCancel();
      this.getPeer();
    }, err => {
      /*err后台错误信息返回*/
      this._commonService.handlerError('operation', err);
    })
  }


}
