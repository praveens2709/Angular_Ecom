import { Component } from '@angular/core';

@Component({
  selector: 'app-address',
  standalone: false,
  
  templateUrl: './address.component.html',
  styleUrl: './address.component.css'
})
export class AddressComponent {
  // Address selected state
  selectedAddress: boolean = true;

  // Add any other necessary properties for cart data
  cartItems = [
    {
      image: 'assets/images/product.png',
      title: "Men's Cotton T-shirt",
      price: 499,
      isSelected: false
    },
    // More cart items can be added here
  ];
}
