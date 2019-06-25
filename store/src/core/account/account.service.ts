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
import {Observable} from 'rxjs';
import {Api} from '../providers/api/api';


@Injectable()
export class AccountService extends Api {

    private base: string = this.getBaseUrl();
    public userTokenDetail = localStorage.getItem('userToken');

    /* call change password api*/
    public doChangePassword(params: any): Observable<any> {
        return this.http.post(this.base + 'customer/change-password', params);
    }

    /* call edit profile api*/
    public doEditProfile(params: any): Observable<any> {
        return this.http.post(this.base + 'customer/edit-profile', params);
    }

    /* get order history list api*/
    public getOrderHistory(params: any): Observable<any> {
        return this.http.get(this.base + 'orders/order-list', {params: params});
    }
    /* get order history detail api*/
    public getOrderDetail(params: any): Observable<any> {
        return this.http.get(this.base + 'orders/order-detail', {params: params});
    }


}
