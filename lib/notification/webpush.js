import "firebase/messaging";
import firebase from "firebase/app";
import localforage from "localforage";
// import { notification } from "../rxSubject";
const firebaseCloudMessaging = {
  //checking whether token is available in indexed DB
  tokenInlocalforage: async () => {
    const status = await Notification.requestPermission();
    if (status && status === "granted") {
      // notification.next();
      return localforage.getItem("fcm_token");
    }
  },
  //initializing firebase app
  init: async function () {
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyAEg8F0ylDtm4KySq5WTtqwVdk-2fR8Xbw",
        authDomain: "juicy-network.firebaseapp.com",
        projectId: "juicy-network",
        storageBucket: "juicy-network.appspot.com",
        messagingSenderId: "190797333067",
        appId: "1:190797333067:web:0581161fec5ef719d543ce",
        measurementId: "G-3FSTBLCJ66"
      });
      ``;
      try {
        const messaging = firebase.messaging();
        const tokenInLocalForage = await this.tokenInlocalforage();
        //if FCM token is already there just return the token
        if (tokenInLocalForage !== null) {
          return tokenInLocalForage;
        }
        //requesting notification permission from browser
        const status = await Notification.requestPermission();

        // console.log("fcm token", status);
        if (status && status === "granted") {
          // notification.next();
          //getting token from FCM

          const fcm_token = await messaging.getToken();
          if (fcm_token) {
            //setting FCM token in indexed db using localforage
            localforage.setItem("fcm_token", fcm_token);
            // console.log("fcm fcm_token", fcm_token);
            //return the FCM fcm_token after saving it
            return fcm_token;
          }
        }
      } catch (error) {
        // console.log("fcm token", error);
        console.error(error);
        return null;
      }
    }
  },
};
export { firebaseCloudMessaging };
