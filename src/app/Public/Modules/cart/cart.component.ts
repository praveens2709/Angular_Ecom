import { Component } from '@angular/core';

@Component({
  selector: 'app-cart',
  standalone: false,
  
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  isChecked: boolean = false;

  cartItems = [
    {
      image: 'assets/images/product.png',
      brand: 'DopeShope',
      title: "Men's Cotton T-shirt",
      seller: 'dopeshope pvt. ltd.',
      size: 'M',
      quantity: 1,
      price: 499,
      isSelected: false
    },
    {
      image: 'assets/images/product3.png',
      brand: 'DopeShope',
      title: "Men's Cotton T-shirt",
      seller: 'dopeshope pvt. ltd.',
      size: 'L',
      quantity: 1,
      price: 499,
      isSelected: false
    }
  ];

  // Update the number of selected items
  get selectedItemCount(): number {
    return this.cartItems.filter(item => item.isSelected).length;
  }

  // Update the main checkbox when individual items are selected/deselected
  onItemSelectionChange(): void {
    this.isChecked = this.selectedItemCount === this.cartItems.length;
  }

  // Toggle selection for an individual item
  toggleSelection(index: number) {
    this.cartItems[index].isSelected = !this.cartItems[index].isSelected;
    this.onItemSelectionChange(); // Update the main checkbox based on individual selection
  }

  // Toggle selection for all items
  toggleSelectAll(): void {
    // Update all items' isSelected property based on isChecked value
    this.cartItems.forEach(item => item.isSelected = this.isChecked);
  
    // Ensure the state of isChecked is correct
    this.isChecked = this.cartItems.every(item => item.isSelected);
  }  
}