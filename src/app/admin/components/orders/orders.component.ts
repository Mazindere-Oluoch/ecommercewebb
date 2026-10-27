import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent {

  //variable to hold the orders

  orders: any;

  constructor(
    private snackBar: MatSnackBar){

    }

    ngOnInit(){
      this.getPlacedOrders();
    }

    getPlacedOrders(){
     

    }

    changeOrderStatus(orderId: number, status:string){
     
    }

}
