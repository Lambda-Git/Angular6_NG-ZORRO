export class hostConfig {
  name: string;
  ip: string;
  domain: string;
  constructor(data = {}) {
    this.name = '';
    this.ip = '';
    this.domain = '';
    if (data !== undefined) {
      for (const k in data) {
        if (data.hasOwnProperty(k)) {
          this[k] = data[k];
        }
      }
    }
  }
}
