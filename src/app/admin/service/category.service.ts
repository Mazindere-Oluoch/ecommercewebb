import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category, CategoryRequest } from '../../models/admin.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly CATEGORY_URL = 'http://localhost:8083/api/v1/categories'; 
  
  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.CATEGORY_URL);
  }

  addCategory(category: CategoryRequest): Observable<Category> {
    return this.http.post<Category>(this.CATEGORY_URL, category);
  }

  updateCategory(id: number, category: CategoryRequest): Observable<Category> {
    return this.http.put<Category>(`${this.CATEGORY_URL}/${id}`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.CATEGORY_URL}/${id}`);
  }
}
