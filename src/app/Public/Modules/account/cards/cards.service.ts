import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CardsService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  getCards(userId: string): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`).pipe(
      map((user) => user.cards || [])
    );
  }

  addCard(userId: string, card: any): Observable<any> {
    return this.getCards(userId).pipe(
      map((cards) => [...cards, card]),
      map((updatedCards) => 
        this.http.patch(`${this.apiUrl}/${userId}`, { cards: updatedCards })
      )
    );
  }

  updateCard(userId: string, cardId: string, updatedCard: any): Observable<any> {
    return this.getCards(userId).pipe(
      map((cards) =>
        cards.map((card) => (card.id === cardId ? { ...card, ...updatedCard } : card))
      ),
      map((updatedCards) => 
        this.http.patch(`${this.apiUrl}/${userId}`, { cards: updatedCards })
      )
    );
  }

  deleteCard(userId: string, cardId: string): Observable<any> {
    return this.getCards(userId).pipe(
      map((cards) => cards.filter((card) => card.id !== cardId)),
      map((updatedCards) => 
        this.http.patch(`${this.apiUrl}/${userId}`, { cards: updatedCards })
      )
    );
  }
}
