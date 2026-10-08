import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AdminService } from '../../service/admin.service';

@Component({
  selector: 'app-post-product',
  templateUrl: './post-product.component.html',
  styleUrls: ['./post-product.component.scss']
})
export class PostProductComponent implements OnInit {

  productForm: FormGroup;  // Variable for productForm
  listOfCategories: any[] = []; // Variable to store list of category from the backend
  selectedFile: File | null;   // Storing the selected file
  imagePreview: string | ArrayBuffer | null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      categoryId: [null, [Validators.required]],
      name: [null, [Validators.required]],
      price: [null, [Validators.required]],
      description: [null, [Validators.required]],
    });

    // this.getAllCategories();  //backend API to call all categories and show in the dropdown
  }

  // getAllCategories() {
  //   this.adminService.getAllCategories().subscribe(
  //     (res) => {
  //       this.listOfCategories = res; // Assuming that the response directly provides an array of categories
  //     },
  //     //(error) => {
  //    //   console.error('Error fetching categories:', error); // Log any errors to the console
  //   //  }
  //   );
  // }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];  //calling the first image
    this.previewImage();
  }

  previewImage() {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    }; 
    reader.readAsDataURL(this.selectedFile);
  }

  addProduct(): void {
    if (this.productForm.valid) {
      const formData: FormData = new FormData();
      formData.append('img', this.selectedFile);      
      formData.append('categoryId', this.productForm.get('categoryId').value);
      formData.append('name', this.productForm.get('name').value);
      formData.append('description', this.productForm.get('description').value);
      formData.append('price', this.productForm.get('price').value);

      this.adminService.addProduct(formData).subscribe(
        (res) => {
          if (res.id != null) {
            this.snackBar.open('Product posted successfully!', 'Close', {
              duration: 5000
            });
            this.router.navigateByUrl('/admin/dashboard');
          } else {
            this.snackBar.open(res.message, 'ERROR', {
              duration: 5000
            });
          }
        })
        
    } else {
      for (const i in this.productForm.controls) {
      //  if (this.productForm.controls.hasOwnProperty(i)) {
          this.productForm.controls[i].markAsDirty();
          this.productForm.controls[i].updateValueAndValidity();
        }
      }
    }
  }

