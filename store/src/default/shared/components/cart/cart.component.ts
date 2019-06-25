/*
 * spurtcommerce
 * version 2.1
 * http://www.spurtcommerce.com
 *
 * Copyright (c) 2019 piccosoft ltd
 * Author piccosoft ltd <support@piccosoft.com>
 * Licensed under the MIT license.
 */
import {Component, OnInit, Input} from '@angular/core';
import {SidenavMenuService} from '../sidenav-menu/sidenav-menu.service';
import {ProductControlSandbox} from '../../../../core/product-control/product-control.sandbox';
import {ProductControlService} from '../../../../core/product-control/product-control.service';
import {ConfigService} from '../../../../core/service/config.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-spurt-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss'],
    providers: [ProductControlService, ProductControlSandbox]
})
export class CartNavComponent implements OnInit {
    // path of image
    public imagePath: string;

    constructor(public sidenavMenuService: SidenavMenuService,
                public cartSandbox: ProductControlSandbox,
                public router: Router,
                private configService: ConfigService) {
    }

    // data from configService
    ngOnInit() {
        this.imagePath = this.configService.get('resize').imageUrl;
    }

    // remove product from cart
    remove(product) {
        this.cartSandbox.removeItemFromCart(product);
    }

    // clear cart
    clear() {
        this.cartSandbox.clearCart();
    }

    // navigation to checkout component.And set local storage
    public checkoutPage() {
        const checkoutToken = '1';
        this.router.navigate(['/newcheckout']);
        localStorage.setItem('newcheckout', checkoutToken);

    }
}
