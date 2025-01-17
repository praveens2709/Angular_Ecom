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
  isChecked: boolean = false; // Default "select all" checkbox state
  cartItems: any[] = [];
  cartCount: number = 0;
  priceDetails: any = {
    totalMRP: 0,
    discount: 0,
    platformFee: 'Free',
    shippingFee: 'Free',
    totalAmount: 0,
    itemsCount: 0
  };

  private cartItemsSub: Subscription | null = null;
  private cartCountSub: Subscription | null = null;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartItemsSub = this.cartService.getCartItems().subscribe((data) => {
      this.cartItems = data;
      this.isChecked = this.cartItems.every(item => item.isSelected); // Update main checkbox
      this.updatePriceDetails();
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

  // Calculate price details based on selected items
  updatePriceDetails(): void {
    const selectedItems = this.cartItems.filter(item => item.isSelected);

    const totalMRP = selectedItems.reduce((acc, item) => acc + item.mrp, 0);
    const totalDiscount = selectedItems.reduce((acc, item) => acc + (item.mrp - item.price), 0);
    const totalAmount = totalMRP - totalDiscount;

    this.priceDetails = {
      totalMRP: selectedItems.length ? totalMRP : 0,
      discount: selectedItems.length ? totalDiscount : 0,
      platformFee: selectedItems.length ? 'Free' : 0,
      shippingFee: selectedItems.length ? 'Free' : 0,
      totalAmount: selectedItems.length ? totalAmount : 0,
      itemsCount: selectedItems.length
    };
  }

  // Toggle individual product selection
  toggleSelection(index: number): void {
    this.cartService.toggleSelection(this.cartItems[index].id);
    // Ensure `isSelected` state is updated
    this.cartItems[index].isSelected = !this.cartItems[index].isSelected;
    this.updatePriceDetails(); // Update prices after selection change
    this.isChecked = this.cartItems.every(item => item.isSelected); // Update main checkbox state
  }

  // Toggle select all products
  toggleSelectAll(): void {
    const allSelected = this.cartItems.every(item => item.isSelected);
    this.isChecked = !allSelected; // Toggle main checkbox
    this.cartService.toggleSelectAll(this.isChecked);
    this.cartItems.forEach(item => (item.isSelected = this.isChecked)); // Update UI
    this.updatePriceDetails();
  }  

  // Remove a product from the cart
  removeFromCart(productId: string): void {
    this.cartService.removeFromCart(productId);
  }

  // Remove all products from the cart
  removeAllFromCart(): void {
    this.cartService.removeAllFromCart();
  }
}
