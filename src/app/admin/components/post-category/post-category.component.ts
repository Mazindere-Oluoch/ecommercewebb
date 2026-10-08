import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Category, CategoryRequest } from '../../../models/admin.model';
import { CategoryService } from '../../../admin/service/category.service';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-post-category',
  templateUrl: './post-category.component.html',
  styleUrls: ['./post-category.component.scss'],
})
export class PostCategoryComponent implements OnInit {
  categories: Category[] = [];
  loading = false;

  displayedColumns: string[] = ['serialNumber', 'categoryName', 'categoryDescription', 'actions'];

  categoryForm: FormGroup;

  // null = Add
  // category = Edit
  selectedCategory: Category | null = null;

  @ViewChild('categoryDialog') //@ViewChild-lets TS code access sth from the template
  categoryDialog!: TemplateRef<any>;

  @ViewChild('tabs')
  tabs!: MatTabGroup;

  @ViewChild('deleteDialog')
  deleteDialog!: TemplateRef<any>;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {
    this.categoryForm = this.fb.group({
      categoryName: ['', Validators.required],
      categoryDescription: [''],
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  onTabChange(index: number): void {
    if (index === 1) {
      this.openAddDialog();
    }
  }

  loadCategories(): void {
    this.loading = true;

    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;

        this.snackBar.open(error.error?.message || 'Failed to load categories', 'Close', {
          duration: 4000,
        });
      },
    });
  }

  openAddDialog(): void {
    this.selectedCategory = null;

    this.categoryForm.reset({
      categoryName: '',
      categoryDescription: '',
    });

    this.dialog.open(this.categoryDialog, {
      width: '500px',
    });
  }

  openEditDialog(category: Category): void {
    this.selectedCategory = category;

    this.categoryForm.patchValue({
      categoryName: category.categoryName,
      categoryDescription: category.categoryDescription || '',
    });

    this.dialog.open(this.categoryDialog, {
      width: '500px',
    });
  }

  saveCategory(): void {
    //checks whether i'm creating or updating
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const category: CategoryRequest = {
      categoryName: this.categoryForm.value.categoryName,
      categoryDescription: this.categoryForm.value.categoryDescription || null,
    };

    const selected = this.selectedCategory;

    if (selected) {
      this.updateCategory(selected.id, category);
    } else {
      this.addCategory(category);
    }
  }

  addCategory(category: CategoryRequest): void {
    this.categoryService.addCategory(category).subscribe({
      next: (createdCategory) => {
        this.categories = [...this.categories, createdCategory];
        this.dialog.closeAll();
        this.tabs.selectedIndex = 0;
        this.snackBar.open('Category added successfully', 'Close', { duration: 3000 });
      },

      error: (error) => {
        this.snackBar.open(error.error?.message || 'Failed to add category', 'Close', {
          duration: 4000,
        });
      },
    });
  }

  updateCategory(id: number, category: CategoryRequest): void {
    this.categoryService.updateCategory(id, category).subscribe({
      next: (updatedCategory) => {
        this.categories = this.categories.map((category) =>
          category.id === id ? updatedCategory : category,
        );

        this.dialog.closeAll();

        this.snackBar.open('Category updated successfully', 'Close', { duration: 3000 });
      },

      error: (error) => {
        this.snackBar.open(error.error?.message || 'Failed to update category', 'Close', {
          duration: 4000,
        });
      },
    });
  }

  deleteCategory(id: number): void {
    const dialogRef = this.dialog.open(this.deleteDialog, {
      width: '400px',
    });
    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) {
        return;
      }

      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.categories = this.categories.filter((category) => category.id !== id);

          this.snackBar.open('Category deleted successfully', 'Close', { duration: 3000 });
        },

        error: (error) => {
          this.snackBar.open(error.error?.message || 'Failed to delete category', 'Close', {
            duration: 4000,
          });
        },
      });
    });
  }
}
