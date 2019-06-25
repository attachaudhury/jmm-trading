/*
 * spurtcommerce
 * version 2.1
 * http://www.spurtcommerce.com
 *
 * Copyright (c) 2019 piccosoft ltd
 * Author piccosoft ltd <support@piccosoft.com>
 * Licensed under the MIT license.
 */
import {Injectable} from '@angular/core';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'DataType': 'application/json'
    })
};

@Injectable()
export class ConfigService {

    private config: Object;
    private env: Object;


    constructor(private http: HttpClient) {
    }

    /**
     * Loads the environment config file first. Reads the environment variable from the file
     * and based on that loads the appropriate configuration file - development or production
     */
    load() {
        return this.http
            .get<any>('assets/config/env.json', httpOptions)
            .pipe(
                mergeMap((env_data: any) => {
                    this.env = env_data;
                    return this.http.get(
                        'assets/config/' + env_data.env + '.json',
                        httpOptions
                    );
                }),
                map((data: any) => {
                    this.config = data;
                }),
                catchError(err => err.json().error || 'Server error')
            )
            .toPromise();
    }

    /**
     * Returns environment variable based on given key
     *
     * @ param key
     */
    getEnv(key: any) {
        return this.env[key];
    }

    /**
     * Returns configuration value based on given key
     *
     * @ param key
     */
    get(key: any) {
        return this.config[key];
    }
}
