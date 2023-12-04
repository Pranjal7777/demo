importScripts("https://www.gstatic.com/firebasejs/7.18.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/7.18.0/firebase-messaging.js"
);
firebase.initializeApp({
  apiKey: "AIzaSyDt5_-C-HxrXYOfbrJgzr92rTDx5LWElpk",
  authDomain: "bombshell-creators.firebaseapp.com",
  projectId: "bombshell-creators",
  storageBucket: "bombshell-creators.appspot.com",
  messagingSenderId: "590929488023",
  appId: "1:590929488023:web:c80138f986f3e19af8e1d2",
  measurementId: "G-LDZ6HMED0Q"

});

const getNotifyUrl = (item = {}) => {
  switch (Number(item?.notifyType)) {
    case 1:
    case 2:
    case 6:
    case 46:
      return (`/post/${JSON.parse(item.metaData?.replace(/'/g, "\""))?.assetId || JSON.parse(item.metaData?.replace(/'/g, "\""))?.id}`);

    case 0:
      return (`/live/popular`);

    case 3:
      if (JSON.parse(item.metaData?.replace(/'/g, "\"")).userTypeCode === 2) {
        return (`/${JSON.parse(item.metaData?.replace(/'/g, "\""))?.userName} `);
      }

    case 13:
      return "/";
    case 41:
      return (`/post/${JSON.parse(item.metaData?.replace(/'/g, "\""))?.postId}`)
    case 49:
      return (`/post/${JSON.parse(item.metaData?.replace(/'/g, "\""))?.postId}?commentId=${JSON.parse(item.metaData?.replace(/'/g, "\""))?.commentId}`)
    case 43:
    case 44:
      return Router.push(`/chat?uid=${JSON.parse(item.metaData?.replace(/'/g, "\""))?.userId}`)

    case 14:
    case 15:
    case 25:
    case 26:
    case 27:
    case 28:
      return

    case 35:
    case 45:
    case 12:
    case 42:
    case 16:
      return ('/wallet');

    case 36:
      return ('/my-orders');

    case 37:
    case 38:
    case 39:
      return (`/virtual-request`);

    case 40:
      if (item?.userType == 1) {
        return ('virtual-request')
      }
      else {
        return ('/my-orders')
      }

    case 48:
      if (JSON.parse(item.metaData?.replace(/'/g, "\"")).purchasedById === userId) ('/virtual-request');
      else ('/my_orders');
      break;
    case 53:
    case 51:
      return '/profile'
    default:
      return "/";
  }
};

self.addEventListener('notificationclick', function (event) {

  let url = getNotifyUrl(event.notification?.data?.FCM_MSG?.data)
  if (event.notification?.data?.redirectTo) {
    url = event.notification?.data?.redirectTo
  }
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(windowClients => {
      // Check if there is already a window/tab open with the target URL
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        // If so, just focus it.
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      // If not, then open the target URL in a new window/tab.
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
})

const messaging = firebase.messaging();
firebase
  .messaging()
  .setBackgroundMessageHandler((payload) => {
    console.log("payload", payload)
    if (payload?.data?.conversationId && payload?.data?.messageId) {
      return self.registration.showNotification(`You have received a new message from ${payload?.data?.senderName}`, { body: `${btoa(payload?.data?.body)}`, icon: '/notification-icon.png', data: { redirectTo: `/chat?c=${payload?.data?.conversationId}` } });
    }

  });
