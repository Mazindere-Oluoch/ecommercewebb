import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { UserStorageService } from '../../services/storage/userstorage.service';

const BASIC_URL = "http://localhost:8080"; 

@Injectable({
  providedIn: 'root'
})
export class AdminService {  

  constructor(private http: HttpClient,
    private userStorageService: UserStorageService) { }   

 
  

  //API to post the product

  addProduct(productDto:any): Observable<any>{
    return this.http.post(BASIC_URL + '/api/admin/product', productDto,{
      headers: this.createAuthorizationHeader(),
    })
  }

  //updating product details

  updateProduct(productId:any, productDto:any): Observable<any>{
    return this.http.put(BASIC_URL + `/api/admin/product/${productId}`, productDto,{
      headers: this.createAuthorizationHeader(),
    })
  }

    //all products
  getAllProducts():  Observable<any>{
    return this.http.get(BASIC_URL + '/api/admin/products',{
      headers: this.createAuthorizationHeader(),
    })
  }

  getProductById(productId):  Observable<any>{
    return this.http.get(BASIC_URL + `/api/admin/product/${productId}`,{
      headers: this.createAuthorizationHeader(),
    })
  }

 
  getAllProductsByName(name:any):  Observable<any>{
    return this.http.get(BASIC_URL + `/api/admin/search/${name}`,{
      headers: this.createAuthorizationHeader(),
    })
  }

  //calling the deleteProduct API from the back end
  deleteProduct(productId: any): Observable<any> {
    return this.http.delete(BASIC_URL + `/api/admin/product/${productId}`,{
    headers: this.createAuthorizationHeader(),
    })

  }

  //API to create a coupon

  addCoupon(couponDto:any): Observable<any>{
    return this.http.post(BASIC_URL + '/api/admin/coupons', couponDto,{
      headers: this.createAuthorizationHeader(),
    })
  }

  getCoupons(): Observable<any>{
    return this.http.get(BASIC_URL + '/api/admin/coupons', {
      headers: this.createAuthorizationHeader(),
    })
  }

  getPlacedOrders(): Observable<any>{
    return this.http.get(BASIC_URL + '/api/admin/placedOrders', {
      headers: this.createAuthorizationHeader(),
    })
  }

  changeOrderStatus(orderId: number, status:string): Observable<any>{
    return this.http.get(BASIC_URL + `/api/admin/order/${orderId}/${status}`, {
      headers: this.createAuthorizationHeader(),
    })
  }

  postFAQ(productId: number, faqDto:any): Observable<any>{
    return this.http.post(BASIC_URL + `/api/admin/faq/${productId}`, faqDto, {
      headers: this.createAuthorizationHeader(),
    })
  }
  

  private createAuthorizationHeader(): HttpHeaders {
    const token =this.userStorageService.getToken();
  
    // Check if token exists
    if (token) {
      return new HttpHeaders().set('Authorization', `Bearer ${token}`);
    } else {
      // Handle case where token is missing
      console.error("Token is missing. Unable to create authorization header.");
      return new HttpHeaders();
    }
  }





}
