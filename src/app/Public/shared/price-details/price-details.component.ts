import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-price-details',
  standalone: false,
  
  templateUrl: './price-details.component.html',
  styleUrl: './price-details.component.css'
})
export class PriceDetailsComponent {
  @Input() priceDetails: any;
  @Input() buttonText: string = '';
  @Input() buttonLink: string = '';
  @Input() isButtonDisabled: boolean = false;
  @Input() warningMessage: string = 'Please select at least one item to continue';

  @Output() buttonClick: EventEmitter<void> = new EventEmitter<void>();

  showWarning: boolean = false;

  onButtonClick(): void {
    if (!this.isButtonDisabled) {
      this.buttonClick.emit();
    } else {
      this.showWarning = true;
    }
  }
}