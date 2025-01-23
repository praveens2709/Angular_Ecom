import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AddressesService } from './addresses.service';

@Component({
  selector: 'app-addresses',
  standalone: false,
  
  templateUrl: './addresses.component.html',
  styleUrl: './addresses.component.css'
})
export class AddressesComponent implements OnInit {
  addresses: any[] = [];
  addressForm!: FormGroup;
  isDialogVisible = false;
  dialogTitle = 'Add Address';
  isEditMode = false;
  currentAddressId: string | null = null;
  userId = '1';

  constructor(private fb: FormBuilder, private addressService: AddressesService) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadAddresses();
    console.log('Initial addresses:', this.addresses);
  }

  initializeForm(): void {
    this.addressForm = this.fb.group({
      fullName: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      postalCode: ['', Validators.required],
      state: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      type: ['Home', Validators.required],
    });
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
    this.addressForm.reset({ type: 'Home' });
    this.isDialogVisible = true;
  }

  openEditDialog(address: any): void {
    this.isEditMode = true;
    this.dialogTitle = 'Edit Address';
    this.currentAddressId = address.id;
    this.addressForm.patchValue(address);
    this.isDialogVisible = true;
  }

  onSubmit(): void {
    if (this.addressForm.valid) {
      const formData = this.addressForm.value;

      if (this.isEditMode && this.currentAddressId) {
        this.addressService
          .updateAddress(this.userId, this.currentAddressId, formData)
          .subscribe({
            next: () => {
              this.loadAddresses();
              this.isDialogVisible = false;
            },
            error: (err) => console.error('Error updating address:', err),
          });
      } else {
        this.addressService.addAddress(this.userId, formData).subscribe({
          next: () => {
            this.loadAddresses();
            this.isDialogVisible = false;
          },
          error: (err) => console.error('Error adding address:', err),
        });
      }
    }
  }

  removeAddress(id: string): void {
    this.addressService.deleteAddress(this.userId, id).subscribe({
      next: () => this.loadAddresses(),
      error: (err) => console.error('Error deleting address:', err),
    });
  }
}
