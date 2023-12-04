import { getCookie } from "../session";


export const getGuestUserData = () => {
    return {
        latitude: getCookie("lat"),
        longitude: getCookie("long"),
        city: getCookie("ucity"),
        country: getCookie("country")
    }
}