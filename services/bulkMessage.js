import Axios from "axios";
import { get, post, deleteReq } from "../lib/request";
import { ISOMETRIK_MQTT_CREDS, PROJECTS_CREDS } from "../lib/config/creds";
import { getCookie } from "../lib/session";

// get user to send bulk message
export const getUserBulkMessage = async (data) => {
    let url = `/user/relation?limit=${data.limit || 10}&offset=${data.offset || 0}&filter=${data.filter}`;

    if (data.searchText) {
        url = url + `&searchText=${data.searchText}`
    }
    if (data.creatorId) {
        url = url + `&creatorId=${data.creatorId}`
    }
    return get(url);
};

export const getBulkMessages = (data) => {
    let url = `/bulkMessage?limit=${data?.limit || 10}&offset=${data?.offset || 0}`
    if (data?.sortBy) {
        url += `&sortBy=${data?.sortBy}`
    }
    if (data?.userId) {
        url += `&userId=${data?.userId}`
    }
    return get(url)
};

export const getDetailedBulkMessage = (data) => {
    let url = `/bulkMessage/details?limit=${data?.limit || 10}&offset=${data?.offset || 0}&bulkMessageId=${data?.bulkMessageId}`

    if (data.filter) {
        url = url + `&filter=${data.filter}`;
    }

    if (data.searchText) {
        url = url + `&searchText=${data.searchText}`;
    }

    if (data.userId) {
        url = url + `&userId=${data.userId}`
    }
    return get(url);
};

export const postBulkMessage = (payload) => {
    return post("/bulkMessage", payload);
}

export const purchaseLockedPost = (payload) => {
    return post("/lockedPost/purchase", payload);
}

export const shareLockedPost = (payload) => {
    return post("/lockedPost/share", payload);
}

export const getPostsDetails = (postId) => {
    return get(`/posts/detail?postId=${postId}`);
}

export const getUserBulkMsgCount = () => {
    return get("/user/relation/count");
}

export const getBroadCastList = (listId, headers = {}) => {
    const finalHeaders = {
        licenseKey: PROJECTS_CREDS.licenseKey,
        appSecret: PROJECTS_CREDS?.appSecret,
        userToken: getCookie('isometrikToken'),
        ...headers
    }
    return Axios.get(`${ISOMETRIK_MQTT_CREDS.API_URL}/chat/broadcast/lists?ids=${listId}&includeMembers=true`, { headers: { ...finalHeaders } })
}
export const getBulkMessageReadList = (listId, search, limit, skip, headers = {}) => {
    const finalHeaders = {
        licenseKey: PROJECTS_CREDS.licenseKey,
        appSecret: PROJECTS_CREDS?.appSecret,
        userToken: getCookie('isometrikToken'),
        ...headers
    }
    let url = `/chat/broadcast/list/status/read?broadcastListId=${listId}&includeMembers=true&limit=${limit}&skip=${skip}`
    if (search) {
        url += `&searchTag=${search}`
    }
    return Axios.get(`${ISOMETRIK_MQTT_CREDS.API_URL}${url}`, { headers: { ...finalHeaders } })
}

export const getMediaMessageList = ({ conversationId, limit = 20, skip = 0, isGroup = false, conversationStatusMessage = false, headers = {} }) => {
    const finalHeaders = {
        licenseKey: PROJECTS_CREDS.licenseKey,
        appSecret: PROJECTS_CREDS?.appSecret,
        userToken: getCookie('isometrikToken'),
        ...headers
    }
    return Axios.get(`${ISOMETRIK_MQTT_CREDS.API_URL}/chat/messages?limit=${limit}&skip=${skip}&isGroup=${isGroup}&conversationId=${conversationId}&conversationStatusMessage=${conversationStatusMessage}&customTypes=BULK_FREE,BULK_LOCKED,LOCKED,FREE`, { headers: { ...finalHeaders } })
}

export const unsendBulkMsg = (data) => {
    // { bulkMessageId: id }
    let url = `/bulkMessage/unSend?bulkMessageId=${data.id}`
    if (data.userId) {
        url += `&userId=${data.userId}`
    }
    return deleteReq(url)
}