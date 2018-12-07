export class PeerConfig {
  id: string;
  debug: boolean;
  ccDebug: boolean;
  tls: boolean;
  clientAuthEnable: false;
  anchorPeer: false;
  containerName: string;
  servicePort: string;
  ccPort: string;
  eventPort: string;
  couchdbContainerName: string;
}
