/*
 * spurtcommerce
 * version 2.1
 * http://www.spurtcommerce.com
 *
 * Copyright (c) 2019 piccosoft ltd
 * Author piccosoft ltd <support@piccosoft.com>
 * Licensed under the MIT license.
 */
// module
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SwiperModule} from 'ngx-swiper-wrapper';
import {NgxPaginationModule} from 'ngx-pagination';
import {SharedModule} from '../../shared/shared.module';
import {ComponentsModule} from '../../shared/components/index';
import {TranslateModule} from '@ngx-translate/core';
// component
import {ProductsComponent} from './products.component';
import {ProductComponent} from './product/product.component';
import {ProductZoomComponent} from './product/product-zoom/product-zoom.component';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {ProductFilterComponent} from './product-filter/product-filter.component';




export const routes = [
    {path: '', component: ProductsComponent, pathMatch: 'full'},
    {path: 'productdetails/:id', component: ProductComponent, pathMatch: 'full'}
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        ReactiveFormsModule,
        SwiperModule,
        NgxPaginationModule,
        SharedModule,
        ComponentsModule,
        PipesModule,
        TranslateModule.forChild()
    ],
    declarations: [
        ProductsComponent,
        ProductComponent,
        ProductZoomComponent,
        ProductFilterComponent,
    ],
    entryComponents: [
        ProductZoomComponent
    ],
    providers: []
})
export class ProductsModule {
}
