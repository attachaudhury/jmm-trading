/*
 * spurtcommerce API
 * version 2.1
 * http://api.spurtcommerce.com
 *
 * Copyright (c) 2019 piccosoft ltd
 * Author piccosoft ltd <support@piccosoft.com>
 * Licensed under the MIT license.
 */

import { EntityRepository, Repository } from 'typeorm';
import {ProductViewLog} from '../models/productViewLog';

@EntityRepository(ProductViewLog)
export class ProductViewLogRepository extends Repository<ProductViewLog>  {

}
