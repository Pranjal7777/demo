import cookie from "js-cookie";


export function isBrowser() {
  if (typeof window === 'undefined') {
    return false
  } else {
    return true
  }
}

export const setCookie = (key, value) => {
  if (isBrowser()) {
    cookie.set(key, value, {
      expires: 1,
      path: "/",
    });
  } else {
    console.log("setCookie failed");
    return
  }
};

export const removeCookie = (key) => {
  if (isBrowser()) {
    cookie.remove(key, {
      expires: 1,
    });
  }
};

export const getCookie = (key, req) => {
  return isBrowser() ? getCookieFromBrowser(key) : "";
};

export const getCookiees = (key, req) => {
  return isBrowser()
    ? getCookieFromBrowser(key)
    : getCookieFromServer(key, req);
};

const getCookieFromBrowser = (key) => {
  return cookie.get(key);
};

const getCookieFromServer = (key, req) => {
  if (!req || !req.headers || !req.headers.cookie) {
    return null;
  }
  const rawCookie = req.headers.cookie
    .split(";")
    .find((c) => c.trim().startsWith(`${key}=`));
  if (!rawCookie) {
    return null;
  }
  return rawCookie.split("=").slice(1).join("");
};

export const setLocalStorage = (key, value) => {
  if (isBrowser()) {
    localStorage.setItem(key, value);
  }
  return null;
};

export const getLocalStorage = (key) => {
  if (isBrowser()) {
    return localStorage.getItem(key);
  }
  return null
};

export const removeLocalStorage = (key) => {
  if (isBrowser()) {
    return localStorage.removeItem(key);
  }
  return null
}