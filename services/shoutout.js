import {
    deleteReq,
    deleteReqPayload,
    get,
    patch,
    patchWithToken,
    post,
    postWithToken,
} from "../lib/request";
import { getCookie } from "../lib/session";


// get user attribute of shoutout request
export const getShoutoutReqAttr = () => {
    return get("/shoutoutAttribute");
};

// To check if creator is enabled shoutout request or not
export const isShoutoutEnabled = (creatorId) => {
    return get(`/shoutoutAttribute?creatorId=${creatorId}`);
};

// get user shoutout request
export const getUserShoutoutReq = (q) => {
    let slug = `/virtualOrder?trigger=${q?.trigger}&offset=${q?.offset || 0}&limit=${q?.limit || 10}`
    if (q.status) {
        slug = slug + "&status=" + q.status;
    }
    if (q.searchText) {
        slug = slug + "&searchText=" + q.searchText;
    }
    if (q.userId) {
        slug = slug + "&userId=" + q?.userId;
    }
    return get(slug);
};

// post user shoutout request to creator
export const postReqCreator = (data) => {
    return postWithToken("/virtualOrder", data);
};

//patch request for update in the shoutout request
export const patchReqToShoutout = (data) => {
    return patch("/virtualOrder", data)
}

//get user suggestions while requesting shoutout for someone else
export const getUserSuggestionShoutout = async (list = {}) => {
    let url = `/users?limit=${list.limit || 10
        }&offset=${list.offset || 0}`;
    if (list.searchText) {
        url = url + "&searchText=" + list.searchText;
    }
    return get(url);
};


// get user shoutout request
export const getUserShoutoutList = (q) => {
    let slug = `/virtualOrder?trigger=${q?.trigger}&offset=${q?.offset || 0}&limit=${q?.limit || 10}`
    if (q.status) {
        slug = slug + "&status=" + q.status;
    }
    if (q.userId) {
        slug = slug + "&userId=" + q.userId;
    }
    return get(slug);
};

// get virtual order detail
export const getVirtualOrderDetail = (virtualOrderId) => {
    let slug = `/virtualOrder/details?virtualOrderId=${virtualOrderId}`
    return get(slug);
};

// get shoutout order list in creatre's profile
export const getOrderInCreatorProfile = (list) => {
    let url = `/virtualOrder/creator?limit=${list?.limit || 10
        }&offset=${list?.offset || 0}&userId=${list?.userId}`;
    return get(url);
};

// handle shoutout rating
export const shoutoutRating = (data) => {
    return postWithToken("/reviewRating", data);
};

// get shoutout review list
export const getShoutoutReviewList = (list) => {
    let url = `/reviewRating?limit=${list?.limit || 20
        }&offset=${list?.offset || 0}&userId=${list?.userId}`;
    return get(url);
};

// delete shoutout
export const deleteShoutout = (data) => {
    let url = `/virtualOrder?virtualOrderId=${data.orderId}`
    if (data.userId) {
        url += `&userId=${data.userId}`
    }
    return deleteReqPayload(url);
}