import { Component } from '@angular/core';
import otplessSdk from 'otpless-test/dist';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  //Constants
  appId = 'OTPLess:NPMVXHQQAZBBNOXLWIIDTSLPWTABFXQY';
  token = '';
  sdkIntance: any;
  getIntent: any;

  //Functions
  ngOnInit() {
    this.sdkIntance = otplessSdk({
      appId: 'OTPLess:VHJMCSOXWSLTZBEMPOFRDAPPYSBFGXSE',
      enableErrorLogging: true,
    });
    let UrlToken = this.sdkIntance.getToken();
    this.token = UrlToken ?? '';
  }

  initiateLogin() {
    this.getIntent = this.sdkIntance.getIntent({
      redirectionURL: 'http://localhost:4200',
    });
    return this.getIntent();
  }
}
