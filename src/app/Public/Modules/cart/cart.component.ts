import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService } from './cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: false,
  
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit, OnDestroy {
  isChecked: boolean = false;
  cartItems: any[] = [];
  cartCount: number = 0;
  private cartItemsSub: Subscription | null = null; 
  private cartCountSub: Subscription | null = null; 

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.fetchCartItems();

    this.cartItemsSub = this.cartService.getCartItems().subscribe((data) => {
      this.cartItems = data;
      this.updateCartCount();
    });

    this.cartCountSub = this.cartService.getCartCount().subscribe((count) => {
      this.cartCount = count;
    });
  }

  ngOnDestroy(): void {
    if (this.cartItemsSub) this.cartItemsSub.unsubscribe();
    if (this.cartCountSub) this.cartCountSub.unsubscribe();
  }

  get selectedItemCount(): number {
    return this.cartItems.filter(item => item.isSelected).length;
  }

  updateCartCount(): void {
    this.cartCount = this.cartItems.length;
  }

  addToCart(product: any): void {
    this.cartService.addToCart(product);
  }

  toggleSelection(index: number): void {
    this.cartService.toggleSelection(this.cartItems[index].id);
  }

  toggleSelectAll(): void {
    this.isChecked = !this.isChecked;
    this.cartService.toggleSelectAll(this.isChecked);
  }

  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  onItemSelectionChange(): void {
    this.isChecked = this.selectedItemCount === this.cartItems.length;
  }
}