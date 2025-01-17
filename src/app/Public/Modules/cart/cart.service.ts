import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<any[]>([]);
  private cartCountSubject = new BehaviorSubject<number>(0);

  private apiUrl = 'http://localhost:3000/cart';  // Adjust the URL based on your setup

  constructor(private http: HttpClient) {
    this.loadCartItems();  // Load cart items when service is initialized
  }

  // Load cart items from the server
  loadCartItems() {
    this.http.get<any[]>(this.apiUrl).subscribe((data) => {
      const updatedData = data.map(item => ({ ...item, isSelected: true })); // Mark all items as selected
      this.cartItemsSubject.next(updatedData);
      this.cartCountSubject.next(updatedData.length);
      this.updateServer(updatedData); // Ensure server reflects the updated selection
    });
  }  

  getCartItems() {
    return this.cartItemsSubject.asObservable();
  }

  getCartCount() {
    return this.cartCountSubject.asObservable();
  }

  // Toggle individual product selection
  toggleSelection(productId: string) {
    const updatedItems = this.cartItemsSubject.getValue().map(item =>
      item.id === productId ? { ...item, isSelected: !item.isSelected } : item
    );
    this.cartItemsSubject.next(updatedItems);
    this.updateServer(updatedItems);  // Update the server with new selection
  }

  // Select or deselect all products
  toggleSelectAll(isChecked: boolean) {
    const updatedItems = this.cartItemsSubject.getValue().map(item => ({
      ...item, isSelected: isChecked
    }));
    this.cartItemsSubject.next(updatedItems);
    this.updateServer(updatedItems);  // Update the server with new selection
  }

  addToCart(product: any): void {
    const productWithSelection = { ...product, isSelected: true };
    const updatedCartItems = [...this.cartItemsSubject.getValue(), productWithSelection];
    this.cartItemsSubject.next(updatedCartItems);
    this.cartCountSubject.next(updatedCartItems.length);

    this.http.post(this.apiUrl, productWithSelection).subscribe({
      next: () => console.log('Product added to cart successfully'),
      error: (err) => console.error('Failed to add product to cart', err)
    });
  }  

  // Remove a product from the cart
  removeFromCart(productId: string): void {
    const updatedItems = this.cartItemsSubject.getValue().filter(item => item.id !== productId);
    this.cartItemsSubject.next(updatedItems);
    this.cartCountSubject.next(updatedItems.length);

    this.http.delete(`${this.apiUrl}/${productId}`).subscribe({
      next: () => console.log('Product removed successfully'),
      error: (err) => console.error('Failed to remove product', err)
    });
  }  

  removeAllFromCart(): void {
    const cartItems = this.cartItemsSubject.getValue();
    const deleteRequests = cartItems.map(item =>
      lastValueFrom(this.http.delete(`${this.apiUrl}/${item.id}`))
    );
  
    Promise.all(deleteRequests)
      .then(() => {
        this.cartItemsSubject.next([]);
        this.cartCountSubject.next(0);
        console.log('All products removed successfully');
      })
      .catch(err => console.error('Failed to clear cart', err));
  }
  
  private updateServer(updatedItems: any[]): void {
    const updateRequests = updatedItems.map(item =>
      lastValueFrom(this.http.put(`${this.apiUrl}/${item.id}`, item))
    );
    Promise.all(updateRequests)
      .then(() => console.log('Cart updated successfully'))
      .catch((err) => console.error('Failed to update cart', err));
  }
}
