import btoa from "btoa";

export const textencode = (str) => {
    try {
        return btoa(unescape(encodeURIComponent(str)));
    } catch (e) {
        console.error("ERROR IN textencode", e);
    }
};

export const textdecode = (str) => {
    try {
        return decodeURIComponent(escape(atob(str)));
    } catch (e) {
        console.error("ERROR IN textdecode", e);
    }
};