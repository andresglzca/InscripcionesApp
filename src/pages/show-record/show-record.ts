import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import moment from 'moment';

/**
 * Generated class for the ShowRecord page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-show-record',
  templateUrl: 'show-record.html',
})
export class ShowRecordPage {

  record: FirebaseListObservable<any>;
 

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public angFire: AngularFire) {
    this.record = angFire.database.list('/usuarios');
    
  }
  section: string =  "record-info";
  age; paymentbadge: any;

  ionViewDidLoad() {
    
    var keyRecordToShow = this.navParams.get('keyRecord');

    this.record = this.angFire.database.list('/usuarios', {
      query: {
        orderByKey: true,
        equalTo: keyRecordToShow
      }
    });
    
    this.record.subscribe(items => {
      var birthdate = items[0].birthdate;
      this.age = moment().diff(moment(birthdate, "DD/MM/YYYY"), 'years');
      var paymentstatus = items[0].paymentstatus;
      if (paymentstatus === "unpaid"){
        this.paymentbadge = "Sin Anticipo";
      }else if (paymentstatus === "paid"){
        this.paymentbadge = "Pagado";
      }else{
        var payment = items[0].payment;
        var price = this.navParams.get('price');
        var debt = price - payment; 
        this.paymentbadge = "$"+debt;
      }
    });
  }
}
