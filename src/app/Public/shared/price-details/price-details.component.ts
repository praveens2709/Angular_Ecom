import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-price-details',
  standalone: false,
  
  templateUrl: './price-details.component.html',
  styleUrl: './price-details.component.css'
})
export class PriceDetailsComponent {
  @Input() priceDetails: any;
}