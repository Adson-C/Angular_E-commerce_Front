import { AdsShopFormService } from './../../services/ads-shop-form.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  constructor(private formBuild: FormBuilder, 
              private adsShopFormService: AdsShopFormService) { }

  ngOnInit(): void {

    this.checkoutFormGroup = this.formBuild.group({
      customer: this.formBuild.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuild.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      billingAddress: this.formBuild.group({
        street: [''],
        city: [''],
        state: [''],
        country: [''],
        zipCode: ['']
      }),
      creditCart: this.formBuild.group({
        cartType: [''],
        nameOnCart: [''],
        cardNumber: [''],
        securityCode: [''],
        expirationMonth: [''],
        expirationYea: ['']
      })
    });

    // popular o mes
    const startMonth: number = new Date().getMonth() + 1;
    console.log('startMonth: ' + startMonth);

    this.adsShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
      // popular o ano
    this.adsShopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved credit card Years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );

  } 

  copyShippingAddressToBillingAddress(event) {

    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress']
            .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
    }
    else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
    }
  }

  onSubmit() {
    console.log('Handling the submit button');
    console.log(this.checkoutFormGroup.get('customer').value);
    console.log("Email é esse " + this.checkoutFormGroup.get('customer').value.email);
  }




}
