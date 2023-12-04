import { defaultCurrency, defaultCurrencyCode, defaultLang } from "../lib/config/creds";
import { commonHeader, deleteReq, get, patchWithToken, postWithToken } from "../lib/request";

export const getAddresService = (id) => {
  // console.log("getAddressawdawsd", id);
  return get(`/address`);
};

export const deleteAddress = (id) => {
  return deleteReq(`/address?addressId=${id}`);
};

export const address = async (data) => {
  return postWithToken("/address", data);
};

export const updateAddress = async (data) => {
  // console.log("update addreess");
  return patchWithToken("/address", data);
};

export const setDefault = async (id) => {
  let payload = {
    addressId: id,
  };

  
  return patchWithToken("/address/default", payload);
};

export const sellerAddress = async (payload) => {
  return await postWithToken("/becomeSeller", payload);
};
export const updateSellerAddress = async (payload) => {
  return await patchWithToken("/becomeSeller", payload);
};
export const getSellerAddress = async () => {
  return await get("/becomeSeller/detail");
};
export const getCities = async (query) => {
  let header = {
    language: defaultLang,
    platform: '3',
    currencysymbol: defaultCurrency,
    currencycode: defaultCurrencyCode,
  }
  return await get(`/cities?countryId=${query}`, header);
};
export const getCountry = async () => {
  let header = {
    language: defaultLang,
    platform: '3',
    currencysymbol: defaultCurrency,
    currencycode: defaultCurrencyCode,
  }
  return await get("/country",header);
};