import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Order {
  id: number;
  customerName: string;
  orderDate: string;
  totalAmount: number;
  status: string;
}

@Injectable({
  providedIn: 'root'
})

export class OrderService {
  private baseUrl = 'http://localhost:3000/orders';

  constructor(private http: HttpClient) {}

  // Fetch all orders
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseUrl);
  }

  // Update an order
  updateOrder(order: Order): Observable<Order> {
    return this.http.put<Order>(`${this.baseUrl}/${order.id}`, order);
  }

  // Cancel an order
  cancelOrder(orderId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${orderId}`);
  }
}
