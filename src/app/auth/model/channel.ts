import {Consortium} from './consortium';
import {Peer} from './peer';

export class Channel {
  id: string;
  name: string;
  systemChannel: string;
  status: number;
  consortium: string;
  consortiums: Consortium[];
  consensusName: string;
  timeout: string;
  msgCount: number;
  desc: string;

  value: string;
  label: string;
  children: Peer[];
}
