/*
 * spurtcommerce
 * version 2.1
* www.spurtcommerce.com
 *
 * Copyright (c) 2019 piccosoft ltd
 * Author piccosoft ltd <support@piccosoft.com>
 * Licensed under the MIT license.
 */
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {Subscription, Subject} from 'rxjs';
import * as authAction from './action/lists.action';
import * as store from '../state.interface';
import {
    bannerCount,
    bannerFailedStatus,
    bannerList, bannerLoadedStatus,
    bannerLoadingStatus, contactUsFailedStatus,
    contactUsLoadedStatus, contactUsLoadingStatus,
    countFailedStatus, countLoadedStatus,
    countLoadingStatus, countryFailed,
    countryList, countryLoaded,
    countryLoading, featuredList,
    featuredListFailedStatus, featuredListLoadedStatus,
    featuredListLoadingStatus, getCategoryList,
    getContactDetail, getManufacturer, getPageList,
    getProductCount, getProductDetail,
    getProductFailed, getProductList,
    getProductLoaded, getProductLoading,
    getRelatedProducts, manufacturerFailedStatus,
    manufacturerLoadedStatus, manufacturerLoadingStatus,
    pageDetail, pageDetailFailedStatus,
    pageDetailLoadedStatus, pageDetailLoadingStatus,
    pageListFailedStatus, pageListLoadedStatus,
    pageListLoadingStatus, productDetailFailedStatus,
    productDetailLoadedStatus, productDetailLoadingStatus,
    relatedProductFailedStatus, relatedProductLoadedStatus,
    relatedProductLoadingStatus, settingDetail, zoneList,
    zoneLoading, zoneLoaded, zoneFailed, getMaxProductPrice,
    getCategoryListShowLess
} from './reducer/lists.selector';
import {FeaturedProductModel} from './models/featured-product.model';
import {ContactUsRequestModel} from './models/contact-us-request.model';


@Injectable()
export class ListsSandbox {

    public categoryList$ = this.appState$.select(getCategoryList);
    public categoryListShowLess$ = this.appState$.select(getCategoryListShowLess);
    public relatedProducts$ = this.appState$.select(getRelatedProducts);
    public manufacturer$ = this.appState$.select(getManufacturer);
    public productDetails$ = this.appState$.select(getProductDetail);
    /* product status*/
    public productlist$ = this.appState$.select(getProductList);
    public maxProductPrice$ = this.appState$.select(getMaxProductPrice);
    public productcount$ = this.appState$.select(getProductCount);
    public productLoading$ = this.appState$.select(getProductLoading);
    public productLoaded$ = this.appState$.select(getProductLoaded);
    public productFailed$ = this.appState$.select(getProductFailed);
    /* banner status*/

    public bannerList$ = this.appState$.select(bannerList);
    public bannerListLoading$ = this.appState$.select(bannerLoadingStatus);
    public bannerListLoaded$ = this.appState$.select(bannerLoadedStatus);
    public bannerListFailed$ = this.appState$.select(bannerFailedStatus);

    public bannerCount$ = this.appState$.select(bannerCount);
    public bannerCountLoading$ = this.appState$.select(countLoadingStatus);
    public bannerCountLoaded$ = this.appState$.select(countLoadedStatus);
    public bannerCountFailed$ = this.appState$.select(countFailedStatus);
    /* featured product status*/

    public featuredList$ = this.appState$.select(featuredList);
    public featuredListLoading$ = this.appState$.select(featuredListLoadingStatus);
    public featuredListLoaded$ = this.appState$.select(featuredListLoadedStatus);
    public featuredListFailed$ = this.appState$.select(featuredListFailedStatus);
    /* related product status*/

    public relatedProductLoadingStatus$ = this.appState$.select(relatedProductLoadingStatus);
    public relatedProductLoadedStatus$ = this.appState$.select(relatedProductLoadedStatus);
    public relatedProductFailedStatus$ = this.appState$.select(relatedProductFailedStatus);
    /* page list status*/

    public pageList$ = this.appState$.select(getPageList);
    public pageListLoading$ = this.appState$.select(pageListLoadingStatus);
    public pageListLoaded$ = this.appState$.select(pageListLoadedStatus);
    public pageListFailed$ = this.appState$.select(pageListFailedStatus);
    public settingDetail$ = this.appState$.select(settingDetail);
    /* contact us status*/

    public contactUsLoaded$ = this.appState$.select(contactUsLoadingStatus);
    public contactUsLoading$ = this.appState$.select(contactUsLoadedStatus);
    public contactUsFailed$ = this.appState$.select(contactUsFailedStatus);
    public contactUs$ = this.appState$.select(getContactDetail);
    /* page detail status*/

    public pageDetailLoading$ = this.appState$.select(pageDetailLoadingStatus);
    public pageDetailLoaded$ = this.appState$.select(pageDetailLoadedStatus);
    public pageDetailFailed$ = this.appState$.select(pageDetailFailedStatus);
    public pageDetail$ = this.appState$.select(pageDetail);
    /* brand status*/

    public manufacturerLoading$ = this.appState$.select(manufacturerLoadingStatus);
    public manufacturerLoaded$ = this.appState$.select(manufacturerLoadedStatus);
    public manufacturerFailed$ = this.appState$.select(manufacturerFailedStatus);
    /* product detail status*/

    public productDetailLoading$ = this.appState$.select(productDetailLoadingStatus);
    public productDetailLoaded$ = this.appState$.select(productDetailLoadedStatus);
    public productDetailFailed$ = this.appState$.select(productDetailFailedStatus);
    /* country list status*/

    public countryList$ = this.appState$.select(countryList);
    public countryLoaded$ = this.appState$.select(countryLoading);
    public countryLoading$ = this.appState$.select(countryLoaded);
    public countryFailed$ = this.appState$.select(countryFailed);

    /* zone list status*/

    public zoneList$ = this.appState$.select(zoneList);
    public zoneLoaded$ = this.appState$.select(zoneLoading);
    public zoneLoading$ = this.appState$.select(zoneLoaded);
    public zoneFailed$ = this.appState$.select(zoneFailed);
    private subscriptions: Array<Subscription> = [];
    /** create a subject send the value from menucomponent and recieve value to productFilterComponent*/
    productFilterData = new Subject<any>();

    constructor(private router: Router,
                protected appState$: Store<store.AppState>) {
        this.registerEvents();
        this.getSettings();
        const params: any = {};
        params.limit = 10;
        params.offset = 0;
        params.keyword = '';
        this.getCountryList(params);
        params.limit = '';
        params.offset = '';
        params.count = '';
        this.getZoneList(params);
    }

    public getProductList(params): void {
        this.appState$.dispatch(new authAction.GetProductList(params));
    }

    public getProductCount(params): void {
        this.appState$.dispatch(new authAction.GetProductCount(params));
    }

    public getCategoryList(params): void {
        this.appState$.dispatch(new authAction.GetCategoryList(params));
    }

    public getBannerList(params): void {
        this.appState$.dispatch(new authAction.GetBannerList(params));
    }

    public getRelatedProducts(params): void {
        this.appState$.dispatch(new authAction.GetRelatedProductList(params));
    }

    public getManufacturerList(params): void {
        this.appState$.dispatch(new authAction.GetManufacturerList(params));
    }

    public getProductDetails(params): void {
        this.appState$.dispatch(new authAction.GetProductDetail(params));
    }

    public getFeaturedList(params): void {
        this.appState$.dispatch(new authAction.GetFeaturedProductList(new FeaturedProductModel(params)));
    }

    public getPageList(params): void {
        this.appState$.dispatch(new authAction.GetPageList(params));
    }

    public getSettings(): void {
        this.appState$.dispatch(new authAction.GetSettings());
    }

    public contactUs(params): void {
        this.appState$.dispatch(new authAction.DoContactUsAction(new ContactUsRequestModel(params)));
    }

    public getPageDetail(params): void {
        this.appState$.dispatch(new authAction.GetPageDetails(params));
    }

    public getCountryList(params): void {
        this.appState$.dispatch(new authAction.GetCountryList(params));
    }

    public getZoneList(params): void {
        this.appState$.dispatch(new authAction.GetZoneList(params));

    }

    public registerEvents() {
        this.subscriptions.push(this.contactUs$.subscribe(contact => {
            if (contact && contact['status'] === 1) {
                this.router.navigate(['/']);
            }
        }));

    }
}
