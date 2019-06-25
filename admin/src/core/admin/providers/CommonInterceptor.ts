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
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpResponse, HttpEvent
} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {throwError} from 'rxjs';
import {catchError, switchMap, map} from 'rxjs/operators';

import {Router} from '@angular/router';
import {ToastrManager} from 'ng6-toastr-notifications';


@Injectable()
export class HTTPStatus {
    public requestInFlight$: BehaviorSubject<boolean>;

    constructor() {
        this.requestInFlight$ = new BehaviorSubject(false);
    }

    setHttpStatus(inFlight: boolean) {
        this.requestInFlight$.next(inFlight);
    }

    getHttpStatus(): Observable<boolean> {
        return this.requestInFlight$.asObservable();
    }
}

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

    protected userTokenDetail: any = {};

    constructor(private router: Router,
                private toastr: ToastrManager,
                public status: HTTPStatus) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this.userTokenDetail = localStorage.getItem('userdetail') ? JSON.parse(localStorage.getItem('userdetail')) : {};

        this.status.setHttpStatus(true);

        if (this.userTokenDetail) {
            req = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${this.userTokenDetail.accessToken}`
                }
            });
        }

        return next.handle(req).pipe(
            map((user: any) => {
                if (user instanceof HttpResponse) {
                    this.status.setHttpStatus(false);
                    const response = user.body;
                    if (response.message && response.message !== '' && req.method !== 'GET') {
                        this.showSuccess(user.body.message);
                    }
                }
                return user;
            }),
            catchError(response => {
                this.status.setHttpStatus(false);
                if (response.status === 200 || response.status === 201) {
                    return response;
                }
                switch (response.status) {
                    case 400:
                        this.handleBadRequest(response);
                        break;
                    default:
                        break;
                    case 401:
                        this.handleUnAuthorized();
                        break;
                }
                return throwError(response);
            })
        );

    }

    /**
     * Shows notification errors when server response status is 401
     *
     * @ param error
     */
    private handleBadRequest(responseBody: any): void {
        if (responseBody.error) {
            try {
                const bodyParsed = responseBody.error;
                this.handleErrorMessages(bodyParsed);
            } catch (error) {
                // this.handleServerError();
            }
        }
        // else this.handleServerError();
    }


    private handleErrorMessages(response: any): void {
        if (!response) {
            return;
        }
        this.showNotificationError(response.message);
    }

    /**
     * redirect to login if un authorized
     *
     */
    private handleUnAuthorized() {
        localStorage.clear();
        this.router.navigate(['/auth/login']);
    }

    /**
     * Shows error notification with given title and message
     *
     * @ param message
     */
    private showNotificationError(message: string): void {
        this.toastr.errorToastr(message);
    }

    private showSuccess(message) {
        this.toastr.successToastr(message);
    }
}
