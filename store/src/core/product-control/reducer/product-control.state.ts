/*
 * spurtcommerce
 * version 2.1
 * http://www.spurtcommerce.com
 *
 * Copyright (c) 2019 piccosoft ltd
 * Author piccosoft ltd <support@piccosoft.com>
 * Licensed under the MIT license.
 */
import {Map, Record} from 'immutable';

export interface ProductControlState extends Map<string, any> {
    wishlist: any;
    cartList: any;
    cartCount: any;
    totalCartPrice: any;
    checkedOut: any;

    checkoutLoading: any;
    checkoutLoaded: any;
    checkoutFailed: any;
}

export const productControlRecord = Record({
    wishlist: [],
    cartList: sessionStorage.getItem('selectedProducts') ? JSON.parse(sessionStorage.getItem('selectedProducts')) : [],
    cartCount: sessionStorage.getItem('selectedProductsCount') ? parseFloat(sessionStorage.getItem('selectedProductsCount')) : 0,
    totalCartPrice: sessionStorage.getItem('productTotal') ? parseFloat(sessionStorage.getItem('productTotal')) : 0,
    checkedOut: [],

    checkoutLoading: false,
    checkoutLoaded: false,
    checkoutFailed: false,
});
