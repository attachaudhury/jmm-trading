/*
 * spurtcommerce
 * version 2.1
 * http://www.spurtcommerce.com
 *
 * Copyright (c) 2019 piccosoft ltd
 * Author piccosoft ltd <support@piccosoft.com>
 * Licensed under the MIT license.
 */
import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {ProductControlSandbox} from '../../../../core/product-control/product-control.sandbox';
import {Router} from '@angular/router';


@Component({
    selector: 'app-controls',
    templateUrl: './controls.component.html',
    styleUrls: ['./controls.component.scss'],
})
export class ControlsComponent implements OnInit {
    // decorator
    @Input() product: any;
    @Input() type: string;
    @Output() OpenProductDialog: EventEmitter<any> = new EventEmitter();
    @Output() QuantityChange: EventEmitter<any> = new EventEmitter<any>();
    // pagination count
    public count = 1;
    public align = 'center center';
    // whislist
    public quantity: any = 1;
    public isWish: any = {};

    constructor(public snackBar: MatSnackBar,
                public controlSandbox: ProductControlSandbox,
                private router: Router) {
    }
                // intially get the cart data and calls layoutAlign
    ngOnInit() {
        if (this.product) {
            if (this.product.cartCount > 0) {
                this.count = this.product.cartCount;
            }
        }
        this.layoutAlign();
    }

    // align layout based on condition type
    public layoutAlign() {
        if (this.type === 'all') {
            this.align = 'space-between center';
        } else if (this.type === 'wish') {
            this.align = 'start center';
        } else if (this.type === 'detail') {
            this.align = 'start center';
        } else {
            this.align = 'center center';
        }
    }

    // change quantity of the product
    public changeCount(operation) {
        const product: any = {};
        if (operation === 'remove' && (this.quantity > 1)) {
            this.quantity -= 1;
        } else  if (operation === 'add') {
            this.quantity += 1;
        }

    }

    // add product to wishlist
    public addToWishList(product) {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        if (currentUser) {
            const params: any = {};
            params.productId = product.productId;
            this.controlSandbox.addToWishlist(params);
        } else {
            this.router.navigate(['/auth']);
        }
    }

    // add product to cart

    public addToCart(product) {
        product.productCount = this.quantity;
        this.controlSandbox.addItemsToCart(product);
    }
            // emit the data from open product dialoug
    public openProductDialog(event) {
        this.OpenProductDialog.emit(event);
    }

    // emit quantity while changing
    public changeQuantity(value) {
        this.QuantityChange.emit(value);
    }

}
