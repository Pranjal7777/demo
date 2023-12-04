import { removeCookie, setCookie } from "../session";

import { logoutUser } from "../../services/profile";

export const logOut = () => {

    logoutUser()
        .then(() => {

            setCookie("userType", 1);

            removeCookie("token");
            removeCookie("authPass");
            removeCookie("uid");

            window.location.reload();
        })
};