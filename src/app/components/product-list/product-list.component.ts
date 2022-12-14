import { CartService } from './../../services/cart.service';
import { CartItem } from './../../common/cart-itme';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchModel: boolean = false;

  // propriedades para paginação
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

  previouskeyword: string = "";
  
  
  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }
  listProducts() {

     this.searchModel = this.route.snapshot.paramMap.has('keyword');
     if (this.searchModel) {
      this.handleSearchProducts();
     }
     else {
       this.handleListProducts();
     }

  }

  handleSearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    // 
    if (this.previouskeyword != theKeyword) {
      this.thePageNumber = 1;
    }

    this.previouskeyword = theKeyword;
    console.log(`keyword=${theKeyword}, thePageNumber=${this.thePageNumber}`)

    this.productService.searchProductListPaginate(this.thePageNumber - 1,
                                                  this.thePageSize,
                                                  theKeyword).subscribe(this.processResult());
  }

  handleListProducts() {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    }
    else {
      this.currentCategoryId = 1;
    }

    // chegando se tem diferentes id 

    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId=${this.currentCategoryId}, 
                thePageNumber=${this.thePageNumber}`);

    this.productService.getProductListPaginate(this.thePageNumber -1,
                                               this.thePageSize,
                                               this.currentCategoryId)
                                               .subscribe(this.processResult());


  }

  updatePageSize(pageSize: string) {
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

    processResult() {
      return (data: any) => {
        this.products = data._embedded.products;
        this.thePageNumber = data.page.number + 1;
        this.thePageSize = data.page.size;
        this.theTotalElements = data.page.totalElements;
      };
    }  

    addToCart(theProduct: Product) {
      console.log(`Adicionado ao carrinho: ${theProduct.name}, ${theProduct.unitPrice}`);

      // adicionando cart items
      const theCartItem = new CartItem(theProduct);

      this.cartService.addToCart(theCartItem);
    }

}
