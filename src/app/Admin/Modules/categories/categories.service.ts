import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private apiUrl = 'http://localhost:3000/categories';

  constructor(private http: HttpClient) {}

  // Get all categories
  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Get category by ID
  getCategoryById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // Add a new category
  addCategory(category: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, category);
  }

  // Update an existing category
  updateCategory(id: string, category: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, category);
  }

  // Delete a category
  deleteCategory(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Get product count for a category
  getCategoryProductCount(categoryName: string): Observable<number> {
    return this.http.get<any[]>(`http://localhost:3000/products?category=${categoryName}`)
      .pipe(map(products => products.length));
  }
}
