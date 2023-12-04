import { getDeviceId } from "../lib/helper/detectDevice";
import { ParseToken } from "../lib/parsers/token-parser";
import {
  deleteReq,
  get,
  patchWithToken,
  postWithToken,
  putWithToken
} from "../lib/request";

export const authUserLogin = async (otherPayload) => {
  const payload = {
    deviceId: getDeviceId() || "web_app_id",
    pushToken: "web",
    appVersion: "web",
    deviceMake: "web",
    deviceModel: "web",
    deviceType: 3,
    deviceTime: "web",
    ...otherPayload,
  };

  return new Promise(async (resolve, reject) => {
    const response = await postWithToken("/customer/signIn", payload);
    return resolve(response);
  });
};

export const registration = () => {
  return postWithToken("/login");
};

// check email is validate or not
export const validateEmail = async (data) => {
  return postWithToken("/validateEmail", data);
};

// check phone number is already registerd or not
export const validatePhoneNumber = async (data) => {
  return postWithToken("/validatePhoneNumber", data);
};
export const phoneNumber = async (data) => {
  return putWithToken("/phoneNumber", data);
};
//registation for model and normal user
export const signUp = async (data) => {
  return postWithToken("/signUp", data);
};
export const becomeCreator = async (data) => {
  return postWithToken("/becomeCreator", data);
};

// validate verification code
export const validateVerificaitonCode = async (data) => {
  return postWithToken("/validateVerificationCode", data);
};

// send verification code
export const sendverificaitonCode = async (data) => {
  return postWithToken("/sendVerificationCode", data);
};

// resend verification code
export const resendverificaitonCode = async (data) => {
  return postWithToken("/resendVerificationCode", data);
};

// validate username
export const validateUserNameRequest = async (userName) => {
  return postWithToken(`/userName?username=${userName}`);
};

// validate refrrercode
export const validateReferralCodeRequest = async (referralCode) => {
  return get(`/validateReferralCode?referralCode=${referralCode}`);
};

//login service
export const login = async (data) => {
  return postWithToken("/login", data);
};

//forgot password
export const forgotPassword = async (data) => {
  return postWithToken("/forgotPassword", data);
};

// get document option
export const getDocuments = () => {
  return get("/documentType");
};

// upload documente
export const uploadDocument = (data) => {
  return postWithToken("/uploadDocuments", data);
};

// logout
export const logout = (data) => {
  return postWithToken("/signOut", data);
};

//check Mail Expire
// export const checkMailExpire = async (token) => {
//   // console.log("token", token)
//   return get(`/checkMailExpire?token=${token}`);
// };

//reset password
export const resetPassword = async (data) => {
  return postWithToken("/resetPassword", data);
};

//verify email
export const verifyEmail = async (data) => {
  return postWithToken("/verifyEmail", data);
};
// check verificationLink
// export const checkValidateLink = (token) => {
//   return get(`/checkMailExpire?token=${token}`);
// };

// profile
export const getProfile = async (userId, token, creatorId) => {
  let url = `/profile?userId=${userId}&status=1`
  if (creatorId) {
    url += `&creatorId=${creatorId}`;
  }
  return get(url, { authorization: token });
};

// update email
export const updateEmail = async (data) => {
  return patchWithToken("/email", data);
};

export const updateUsername = async (data) => {
  return putWithToken("/userName", data);

};

// create account password

export const createAccountPassword = async (data) => {
  return postWithToken("/accountPassword", data);
};

// resetPasswrod

export const updatePassword = async (data) => {
  return patchWithToken("/password", data);
};
// patch profile
export const updateProfile = async (data) => {
  return patchWithToken("/profile", data);
};

export const sendverificaitonCodeEmail = async (data) => {
  return postWithToken("/sendEmailCode", data);
};

//feature creator
export const getFeatureCreator = async (list = {}) => {
  let url = `/featureCreator?countryName=${list.country}&limit=${list.limit || 10
    }&offset=${list.offset || 0}`;
  if (list.searchText) {
    url = url + "&searchText=" + list.searchText;
  }
  return get(url);
};

export const getOnlineCreatorsApi = async (list = {}) => {
  let url = `/onlineCreators?limit=${list?.limit || 0}&offset=${list?.offset || 0}`;
  if (list.searchText) {
    url = url + "&searchText=" + list.searchText;
  }
  return get(url);
};
export const getHeroCreatorsApi = async (list = {}) => {
  let url = `/heroCategoriesCreators?limit=${list.limit || 0}&offset=${list?.offset || 0}`;
  if (list.searchText) {
    url = url + "&searchText=" + list.searchText;
  }
  return get(url);
};


//delete account
export const deleteAccount = async (data) => {
  return deleteReq(
    `/userAccount?deleteConfirmation=${false}&id=${data.id}&reason=${data.reason
    }`
  );
};

//feature creator
export const getReasons = async (type) => {
  return get(`/reasons?type=${type}`);
};

// Privacy policcy and Terms & Conditions
export const getPrivacyAndConditions = async (list) => {
  return get(`/htmlPage?lan=${list.lan}&type=${list.type}`);
};

//Get Languages list
export const getLanguages = async () => {
  return get(`/languages`);
};

// delete User
export const deleteUser = async (token) => {
  // console.log("token", token)
  return deleteReq(`/userAccount?deleteConfirmation=${true}&token=${token}`);
};

// get SEO settings
export const getSeoSettings = async (token) => {
  let headers = {
    authorization: await ParseToken(token),
  };
  return get("/seoSettings?type=1", headers);
};

export const getNSFWContent = () => {
  return get(`/htmlPage?type=3&lan=en`);
}

// newsletter to subscribe 
export const newsletter = async (data) => {
  return postWithToken("/newsLetter", data);
};

// contact us post details
export const contactUsRequests = async (data) => {
  return postWithToken("/contactUsRequests", data);
};