import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getDashboardData(): Observable<any> {
    return forkJoin({
      products: this.http.get<any[]>(`${this.baseUrl}/products`),
      categories: this.http.get<any[]>(`${this.baseUrl}/categories`),
      users: this.http.get<any[]>(`${this.baseUrl}/users`),
      orders: this.http.get<any[]>(`${this.baseUrl}/orders`)
    }).pipe(
      map((data) => {
        return {
          products: {
            total: data.products.length,
            instock: data.products.filter(
              (product) => product.inventoryStatus === 'INSTOCK'
            ).length,
            lowstock: data.products.filter(
              (product) => product.inventoryStatus === 'LOWSTOCK'
            ).length,
            outOfStock: data.products.filter(
              (product) => product.inventoryStatus === 'OUTOFSTOCK'
            ).length,
          },
          categories: {
            total: data.categories.length,
            active: data.categories.filter((cat) => cat.status === 'ACTIVE').length,
            inactive: data.categories.filter((cat) => cat.status === 'INACTIVE').length,
          },
          users: {
            total: data.users.length,
            active: data.users.filter((user) => user.active).length,
            inactive: data.users.filter((user) => !user.active).length,
          },
          orders: {
            total: data.orders.length,
            pending: data.orders.filter((order) => order.status === 'PENDING').length,
            completed: data.orders.filter((order) => order.status === 'COMPLETED').length,
          }
        };
      })
      
    );
  }
}
