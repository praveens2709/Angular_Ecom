import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AddressesService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  getAddresses(userId: string): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`).pipe(
      map((user) => user.addresses || [])
    );
  }

  addAddress(userId: string, address: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`).pipe(
      switchMap((user) => {
        if (!user.addresses) {
          user.addresses = [];
        }
        const newAddress = { ...address, id: this.generateId() };
        user.addresses.push(newAddress);
        return this.http.patch(`${this.apiUrl}/${userId}`, { addresses: user.addresses });
      })
    );
  }  

  updateAddress(userId: string, addressId: string, address: any): Observable<any> {
    return this.getAddresses(userId).pipe(
      switchMap((addresses) => {
        const updatedAddresses = addresses.map((a) =>
          a.id === addressId ? { ...a, ...address } : a
        );
        return this.http.patch(`${this.apiUrl}/${userId}`, { addresses: updatedAddresses });
      })
    );
  }

  deleteAddress(userId: string, addressId: string): Observable<any> {
    return this.getAddresses(userId).pipe(
      switchMap((addresses) => {
        const updatedAddresses = addresses.filter((a) => a.id !== addressId);
        return this.http.patch(`${this.apiUrl}/${userId}`, { addresses: updatedAddresses });
      })
    );
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
