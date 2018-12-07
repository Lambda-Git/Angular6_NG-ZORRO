import {Injectable} from '@angular/core';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {UserAccessService} from './user-access.service';
import {Observable} from 'rxjs';
import {isArray} from 'util';

@AutoUnsubscribe()
@Injectable({
  providedIn: 'root'
})
export class RestService {

  private _url(path, service = 'service') {
    return environment.env[service + '_path'] + path.replace(/^\//, '');
  }

  constructor(private _http: HttpClient,
              private _router: Router,
              private _spinner: NgxSpinnerService,
              private _userAccess: UserAccessService
  ) {

  }

  public post(u, p = {}, opt: any = {service: 'service', block: true}): Observable<any> {
    const s = opt.service === undefined ? 'service' : opt.service;
    const url = this._url(u, s);
    let auth = false;
    if (opt.auth) {
      auth = true;
    }
    const token = this._userAccess.getToken();

    let headers = new HttpHeaders();
    headers = headers.append('Access-Control-Allow-Origin', '*');
    if (auth) {
      headers = headers.append('token', token);
    }
    const block = opt.block !== false;

    return Observable.create(observer => {
      if (block) {
        this._spinner.show();
      }
      this._http.post<any>(url, p, {headers: headers}).subscribe(data => {
        if (block) {
          this._spinner.hide();
        }
        observer.next(data);
        observer.complete();
      }, err => {
        console.log(err);
        if (block) {
          this._spinner.hide();
        }
        if (err.status === 401) {
          this._router.navigate([environment.env.token_err_url]);
        } else {
          setTimeout(() => {
            observer.error(err);
          }, 0);
        }
      });
    });
  }

  uploadFile(u, params, files, opt: any = {service: 'service', block: true, auth: false}) {
    const s = opt.service === undefined ? 'service' : opt.service;
    const url = this._url(u, s);
    const auth = opt.auth === true;
    const token = this._userAccess.getToken();

    const formModel = new FormData();
    Object.keys(params).forEach(k => formModel.append(k, params[k]));
    formModel.append('token', token);
    if (isArray(files)) {
      files.forEach(f => {
        formModel.append('files', f);
      });
    } else {
      formModel.append('files', files);
    }
    const headers = new HttpHeaders();

    if (auth) {
      headers.append('token', token);
    }

    return Observable.create(observer => {
      this._spinner.show();
      this._http.post<any>(url, formModel, {headers: headers}).subscribe(
        data => {
          this._spinner.hide();
          observer.next(data);
          observer.complete();
        },
        err => {
          this._spinner.hide();
          if (err.status === 401) {
            // Token Change ,need re login
            this._router.navigate([environment.env.token_err_url]);
          }
        }
      );
    });
  }

  download(u, p = {}): Observable<any> {
    const url = this._url(u);
    const token = this._userAccess.getToken();
    return Observable.create(observer => {
      let headers = new HttpHeaders();
      headers = headers.append('token', token);
      this._spinner.show();
      this._http
        .post(url, p, {headers: headers, responseType: 'blob'})
        .subscribe(
          data => {
            this._spinner.hide();
            observer.next(data);
            observer.complete();
          },
          err => {
            observer.error(err);
            this._spinner.hide();
          }
        );
    });
  }
}
