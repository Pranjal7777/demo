import * as actionTypes from "./actionTypes";

export const toggleSidebarDropdown = (data) => {
    return {
        type: actionTypes.SETTOGGLE_SIDEBAR_DROPDOWN,
        payload: data
    };
};
