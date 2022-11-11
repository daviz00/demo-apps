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

  getAppSecretMap = {
    url: `https://your.domain.com/getAppSecret`,
    response: {},
  };

  getUserDetailsMap: any = {
    url: `${this.baseUrl}/userdata`,
    data: {
      token: this.getURLParameter('token'),
    },
    response: {},
  };

  //Constructor
  constructor(private http: HttpClient) {}

  //Functions
  getApiCall(apiDetails: any) {
    return this.http.get(apiDetails.url, {
      headers: {
        ...this.headers,
        ...(apiDetails.headers && { ...apiDetails.headers }),
      },
    });
  }

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
      this.getAppSecret();
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

  getAppSecret() {
    const apiCall = this.getApiCall(this.getAppSecretMap);
    apiCall.subscribe((data: any) => {
      this.getUserDetails(data.appSecret);
    });
  }

  getUserDetails(appSecret: string) {
    const apiCall = this.postApiCall({
      ...this.getUserDetailsMap,
      headers: {
        appSecret,
      },
    });
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
