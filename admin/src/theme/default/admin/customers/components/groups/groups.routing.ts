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
import {
    RouterModule,
    Routes
} from '@angular/router';

// Component
import {CustomerGroupAddComponent} from './add/add.component';
import {CustomerGroupListComponent} from './list/list.component';

const customerGroupRoutes: Routes = [
    {path: '', redirectTo: 'list', pathMatch: 'full'},
    {path: 'list', component: CustomerGroupListComponent},
    {path: 'add', component: CustomerGroupAddComponent},
    {
        path: 'edit/:id',
        component: CustomerGroupAddComponent
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(customerGroupRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class CustomerGroupsRoutingModule {
}
