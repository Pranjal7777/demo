import { getCollection, getIndividuleData } from "../../services/collection";
import { isAgency } from "../config/creds";
import { open_dialog, open_drawer, Toast } from "../global/loader";
import { isBrowser } from "../session";

export const convertImage = ({ src, webp = false, compress = false }) => {
  if (src) {
    let newUrl = src;

    if (compress) {
      let imageUrl = src.split("/");
      let index = imageUrl.indexOf("upload");
      imageUrl.splice(index + 1, 0, "w_300/q_auto");
      newUrl = imageUrl.join("/");
    }
    let img = newUrl.split(".");
    img[img.length - 1] = webp ? "webp" : "png";

    // console.log("sdsdsdasd", img.join());
    return img.join(".");
  } else {
    return "";
  }
};

export const openCollectionDialog = async (data = {}, isMobile = true) => {
  try {
    const collectionData = await getCollection(0, 10, "", isAgency() ? data.userId : "");
    !isMobile
      ? open_dialog("collection", {
        ...data,
        collection: collectionData.status == 200 ? collectionData.data.data : [],
        adjustWidth: true
      })
      : open_drawer("collection", {
        ...data,
        collection: collectionData.status == 200 ? collectionData.data.data : [],
      }, "bottom"
      );
  } catch (e) {
    Toast(e?.response?.data?.message, "error");
  }
};

export const openCollectionEditDialog = async (data = {}) => {
  try {
    const collectionData = await getIndividuleData(data.collectionId, data.creatorId);
    const collection =
      collectionData.status == 200 ? collectionData.data.data[0] : {};
    open_drawer("editCollection", {
      ...data,
      ...collection,
    },
      "bottom"
    );
  } catch (e) {
    e.response && Toast(e.response.data.message, "error");
  }
};

export const openCollectionEdit = async (data = {}) => {
  try {
    const collectionData = await getIndividuleData(data.collectionId, data.creatorId);
    const collection =
      collectionData.status == 200 ? collectionData.data.data[0] : {};
    open_dialog(
      "editCollection",
      {
        ...data,
        ...collection,
      },
      "bottom"
    );
  } catch (e) {
    e.response && Toast(e.response.data.message, "error");
  }
};


export const getRandomColor = () => {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const PayloadToLink = (payload) => {
  let link = "";

  delete payload["params"];
  // console.log("payloadTOLink", payload);
  try {
    Object.keys(payload)
      .filter((key) => payload[key])
      .map((key) => {
        link += key + "=" + payload[key] + "&";
      });
  } catch (error) {
    console.error(error);
  }

  // console.log("payloadTOLink");
  return link.slice(0, link.length - 1);
};

export const InsightTypeObject = {
  Views: 1,
  Comments: 2,
  Tips: 3,
  Buyers: 4,
  Likes: 5,
  "Post Sales": 6,
};

export const CreatorInsightTypeObject = {
  "Post Views": 1,
  Comments: 2,
  Tips: 3,
  "Post Sold": 4,
  Likes: 5,
  "Post Sales": 6,
  "Profile Views": 7,
  "Subscription Earning": 8,
  Subscription: 9,
};

export const getStartTimestamp = async (filterType) => {
  const moment = (await import("moment")).default;
  // console.log("djwidksjd", filterType);
  let today = moment();
  switch (filterType) {
    case 1:
    case "1":
      return moment(today.startOf("week")).unix();
      break;
    case 2:
    case "2":
      return moment(today.startOf("month")).unix();
      break;
    case 3:
    case "3":
      return moment(today.startOf("year")).unix();
      break;
  }
};

export const getEndTimestamp = async (filterType) => {
  const moment = (await import("moment")).default;
  let today = moment();
  switch (filterType) {
    case 1:
    case "1":
      return moment(today.endOf("week")).unix();
      break;
    case 2:
    case "2":
      return moment(today.endOf("month")).unix();
      break;
    case 3:
    case "3":
      return moment(today.endOf("year")).unix();
      break;
  }
};

export function getFileType(file) {
  const imageFormats = ["jpg", "jpeg", "png", "gif", "webp", "heic", "heif"];
  const videoFormats = ["mp4", "avi", "mov", "quicktime", "wmv", 'webm', 'ogv'];

  const extension = file.type?.split("/").pop().toLowerCase() || file.name?.split(".").pop().toLowerCase();

  if (imageFormats.includes(extension)) {
    return "IMAGE";
  } else if (videoFormats.includes(extension)) {
    return "VIDEO";
  } else {
    return "unknown";
  }
}

export const getElementMaxHeight = (removeElments = [], totalHeight = '100vh', margin = 0) => {
  if (!isBrowser()) {
    return totalHeight
  }
  let totalExcludeHeight = removeElments.reduce((height, rEl) => {
    if (rEl) {
      return height += rEl.offsetHeight;
    }
  }, margin)
  totalExcludeHeight = `calc(${totalHeight} - ${totalExcludeHeight}px)`
  return totalExcludeHeight;
}
export const handleContextMenu = (e) => {
  e.preventDefault();
};


export const findDateDiff = (date1, date2) => {

  var diff = Math.floor(date1 - date2);
  var day = 1000 * 60 * 60 * 24;

  var days = Math.floor(diff / day);
  var months = Math.floor(days / 30);
  var years = Math.floor(months / 12);

  return {
    days: days,
    months: months,
    years: years
  }
}

export function obfuscateEmail(email) {
  if (!email) return '';

  // Split the email into local part and domain
  const [localPart, domain] = email.split('@');

  // Obfuscate the local part (everything before '@') by replacing it with asterisks
  const obfuscatedLocalPart = localPart.substring(0, 3) + '********' + localPart.substring(localPart.length - 2);

  // Reconstruct the obfuscated email address
  return `${obfuscatedLocalPart}@${domain}`;
}


