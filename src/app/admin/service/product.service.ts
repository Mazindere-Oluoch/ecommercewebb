import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductPage, ProductRequest } from '../../models/admin.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly PRODUCT_URL = 'http://localhost:8083/api/v1/products';

  constructor(private http: HttpClient) {}

  getProducts(page: number, size: number, search: string): Observable<ProductPage> {
    let params = new HttpParams()
    .set('page', page)
    .set('size', size)
    .set('sort', 'id,desc');

    if (search.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<ProductPage>(this.PRODUCT_URL, { params });
  }

  addProduct(product: ProductRequest): Observable<Product> {
    return this.http.post<Product>(this.PRODUCT_URL, product);
  }

  updateProduct(id: number, product: ProductRequest): Observable<Product> {
    return this.http.put<Product>(`${this.PRODUCT_URL}/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.PRODUCT_URL}/${id}`);
  }
}
