import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController, AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import moment from 'moment';


export class customValidator {
  static max(max: number) {
    return (control: FormGroup) => {
      // console.log('max' + (parseInt(control.value) <= max));

      let valid = parseInt(control.value) <= max;

      return valid ? null : {
        max: {
          valid: false,
          invalid: true
        }
      }
    }

  }
}

@Component({
  selector: 'page-add-record',
  templateUrl: 'add-record.html',
})

export class AddRecord {


  records; history: FirebaseListObservable<any>;
  price: any;
  private data: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public angFire: AngularFire, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public formBuilder: FormBuilder) {
    this.records = angFire.database.list('/usuarios');
    this.history = angFire.database.list("/history")
    this.price = this.navParams.get('price');
    var price = this.price;
    this.data = this.formBuilder.group({
      gender: ['', Validators.required],
      name: ['', Validators.required],
      birthdate: ['', Validators.required],
      parent: ['', Validators.required],
      contact: ['', Validators.required],
      staff: ['', Validators.required],
      description: [''],
      payment: ['', customValidator.max(price)],
      paymentstatus: [''],
      registrationdate: ['']
    });
    this.data.controls['staff'].setValue(window.localStorage.getItem("CurrentUser"));
    this.data.controls['registrationdate'].setValue(moment().format("DD/MM/YYYY"));
   



  }



  // record = {
  //   staff: '',
  //   description: '',
  //   payment: ''
  // };

  paymentStatus(): string {
    let control = Number(this.data.controls['payment'].value);
    let price = Number(this.price); 
    if (control == price) {
      return "paid";
    } else if (control > 0 && control < price) {
      return "pending";
    } else {
      return "unpaid";
    }

  }

  validate(): boolean {

    let control = this.data.controls['payment'];
    if (!control.value) {
      control.setValue(0);
    }
    if (this.data.valid) {
      return true
    }
    let errorMsg = '';
    if (!control.valid) {
      errorMsg = 'El monto máximo a ingresar debe ser $' + this.price;
    }

    let alert = this.alertCtrl.create({
      title: 'Algo anda mal!',
      subTitle: errorMsg || 'Los campos marcados *, son obligatorios',
      buttons: ['OK']
    })

    alert.present();

    return false;


  }

  submit(): void {

    if (this.validate()) {
       this.data.controls['paymentstatus'].setValue(this.paymentStatus());
       var dateFormated = moment(this.data.controls['birthdate'].value, 'YYYY-MM-DD').format('DD/MM/YYYY');
       this.data.controls['birthdate'].setValue(dateFormated);

      // saving data loader
      let loader = this.loadingCtrl.create({
        content: "Agregando ...",
      });

      //saving data action
      const pushRecord = this.records.push(this.data.value);
      loader.present();
      pushRecord
        .then(_ => loader.dismiss()
        )
        .then(_ => this.closeModal())
        .catch(err => console.log(err, 'You dont have access!'));

      const pushHistory  =  this.history.push({
        'status': 'update',
        'who': this.data.controls['staff'].value,
        'when': this.data.controls['registrationdate'].value

      })
    }
 

  }

  ionViewDidLoad() {

  }

  public closeModal() {
    this.viewCtrl.dismiss();
  }

}
