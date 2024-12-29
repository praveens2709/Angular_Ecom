import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  apiURL = 'http://localhost:3000/';
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiURL}auth/?email=${email}`).pipe(
      map((users) => {
        if (users.length === 0) {
          throw new Error('User not found');
        }

        const user = users[0];
        if (user.password === password) {
          localStorage.setItem('authToken', JSON.stringify(user));
          this.isLoggedInSubject.next(true);
          return user;
        } else {
          throw new Error('Invalid password');
        }
      })
    );
  }

  get isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  getAdmin(): any {
    const admin = localStorage.getItem('authToken');
    return admin ? JSON.parse(admin) : null;
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.isLoggedInSubject.next(false);
  }
}
