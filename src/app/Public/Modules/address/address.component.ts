import { Component, OnInit, OnDestroy } from '@angular/core';
import { CartService } from '../cart/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-address',
  standalone: false,
  
  templateUrl: './address.component.html',
  styleUrl: './address.component.css'
})
export class AddressComponent {
  selectedAddress: string | null = null;
  priceDetails: any = {};
  private priceDetailsSub: Subscription | null = null;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    // Subscribe to price details from CartService
    this.priceDetailsSub = this.cartService.getPriceDetails().subscribe((details) => {
      this.priceDetails = details;
    });
  }

  ngOnDestroy(): void {
    if (this.priceDetailsSub) this.priceDetailsSub.unsubscribe();
  }

  isButtonEnabled(): boolean {
    return this.priceDetails.itemsCount > 0 && this.selectedAddress !== null;
  }
}
