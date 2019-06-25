/*
* SpurtCommerce
* version 2.1
* http://www.spurtcommerce.com
*
* Copyright (c) 2019 PICCOSOFT
* Author piccosoft <support@spurtcommerce.com>
* Licensed under the MIT license.
*/
import {Map, Record} from 'immutable';


export interface PersonalizeProductState extends Map<string, any> {

    newPersonalizeProduct: any;
    getPersonalizeProduct: any;

}

export const PersonalizeProductRecordState = Record({
    newPersonalizeProduct: {},
    getPersonalizeProduct: {},
});
