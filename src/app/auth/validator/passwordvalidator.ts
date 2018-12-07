import {FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';

export const Passwordvalidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const newPass = control.get('newPass');
  const confirmPass = control.get('confirmPass');
  return newPass && confirmPass && newPass.value !== confirmPass.value ? {'notsame': true} : null;
};




