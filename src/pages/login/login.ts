import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { AuthProviders, AuthMethods, AngularFire } from 'angularfire2';
import { HomePage } from '../home/home';
/**
 * Generated class for the Login page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public angfire: AngularFire, public toastCtrl: ToastController, public loadingCtrl: LoadingController) {

  }

  public showToastWithCloseButton(error) {
    const toast = this.toastCtrl.create({
      message: error,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  };

  public currentSession() {
    var currentUser = window.localStorage.getItem("CurrentUser");
    console.log(currentUser);
    if (currentUser) {
      this.showToastWithCloseButton(currentUser);
      return true;
    } else {
      this.showToastWithCloseButton("no hay nada");
      return false;
    }
  }
  email: string;
  password: string;

  login() {
    let loader = this.loadingCtrl.create({
      content: "Cargando..."
    });
    if (this.email && this.password) {
      loader.present();
      this.angfire.auth.login({
        email: this.email,
        password: this.password
      }, {
          provider: AuthProviders.Password,
          method: AuthMethods.Password
        }).then((response) => {
          this.navCtrl.setRoot(HomePage);
          var CurrentUser = response.auth.email;
          loader.dismiss();
          window.localStorage.setItem('CurrentUser', CurrentUser);
        }).catch((error) => {
          this.showToastWithCloseButton(error);
          loader.dismiss();
        })
    } else {
      const error = "Debe ingrese sus datos para inicar sesión";
      this.showToastWithCloseButton(error);

    }
  };



  ionViewDidLoad() {
    console.log('ionViewDidLoad Login');
  }

  ionViewCanEnter(): boolean {
    var currentUser = window.localStorage.getItem("CurrentUser");
    if (currentUser === null) {
      return true;
    } else {
      this.navCtrl.setRoot(HomePage, currentUser);
      return false;
    }
  }
}
