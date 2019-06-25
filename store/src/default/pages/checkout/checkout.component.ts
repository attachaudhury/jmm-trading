/*
 * spurtcommerce
 * version 2.1
 * http://www.spurtcommerce.com
 *
 * Copyright (c) 2019 piccosoft ltd
 * Author piccosoft ltd <support@piccosoft.com>
 * Licensed under the MIT license.
 */
import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar, MatStepper} from '@angular/material';
import {emailValidator} from '../../theme/utils/app-validators';
import {ProductControlSandbox} from '../../../core/product-control/product-control.sandbox';
import {ListsSandbox} from '../../../core/lists/lists.sandbox';
import {ConfigService} from '../../../core/service/config.service';

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
    // decorator
    @ViewChild('horizontalStepper') horizontalStepper: MatStepper;
    @ViewChild('verticalStepper') verticalStepper: MatStepper;
    // reactive form
    public checkoutForm: FormGroup;
    // validation
    public submitted = false;
    // image
    public imagePath: any;

    constructor(public formBuilder: FormBuilder, public snackBar: MatSnackBar,
                public productControlSandbox: ProductControlSandbox,
                public listsSandbox: ListsSandbox,
                public configService: ConfigService,
                private changeDetectRef: ChangeDetectorRef) {
    }

    // Initially calls initCheckoutForm function
    ngOnInit() {
        this.initCheckoutForm();
        this.imagePath = this.configService.get('resize').imageUrl;
        this.changeDetectRef.detectChanges();
    }

    // create form group for checkout
    initCheckoutForm() {
        this.checkoutForm = this.formBuilder.group({
            'firstName': ['', Validators.required],
            'lastName': ['', Validators.required],
            'middleName': '',
            'company': '',
            'email': ['', Validators.compose([Validators.required, emailValidator])],
            'phone': ['', Validators.compose([Validators.required])],
            'country': ['', Validators.required],
            'city': ['', Validators.required],
            'state': ['', Validators.required],
            'zip': ['', Validators.required],
            'address': ['', Validators.required],
            'addressLine': ''
        });
    }

    /**
     * place order with product detail, if the form is valid
     *
     * remove checkout local storage.
     * @param productDetails detail of the product for checkout
     */
    public placeOrder(productDetails) {
        this.submitted = true;
        if (productDetails.length === 0) {
            this.snackBar.open('Add items to place order', '×', {
                panelClass: 'error',
                verticalPosition: 'top',
                horizontalPosition: 'right',
                duration: 3000
            });
            return;
        }
        if (!this.checkoutForm.valid) {
            return;
        }
        const params = this.checkoutForm.value;
        params.productDetail = productDetails;
        localStorage.removeItem('checkout');
        this.productControlSandbox.PlaceOrder(params);
    }

    /**
     * increase or decrease product count
     *
     * @param product added product details
     * @param operation differentiate the operation is increament operation or decrement operation
     */
    changeCount(product, operation) {
        this.productControlSandbox.ChangeCount(product, operation);
    }

    // remove product from the cart, calling removeItemFromCart function from sandbox
    removeProduct(product) {
        this.productControlSandbox.removeItemFromCart(product);
    }

    // clear cart, for remove all products in the cart
    public clear() {
        this.productControlSandbox.clearCart();
    }
}
