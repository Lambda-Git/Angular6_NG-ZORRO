import {Component, NgModuleRef, OnInit} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {UserService} from '../../../services/user.service';
import {TipService} from '../../../saas/tip/tip.service';
import {Passwordvalidator} from '../../validator/passwordvalidator';
import {NzModalRef} from 'ng-zorro-antd';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css']
})
export class ChangepasswordComponent implements OnInit {
  validateForm: FormGroup;

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.valid) {
      this._userService.changeUserPassword(this.validateForm.value).subscribe(data => {
        this._sheetRef.close();
        this._tipService.openDialog({type: 'success', title: '用户信息', content: '密码修改成功!'});
      }, err => {
        if (typeof err !== 'string') {
          err = err.message;
        }
        this._tipService.openDialog({type: 'error', title: '用户信息', content: err});
      });
    }
  }

  constructor(private fb: FormBuilder,
              private _sheetRef: NzModalRef<ChangepasswordComponent>,
              private _tipService: TipService,
              private _userService: UserService) {
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      oldPass: [null, [Validators.required, Validators.minLength(8)]],
      newPass: [null, [Validators.required, Validators.minLength(8)]],
      confirmPass: [null, [Validators.required, Validators.minLength(8)]]
    }, {validator: Passwordvalidator});
  }
}
