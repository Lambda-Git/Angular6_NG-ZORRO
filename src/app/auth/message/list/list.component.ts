import {Component, OnInit} from '@angular/core';
import {MessageService} from '../../../services/message.service';
import {FormBuilder} from '@angular/forms';
import {Tip} from '../../../saas/tip/tip';
import {TipService} from '../../../saas/tip/tip.service';
import {CommonService} from '../../../services/common.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  searchForm;
  page = {
    totalElements: 0,
    pageNum: 1,
    pageSize: 10
  };

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
  checkbox = false;
  allChecked = false;
  indeterminate = false;
  displayData = [];
  simple = false;

  messageOptions = [
    {value: -1, label: '请选择', isLeaf: true},
    {value: 'CHANNEL', label: '通道', isLeaf: true},
    {value: 'CHAINCODE', label: '合约', isLeaf: true},
    {value: 'CONSENSUS', label: '共识', isLeaf: true},
    {value: 'ORG', label: '组织', isLeaf: true},
  ];

  levelOptions = [
    {value: -1, label: '请选择', isLeaf: true},
    {value: 'INFO', label: '通知', isLeaf: true},
    {value: 'ASK', label: '提案', isLeaf: true},
    {value: 'ANSWER', label: '回复', isLeaf: true},
  ];

  constructor(private _messageService: MessageService,
              private _tipService: TipService,
              private _commonService: CommonService,
              private fb: FormBuilder) {
  }

  /*初始化*/
  ngOnInit() {
    this.buildForm();
    this.getMessages();
  }

  /*表单初始化赋值*/
  buildForm() {
    /*查询表单初始化赋值*/
    this.searchForm = this.fb.group({
      org: [''],
      type: [-1],
      level: [-1]
    });
  }

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

  /*获取查询表单值*/
  updateModel() {
    const query: any = {};
    const val = this.searchForm.getRawValue();
    if (val.org !== '') {
      query.org = val.org;
    }
    if (val.type != -1) {
      query.type = val.type[0];
    }
    if (val.level != -1) {
      const levels = val.level;
      query.level = levels[0];
    }
    return query;
  }


  doDel(curRow) {
    const delMsgData = [];
    delMsgData.push(curRow.id);
    this._tipService.openDialog({
      type: 'confirm',
      title: '确认！',
      content: '是否真的删除?',
      onOk: () => {
        this._messageService.delMsg(delMsgData).subscribe(data => {
          /*关闭、刷新表单*/
          this.getMessages();
        }, err => {
          /*err后台错误信息返回*/
          this._commonService.handlerError('后台错误', err);
        });
      },
    } as Tip);
  }

  /*获取用户列表--条件选择+分页*/
  getMessages() {
    this._messageService.getMessageList(this.updateModel(), this.page).subscribe(messages => {
      if (messages.data.datas !== undefined) {
        this.dataSet = messages.data.datas;
        this.page.totalElements = messages.data.count;
      }
    });
  }
}
