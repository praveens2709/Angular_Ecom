import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-address-form',
  standalone: false,
  
  templateUrl: './address-form.component.html',
  styleUrl: './address-form.component.css'
})
export class AddressFormComponent {
  @Input() isDialogVisible: boolean = false;
  @Input() dialogTitle: string = 'Add Address';
  @Input() addressData: any;
  @Output() onSave = new EventEmitter<any>();
  @Output() onClose = new EventEmitter<void>();

  addressForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.addressForm = this.fb.group({
      fullName: ['', Validators.required],
      mobile: ['', Validators.required],
      postalCode: ['', Validators.required],
      state: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      type: ['Home', Validators.required],
    });
  }

  ngOnChanges(): void {
    if (this.addressData) {
      this.addressForm.patchValue({ ...this.addressData });
    }
     else {
      this.addressForm.reset();
      this.addressForm.patchValue({ type: 'Home' });
    }
  }  

  onSubmit(): void {
    if (this.addressForm.valid) {
      this.onSave.emit(this.addressForm.value);
    }
  }

  closeDialog(): void {
    this.onClose.emit();
  }
}