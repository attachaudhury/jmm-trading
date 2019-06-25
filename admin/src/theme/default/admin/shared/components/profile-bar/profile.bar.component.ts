/*
* SpurtCommerce
* version 2.1
* http://www.spurtcommerce.com
*
* Copyright (c) 2019 PICCOSOFT
* Author piccosoft <support@spurtcommerce.com>
* Licensed under the MIT license.
*/
import {Component, EventEmitter, Output, Input} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

declare var $: any;

@Component({
    selector: 'app-profile-bar',
    templateUrl: './profile.bar.component.html',
    styleUrls: ['./profile.bar.component.scss']

})
export class ProfileBarComponent {

    @Output() toggleSidebar = new EventEmitter<void>();
    @Input() userDetails: any;
    @Output() logout: EventEmitter<any> = new EventEmitter();
}
