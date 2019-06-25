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
import {ConfigService} from '../service/config.service';


@Injectable()
export class DashboardService {

    params: any = {};
    private URL = this.configService.get('api').baseUrl;


    constructor(
        private http: HttpClient,
        protected configService: ConfigService,
    ) {

    }

    /* get order list count api*/
    public getOrderListCount(filterParam: any): Observable<any> {
        const reqOpts: any = {};
        const params = Object.getOwnPropertyNames(filterParam)
            .reduce((p, key) => p.set(key, filterParam[key]), new HttpParams());
        reqOpts.params = params;
        return this.http.get(this.URL + '/order/orderlist', reqOpts);
    }

    /* get product list count api*/
    public getProductListCount(filterParam: any): Observable<any> {
        const reqOpts: any = {};
        const params = Object.getOwnPropertyNames(filterParam)
            .reduce((p, key) => p.set(key, filterParam[key]), new HttpParams());
        reqOpts.params = params;
        return this.http.get(this.URL + '/product/productlist', reqOpts);
    }

    /* get customer list count api*/
    public getCustomerListCount(filterParam: any): Observable<any> {
        const reqOpts: any = {};
        const params = Object.getOwnPropertyNames(filterParam)
            .reduce((p, key) => p.set(key, filterParam[key]), new HttpParams());
        reqOpts.params = params;
        return this.http.get(this.URL + '/customer/customerlist', reqOpts);
    }

    /* get top selling product list api*/
    public getTopSellingProducts(filterParam: any): Observable<any> {
        const reqOpts: any = {};
        const params = Object.getOwnPropertyNames(filterParam)
            .reduce((p, key) => p.set(key, filterParam[key]), new HttpParams());
        reqOpts.params = params;
        return this.http.get(this.URL + '/product/top-selling-productlist', reqOpts);
    }

    /* get sales order list api*/
    public getSalesOrders(filterParam: any): Observable<any> {
        const reqOpts: any = {};
        const params = Object.getOwnPropertyNames(filterParam)
            .reduce((p, key) => p.set(key, filterParam[key]), new HttpParams());
        reqOpts.params = params;
        return this.http.get(this.URL + '/order/saleslist', reqOpts);
    }

    /* get visitors list api*/
    public getVisitorsList(filterParam: any): Observable<any> {
        const reqOpts: any = {};
        const params = Object.getOwnPropertyNames(filterParam)
            .reduce((p, key) => p.set(key, filterParam[key]), new HttpParams());
        reqOpts.params = params;
        return this.http.get(this.URL + '/customer/login-log-list', reqOpts);
    }

    /* get recent visitors list api*/
    public getRecentVisitorsList(filterParam: any): Observable<any> {
        const reqOpts: any = {};
        const params = Object.getOwnPropertyNames(filterParam)
            .reduce((p, key) => p.set(key, filterParam[key]), new HttpParams());
        reqOpts.params = params;
        return this.http.get(this.URL + '/customer/recent-customerlist', reqOpts);
    }

    /* get recent selling product list api*/
    public getRecentSellingProductList(filterParam: any): Observable<any> {
        const reqOpts: any = {};
        const params = Object.getOwnPropertyNames(filterParam)
            .reduce((p, key) => p.set(key, filterParam[key]), new HttpParams());
        reqOpts.params = params;
        return this.http.get(this.URL + '/product/recent-selling-product', reqOpts);
    }
    /* get items per page count api*/

    getItemsPerPageCount(): Observable<any> {
        return this.http.get(this.URL + '/settings/get-settings');

    }

}

