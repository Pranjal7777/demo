import * as actionTypes from "./actionTypes";


export const postShoutoutData = (data) => {
    return {
        type: actionTypes.POST_SHOUTOUT_REQUEST_DATA,
        data: data
    };
};

export const handleShoutoutOrderCount = (data) => {
    return {
        type: actionTypes.UPDATE_ORDER_COUNT,
        payload: data
    };
};

export const handleHeaderCategories = (data) => {
    return {
        type: actionTypes.HEADER_CATEGORIES,
        payload: data
    };
};