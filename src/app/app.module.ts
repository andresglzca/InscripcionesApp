import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';  
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { AddRecord } from '../pages/add-record/add-record';
import { LoginPage } from '../pages/login/login';
import { ShowRecordPage } from '../pages/show-record/show-record'
import { Popover } from '../components/popover/popover';

export const config = {
    apiKey: "AIzaSyB3jqHAJ-6qVsM56FHKHzQJBFknl9Ip8Gg",
    authDomain: "capernaum2k17-c0107.firebaseapp.com",
    databaseURL: "https://capernaum2k17-c0107.firebaseio.com",
    projectId: "capernaum2k17-c0107",
    storageBucket: "capernaum2k17-c0107.appspot.com",
    messagingSenderId: "801496423905"
}; 

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AddRecord,
    LoginPage,
    ShowRecordPage,
    Popover
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    AddRecord,
    LoginPage,
    ShowRecordPage,
    Popover
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
