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
