export const registerWorker = () => {
  return new Promise((resolve, reject) => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(function (sw) {
          // console.log('Service Worker Registered', sw);
          return resolve();
        })
        .catch((err) => {
          // console.log("OPOP", err);
          console.log(err);
        });
    }
  });
};
