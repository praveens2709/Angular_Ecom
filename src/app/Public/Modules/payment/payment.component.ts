import { Component } from '@angular/core';

@Component({
  selector: 'app-payment',
  standalone: false,
  
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {
  selectedPaymentMethod = 'recommended';
  selectedRecommendedOption = '';
  selectedUPIOption = '';

  paymentMethods = [
    { key: 'recommended', name: 'Recommended', icon: 'assets/images/star.png' },
    { key: 'cod', name: 'Cash on Delivery (Cash/UPI)', icon: 'assets/images/cash.png' },
    { key: 'upi', name: 'UPI (Pay via any App)', icon: 'assets/images/upi.webp' },
    { key: 'card', name: 'Credit/Debit Card', icon: 'assets/images/card' }
  ];

  recommendedOptions = [
    { key: 'phonepe', name: 'PhonePe', icon: 'assets/images/phonepe.jpeg' },
    { key: 'gpay', name: 'Google Pay', icon: 'assets/images/gpay.png' },
    { key: 'cod', name: 'Cash on Delivery (Cash/UPI)', icon: 'assets/images/cash.png' }
  ];

  upiOptions = [
    { key: 'phonepe', name: 'PhonePe', icon: 'assets/images/phonepe.jpeg' },
    { key: 'gpay', name: 'Google Pay', icon: 'assets/images/gpay.png' }
  ];

  handlePaymentMethodChange(method: string): void {
    this.selectedPaymentMethod = method;
    this.selectedRecommendedOption = '';
    this.selectedUPIOption = '';
  }

  handleRecommendedOptionChange(option: string): void {
    this.selectedRecommendedOption = option;
  }

  handleUPIOptionChange(option: string): void {
    this.selectedUPIOption = option;
  }
}
