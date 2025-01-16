import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<any[]>([]);
  private cartCountSubject = new BehaviorSubject<number>(0);
  private cartUrl = 'http://localhost:3000/cart';

  constructor(private http: HttpClient) {}

  // Fetch cart items from the backend
  fetchCartItems(): void {
    this.http.get<any[]>(this.cartUrl).subscribe((data) => {
      this.cartItemsSubject.next(data);
      this.cartCountSubject.next(data.length); // Update cart count with the length of cart items
    });
  }

  // Get cart items as observable
  getCartItems() {
    return this.cartItemsSubject.asObservable();
  }

  // Get cart count as observable
  getCartCount() {
    return this.cartCountSubject.asObservable();
  }

  // Add product to the cart
  addToCart(product: any): void {
    // Optimistically update the cart count and items
    const updatedCartItems = [...this.cartItemsSubject.getValue(), product];
    this.cartItemsSubject.next(updatedCartItems);
    this.cartCountSubject.next(updatedCartItems.length);

    // Send request to server
    this.http.post(this.cartUrl, product).subscribe(() => {
      // If needed, handle server response here
    });
  }

  // Remove product from the cart
  removeFromCart(productId: number): void {
    // Optimistically update the cart count and items
    const updatedCartItems = this.cartItemsSubject.getValue().filter(item => item.id !== productId);
    this.cartItemsSubject.next(updatedCartItems);
    this.cartCountSubject.next(updatedCartItems.length);

    // Send request to server
    this.http.delete(`${this.cartUrl}/${productId}`).subscribe(() => {
      // If needed, handle server response here
    });
  }

  // Toggle item selection
  toggleSelection(productId: number): void {
    const updatedItems = this.cartItemsSubject.getValue().map(item =>
      item.id === productId ? { ...item, isSelected: !item.isSelected } : item
    );
    this.cartItemsSubject.next(updatedItems);
  }

  // Toggle select all items
  toggleSelectAll(isChecked: boolean): void {
    const updatedItems = this.cartItemsSubject.getValue().map(item => ({
      ...item, isSelected: isChecked
    }));
    this.cartItemsSubject.next(updatedItems);
  }
}

