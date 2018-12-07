import {FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';

export const PhoneValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const phone = control.get('phone').value;
  return checkPhone(phone) ? null : {'notphone': true};
};

function checkPhone(phone) {
  const exp = /^1[34578]\d{9}$/;
  if (exp.test(phone)) {
    return true;
  }
  return false;
}
