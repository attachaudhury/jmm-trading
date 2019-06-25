/*
 * spurtcommerce
 * version 2.1
 * http://www.spurtcommerce.com
 *
 * Copyright (c) 2019 piccosoft ltd
 * Author piccosoft ltd <support@piccosoft.com>
 * Licensed under the MIT license.
 */
import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ProductControlSandbox} from '../../../core/product-control/product-control.sandbox';
import {ConfigService} from '../../../core/service/config.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
    // image
    public imagePath: string;

    constructor(public productControl: ProductControlSandbox,
                private configService: ConfigService,
                public router: Router,
                private changeDetectRef: ChangeDetectorRef) {
    }
        // initially get configService data and subscribe cartlist response
    ngOnInit() {
        this.imagePath = this.configService.get('resize').imageUrl;
        this.changeDetectRef.detectChanges();
        this.productControl.cartlist$.subscribe(data => {
            this.changeDetectRef.detectChanges();
        });

    }

    // increase or decrease product count
    changeCount(product, operation) {
        this.productControl.ChangeCount(product, operation);
    }

    // remove product from cart
    removeProduct(product) {
        this.productControl.removeItemFromCart(product);
    }

    // clear cart
    public clear() {
        this.productControl.clearCart();
    }

    // navigation to checkout component.And set local storage
    public checkoutPage() {
        //this.router.navigate(['/checkwalletbalance']);
        //return false;
        const checkoutToken = '1';
        this.router.navigate(['/newcheckout']);
        localStorage.setItem('newcheckout', checkoutToken);

    }

}
