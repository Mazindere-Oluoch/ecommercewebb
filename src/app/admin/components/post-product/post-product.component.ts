import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabGroup } from '@angular/material/tabs';
import { PageEvent } from '@angular/material/paginator';

import { Category, Product, ProductRequest } from '../../../models/admin.model';

import { CategoryService } from '../../../admin/service/category.service';
import { ProductService } from '../../../admin/service/product.service';
import { ApiError } from '../../../interceptors/error.interceptor';

@Component({
  selector: 'app-post-product',
  templateUrl: './post-product.component.html',
  styleUrls: ['./post-product.component.scss'],
})
export class PostProductComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];

  loading = false;
  categoriesLoading = false;
  saving = false;

  search = '';
  pageIndex = 0;
  pageSize = 10;
  totalElements = 0;

  displayedColumns: string[] = [
    'serialNumber',
    'productImage',
    'productName',
    'price',
    'category',
    'quantity',
    'actions',
  ];

  productForm: FormGroup;

  // null = Add; product = Edit
  selectedProduct: Product | null = null;

  @ViewChild('productDialog')
  productDialog!: TemplateRef<any>;

  @ViewChild('deleteDialog')
  deleteDialog!: TemplateRef<any>;

  @ViewChild('tabs')
  tabs!: MatTabGroup;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
    this.productForm = this.fb.group({
      productName: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0.01)]],
      description: ['', Validators.required],
      productImgUrl: [''],
      category: [null, Validators.required],
      quantity: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  onTabChange(index: number): void {
    if (index === 1) {
      this.openAddDialog();
    }
  }

  loadProducts(): void {
    this.loading = true;

    this.productService.getProducts(this.pageIndex, this.pageSize, this.search).subscribe({
      next: (page) => {
        this.products = page.content;
        this.totalElements = page.totalElements;
        this.loading = false;
      },
      error: (err: ApiError) => {
        this.loading = false;
        this.snackBar.open(err.msg || 'Failed to load products', 'Close', { duration: 4000 });
      },
    });
  }

  loadCategories(): void {
    this.categoriesLoading = true;

    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.categoriesLoading = false;
      },
      error: (err: ApiError) => {
        this.categoriesLoading = false;
        this.snackBar.open(err.msg || 'Failed to load categories', 'Close', { duration: 4000 });
      },
    });
  }

  searchProducts(): void {
    this.pageIndex = 0;
    this.loadProducts();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadProducts();
  }

  getCategoryName(categoryId: number): string {
    return this.categories.find((category) => category.id === categoryId)?.categoryName || '--';
  }

  openAddDialog(): void {
    this.selectedProduct = null;

    this.productForm.reset({
      productName: '',
      price: null,
      description: '',
      productImgUrl: '',
      category: null,
      quantity: 0,
    });

    const dialogRef = this.dialog.open(this.productDialog, {
      width: '550px',
      maxWidth: 'calc(100vw - 32px)',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.tabs.selectedIndex = 0;
    });
  }

  openEditDialog(product: Product): void {
    this.selectedProduct = product;

    this.productForm.patchValue({
      productName: product.productName,
      price: product.price,
      description: product.description,
      productImgUrl: product.productImgUrl || '',
      category: product.category,
      quantity: product.quantity,
    });

    this.dialog.open(this.productDialog, {
      width: '550px',
      maxWidth: 'calc(100vw - 32px)',
    });
  }

  saveProduct(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const formValue = this.productForm.getRawValue();

    const product: ProductRequest = {
      productName: formValue.productName.trim(),
      price: Number(formValue.price),
      description: formValue.description.trim(),
      productImgUrl: formValue.productImgUrl?.trim() || null,
      category: Number(formValue.category),
      quantity: Number(formValue.quantity),
    };

    if (this.selectedProduct) {
      this.updateProduct(this.selectedProduct.id, product);
    } else {
      this.addProduct(product);
    }
  }

  addProduct(product: ProductRequest): void {
    this.saving = true;

    this.productService.addProduct(product).subscribe({
      next: () => {
        this.saving = false;
        this.dialog.closeAll();
        this.pageIndex = 0;
        this.loadProducts();

        this.snackBar.open('Product added successfully', 'Close', {
          duration: 3000,
        });
      },
      error: (err: ApiError) => {
        this.saving = false;
        this.snackBar.open(err.msg || 'Failed to add product', 'Close', {
          duration: 4000,
        });
      },
    });
  }

  updateProduct(id: number, product: ProductRequest): void {
    this.saving = true;

    this.productService.updateProduct(id, product).subscribe({
      next: () => {
        this.saving = false;
        this.dialog.closeAll();
        this.loadProducts();

        this.snackBar.open('Product updated successfully', 'Close', {
          duration: 3000,
        });
      },
      error: (err: ApiError) => {
        this.saving = false;
        this.snackBar.open(err.msg || 'Failed to update product', 'Close', {
          duration: 4000,
        });
      },
    });
  }

  deleteProduct(id: number): void {
    const dialogRef = this.dialog.open(this.deleteDialog, {
      width: '400px',
      maxWidth: 'calc(100vw - 32px)',
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) {
        return;
      }

      this.productService.deleteProduct(id).subscribe({
        next: () => {
          // If the current page has only one product, move back a page.
          if (this.products.length === 1 && this.pageIndex > 0) {
            this.pageIndex--;
          }

          this.loadProducts();

          this.snackBar.open('Product deleted successfully', 'Close', {
            duration: 3000,
          });
        },
        error: (err: ApiError) => {
          this.snackBar.open(err.msg || 'Failed to delete product', 'Close', {
            duration: 4000,
          });
        },
      });
    });
  }
}
