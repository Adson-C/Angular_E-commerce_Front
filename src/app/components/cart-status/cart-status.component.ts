import { Component, OnInit } from '@angular/core';
import { CartService } from './../../services/cart.service';


@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css']
})
export class CartStatusComponent implements OnInit {

  totalPrice: number = 0.00;
  totalQuantity: number = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.updateCartStatus();
  }
  updateCartStatus() {
    
    // escrever o total do preço
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    // escrever o quantidade total
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );
  }

}
