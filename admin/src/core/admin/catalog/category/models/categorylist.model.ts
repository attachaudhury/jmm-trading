/*
 * SpurtCommerce
 * version 2.1
 * http://www.spurtcommerce.com
 *
 * Copyright (c) 2019 PICCOSOFT
 * Author piccosoft <support@spurtcommerce.com>
 * Licensed under the MIT license.
 */

export class CategorylistForm {


    public limit: number;
    public offset: number;
    public keyword: string;
    public sortOrder: string;

    constructor(categorylistForm: any) {
        this.limit = categorylistForm.limit || 0;
        this.offset = categorylistForm.offset || 0;
        this.keyword = categorylistForm.keyword || '';
        this.sortOrder = categorylistForm.sortOrder || '';
    }
}
