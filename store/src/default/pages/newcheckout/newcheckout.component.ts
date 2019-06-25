import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators, NgForm} from '@angular/forms';
import {MatSnackBar, MatStepper} from '@angular/material';
import {emailValidator} from '../../theme/utils/app-validators';
import {ProductControlSandbox} from '../../../core/product-control/product-control.sandbox';
import {ListsSandbox} from '../../../core/lists/lists.sandbox';
import {ConfigService} from '../../../core/service/config.service';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-newcheckout',
    templateUrl: './newcheckout.component.html',
    styleUrls: ['./newcheckout.component.scss'],
})
export class NewCheckoutComponent implements OnInit {
    // decorator
    @ViewChild('horizontalStepper') horizontalStepper: MatStepper;
    @ViewChild('verticalStepper') verticalStepper: MatStepper;
    // reactive form
    public checkoutForm: FormGroup;
    // validation
    public submitted = false;
    // image
    public imagePath: any;

    public checkoutbuttondisabled = true;

    constructor(public formBuilder: FormBuilder, public snackBar: MatSnackBar,
                public productControlSandbox: ProductControlSandbox,
                public listsSandbox: ListsSandbox,
                public configService: ConfigService,
                private changeDetectRef: ChangeDetectorRef,private http: HttpClient) {
    }

    // Initially calls initCheckoutForm function
    ngOnInit() {
        this.initCheckoutForm();
        this.imagePath = this.configService.get('resize').imageUrl;
        this.changeDetectRef.detectChanges();
    }

    // create form group for checkout
    initCheckoutForm() {
        this.checkoutForm = this.formBuilder.group({
            'firstName': ['', Validators.required],
            'email': ['', Validators.compose([Validators.required, emailValidator])],
            'phone': ['', Validators.compose([Validators.required])],
            'address': ['', Validators.required],
        });
    }

    /**
     * place order with product detail, if the form is valid
     *
     * remove checkout local storage.
     * @param productDetails detail of the product for checkout
     */
    public placeOrder(productDetails) {
        console.log(productDetails)
        this.submitted = true;
        if (productDetails.length === 0) {
            this.snackBar.open('Add items to place order', '×', {
                panelClass: 'error',
                verticalPosition: 'top',
                horizontalPosition: 'right',
                duration: 3000
            });
            return;
        }
        if (!this.checkoutForm.valid) {
            return;
        }
        const params = this.checkoutForm.value;
        params.productDetail = productDetails;
        localStorage.removeItem('checkout');
        this.productControlSandbox.PlaceOrder(params);
    }

    /**
     * increase or decrease product count
     *
     * @param product added product details
     * @param operation differentiate the operation is increament operation or decrement operation
     */
    changeCount(product, operation) {
        this.productControlSandbox.ChangeCount(product, operation);
    }

    // remove product from the cart, calling removeItemFromCart function from sandbox
    removeProduct(product) {
        this.productControlSandbox.removeItemFromCart(product);
    }

    // clear cart, for remove all products in the cart
    public clear() {
        this.productControlSandbox.clearCart();
    }
    onSignupForm(form: NgForm)
  {
    console.log(form.value)
    const carttotal =  this.productControlSandbox.totalCartPrice$.subscribe(carttotal=>{
        console.log('total cart price');
        console.log(carttotal);
        const authData= { email: form.value.email, password: form.value.password }
    this.http.post<{status:string,amount:number}>("http://walletapi.broker92.com/api/loginbalancecheck", authData)
      .subscribe(res => {
        console.log(res)
        if(res.amount>carttotal){
            this.checkoutbuttondisabled= false;
            this.snackBar.open('You have $'+res.amount+' in your account You can place order now', '×', {
                panelClass: 'success',
                verticalPosition: 'top',
                horizontalPosition: 'right',
                duration: 3000
            });
        }else
        {
            this.checkoutbuttondisabled= true;
            this.snackBar.open('You have $'+res.amount+' in your account. You cannot place order', '×', {
                panelClass: 'default',
                verticalPosition: 'top',
                horizontalPosition: 'right',
                duration: 3000
            });
        }
        
      })
    });
    
}
}
