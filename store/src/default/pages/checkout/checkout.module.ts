/*
 * spurtcommerce
 * version 2.1
 * http://www.spurtcommerce.com
 *
 * Copyright (c) 2019 piccosoft ltd
 * Author piccosoft ltd <support@piccosoft.com>
 * Licensed under the MIT license.
 */
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';

// shared modules
import {SharedModule} from '../../shared/shared.module';
import {ComponentsModule} from '../../shared/components/index';

// components
import {CheckoutComponent} from './checkout.component';
import {CheckoutSuccessComponent} from './checkout-success/checkout-success.component';

// store
import {EffectsModule} from '@ngrx/effects';
import {ProductControlEffect} from '../../../core/product-control/effects/product-control.effect';
import {ProductControlService} from '../../../core/product-control/product-control.service';
import {ProductControlSandbox} from '../../../core/product-control/product-control.sandbox';
import {TranslateModule} from '@ngx-translate/core';
import {NumberAcceptModule} from '../../shared/validation-directives/onlyNumber.module';

export const routes = [
    {path: '', component: CheckoutComponent, pathMatch: 'full'},
    {path: 'success', component: CheckoutSuccessComponent, pathMatch: 'full'}
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule,
        SharedModule,
        ComponentsModule,
        EffectsModule.forFeature([ProductControlEffect]),
        TranslateModule.forChild(),
        NumberAcceptModule
    ],
    declarations: [
        CheckoutComponent,
        CheckoutSuccessComponent
    ],
    providers: [ProductControlSandbox, ProductControlService]
})
export class CheckoutModule {
}
