/*
* SpurtCommerce
* version 2.1
* http://www.spurtcommerce.com
*
* Copyright (c) 2019 PICCOSOFT
* Author piccosoft <support@spurtcommerce.com>
* Licensed under the MIT license.
*/
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DefaultCommonModule} from '../../../../default.common.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

// components
import {CustomerGroupAddComponent} from './add/add.component';
import {CustomerGroupListComponent} from './list/list.component';

// Store Actions
import {EffectsModule} from '@ngrx/effects';
import {CustomersApiClientService} from '../../../../../../core/admin/Customers/customers/customer.ApiClient.service';
import {Customereffects} from '../../../../../../core/admin/Customers/customers/customer-effects/customer.effects';
import {CustomerSandbox} from '../../../../../../core/admin/Customers/customers/customer.sandbox';

// Routing Module
import {CustomerGroupsRoutingModule} from './groups.routing';

// Shared Module
import {MaterialModule} from '../../../../default.material.module';
import {TranslateModule} from '@ngx-translate/core';
import {SelectDropDownModule} from 'ngx-select-dropdown/dist/index';


@NgModule({
    declarations: [
        CustomerGroupAddComponent,
        CustomerGroupListComponent
    ],
    imports: [
        CommonModule,
        DefaultCommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        CustomerGroupsRoutingModule,
        SelectDropDownModule,
        EffectsModule.forRoot([Customereffects]),
        TranslateModule.forChild()
    ],
    providers: [
        CustomersApiClientService,
        CustomerSandbox
    ],
    bootstrap: [],
    entryComponents: []
})

export class CustomerGroupsModule {
}
