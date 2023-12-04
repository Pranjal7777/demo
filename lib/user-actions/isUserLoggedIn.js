import { getCookie } from "../session";
import { AUTH_PASS } from "../config";

export const isUserLoggedIn = () => {
    return getCookie(AUTH_PASS);
}