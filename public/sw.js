var cacheName = "Bombshell Influencers";
var filesToCache = [
  // "/static/images/logo.png"
];

self.addEventListener("install", (e) => {
  // console.log("[ServiceWorker] Install");
  e.waitUntil(
    caches.open(cacheName).then((cache) => {
      // console.log("[ServiceWorker] Caching app shell");
      // requestPermission();
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

const isLocalhost =
  typeof window != "undefined" &&
  Boolean(
    window.location.hostname === "localhost" ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === "[::1]" ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
  );

self.addEventListener("load", (event) => {
  const swUrl = `/service-worker.js`;

  if (isLocalhost) {
    // This is running on localhost. Let's check if a service worker still exists or not.
    checkValidServiceWorker(swUrl, config);

    // Add some additional logging to localhost, pointing developers to the
    // service worker/PWA documentation.
    navigator.serviceWorker.ready.then(() => {
      console.log(
        "This web app is being served cache-first by a service " +
        "worker. To learn more, visit https://bit.ly/CRA-PWA"
      );
    });
  } else {
    // Is not localhost. Just register service worker
    registerValidSW(swUrl, config);
  }
});

function checkValidServiceWorker(swUrl, config) {
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl)
    .then((response) => {
      // Ensure service worker exists, and that we really are getting a JS file.
      const contentType = response.headers.get("content-type");
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf("javascript") === -1)
      ) {
        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log(
        "No internet connection found. App is running in offline mode."
      );
    });
}

function requestPermission() {
  return new Promise(function (resolve, reject) {
    let ntObj = new Notification();

    // console.log("NOTIFICATIONS --> ", ntObj);

    const permissionResult =
      ntObj &&
      ntObj.requestPermission(function (result) {
        // Handling deprecated version with callback.
        resolve(result);
      });

    if (permissionResult) {
      permissionResult.then(resolve, reject);
    }
  }).then(function (permissionResult) {
    if (permissionResult !== "granted") {
      throw new Error("Permission not granted.");
    }
  });
}

self.addEventListener("fetch", (event) => {

});

// App install banner
self.addEventListener("beforeinstallprompt", function (e) {
  // console.log("IN INSTALL");
  e.userChoice.then(function (choiceResult) {
    // console.log(choiceResult.outcome);
    if (choiceResult.outcome == "dismissed") {
      console.log("User cancelled home screen install");
    } else {
      console.log("User added to home screen");
    }
  });
});

const broadcast = new BroadcastChannel('stream-channel');

// Listen to the response
var replyTimeout=false;
broadcast.onmessage = (event) => {
  if(event.data && event.data.type === 'browser_closed') {
      self.setTimeout(() => {
        broadcast.postMessage({type: 'checkIsActive'})
      }, 5000)
      if(!replyTimeout) {
        replyTimeout = self.setTimeout(() => {
          self.registration.showNotification("Attention!", {
              body: "Live stream will be ended within few seconds due to inactivity",
              icon: "/notification-icon.png",
              badge:"/notification-icon.png",
              metaData: {notifyType: 1000}
          })
          replyTimeout=false
          }, 10000)
      }
  } 
  if(event.data && event.data.type === "streamActive") {
    clearTimeout(replyTimeout)
    replyTimeout=false
  }
};
