import { Component } from '@angular/core';
import { NavController, ModalController, ToastController, AlertController, PopoverController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { AddRecord } from '../add-record/add-record';
import { ShowRecordPage } from '../show-record/show-record';
import { Popover } from '../../components/popover/popover';
import * as firebase from 'firebase';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  records; settings; history: FirebaseListObservable<any>;
  price; offertDiscount: number;
  paymenStatus; recordname: any;


  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public angFire: AngularFire, public toastCtrl: ToastController, public alertCtrl: AlertController, public popoverCtrl: PopoverController) {
    this.records = angFire.database.list("/usuarios");
    this.settings = angFire.database.list("/settings");
    this.history = angFire.database.list("/history")

    this.settings.subscribe(config => {
      this.price = config[0].price;
      this.offertDiscount = config[0].offertDiscount;
    });


  }

  popOver(ev) {
    let popover = this.popoverCtrl.create(Popover, {

    });
    popover.present({
      ev: ev
    });

  }



  public checkPayment(data, price) {
    if (data == price) {
      this.paymenStatus = "paid";
    } else if (data > 0 && data < price) {
      this.paymenStatus = "pending";
    } else {
      this.paymenStatus = "unpaid";
    }
    return this.paymenStatus
  }



  showRecordPage(key: string) {
    let data = {
      price: this.price,
      keyRecord: key
    }
    this.navCtrl.push(ShowRecordPage, data)
  }

  addRecord() {
    let settings = {
      price: this.price,
      offertDiscount: this.offertDiscount
    }
    let modal = this.modalCtrl.create(AddRecord, settings);
    modal.present();
  }

  deleteRecord(key, name) {
    let confirm = this.alertCtrl.create({
      title: 'Eliminar campero',
      message: name + ' sera elimnado',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            confirm.dismiss();
          }
        },
        {
          text: 'OK',
          handler: () => {
            this.records.remove(key);
            confirm.dismiss();
            const toast = this.toastCtrl.create({
              message: 'El campero ha sido elimanado ☹',
              showCloseButton: true,
              closeButtonText: 'Ok',
              position: 'top'
            });
            toast.present();
          }
        }
      ]
    })
    confirm.present();
  }

  addPayment(key, payment: number) {
    var price = +this.price;
    payment = +payment;
    var debt = price - payment;
    if (payment >= 0 && payment < price) {
      let addpay = this.alertCtrl.create({
        title: 'Agregar pago',
        message: 'Restan por pagar: $' + debt,
        inputs: [{
          name: 'cantidad',
          placeholder: 'Cantidad'
        }],
        buttons: [{
          text: 'Cancelar',
          handler: data => {
            addpay.dismiss();
          }
        }, {
          text: 'Agregar',
          handler: data => {

            var cantidad = +data.cantidad;

            if (cantidad <= debt) {
              var newpayment = cantidad + payment;
              this.records.update(key, {
                payment: newpayment,
                paymentstatus: this.checkPayment(newpayment, price)
              })
                .then(_ => addpay.dismiss())
                .catch(err => console.log(err));
            } else {
              const err = this.toastCtrl.create({
                message: 'Error: La cantidad que ingresaste es invalida.',
                showCloseButton: true,
                closeButtonText: 'Ok',
                position: 'top'
              });
              err.present();
            }
          }
        }]
      })
      addpay.present();
    } else {
      let alert = this.alertCtrl.create({
        title: 'Hey!',
        subTitle: 'Al parecer los pagos estan completos',
        buttons: ['OK']
      });
      alert.present();

    }
  }

  ionViewDidLoad() {
  

    
  }


}
