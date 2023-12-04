import { deleteRequest, get, patchWithToken, postWithToken } from "../lib/request";
import { getCookie } from "../lib/session";
const VIDEOCALL_API_GATEWAY = '/video-call-api';
export const timezone = () => getCookie('zone') || Intl.DateTimeFormat().resolvedOptions().timeZone;

export const getVideoCallSettingsAPI = (data) => {
    const endpoint = '/slotSizeForService';
    if (data.userId) {
        endpoint += `?creatorId=${data.userId}`
    }
    return get(endpoint, {}, { V_GATE: VIDEOCALL_API_GATEWAY });
};

export const patchVideoCallSettingsAPI = (data) => {
    const endpoint = '/slotSizeForService';
    return patchWithToken(endpoint, data, { V_GATE: VIDEOCALL_API_GATEWAY });
};

export const getAvailabilityWeekAPI = (dayOfTheWeek = "", userId = "") => {
    let endpoint = `/dailyAvailability?timezone=${timezone()}`;
    if (dayOfTheWeek) endpoint+= `&dayOfTheWeek=${dayOfTheWeek}`;
    if (userId) endpoint += `&creatorId=${userId}`;
    return get(endpoint, {}, { V_GATE: VIDEOCALL_API_GATEWAY });
};

export const postAvailabilityWeekAPI = (payloadToPost) => {
    const endpoint = '/dailyAvailability';
    return postWithToken(endpoint, { ...payloadToPost, timezone: timezone() }, {}, { V_GATE: VIDEOCALL_API_GATEWAY });
};

export const patchAvailabilityWeekAPI = (payloadToSet) => {
    const endpoint = '/dailyAvailability';
    return patchWithToken(endpoint, { ...payloadToSet, timezone: timezone() }, { V_GATE: VIDEOCALL_API_GATEWAY });
};

export const changeWeekdayStatus = (payloadToSet) => {
    const endpoint = '/slots/change-weekday-status';
    return patchWithToken(endpoint, { ...payloadToSet }, { V_GATE: VIDEOCALL_API_GATEWAY });
};

export const postUnavailabilityAPI = (payload) => {
    const endpoint = '/availability';
    return postWithToken(endpoint, { ...payload, timezone: timezone() }, {}, {V_GATE: VIDEOCALL_API_GATEWAY})
};

export const patchUnavailabilityAPI = (payload) => {
    const endpoint = '/availability';
    return patchWithToken(endpoint, { ...payload, timezone: timezone() }, {V_GATE: VIDEOCALL_API_GATEWAY})
};

export const getUnavailabilityScheduleAPI = ({ creatorId, status }) => {
    let endpoint = `/availability?timezone=${timezone()}`;
    if (status) endpoint += `&status=${status}`;
    if (creatorId) endpoint += `&creatorId=${creatorId}`;
    return get(endpoint, {}, {V_GATE: VIDEOCALL_API_GATEWAY})
};

export const deleteUnavailabilitySlotAPI = (slotId, status) => {
    const endpoint = `/availability?slotId=${slotId}&status=${status}`
    return deleteRequest(endpoint, {}, {V_GATE: VIDEOCALL_API_GATEWAY})
};

export const getAllAvailableDatesMonthlyAPI = ({ dateOfMonth, userId }) => {
    const endpoint = `/users/all/available/dates?date=${dateOfMonth}&userId=${userId}&timezone=${timezone()}`;
    return get(endpoint, {}, {V_GATE: VIDEOCALL_API_GATEWAY});
};

export const getAllSlotsOfDayAPI = ({ dateToFetch, userId }) => {
    const endpoint = `/users/slots?date=${dateToFetch}&userId=${userId}&timezone=${timezone()}`;
    return get(endpoint, {}, {V_GATE: VIDEOCALL_API_GATEWAY});
};

export const getBookingDetailsAPI = ({ dateToFetch, userId }) => {
    const endpoint = `/slots?date=${dateToFetch}&userId=${userId}&timezone=${timezone()}`;
    return get(endpoint, {}, {V_GATE: VIDEOCALL_API_GATEWAY});
};

// Node API's

export const postVideoOrderAPI = (data) => {
    return postWithToken("/virtualOrder", data);
};

export const patchVideoOrderAPI = (data) => {
    return patchWithToken("/virtualOrder", data);
}

export const getVideoCallStatusAPI = (orderId = "") => {
    return get(`/virtualOrder/videoCallStatus?virtualOrderId=${orderId}`);
};

export const postVideoCallStatusAPI = ({ orderId, status, extensionId }) => {
    const payload = {
        virtualOrderId: orderId,
        status
    };
    if (extensionId) payload.extensionId = extensionId;
    return postWithToken("/virtualOrder/videoCallStatus", payload);
}

export const postRequestExtensionAPI = (payload) => {
    return postWithToken("/virtualOrder/videoCallStatus", payload);
}

export const getSlotsInfoAPI = (userId = "") => {
    const endpoint = `/users/slot/extension/details?userId=${userId}`;
    return get(endpoint, {}, {V_GATE: VIDEOCALL_API_GATEWAY});
}

// VideoCall ISOMETRIK API

export const startIsometrikCall = async (payload, extraHeaders) => {
    return fetch("https://apis.isometrik.io/meetings/v1/publish/start", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...extraHeaders
        },
        body: JSON.stringify(payload)
    })
}

export const stopIsometrikCall = async (payload, extraHeaders) => {
    return fetch('https://apis.isometrik.io/meetings/v1/publish/stop', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...extraHeaders
        },
        body: JSON.stringify(payload)
    })
}
