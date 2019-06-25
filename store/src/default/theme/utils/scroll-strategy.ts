/*
 * spurtcommerce
 * version 2.1
 * http://www.spurtcommerce.com
 *
 * Copyright (c) 2019 piccosoft ltd
 * Author piccosoft ltd <support@piccosoft.com>
 * Licensed under the MIT license.
 */
import { MAT_MENU_SCROLL_STRATEGY } from '@angular/material';
import { Overlay, BlockScrollStrategy } from '@angular/cdk/overlay';

export function menuScrollStrategy(overlay: Overlay): () => BlockScrollStrategy {
  return () => overlay.scrollStrategies.block();
}
