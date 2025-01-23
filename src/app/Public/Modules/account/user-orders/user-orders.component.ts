import { Component } from '@angular/core';

@Component({
  selector: 'app-user-orders',
  standalone: false,
  
  templateUrl: './user-orders.component.html',
  styleUrl: './user-orders.component.css'
})
export class UserOrdersComponent {
  orders = [
    {
      status: 'Delivered',
      image: 'assets/images/product.png',
      storeName: 'DopeShope',
      productName: "Men's Cotton T-shirt",
      size: 'M'
    },
    {
      status: 'Cancelled',
      image: 'assets/images/product.png',
      storeName: 'CoolStore',
      productName: "Women's Casual Dress",
      size: 'L'
    },
    {
      status: 'Pending',
      image: 'assets/images/product.png',
      storeName: 'TrendyStore',
      productName: "Kid's Jacket",
      size: 'S'
    }
  ];

  getStatusIcon(status: string): string {
    switch (status) {
      case 'Delivered':
        return 'assets/images/check.png';
      case 'Cancelled':
        return 'assets/images/remove.png';
      case 'Pending':
        return 'assets/images/pending.png';
      default:
        return 'assets/images/default.png';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Delivered':
        return 'status-delivered';
      case 'Cancelled':
        return 'status-cancelled';
      case 'Pending':
        return 'status-pending';
      default:
        return '';
    }
  }
}