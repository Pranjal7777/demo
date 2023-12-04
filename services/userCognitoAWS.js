import {
    get
  } from "../lib/request";
  
  // get banner
  export const getCognitoToken = () => {
    return get("/cognitoToken");
  };
