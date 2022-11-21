import React, { useEffect, useState } from "react";
import WhatsappIcon from "./whatsapp.svg";
import "./App.scss";
import otplessSdk from "otpless-js-sdk";

const App = () => {
  //Constants
  let sdkIntance: any;
  let getIntent: any;
  const [token, setToken] = useState("");

  //useEffects
  useEffect(() => {
    sdkIntance = otplessSdk({
      appId: "OTPLess:VHJMCSOXWSLTZBEMPOFRDAPPYSBFGXSE",
      enableErrorLogging: true,
    });
    let UrlToken = sdkIntance.getToken();
    UrlToken && setToken(UrlToken);
  }, []);

  //Functions
  const initiateLogin = () => {
    getIntent = sdkIntance.createGetIntentOnClick({
      redirectionURL: "http://localhost:3000",
    });
    return getIntent();
  };

  return (
    <main className="flex algn-cntr jstfy-cntr">
      <button
        className="login-with-whatsapp-button"
        onClick={() => initiateLogin()}
      >
        <div className="flex algn-cntr">
          <img src={WhatsappIcon} />
          <p>Login With Whatsapp</p>
        </div>
      </button>
      {token && (
        <p className="token">
          Your Token: <span>{token}</span>
        </p>
      )}
    </main>
  );
};

export default App;
