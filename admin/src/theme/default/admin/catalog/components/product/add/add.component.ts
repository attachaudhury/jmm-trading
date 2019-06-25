/*
 * SpurtCommerce
 * version 2.1
 * http://www.spurtcommerce.com
 *
 * Copyright (c) 2019 PICCOSOFT
 * Author piccosoft <support@spurtcommerce.com>
 * Licensed under the MIT license.
 */

import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbModal, NgbPanelChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs';
// Store Module
import {ImagemanagerpopupComponent} from '../../../../shared/model-popup/ImageManagerPopup/imagemanagerpopup.component';
import {ProductSandbox} from '../../../../../../../core/admin/catalog/product/product.sandbox';
import {CategoriesSandbox} from '../../../../../../../core/admin/catalog/category/categories.sandbox';
import {BrandSandbox} from '../../../../../../../core/admin/catalog/brand/brand.sandbox';
import {ConfigService} from '../../../../../../../core/admin/service/config.service';

@Component({
    selector: 'app-add-products',
    templateUrl: 'add.component.html',
    styleUrls: ['./add.component.scss'],
})
export class ProductAddComponent implements OnInit, OnDestroy {


    // reactive form
    public user: FormGroup;
    public productName: FormControl;
    public metaTagTitle: FormControl;
    public productDescription: FormControl;
    public upc: FormControl;
    public sku: FormControl;
    public model: FormControl;
    public location: FormControl;
    public price: FormControl;
    public minimumQuantity: FormControl;
    public quantity: FormControl;
    public subtractStock: FormControl;
    public outOfStockStatus: FormControl;
    public requiredShipping: FormControl;
    public dateAvailable: FormControl;
    public status: FormControl;
    public sortOrder: FormControl;
    public condition: FormControl;

    // editing values
    public editId: any;
    // pagination
    public catagory: any;
    // selected category list
    public selectedCategories: any = [];
    // upload
    public uploadImage: any = [];
    // selectedCategories data in TotalCategories
    public TotalCategories: any = [];
    public filteredArray: any[];
    // product add or update api params
    private param: any = {};
    // getting values from popup
    private closeResult: any;
    private getDismissReason: any;
    // condition for product remove
    private show: boolean;
    // condition for product add or update api
    private onetimeEdit: boolean;

    private CategoryValue: boolean;
    // validation
    public submittedValues: boolean;
    public length: number;
    // image view
    public imageUrls: string;
    public defaultImageValue: number;
    // add categories only when add button clicked
    private addOneTime: boolean;
    // selected products in paroducts
    public selectedProducts: any = [];
    // add product data
    private totalArray: any = [];
    public addOneTimeData: boolean;
    // search product
    private searchKeyword: string;
    private subscriptions: Array<Subscription> = [];


    // ck editor

    name = 'ng2-ckeditor';
    ckeConfig: any;
    mycontent: string;
    public log: string;
    @ViewChild('myckeditor') ckeditor: any;


    constructor(public fb: FormBuilder,
                private productSandbox: ProductSandbox,
                private categoriessandbox: CategoriesSandbox,
                public brandsandbox: BrandSandbox,
                private popup: NgbModal,
                private route: ActivatedRoute,
                private changeDetectRef: ChangeDetectorRef,
                public configService: ConfigService) {
        this.mycontent = `<p>My html content</p>`;
        this.getCategoryList();
        this.getManufacturerList();
        this.ProductLists();
        this.route.params.subscribe(data => {
            if (data) {
                this.editId = data['id'];
            }
        });


    }

    beforeChange($event: NgbPanelChangeEvent) {
        if ($event.panelId === 'preventchange-2') {
            $event.preventDefault();
        }

        if ($event.panelId === 'preventchange-3' && $event.nextState === false) {
            $event.preventDefault();
        }
    }

    ngOnInit() {
        this.log = '';
        this.onetimeEdit = false;
        this.CategoryValue = false;
        this.submittedValues = false;
        this.defaultImageValue = 1;
        this.addOneTime = false;
        this.addOneTimeData = false;
        // calling ProductDetail
        this.initProductForm();
        if (this.editId) {
            this.productSandbox.getProductDetail({Id: this.editId});
            this.regDetailEvent();
        }
        this.imageUrls = this.configService.get('resize').imageUrl;
        this.changeDetectRef.detectChanges();

        // ck editor
        this.ckeConfig = {
            allowedContent: false,
            extraPlugins: 'divarea',
            // forcePasteAsPlainText: true,
            height: '100%'
        };

    }

    // reactive form
    initProductForm() {
        this.productName = new FormControl('', [Validators.required]);
        this.metaTagTitle = new FormControl('');
        this.productDescription = new FormControl('');
        this.upc = new FormControl('');
        this.sku = new FormControl('', [Validators.required]);
        this.model = new FormControl('', [Validators.required]);
        this.location = new FormControl('');
        this.price = new FormControl('', [Validators.required]);
        this.minimumQuantity = new FormControl('');
        this.quantity = new FormControl('', [Validators.required]);
        this.subtractStock = new FormControl('');
        this.outOfStockStatus = new FormControl('', [Validators.required]);
        this.requiredShipping = new FormControl('');
        this.dateAvailable = new FormControl('');
        this.status = new FormControl('', [Validators.required]);
        this.sortOrder = new FormControl('');
        this.condition = new FormControl('', [Validators.required]);

        this.user = this.fb.group({
            productName: this.productName,
            metaTagTitle: this.metaTagTitle,
            productDescription: this.productDescription,
            upc: this.upc,
            sku: this.sku,
            model: this.model,
            location: this.location,
            price: this.price,
            minimumQuantity: this.minimumQuantity,
            quantity: this.quantity,
            subtractStock: this.subtractStock,
            outOfStockStatus: this.outOfStockStatus,
            requiredShipping: this.requiredShipping,
            dateAvailable: this.dateAvailable,
            status: this.status,
            sortOrder: this.sortOrder,
            condition: this.condition,

        });
    }


    /**
     * unsubscribe the subscriptions
     *
     * Handles  'regDetailEvent' event. Calls productSandbox productDetails$ to
     * subscribe the response data.,then calls editProductForm function with the response data.
     *
     */
    regDetailEvent() {
        this.CategoryValue = true;
        this.subscriptions.forEach((sub) => {
            sub.unsubscribe();
        });
        this.subscriptions.push(this.productSandbox.productDetails$.subscribe(data => {
            if (data && data[0]) {
                this.selectedProducts = [];
                this.editProductForm(data[0]);
            }
        }));


    }

    // Handles form 'getManufacturerList' event. Calls sandbox manufacturerList function with empty value.

    getManufacturerList() {
        const params: any = {};
        params.limit = '';
        params.offset = '';
        params.keyword = '';
        params.count = '';
        this.brandsandbox.manufacturerList(params);

    }

    // calling category list api with pagination
    getCategoryList() {
        const param: any = {};
        param.limit = '';
        param.offset = '';
        param.keyword = this.catagory;
        param.sortOrder = '';
        this.categoriessandbox.categorylist(param);
    }

    // calling product list api with default value

    ProductLists() {
        const params: any = {};
        params.offset = '';
        params.limit = '';
        params.keyword = this.searchKeyword;
        params.sku = '';
        params.status = '';
        params.price = '';
        this.productSandbox.getProductList(params);
    }

    /**
     * Handles  'searchCategory' event. Calls sandbox getCategoryList function.

     * @param catagory searchCategory input value
     */
    searchCategory(event) {
        this.catagory = event.target.value;
        this.getCategoryList();
    }

    /**
     * Handles  'selectCategory' event. Calls categoriessandbox Productremove  if (this.editId)function.
     * else Calls categoriessandbox Productremove.And push  the datas to categories list using push() method.
     * @param categoryId searchCategory input value
     * @param name searchCategory input value
     */
    selectCategory(data, i) {
        if (this.editId) {
            const param: any = {};
            param.categoryId = data.categoryId;
            param.categoryName = data.name;
            this.addOneTime = true;
            this.selectedCategories.push(param);
            this.categoriessandbox.Productremove(i);
        } else {
            this.selectedCategories.push(data);
            this.categoriessandbox.Productremove(i);
            this.show = false;
        }
        this.filteredArray = this.selectedCategories;
    }


    /**
     * Handles  'removeCategory' event. Calls categoriessandbox Productadd  if (this.editId)function.
     * else Calls categoriessandbox Productadd.And splice the datas with particular index as(i)
     * @param categoryId searchCategory input value.
     * @param name searchCategory input value.
     */
    removeCategory(data, i) {
        if (this.editId) {
            const param: any = {};
            param.categoryId = data.categoryId;
            param.name = data.categoryName;
            this.addOneTime = true;
            this.categoriessandbox.Productadd(param);
            this.selectedCategories.splice(i, 1);
        } else {
            this.categoriessandbox.Productadd(data);
            this.selectedCategories.splice(i, 1);
        }
        this.filteredArray = this.selectedCategories;
    }

    /** calls productSandbox productRemoveList,
     * after pushing the product datas into selectedProducts(array)
     * @param data from selectProduct
     * @param i from selectProduct
     * **/
    selectProduct(data, i) {
        if (this.editId) {
            this.addOneTimeData = true;
        }
        this.selectedProducts.push(data);
        if (this.selectedProducts) {
        }
        this.productSandbox.productRemoveList(i);
    }

    /**
     * call productSandbox productAddList,after splice product datas in the list.
     * @params data from removeProduct
     * @param i from productAddList
     * */
    removeProduct(data, i) {
        if (this.editId) {
            this.addOneTimeData = true;
            this.selectedProducts.splice(i, 1);
            this.productSandbox.productAddList(data);
        } else {
            this.productSandbox.productAddList(data);
            this.selectedProducts.splice(i, 1);
        }

    }

    // calls ProductLists ,when  searching the  product list data
    searchProduct(event) {
        this.searchKeyword = event.target.value;
        this.ProductLists();
    }

    // push the selected data into the totalArray(array).

    addProductData() {
        this.totalArray = [];
        if (this.selectedProducts) {

            for (let i = 0; i < this.selectedProducts.length; i++) {
                if (this.selectedProducts[i] && this.selectedProducts[i].productId) {
                    this.totalArray.push(this.selectedProducts[i].productId);
                }
            }
        }
    }


    /**
     * Handles  'addSelecctedCategories' event.
     *
     * storing selectedCategories data in TotalCategories
     */

    addSelecctedCategories() {

        if (this.show === true) {
            this.selectedCategories = this.filteredArray;
        }
        this.TotalCategories = this.selectedCategories;
    }

    /**
     * Handles  'searchSelectedCategory' event. And show the searched result  in the form
     *
     * @param filter searchbox  value
     */
    searchSelectedCategory(filter: String) {
        this.filteredArray = this.selectedCategories.filter(item => {
                if (item.name.toString().toLowerCase().indexOf(filter.toLowerCase()) !== -1) {
                    if (this.filteredArray != null) {
                        this.show = true;
                    }
                    return true;
                }
                return false;
            }
        );
    }

    // editing Product Form with product list values

    editProductForm(productDetail) {
        this.uploadImage = productDetail.productImage;
        this.selectedCategories = productDetail.Category;
        this.changeDetectRef.detectChanges();
        this.selectedProducts = productDetail.relatedProductDetail;
        this.productName.setValue(productDetail.name);
        this.sku.setValue(productDetail.sku);
        this.upc.setValue(productDetail.upc);
        this.price.setValue(productDetail.price);
        this.location.setValue(productDetail.location);
        this.quantity.setValue(productDetail.quantity);
        this.minimumQuantity.setValue(productDetail.minimumQuantity);
        this.subtractStock.setValue(productDetail.subtractStock);
        this.outOfStockStatus.setValue(productDetail.stockStatusId);
        this.status.setValue(productDetail.isActive);
        this.model.setValue(productDetail.manufacturerId);
        this.requiredShipping.setValue(productDetail.shipping);
        if (this.requiredShipping.value === 1) {
            this.user.patchValue({requiredShipping: '1', tc: true});
        } else {
            this.user.patchValue({requiredShipping: '2', tc: true});
        }
        this.dateAvailable.setValue(productDetail.dateAvailable);
        this.sortOrder.setValue(productDetail.sortOrder);
        this.productDescription.setValue(productDetail.description);
        this.metaTagTitle.setValue(productDetail.metaTagTitle);
        this.condition.setValue(productDetail.condition);
    }

    // getting values from media popup
    uploadProductImages() {
        const modalRef = this.popup.open(ImagemanagerpopupComponent, {
            backdrop: 'static', keyboard: false,
            size: 'lg'
        });
        // Make the first image as default  selected.
        modalRef.result.then((result) => {
                if ((result !== '') && (result !== undefined)) {
                    const lengthOfUploadImage: number = this.uploadImage.length;
                    this.uploadImage.push(result);
                    this.length = 0;
                    // make non default value
                    if ((this.uploadImage.length > 1) && (!this.editId)) {
                        for (let i = 1; i < this.uploadImage.length; i++) {
                            this.uploadImage[i].defaultImage = 0;
                        }
                    } else if (!this.editId) {
                        this.uploadImage[0].defaultImage = 1;
                    } else if (this.editId) {
                        // make  default value
                        if (this.uploadImage[0]) {
                            this.uploadImage[0].defaultImage = 1;
                        } else {
                            for (let i = lengthOfUploadImage; i < this.uploadImage.length; i++) {
                                this.uploadImage[i].defaultImage = 0;
                            }
                        }


                    }
                }
                this.changeDetectRef.detectChanges();
                this.closeResult = `Closed with: ${'result'}`;
            },
            (reason) => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            });
    }


    // delete image
    deleteImage(i) {
        this.uploadImage.splice(i, 1);
    }

    /**
     * Handles  'onSubmit' event. Calls productSandbox doProductUpdate function if (this.editId) else
     * calls productSandbox doProductAdd function.
     * @param user entire form value
     */
    onSubmit(user) {
        this.submittedValues = true;
        // if ((this.editId) && (this.addOneTime != true)) {
        this.addSelecctedCategories();
        // }
        // if ((this.editId) && (this.addOneTimeData != true)) {
        this.addProductData();
        // }
        if (!this.user.valid) {
            this.validateAllFormFields(this.user);
            return;
        }
        this.onetimeEdit = true;
        this.param.productName = user.productName;
        this.param.metaTagTitle = user.metaTagTitle;
        this.param.productDescription = user.productDescription;
        this.param.upc = user.upc;
        this.param.sku = user.sku;
        this.param.image = this.uploadImage;
        this.param.categoryId = this.TotalCategories;
        this.param.relatedProductId = this.totalArray;
        this.param.model = user.model;
        this.param.location = user.location;
        this.param.price = user.price;
        this.param.minimumQuantity = user.minimumQuantity;
        this.param.quantity = user.quantity;
        this.param.subtractStock = user.subtractStock;
        this.param.outOfStockStatus = user.outOfStockStatus;
        this.param.requiredShipping = user.requiredShipping;
        this.param.dateAvailable = user.dateAvailable;
        this.param.status = user.status;
        this.param.sortOrder = user.sortOrder;
        this.param.condition = user.condition;
        if (this.editId) {
            this.param.productId = this.editId;
            this.productSandbox.doProductUpdate(this.param);
        } else {
            this.productSandbox.doProductAdd(this.param);
        }

    }

    // validation for the formGroup
    validateAllFormFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            if (control instanceof FormControl) {
                control.markAsTouched({onlySelf: true});
            } else if (control instanceof FormGroup) {
                this.validateAllFormFields(control);
            }
        });
    }

    // unsubscribing the subscribed

    ngOnDestroy() {
        this.subscriptions.forEach((sub) => {
            sub.unsubscribe();
        });
    }

    // ck editor

    onChange($event: any): void {

    }

    checkBox(event, ii) {
        const index: number = ii;
        for (let i = 0; i < this.uploadImage.length; i++) {
            if (index === i && event.target.checked) {
                this.uploadImage[i].defaultImage = 1;
            } else {
                this.uploadImage[i].defaultImage = 0;
            }
        }
    }


}

