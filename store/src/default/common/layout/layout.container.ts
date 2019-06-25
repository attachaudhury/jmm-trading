/*
 * spurtcommerce
 * version 2.1
 * http://www.spurtcommerce.com
 *
 * Copyright (c) 2019 piccosoft ltd
 * Author piccosoft ltd <support@piccosoft.com>
 * Licensed under the MIT license.
 */
import {Component, OnInit, HostListener, ViewChild, AfterViewInit} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {Settings, AppSettings} from '../../app.settings';
import {SidenavMenuService} from '../../shared/components/sidenav-menu/sidenav-menu.service';
import {ListsSandbox} from '../../../core/lists/lists.sandbox';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.container.html',
    styleUrls: ['./layout.container.scss'],
    providers: [SidenavMenuService]
})
export class LayoutContainerComponent implements OnInit, AfterViewInit {
    // go back event
    public showBackToTop = false;
    // decorator
    @ViewChild('sidenav') sidenav: any;
    // AppSettings
    public settings: Settings;

    constructor(public appSettings: AppSettings,
                public sidenavMenuService: SidenavMenuService,
                public router: Router, public listSandBox: ListsSandbox) {
        this.settings = this.appSettings.settings;
    }

    ngOnInit() {
        this.getCategories();
       // this.listSandBox.categoryList$.subscribe(data=>);
    }
    @HostListener('window:scroll', ['$event'])
    onWindowScroll($event) {
        ($event.target.documentElement.scrollTop > 300) ? this.showBackToTop = true : this.showBackToTop = false;
    }

    ngAfterViewInit() {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.sidenav.close();
            }
        });
        this.sidenavMenuService.expandActiveSubMenu(this.sidenavMenuService.getSidenavMenuItems());
    }
    /**
     * fetch cahegory list from the ListsSandbox. Calls sandbox getCategoryList.
     *
     * @param limit number of records should load
     * @param offset start key for the record
     * @param keyword keyword search from the category list
     * @param sortOrder filter based on sort order
     */
    public getCategories() {
        const params: any = {};
        params.limit = '';
        params.offset = 0;
        params.keyword = '';
        params.sortOrder = '';
        this.listSandBox.getCategoryList(params);
    }

    // scroll the window to the top
    public scrollToTop() {
        const scrollDuration = 200;
        const scrollStep = -window.pageYOffset / (scrollDuration / 20);
        const scrollInterval = setInterval(() => {
            if (window.pageYOffset !== 0) {
                window.scrollBy(0, scrollStep);
            } else {
                clearInterval(scrollInterval);
            }
        }, 10);
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                window.scrollTo(0, 0);
            });
        }
    }
      // to change the theme. select the theme from settings service
      public changeTheme(theme) {
        this.settings.theme = theme;
    }
}
