import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AddressesService } from './addresses.service';

@Component({
  selector: 'app-addresses',
  standalone: false,
  
  templateUrl: './addresses.component.html',
  styleUrl: './addresses.component.css'
})
export class AddressesComponent implements OnInit {
  addresses: any[] = [];
  isDialogVisible = false;
  dialogTitle = 'Add Address';
  isEditMode = false;
  selectedAddress: any = null;
  userId = '1';

  constructor(private addressService: AddressesService) {}

  ngOnInit(): void {
    this.loadAddresses();
  }

  loadAddresses(): void {
    this.addressService.getAddresses(this.userId).subscribe({
      next: (data) => {
        console.log('Fetched addresses:', data);
        this.addresses = data;
      },
      error: (err) => console.error('Error fetching addresses:', err),
    });
  }

  openAddDialog(): void {
    this.isEditMode = false;
    this.dialogTitle = 'Add New Address';
    this.selectedAddress = null;
    this.isDialogVisible = true;
  }
  
  openEditDialog(address: any): void {
    this.isEditMode = true;
    this.dialogTitle = 'Edit Address';
    this.selectedAddress = { ...address };
    this.isDialogVisible = true;
  }  

  handleAddressSave(address: any): void {
    if (this.isEditMode && this.selectedAddress?.id) {
      this.addressService.updateAddress(this.userId, this.selectedAddress.id, address).subscribe({
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

