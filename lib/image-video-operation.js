import { VIDEO_IMAGE_PLACEHOLDER } from "./config/homepage";

export const generaeVideThumb = (file, thumbs, width, height, count = 4) => (
  new Promise((resolve, reject) => {
    var fileReader = new FileReader();
    var thumbanails = [];

    fileReader.onload = function () {
      var blob = new Blob([fileReader.result], { type: file.type });
      var url = URL.createObjectURL(blob);
      var video = document.createElement("video");
      video.setAttribute("height", height)
      video.setAttribute("width", width)
      if(file?.type && !video.canPlayType(file?.type)) {
        fetch(VIDEO_IMAGE_PLACEHOLDER)
        .then((response) => response.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            return resolve([reader.result])
          };
          reader.readAsDataURL(blob);
        })
        
      }
      else {

      let seekResolve;
      var timeupdate = function (...reset) { };
      const handleSeek = async () => {
        if (seekResolve) seekResolve();
      };
      video.addEventListener("seeked", handleSeek);

      video.addEventListener("loadeddata", async () => {
        for (let i = 0; i < count; i++) {
          video.currentTime += 0.5;
          try {
            await Promise.race([
              new Promise((res, rej) => (seekResolve = res)),
              new Promise((res, rej) => setTimeout(rej, 2000))
            ])
            await snapImage();
          } catch (err) {
            console.error("ERROR IN GEN_THUMBNAIL", err);
          }
        }

        thumbs(thumbanails);
        video.removeEventListener("seeked", handleSeek);
        return resolve(thumbanails);
      });

      var snapImage = function () {

        return Promise.race([
          new Promise((res, rej) => {
            var canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            canvas
              .getContext("2d")
              .drawImage(video, 0, 0, canvas.width, canvas.height);
            var image = canvas.toDataURL();
            var success = image.length > 10;
            if (success) {
              thumbanails.push(image);
              // var img = document.createElement("img");
              // img.src = image;
              // document.getElementsByTagName("div")[0].appendChild(img);
              URL.revokeObjectURL(url);
            }

            res(success);
          }),
          new Promise((res, rej) => {
            setTimeout((rej, 2000))
          })
        ])
      };
      video.addEventListener("timeupdate", timeupdate);
      video.onended = function (e) {
        video.removeEventListener("timeupdate", timeupdate);
      };
      video.preload = "metadata";
      video.src = url;

      // Load video in Safari / IE11
      video.muted = true;
      video.playsInline = true;

      video.play();
      // video.playbackRate = 2.5;
    }
    };
    fileReader.onerror = function () {
      reject("Got Error While Reading File");
    }
    fileReader.readAsArrayBuffer(file);
  })
);
