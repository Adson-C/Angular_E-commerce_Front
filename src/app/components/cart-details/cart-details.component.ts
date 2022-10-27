import { CartService } from './../../services/cart.service';
import { CartItem } from './../../common/cart-itme';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails() {
    // itens do carrinho
    this.cartItems = this.cartService.cartItems;

    // total do carrinho
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );
    // total de quantidade
      
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );
    // calcular o preço do carrinho
      this.cartService.computeCartTotals();

  }

  incrementQuantity(theCartItem: CartItem) {
    this.cartService.addToCart(theCartItem);
  }

  decrementQuantity(theCartItem: CartItem) {
    this.cartService.decrementQuantity(theCartItem);
  }

  remove(theCartItem: CartItem) {
    this.cartService.remove(theCartItem);
  }

}
