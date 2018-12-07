import {FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';

export const IpValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const ip = control.get('ip');
  return checkIP(ip) ? null : {'notip': true};
};

function checkIP(strIP) {
  const exp =
    /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
  if (!exp.test(strIP)) {
    return false;
  }
  return true;
}


