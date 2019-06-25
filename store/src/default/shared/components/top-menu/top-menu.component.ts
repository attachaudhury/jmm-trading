/*
 * spurtcommerce
 * version 2.1
 * http://www.spurtcommerce.com
 *
 * Copyright (c) 2019 piccosoft ltd
 * Author piccosoft ltd <support@piccosoft.com>
 * Licensed under the MIT license.
 */
import {Component, OnInit, DoCheck} from '@angular/core';
import {Router} from '@angular/router';
import {ConfigService} from '../../../../core/service/config.service';
import {CommonSandbox} from '../../../../core/common/common.sandbox';
import {TranslateService} from '@ngx-translate/core';
import {ProductControlSandbox} from '../../../../core/product-control/product-control.sandbox';
import { AccountSandbox } from './../../../../core/account/account.sandbox';

@Component({
    selector: 'app-top-menu',
    templateUrl: './top-menu.component.html',
})
export class TopMenuComponent implements OnInit {
    // path of the image
    public imagePath: any;
    // menu
    public accountMenuTrigger: any;
    // language selection
    public language: any;
    // public languageKey = 'language';
    public languageList = [
        {name: 'English'},
        {name: 'हिंदी'}
    ];
    constructor(public configService: ConfigService,
                public router: Router,
                public commonSandbox: CommonSandbox,
                public productControl: ProductControlSandbox,
                private translate: TranslateService) {
    }
    /**calls commonSandbox doGetProfile with default param
     * after calls commonSandbox getWishlistCounts.
     *
     * */
    ngOnInit() {
        this.defaultLanguageMenu();
        this.imagePath = this.configService.get('resize').imageUrl;
        if (localStorage.getItem('userToken')) {
            this.commonSandbox.doGetProfile();
            const params: any = {};
            params.limit = '';
            params.offset = 0;
            params.count = true;
            this.commonSandbox.getWishlistCounts(params);
        }
    }
        /**first clear the local storage data.
         * calls commonSandbox doSignout,
         * Then navigate to authentication module
         * */
    signOut() {
        localStorage.clear();
        this.commonSandbox.doSignout();
        this.router.navigate(['/auth']);
    }

    // change the  language based on selection
    public changeLanguage(data) {
         this.language = data.name;
        if (this.language === 'हिंदी') {
            localStorage.setItem('language', 'हिंदी');
            this.translate.setDefaultLang('hi');
        } else if (this.language === 'English') {
            localStorage.setItem('language', 'english');
            this.translate.setDefaultLang('en');

        }
    }
    // set default language Menu
    defaultLanguageMenu() {
        this.language = localStorage.getItem('language');
        if (this.language) {
            if (this.language === 'हिंदी') {
                this.language = 'हिंदी' ;
            } else {
                this.language = 'English' ;
            }
        } else {
            this.language = 'English' ;
        }
    }

}
