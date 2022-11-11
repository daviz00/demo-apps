import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  //Global Functions
  getURLParameter = (paramName: string, URLString = window.location.href) => {
    var regex = new RegExp('[\\?&]' + paramName + '=([^&#]*)');
    var results = regex.exec(URLString);

    if (results && results.length > 0) {
      return decodeURIComponent(results[1].replace(/\+/g, ' '));
    } else {
      return '';
    }
  };

  //Constants
  appId = 'OTPLess:NPMVXHQQAZBBNOXLWIIDTSLPWTABFXQY';
  appSecret =
    'XX0EEFehShuoGsDjVAfVFhgQvz2UdyjLI8zoqHQx6MSQhPayH72b3q2ihBFtssFeB';
  headers = { 'Content-Type': 'application/json', appId: this.appId };
  baseUrl = 'https://api.otpless.app/v1/client/user/session';
  sessionVerified = false;

  //Api Maps
  initiateLoginMap = {
    url: `${this.baseUrl}/initiate`,
    data: {
      loginMethod: 'WHATSAPP',
      redirectionURL: 'http://localhost:4200',
    },
    response: {},
  };

  getUserDetailsMap: any = {
    url: `${this.baseUrl}/userdata`,
    data: {
      token: this.getURLParameter('token'),
    },
    headers: {
      appSecret: this.appSecret,
    },
    response: {},
  };

  //Constructor
  constructor(private http: HttpClient) {}

  //Functions
  postApiCall(apiDetails: any) {
    return this.http.post(apiDetails.url, apiDetails.data, {
      headers: {
        ...this.headers,
        ...(apiDetails.headers && { ...apiDetails.headers }),
      },
    });
  }

  ngOnInit() {
    if (this.getURLParameter('token')) {
      localStorage.setItem('token', this.getURLParameter('token'));
      this.getUserDetails();
    }
  }

  resetSession() {
    this.sessionVerified = false;
  }

  initiateLogin() {
    const apiCall = this.postApiCall(this.initiateLoginMap);
    apiCall.subscribe((data: any) => {
      window.location.assign(data.data.intent);
    });
  }

  getUserDetails() {
    const apiCall = this.postApiCall(this.getUserDetailsMap);
    apiCall.subscribe((data: any) => {
      window.history.pushState({}, document.title, '/');
      const details = data.data;
      if (details.stateMatched) {
        this.sessionVerified = true;
        this.getUserDetailsMap.response = details;
        console.log({
          getUserDetailsMap: this.getUserDetailsMap,
        });
      }
    });
  }
}
