export class UserConfig {
  username: string;
  email: string;
  phone: string;
  active: number;
  role: number;

  constructor(data = {}) {
    this.username = '';
    this.email = '';
    this.phone = '';
    this.active = 0;
    this.role = 0;
    if (data !== undefined) {
      for (const k in data) {
        if (data.hasOwnProperty(k)) {
          this[k] = data[k];
        }
      }
    }
  }
}
