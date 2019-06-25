import { OnInit, AfterViewInit } from '@angular/core';
/*
 * spurtcommerce
 * version 2.1
 * http://www.spurtcommerce.com
 *
 * Copyright (c) 2019 piccosoft ltd
 * Author piccosoft ltd <support@piccosoft.com>
 * Licensed under the MIT license.
 */
// component
import {Component} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {Settings, AppSettings} from './app.settings';
// service
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-root',
    templateUrl: './default.component.html',
    styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit , AfterViewInit {
    loading = false;
    public settings: Settings;
    public language: string;

    constructor(public appSettings: AppSettings,
                public router: Router,
                private translate: TranslateService) {
        this.settings = this.appSettings.settings;
    }
        /**    initally  get local storage data for language selection
         *
         * And may the change the language according to the user selection
         *
         * **/
    ngOnInit() {
        this.language = localStorage.getItem('language');
        if (this.language) {
            if (this.language === 'हिंदी') {
                this.translate.setDefaultLang('hi');
            } else {
                this.translate.setDefaultLang('en');
            }
        } else {
            this.translate.setDefaultLang('en');
        }
    }
        // finally subscribe the event from router
    ngAfterViewInit() {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                window.scrollTo(0, 0);
            }
        });
    }
}
