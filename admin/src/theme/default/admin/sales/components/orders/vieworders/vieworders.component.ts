/*
 * SpurtCommerce
 * version 2.1
 * http://www.spurtcommerce.com
 *
 * Copyright (c) 2019 PICCOSOFT
 * Author piccosoft <support@spurtcommerce.com>
 * Licensed under the MIT license.
 */
import {Component, OnInit, ViewEncapsulation} from '@angular/core';

import {ModalDismissReasons, NgbModal, NgbPanelChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute} from '@angular/router';
import {OrdersSandbox} from '../../../../../../../core/admin/sales/orders/orders-sandbox';
import {OrderstatusSandbox} from '../../../../../../../core/admin/settings/localizations/orderstatus/orderstatus.sandbox';
import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
import {DatePipe} from '@angular/common';
import {ConfigService} from '../../../../../../../core/admin/service/config.service';

@Component({
    selector: 'app-sales-order-vieworders',
    templateUrl: 'vieworders.component.html',
    encapsulation: ViewEncapsulation.None,
    styles: [
            `
            .dark-modal .modal-content {
                background-color: #009efb;
                color: white;
            }

            .dark-modal .close {
                color: white;
            }

            .light-blue-backdrop {
                background-color: #5cb3fd;
            }

            .image-manager .modal-dialog {
                max-width: 70%;
            }
        `
    ],
    providers: [DatePipe]
})
export class ViewOrdersComponent implements OnInit {
    public orderId: any;
    private closeResult: string;
    private invoiceDetail: any;
    private dynamicBody: any = {};
    private docDefinition: any = {};
    private pdf: any;
    private invoice: any;
    private imageUrl: string;
    public orderStatus: any;
    public orderStatusData: any = [];
    public orderStatusId: number;

    constructor(private modalService: NgbModal,
                private modalService2: NgbModal,
                private route: ActivatedRoute,
                public orderSandbox: OrdersSandbox,
                public orderStatusSandbox: OrderstatusSandbox,
                public datePipe: DatePipe,
                private configService: ConfigService) {
        pdfMake.vfs = pdfFonts.pdfMake.vfs;


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
        this.imageUrl = this.configService.get('resize').imageUrl;
        this.getorderstatuslist();
        this.orderId = this.route.snapshot.paramMap.get('orderId');
        this.subscribe();

        this.orderSandbox.getSettings();
    }

    getorderstatuslist() {
        const params: any = {};
        params.limit = '';
        params.offset = '';
        params.keyword = '';
        this.orderStatusSandbox.getorderstatuslist(params);
    }

    open2(content) {
        this.modalService.open(content, {windowClass: 'image-manager'}).result.then(
            result => {
                this.closeResult = `Closed with: ${result}`;
            },
            reason => {
                this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            }
        );
    }

    open(content) {
        this.modalService2.open(content, {windowClass: 'dark-modal,image-manager'});
    }

    subscribe() {
        this.route.params.subscribe(data => {
            if (data) {
                const param: any = {};
                param.orderId = this.orderId;
                this.orderSandbox.viewOrderdetails(param);
                this.orderSandbox.getvieworderData$.subscribe(value => {
                    if (value && value[0]) {
                        this.orderStatusId = value[0].orderStatusId;
                    }
                });
            }
        });


    }

    onItemChange(data) {
        const params: any = {};
        params.orderId = this.orderId;
        params.orderStatusId = data;
        this.orderSandbox.changeOrderStatus(params);
    }

    /**
     * download invoice for order
     *
     * @param dynamicBody creating dynamic body for the invoic detail
     */
    downloadInvoiceDetail(details, setting) {
        this.invoice = setting;
        this.invoiceDetail = details;
        this.dynamicBody.widths = ['10%', '50%', '20%', '20%'];
        const item1 = this.invoiceDetail.productList.map((item, index) => {
            return [index + 1, item.name, item.quantity, item.total];
        });
        this.dynamicBody.body = [[
            {text: 'S.no', style: 'th'},
            {text: 'Products', style: 'th'},
            {text: 'Qty', style: 'th'},
            {text: 'Total', style: 'th'}
        ]].concat(item1);
        this.generatePdf();
    }

    // generate pdf dynamically
    generatePdf() {
        this.docDefinition = {
            content: [
                {
                    margin: [0, 0, 0, 0],

                    columns: [
                        {
                            margin: [0, 30, 0, 0],
                            width: '80%',
                            stack: [
                                {
                                    width: 180,
                                    height: 60,
                                    image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAkYAAAC+CAYAAADQ' +
                                    'g8AxAAAABHNCSVQICAgIfAhkiAAAIABJREFUeJzt3Xl8VNX5+PHPufdmQyGghE0rWp' +
                                    'ZQN9CKuHSxUq3aKuDSqrVft9ooqVBFY12quLai1pp2gnytSn+t27duqF+1tVhtv9oC' +
                                    'LqDWsipYRRYVkwDJLPc+vz9mMplJZiYzk5nMJHnerxevV+bOXc7czIv75JznnMegusW' +
                                    '+xT6ZFu9e2d285w3yfsB5vFvoNimllFIqO6bQDei1bmGC02oedVtlPwNQChyIZ/zmOdf' +
                                    'ImZxFU4FbqJRSSqkMaWCUKR+72p+YP8hOOQmJv38y2mBGCIQIWjv4eeg8ritUM5VSS' +
                                    'imVOQ2MMuDcwDVeKz8jRGnCHQwwCaLv+vnMtHCWez7P9VQblVJKKZU9DYzS4NzIseI3/' +
                                    '88LyPAub9hQYEz7SxEwLWa5t1NOpYZ1eWymUkoppbpJA6NUbme002w97rZ4B2d0ow4AB' +
                                    'sRvEhcxLdajXoV3Ft8lkMNWKqWUUipHNDBKZC7ltlj3ScD7Hi5WxscPBL5E4rsbpJWdXOG' +
                                    'dR313m6mUUkqp3NLAqAPrRi6ilV8SpLxbJ6o2MFiSv99iPvIC8l3O49VuXUcppZRSOaOBUYR' +
                                    'zA0dK0Dzk+eULObkppcBESNXfJB5YLebvLnIq/8WWXFxWKaWUUtnTwOhmRtp+80fPL0eaFB08' +
                                    'WRltYEQaJ3Vx2WH91jvHuwhDrluhlFJKqTT138BoLpZlrLtplfNwxc7LNQxwEFCS5v5+mkyAme4' +
                                    '5PJCX9iillFIqpX4ZGNk3cJ74uYsgu+b7WjICzOgM9hewW82aUKuczA95J38tU0oppVRH/Sswupm' +
                                    'D7RbzqBeQfXr0gx8IVGR2iHiItcM86zpaXkQppZTqKf0jMPo5Q2y/ecRrkW8aKcBnrgQmZHlskKC' +
                                    '1gztC53NlLpuklFJKqc76dmAkGOcG7vBauRgXp6Bt+RIwqBvH+/nM7OAH7gU8m6smKaWUUipenw2' +
                                    'M7Bv4rgRYQIDBhW4LAGWEp+93446LgL3DLA/tkFOYyXu5appSSimlwvpeYHQz+zt+80e3VSYU3Yf7' +
                                    'IlCVg/O4iNlhPeoGvO9TQzAHZ1RKKaUUfSkw+iUVdqN51GuV4wuSR5QOm/D0/VwtDhCghR1c6f2Qu' +
                                    '3J0RqWUUqpfK84AIkPO9VzttfIzXMoK3ZauyCgwX8jh+QCrxWw0zfLd0EW8krszK6WUUv1Prw6M7Jv5' +
                                    'Ni1moQRkaKHbkpFJkOsQTjywdpr/c1vlu9TwcW7PrpRSSvUPvTMwmssXHc887rbKxN74AWQImPF5OnkI1' +
                                    'zRbC9wPvYuZi5enqyillFJ9Uu+KK+ZSamMekBY5hWLNI0rXvsDAPJ6/1TSZHfJj90f8Po9XUUoppfqUXh' +
                                    'NcWNczGz+/IER5oduSEzmYvt8VEbB2mLVuq3yPGt7I35WUUkqpvqHoAyPnRo6SgHnA88uoom9spvYBhu' +
                                    'X/MuIh1nbzF3cXOZnvsj3/V1RKKaV6p+KNNW5jmNNsnnJbZUrxNrKbcj19vytBAtZ2fhE6n7kYpIeuqpRS' +
                                    'SvUaxRdznIZtfcmaT8A7D6/HQoaCkZFg9urZa5oW8xmt1jnuD92ne/bKSimlVHErqsDIvoHzpJV6QuxS6' +
                                    'Lb0qDxM3++KCJgd1gqvxTuNC1nTs1dXSimlilNxBEY3MNkOmEe8gOxTHA3qWXmdvt+VEGJ2mMfc7XIWs/A' +
                                    'XqBVKKaVUUShsHPJzhth+85jXIt8w/TzjRfYDs2sBG+CnxW7mqmANvypgK5RSSqmCKkxgJBjreut2/DILV' +
                                    '5yCtKHYVAAHUNBQVQSsFvOxaZTTQz/mb4VriVJKKVUYPf4Ytq/n+xKggSCDevraRW8ssHuhGwHigtVsv+oG' +
                                    '3BlcxJZCt0cppZTqKT0XGF3HeMczz7h+Gdcf84jS4hCevm8VuiERQVyz3VrgfujNZi6hQjdHKaWUyrf8xyi3' +
                                    'sYu93TzgtchJptA5Tb2A7Almj0K3ooNWs900ycXuRSwsdFOUUkqpfMproOJcx/VegJ/iUprP6/QphnCvUUmh' +
                                    'GxJPBKzt5j3XL9Op4e1Ct0cppZTKh7wERvb1TJMA9xFkt3ycv6+ToWDGFLoVSbiI2W6ec7fLGcyiqdDNUUoppX' +
                                    'Ipt4HRNYxxLPOk2yr765hZNx0ADCh0I1LwE7S2c2toI9cxF6/QzVFKKaVyITfxy1xKLaw/yE7vVM0jypFdgf0' +
                                    'K3YjUBLB2mG1st85zZ7pP9uClrTFjxuxrWdZXRCTked6S9957751Ik5RSSqmsdTuIsa7ncvzcQIjyXDRIxagGB' +
                                    'he6EV0TD8x2621PvOmcx3v5us4+++wz3HGcBmPMt6BT2ZgdIvJcMBi8eP369Zvy1QallFJ9W/aB0Q183Q6' +
                                    'YRyQgw3PYHhWrFJhI8Uzf70oIzzRaD7jiXUgNO3N56nHjxp0BNAA7gNs8z3vbtu23XNe1gP2NMRONMZcAA' +
                                    '4Hz16xZ83gur6+UUqp/yDwwupmRtt887rXKYTpm1gNGAyMK3YjMmBbTarbL1aEa7sR0f3hr3LhxNxpjrhG' +
                                    'Rx0Xk3LVr1yZM+v7iF79Y6TjOQmA6cMPq1auv6+61lVJK9S/pxzZzcSyx7sHv/Rder+nD6P1swr1GRTZ9v' +
                                    'yuR6f2bzHb5XnfKi4wZM+bLlmUtE5Ffrl279rJ0jhk/fvwdIvITY8xhq1evXpbttZVSSvU/aQVG1nVcSIBf' +
                                    '4lKR7wapzop6+n4XouVFWt1TqCWj3J+99967vKSk5B1jzM7Vq1cfDOmtvr3ffvuVBgKB5UBpMBjcf/369a' +
                                    '3ZtF0ppVT/k7qA6w1MtgLmUWmRvXTYrHDMJ8BIinv6fhLGBhnsHmEF+NDcY/232+Jdwiz86RxbWlo6nfB' +
                                    'g4gHEBEXjx4/vODz3iud5961du/Y+gH/961+B8ePHnwG8VlpaOg14JDefRimlVF+XeEjsdoY615oXzXaWE' +
                                    'tCgqCi8X+gGdFMptuzmXWQPMZ+W+Ozz0zlERA4XkX+sXr16ZaL3Xdf9iuu6XwG2WpZ179ixY7/V9t7q1at' +
                                    'XAP8UkcNy8wGUUkr1B/E9RnOxLM+q5xPvQs8TWwOiIrId2AYMKXRDukcGyC6hCve39kLrGmuHNyNYy/Jk+' +
                                    'xpjDheRd5O9v27dulcA9tlnn+aSkpLpQMcqc+8BGhgppZRKW7THyL6W06wAjbR6tXjYhWyUSmI99IU1po0' +
                                    'BGejt7Vbxhn2veY5fJi0dsy+wJdW5hg8fvktJScnZkZcfxb4nIpuNMfvnoMlKKaX6CYe57Ou45jG3VSZoD1' +
                                    'GRCxAOE3rZ9P2kbIwMluOscjZZd1u3hzZ51zK3PZdIRNYYY8YnOzw210hErl27du2fOuwyQUTW5KHlSiml+i' +
                                    'jLtqw3PL8GRb3GR+GZXn1KOSVelXelvaf9Uod33hSRg5IdFgwGJ3qedz6AiHyUYJeDjTFv5LKpSiml+jbLq' +
                                    'jBlzlAHU6qhUa8QAj4odCPyIARmO5922LrcGLPXmDFjjk90yPvvv/9WZCbaK8aYq4YPHx4tEzJu3LhjjDF7e' +
                                    'J6ngZFSSqm0WW7AwzgGZzcHe4iNZhcVP7MF6GMr89if2liuCcZu8/v9vwc+tixrwdixY8uSHSsifzLGjBk4' +
                                    'cOBXAPbcc88K4H5gUyAQeCivDVdKKdWnWCJCKBgem7HKLEqqSrAG2Yh2IBU1WV/oFuSOabawWjuvHPHBBx9' +
                                    's8zzvDGPMFyzL+nmy40XkQQDLsn4GUF5ePg8YJSLf++CDD7blq91KKaX6HgdAgh7iWBgTjobsARZ2uYW73c' +
                                    'Xd6XWj0qzKF9MI0gxmYKFb0k1BsLclrzCzdu3al8ePH/8L4Kfjx4/fJxQKnbN69WrTYZ91gNl7770Hjxs3' +
                                    '7iljzIkictOaNWuyLkWilFKqf4quY+QGXZzSmGWNLLAH2VgDLNxGFwl2uxaoyjHzPuE1oXtr5CrhITTTRf' +
                                    'fk6tWrrxw/fvwKEZlv2/bbY8eO/aVlWW/v3LnzzbKyMgfY37btScDlIlLued60tWvXPtUjn0EppVSfEo2EJ' +
                                    'CR4todlx//1bhyDs7uD5/dwmzxwNUAqGi0gn4CpKnRDsmM1WVj+9OoRr169+uG99977pZKSkl9blnUTsMuA' +
                                    'AXE1UnaIyPOhUKj2/fff35yP9iqllOr74la+9oKdA6M2VpmFNdTC3enhbncxGh8VBfMBsBu9L2k+ANbn6QV' +
                                    'FbdavX78JOA2wxowZs68x5qtAQESWrFu37l+AfiuVUkp1S1xgJJ7ghjxsJ8kDy4C9i4VVYeE1ubitmn9UcCG' +
                                    'QjWC+UOiGZEDA+cTBZP/t8datW/cO8E4OW6WUUkp1LiLrBV1EUv/hbSywB9s4u9mYkq4fbgPLBjJm9zHZt1K' +
                                    'lZD4mvCp2L2E+tzBBDamVUkoVH6fT40nCQ2rBK3K/vLJ9hT4M80JAPgAzttAN6ZppNdhNmQ2hKaWUUj0l4RP' +
                                    'KC+WnUmlFSUVezqvAfArsKHQruuBFZqHpAKxSSqki1aN/uh84cmJPXq7/KfJFH61tFiakQZFSSqni5SR7w77' +
                                    'ZYJfZSWepdcULeLhNLg0n3k3NYTUAHLbXYSz54J/ZtVR1bXtk+v7QQjekM9NisLf3tqlzSiml+puUUY8X9Lp' +
                                    'MxE564lKLkqElvLVtRXTblL0Oy+pcKn1mA5D79LAufXXoVxm/6/jEb7rhITSllFKq2KUMjMQTPLd7+UZvf/5' +
                                    'W9OdJoyZ161wqDZHp+z3tjgPu5N/HruK1o9/gwMoD496zP7Mxrg6hKaWUKn5djpN5gex7jQDe2voWLaEWAMY' +
                                    'NHUfFAE3Azreenr4/onwEBw8+GIBJlZPY4t/S3pZmC2unzkJTSinVOyTNMYrlBT3s0uyGQlrdVt7+5G0OHXEo' +
                                    'lrE4Yt8jeGndS7hNbkGGfPqFHp6+P23k9GgB4r99+jc2tW4Kv9FFgdg+rY5qXAZhc3in91z+gU0T81hVgJYp' +
                                    'pZRKIb3AKORhORbGym44ZMWWFRw64lAADh05hb99+DesKgt3h5YXyRfzKTAS2CX/15o2anr050f+83D4hzQL' +
                                    'xPYpc5hsWXxPDGcZGJ60TEtku9Sx2cAzHjwDLGYezT3VVKWUUoml/ee8G8y+e2fpx0uiP0+sap+yb+9iUVJV' +
                                    'glVhaZGrfOiB6fsDnYF8o+obAIgIiz5+EsisQGyvV0e1qeMxy2YphjkGhqdzWGS/8y14wsAa5jA5zy1VSinV' +
                                    'hbR6jADEDSdiZzN9f0lsYDQsfi0jY4FdaWMNsHCbXCSoIVLObAf5DMxu+bvECSO+TalVCsDSbUvDw2hZFIjtt' +
                                    'eqoNvByusFQMgaGi01TrpqllFIqO2kHRgBuwMWUm2g+SbrWbFtNS6iFCqeCsYPHMbRiKJ+0fBK3jykxOLs7eK' +
                                    '0ebrMHrgZIuWA2AIPJ21Ke3/vC6dGfF218MhcFYnuPHAVFAAKbNeeoCFzG0ZbF4thNnsuh3MGyQjVJKdWzMnt' +
                                    'cCllN3xeEtz95O3xBY3Hw8IOTN6jcomSog7WrTX9KT8mbAMim/Jx6oDOQ44cfH3395MYn+1WBWAO3dBUUifCy' +
                                    'wOMd/m1OsOsreWqmyoBlOKHQbVBKFVZGPUYQnr5v2VbGvUZLP14STcA+sGoif17/5+Q7G7B3tbAqDF6zh9vq8' +
                                    'dOjfsp39j2RPQbtwYiBIyhzyqK7+0N+NjVvYlvLNv5nxSPc+tIvMv1YfZrZCAwji992arHDaKu2r2L1J6uwm/r' +
                                    'JQo7h3qKTU+xxrwfXchsJV5WSOqoRTjOGHxsYLvBynlqq0lXHQIGz+kdYr5RKJqtHpRvwcMoyewAu+XgJPz7oY' +
                                    'gCmjJyS1jHGNpz/lR9y5ZSrGD1odNL9ypwyRg8Zzegho/l056caGHXkgvwHzD65PW3sbLQnP3qyvxWI/VayN0R' +
                                    '4WW7jhymPDg+b3SR13CVwLh7v5LqBKmNTczEsqpTq3bIKjMT1EC+z6fsrtrSXBjk0zcDossmX87PDr6XM7tw7FK' +
                                    'tjD5LqzGwBRgA5Wl+zxJTEDaM9vXJRvyoQa+Dryd4Tw/1pnyg8Rb8+F21S3WOEn/SfuF4plUzWgyuhgEtJefqH' +
                                    'xyZgDx8wnOEDhrN5Z6JUi7BjRh/D5ZProkHRlp1b+P27/4+r/3YV7nYXd4cX93/YFZGhth2BHdl+pD7hiqN+ymG' +
                                    'jD+ewvQ5j4WsLufK5K6LvyQYwE3JznaOHTWVQySAAPm75mNfeey03J+4LXN4tdBNUhuqYnirYVUr1H9lnnXiZTd' +
                                    '8XhGWblvG1Pb8GhKftp8ozqpl4IZVllQA0+hs5//lzeWHDC+H8o4Ft0/s9xB9OBr/1pV/oEBpQc9iFjB6SeNjRN' +
                                    'II0gqns/nVih9GeWft090/Yl4RXu879LKY6ZllwV6K34mZOtS00CYcY0/6wF+EdY1iS7YKSpo7HkuVVeTCbeSl6' +
                                    'vuYw2bJZmuxtb14XfTWpPnvHY+uYbsF3BL7TNjQm8LjM45QO+w3EY7KxqE2VL2bZLKUuSbt1xppSfU630nEznb6/9' +
                                    'OMl0cDo0JFTUgZGB1S1FyJ97v1nw0FRDGMbnCE2XsDgNmp5kXSZDcAB0N0hg5NGnBT9+em1T3XvZH2MES6QOu7v8Z' +
                                    'Wswwnht7Q95Dv+io1hf2B/C84X2CyXcSa382KPtjEf6hjIPJqZw2RjcZ+B/aHrr7gFTflaxiJTCxYsmBAKhU4HTgD2' +
                                    'MMaMin1fRJYBHxpjFs2cOfN3WZ77K8CXOpx7lYi8a4z528yZM3+Vabt9Pt+Jxpi4/wBmzpwZd+sbGhrOFpGjgP2MMXG' +
                                    'LmEY+178cx7m1pqZmZaK2u657nIh8Ddizw/HNIrLUGPNMpm1vaGiIWw9GRE6qra2N/oU3f/78Iz3POw04whgzARgYs' +
                                    '/sqEXkXuD/2mDb19fVVjuOcEPOZ446PfOZnXdf1zZo1a2sm7e4o8ru9MEE7m0VkJfCs4zgPJ7q3yfh8vl8ZY2bHtre2' +
                                    'tvbQtteR3+c0YErsd0lE7qqtrf1JBu3O5/e9W/eke/OUBNyQh1OSXiL2iq0xeUYj0sszAvho+0dJ37NKrXB5kZ0ebrOW' +
                                    'F+lSC8hWMMOyP8WU3Q5jZMVIAJr8Tfz1g7/mqHG9hwhvGpO4l8EY9kd4Wuo4saeCI8vie8CcdPc3MNxYLOZy7vBu47I8N' +
                                    'i3/XCZQxx4WPFHopmQq8p/4La7rzkj1B2YkIJgMzPD5fLWxD6pk6uvrq2zbXtDFuauNMdXAjIaGhhuAa7MJkDqKfK4rjD' +
                                    'GnAAOTXb/tc7mue47P51tYW1t7LkBDQ8NPgAtd162O7Jfo8IHGmKnAVJ/Pd6brut/uTqARuV+1wAUiMiqde+bz+Za1Xdfn8' +
                                    '50IzI60KWmHQdtntm37gvnz53/3oosuynipjsj9/Y3rulNT3Ju2e3udz+dLO2hJ0N5BEA2IbgFS3Zt02p2X73su70m3/16S' +
                                    'oIdIetHI0hQrYKdSPaS6y33sARalVSVYA7S8SFfMf+hWD1vsMNqf1j9P0At2v1G9jfBqqreN4etGeLXHynyY9IOiTsddzjU5' +
                                    'bk3PsvhWbwyKGhoafuK67lJjzIwMD/1XVzvMnz//SMdx1mV47oHAnT6f7/EM2xPH5/M97rruv40x5xDf05KSMeYcn893v8/n' +
                                    '+wi4E+j6P/72Yyfbtv1QFs1tMztyv67r2HuRznV9Pt9SY8xTbUFRmseO8jzvf+rr66syaajP5zsx8r3J5FqzGxoaVmZ6rYhq' +
                                    'n893P7Awk3vTUT6/77m+JzlZ2Sbd6fsbmjaweefmaPJ1qgTsjds3Rqfof3XPr3HM6GM6Dad1YoE9KJJ/1Ni5vIh7a/j1hm0' +
                                    'b+OIv9gbgvMnnc+7k8xi7+1iG7RruRmlsbWRT8yYW/WtRXPJyIn++4C9MHRv+XSxeu5hj7/lmTvZP1Nbfn/4A3/7St6ks' +
                                    'r8Qf8nP9C3O59aVf8N5P1yfMK6o7qo66o9qTI6LnCoF8BGavlE1NanpMYPTUun46jHY7L8rlvBMZnkrIGPY3Nku5nDs8wy' +
                                    '+Zl3hNo0KzDDd6c/hTb82VsQw3FroNmYr0iNyZ5O1VIvIPoDHy+ghihhuMMSuSHAeEgyIReY7OQUmziCyF6NIQ+xtjDu2' +
                                    '4nzFmhs/ne7y2tjbVOl1JJXrwRYZG2v6YSHjdyLHnJDh2I7AE+CCy6YiOQ3KRY6f6fL4TEw1vpdHmRA/U2N/DXnQYOuri2' +
                                    'HTv9Sjbtq8G0urNifxuE/2n2/F6ie5RtW3bC0i9/lpCiX4vmeiB73tO70lOAiNxPTzXpJWIvWLLCo7d+1ggnGf0dJIH6' +
                                    '+/+tZDDRx0OQGVZJfced397AnYXjBMpL+L3cJuSlxf5/ekPcMoBp3Sa6l9ZXklleSV1R9Vx7Phj+fJdB3V5zXx7ffabTBo' +
                                    '1Kfq6zCljcMWQrM9nNgFVZDx9v3rXCVTvGv5DLuAGeP7957JuQ28nHueZFAnFUeHCsmdJHbdAfnOPRHhHDLfHzYyz2dcI' +
                                    'l6UM4izuk3D2Wb/huUS751MmhsM5SWca2qSdu9EmMuTS6SEhIosdx/lxstyHSN7LnZZlJQ1g6+vrqxIFRSLyhOu6NR2Hm' +
                                    'tqG2zoGM8aYGQ0NDWdnmt/R4ZobjTG3hUKhB9K9bsc2O45zVbLco1AotDhBoHIu0J3ZIM0icp/jOHcnuq7P55trjLkuR' +
                                    'ZuXATcmyz2ybfuhBIHUaaQRGMX8bjte8y7XdW/ueI8j+VlPEtPzFgl6swoeI9faCNxjWdYLbUOAkZyq7xMuPtVJD33fO5' +
                                    '67W/ckZ2she8H0Zqi9tbU9MJqSIjBa+M79fLf6exy919EADBswjEenPc4L6//MqU+dkvCYjqwyC2toJP9oe/zY0e9Pf4Az' +
                                    'DzoTgFVbV/Fh44fR9w4YcUC092jSqEm8PvvNggZHDTPujguKOnpl/Sus/XQtAIfseQiV5eFpZ8s3LufTnZ9G99vcHNM7J9' +
                                    'lN358+or236KX/vERzoGfzi4vKHSzz6pidbLZULAPDDdwlcJXUcSHzeDKXTRHYLHAFt5HoQbZM6ngc4enYWWpx7TPsL5dx' +
                                    'dJ9Ixk5XbA9ZkllnQHj5hRz1pkW67e/uuD2dxNXIgyhlrkXkr99OQVGy3p/Ig+Nkn8/3eIIg5df19fXPZpO309XnmTVr1t' +
                                    'b6+voax3G+maC9yxzH+a9UybE1NTUrGxoargIWxm43xuybaVtjrrvYdd0zUn3e2trauT6f74QESeQbgQtTBRyRz3yG4zhbO' +
                                    'rR5VH19fVVX9znR7xa4pLa2NmFOWE1Nzcr6+vqvOo6zrsNxPyOL4FFEFrquW9exnZHXCdtQiO87ObgnOZuTIZ7ghrquo7Yk' +
                                    'Js/owKrUeUYnPHYcL37Q/v90mV3Gd8acyOaZW1l4fJp/yBiwd7EoqSqJbhpcMZhTDjiFLdu3cNVzV7Lv7RM49p5vRv+NvH' +
                                    'E4T73bHrBNGjWJhhmdfrc9Zsb+M/CH/Dz45oMcf+9x2FcYFvxzAZ+3bAPgBw9/P9r2z1s+jx7359V/jvtcP3j4+3HnbZu+n' +
                                    'zaB6cPbA6On1y3q1ufqE+ZR78HsrncMMzDcgidMHY9RR9bj9Qm' +
                                    '8wryEQVHYPJrFcGaqE/SJOmHCHZ7HVA8GefMw3jyMBxNEeL' +
                                    'PQTQOwbbs2wQycxdkmxsZasGDBhI7BjYhsTGdIzHXdmsjDPdbASE9ARiKzmLr8P' +
                                    'LNmzdoaGero6NV0ZlEl6c1KOy+po9ra2m+' +
                                    'mGQQ+m2DbR+n0wkQ+c6cg27btw1Idl+R3u6yrRPnI9R6L3WaMmbxgwYKM/' +
                                    'iQWkYW1tbXnZhokF+D7npN7ktPJql7Q7TIROzY' +
                                    'B+6BhB3VZQuKEx47jjtdup9Hf/gSvLKvk9AlnZBQgmZhP2tajcvYj/5V07aMZv5vG4rXtRbZn7J9pvlh' +
                                    'ujBg4gmG7DuP6F+by' +
                                    'g4e/z59X/wmAmU9cmJN1m8wGSDdbfVRwFJOHhQN4EeHpdbp+EdAWH' +
                                    'M1IUhw2IQMnG3iDOs7OZ9PihHOc7k32thjO6rG25JgI7' +
                                    '3gwwbuNy7idF+OGK+exitu4qYDNi3VBxw2O4/w4FycOh' +
                                    'UKJEiLvSefYWbNmbTXG3JbgrQu716oudasUTqIgI9OHfhZe7+bxnSZ' +
                                    'uGGPGpDogMrW94zG+NK/XKZnedd30p4WHZfIndKx8ft/zdk' +
                                    '9yu4pHZPp+Kpt3bo4mXFcNqGLckPFdnvbqv1/F8IYqHl75UMIAad' +
                                    'X5azhn/3Mzaurjqx7nz+tSFLIFjr3nm/hDfgCG7T' +
                                    'qM8yafn9E1cqHMKePVDa/mb/HKFpAtXe9GAKZVTY9OQV22eRmbdmzq4qB+Z' +
                                    'B5PCnxdJP1isJHeo4XW5dyez6bF8uCtVO3JcS9Wj4jkV' +
                                    'R0RqT9XtObPn39kgr+en8hkjZkuHNtxg+M4D6d7cCgUeiDB5uosZzIV' +
                                    'TCgUGlfoNmRKRPZO9b4xplMQkG7+V6KeLBHJe25Ivr/v+bwnOV/eTIIe4qXugoitm5bJtP1znjub4Q' +
                                    '1VPLPuafyuP7p99KDR3HV0PZdNvjztcz246g+UDHWwdrWRFJ1W/97y7+jP44Z2HcTlwzPv5rdnxnxI6u' +
                                    'n7HjifOJw0Zlp001NrdRitk3mskts4KtPeIwxzeiw4cvlHF+/v0SPtyCXD6' +
                                    'h5fTDMLnucd03GbMeZvuTh3fX19VYJE5OZMHkKRYZJOwWVXwzyqR8QNESbqK' +
                                    'Ss2+fy+R+TtnuQs+TqWG3RxypKfeummJdEE7IlVE' +
                                    '/njqv/J6PynPnUKx4w+hksOmRNNzi6zy/jZ4dfyScsnLHwndQ3PLTu3tJcX2dXCqjBx5U' +
                                    'VixSYvf3nPL2fUzlzJe6mTLqbvW9ssBplBHPWFo6Lb' +
                                    'ntLVrpObx5NSx2KBcw1clVbFdsMc6ng7ZZ6Q6u0O7LjBGJOT/8wTBS+RVX4zElkFu2Oezpfp3kwv1Q' +
                                    '2RWV0d7eHz+bq9EGee5e37nu97' +
                                    'kpfASNzUddRi8' +
                                    '4wOHZnpUGfYCxte4IUNL3DZ5Mv52eHXUmaXUWaXceWU' +
                                    'q7oMjFozX++HAAAgAElEQVRCLXGv48qLNLkQyqpJebFlez' +
                                    'rjXN1nNhF+fJd12N5isLfbHFd9PKV2KQCrt61i9b' +
                                    'aiHrUovHAPRr3U' +
                                    'cb/AuWnOXLtV6ni8N/R+qKzs2XFDNqse59kHCbYlnIatCifS' +
                                    'O5j2pI8C6dHvey7vSd4qBXnB5LlGsUNpk0dM7jIBO5Xbl93Gb9' +
                                    '78dfT16EGjMxpSi2WVWpQMLcGqtPN4ZzLTEmzpeqdcEJD/dNjmgv1peOHOk8a010bT3qIMzKM' +
                                    '5kpy9hyRI' +
                                    '+IsV6VnKalE9pZRSuZG3x3+q6fubd25mQ9MGACqcirQSsFO5+u9XsWVne8/K/kOTrmOXFr' +
                                    'siPL3fGmBRUdK+AuLrH3Z3MkJxM58C29tfW9tsjGsosUr41t7HRbf/T4ZDnwqYx0aZxykId6TazcBJqd5XSqnu' +
                                    'MsasL3Qbik3sPcnLUFobL+hi2SZhMb2lHy+JlvyYOGxit4dmYofHhg1I' +
                                    'ndIxYpcRXZ/QhMuLjK0aG9205pPVWbev19gA7Admh8HeEY6bj9vneAaVDQLCw2hvbU25QrtKwbuNy0wd' +
                                    '+5jkPUNH5rUBNqkXwLNJXrFZKVUUMql' +
                                    'k31/k8p7kd8BIkg+prYh5uE7JMs8oVoXT3rPz5pY3Uu5b' +
                                    'ZpelNdx281dvYdiASP00fyP3vdF5CZjYXqSxu4/t9H5HB4zIb9WF1lBr906wHdgE9iftte++W' +
                                    '/3d6M86jNZ9QvIp/WklaneDJcnLfghsLtZ6bn3V/PnzcxIIW5b1WcdtxmS6rr3qRbKsdFlYufq' +
                                    '+J5Gze5L3TBovlHj6fmyvQ6IE7LfOeZtj' +
                                    'Rnea7ZdQbAAD8NIHf+3ymAsO/FGX+5w6/rToz69vfj08vDYwfnp/bC/S6CGjU6511DDj7mipkXyJL' +
                                    'W2yZ2Wn3Lf0bAB3W3j+fsdhNJ2mnwNe9xa16w6BbyV7z8AzPdmWfqjTwn4i0qkYajaSJLUOzGK' +
                                    'xwyM6bjDGFMWq4f1VkhW1s/zPvUfl7fue73vSIynGbrDzIjlvbH4DT8K9SQcMPaBTAvb4IdU8O' +
                                    'u1xlpy1NGXvzsLjf8ePD7o4+vofG/+RVqHZ0YNGs+SspQmDr2NGH8OSs5ZGh/oa/Y3c' +
                                    '+Vo4NaStvIhVYSHAfcvujZs5dvNxt3Ds+M7Pnp8ffyvnHNKtAsUZ687yAuIXPL/HN/b6Rn' +
                                    'QY7ePtH7N0U9c1U/uNus7VwdNiJS/mKpL' +
                                    'HoKmO6akKyXoaGOVVogBDRL6Ww0t0ykdwXfe4RDsmk6iXybbtJYn2VT0q7ndrjJlc7Atv9' +
                                    'vT3PZf3JK85Rm0STd//pOUT1n6+hvFDqqlwKjig6sBOuStldhkTqyYxsWoSN33l5mjCdpsRu' +
                                    '4ygzG6fX75l5xZu+WfXK/+3nWdi1SQenfY4Kz/7N5+2hHuid6/YjQm7fSl6Xr/r57Zl8' +
                                    '+KCLWOBXWljDbBwm1wWvraQuqPCVSiH7T' +
                                    'qMJ89exOsfvR6dUbZn5Z5UV1XjD/lZvnF5yoKw3bV4zV+YOjZcvLm6qpr3fro+WmC2o' +
                                    'qSCrzak35PpNrmcGDMb7Zn39LkZR' +
                                    '5ht6jhIPHxpF1+tY6ARLkg2EdMYlqRZoSUz4evemOy6kWG0lIVtBV5OlhtlhJMF' +
                                    '6rvf0CJkczh0v4hsKBR61nHi/8s1xsxYsGDBhFysBiwi/+i4BpGInEmSAp8dRdaG6Rj' +
                                    'sr8rhytwqS4l+t5E6dkW7llEhvu+5uic9NindDXSuoxY7bX/KyPgiuh2DIAj38sT+iw2' +
                                    'K/rHxH5z//Llp9RYB/PgvM9myc0s0+Dp6r6M5eq+jmVg1KXreRn8jN/7jBm5flqiEEJgSg7O7wzX' +
                                    '/vIoHVzwY3V7mlHHE6COYOnYqU8dOjQZF1' +
                                    '78wN27ByHy49aVfsHzj8ujr0UNGR9uxx6AMFzV24Tv7tK+jpUVj4xnDQQZOtiwWmzo' +
                                    '2WZdzO3WczRwmd+pNqmMUdUw3wqt56bURdk/6XjgoejrVdQVuSeMqSeslGcPXqUtRwNNKPoR' +
                                    'XDFItpWAlWKguKoNew0jxyi' +
                                    'c6bg+FQr9J9xypOI5za8dtxpjJSRbDS+RnCbYVrnq2irIs67cdt4nI5cXca5Tv73s' +
                                    '+70nPrdYj4LnxidixCdgHVsX3olTfO44LX' +
                                    '6jhmXVPs3rbqrjp+BAOWjY0beCZdU9z4Qs1fOORr6cdFEF4gci9FuzJwysfigvC/K6fDU' +
                                    '0beHjlQ5z1v2cmDYpiWWUW5y0+h9tevY3lG5fT2Nr+/GhsbeTVDa8y/XfT8r+CdcSX7zqIB99' +
                                    '8MG6Ir7G1' +
                                    'MdpzlK4pex3GyIEjAWjyN/HXNHK3+' +
                                    'pPY3hMDwzHMsWChZbPUgiarDon+g48seKKL4GQzsDjZ+ynbYvi6qeMx6p' +
                                    'jOHCZH/9VxdiQY+3rS6wovMy+' +
                                    'N3h6Xd1O2AV6OBoZt/y7nGlPHJstwYxYf' +
                                    'q1icTx2zOtzXWeZy3gYyKtLoOM5VHbcZY6b6fL653W1kTU3NyiRlEe7u6mHR0NDwE2NMXP6HiGzsqlK56hk' +
                                    'XXXTRKx1/t8aYUbZtLyhUm9KRz+97Pu9JjwyltfEC4eG0tun7sStgJ6qZtvCd+7tcxbq7znkuR8XNDfxsydVc8' +
                                    '+pVeM0ebquXcNTi2Hu+mdbp7CuyX/QS' +
                                    '4AcP' +
                                    'f79bxwNM22969Oc/rX+eoBfs9jn7jDwUWxW4ojurXhs42cDJ2J3fSHHNzWKoSesCd7BM6tic' +
                                    'bOacgeEGFna6fi+QapgQwIK7Et1XAwemLpsdr6amZqXP51tojIlLODTGXOfz' +
                                    '+b7iOM6Pkw0zNDQ0nC0i04C3amtrEz5YHMf5L9d1lxIzJGaMGeU4zt/nz59/f' +
                                    'qIk7UgZhUQrBl+YwUdTeWZZ1iUi8n+x24wxMxoaGlaKyOVJEpIBWLBgwQTXdY' +
                                    '8TkTNra2sPTbZfruX7+56ve9KjgRGEp+/bpeH/YZZ+vBRPPCxjccDQAyi3y2l1u' +
                                    'zndvMCMbbAH25iAwWv2kGBeMkZ6xPSYwGj' +
                                    'Rah1Gi+OyR04DAOEObuvZOmkCmwW+nklVeoFbTBrlTXqhP2VzkMB3Mj2mtrb2XJ' +
                                    '/Pt1/HHhpjzFTXdf/t8/mW0T6jpxLYL5IUPdAYg4hMARI+KGpqalY2NDRcC9zZ' +
                                    '4a1qEfm/hoaGVSLyfGTb/saYQ+mcVwRwSaqHiup5F1100SsNDQ2XkOB3a4x5' +
                                    'yufzbQT+DdEJHNHvjuu6AwGMMcyfP//InixFk8/ve77uSY8Xvoidvt/qtr' +
                                    'L28zVAeB2iA6uSD+X3NlaphbObU1TlRTJRXTWB6qpwykggFOCZFZp4HSeckJs' +
                                    'THsz2buOyXJ0vHSK8nGlQBM' +
                                    'A86kWSr8OU8prhocLiFL4PnRcq' +
                                    '64KB4dnMTnRd99siknDY1Bgz2RgzO/LvnMgDJa4HKNV6MJHhr0uSvF0dc+6pJAmKd' +
                                    'AitOKX63RpjRhljpqb67gB4nv' +
                                    'fDnmhrrEJ937O9JwV5ZIcC7dP3l3QxnNarmZjyIruEp/f3FrG9RX997680Nzfh+TM' +
                                    'ZNOjjwvXPZpDFw7SNwOOey6Fp5f' +
                                    'fkiMBmD2bLbRyVcVDUdg7DiV3VfevgXs/l0DQTvAvGg0syDPru9WCPbIY/Z82atb' +
                                    'W2tvabInI9pH+8iGwEzunqL/6ZM2f+SkROIsEU/hTnXmaM+YoGRcWt7XebJ' +
                                    'J8slWYRuct13bq8NCyFnvq+5+qe9PhQGgBe+/T9pR8v4Qf7/hcQXujxnrfu' +
                                    'KUiT8sqAPbBter+H9IIAIza/aNG/wrO43SYXMzRxiZd+aR5PevAk8EPmMBm' +
                                    'bwy1hLzHsgzC+Y6K1CC8bw1oP/g68kMtVpiM9QH9pmykX9x48boT3PeHZtJ' +
                                    'cVSGUezQKnyBwmWxbfEzgkNrlbhHeMYUmnz' +
                                    '3kZA8VKnqNUcOHPdZTUMd2C74gwJfZ3mI/fX21t7dz6+nqf4zjfF5HvAF+KVA' +
                                    'mPXFM2Ah8Br1qW9ceZM2emPQQSGQp' +
                                    '7OjIr7WTCQwixwxnNIrIym3OrwkrjdwuwSkQ+JDyMtLgYhkYL/H2HNO+JsW4qUEeG' +
                                    'AafcYcrIKfztjHDu1Optqz' +
                                    'hwYf5KZrReEgDCSwFU3zsub9fpihfwcBtd6LzuZVEYMXAEH169kcj4LnvePIpN' +
                                    'zZsAMAMtnF3yk10rIo8F5oROzcvJ+4I6ZllJ8nsEHpd5nNLTTVJKqb6mcN' +
                                    'kvAm7I462tb0VXwB47eBzldnnBmtRTrNLI8Nqg+PIixWLaftPbZw7+Z2k0KA' +
                                    'KQ7YlLv' +
                                    'CillFJ9QUHTgiXo0' +
                                    'RJq4Z1P3g43xlh9KgG7K/YAi9KqEqwBxZV/lGgYLUrAbS7+oUCllFI' +
                                    'qG4XJMYrhBjyWfLyUA6vCideHjpySt3pc5XeW5uW' +
                                    '83WKBPai9vIgEChsiDSwbyDe++I3o6yc' +
                                    '7BkaAtHjILhbGKcLuLqWUUqobCj6RXFyPFVvaS1hMGTmlgK0pHOM' +
                                    'YnN0c7CE2hVwg74QJ36bUCQeQq7auYtXWx' +
                                    'CVtQk1FmiCllFJKdUPBAyOANz56I/pzn5uynyGrzKJkaAnWwMLkH8UOoyXq' +
                                    'LYoKCG6rDqkppZTqWwo+lAawYtNyWoItVJRURBOwU62Aver8NYweNLr9+K3' +
                                    'LmfKH9hW9l5y1lIkxtdca/Y0Mb4gvFbR55lbWN73Ppy2fcfReR0e3tw23tc' +
                                    '1gS3T+hcf/jtMnnMGFL9Rw9zHtZVle/OBFTnjsOJ495fm4c174Qk2n0iY3f/UW5hzSvqZf3Ew5A78' +
                                    '/9fecPuEMfrToAv57WngJgwfffDBa6uPnx9' +
                                    '9K3VHxy1Fc8OgPuW/ZvQnf37BtA1/8xd6kUmKXcHz18dHXnfKLOvCaXKwynb' +
                                    '6vlFKq7yiKHqPWUCtvbX0LCCdgHzoyeSmXtoCl/M7S6L9Ym2duZe9B+8S9/7n/c1ovCXDO' +
                                    '/vH1HtuCp7b9Gv2NbJ65ldZLAlz4Qg3ld5Zyx2u3M7FqEguP71yt4e' +
                                    '5jFkSPfXjlQxy919FsnrmV3St2i27f0LSBW782L+' +
                                    '64hcf/jjmHXMYdr90e3W9w2WBWnb+m0zVuO+52ap7/Ec41VjQo+vMFf6H' +
                                    'uqDrmvTQP+wqDfYVh8dr2RUV/f/oDnd4fXDGY9366Pul9BTh6zFQGlQ8C4OOmj1n' +
                                    'ywT9T7o8H7g7tNVJKKdV3FEV' +
                                    'gBLB8U3ue0aFJ8oxWnb+GRn9jpzWI2npznj3leSrLKjv1DlXfO45GfyMXTboob' +
                                    'nujv5ETHjsu+vq595+lsqySFz94MdrDc/Xfr2JD0wa+tPuXOrXn4' +
                                    'ZUPRX8+57mzafQ3UllWGde79OjqP1JZVhkXlJ0+4Qxe/OBFrv57e+Hh3759D6MH' +
                                    'jebmr8YvDvzc+8/yu38vDOcfDbb5+bdvZerYqTz45oNc+dwV0f2Oveeb0d6iMw86k8' +
                                    'VrF8e9v+CfCxg9ZDQ/P/7WTp+jTeww2lPvPpV0v1iyQ6fvK6WU6juKJjBa8lF778TE' +
                                    'qsR5RqMHjea5959Neo4xg8ewYuvyhO+tb3qfvQft02lbrI+2fwTAm1veoKPBZUM6b' +
                                    'XvpPy/Fvf7c/zkbmjYkvP64IeFgri3w+' +
                                    'Z9Vj8S93xYk7bHrHomvYcAqtzhk70No9Ddy1iPfT3idtsDn4eUPxW1vC5L2rNwz4XEldgkn' +
                                    '7XtS9HVXw2hROn1fKaVUH1IUOUYA/4wJjBL1GHUcBktkcNlgPvdvS/jepy2fdQqMCqEt8Ln7mAVx' +
                                    '+Ulthg1IXS1h94rdACgZ6iQsL9IW+Nxz6m' +
                                    '+559Tfdjp++MDE5z96zFRGDhoJQFNrEy+uS1jvLyFp8fAqDFZp0cTZSiml' +
                                    'VFaKJjBa/emqaAL26EGjGT5gOJt3ZlaM+3P/50nfawsoCq2tVypRQnYmj' +
                                    'G1whth4AYPb5EIovP3Dxg+B+ETsdMQOoz3xrycIusGM2uM1e1i7a2CklFKqdyuaJ5kgvL' +
                                    'XlrejrjtP2F75zPxuaNnD4q' +
                                    'COSnmPd5+viZqPF2nvQPry++fXcNLYb1mwLJ1gf9YWjsjr+Lxv+QmVZZXRIziqNTO+vt' +
                                    'MGCNZ+sBuAbY45OdZpOYofRHln+cMbtkqBO38+7edR78zCJ/mmdNKWUyo2iCYwgfjjtgN0' +
                                    '7lwZ5dPUfGT1oNEvOil8Zu+11WyL15plb495fdf4aKssq4xKtC2XhO/fz' +
                                    '4gcvcvqEMzolWndsdyJtyeBzDrksbnjxT2f9mQu+8SMWvns/i9cu5syDz' +
                                    'uyUaP3Z9Yl71KbsdVjWw2ixvCYXEU3EVkop' +
                                    'lTvz588/cv78+Ufm4lwLFiyY0NW5imYoDdoSsGcDcOiIKYhI3Bo5V//9' +
                                    'Kq7++1W0XhKIW2codnZY+Z2lrDp/Tdz7G5o2FFU5kLa1juYcclncWkZ3' +
                                    'vHZ7WsdX3zuOZ095Pi5PqW2GnT3Q5oQnjuPZk5+n7qi6uLWM5r00L+H5' +
                                    'YofRnlv1XMbDaFEeeDs87F0LuHS3UkqpXm/BggUTQqHQLcaYGW1/cD' +
                                    'c0NCAiC2tra7tOOu7A5/P9CjjNdd1RMed6wnXdmlmzZsX1ShjrpuK' +
                                    'pX1q9+wTevfDfAGzesZk9faOwS/Qhmy3P74Xzj7qo3vHuZSuprqo' +
                                    'G4MwHz+CRFZkPpcVyqhyMnfmijyLyWGBO6NRuXVwppVRB+Hy+xyOBTKfgZf78' +
                                    '+UeKyP8BzaFQaEzHYCRWfX19leM46yD8XDDGvCQi+wAX' +
                                    'GGNGichdtbW1P8miXcuMMQ9GNl8IVAOrZs6cOSF2/6' +
                                    'LqMYpNwB6+y3CqSofxqfsJxtKVlbNhlVlYVRbuTg+32cUkCIGr' +
                                    'qyZEg6JAKMCzK/+329d1m1ycIUX11VJKKZV/9wMzgGM7vuF53m' +
                                    'nGGETkL6mCIoBZs2ZtbWhouNa27edramqiBTt9Pt/rwFPGmPO' +
                                    'AtAKjhoaGs4EZIrKstrY2ushgfX39A7Zt' +
                                    'LzfGVDc0NPxk5syZv2p7r6hyjARh6cft+UOThk/CDWqx0u6yB' +
                                    '1iUVpVgVVidugenxwyj/fW9v9Lsb+729cQveAFNxFZKqf6ktr' +
                                    'b2aRHZaIwZ1TGPxxhzHIBlWXekc66ZM2f+KjYoajt/5MeBGTT' +
                                    'rysj1fbEbI8HZPQAicmbse0UVGAH8' +
                                    '88P2BOzD9jwMcQXP1Ydst1lgV9qU7O5gStp74GLzi9Je1DEN' +
                                    'ni76qJRS/dEfATzP+2HbhgULFkwAqkVk40UXXfRKtieOCbYy+Q' +
                                    'u+GmDmzJmd63rB6wDGmOIdSgNY' +
                                    'sbl95eprv3od1371ugK2pv8QkZwGRhIU3J0e9oCii72VUkrlieM4d7u' +
                                    'uO5uY4bRQKHR6ZCLVH7tzbs/z5rQNx6Wzf319fVXXewEdeqCK7qkVO2Vf9ZwVHy9nU' +
                                    '/OmnJ7Ta3a1jppSSvUjNTU1K0VkcexwmjHmd' +
                                    'AgHTdmed/78+UcaY2ZEznNVV/tDdLgsY0UXGG1oXM/m' +
                                    'HZmteK2678rFV+Z+eqKEp+8rpZTqP4wxz0B4OC1mGG1Zx5' +
                                    'yhdEVmtD0HICLXZ3OeLtYuWhX7ouiG0' +
                                    'gCWb17Ot774LQDOfOIMHnk3PH3ccizsUp2+ny/ObjZes4cEcxcieTs8rAFWVt' +
                                    'P3lVJK9T4zZ878VU' +
                                    'NDww3Asa7rrgCImSafkZigaKCIPFFbWzs3k+MjU/Qne553GtAxv+nLkX3+Ebux6HqMAJZvas8zmji8vcSHF' +
                                    '/J0aCaPrFILZzcHe7ANOQxk3CadWaiUUv2Ji' +
                                    'PzFGDOK8HpBhEKhBzI9R0NDw9ltQRFwSW1t7cnJ9vX5fI83NDRIQ0ND3DT+t' +
                                    'oDMGHNebM5RfX19lTHmUqDZcZy4MhF' +
                                    'F2WO0JCbPaNKI+Npnbt' +
                                    'DFKSvKZvcNBqxyC6vMwt3u4u7w6G6IJH7B83tYZUUZhyullMoxy7LuEJEZhIf' +
                                    'Rnsgk3yey6vVvgKkAIrIY2DuyejU' +
                                    'Axpj1bWsPLViwYILrujMi+54JRPebOXPmr3w+39eMMTMcx1nn8/keAxq' +
                                    'B04gEXB2H5orySRWbgH3w8IMxMY9mnb7fQ' +
                                    'wzYA21KqhxMDgIaV+uoKaVUvxGZlr8KwBizKJNjPc/b3Rgzte21MWaq' +
                                    'MWZ27L/YtYciCd/LgOaO6xUB1NbWniwid4lIszHmHGPMbODfInJS7M' +
                                    'KO0esVU0mQWBt/sonhuwwHYN+7v8SqT2MCOgNOuRNXR03llxeIlBcJZ' +
                                    'X8Oa5CFPSB5jpiWBFFKKVVoRTsmFZuAPWn' +
                                    '4pPjASMBzPWyndyViX3fEXK6cktYswx5z52u/5Mq//7TL/axSC2to6vIiXfGaPaxyS0u8KKWUKlp' +
                                    'FOZQG8XlGsQnYbbyAp0MzBRAtLzKgc3mRLun0faWUUkWuaH' +
                                    'uMOpYGScQL' +
                                    'er1q+v71r87l+lczmmlYnCywB9lYA6xw7lAg/RDJ2+FhVVgYR' +
                                    '3uNlFJKFZ+i7TFaHlMa5NCRh8YlYLfR6fuFZRwTnt4/xIY' +
                                    'M4tOQTt9XSilVpIo2MNq8YxMbGjcAUFFSwf' +
                                    'jdqxPuFwroQ7bQrDKLkqElWANtJJ2OoEB4+r5SSilVbIo2' +
                                    'MIL4afuH7ZF4OA1Pp+8XBQP2LhYlVSVYFV3nH+n0faWUU' +
                                    'sWoaHOMAFZsXs739v0eAFP2OIzfvbUw4X5uwMWUm4yn75c7' +
                                    '5Xx+cVO329lbpDsDrTuMBXZlTP5RsvIiLngtXsrp+0oppVRPK+o' +
                                    'eo9jSIJMSzEyLEnBD2mtUTEyJwdk9dX' +
                                    'kRr1lzxJRSShWXou4xen3Ta3jiYRmLA4cdiMEgSQZpJOghjpV' +
                                    'Rr1FrqJXyO0tz1VyVQLS8yA4Pd0eH9Y8E3GYPp1J7jZRSShW' +
                                    'Hou4x+mTnJ6z5bA0QTsA+cPjElPu7Ae01KkoG7F0tSoY6WOXx+UfS4iEh' +
                                    '7TVSSilVHIo6MIL4aftJ' +
                                    'E7AjxNWhmWJmbIM92MbZzY7rq9Tp+0oppYpF0QdGK2ICo0QrYHfk6vT' +
                                    '9omeVRqb3V9rhb6BO31dKKVUkijrHCOKn7NccXEPNwTUFbE3' +
                                    '/sftvhrAjuCOv17ArLOxyC3e7G841GmIXf' +
                                    'aCulFKqbyv6wGjJR/+MJmCrPsiAPdDGGiB4IdFMeKWUUgVl' +
                                    'Yfh1oRuRSmuolbXb1ha6GSqPBPlMbHNxyO9OL3RblFJK9W/hue03so+x' +
                                    '+L0RjixwexIat9s4Nm3fRHOgOaPjnAon40UfVc8RkZBAQ9CErudS' +
                                    'Pit0e5RSSqn4qOFGjrMs7kUYVaD25JRxDE' +
                                    '5p0Y8W9lPysnihCwOXsbLQLVFKKaXadO5OmYuDzcXGcLOBigK0' +
                                    'KafsMhtLc3qLyXvieXMCl7lPFrohSimlVEf' +
                                    'Jx5nmsptl82sxnGFS7Vckpo2fzknV05g0fBKThk9i+eblLN+8nKfXLOJ/P/' +
                                    'jfQjcvr04ccxInjjmRicMmMrFqEiu2' +
                                    'LmfFlhU8ve5pnl73VKGbB4AgTQZu8juhembhL3R7lFJKqUS6Dnhu5k' +
                                    'ADvzNC14sIFUBl2WDuO/F+plcnz9tdtOZJfvTCBTT6G3uwZflXWVbJPcf+lpPGTku6z1' +
                                    'NrF3HBn39YsM8uiCDmgYAXnM' +
                                    'PlbClII5RSSqk0pd8TdDNnGuE3BobksT0ZqSwbzHs/fp/B5YO73Pdz/+dU3' +
                                    'zuuzwRHlWWVrDp/DYPLivezC7JELDM7+JPgkh69sFJKKZWl9JNvruZ' +
                                    'BCbGnB7cIBPPYprTdf9LCtIIigMFlg7nn2N/muUU957ffujetoAgK8dnlQ/G8M' +
                                    'wOXhA7XoEgppVRvkllW8lx2cg1XS4gviu' +
                                    'FJKWBZsmnjpzNtfPIhpEROGjuNE8eclKcW9ZxwTlFmn6MnPrsgOwW5zr' +
                                    '9LqDpwmfsQBi1cp5RSqlfJbrrWXD6Uq5khhilieC/HbUrLtBQ5RamcN' +
                                    'Lb3B0bZfoZ8fnYReSzghKoDl4ZuoIade' +
                                    'buQUkoplUfdm8d+DUslyDjPcIFAZqsvdtOkNArKJnLA0ANz3JKeN7F' +
                                    'qYlbHHViV+88uwgoXOSowJ3Qqs/gw5xdQSimlelDupuHfykDL5QbxuNi' +
                                    'AnbPzJuFenf0oTdkvS3r1ititlwSyPrb8' +
                                    'zlyVI5PNnshVwWZ3IXPxcnRSpZRSqqByt/LhFTR7V3GJCOPE8ErOz' +
                                    'pvEis0rsj7Oc3v3c/ytrdl99myPiyUiIU+k3h8MjQvOce/ToEgppVR' +
                                    'fkvsloX/G+3I1X/EMx2HyN7SyfPPyrI/zAh5SyMzxblqRZYCT7XHt5' +
                                    'HkkdEBwTmg2V/Ts0' +
                                    'KlSSinVE/JXK+Nq/uQF2ceDKwVac336Rau' +
                                    'yqyjRdpwX7L0dHU+tzW4162yPE2Glixzv' +
                                    'vzR0vNY2U0op1Zflt4jYXEJcwy8kyGiEPwi5m769aPWTLFq9KMNjFrFodSQwCnmI1zt7' +
                                    'jZ5e9' +
                                    '1TGpT6yOUaQzzy4ONAcPCB0aej5jA5WSimleqGezUAOlxe53wgH' +
                                    '5+J0lWWDef/i9VSWVXa5b6O/kX1+vTeN/s+j24xtcMqcXDSlx1' +
                                    'WWVbL6/LVpf/bx945Ne+VrEfEM5l6/Cf6US/msu21VSimleoueL' +
                                    'Tt/NW/J1XzZM3xfpPsP3Eb/5+zz67277DlatHpRp6AIQFzptYnYbcFOV' +
                                    '71AT697KqOgCORlIXSwf07wRxoU' +
                                    'KaWU6m8KN2d9LgNwuNLAFQZKunu' +
                                    '6aeOnM616OpOGT2Li8Ims2LyC5ZuXs2jVk9Hhs4QMOOVOr56+f+KYkzh' +
                                    'p7ElMrJrIgVUTeWvrClZsXcFTazMa' +
                                    'PntPPG9O4DI3u+QtpZRSqg8ofDQwlz2Nwz' +
                                    '0GjitUE6xSC9vJ+9JLRUmQncCtASd0K7Pw' +
                                    'F7o9SimlVCEVPjBqcxNfM4Z7jTC2EJd3Knp3r1GmBBHEPBAoCV6pK1YrpZRSYcUVCc' +
                                    'zFopRzjccvDQzqyUsb28Ip6x+9RoIsEcvM1sr3SimlVLziCoza3M' +
                                    'pAK8CtAjXG9FyCuFPuYKzivCW5IR+KJ3WBOe7DaOV7pZRSqpPijg' +
                                    'JupNpY3GOEr/bI9SxDSXnvnL6fiiB+4M7ALqEbtf' +
                                    'K9UkoplVxxB0ZtbuZbRrjHwBfyfSm7zMaye3YVg3wSkccCVqiOS' +
                                    '3iv0G1RSimlil3vCIwA5uLgcKm' +
                                    'B6w2U5+06fWD6PoAIKzwjs0OXhl4udFuUUmTO8jMAAAL8SU' +
                                    'RBVEqp3qL3Pf2vY5jlcIcYvm/y1H5TYuGU9M5EbEE+E8x1waZgA' +
                                    '1r5XimllMpI7wuM2tzMgUb4g4ED8nH63jZ' +
                                    '9X0RCAg1BE7peV6xWSimlstN7nvyJCIabOd0IvzG' +
                                    'G3XJ56t41fV+eFy90iVa+V0oppbqndwdGbXJcXqRNsSdii7DSM3JJSC' +
                                    'vfK6WUUjnRNwKjNuHyIgsMnJCL0xnL4' +
                                    'BTh9H1Bmgzc5G8K3clcQoV' +
                                    'uj1JKKdVX9K3AqM1NfM3Abw2M6+6prFIb2ymOXiMR8QzmXr8XvIbL2VLo9' +
                                    'iillFJ9Td8MjCB35UWKZvq+vOxJaHZwDisK3BCllFKqzyr00z7/clBepLDT' +
                                    '9yNlPC5zHypQA5RSSql+o+8HRm3C5UUWGOHr2Rze03XUBNkJ3BrYJXS7lvF' +
                                    'QSimlekb/CYza3My3DNxnhFGZHGZsg1OW/0RsQQQxDwRKglcyiw/zfkGllF' +
                                    'JKRfW/wAignjKamG2E641Jv7xIvqfvC7JELDM7+JPgkrxdRCmllFJJ9c/AqE24' +
                                    'vMhtYvhBOuVF8jd9XzZ7IlcFL3Xv' +
                                    'xyB5uIBSSiml0tC/A6M24fIi/8/AxK52zeX0fUH8wJ2BYOgWrqA5JydVSimlVN' +
                                    'Y0MGrTXl6k3hiG' +
                                    'Jt0vR9P3ReSxgBWq4xLe69aJlFJKKZUzGhh1NJcBVglzR' +
                                    'bjEQMJxM8uxsEuzm74fKeNxYejS0MvdaqdSSimlck4Do2R+zheNy10GvpPo7' +
                                    'Uyn7wvymWCuCzYF79YyHkoppVRx0sCoK+HyIv9toDp2c7rT90UkJNAQNKHruZ' +
                                    'TP8tZOpZRSSnWbBkbpmIuFw0wj' +
                                    '/NwYdm3b3PX0fXlevNAlgctY2QOtVEoppVQ3aWCUibnsZpVwg3hcZAxWikTs91' +
                                    'ykNnRp6PlCNFMppZRS2dHAKBs3Um0Mdxs' +
                                    '4ypRa4ji2ARCkycBNfidUzyz8hW6mUkoppTKjgVF33MhxxnB7SXmJawxL/F7wG' +
                                    'i5nS6GbpZRSSilVOHPZq9BNUEoppVT3/X+QUZFEsapRLgAAAABJRU5ErkJggg==',
                                }
                            ]
                        },
                        {
                            alignment: 'left',
                            width: '20%',
                            stack: [
                                {style: 'h1', text: 'INVOICE'},
                                {style: 'h2', text: ''},
                                {style: 'h2', text: this.invoice.storeAddress},
                                {style: 'h2', text: this.invoice.storeTelephone},
                                {style: 'h2', text: this.invoice.storeEmail},
                            ]
                        }
                    ],
                }, '\n', // optional space between columns

                {
                    canvas: [
                        {color: '#D3D3D3', type: 'line', x1: 0, y1: 5, x2: 595 - 2 * 40, y2: 5, lineWidth: 0.5}
                    ]
                }, '\n',
                {
                    columns: [
                        {
                            width: '25%',
                            stack: [
                                {style: 'shipping', text: 'Shipping address'},
                                {style: 'h2', text: ''},
                                {style: 'h2', text: this.invoiceDetail.shippingCompany},
                                {style: 'h2', text: this.invoiceDetail.shippingAddress1},
                                {style: 'h2', text: this.invoiceDetail.shippingAddress2},
                                {style: 'h2', text: this.invoiceDetail.shippingCity},
                                {style: 'h2', text: this.invoiceDetail.shippingZone},
                                {style: 'h2', text: this.invoiceDetail.telephone},
                            ]
                        },
                        {
                            width: '35%',
                            stack: [
                                {style: 'billing', text: 'Billing address'},
                                {style: 'h2', text: ''},
                                {style: 'h2', text: this.invoiceDetail.shippingCompany},
                                {style: 'h2', text: this.invoiceDetail.shippingAddress1},
                                {style: 'h2', text: this.invoiceDetail.shippingAddress2},
                                {style: 'h2', text: this.invoiceDetail.shippingCity},
                                {style: 'h2', text: this.invoiceDetail.shippingZone},
                                {style: 'h2', text: this.invoiceDetail.telephone},
                            ]
                        },
                        {
                            width: '20%',
                            margin: [40, 0, 0, 0],
                            stack: [
                                {style: 'detail', text: 'Invoice ID'},
                                {style: 'h2', text: ''},
                                {style: 'h2', text: 'Issue Date'},
                                {style: 'h2', text: ''}
                            ]
                        },
                        {
                            width: '20%',
                            stack: [
                                {style: 'invoice_d', text: this.invoiceDetail.invoiceNo},
                                {style: 'h2', text: ''},
                                {
                                    style: 'invoice',
                                    text: this.datePipe.transform(this.invoiceDetail.createdDate, 'dd/MM/yyyy')
                                },
                                {style: 'h2', text: ''},
                            ]
                        },
                    ]
                }, '\n',
                {
                    canvas: [
                        {color: '#D3D3D3', type: 'line', x1: 0, y1: 5, x2: 595 - 2 * 40, y2: 5, lineWidth: 0.5}
                    ]
                }, '\n',
                {
                    text: 'Order Details', style: 'order'
                }, '\n',
                {
                    table: this.dynamicBody
                }, '\n',
                {
                    columns: [
                        {
                            width: '80%',
                            alignment: 'right',
                            stack: [
                                {style: 'h2', text: 'Total'},

                            ]
                        },
                        {
                            width: '20%',
                            alignment: 'right',
                            stack: [
                                {style: 'h2', text: this.invoiceDetail.total},

                            ]
                        }
                    ]
                }

            ],
            footer: [
                {
                    margin: [0, 0, 0, 10],
                    table: {
                        body: [
                            [
                                {border: [false, false, false, false], text: 'Note: ', style: 'note'},
                            ],
                            [
                                {
                                    border: [false, false, false, false],
                                    text: 'dummy content',
                                    style: 'content',
                                    margin: [0, 0, 0, 0]
                                }
                            ]
                        ]
                    }
                }
            ],
            styles: {
                h1: {margin: [0, 10, 0, 0], fontSize: 16, bold: true},
                detail: {margin: [0, 10, 0, 0], fontSize: 10, bold: false},
                shipping: {margin: [0, 10, 0, 0], fontSize: 12, bold: true},
                billing: {margin: [0, 10, 0, 0], fontSize: 12, bold: true},
                h2: {margin: [0, 5, 0, 0], fontSize: 10, bold: false},
                invoice: {margin: [0, 5, 0, 0], fontSize: 10, bold: true},
                invoice_d: {margin: [0, 10, 0, 0], fontSize: 10, bold: true},
                order: {margin: [0, 0, 0, 0], fontSize: 12, bold: true},
                total: {margin: [0, 5, 0, 0], fontSize: 10, bold: true},
                note: {margin: [0, 0, 0, 0], bold: true},
                content: {margin: [0, 0, 0, 0], bold: false, fontSize: 10},
                th: {margin: [0, 10, 0, 0], bold: false, fontSize: 10},
                td: {margin: [0, 10, 0, 0], bold: false, fontSize: 10}
            }
        };

        this.pdf = pdfMake;
        this.pdf.createPdf(this.docDefinition).download('invoice');
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

}
