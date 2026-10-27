import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  products: any[] = [];
  searchProductForm!: FormGroup;

  constructor(
     
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router:Router
  ){}

  ngOnInit(): void {
    this.getAllProducts();
    this.searchProductForm = this.fb.group({
      title: [null, [Validators.required]]
    });
  }

  getAllProducts(): void {
    // this.products = [];
    // this.adminService.getAllProducts().subscribe(
    //   (res) => {
    //     res.forEach(element => {
    //       element.processedImg = 'data:image/jpeg;base64,' + element.byteImg;
    //       this.products.push(element);
    //     });
    //   },
    //   (error) => {
    //     console.error('Error fetching products:', error);
    //     // Handle error, display error message, etc.
    //   }
    // );
  }

  submitForm(): void {
    // this.products = [];
    // const title = this.searchProductForm.get('title')!.value;
    // this.adminService.getAllProductsByName(title).subscribe(
    //   (res) => {
    //     res.forEach(element => {
    //       element.processedImg = 'data:image/jpeg;base64,' + element.byteImg;
    //       this.products.push(element);
    //     });
    //     console.log(this.products);
    //   },
    //   (error) => {
    //     console.error('Error searching products:', error);
    //     // Handle error, display error message, etc.
    //   }
    // );
  }

  deleteProduct(productId: any) {
    // this.adminService.deleteProduct(productId).subscribe(
    //   (res) => {      
    //     if (res.status === 200) {
    //       this.snackBar.open('Product deleted successfully!', 'Close', {
    //         duration: 5000
    //       });
    //       // Redirect to the product page
    //       this.router.navigateByUrl('/admin/product');
    //     } else {
    //       this.snackBar.open('Failed to delete product', 'ERROR', {
    //         duration: 5000,
    //         panelClass: 'error-snackbar'
    //       });
    //     }
    //   },
    //   (error) => {
    //     console.error('Error deleting product:', error);
    //     this.snackBar.open('An error occurred while deleting the product', 'ERROR', {
    //       duration: 5000,
    //       panelClass: 'error-snackbar'
    //     });
    //   }
    // );
  }
  
  }
      
    
  

