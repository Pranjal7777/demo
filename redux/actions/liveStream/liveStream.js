export const GET_LIVE_STREAMS = "GET_LIVE_STREAMS";
export const SET_LIVE_STREAMS_DATA = "SET_LIVE_STREAMS_DATA";

export const GET_CURRENT_STREAM_ANALYTICS = "GET_CURRENT_STREAM_ANALYTICS";
export const GET_CURRENT_STREAM_USER_INFO = "GET_CURRENT_STREAM_USER_INFO";
export const SET_CURRENT_STREAM_USER_INFO = "SET_CURRENT_STREAM_USER_INFO";
export const SET_CURRENT_STREAM_ID = "SET_CURRENT_STREAM_ID";
export const SET_CURRENT_STREAM_ANALYTICS = "SET_CURRENT_STREAM_ANALYTICS";
export const LEAVE_CURRENT_STREAM = "LEAVE_CURRENT_STREAM";

export const LIKE_CURRENT_STREAM = "LIKE_CURRENT_STREAM";

export const CREATE_NEW_STREAM = "CREATE_NEW_STREAM";
export const SET_CREATED_STREAM_DATA = "SET_CREATED_STREAM_DATA";

// STREAM JOIN/LEAVE and STOP
export const JOIN_STREAM_VIEWER = "JOIN_STREAM_VIEWER";
export const LEAVE_STREAM_VIEWER = "LEAVE_STREAM_VIEWER";
export const STOP_CURRENT_STREAM_STREAMER = "STOP_CURRENT_STREAM_STREAMER";

// Messages or Comment in Live Stream
export const GET_MESSAGES_STREAM = "GET_MESSAGES_STREAM";
export const SET_MESSAGES_STREAM = "SET_MESSAGES_STREAM";
export const POST_MESSAGES_STREAM = "POST_MESSAGES_STREAM";

// User Joined or Left stream While Broadcasting
export const VIEWER_JOINED_STREAM = 'VIEWER_JOINED_STREAM';
export const VIEWER_LEFT_STREAM = 'VIEWER_LEFT_STREAM';
export const VIEWER_NUMBER_UPDATE = 'VIEWER_NUMBER_UPDATE';

// To Follow or Unfollow Any User
export const FOLLOW_USER = 'FOLLOW_USER';
export const UNFOLLOW_USER = 'UNFOLLOW_USER';

// REMOVE STREAM FROM LIST
export const REMOVE_STREAM = 'REMOVE_STREAM';
export const STREAM_UNLOCK = 'STREAM_UNLOCK';

// SET ISOMETRIK MQTT STATUS
export const SET_ISOMETRIK_MQTT_STATUS = 'SET_ISOMETRIK_MQTT_STATUS';

/**
 *
 * @param {*} streamType : Type 1-Nearby 2-Paid 3- Popular 4-Star 5-following 6-audioonly 7-multilive 8-Private Stream
 * @param {*} streamStatus : Status 1-Active 2-Scheduled 3-Inactive 4-Deleted
 * @param {*} country : Country name seprate by “,” for multiple country
 * @param {*} search : Search by stream title,description
 * @param {*} limit : limit records for pagination Max 10
 * @param {*} skip : Skip records for pagination start from 0
 * @param {*} callBackFn : callback Function to be called when API call is done
 * @returns
 */
export const getLiveStreams = (
  streamType = 1,
  streamStatus = 1,
  country = null,
  search = "",
  limit = 10,
  skip = 0,
  callBackFn = null,
  isPagination = true,
  creatorId = "",
) => ({
  type: GET_LIVE_STREAMS,
  streamType,
  streamStatus,
  country,
  search,
  limit,
  skip,
  callBackFn,
  isPagination,
  creatorId
});
export const setLiveStreams = (
  streamType,
  streamStatus,
  streams = [],
  totalCount,
  pageCount,
  isPagination = true
) => ({
  type: SET_LIVE_STREAMS_DATA,
  streamType,
  streamStatus,
  streams,
  totalCount,
  pageCount,
  isPagination
});

export const getCurrentStreamAnalytics = (streamId, callBackFn) => ({
  type: GET_CURRENT_STREAM_ANALYTICS,
  streamId,
  callBackFn,
});
export const setCurrentStreamAnalytics = (data) => ({
  type: SET_CURRENT_STREAM_ANALYTICS,
  data,
});
export const leaveCurrentStream = () => ({ type: LEAVE_CURRENT_STREAM });
export const getCurrentStreamUserInfo = (streamId, userId, callBackFn) => ({
  type: GET_CURRENT_STREAM_USER_INFO,
  streamId,
  userId,
  callBackFn,
});
export const setCurrentStreamUserInfo = (userInfo, isHost = true) => ({
  type: SET_CURRENT_STREAM_USER_INFO,
  userInfo,
  isHost,
});

export const setCurrentStreamIdAction = (streamId) => ({
  type: SET_CURRENT_STREAM_ID,
  streamId
});

export const likeCurrentStream = (streamId, callBackFn, uid) => ({
  type: LIKE_CURRENT_STREAM,
  streamId,
  callBackFn,
  uid
});

export const createNewStream = (streamPayload, callBackFn) => ({
  type: CREATE_NEW_STREAM,
  streamPayload,
  callBackFn,
});
export const setCreatedStreamData = (streamData) => ({
  type: SET_CREATED_STREAM_DATA,
  streamData,
});

export const joinStreamViewerAction = (
  streamId,
  callBackSuccess,
  callBackFailure
) => ({ type: JOIN_STREAM_VIEWER, streamId, callBackSuccess, callBackFailure });
export const leaveStreamViewerAction = (
  streamId,
  callBackSuccess,
  callBackFailure
) => ({
  type: LEAVE_STREAM_VIEWER,
  streamId,
  callBackSuccess,
  callBackFailure,
});
export const stopCurrentStreamAction = (
  streamId,
  callBackSuccess,
  callBackFailure
) => ({
  type: STOP_CURRENT_STREAM_STREAMER,
  streamId,
  callBackSuccess,
  callBackFailure,
});

// Messages Action Helper
export const getMessagesStreamAction = (
  streamId,
  limit = 20,
  pageToken,
  callBackSuccess,
  callBackFailure
) => ({
  type: GET_MESSAGES_STREAM,
  streamId,
  limit,
  pageToken,
  callBackSuccess,
  callBackFailure,
});

export const setMessageStreamAction = (
    messages,
    pageToken,
    isAPI = false
) => ({
    type: SET_MESSAGES_STREAM,
    messages,
    pageToken,
    isAPI
});

export const postMessageAction = (
    payload,
    streamId,
    addToStore = true,
    callBackSuccess,
    callBackFailure
) => ({
    type: POST_MESSAGES_STREAM,
    payload,
    streamId,
    addToStore,
    callBackSuccess,
    callBackFailure
});

export const viewerJoinedStream = (
    viewerData,
    callBackFn
) => ({
    type: VIEWER_JOINED_STREAM,
    viewerData,
    callBackFn
});

export const viewerLeftStream = (
    viewerData,
    callBackFn
) => ({
    type: VIEWER_LEFT_STREAM,
    viewerData,
    callBackFn
});

export const viewerCountUpdateAction = (viewersCount) => ({ type: VIEWER_NUMBER_UPDATE, viewersCount })

// To Follow or Unfollow Any User
export const FollowUserAction = (streamId, followingId, callBackSuccess, callBackFailure) => ({ type: FOLLOW_USER, followingId, streamId, callBackSuccess, callBackFailure });
export const UnfollowUserAction = (followingId, callBackSuccess, callBackFailure) => ({ type: UNFOLLOW_USER, followingId, callBackSuccess, callBackFailure });

// To Remove Particular Stream From User
export const removeStreamAction = (streamId, isScheduled = false) => ({ type: REMOVE_STREAM, streamId, isScheduled });

// To Unlock The Purchased Stream by StreamID
export const unlockStreamAction = (streamId, isScheduled = false) => ({ type: STREAM_UNLOCK, streamId, isScheduled });

// To set whether isometrik mqtt connected or not
export const setIsometrikMqttState = (isConnected = false) => ({ type: SET_ISOMETRIK_MQTT_STATUS, isConnected });