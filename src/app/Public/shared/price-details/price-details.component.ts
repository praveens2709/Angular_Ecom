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
  @Input() isButtonDisabled: boolean = false; // Control button state
  @Output() buttonClick: EventEmitter<void> = new EventEmitter<void>(); // Emit custom events for action

  onButtonClick(): void {
    if (!this.isButtonDisabled) {
      this.buttonClick.emit();
    }
  }
}