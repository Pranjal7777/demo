import { customAxios } from "../lib/request";
import { get, postWithToken, putWithToken, deleteReq, deleteReqPayload } from "../lib/request";
import { ISOMETRIK_MQTT_CREDS, PROJECTS_CREDS } from '../lib/config/creds';
import { getStreamUserId } from "../lib/global/routeAuth";
import { getCookie } from "../lib/session";

const API_HOST = ISOMETRIK_MQTT_CREDS.API_URL;
const getUrl = (endpoint) => API_HOST + endpoint;

const commonHeader = {
  licenseKey: PROJECTS_CREDS.licenseKey,
  "Content-Type": "application/json"
}

const getIsometrik = async (endpoint = '', otherHeaders = {}) => (
	customAxios.get(getUrl(endpoint), {
		headers: { ...commonHeader, ...otherHeaders },
    transformRequest: (data, headers) => {
      delete headers.common['authorization'];
      return data;
    }
  })
);

const postIsometrik = async (endpoint = '', data, otherHeaders = {}) => (
	customAxios.post(getUrl(endpoint), data, {
		headers: { ...commonHeader, ...otherHeaders },
    transformRequest: (data, headers) => {
      delete headers.common['authorization'];
      return data;
    }
  })
);

const putIsometrik = async (endpoint = '', data, otherHeaders = {}) => (
	customAxios.put(getUrl(endpoint), data, {
		headers: { ...commonHeader, ...otherHeaders },
    transformRequest: (data, headers) => {
      delete headers.common['authorization'];
      delete headers.common['city'];
      delete headers.common['ipaddress'];
      delete headers.common['lan'];
      delete headers.common['latitude'];
      delete headers.common['platform'];
      delete headers.common['longitude'];
      return data;
    }
  })
);

export const getLiveStreamAPI = (type, status, country, search, limit, skip, creatorId) => {
  let endpoint = `/streams?limit=${limit}&skip=${skip}&status=${status}&startTime=${Math.floor((new Date()).getTime() / 1000)}`;
  if (type) endpoint = endpoint + `&type=${type}`;
  if (country) endpoint = endpoint + `&country=${country}`;
  if (search) endpoint = endpoint + `&search=${search}`;
  if (creatorId) endpoint = endpoint + `&creatorId=${creatorId}`;
  return get(endpoint);
}

export const getStreamAnalyticsAPI = (streamId) => {
  const endpoint = `/stream/analytics?streamId=${streamId}`;
  return get(endpoint);
}

export const likeStreamAPI = (body = {}) => {
  const endpoint = `/stream/like`;
  return postWithToken(endpoint, body);
}

export const createNewStreamAPI = (body = {}) => {
  const endpoint = `/stream`;
  return postWithToken(endpoint, body);
}

export const startScheduledStreamAPI = (body = {}) => {
  const endpoint = '/stream/schedule/golive';
  return postWithToken(endpoint, body);
}

export const streamUserInfoAPI = (streamId, userId) => {
  let endpoint = `/user?streamId=${streamId}`;
  if (userId) endpoint = endpoint + `&userId=${userId}`;
  return get(endpoint);
}

export const joinStreamUserAPI = (body = {}) => {
  const endpoint = '/stream/viewer';
  return postWithToken(endpoint, body);
}

export const leaveStreamUserAPI = (body = {}) => {
  const endpoint = '/stream/viewer';
  return deleteReq(endpoint, body);
}

export const stopStreamAPI = (body = {}) => {
  const endpoint = '/stream';
  return putWithToken(endpoint, body);
}

export const getStreamMessagesAPI = (streamId, limit = 10, pageToken) => {
  const userId = getStreamUserId();
  let endpoint = `/streaming/message/${PROJECTS_CREDS.accountId}/${PROJECTS_CREDS.projectId}/${PROJECTS_CREDS.keysetId}/${streamId}/${userId}?count=${limit}`;
  if (pageToken) endpoint += `&pageToken=${pageToken}`;
  return getIsometrik(endpoint);
}

// export const postStreamMessagesAPI = (body = {}) => {
//   const endpoint = "/streaming/message/";
//   return postIsometrik(endpoint, JSON.stringify(body));
// }

export const postStreamMessagesAPI = (body = {}) => {
  const endpoint = "/stream/message";
  return postWithToken(endpoint, body, commonHeader);
}

export const updateUserStatusAPI = (streamUserId = '') => {
  const endpoint = "/gs/v2/subscription/?streamStartChannel=true";
  const payload = {
    streamStartChannel: true,
    // userId: streamUserId,
    // projectId: PROJECTS_CREDS.projectId,
    // keysetId: PROJECTS_CREDS.keysetId,
    // accountId: PROJECTS_CREDS.accountId
  };
  return putIsometrik(endpoint, JSON.stringify(payload), {
    licenseKey: PROJECTS_CREDS.licenseKey,
    appSecret: PROJECTS_CREDS.appSecret,
    userToken: getCookie('isometrikToken'),

  });
}

export const getStreamViewersAPI = (streamId, limit = 10, skip = 0) => {
  const endpoint = `/stream/viewer?streamId=${streamId}&limit=${limit}&skip=${skip}`;
  return get(endpoint);
}

export const sendTipStreamAPI = (payload) => {
  const endpoint = '/stream/tip';
  return postWithToken(endpoint, payload);
}

export const buyStreamAPI = (payload) => {
  const endpoint = '/stream/buy';
  return postWithToken(endpoint, payload);
}

export const getProfileStream = ({ path = "all", userId = '', streamUserId = '', limit = 10, skip = 0, sort = "NEWEST" }) => {
  let endpoint;
  if (path === "upcomingStreams") {
    endpoint = "/streams/" + `scheduled?startTime=${Math.floor((new Date()).getTime() / 1000)}&limit=${limit}&skip=${skip}&userId=${userId}`
  } else if (path === "recordedStreams") {
    endpoint = "/stream/" + `recorded?startTime=${Math.floor((new Date()).getTime() / 1000)}&limit=${limit}&offset=${skip}&isometrikUserId=${streamUserId}`
  } else {
    endpoint = "/streams/" + `all?startTime=${Math.floor((new Date()).getTime() / 1000)}&limit=${limit}&skip=${skip}&userId=${userId}`
  }
  endpoint = endpoint + `&sort=${sort}`

  return get(endpoint);
}

export const deleteScheduleStreamAPI = (eventId = '', creatorId = '') => {
  const payload = { eventId };
  if (creatorId) {
    payload.creatorId = creatorId;
  }
  const endpoint = '/stream/schedule/cancel';
  return deleteReqPayload(endpoint, payload);
};


export const deleteRecordedStreamAPI = (StreamId = '') => {
  const payload = { StreamId };
  const endpoint = '/stream/recorded';
  return deleteReqPayload(endpoint, payload);
}

export const goLiveScheduledStreamAPI = (body) => {
  const endpoint = '/stream/schedule/golive';
  return postWithToken(endpoint, body);
}

export const getStreamFromEventAPI = (eventId) => {
  const endpoint = `/shared?eventId=${eventId}`;
  return get(endpoint);
}

// To Get Stream Details From the stream Id or EventId
export const getStreamDetailAPI = (streamId, isScheduled = false, otherHeaders = {}) => {
  const endpoint = `/stream/detail?${isScheduled ? 'eventId' : 'streamId'}=${streamId}`;
  return get(endpoint, otherHeaders);
}

export const followUserStream = async (data) => {
  return postWithToken("/stream/follow", data);
};