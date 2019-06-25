/*
* spurtcommerce
* version 2.1
* http://www.spurtcommerce.com
*
* Copyright (c) 2019 piccosoft ltd
* Author piccosoft ltd <support@piccosoft.com>
* Licensed under the MIT license.
*/
import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {HttpParams} from '@angular/common/http';
import {ChangePasswordForm} from './changepassword-models/changepassword.model';


@Injectable()
export class ChangePasswordService {

    params: any = {};
    url = 'http://api.spurtcommerce.com/api';

    constructor(private http: HttpClient) {

    }

    // change psw
    public changePassword(param: ChangePasswordForm): Observable<any> {
        return this.http.put(this.url + '/auth/change-password', param);
    }

}
