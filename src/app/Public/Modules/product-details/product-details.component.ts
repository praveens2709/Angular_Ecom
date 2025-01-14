import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../Admin/Modules/products/product.service';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-product-details',
  standalone: false,
  
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
  cartCount: number = 5;
  product: any;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private viewportScroller: ViewportScroller
  ) {}

  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0, 0]);
    this.fetchProductDetails();
  }

  fetchProductDetails(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productService.getProductById(productId).subscribe((data) => {
        this.product = data;
      });
    }
  }

  addToCart(product: any): void {
    console.log('Adding to cart:', product);
    // Logic to add the product to the cart
  }

  getReadableStatus(status: string): string {
    switch (status) {
      case 'INSTOCK':
        return 'In Stock';
      case 'LOWSTOCK':
        return 'Low Stock';
      case 'OUTOFSTOCK':
        return 'Out of Stock';
      default:
        return 'Unknown Status';
    }
  }
  
}
