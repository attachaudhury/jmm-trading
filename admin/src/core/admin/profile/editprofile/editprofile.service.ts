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
import {EditprofileForm} from './models/editprofile.model';


@Injectable()
export class EditprofileService {

    params: any = {};
    url = 'http://api.spurtcommerce.com/api';

    constructor(private http: HttpClient) {

    }

    // change psw
    public editProfile(param: EditprofileForm): Observable<any> {
        return this.http.post(this.url + '/auth/edit-profile', param);
    }

}
