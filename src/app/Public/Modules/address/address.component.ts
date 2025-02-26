import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart/cart.service';
import { AddressesService } from '../account/addresses/addresses.service';

@Component({
  selector: 'app-address',
  standalone: false,
  templateUrl: './address.component.html',
  styleUrl: './address.component.css',
})
export class AddressComponent implements OnInit {
  addresses: any[] = [];
  selectedAddress: string | null = null;
  isDialogVisible = false;
  dialogTitle = 'Add Address';
  isEditMode = false;
  selectedAddressData: any = null;
  priceDetails: any = {};
  userId = '1';

  constructor(
    private addressService: AddressesService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadAddresses();
    this.cartService.getPriceDetails().subscribe((details) => {
      this.priceDetails = details;
    });
  }

  loadAddresses(): void {
    this.addressService.getAddresses(this.userId).subscribe({
      next: (data) => {
        this.addresses = data;
        if (this.addresses.length > 0) {
          this.selectedAddress = this.addresses[0].id;
        }
      },
      error: (err) => console.error('Error fetching addresses:', err),
    });
  }

  openAddDialog(): void {
    this.isEditMode = false;
    this.dialogTitle = 'Add New Address';
    this.selectedAddressData = null;
    this.isDialogVisible = true;
  }

  openEditDialog(address: any): void {
    console.log('Editing Address:', address);
    this.isEditMode = true;
    this.dialogTitle = 'Edit Address';
    this.selectedAddressData = { ...address };
    this.isDialogVisible = true;
  }  

  handleAddressSave(address: any): void {
    if (this.isEditMode && this.selectedAddressData?.id) {
      this.addressService.updateAddress(this.userId, this.selectedAddressData.id, address).subscribe({
        next: () => {
          this.loadAddresses();
          this.isDialogVisible = false;
        },
        error: (err) => console.error('Error updating address:', err),
      });
    } else {
      this.addressService.addAddress(this.userId, address).subscribe({
        next: () => {
          this.loadAddresses();
          this.isDialogVisible = false;
        },
        error: (err) => console.error('Error adding address:', err),
      });
    }
  }

  removeAddress(id: string): void {
    this.addressService.deleteAddress(this.userId, id).subscribe({
      next: () => this.loadAddresses(),
      error: (err) => console.error('Error deleting address:', err),
    });
  }

  handleDialogClose(): void {
    this.isDialogVisible = false;
  }
}
