import { NgPluralCase } from '@angular/common';

export interface Category {
  id: number;
  categoryName: string;
  categoryDescription: string | null;
}

// for create/update
export interface CategoryRequest {
  categoryName: string;
  categoryDescription: string | null;
}

// product interfaces
export interface Product {
  id: number;
  productName: string;
  price: number;
  description: string;
  productImgUrl: string | null;
  category: number;
  quantity: number;
}

export interface ProductRequest {
  productName: string;
  price: number;
  description: string;
  productImgUrl: string | null;
  category: number;
  quantity: number;
}

// pagination
export interface ProductPage {
  content: Product[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
