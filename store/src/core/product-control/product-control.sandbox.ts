/*
 * spurtcommerce
 * version 2.1
 * http://www.spurtcommerce.com
 *
 * Copyright (c) 2019 piccosoft ltd
 * Author piccosoft ltd <support@piccosoft.com>
 * Licensed under the MIT license.
 */
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {Subscription} from 'rxjs';
import * as authAction from './action/product-control.action';
import * as store from '../state.interface';
import {MatSnackBar} from '@angular/material';
import {
    getCartList, getCartListCount, getCheckedOutData, getCheckoutFailed, getCheckoutLoaded, getCheckoutLoading,
    getTotalCartPrice
} from './reducer/product-control.selector';
import {CheckoutModel} from './models/checkout.model';

@Injectable()
export class ProductControlSandbox {
    public cartlist$ = this.appState$.select(getCartList);
    public cartlistCount$ = this.appState$.select(getCartListCount);
    public totalCartPrice$ = this.appState$.select(getTotalCartPrice);
    public checkedOutData$ = this.appState$.select(getCheckedOutData);

    public checkoutLoading$ = this.appState$.select(getCheckoutLoading);
    public checkoutLoaded$ = this.appState$.select(getCheckoutLoaded);
    public checkoutFailed$ = this.appState$.select(getCheckoutFailed);

    selectedProducts: any[] = [];
    cartTotal = 0;
    productTotal = 0;
    private subscriptions: Array<Subscription> = [];

    constructor(private router: Router,
                protected appState$: Store<store.AppState>, public snackBar: MatSnackBar) {
        this.completeOrder();
    }

    public addToWishlist(params): void {
        this.appState$.dispatch(new authAction.AddtoWishlist(params));
    }

    /**
     * add selected item to cart
     *
     * @param item product detail to be added to cart
     */
    addItemsToCart(item) {
        let exists = false;
        this.getSessionData();
        this.selectedProducts = this.selectedProducts.map(_items => {
            if (_items.productId === item.productId) {
                exists = true;
                if (item.productCount) {
                    _items.productCount += item.productCount;
                    this.cartTotal += item.productCount;
                } else {
                    _items.productCount += 1;
                    this.cartTotal += 1;
                }
            }
            return _items;
        });
        if (!exists) {
            this.selectedProducts.push(item);
            if (!item.productCount) {
                item.productCount = 1;
            }
            this.cartTotal += item.productCount;
        }
        this.productTotal = 0;
        this.selectedProducts.forEach(_price => {
            const tempPrice = Number(_price.price * _price.productCount);
            this.productTotal += tempPrice;
        });
        const cartParams: any = {};
        cartParams.products = this.selectedProducts;
        cartParams.productTotal = this.cartTotal;
        cartParams.totalPrice = this.productTotal;
        this.snackBar.open('Product ' + item.name + ' is successfully added to cart', '×', {
            panelClass: 'success',
            verticalPosition: 'top',
            horizontalPosition: 'right',
            duration: 3000
        });
        this.HandleCart(cartParams);

    }

    /**
     * remove selected item to cart
     *
     * @param item product detail to be remove to cart
     */
    removeItemFromCart(item) {
        this.getSessionData();
        let deletedCount: any = 0;
        this.selectedProducts = this.selectedProducts.filter(_items => {
            if (_items.productId === item.productId) {
                deletedCount = _items.productCount;
                return false;
            }
            return true;
        });
        this.cartTotal -= deletedCount;
        this.productTotal = 0;
        this.selectedProducts.forEach(_price => {
            const tempPrice = Number(_price.price);
            this.productTotal += (tempPrice * _price.productCount);
        });
        const cartParams: any = {};
        cartParams.products = this.selectedProducts;
        cartParams.productTotal = this.cartTotal;
        cartParams.totalPrice = this.productTotal;
        this.HandleCart(cartParams);
    }

    /**
     * increase or decrease product count from cart
     *
     * @param product product detail to be remove to cart
     * @param operation increase or decrease
     */
    ChangeCount(product, operation) {
        this.getSessionData();
        if (operation) {
            this.selectedProducts = this.selectedProducts.map(_items => {
                if (_items.productId === product.productId) {
                    _items.productCount += 1;
                    this.cartTotal += 1;
                }
                return _items;
            });
        } else if (!operation) {
            if (product.productCount > 1) {
                this.selectedProducts = this.selectedProducts.map(_items => {
                    if (_items.productId === product.productId) {
                        _items.productCount -= 1;
                        this.cartTotal -= 1;
                    }
                    return _items;
                });
            } else if (product.productCount === 1) {
                this.cartTotal -= 1;
                this.selectedProducts = this.selectedProducts.filter(_items => {
                    if (_items.productId === product.productId) {
                        return false;
                    } else {
                        return true;
                    }
                });
            }
        }

        this.productTotal = 0;
        this.selectedProducts.forEach(_price => {
            const tempPrice = Number(_price.price);
            this.productTotal += (tempPrice * _price.productCount);
        });
        const cartParams: any = {};
        cartParams.products = this.selectedProducts;
        cartParams.productTotal = this.cartTotal;
        cartParams.totalPrice = this.productTotal;
        this.HandleCart(cartParams);
    }

    /**
     * clear all products from cart
     */
    clearCart() {
        const cartParams: any = {};
        cartParams.products = [];
        cartParams.productTotal = 0;
        cartParams.totalPrice = 0;
        this.HandleCart(cartParams);
    }

    /**
     * handle cart cart
     * @param params product detail
     */
    HandleCart(params) {
        sessionStorage.setItem('productTotal', JSON.stringify(params.totalPrice));
        sessionStorage.setItem('selectedProducts', JSON.stringify(params.products));
        sessionStorage.setItem('selectedProductsCount', JSON.stringify(params.productTotal));
        this.appState$.dispatch(new authAction.CartHandleAction(params));
    }

    /**
     * do checkout products
     */
    PlaceOrder(params) {
        this.appState$.dispatch(new authAction.DoCheckoutAction(new CheckoutModel(params)));
    }

    /**
     * get session data from session storage
     */
    public getSessionData() {

        this.selectedProducts = sessionStorage.getItem('selectedProducts') ? JSON.parse(sessionStorage.getItem('selectedProducts')) : [];
        const cartTotal: number = sessionStorage.getItem('selectedProducts') ? parseFloat(sessionStorage.getItem('selectedProductsCount')) : 0;
        this.cartTotal = cartTotal;
        const productTotal: number = sessionStorage.getItem('productTotal') ? parseFloat(sessionStorage.getItem('productTotal')) : 0;
        this.productTotal = productTotal;

    }

    /**
     * subscribe checkout status events
     */
    completeOrder() {
        this.checkedOutData$.subscribe(data => {
            if (data) {
                if (data.customerId) {
                    this.router.navigate(['/checkout/success']);
                    const params: any = {};
                    params.products = [];
                    params.productTotal = 0;
                    params.totalPrice = 0;
                    this.HandleCart(params);
                }
            }
        });
    }
}
