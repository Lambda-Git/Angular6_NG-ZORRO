import {Component, OnInit} from '@angular/core';
import {RestService} from '../../services/rest.service';
import {Peer} from '../model/peer';
import {Block} from '../model/block';
import {Transaction} from '../model/transaction';
import {Chaincode} from '../model/chaincode';
import {Tip} from '../../saas/tip/tip';
import {TipService} from '../../saas/tip/tip.service';
import {Channel} from '../model/channel';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  /*通道选择下拉框*/
  options = [
    {value: 'org1', label: 'org1',
          children: [{value: 'channal1', label: 'channal1'}]
    },
    {value: 'org2', label: 'org2',
          children: [{value: 'node1', label: 'node1'}]
    }
  ];


  /** init data */
  public nzOptions = null;

  /** ngModel value */
  public values: any[] = null;


  public onChanges(values: any): void {
    console.log(values, this.values);
  }


  /*区块列表*/
  dataSet = [];
  /*区块*/
  data_1 = {
    number: 40,
    curHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    lastHash: 'ba1e6b695bcf9d305a1a63bfc911679e914fc3c3e60f7b4206d8681eda4dcbb7',
    value: '6f2c2e9ab070f8af6ade61178a60e4069fc54ef89caca7b6bef0959e341dfa81',
    id: '3bcdae66ba1e4ff557f0eab59e1cedba7c6dc7a9c50155aafcc18cd5cb1a001a',
  };
  /*节点列表*/
  channelData = [];
  /*交易详情*/
  data_2 = {
    id: '3bcdae66ba1e4ff557f0eab59e1cedba7c6dc7a9c50155aafcc18cd5cb1a001a',
    time: 'Mon Jul 02 2018 01:18:40 GMT+0000 (UTC)',
    channelId: 'mychannel',
    type: 'ENDORSER_TRANSACTION',
  };
  /*合约列表*/
  contractData = [];
  loading = false;

  channels: Channel[];
  transaction: Transaction;
  chaincodes: Chaincode[];
  peers: Peer[];
  blockNum: number;
  txNum: number;
  ccNum: number;
  block: Block;

  constructor(private _rest: RestService,
              private _tip: TipService) {
    this.channels = [];
    this.peers = [];
    this.chaincodes = [];
  }


  ngOnInit() {
    this.nzOptions = this.options;
    this._rest.post('saas/overview/channel/list', null, {auth: true}).subscribe((result) => {
      const datas = result.data;
      for (let i = 0; i < datas.length; i++) {
        const name = datas[i]['name'];
        // this.channels.push({name: name, label: name} as Channel);
        let children: Array<Peer> = [];
        this._rest.post('saas/overview/channel/list', {'name': name}, {auth: true}).subscribe((res) => {

        }, err => {
          if (typeof err !== 'string') {
            err = err.message;
          }
          this._tip.openDialog({type: 'error', title: '节点错误', content: err} as Tip);
        });
      }
    }, err => {
      if (typeof err !== 'string') {
        err = err.message;
      }
      this._tip.openDialog({type: 'error', title: '通道错误', content: err} as Tip);
    });


    /*区块列表*/
    for (let i = 0; i < 100; i++) {
      this.dataSet.push({
        name: `#${i}`,
        age: i,
      });
    }

    /*区块*/
    this.data_1;

    /*节点列表*/
    for (let i = 0; i < 100; i++) {
      this.channelData.push({
        name: `peerOrg` + i,
        orgName: 'org' + i,
        address: 'grpc://peer0.org1.example.com:1801' + i,
      });
    }

    /*交易详情*/
    this.data_2;

    /*合约列表*/
    for (let i = 0; i < 100; i++) {
      this.contractData.push({
        name: `cfds-cgb-v` + i,
        edition: '1.' + i,
        route: `github.com/cfds-cgb-v1/1.` + i,
      });
    }
  }
}
