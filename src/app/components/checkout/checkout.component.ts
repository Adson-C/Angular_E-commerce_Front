import { environment } from './../../../environments/environment';
import { Purchase } from './../../common/purchase';
import { OrderItem } from './../../common/order-item';
import { Order } from './../../common/order';
import { Router } from '@angular/router';
import { CheckoutService } from './../../services/checkout.service';
import { CartService } from './../../services/cart.service';
import { AdsShopValitadors } from './../../validators/ads-shop-valitadors';
import { AdsShopFormService } from './../../services/ads-shop-form.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { PaymentInfo } from 'src/app/common/payment-info';


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

  storage: Storage = sessionStorage;

  // iniciando Stripe API
  stripe = Stripe(environment.stripePublishableKey);

  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any = "";

  isDisabled: boolean = false;

  constructor(private formBuild: FormBuilder,
              private adsShopFormService: AdsShopFormService,
              private cartService: CartService,
              private checkoutService: CheckoutService,
              private router: Router) { }

  ngOnInit(): void {

    // configurando stripe payment form
    this.setupStripePaymentForm();

    // ler usuario logado  email
    const theEmail = JSON.parse(this.storage.getItem('userEmail')!);

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

        email: new FormControl(theEmail,
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
        /* 
        cartType: new FormControl('', [Validators.required]),
        nameOnCart: new FormControl('', [Validators.required, Validators.minLength(2),
                                         AdsShopValitadors.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{16}$')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{3}$')]),
        expirationMonth: [''],
        expirationYea: ['']
        */
      })
      
    });
    

    // popular o mes
    /*
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
*/

    // popular countries
    this.adsShopFormService.getCountries().subscribe(
      data => {
        console.log("Retrieved countries: " + JSON.stringify(data));
        this.countries = data;
      }
    );
  }

  setupStripePaymentForm() {

    // handle para elements stripe
    var elements = this.stripe.elements();
    // criar um elements para cartão
    this.cardElement = elements.create('card', { hidePostalCode: true });
    // adicionar uma instância do elemento do cartão
    this.cardElement.mount('#card-element');
    // event para validar as certificações
    this.cardElement.on('change', (event: any) => {

      // pegando o card-errors element
      this.displayError = document.getElementById('card-erros');

      if (event.complete) {
        this.displayError.textContent = "";
      }
      else if(event.error) {
        // mostrar validação msg de error
        this.displayError.textContent = event.error.message;
      }
    });    
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
      return;
    }
    // pegando order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // pegando os Items
    const cartItems = this.cartService.cartItems;

    // criando pedido de item 
   /* let orderItems: OrderItem[] = [];
    for (let i=0; i < cartItems.length; i++)
      orderItems[i] = new OrderItem(cartItems[i]);
      */
    // 
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

    // pegando a compra
    let purchase =  new Purchase();

    // populando a compra - Cliente
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;
    // populando a compra - Endereço
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    // populando a compra - Endereço de cobrança
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    // popular as compras e os pedidos os pedidosItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    // computar payment info
    this.paymentInfo.amount = Math.round(this.totalPrice * 100);
    this.paymentInfo.currency = "BRL";
    this.paymentInfo.receiptEmail = purchase.customer.email;

    // validar form
    // criar payment intent
    // confirma payment card e place order
    if (!this.checkoutFormGroup.invalid && this.displayError.textContent === "") {

      this.isDisabled = true;

      this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe(
        (paymentIntentResponse) => {
          this.stripe.confirmCardPayment(paymentIntentResponse.client_secret,
            {
              payment_method: {
                card: this.cardElement,
                billing_details: {
                  email: purchase.customer.email,
                  name: `${purchase.customer.firstName} ${purchase.customer.lastName}`,
                  address: {
                    line1: purchase.billingAddress.street,
                    city: purchase.billingAddress.city,
                    state: purchase.billingAddress.state,
                    postal_code: purchase.billingAddress.zipCode,
                    country: this.billingAddressCountry.value.code
                  }
                }
              }
            }, { handleActions: false})
            .then((result: any) => {
              if (result.error) {
                // informa para cliente que deve um erro
                alert(`Houve um error: ${result.error.message}`);
                this.isDisabled = false;
              }
              else {
                //  call REST API via CheckoutService
                this.checkoutService.placeOrder(purchase).subscribe({
                  next: (response: any) => {
                    alert(`Seu pedido foi recebido.\nNumero do rastreamento: ${response.orderTrackingNumber}`);
          
                    // reset Carrinho 
                    this.resetCart();
                    this.isDisabled = false;
                  },
                  error: (err: any) => {
                    alert(`Ocorreu um erro: ${err.message}`);
                    this.isDisabled = false;
                  }
                })
              }
            });
        }
      );
    }
    else {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    /*this.checkoutService.placeOrder(purchase).subscribe({
        next: response => {
          alert(`Seu pedido foi recebido.\nNumero do rastreamento: ${response.orderTrackingNumber}`);

          // reset Carrinho 
          this.resetCart();
        },
        error: err => {
          alert(`Ocorreu um erro: ${err.message}`);
        }
      }
    );
*/
    }
    
  resetCart() {
    // reset carrinho 
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.cartService.persistCartItems();

    // reset formulario
    this.checkoutFormGroup.reset();

    // navegando de volta aos produtos
    this.router.navigateByUrl("/products");

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
