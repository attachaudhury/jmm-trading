/*
 * spurtcommerce API
 * version 2.1
 * http://api.spurtcommerce.com
 *
 * Copyright (c) 2019 piccosoft ltd
 * Author piccosoft ltd <support@piccosoft.com>
 * Licensed under the MIT license.
 */

import 'reflect-metadata';
import { IsNotEmpty , MinLength, MaxLength } from 'class-validator';

export class ChangePassword {

    @MaxLength(10, {
        message: 'Old Password is maximum 10 character',
    })
    @MinLength(5, {
        message: 'Old Password is minimum 5 character',
    })
    @IsNotEmpty()
    public oldPassword: string;

    @MaxLength(10, {
        message: 'New Password is maximum 10 character',
    })
    @MinLength(5, {
        message: 'New Password is minimum 5 character',
    })
    @IsNotEmpty({
        message: 'New Password is required',
    })
    public newPassword: string;
}
