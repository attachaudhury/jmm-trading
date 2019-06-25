/*
 * SpurtCommerce
 * version 2.1
 * http://www.spurtcommerce.com
 *
 * Copyright (c) 2019 PICCOSOFT
 * Author piccosoft <support@spurtcommerce.com>
 * Licensed under the MIT license.
 */
import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {OrdersSandbox} from '../../../../../../../core/admin/sales/orders/orders-sandbox';


@Component({
    selector: 'app-sales-order-filter',
    templateUrl: 'filter.component.html',
    styleUrls: ['./filter.component.scss'],
})

export class OrderFilterComponent implements OnInit {

    public pageSize: any;

    public salesOrder: FormGroup;
    public submitted = false;
    public name: FormControl;
    public total: FormControl;
    public date: FormControl;
    public status: FormControl;
    public orderId: FormControl;
    public offset: any;
    public pagination: number;
    @Output() salesEmit = new EventEmitter<string>();

    constructor(public fb: FormBuilder, public appSandbox: OrdersSandbox) {

    }


    ngOnInit() {
        this.pagination = 1;
        this.offset = 0;
        this.pageSize = localStorage.getItem('itemsPerPage');
        this.initForm();
    }

    initForm() {

        this.name = new FormControl('', [Validators.required]);
        this.total = new FormControl('', [Validators.required]);
        this.date = new FormControl('', [Validators.required]);
        this.status = new FormControl('', [Validators.required]);
        this.orderId = new FormControl('', [Validators.required]);
        this.salesOrder = this.fb.group({
            name: this.name, date: this.date,
            orderId: this.orderId, status: this.status, total: this.total
        });

    }

    onSubmit() {
        const params: any = {};
        params.limit = this.pageSize;
        params.offset = this.offset;
        params.orderId = this.salesOrder.value.orderId;
        params.customerName = this.salesOrder.value.name;
        params.totalAmount = this.salesOrder.value.total;
        params.dateAdded = this.salesOrder.value.date;
        this.salesEmit.emit(params);
        this.appSandbox.getOrderList(params);
        // if (this.pagination) {
        params.count = 1;
        this.appSandbox.getOrderPagination(params);
        // }
    }

    reset() {
        this.salesOrder.reset();
        const param: any = {};
        param.limit = this.pageSize;
        param.offset = '';
        param.orderId = '';
        param.customerName = '';
        param.totalAmount = '';
        param.dateAdded = '';
        this.salesEmit.emit(param);
        this.appSandbox.getOrderList(param);

    }


}
