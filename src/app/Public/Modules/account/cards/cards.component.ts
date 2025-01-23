import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CardsService } from './cards.service';

@Component({
  selector: 'app-cards',
  standalone: false,
  
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.css'
})
export class CardsComponent implements OnInit {
  isDialogVisible = false;
  dialogTitle = 'Add Card';
  cardForm: FormGroup;
  editingCardId: string | null = null;
  cards: any[] = [];
  userId = '1';

  constructor(private fb: FormBuilder, private cardsService: CardsService) {
    this.cardForm = this.fb.group({
      cardHolderName: ['', Validators.required],
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      expiryMonth: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])$/)]],
      expiryYear: ['', [Validators.required, Validators.pattern(/^(20[2-9][0-9]|2100)$/)]],
      cardType: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadCards();
  }

  loadCards() {
    this.cardsService.getCards(this.userId).subscribe({
      next: (data) => {
        this.cards = data;
      },
      error: (err) => {
        console.error('Error fetching cards:', err);
      },
    });
  }

  openAddCardDialog(): void {
    this.dialogTitle = 'Add Card';
    this.isDialogVisible = true;
    this.editingCardId = null;
    this.cardForm.reset();
  }

  openEditCardDialog(card: any): void {
    this.dialogTitle = 'Edit Card Details';
    this.isDialogVisible = true;
    this.editingCardId = card.id;

    this.cardForm.patchValue({
      cardHolderName: card.cardHolderName,
      cardNumber: card.cardNumber,
      expiryMonth: card.expiryMonth,
      expiryYear: card.expiryYear,
      cardType: card.cardType,
    });
  }

  onSubmit() {
    if (this.cardForm.valid) {
      const formValue = this.cardForm.value;

      if (this.editingCardId) {
        this.cardsService.updateCard(this.userId, this.editingCardId, formValue).subscribe({
          next: () => {
            this.loadCards();
            this.isDialogVisible = false;
          },
          error: (err) => console.error('Error saving card:', err),
        });
      } else {
        this.cardsService.addCard(this.userId, formValue).subscribe({
          next: () => {
            this.loadCards();
            this.isDialogVisible = false;
          },
          error: (err) => console.error('Error saving card:', err),
        });
      }
    } else {
      console.error('Form is invalid');
    }
  }

  removeCard(cardId: string): void {
    this.cardsService.deleteCard(this.userId, cardId).subscribe({
      next: () => this.loadCards(),
      error: (err) => console.error('Error deleting card:', err),
    });
  }

  private resetDialog(): void {
    this.cardForm.reset();
    this.editingCardId = null;
  }
}