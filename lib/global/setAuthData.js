import { setCookie, setLocalStorage } from "../session";

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