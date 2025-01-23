import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

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
    return this.getAddresses(userId).pipe(
      map((addresses) => [...addresses, address]),
      map((updatedAddresses) =>
        this.http.patch(`${this.apiUrl}/${userId}`, { addresses: updatedAddresses })
      )
    );
  }

  updateAddress(userId: string, addressId: string, address: any): Observable<any> {
    return this.getAddresses(userId).pipe(
      map((addresses) =>
        addresses.map((a) => (a.id === addressId ? { ...a, ...address } : a))
      ),
      map((updatedAddresses) =>
        this.http.patch(`${this.apiUrl}/${userId}`, { addresses: updatedAddresses })
      )
    );
  }

  deleteAddress(userId: string, addressId: string): Observable<any> {
    return this.getAddresses(userId).pipe(
      map((addresses) => addresses.filter((a) => a.id !== addressId)),
      map((updatedAddresses) =>
        this.http.patch(`${this.apiUrl}/${userId}`, { addresses: updatedAddresses })
      )
    );
  }
}
