/*
 * SpurtCommerce
 * version 2.1
 * http://www.spurtcommerce.com
 *
 * Copyright (c) 2019 PICCOSOFT
 * Author piccosoft <support@spurtcommerce.com>
 * Licensed under the MIT license.
 */
export class OrderstatusForm {


    public name: String;
    public status: number;
    public id: number;
    public colorCode: string;

    constructor(OrdstatusForm: any) {
        this.name = OrdstatusForm.name || '';
        this.status = OrdstatusForm.status || 0;
        this.colorCode = OrdstatusForm.colorcode || '';
        if (OrdstatusForm.orderStatusId) {
            this.id = OrdstatusForm.orderStatusId || '';
        }
    }
}
