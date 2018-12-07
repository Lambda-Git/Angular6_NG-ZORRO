import {FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';

export const DomainValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const domain = control.get('domain');
  return checkDomain(domain) ? null : {'notdomain': true};
};


function checkDomain(strDomain) {
  const exp = /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/;
  if (!exp.test(strDomain)) {
    return false;
  }
  return true;
}


