import { Component, OnInit, AfterViewInit, OnChanges , Directive } from '@angular/core';
import { NgForm} from '@angular/forms';
import { BitcoinService } from '../services/bitcoin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from '../models/order';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})

export class FormComponent implements OnInit, AfterViewInit, OnChanges {
  orderTypeDefault = "Buy";
  validAge = true;
  genderField: string;
  genderList: string[] = ['Male', 'Female'];
  tomorrow= new Date();

  constructor(private bitcoinSvc: BitcoinService, private activatedRoute: ActivatedRoute, 
    private router: Router) { }

  ngAfterViewInit(){
    
  }
  
  ngOnChanges(){

  }

  ngOnInit() {
    console.log("FORM !!!!");
    this.orderTypeDefault = this.activatedRoute.snapshot.params.orderType;
    console.log(this.orderTypeDefault);
    this.bitcoinSvc.getPrice()
    .then(result => {
      this.myPrice = result.BTCSGD.ask; //initial load will get ask because default order type is buy
      })
    .catch(error=>{
      console.log(error);
    });
  }

  processForm(f:NgForm, myPrice, myAmt){
    console.log("processForm !");
    let x = this.bitcoinSvc.saveOrderDetails(f.value, myPrice, myAmt).then(result=>{
      console.log(result);
      this.router.navigate(['/confirm', result.id]);
    });
    
  }

  checkAgeValid(dob){

    let myDob = new Date (dob);
    var ageDifMs = Date.now() - myDob.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    let myAge = Math.abs(ageDate.getUTCFullYear() - 1970);
    console.log("myAge=" , myAge);
    if (myAge<21){
      this.validAge = false;
    }
    else{
      this.validAge = true;
    }
    console.log(this.validAge);
  }
  buy = true;
  myPrice = 0;
  checkBuyOrSell(f: string){
    console.log("f=", f);
    if (f == "Buy"){
      this.buy = true;
    }
    else if (f == "Sell"){
      this.buy = false;
    }
  }

  myAmt:string = '0.00';
  recalcMyAmt(buyOrSell, unit:number){
    console.log("buyOrSell =", buyOrSell);
    this.bitcoinSvc.getPrice()
    .then(result => {
      if (buyOrSell == "Buy"){
        this.myPrice = result.BTCSGD.ask;
      }
      else if (buyOrSell == "Sell"){
        this.myPrice = result.BTCSGD.bid;
      }
      else {
        this.myPrice = 0;
      }
    })
    .catch(error=>{
      console.log(error);
    });

    console.log("recalculating myAmt");
    if ( isNaN(unit) || isNaN(this.myPrice) ){
      this.myAmt = '0.00';     
    }
    else {
      let sum = unit*this.myPrice;
      this.myAmt = sum.toFixed(2);
    }
    console.log(this.myAmt);
  }

}
