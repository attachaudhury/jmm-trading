/*
 * spurtcommerce
 * version 2.1
 * http://www.spurtcommerce.com
 *
 * Copyright (c) 2019 piccosoft ltd
 * Author piccosoft ltd <support@piccosoft.com>
 * Licensed under the MIT license.
 */
import { Injectable } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';

@Injectable()
export class CustomOverlayContainer extends OverlayContainer {
  _createContainer(): void {
    const container = document.createElement('div');
    container.classList.add('cdk-overlay-container');
    document.getElementById('app').appendChild(container);
    this._containerElement = container;
  }
}
