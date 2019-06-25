/*
 * spurtcommerce
 * version 2.1
* www.spurtcommerce.com
 *
 * Copyright (c) 2019 piccosoft ltd
 * Author piccosoft ltd <support@piccosoft.com>
 * Licensed under the MIT license.
 */
export class FeaturedProductResponseModel {
    public productId: string;
    public title: string;
    public name: string;
    public price: string;
    public sku: string;
    public quantity: number;
    public image: Array<any>;


    constructor(bannerResponse: any) {
        this.productId = bannerResponse.productId || '';
        this.title = bannerResponse.metaTagTitle || '';
        this.name = bannerResponse.name || '';
        this.price = bannerResponse.price || '';
        this.sku = bannerResponse.sku || '';
        this.quantity = bannerResponse.quantity || 0;
        this.image = bannerResponse.Images;
    }
}
