import { Component } from '@angular/core';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.scss']
})
export class CouponsComponent {

  coupons: any;

  constructor(){}

  ngOnInit(){

    this.getCoupons();

  }
  
getCoupons(){
}
}