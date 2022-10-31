import { CartService } from './../../services/cart.service';
import { AdsShopValitadors } from './../../validators/ads-shop-valitadors';
import { AdsShopFormService } from './../../services/ads-shop-form.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';

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

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];


  constructor(private formBuild: FormBuilder,
              private adsShopFormService: AdsShopFormService,
              private cartService: CartService) { }

  ngOnInit(): void {

    this.reviewCartDetails();

    this.checkoutFormGroup = this.formBuild.group({
      customer: this.formBuild.group({
        firstName: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          AdsShopValitadors.notOnlyWhitespace]),
        lastName: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          AdsShopValitadors.notOnlyWhitespace]),
        email: new FormControl('',
          [Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuild.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2),
        AdsShopValitadors.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2),
        AdsShopValitadors.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2),
        AdsShopValitadors.notOnlyWhitespace])
      }),
      billingAddress: this.formBuild.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2),
                                    AdsShopValitadors.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2),
                                  AdsShopValitadors.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2),
                                     AdsShopValitadors.notOnlyWhitespace])
      }),
      creditCart: this.formBuild.group({
        cartType: new FormControl('', [Validators.required]),
        nameOnCart: new FormControl('', [Validators.required, Validators.minLength(2),
                                         AdsShopValitadors.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{16}$')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{3}$')]),
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

    // popular countries
    this.adsShopFormService.getCountries().subscribe(
      data => {
        console.log("Retrieved countries: " + JSON.stringify(data));
        this.countries = data;
      }
    );

  }
  reviewCartDetails() {
    // escrevendo serviço de quantidade total
    this.cartService.totalQuantity.subscribe(
    totalQuantity => this.totalQuantity = totalQuantity
    );
    // escrevendo serviço de Preço total
    this.cartService.totalPrice.subscribe(
    totalPrice => this.totalPrice = totalPrice
    );
  }

  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  
  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }
  
  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }

  get creditCartType() { return this.checkoutFormGroup.get('creditCart.cartType'); }
  get creditCartNameOnCart() { return this.checkoutFormGroup.get('creditCart.nameOnCart'); }
  get creditCartNumber() { return this.checkoutFormGroup.get('creditCart.cardNumber'); }
  get creditCartSecurityCode() { return this.checkoutFormGroup.get('creditCart.securityCode'); }
  

  copyShippingAddressToBillingAddress(event) {

    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress']
        .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

      this.billingAddressStates = this.shippingAddressStates;
    }
    else {
      this.checkoutFormGroup.controls['billingAddress'].reset();

      this.billingAddressStates = [];
    }
  }

  onSubmit() {
    console.log('Handling the submit button');

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }

    console.log(this.checkoutFormGroup.get('customer').value);
    console.log("Email é esse " + this.checkoutFormGroup.get('customer').value.email);

    console.log("Endereço de entrega " + this.checkoutFormGroup.get('shippingAddress').value.country.name);
    console.log("Endereço de entrega " + this.checkoutFormGroup.get('shippingAddress').value.state.name);
  }

  handleMonthsAndYears() {

    const creditCartFormGroup = this.checkoutFormGroup.get('creditCart');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCartFormGroup.value.expirationYea);

    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }

    this.adsShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.adsShopFormService.getStates(countryCode).subscribe(
      data => {

        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        }
        else {
          this.billingAddressStates = data;
        }

        formGroup.get('state').setValue(data[0]);
      }
    );

  }

}
