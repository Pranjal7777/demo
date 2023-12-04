import { DevicePayload } from "../data-modeling";
import { basic, getUrl } from "../request";
import { getCookie, isBrowser } from "../session";
import { setAuthData } from "./setAuthData";

export const guestLogin = async (req) => {
    console.log("guest login call function")
    const extraHeaders = {}
    if (req?.headers) {
        const userIp = req?.headers['cf-connecting-ip'] || req?.headers['x-forwarded-for'];
        console.log("IP in guest login", userIp)
        if (userIp) {
            extraHeaders['x-forwarded-for'] = encodeURIComponent(userIp)
        }
    }
    const token = getCookie("token");
    const lang = getCookie("language");
    if (!token) {
        try {
            const reqPayload = {
                ...DevicePayload,
            };
            let data = await fetch(getUrl("/guestLogin"), {
                method: "POST",
                headers: new Headers({
                    "Content-Type": "application/json",
                    Authorization: basic,
                    lan: lang || "en",
                    ...extraHeaders
                }),
                body: JSON.stringify(reqPayload),
            });
            data = await data.json();

            if (isBrowser()) {
                setAuthData(data.data);
            }
            if (data?.data?.accessToken) {
                return {
                    token: data?.data?.accessToken,
                };
            } else {
                console.log("guest login response", JSON.stringify(data))
                throw Error("something went wrong with guest login")
            }

        } catch (e) {
            console.error("guest login failed", JSON.stringify(e), JSON.stringify(DevicePayload), basic);
            return {
                token: "",
            };
        }
    }
    return {
        token: token,
    };
};

export const refreshTokenLogin = async (req) => {
    const extraHeaders = {}
    if (req?.headers) {
        const userIp = req?.headers['cf-connecting-ip'] || req?.headers['x-forwarded-for'];
        console.log("IP in guest login", userIp)
        if (userIp) {
            extraHeaders['x-forwarded-for'] = encodeURIComponent(userIp)
        }
    }
    const token = getCookie("token") || '';
    const lang = getCookie("language");
    try {
        const reqPayload = {
            refreshToken: getCookie('refreshToken'),
            accessToken: token.replace("Bearer ", ""),
        };
        let data = await fetch(getUrl("/refreshToken"), {
            method: "POST",
            headers: new Headers({
                "Content-Type": "application/json",
                Authorization: basic,
                lan: lang || "en",
                ...extraHeaders
            }),
            body: JSON.stringify(reqPayload),
        });
        data = await data.json();

        if (isBrowser()) {
            setAuthData(data.data);
        }
        if (data?.data?.accessToken) {
            return {
                token: data?.data?.accessToken,
                refreshToken: data?.data?.refreshToken,
            };
        } else {
            console.log("guest login response", JSON.stringify(data))
            throw Error("something went wrong with guest login")
        }
    } catch (e) {
        console.error("guest login failed", JSON.stringify(e), JSON.stringify(DevicePayload), basic);
        return {
            token: "",
        };
    }

};