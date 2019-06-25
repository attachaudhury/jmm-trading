/*
 * spurtcommerce API
 * version 2.1
 * http://api.spurtcommerce.com
 *
 * Copyright (c) 2019 piccosoft ltd
 * Author piccosoft ltd <support@piccosoft.com>
 * Licensed under the MIT license.
 */

import {Column, PrimaryGeneratedColumn, Entity, BeforeUpdate, OneToMany, BeforeInsert} from 'typeorm';
import {BaseModel} from './BaseModel';
import {Zone} from './zone';
import moment = require('moment/moment');

@Entity('country')
export class Country extends BaseModel {

    @PrimaryGeneratedColumn({name: 'country_id'})
    public countryId: number;

    @Column({name: 'name'})
    public name: string;

    @Column({name: 'iso_code_2'})
    public isoCode2: string;

    @Column({name: 'iso_code_3'})
    public isoCode3: string;

    @Column({name: 'address_format'})
    public addressFormat: string;

    @Column({name: 'postcode_required'})
    public postcodeRequired: number;

    @Column({name: 'is_active'})
    public isActive: number;

    @OneToMany(type => Zone, zone => zone.country)
    public zone: Zone[];

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdDate = moment().format('YYYY-MM-DD HH:mm:ss');
    }

    @BeforeUpdate()
    public async updateDetails(): Promise<void> {
        this.modifiedDate = moment().format('YYYY-MM-DD HH:mm:ss');
    }
}
