/*
 * spurtcommerce
 * version 2.1
 * http://www.spurtcommerce.com
 *
 * Copyright (c) 2019 piccosoft ltd
 * Author piccosoft ltd <support@piccosoft.com>
 * Licensed under the MIT license.
 */
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of, throwError as observableThrowError} from 'rxjs';
import {ConfigService} from '../../service/config.service';

export const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable()
export class Api {

  constructor(
    public http: HttpClient, public configService: ConfigService
  ) {

  }

  protected getBaseUrl(): string {
    return this.configService.get('api').storeUrl;
    // return 'http://fusionsodapi-stg.us-east-1.elasticbeanstalk.com';
  }

  protected handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure

      // TODO: better job of transforming error for user consumption

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
