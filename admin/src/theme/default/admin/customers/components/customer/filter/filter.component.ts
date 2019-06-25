/*
 * SpurtCommerce
 * version 2.1
 * http://www.spurtcommerce.com
 *
 * Copyright (c) 2019 PICCOSOFT
 * Author piccosoft <support@spurtcommerce.com>
 * Licensed under the MIT license.
 */
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {NgbPanelChangeEvent} from '@ng-bootstrap/ng-bootstrap';

import {CustomerSandbox} from '../../../../../../../core/admin/Customers/customers/customer.sandbox';

@Component({
    selector: 'app-customer-filter',
    templateUrl: 'filter.component.html',
    styleUrls: ['./filter.component.scss']
})
export class CustomerFilterComponent implements OnInit {
    // form variables
    public custftrform: FormGroup;
    public custdate: FormControl;
    public customergroup: FormControl;
    public email: FormControl;
    public customername: FormControl;
    // variable
    public pageSize: any;
    public offset: number;
    public pagination: number;
    @Output() ProgressEmit = new EventEmitter<string>();

    constructor(public fb: FormBuilder, public sandbox: CustomerSandbox) {
    }

    // intially calls initForm
    ngOnInit() {
        this.pageSize = localStorage.getItem('itemsPerPage');
        this.offset = 0;
        this.pagination = 1;
        this.initForm();
    }

// style purpose
    beforeChange($event: NgbPanelChangeEvent) {
        if ($event.panelId === 'preventchange-2') {
            $event.preventDefault();
        }

        if ($event.panelId === 'preventchange-3' && $event.nextState === false) {
            $event.preventDefault();
        }
    }


// initial  Form created
    initForm() {
        this.custftrform = this.fb.group({
            customergroup: [null, [Validators.required]],
            email: [null, [Validators.required]],
            custdate: [null, [Validators.required]],
            customername: [null, [Validators.required]],
        });

    }

// reset form field Value and call 'getCustomerList' function  for call all customer list

    reset() {
        this.custftrform.reset();
        const param: any = {};
        param.limit = this.pageSize;
        param.offset = '';
        param.keyword = '';
        param.pageSize = this.pageSize;
        this.ProgressEmit.emit(param);
        this.sandbox.customerList(param);
    }

    /**
     * Handles from'submit' event . Calls sandbox customerlist and paginationcount function.
     * @param param  storing entire  value
     */
    onSubmit() {
        const param: any = {};
        param.limit = this.pageSize;
        param.offset = this.offset;
        param.name = this.custftrform.value.customername;
        param.email = this.custftrform.value.email;
        param.customerGroup = '';
        param.date = this.custftrform.value.custdate;
        this.ProgressEmit.emit(param);
        this.sandbox.customerList(param);
        // if (this.pagination) {
        param.count = true;
        this.sandbox.PaginationCustomer(param);
        // }

    }


}
