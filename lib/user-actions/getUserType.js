import { getCookie } from "../session";
import { USER_TYPE } from "../config";

// RETAILER_TYPE = 1
// DISTRIBUTOR_TYPE = 2

export const getUserType = (userProfileData) => {
    // return 2;
    return userProfileData ? userProfileData.userType : getCookie("userType") || 1;
}