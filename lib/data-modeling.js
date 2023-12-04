import platform from "platform";
import { getCookie } from "./session";

// commented mean optional params

export const DevicePayload = {
  deviceId: typeof window !== 'undefined' ? window?.deviceId || "web_app" : "web_app",
  deviceMake: platform.manufacturer || "web",
  deviceModel: platform.product || "web",
  deviceTypeCode: 3,
  deviceOs:
    platform.os.family + "-" + platform.os.version + "-web" || "Windows-10-web",
  browserVersion: platform.version || "89.0.4389.90",
};

export const VerifyEmail = {
  email: "",
  type: "", // 1: login ,2 : registration
  // userType: getCookie("userType"), // 1 USER, 2 : MODEL
};

export const VerifyEmailPayload = {};

export const ValidatePhoneNoPayload = {
  phoneNumber: "",
  countryCode: "",
};

export const UserRegistrationPayload = {
  userType: 1, //for user registration
  firstName: "",
  // lastName: "",
  // username: "manish",
  email: "",
  password: "",
  ...DevicePayload,
};

export const ModelRegistrationPayload = {
  userType: 2, //for user registration
  firstName: "",
  // lastName: "",
  username: "manish",
  email: "",
  password: "",
  profilePic: "",
  countryCode: "",
  phoneNumber: "",
  dateOfBirth: "",
  groupIds:"",
  countryCodeName: "",
  //   inviterReferralCode: "",
  //   socialMediaLink: "",
  ...DevicePayload,
};
export const BecomeCreatorPayload = {
  firstName: "",
  profilePic: "",
  countryCode: "",
  phoneNumber: "",
  dateOfBirth: "",
  countryCodeName: "",
  groupIds:"",
  gender:"",
};

export const SendVerificationCode = {
  phoneNumber: "",
  countryCode: "",
  trigger: 1, //1-Register, 2- Login, 3-Change number
  //  userid:"" for forgot password
};

export const ValidateVerifcationCodePayload = {
  code: "",
  countryCode: "",
  phoneNumber: "",
  verificationId: "",
  trigger: 1,
};

// document payload

export const DocumentPayload = {
  userId: "",
  documentTypeId: "",
  // frontImage: "",
  // backImage: "",
};

//signout
export const Signout = {
  refreshToken: getCookie("refreshToken"),
};

export const forgotPasswordViaEmailPayload = {
  emailOrPhone: "",
  type: 2, // 2 for email
};

export const resetPasswordPayload = {
  userId: "",
  newPassword: "",
  token: "",
};

