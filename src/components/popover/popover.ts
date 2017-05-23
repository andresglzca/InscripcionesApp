import { Component } from '@angular/core';
import { NavController  } from 'ionic-angular';
import { LoginPage } from '../../pages/login/login';

/**
 * Generated class for the Popover component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'popover',
  templateUrl: 'popover.html'
})
export class Popover {

  text: string;

  constructor(public navCtrl: NavController) {
    console.log('Hello Popover Component');
    this.text = 'Hello World';
  }

  logout(){
    window.localStorage.removeItem('CurrentUser');
    this.navCtrl.push(LoginPage)
  }

}
