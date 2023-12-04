import { isAgency } from "../lib/config/creds";
import {
  deleteReq,
  get,
  postWithToken,
  deleteReqPayload,
  patchWithToken,
} from "../lib/request";
import { getCookie, getCookiees } from "../lib/session";

// Stripe Key from BE
export const getStripeKey = () => {
  return get("/setupIntent")
}

/** Cards API */
export const getUserCards = (req, addressData) => {
  let userId = getCookiees("uid", req);
  return get(`/customer?userId=${userId}`, addressData);
};

export const AddCard = (data) => {
  return postWithToken("/customer", data);
};

export const setDefaultCard = (data) => {
  return patchWithToken("/customer", data);
};

export const deleteUserCards = (value, card = "card") => {
  return deleteReq(`/paymentMethod?paymentMethod=${value}`);
};

export const getCountryList = () => {
  return get(`/country/link?countryCode=US&offset=0&limit=20`);
};

/** Wallet API */
export const createWallet = (data, token, addressData) => {
  return postWithToken("/wallet", data, addressData, token);
};

export const getUserWallet = (req) => {
  let userId = getCookie("uid");
  let agencyId = getCookie("agencyId")
  let userType = "user"
  if (isAgency()) {
    userId = agencyId
    userType = "agency"
  }
  let token = getCookie("token");
  return get(`/wallet?userType=${userType}&userId=${userId}`, {
    authorization: token,
  });
};

export const connectAccount = (data) => {
  return postWithToken(`/connectAccount`, data);
};

export const getConnectAccount = () => {
  return get(`/connectAccount`);
};

export const addBank = (data) => {
  return postWithToken(`/externalAccount`, data);
};
export const getWallteTransaction = (amount, wallteId, currency = "USD", countryCode = "us", username = "", email = "") => {
  return get(
    `/withdraw/withdrawAmt?type=1&withdrawCurrency=${currency}&amount=${amount}&walletId=${wallteId}&countryCode=${countryCode}&userName=${username}&email=${email}`
  );
};

export const withDrawMoney = (data) => {
  return postWithToken(`/withdraw/money`, data);
};

export const getTransactions = (walletId, page, fetchSize = 10, txnType) => {
  let pageState = "";
  if (page) {
    pageState = `&pageState=${page}`;
  }
  return get(
    `/walletTransaction?walletId=${walletId}${pageState}&fetchSize=${fetchSize}&txnType=${txnType}`
  );
};

export const getCreatorTransactions = (userId, page, fetchSize = 10, txnType, txnState, userType = "creator") => {
  let pageState = "";
  if (page) {
    pageState = `&pageState=${page}`;
  }
  return get(
    `/activePendingTransactionLogs?userId=${userId}${pageState}&fetchSize=${fetchSize}&txnType=${txnType}&txnState=${txnState}&userType=${userType}`
  );
};

export const getWalletBombsList = (counrtyCode = 'US') => {
  return get(`/walletSetting?countryCodeName=${counrtyCode}`)
}

export const recharWalletCoins = (data) => {
  return postWithToken(`/wallet/recharge`, data);
};

export const getWithdrowLogs = (userId, page, userType, fetchSize = 10) => {
  let pageState = "";
  if (page) {
    pageState = `&pageState=${page}`;
  }
  return get(
    `/withdraw?&userId=${userId}&userType=${userType}&fetchSize=${fetchSize}${pageState}`
  );
};

export const deleteExternal = (data) => {
  // console.log("sdasdsad", data);
  return deleteReqPayload(`/externalAccount`, data);
};

export const getBankFieldsAPI = (data) => {
  return get(`/bankFields?pgId=${data.PG_ID}&countryCode=${data.country}`);
};

export const deleteStripeAccountAPI = () => {
  return deleteReq("/connectAccount");
};

export const getPgCountryAPI = (pgId) => {
  return get(`/wallet/pg/country?pgId=${pgId}`);
};