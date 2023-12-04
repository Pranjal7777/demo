import { APP_NAME, BASE_PATH, FCM_CHAT_TOPIC, FCM_TOPIC, FIREBASE, WEB_LINK } from "../config/creds";

const firebaseCloudMessaging = {
  //checking whether token is available in indexed DB
  tokenInlocalforage: async () => {
    const status = await Notification.requestPermission();
    if (status && status === "granted") {
      // notification.next();
      return localStorage.getItem("fcm_token");
    }
  },
  //initializing firebase app
  init: async function (firebase) {
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyDt5_-C-HxrXYOfbrJgzr92rTDx5LWElpk",
        authDomain: "bombshell-creators.firebaseapp.com",
        projectId: "bombshell-creators",
        storageBucket: "bombshell-creators.appspot.com",
        messagingSenderId: "590929488023",
        appId: "1:590929488023:web:c80138f986f3e19af8e1d2",
        measurementId: "G-LDZ6HMED0Q"
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
            localStorage.setItem("fcm_token", fcm_token);
            // console.log("fcm fcm_token", fcm_token);
            //return the FCM fcm_token after saving it
            return fcm_token;
          }
        }
      } catch (error) {
        console.log("fcm token", error);
        console.error(error);
        return null;
      }
    }
  },
};

export async function setToken(topics) {
  try {
    (await import("firebase/messaging"))
    const firebase = (await import("firebase/app"))

    // topic = topic || (await localStorage.getItem(FCM_TOPIC));
    const token = await firebaseCloudMessaging.init(firebase);

    if (token) {
      const topicsPromise = topics.map(topic => subscribeTokenToTopic(token, topic))
      // console.log("sadasdsadasd", token);
      getMessage(firebase);
      // console.log("paylod", {});
    }
  } catch (error) {
    console.error("shubhhbbh", error);
  }
}

function getMessage(firebase) {
  const messaging = firebase.messaging();
  messaging.onMessage((paylod) => {
    let { notification, title, data = {} } = paylod;
    let metaData = {};
    notification.icon =
      `${BASE_PATH}/images/app_icons/icon-128x128.png`;
    notification.badge =
      `${BASE_PATH}/images/app_icons/icon-128x128.png`;
    navigator?.serviceWorker?.ready?.then((registration) => {
      registration.showNotification(notification.title || APP_NAME, notification);
    })?.catch(err => console.log('error while pushing notifications using sw - ', err));
  });
}

export const unsubscibeFCMTopic = async () => {
  let topic = localStorage.getItem("fcm_topic");
  let chat_topic = localStorage.getItem(FCM_CHAT_TOPIC);
  let token = localStorage.getItem("fcm_token");
  unsubscibeFCMTopicReq(token, topic)
  unsubscibeFCMTopicReq(token, chat_topic)
};

const unsubscibeFCMTopicReq = (token, topic) => {
  try {
    fetch(
      "https://iid.googleapis.com/iid/v1/" + token + "/rel/topics/" + topic,
      {
        method: "DELETE",
        headers: new Headers({
          Authorization: "key=" + FIREBASE,
        }),
      }
    )
      .then((response) => {
        if (response.status < 200 || response.status >= 400) {
          return;
        }

        localStorage.removeItem("fcm_topic");
        localStorage.removeItem("fcm_token");
        // console.log("unSubscribed to", topic);
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (e) { }
}

function subscribeTokenToTopic(token, topic) {
  try {
    fetch(
      "https://iid.googleapis.com/iid/v1/" + token + "/rel/topics/" + topic,
      {
        method: "POST",
        headers: new Headers({
          Authorization: "key=" + FIREBASE,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // console.log("asdasd", data);
      })
      .catch((error) => {
        console.error("Subscribed to", error);
      });
  } catch (e) { }
}

export const sendNotifications = (receverId, title, desc, body, metaData) => {

  let url = "";
  if (metaData.isExchange) {
    url = metaData.isBuyer
      ? `${WEB_LINK}/profile?type=message&p=exchange-recived&ut=user&ct=${metaData.chatId}`
      : `${WEB_LINK}/profile?type=message&p=exchanage-send&ut=user&ct=${metaData.chatId}`;
  } else {
    url = metaData.isBuyer
      ? `${WEB_LINK}/profile?type=message&p=sales-message&ut=user&ct=${metaData.chatId}`
      : `${WEB_LINK}/profile?type=message&p=shopping-message&ut=user&ct=${metaData.chatId}`;
  }
  fetch("https://fcm.googleapis.com/fcm/send", {
    method: "POST",

    headers: new Headers({
      "Content-Type": "application/json",
      Authorization:
        "key=" +
        FIREBASE,
    }),
    body: JSON.stringify({
      condition: "'" + receverId + "' in topics",
      notification: {
        image: metaData.image,
        body: desc,
        sound: "default",
        title: title,
        icon: "/notification-icon.png",
        click_action: url,
      },
      priority: "high",
      data: body,
    }),
  })
    .then((data) => data.json())
    .then((data) => {
      // console.log("send notificationss", data);
    })
    .catch("notification send faild");
};
