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
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ConfigService} from '../../service/config.service';


@Injectable()
export class LayoutService {

    params: any = {};
    private URL = this.configService.get('api').baseUrl;


    constructor(
        private http: HttpClient, protected configService: ConfigService) {
    }

    /* get product list count api*/
    public getOrderListCount(filterParam: any): Observable<any> {
        const reqOpts: any = {};
        const params = Object.getOwnPropertyNames(filterParam)
            .reduce((p, key) => p.set(key, filterParam[key]), new HttpParams());
        reqOpts.params = {
            count: 'true',
            customerName: '',
            dateAdded: '',
            keyword: '',
            limit: '',
            offset: '',
            orderId: '',
            totalAmount: ''
        };
        return this.http.get(this.URL + '/order/orderlist', reqOpts);
    }

    /* get product list count api*/
    public getTodayOrderListCount(filterParam: any): Observable<any> {
        const reqOpts: any = {};
        const params = Object.getOwnPropertyNames(filterParam)
            .reduce((p, key) => p.set(key, filterParam[key]), new HttpParams());
        reqOpts.params = params;
        return this.http.get(this.URL + '/order/today-order-count', reqOpts);
    }

    /* get product list count api*/
    public getTotalOrderAmount(filterParam: any): Observable<any> {
        const reqOpts: any = {};
        const params = Object.getOwnPropertyNames(filterParam)
            .reduce((p, key) => p.set(key, filterParam[key]), new HttpParams());
        reqOpts.params = params;
        return this.http.get(this.URL + '/order/total-order-amount', reqOpts);
    }

    /* get product list count api*/
    public getTodayOrderAmount(filterParam: any): Observable<any> {
        const reqOpts: any = {};
        const params = Object.getOwnPropertyNames(filterParam)
            .reduce((p, key) => p.set(key, filterParam[key]), new HttpParams());
        reqOpts.params = params;
        return this.http.get(this.URL + '/order/today-order-amount', reqOpts);
    }

}

