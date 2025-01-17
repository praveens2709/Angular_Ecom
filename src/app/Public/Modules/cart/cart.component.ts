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
  isModalVisible: boolean = false;
  availableQuantities: number[] = Array.from({ length: 10 }, (_, i) => i + 1);
  quantity: number = 1; // Default quantity
  pricePerUnit: number = 50; // Example price per unit
  totalPrice: number = 0;
  cartItems: any[] = [];
  cartCount: number = 0;
  currentItem: any = null;
  selectedQuantity: number = 1;
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

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.cartItemsSub = this.cartService.getCartItems().subscribe((data) => {
      this.cartItems = data;
      this.isChecked = this.cartItems.every(item => item.isSelected); // Update main checkbox
      this.updatePriceDetails();
      this.updateTotalPrice();
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
    let totalMRP = 0;
    let totalDiscount = 0;
    let totalAmount = 0;
  
    // Loop through all cart items
    this.cartItems.forEach(item => {
      totalMRP += item.mrp; // Add the MRP of each item
      totalAmount += item.price; // Add the final price of each item
      totalDiscount += (item.mrp - item.price); // Calculate the discount for each item
    });
  
    // Update the price details object
    this.priceDetails = {
      totalMRP,
      discount: totalDiscount,
      platformFee: 'Free',
      shippingFee: 'Free',
      totalAmount,
    };
  
    console.log('Price details updated:', this.priceDetails);
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

  openQuantityModal(item: any): void {
    this.currentItem = item;
    this.selectedQuantity = item.quantity || 1; // Pre-select current quantity
    this.isModalVisible = true;
  }
  
  selectQuantity(qty: number): void {
    this.selectedQuantity = qty; // Update temporary variable only
  }
  
  closeQuantityModal(): void {
    if (this.currentItem) {
      // Apply the selected quantity to the item
      this.currentItem.quantity = this.selectedQuantity;
  
      // Update the item's price and recalculate totals
      this.currentItem.price = this.currentItem.basePrice * this.selectedQuantity; // Assuming basePrice is the unit price
      this.currentItem.mrp = this.currentItem.baseMRP * this.selectedQuantity;     // Assuming baseMRP is the unit MRP
  
      // Call the CartService to update the item on the server
      this.cartService.updateItem(this.currentItem);
  
      // Recalculate price details after updating the cart
      this.updatePriceDetails();
    }
    this.isModalVisible = false;
  }  

  updateTotalPrice(): void {
    this.totalPrice = this.quantity * this.pricePerUnit;
  }
}
