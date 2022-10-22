import { Product } from 'src/app/common/product';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from './../../services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product!: Product;
  constructor(private productService: ProductService, 
              private router: ActivatedRoute) { }

  ngOnInit(): void {
    this.router.paramMap.subscribe(() => {
      this.handleProductDetails();
    });
  }
  handleProductDetails() {
    const theProductId: number = +this.router.snapshot.paramMap.get('id')!;

    this.productService.getProduct(theProductId).subscribe(
      data => {
        this.product = data;
      }
    )
  }

}
