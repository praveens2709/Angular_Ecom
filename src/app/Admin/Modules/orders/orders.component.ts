import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-orders',
  standalone: false,
  
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  selectedOrder: any = null;
  viewDialogVisible = false;
  shippedDialogVisible = false;
  deliveredDialogVisible = false;
  cancelDialogVisible = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders() {
    this.http.get<any[]>('http://localhost:3000/orders').subscribe(
      (data) => {
        this.orders = data;
      },
      (error) => {
        console.error('Error fetching orders:', error);
      }
    );
  }

  getSeverity(status: string): 'success' | 'info' | 'warning' | 'danger' | undefined {
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'Shipped':
        return 'info';
      case 'Delivered':
        return 'success';
      case 'Cancelled':
        return 'danger';
      default:
        return undefined;
    }
  }

  viewOrderDetails(order: any) {
    this.selectedOrder = order;
    this.viewDialogVisible = true;
  }

  openShippedDialog(order: any) {
    this.selectedOrder = order;
    this.shippedDialogVisible = true;
  }

  markAsShipped() {
    if (this.selectedOrder) {
      this.selectedOrder.status = 'Shipped';
      this.updateOrderStatus(this.selectedOrder);
    }
    this.shippedDialogVisible = false;
  }

  openDeliveredDialog(order: any) {
    this.selectedOrder = order;
    this.deliveredDialogVisible = true;
  }

  markAsDelivered() {
    if (this.selectedOrder) {
      this.selectedOrder.status = 'Delivered';
      this.updateOrderStatus(this.selectedOrder);
    }
    this.deliveredDialogVisible = false;
  }

  openCancelDialog(order: any) {
    this.selectedOrder = order;
    this.cancelDialogVisible = true;
  }

  cancelOrder() {
    if (this.selectedOrder) {
      this.selectedOrder.status = 'Cancelled';
      this.updateOrderStatus(this.selectedOrder);
    }
    this.cancelDialogVisible = false;
  }

  updateOrderStatus(order: any) {
    this.http.put(`http://localhost:3000/orders/${order.id}`, order).subscribe(
      () => {
        console.log('Order status updated successfully');
      },
      (error) => {
        console.error('Error updating order status:', error);
      }
    );
  }
}