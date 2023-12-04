import { textencode } from "../textEncodeDecode";
import { LOGO } from "../config/logo";
import { open_dialog } from "../global/loader";
import { uploadProgressSubject } from "../rxSubject";
import { getCookie } from "../session";
import { WATERMARK_NAME, isAgency } from "../config/creds";

const returnBase64Data = (base64) => {
  const base64Data = new Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ""), 'base64');
  return base64Data;
}

const returnBase64Type = (base64) => {
  const type = base64.split(';')[0].split('/')[1];
  return type;
}


export const addWaterMark = async (file, isVideo, isAddWaterMark) => {

  if (file?.type?.includes("video") || file?.type?.includes("application") || isVideo || !isAddWaterMark) return file
  try {
    const watermark = (await import('watermarkjs')).default
    var options = {
      init: function (img) {
        img.crossOrigin = 'anonymous';
      }
    };

    const finalImage = await watermark([file, LOGO], options).image((original, logo) => {
      let context = original.getContext('2d');
      let userName = isAgency() ? JSON.parse(getCookie('selectedCreator')).username : JSON.parse(getCookie('profileData')).username
      let text = WATERMARK_NAME + ".com/" + userName
      let fontSize = original.height > original.width ? original.height / 35 : original.width / 42
      let x = original.width / 100;
      let y = original.height - original.width / 35;
      context.translate(x, y);
      context.globalAlpha = 0.5;
      context.fillStyle = '#fff';
      context.font = `${fontSize}px Roboto`;
      context.fillText(text, 0, 0);
      return original;
    })

    //for image use below code
    // const finalImage = await watermark([file, LOGO], options).image((original, logo) => {
    //   let context = original.getContext('2d');
    //   let originalWidth = original.width
    //   let originalHeight = original.height
    //   let logoAspectRatio = logo.width / logo.height
    //   let logoWidth = originalHeight > originalWidth ? originalWidth / 3 : originalWidth / 5
    //   let logoHeight = logoWidth / logoAspectRatio
    //   context.save();
    //   context.globalAlpha = 0.5;
    //   context.drawImage(logo, originalWidth - logoWidth - 10, originalHeight - logoHeight - 10, logoWidth, logoHeight);
    //   context.restore();
    //   return original;
    // })
    console.log("finalImage", finalImage)
    return finalImage.src
  } catch (error) {
    console.error(error, "")
  }
}

const viewUnitConvert = (vwOrvh = '') => {
  if (vwOrvh.includes('vw')) {
    return parseInt((window.innerWidth / 100) * parseInt(vwOrvh));
  }
  if (vwOrvh.includes('vh')) {
    return parseInt((window.innerHeight / 100) * parseInt(vwOrvh));
  }
}

export const s3ImageLinkGen = (baseImgURL = "https://photo.testbombshellsite.com", publicId, quality, width, height, blur) => {
  const s3Options = { "bucket": "bombshellcreator-images", "key": publicId, "edits": { "resize": {}, "jpeg": { "quality": 80, "progressive": true, "mozjpeg": true } } };
  if (quality) {
    s3Options.edits.jpeg.quality = +quality;
  }
  if (width) {
    if (+width) s3Options.edits.resize.width = +width;
    else if (width?.includes('v') && typeof window !== 'undefined') {
      let widthVw = viewUnitConvert(width);
      s3Options.edits.resize.width = +widthVw;
    }
  };
  if (height) {
    if (+height) s3Options.edits.resize.height = +height;
    else if (height?.includes('v') && typeof window !== 'undefined') {
      let heightVh = viewUnitConvert(height);
      s3Options.edits.resize.height = +heightVh;
    }
  };
  if (blur) {
    s3Options.edits.jpeg.quality = 1;
    s3Options.edits.blur = +blur;
  };
  const url = `${baseImgURL}/${textencode(JSON.stringify(s3Options))}`;
  return url;
}

const fileUploaderAWS = async (fileObj, data, fileName, isVideo = true, imgFolderName = 'postImages', isBase64 = false, isImgTransformation = true, isCustomFolderName = null, isAddWaterMark = true, showProgressBar = true, postCount = 0, count = 0) => {
  try {
    const file = await addWaterMark(fileObj, isVideo, isAddWaterMark)
    const IsBase64 = typeof file === "string" && file.includes("base64")
    return new Promise((resolve, reject) => {
      if (file) {
        AWS.config.update({
          region: data.region,
          credentials: new AWS.CognitoIdentityCredentials({
            IdentityId: data.IdentityId,
            Logins: {
              'cognito-identity.amazonaws.com': data.Token
            }
          })
        })

        // var s3 = new AWS.S3();
        var s3 = new AWS.S3({ signatureVersion: "v4" });

        var later = Math.floor((new Date()).getTime() / 1000) + 864000

        var params = {
          Bucket: isVideo ? data.videoBucket : (isImgTransformation === 'no' ? data.bucket : data.imageBucket),
          // Bucket: isVideo ? data.videoBucket : data.imageBucket,
          Key: isCustomFolderName ? `${isCustomFolderName}/${fileName}` : `${isVideo ? data.videoFolder : imgFolderName}/${fileName}`,
          ContentType: IsBase64 ? `image/${returnBase64Type(file)}` : (file?.type || `${isVideo ? 'video/mp4' : 'image/png'}`),
          Body: IsBase64 ? returnBase64Data(file) : (file),
          ACL: "public-read",
          Metadata: {
            'Cache-Control': 'max-age=864000',
            Expires: later.toString()
          }
        };
        if (IsBase64) params.ContentEncoding = 'base64';
        const options = { partSize: 10 * 1024 * 1024, queueSize: 10 };
        showProgressBar && open_dialog('UPLOAD_PROGRESS', {
          postCount: postCount,
          count: count
        }); s3.upload(params, options, function (err, data) {
          if (err) {
            return reject(err);
          } else {
            let fileUrl = params.Key;
            return resolve(fileUrl);
          }
          // alert("Successfully Uploaded!");
        }).on("httpUploadProgress", (progress) => {
          let uploaded = parseInt((progress.loaded * 100) / progress.total);
          uploadProgressSubject.next({ uploaded: uploaded, postCount: postCount, count: count });
          console.log(uploaded, 'is the uploaded state ==>>');
        });
      } else {
        return reject("222 File is invalid");
      }
    });
  } catch (error) {
    console.log(error)
  }
};

export default fileUploaderAWS;
