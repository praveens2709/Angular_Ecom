import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: false,
  
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {
  cartCount = 0;
  scrollUp() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}