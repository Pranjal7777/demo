import Route from "next/router";
import { APP_NAME, SUPPORT_EMAIL, isAgency } from "../config/creds";
import { getCookie, getCookiees, getLocalStorage } from "../session";
import { useSelector } from "react-redux";

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

export async function returnDocument(req, res) {
    if (req) {
        res.writeHead(302, { Location: `/document` });
        res.end();
    }
    if (!req) {
        Route.replace("/document");
    }
}
export async function returnHome(req, res) {
    let auth = await getCookiees("auth", req);
    if (req && auth) {
        res.writeHead(302, { Location: `/` });
        res.end();
    } else {
        return
    }
    if (!req && auth) {
        Route.replace("/");
    } else {
        return;
    }
    
}
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

export const authenticationForPayment = () => {
    return new Promise((res, err) => {
        if (getCookie("userType") === "1") {
            return res();
        } else {
            return err("Not Authorized");
        }
    });
};

export const sendMail = () => {
    return window.open(
        `mailto:${SUPPORT_EMAIL}?Subject=Support Request from ${APP_NAME} App:.`
    );
};

export const isOwnProfile = (userId) => {
    const uid = isAgency() ? getCookie("selectedCreatorId") : getCookie("uid");
    return uid == userId;
};

export const getStreamUserId = () => {
    return getLocalStorage('streamUserId');
};
