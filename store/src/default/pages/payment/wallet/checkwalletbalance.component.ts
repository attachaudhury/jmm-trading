import { AfterViewInit } from '@angular/core';
import {ChangeDetectorRef} from '@angular/core';
import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators, NgForm} from '@angular/forms';
import {MatDialog} from '@angular/material';
import {SwiperConfigInterface, SwiperDirective} from 'ngx-swiper-wrapper';
import {ListsSandbox} from '../../../../core/lists/lists.sandbox';
import {ConfigService} from '../../../../core/service/config.service';
import { Subscription } from 'rxjs';
import { emailValidator } from 'src/default/theme/utils/app-validators';
import { HttpClient } from "@angular/common/http"


@Component({
    selector: 'app-checkwalletbalance',
    templateUrl: './checkwalletbalance.component.html',
    styleUrls: ['./checkwalletbalance.component.scss']
})
export class CheckWalletBalanceComponent implements OnInit {
    constructor(private http: HttpClient) {
}
ngOnInit() {
}
onSignupForm(form: NgForm)
  {

    console.log(form.value)
    const authData= { email: form.value.email, password: form.value.password }
    this.http.post("http://localhost:8004/api/loginbalancecheck", authData)
      .subscribe(res => {
        console.log(res)
      })
}
}
