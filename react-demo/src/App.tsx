import React, { useEffect, useState } from "react";
import WhatsappIcon from "./whatsapp.svg";
import "./App.scss";

const App = () => {
  //Global Functions
  const getURLParameter = (
    paramName: string,
    URLString = window.location.href
  ) => {
    var regex = new RegExp("[\\?&]" + paramName + "=([^&#]*)");
    var results = regex.exec(URLString);

    if (results && results.length > 0) {
      return decodeURIComponent(results[1].replace(/\+/g, " "));
    } else {
      return "";
    }
  };

  //Constants
  const appId = "OTPLess:VHJMCSOXWSLTZBEMPOFRDAPPYSBFGXSE";
  const appSecret =
    "nkE2AmDN1abSHuq3vO9y8ltTBC5p3JgNk6WGS3rK8Fk8qvrO8dN8WMQjWRWamcOam";
  const headers = { "Content-Type": "application/json", appId: appId };
  const baseUrl = "https://api.otpless.app/v1/client/user/session";
  const [sessionVerified, setSessionVerified] = useState(false);

  //Api Maps
  const initiateLoginMap = {
    url: `${baseUrl}/initiate`,
    data: {
      loginMethod: "WHATSAPP",
      redirectionURL: "http://localhost:3001",
    },
    response: {},
  };

  const getUserDetailsMap: any = {
    url: `${baseUrl}/userdata`,
    data: {
      token: getURLParameter("token"),
    },
    headers: {
      appSecret: appSecret,
    },
    response: {},
  };

  //useEffects
  useEffect(() => {
    if (getURLParameter("token")) {
      localStorage.setItem("token", getURLParameter("token"));
      getUserDetails();
    }
  }, []);

  //Functions
  const postApiCall = async (apiDetails: any) => {
    return await fetch(apiDetails.url, {
      method: "POST",
      headers: {
        ...headers,
        ...(apiDetails.headers && { ...apiDetails.headers }),
      },
      body: JSON.stringify(apiDetails.data),
    }).then((response) => response.json());
  };

  const resetSession = () => {
    setSessionVerified(false);
  };

  const initiateLogin = () => {
    const apiCall = postApiCall(initiateLoginMap);
    apiCall.then((data: any) => {
      window.location.assign(data.data.intent);
    });
  };

  const getUserDetails = () => {
    const apiCall = postApiCall(getUserDetailsMap);
    apiCall.then((data: any) => {
      window.history.pushState({}, document.title, "/");
      const details = data.data;
      if (details.stateMatched) {
        setSessionVerified(true);
        getUserDetailsMap.response = details;
        console.log({
          getUserDetailsMap,
        });
      }
    });
  };

  return (
    <main className="flex algn-cntr jstfy-cntr">
      {sessionVerified ? (
        <div className="response flex algn-cntr jstfy-cntr">
          <p className="success">Your Session has been verified</p>
          <div className="details">
            <p>
              Name: <span>{getUserDetailsMap.response.name ?? "Mickey"}</span>
            </p>
            <p>
              Mobile:
              <span>{getUserDetailsMap.response.mobile ?? "898099455"}</span>
            </p>
          </div>
          <button onClick={() => resetSession()}>Reset</button>
        </div>
      ) : (
        <button
          className="login-with-whatsapp-button"
          onClick={() => initiateLogin()}
        >
          <div className="flex algn-cntr">
            <img src={WhatsappIcon} />
            <p>Login With Whatsapp</p>
          </div>
        </button>
      )}
    </main>
  );
};

export default App;
