import { logout } from "../../services/auth";
import { FCM_CHAT_TOPIC, FCM_TOPIC } from "../config/creds";
import { unsubscibeFCMTopic } from "../notification/handleNotification";
import { getCookiees, isBrowser, removeCookie, removeLocalStorage } from "../session";
import { guestLogin } from "./guestLogin";
import { startLoader, stopLoader } from "./loader";

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
    if(isBrowser() && typeof isoChatClient !== 'undefined') {
        isoChatClient.disconnect()
    }
    return true;
};

export const signOut = async (reload = false) => {
    const { unsubscibeMqqtTopic } = await import("../../hoc/mqtt");
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

        if (reload) return (window.location.href = "/");
    } catch (e) {
        stopLoader();
        console.error("signout error", e);
    }
};