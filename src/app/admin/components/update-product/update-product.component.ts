import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../../admin/service/category.service';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.scss']
})
export class UpdateProductComponent {

  productId = this.activatedroute.snapshot.params['productId'];

  productForm: FormGroup;  // Variable for productForm
  listOfCategories: any[] = []; // Variable to store list of category from the backend
  selectedFile: File | null;   // Storing the selected file
  imagePreview: string | ArrayBuffer | null;

  existingImage:string | null=null;

  //variable to check if the user updated the image or not
  imgChanged =false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private categoryService: CategoryService,
    private activatedroute:ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      categoryId: [null, [Validators.required]],
      name: [null, [Validators.required]],
      price: [null, [Validators.required]],
      description: [null, [Validators.required]],
    });

    // this.getAllCategories();
    // this.getProductbyId(); 
  }

  // getAllCategories() { 
  //   this.categoryService.getAllCategories
  //     res => {
  //       this.listOfCategories = res; // Assuming that the response directly provides an array of categories
  //     })
  //   }

  //   getProductbyId(){
  //     this.categoryService.getProductById(this.productId).subscribe(res =>{
  //       this.productForm.patchValue(res);
  //       this.existingImage='data:image/jpeg;base64,' + res.byteImg;
  //     })
  //   }
   

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.previewImage();
    this.imgChanged=true;

    this.existingImage=null;


  }

  previewImage() {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(this.selectedFile);
  }

  updateProduct(): void {
    if (this.productForm.valid) {
      const formData: FormData = new FormData();

      if(this.imgChanged && this.selectedFile){
        formData.append('img', this.selectedFile);
      }

      formData.append('categoryId', this.productForm.get('categoryId').value);
      formData.append('name', this.productForm.get('name').value);
      formData.append('description', this.productForm.get('description').value);
      formData.append('price', this.productForm.get('price').value);

      // this.adminService.updateProduct(this.productId,formData).subscribe(
      //   (res) => {
      //     if (res.id != null) {
      //       this.snackBar.open('Product updated successfully!', 'Close', {
      //         duration: 5000
      //       });
      //       this.router.navigateByUrl('/admin/dashboard');
      //     } else {
      //       this.snackBar.open(res.message, 'ERROR', {
      //         duration: 5000
      //       });
      //     }
      //   },
      //   (error) => {
      //     console.error('Error adding product:', error); // Log any errors to the console
      //     this.snackBar.open('Error adding product!', 'ERROR', {
      //       duration: 5000
      //     });
      //   }
      // );
    } else {
      for (const i in this.productForm.controls) {
        if (this.productForm.controls.hasOwnProperty(i)) {
          this.productForm.controls[i].markAsDirty();
          this.productForm.controls[i].updateValueAndValidity();
        }
      }
    }
  }
}
