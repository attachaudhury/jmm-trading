/*
* SpurtCommerce
* version 2.1
* http://www.spurtcommerce.com
*
* Copyright (c) 2019 PICCOSOFT
* Author piccosoft <support@spurtcommerce.com>
* Licensed under the MIT license.
*/

export class ProductDeleteModel {


    public productId: number;

    constructor(productdeleteForm: any) {
        this.productId = productdeleteForm.productId || '';
    }
}
