/*
 * spurtcommerce
 * version 2.1
 * http://www.spurtcommerce.com
 *
 * Copyright (c) 2019 piccosoft ltd
 * Author piccosoft ltd <support@piccosoft.com>
 * Licensed under the MIT license.
 */
export class CheckoutProductModel {
    public product: any = [];

    constructor(productRequest: any) {
        productRequest.forEach(request => {
            const details: any = {};
            details.productId = request.productId || '';
            details.quantity = request.productCount || '';
            details.price = request.price || '';
            details.model = request.metaTagTitle || '';
            details.name = request.name || '';
            this.product.push(details);
        });
    }
}
export class CheckoutModel {
    public productDetails: any;
    public shippingFirstName: any;
    public shippingLastName: any;
    public shippingCompany: any;
    public shippingAddress_1: any;
    public shippingAddress_2: any;
    public shippingCity: any;
    public shippingPostCode: any;
    public shippingCountry: any;
    public shippingZone: any;
    public shippingAddressFormat: any;
    public phoneNumber: any;
    public emailId: any;

    constructor(checkoutRequest: any) {
        this.shippingFirstName = checkoutRequest.firstName || '';
        this.shippingLastName = checkoutRequest.lastName || '';
        this.shippingCompany = checkoutRequest.company || '';
        this.shippingAddress_1 = checkoutRequest.address || '';
        this.shippingAddress_2 = checkoutRequest.address || '';
        this.shippingCity = checkoutRequest.city || '';
        this.shippingPostCode = checkoutRequest.zip || '';
        this.shippingCountry = checkoutRequest.country || '';
        this.shippingZone = checkoutRequest.state || '';
        this.phoneNumber = checkoutRequest.phone || '';
        this.shippingAddressFormat = checkoutRequest.addressLine || '';
        this.emailId = checkoutRequest.email || '';
        this.productDetails = new CheckoutProductModel(checkoutRequest.productDetail);

    }
}


