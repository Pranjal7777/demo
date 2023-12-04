import {
  CarouselOpen,
  DialogClose,
  DialogOpen,
  DrawerClose,
  DrawerOpen,
  handleLoader,
  PagerLoader,
  ProgressLoader,
  snakbar,
  StickySnackbar,
  StickySnackbarClose,
  CustomPagerLoader,
  UpdateModelCardPostSubject,
} from "../rxSubject";
import { basic, getUrl } from "../request";
import Route from "next/router";
import { APP_NAME, SUPPORT_EMAIL } from "../config";
import { getCookie, getCookiees, getLocalStorage, isBrowser, removeCookie, removeLocalStorage, setCookie, setLocalStorage } from "../session";
import { DevicePayload, Signout } from "../data-modeling";
import { logout } from "../../services/auth";
import { setToken, unsubscibeFCMTopic } from "../notification/handleNotification";
import { unsubscibeMqqtTopic } from "../../hoc/mqtt";
import { createWallet } from "../../services/payments";
import publicIp from "public-ip";
import moment from "moment";
import parse from "html-react-parser";
const currencyJson = require("../../translations/currency.json");
import { useSelector } from "react-redux";
import { FCM_CHAT_TOPIC, FCM_TOPIC, isAgency } from "../config/creds";
import { EXCLA_ICON } from "../config/logo";


// for open dialog
export const open_dialog = (...params) => {
  DialogOpen.next([...params]);
};

// for close dialog
export const close_dialog = (...params) => {
  DialogClose.next(...params);
};

// for open drawer
export const open_drawer = (...params) => {
  DrawerOpen.next([...params]);
};

// for close drawer
export const close_drawer = (...params) => {
  DrawerClose.next([...params]);
};

/**
 * @description
 * @author Jagannath
 * @date 2020-12-16
 * @param {data, width} - {data: Array, width: String}: Required
 */
export const open_post_dialog = ({ data, width }) => {
  // components > model > post-carousel.jsx
  CarouselOpen.next({ data, width });
};

/**
 * @description snackbar is used to show some alert for
 * long time ( stick a snackbar at bottom )
 * @author Jagannath
 * @date 2020-12-18
 * @param {message, type} - {message: string, type: string}
 */
export const sticky_bottom_snackbar = ({ message, type }) => {
  StickySnackbar.next({ message, type });
};

export const close_sticy_bottom_snackbar = () => {
  StickySnackbarClose.next();
};

// for show toast message
export const Toast = (message, type = "success", duration = 2000) => {
  snakbar.next({
    message,
    type,
    duration,
  });
};

export function convertCurrencyLocale(value, fixed = 2) {
  try {
    const val = Math.abs(value)
    if (val >= 1000) {
      const newVal = (value / 1000);
      if (newVal.toString().includes('.')) {
        return `${newVal.toFixed(fixed)}k`
      }
      return `${newVal}k`
    }
    if (value.toString().includes('.')) {
      return parseFloat(value).toFixed(fixed);
    } else {
      return value
    }

  } catch (e) {
    return 0;
  }
}

// convert json into valid form
export const validJSON = (value) => {
  try {
    return JSON.stringify(eval("(" + value + ")"));
  } catch (e) {
    return JSON.stringify(value);
  }
};

// go to back page
export const goBack = () => {
  Route.back();
};

// go to login page
export async function gotoLogin(req = {}, res = {}, isSever = false) {
  // let userId = await getCookiees("userId", req);

  // if (!userId) {
  if (isSever) {
    res.writeHead(302, { Location: `/` });
    res.end();
  } else {
    Route.replace("/login");
  }
  // }
}

// start loader

export const startLoader = () => {
  return handleLoader.next(true);
};

// stop loader
export const stopLoader = () => {
  return handleLoader.next(false);
};

export const startPageLoader = () => {
  return PagerLoader.next(true);
};
export const stopPageLoader = () => {
  return PagerLoader.next(false);
};

export const CustomPageLoader = (flag) => {
  return CustomPagerLoader.next(flag);
};
// image upload
// export const UploadImage = async (
//   file,
//   folderId,
// ) => {
//   const data = new FormData();

//   console.log("file", file);


//   data.append("file", file);
//   data.append("folder", `${CLOUD_NAME}/${folderId}`);
//   const res = await fetch(IMAGE_BASE_LINK, {
//     method: "POST",
//     body: data,
//   });
//   const file1 = await res.json();
//   try {
//     return file1.public_id;
//   } catch (err) {
//     console.error("imager url error", err);
//   }
// };

// image upload
// export const UploadVideo = async (
//   file,
//   folderId,
// ) => {
//   const data = new FormData();

//   data.append("file", file);
//   data.append("folder", `${CLOUD_NAME}/${folderId}`);
//   try {
//     const res = await fetch(VIDEO_BASE_LINK, {
//       method: "POST",
//       body: data,
//     });
//     const file1 = await res.json();

//     return file1.public_id;
//   } catch (err) {
//     console.error("imager url error", err);
//   }
// };

// focus element
export const focus = (id) => {
  const el = document.getElementById(id);
  el && el.focus();
};

// Get Users Location Data
export const getLocationData = async (req) => {
  return new Promise(async (res, rej) => {
    const region = getCookie("region");
    if (region) {
      return res({
        country: region,
      });
    }

    try {
      const data = await fetch(getUrl(`/usersCurrentLocation/`));
      const response = await data.json();

      setCookie("countryCode", response.data.country);
      return res(response.data);

    } catch (err) {
      console.error("ERROR IN getLocationData", err);
      rej();
    }
  });
};

// get user ip addres
export const getMyIP = async (req) => {
  return await publicIp.v4({
    fallbackUrls: ["https://ifconfig.co/ip", "https://checkip.amazonaws.com"],
  });
};

// drawer toaster
export const drawerToast = (drawerData = {}, isMobile = true) => {
  // {
  //   console.log("DRAWER DATA =>", drawerData.isMobile);
  // }
  setTimeout(() => {
    drawerData.isMobile
      ? open_drawer("drawerToaster", drawerData, "bottom")
      : open_dialog("successfullDialog", drawerData);
  }, 30);
};

// send with mail
export const sendMail = () => {
  return window.open(
    `mailto:${SUPPORT_EMAIL}?Subject=Support Request from ${APP_NAME} App:.`
  );
};

// bool type conversion
export const stringToBool = (value) => {
  return value == "true" ? true : false;
};

// guest login
export const guestLogin = async () => {
  console.log("3111")

  const token = getCookie("token");
  const lang = getCookie("language");
  if (!token) {
    try {
      const reqPayload = {
        ...DevicePayload,
      };
      let data = await fetch(getUrl("/guestLogin"), {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
          Authorization: basic,
          lan: lang || "en",
        }),
        body: JSON.stringify(reqPayload),
      });
      data = await data.json();
      process.browser && setAuthData(data.data);

      return {
        token: data.data.accessToken,
      };
    } catch (e) {
      console.error(e);
      return {
        token: "",
      };
    }
  }
  return {
    token: token,
  };
};

// getUserId
export const getUserId = () => {
  return getCookie("uid");
};

// return home
export async function returnHome(req, res) {
  let auth = await getCookiees("auth", req);
  if (req && auth) {
    res.writeHead(302, { Location: `/` });
    res.end();
  }
  if (!req && auth) {
    Route.replace("/");
  }
}

export async function returnDocument(req, res) {
  if (req) {
    res.writeHead(302, { Location: `/document` });
    res.end();
  }
  if (!req) {
    Route.replace("/document");
  }
}
// return login
export async function returnLogin(req, res) {
  let auth = await getCookiees("auth", req);
  if (req && !auth) {
    res.writeHead(302, { Location: `/login` });
    res.end();
  }
  if (!req && !auth) {
    Route.replace("/login");
  }
}
export async function returnJuicy(req, res) {
  let auth = await getCookiees("auth", req);
  if (req && !auth) {
    res.writeHead(302, { Location: `/home` });
    res.end();
  }
  if (!req && !auth) {
    Route.replace("/home");
  }
}

export const clearAll = () => {
  removeCookie("refreshToken");
  removeCookie("accessExpiry");
  removeCookie("token");
  removeCookie("uid");
  removeCookie("auth");
  removeCookie("userTheme")
  removeCookie("nonVarifiedProfile");
  removeLocalStorage("streamUserId");
  removeCookie("userType");
  removeCookie("userRole");
  removeCookie("seoSetting");
  removeCookie("profileData");
  removeCookie("userPreference");
  removeCookie("AGORA_CHANNEL");
  removeCookie("AGORA_TOKEN");
  removeCookie("zone");
  removeCookie("selectedCreator");
  removeCookie("selectedCreatorId");
  removeCookie("agencyProfileData");
  removeCookie("userId");
  removeCookie("userToken");
  removeCookie("isometrikToken");
  removeCookie("isometrikUserId");
  removeCookie("deviceId");
  if (isBrowser() && typeof isoChatClient !== 'undefined') {
    isoChatClient.disconnect()
  }
  return
};

export const getStreamUserId = () => {
  return getLocalStorage('streamUserId');
};
// signout api
export const signOut = async (reload = false, isAgency) => {
  startLoader();
  try {
    unsubscibeFCMTopic();
    unsubscibeMqqtTopic();
    const rfToken = await getCookiees("refreshToken");
    const reqPayload = {
      refreshToken: rfToken,
    };
    await logout(reqPayload);
    removeLocalStorage("streamUserId");
    removeLocalStorage(FCM_TOPIC);
    removeLocalStorage(FCM_CHAT_TOPIC);
    clearAll();
    await guestLogin();
    !reload && stopLoader();
    if (isAgency) {
      stopLoader();
      close_dialog();
      return window.location.href = "/agencyLogin";
    }
    if (reload) return (window.location.href = "/");
  } catch (e) {
    stopLoader();
    console.error("signout error", e);
  }
};

// to close drawer model and redirect to sideNavMenu
export const backNavMenu = (props) => {
  props.handleCloseDrawer && props.handleCloseDrawer();
  props.onClose && props.onClose();
  // open_drawer(
  //   "SideNavMenu",
  //   {
  //     paperClass: "backNavMenu",
  //   },
  //   "right"
  // );
};

export const setupNotifications = ({ topic, chat_topic }) => {
  setLocalStorage(FCM_TOPIC, topic);
  setLocalStorage(FCM_CHAT_TOPIC, chat_topic);
  if ("Notification" in window) {
    setToken([topic, "chat-android-" + chat_topic]);
  }
}

// set auth data
export const setAuthData = (data) => {
  try {
    setCookie("token", data?.accessToken);
    setCookie("refreshToken", data?.refreshToken);
    setCookie("accessExpiry", data?.accessExpireAt);
    setCookie("language", "en");
    setCookie('isometrikToken', data?.isometrikToken || "");
    setCookie('isometrikUserId', data?.isometrikUserId || "");
    data.defaultCurrency ? setCookie("defaultCurrency", data.defaultCurrency) : setCookie("defaultCurrency", "USD")
    if (data._id) setCookie("uid", data._id);
    if (data.agencyId) setCookie("agencyId", data?.agencyId);
    if (data.isometrikUserId) setLocalStorage("streamUserId", data?.isometrikUserId);
    if (data.timezone) setCookie("zone", data?.timezone);
  } catch (e) {
    console.error("fail to save data", e);
  }
  return;
};


// set auth data
export const checkAuth = (data) => {
  try {
    setCookie("token", data.accessToken);
    setCookie("refreshToken", data.refreshToken);
    setCookie("accessExpiry", data.accessExpireAt);
    if (data._id) setCookie("uid", data._id);
    if (data.agencyId) setCookie("agencyId", data.agencyId);
    if (data.streamUserId) setLocalStorage("streamUserId", data.isometrikUserId);
    if (data.timezone) setCookie("zone", data.timezone)
  } catch (e) {
    console.error("fail to save data", e);
  }
};

// authenticate
export const authenticate = (redirect = "") => {
  return new Promise((res, err) => {
    if (getCookie("auth")) {
      return res();
    } else {
      if (redirect && redirect?.substring(1)?.length) {
        Route.push(`/login?redirect=${redirect.substring(1)}`);
      } else {
        Route.push("/login")
      }
      return err();
    }
  });
};
// authenticate user for payment
export const authenticateUserForPayment = (mobileView = false, descriptionText = "") => {
  const auth = getCookie("auth");
  return new Promise((res, err) => {
    if (getCookie("userType") === "1" || !auth) {
      return res();
    } else {
      drawerToast({
        closing_time: 70000,
        // title: lang.shoutoutPlaceholder,
        desc: descriptionText,
        closeIconVisible: true,
        isPromo: false,
        icon: EXCLA_ICON,
        button: {
          text: "contactUs",
          onClick: () => {
            // sendMail();
          },
        },
        titleClass: "max-full",
        autoClose: true,
        isMobile: mobileView ? true : false,
        disableContactUsBtn: true,
        classForPayementsUi: "mb-1 mt-3"
      });
      return err("Not allowed");
    }
  });
};

// Made on May 20th
export const getStreet = (addressArray) => {
  let street = "";
  for (let i = 0; i < addressArray.length; i++) {
    if (
      (addressArray[i].types[0] && "premise" === addressArray[i].types[0]) ||
      (addressArray[i].types[0] &&
        "street_number" === addressArray[i].types[0]) ||
      (addressArray[i].types[0] && "route" === addressArray[i].types[0]) ||
      (addressArray[i].types[0] && "establishment" === addressArray[i].types[0])
    ) {
      // console.log("i", i);
      street = `${street} ${addressArray[i].long_name}, `;
    }
  }
  return street;

};

export const getAddressLine1 = (addressArray) => {
  let addressLine1 = "";
  for (let i = 0; i < addressArray.length; i++) {
    if (
      (addressArray[i].types[0] && "political" === addressArray[i].types[0]) ||
      (addressArray[i].types[0] && "neighborhood" === addressArray[i].types[0]) ||
      (addressArray[i].types[0] && "administrative_area_level_2" === addressArray[i].types[0]) ||
      (addressArray[i].types[0] && "locality" === addressArray[i].types[0])
    ) {
      // console.log("i", i);
      addressLine1 = `${addressLine1} ${addressArray[i].long_name}`;
      return addressLine1;
    }
  }
};

export const getAddressLine2 = (addressArray) => {
  let addressLine2 = "";
  for (let i = 0; i < addressArray.length; i++) {
    if (
      (addressArray[i].types[0] && "administrative_area_level_2" === addressArray[i].types[0])
    ) {
      // console.log("i", i);
      addressLine2 = `${addressLine2} ${addressArray[i].long_name}`;
      return addressLine2;
    }
  }
};

export const getCity = (addressArray) => {
  // console.log("get city", addressArray);
  let city = "";
  for (let i = 0; i < addressArray.length; i++) {
    if (addressArray[i].types[0] && "locality" === addressArray[i].types[0]) {
      city = addressArray[i].long_name;
      return city;
    }
  }
};

export const getState = (addressArray) => {
  let state = "";
  for (let i = 0; i < addressArray.length; i++) {
    for (let i = 0; i < addressArray.length; i++) {
      if (
        addressArray[i].types[0] &&
        "administrative_area_level_1" === addressArray[i].types[0]
      ) {
        state = addressArray[i].long_name;
        return state;
      }
    }
  }
};

export const getPostalCode = (addressArray) => {
  let postal_code = "";
  for (let i = 0; i < addressArray.length; i++) {
    for (let i = 0; i < addressArray.length; i++) {
      if (
        addressArray[i].types[0] &&
        "postal_code" === addressArray[i].types[0]
      ) {
        postal_code = addressArray[i].long_name;
        return postal_code;
      }
    }
  }
};

export const getArea = (addressArray) => {
  let area = "";
  for (let i = 0; i < addressArray.length; i++) {
    if (addressArray[i].types[0]) {
      for (let j = 0; j < addressArray[i].types.length; j++) {
        if (
          "sublocality_level_1" === addressArray[i].types[j] ||
          "locality" === addressArray[i].types[j]
        ) {
          area = addressArray[i].long_name;
          return area;
        }
      }
    }
  }
};

export const getCountry = (addressArray) => {
  let country = "";
  for (let i = 0; i < addressArray.length; i++) {
    for (let i = 0; i < addressArray.length; i++) {
      if (addressArray[i].types[0] && "country" === addressArray[i].types[0]) {
        country = addressArray[i].long_name;
        return country;
      }
    }
  }
};

export const getGeoLocation = () => {
  return new Promise((res, rej) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          let geocoder = new google.maps.Geocoder();
          let latlng = new google.maps.LatLng(latitude, longitude);
          geocoder.geocode({ latLng: latlng }, (results, status) => {
            if (!results?.[0]) {
              return;
            }
            let x = {
              address: results[0].formatted_address,
              street: getStreet(results[0].address_components),
              addressLine1: getAddressLine1(results[0].address_components),
              addressLine2: getAddressLine2(results[0].address_components),
              addressArray: results[0].address_components,
              latitude: latitude,
              longitude: longitude,
              city: getCity(results[0].address_components),
              area: getArea(results[0].address_components),
              state: getState(results[0].address_components),
              country: getCountry(results[0].address_components),
              zipCode: getPostalCode(results[0].address_components),
            };
            const checkedAddress = [
              x.area,
              x.city,
              x.state,
              x.country,
              x.zipCode,
            ];
            const fullAddress = x.addressArray?.map((item) => item.long_name);
            x["addressLine1"] = fullAddress
              .filter((item) => !checkedAddress.includes(item))
              ?.join(", ");

            res(x);
          });
        },
        (err) => {
          res({});
        }
      );
    } else {
      rej();
    }
  });
};

export const isUrlValid = (link = "") => {
  var res = link.includes(`${CLOUD_NAME}/`);
  return res;
};

export const handleCreateWallet = async (authToken) => {
  let userId = getCookie("uid");
  let userType = "user";
  let token = authToken ? authToken : getCookie("token");
  let defaultCurrency = getCookie("defaultCurrency");

  try {
    await createWallet({
      userId: userId,
      userType: userType,
      currency: defaultCurrency != "undefined" ? defaultCurrency : "USD",
    },
      token
    );
  } catch (e) {
    console.error("create wallet error", e, e.response);
  }
};

export const convertToDecimal = (number) => {
  return parseFloat(number).toFixed(2);
};

export const convertTransectionDate = (date) => {
  return moment(date).format("DD MMM YY, h:mm a");
};

export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const open_progress = () => {
  return ProgressLoader.next(true);
};

export const close_progress = () => {
  return ProgressLoader.next(false);
};

export const scrollToView = (elementId, scrollHeight) => {
  const elementNode = document.getElementById(elementId) || elementId?.current;
  if (elementNode) {
    if (scrollHeight) {
      return (elementNode.scrollTop = scrollHeight);
    } else {
      return (elementNode.scrollTop = 0);
    }
  }
  return;
};

export const formatDuration = (seconds) => {
  if (isNaN(seconds) || seconds < 0) {
    return "Invalid duration";
  }
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  } else if (minutes > 0) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
  } else {
    return `${seconds} ${seconds === 1 ? 'second' : 'seconds'}`;
  }
}

export const linkify = (text) => {
  var urlRegex =
    /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
  return text.replace(urlRegex, function (url) {
    let urlInstance = url;
    if (!urlInstance.startsWith("http")) {
      urlInstance = "https://" + url;
    }
    return '<a target="_blank" href="' + urlInstance + '">' + url + "</a>";
  });
};

export const parseUrlText = (text) => {
  return parse(linkify(text));
};

export const getTransformedUrl = (publicId, width) => {
  const VIDEO_LINK = useSelector((state) => state.cloudinaryCreds.VIDEO_LINK);

  return `${VIDEO_LINK}${width ? "w_" + width : ""}/${publicId}`;
};

/**
 * @description
 * @author jagannath
 * @date 28/04/2021
 * @param options: Object - {publicId*, imgFormat*, crop?, ratio?, width*, height?, blur?, radius?}
 * @return url : String
 */
export const getTransformedImageUrl = (options) => {
  const {
    crop = "scale",
    ratio,
    width,
    height,
    blur,
    opacity,
    publicId,
    imgFormat = "png",
    background = "white",
    IMAGE_LINK,
  } = options;

  return (
    `${IMAGE_LINK}` +
    `c_${crop}` +
    `${ratio ? ",r_" + ratio : ""}` +
    `${width ? ",w_" + width : ""}` +
    `${height ? ",h_" + height : ""}` +
    `${blur ? ",e_blur:" + blur : ""}` +
    `${opacity ? ",o_" + opacity : ""}` +
    `${background ? ",b_" + background : ""}` +
    `/q_auto/${publicId}.${imgFormat}`
  );
};

export const cloudanaryImgUrl = (publicImg) => {
  const { publicId, IMAGE_LINK } = publicImg;
  // return `${CLOUDINARY_BASE_URL}w_300,h_200,g_face,c_fill/w_80,g_south_east,x_5,y_5,l_watermark,o_50/q_auto/${publicId}`;
  return `${IMAGE_LINK}g_south_east,l_watermark/${publicId}`;
};

export const cloudanaryVideoUrl = (publicImg) => {
  const { publicId, VIDEO_LINK } = publicImg;

  return `${VIDEO_LINK}${publicId}`;
};

export const getTransformedVideoUrl = (publicId, width) => {
  const VIDEO_LINK = useSelector((state) => state.cloudinaryCreds.VIDEO_LINK);

  return `${VIDEO_LINK}${width ? "w_" + width : ""}/${publicId}`;
};

export const isOwnProfile = (userId) => {
  const uid = isAgency() ? getCookie("selectedCreatorId") : getCookie("uid");
  return uid == userId;
};

export const handleCurrencySymbol = (currencyCode) => {
  let currencyArr = Object.keys(currencyJson).map((i) => currencyJson[i]);

  let matchCurrency =
    currencyArr &&
    currencyArr?.length &&
    currencyArr.filter((data) => {
      return data.code == currencyCode;
    });

  return matchCurrency && matchCurrency[0]?.symbol;
};

export const LINK_DETECTION_REGEX =
  /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;

export const validEmailText = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const movetoNext = (key, nextFieldID) => {
  if (key.keyCode == 13 && nextFieldID) {
    document.getElementById(nextFieldID).focus();
  }
};

export const updateModelCardPost = (postId, data) => {
  console.log({ postId, data });
  UpdateModelCardPostSubject.next({ postId, data });
};

export const isIOSDevice = () => {
  const iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
  return iOS;
};

export const timeDifferenceCalc = (bigTimeStamp, smallTimeStamp) => {
  const differenceSeconds = bigTimeStamp - smallTimeStamp;
  const daydiff = ~~((differenceSeconds / 3600) / 24);
  const hrsdiff = ~~((differenceSeconds % 86400) / 3600);
  const minutesDiff = ~~((differenceSeconds % 3600) / 60);
  let str = '';
  if (daydiff > 0) str += `${daydiff}day `;
  if (hrsdiff > 0) str += `${hrsdiff}hr `;
  if (minutesDiff > 0) str += `${minutesDiff}min${minutesDiff > 1 ? '' : 's'}`;
  if (!str) str += 'Few Seconds'
  return str;
}

// Password Validation Field
export const validatePasswordField = (password) => {
  const pass_pattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@#$-/:-?{-~!"^_`\[\]])[A-Za-z0-9@#$-/:-?{-~!"^_`\[\]]{6,}$/;
  if (pass_pattern.test(password)) return true;
  return false;
}

export const greaterThanSixDigit = (password) => {
  const greaterThanSixDigit_pattern = /^[0-9a-zA-Z$&+,:;=?@#|'<>.^*()%!-]{6,}$/;
  if (greaterThanSixDigit_pattern.test(password)) return true;
  return false;
}

export const numericValue = (password) => {
  const numericValue_pattern = /[0-9]/;
  if (numericValue_pattern.test(password)) return true;
  return false;
}

export const uppercaseCharacter = (password) => {
  const uppercaseCharacter_pattern = /[A-Z]/;
  if (uppercaseCharacter_pattern.test(password)) return true;
  return false;
}

export const lowercaseCharacter = (password) => {
  const lowercaseCharacter_pattern = /[a-z]/;
  if (lowercaseCharacter_pattern.test(password)) return true;
  return false;
}

export const specialCharacter = (password) => {
  const specialCharacter_pattern = /[$&+,:;=?@#|'<>.^*()%!-]/;
  if (specialCharacter_pattern.test(password)) return true;
  return false;
}