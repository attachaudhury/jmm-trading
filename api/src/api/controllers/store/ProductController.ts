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
import {Get, Body, QueryParam, Put, JsonController, Res, Req, Param} from 'routing-controllers';
import {classToPlain} from 'class-transformer';
import {ProductToCategoryService} from '../../services/ProductToCategoryService';
import {ProductService} from '../../services/ProductService';
import {CategoryService} from '../../services/categoryService';
import {ProductRelatedService} from '../../services/ProductRelatedService';
import {UpdateFeatureProduct} from './requests/UpdateFeatureProductRequest';
import {ProductImageService} from '../../services/ProductImageService';
import {ProductViewLog} from '../../models/productViewLog';
import {ProductViewLogService} from '../../services/ProductViewLogService';
import jwt from 'jsonwebtoken';
import {CustomerService} from '../../services/CustomerService';

@JsonController('/product-store')
export class ProductController {
    constructor(private productService: ProductService,
                private productToCategoryService: ProductToCategoryService,
                private categoryService: CategoryService,
                private productRelatedService: ProductRelatedService,
                private productImageService: ProductImageService,
                private customerService: CustomerService,
                private productViewLogService: ProductViewLogService) {
    }

    // Product Details API
    /**
     * @api {get} /api/product-store/productdetail/:id Product Detail API
     * @apiGroup Store
     * @apiHeader {String} Authorization
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "status": "1"
     *      "message": "Successfully get product Detail",
     *      "data":"{}"
     * }
     * @apiSampleRequest /api/product-store/productdetail/:id
     * @apiErrorExample {json} productDetail error
     * HTTP/1.1 500 Internal Server Error
     */
    @Get('/productdetail/:id')
    public async productDetail(@Param('id') id: number, @Req() request: any, @Res() response: any): Promise<any> {
        const select = ['productId', 'sku', 'upc', 'name', 'description', 'location', 'minimumQuantity', 'quantity', 'subtractStock', 'metaTagTitle', 'manufacturerId', 'stockStatusId', 'shipping', 'dateAvailable', 'sortOrder', 'price', 'condition', 'isActive'];

        const relation = ['productImage'];

        const WhereConditions = [
            {
                name: 'productId',
                op: 'where',
                value: id,
            },
        ];
        const productDetail: any = await this.productService.list(0, 0, select, relation, WhereConditions, 0, 0, 0);
        const productDetails: any = classToPlain(productDetail);
        const promises = productDetails.map(async (result: any) => {
            const productToCategory = await this.productToCategoryService.findAll({
                select: ['categoryId', 'productId'],
                where: {productId: result.productId},
            }).then((val) => {
                const category = val.map(async (value: any) => {
                    const categoryNames = await this.categoryService.findOne({categoryId: value.categoryId});
                    const JsonData = JSON.stringify(categoryNames);
                    const ParseData = JSON.parse(JsonData);
                    const temp: any = value;
                    temp.categoryName = ParseData.name;
                    return temp;
                });
                const results = Promise.all(category);
                return results;
            });
            const relatedProductData = await this.productRelatedService.findAll({where: {productId: result.productId}}).then((val) => {
                const relatedProduct = val.map(async (value: any) => {
                    const productId = value.relatedProductId;
                    const product = await this.productService.findOne({
                        select: ['productId', 'name'],
                        where: {productId},
                        relations: ['productImage'],
                    });
                    return classToPlain(product);
                });
                const resultData = Promise.all(relatedProduct);
                return resultData;
            });
            const dd: any = result;
            dd.Category = productToCategory;
            dd.relatedProductDetail = relatedProductData;
            return dd;
        });
        // wait until all promises resolve
        const finalResult = await Promise.all(promises);

        if (request.header('authorization')) {
            let customerId;
            jwt.verify(request.header('authorization').split(' ')[1], '123##$$)(***&', (err, decoded) => {
                if (err) {
                    console.log(err);
                }
                customerId = decoded.id;
            });
            const customerDetail = await this.customerService.findOne({where: {id: customerId}});
            const viewLog: any = new ProductViewLog();
            viewLog.productId = id;
            viewLog.firstName = customerDetail.firstName;
            viewLog.lastName = customerDetail.lastName;
            viewLog.username = customerDetail.username;
            viewLog.email = customerDetail.email;
            viewLog.mobileNumber = customerDetail.mobileNumber;
            viewLog.address = customerDetail.address;
            await this.productViewLogService.create(viewLog);
        }

        const successResponse: any = {
            status: 1,
            message: 'Successfully get productDetail',
            data: finalResult,
        };
        return response.status(200).send(successResponse);
    }

    // update Feature Product API
    /**
     * @api {put} /api/product-store/update-featureproduct/:id Update Feature Product API
     * @apiGroup Store
     * @apiParam (Request body) {number} isFeature product isFeature should be 0 or 1
     * @apiParamExample {json} Input
     * {
     *      "isFeature" : "",
     * }
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully updated feature Product.",
     *      "status": "1"
     * }
     * @apiSampleRequest /api/product-store/update-featureproduct/:id
     * @apiErrorExample {json} isFeature error
     * HTTP/1.1 500 Internal Server Error
     */
    @Put('/update-featureproduct/:id')
    public async updateFeatureProduct(@Param('id')id: number, @Body({validate: true}) updateFeatureProductParam: UpdateFeatureProduct, @Res() response: any): Promise<any> {

        const product = await this.productService.findOne({
            where: {
                productId: id,
            },
        });
        if (!product) {
            const errorResponse: any = {
                status: 0,
                message: 'Invalid productId',
            };
            return response.status(400).send(errorResponse);
        }
        product.isFeatured = updateFeatureProductParam.isFeature;
        const productSave = await this.productService.create(product);
        if (productSave) {
            const successResponse: any = {
                status: 1,
                message: 'Product Successfully Updated.',
                data: productSave,
            };
            return response.status(200).send(successResponse);
        } else {
            const errorResponse: any = {
                status: 0,
                message: 'unable to updated product',
            };
            return response.status(400).send(errorResponse);
        }
    }

    // Featured Product List API
    /**
     * @api {get} /api/product-store/featureproduct-list Feature Product List
     * @apiGroup Store
     * @apiParam (Request body) {Number} limit limit
     * @apiParam (Request body) {Number} offset offset
     * @apiParam (Request body) {Number} keyword keyword search by name
     * @apiParam (Request body) {Number} sku search by sku
     * @apiParam (Request body) {Number} count count in number or boolean
     * @apiSuccessExample {json} Success
     * HTTP/1.1 200 OK
     * {
     *      "message": "Successfully get feature product List..!!",
     *      "status": "1",
     *      "data": {},
     * }
     * @apiSampleRequest /api/product-store/featureproduct-list
     * @apiErrorExample {json} FeatureProduct List error
     * HTTP/1.1 500 Internal Server Error
     */

    @Get('/featureproduct-list')
    public async featureProductList(@QueryParam('limit') limit: number, @QueryParam('offset') offset: number, @QueryParam('keyword') keyword: string, @QueryParam('sku') sku: string, @QueryParam('count') count: number | boolean, @Req() request: any, @Res() response: any): Promise<any> {

        const select = ['productId', 'sku', 'upc', 'name', 'description', 'location', 'minimumQuantity',
            'quantity', 'subtractStock', 'metaTagTitle', 'manufacturerId', 'stockStatusId',
            'shipping', 'dateAvailable', 'sortOrder', 'price', 'isActive'];
        const whereConditions = [
            {
                name: 'deleteFlag',
                op: 'where',
                value: 0,
            },
            {
                name: 'isFeatured',
                op: 'where',
                value: 1,
            },
            {
                name: 'isActive',
                op: 'where',
                value: 1,
            },
        ];

        const search = [
            {
                name: 'name',
                op: 'like',
                value: keyword,
            },
            {
                name: 'sku',
                op: 'like',
                value: sku,
            },
        ];
        const featureProduct = await this.productService.list(limit, offset, select, 0, whereConditions, search, 0, count);
        if (count) {
            const successresponse: any = {
                status: 1,
                message: 'Successfully get feature product List',
                data: featureProduct,
            };
            return response.status(200).send(successresponse);
        }
        const promises = featureProduct.map(async (result: any) => {
            const productImage = await this.productImageService.findOne({
                select: ['productId', 'image', 'containerName', 'defaultImage'],
                where: {
                    productId: result.productId,
                    defaultImage: 1,
                },
            });
            const temp: any = result;
            temp.Images = productImage;
            return temp;
        });
        const finalResult = await Promise.all(promises);
        const successResponse: any = {
            status: 1,
            message: 'Successfully get feature product List',
            data: finalResult,
        };
        return response.status(200).send(successResponse);
    }
}
