export class peerConfig {
  /*peer*/
  containerName: string;
  debug: boolean;
  ccDebug: boolean;
  tls: boolean;
  clientAuthEnable: boolean;
  anchorPeer: boolean;
  servicePort: string;
  eventPort: string;
  ccPort: string;
  /*couchdb*/
  couchdbUsername: string;
  couchdbPassword: string;
  port: string;
  couchdbContainerName: string;
  constructor(data = {}) {
    this.containerName = '';
    this.debug = false;
    this.ccDebug = false;
    this.tls = false;
    this.clientAuthEnable = false;
    this.anchorPeer = false;
    this.servicePort = '';
    this.eventPort = '';
    this.ccPort = '';
    this.couchdbUsername = '';
    this.couchdbPassword = '';
    this.couchdbContainerName = '';
    if (data != undefined) {
      for (const k in data) {
        if (data.hasOwnProperty(k)) {
          this[k] = data[k];
        }
      }
    }
  }
}
