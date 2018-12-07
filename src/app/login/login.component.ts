import {Component, OnInit} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {environment} from '../../environments/environment';
import {Router} from '@angular/router';
import {Tip} from '../saas/tip/tip';
import {TipService} from '../saas/tip/tip.service';
import {UserService} from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  validateForm: FormGroup;
  validateCodeUrl: string;

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.valid) {
      let loginParam = this.validateForm.value;
      this._userService.doLogin(loginParam).subscribe(() => {
        this._router.navigate(['/saas/auth/overview']);
      }, err => {
        if (typeof err !== 'string') {
          err = err.message;
        }
        this._tip.openDialog({type: 'error', title: '登录错误', content: err} as Tip);
      });
    }
  }

  constructor(private fb: FormBuilder,
              private _router: Router,
              private _tip: TipService,
              private _userService: UserService) {
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(8)]],
      password: ['', [Validators.required]],
      code: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]]
    });
    this.validateCodeUrl = environment.env['service_path'] + 'saas/common/kaptcha?ts=' + new Date().getTime();
  }

  refreshCode(): void {
    this.validateCodeUrl = environment.env['service_path'] + 'saas/common/kaptcha?ts=' + new Date().getTime();
  }
}
