import { put, select } from "redux-saga/effects";
import { Toast } from "../../../lib/global/loader";
import { getStreamUserId } from "../../../lib/global/routeAuth";
import { LiveStreamMessagePayload } from "../../../lib/liveStream";
import {
  createNewStreamAPI,
  getLiveStreamAPI,
  getStreamAnalyticsAPI,
  getStreamMessagesAPI,
  joinStreamUserAPI,
  leaveStreamUserAPI,
  likeStreamAPI,
  postStreamMessagesAPI,
  stopStreamAPI,
  streamUserInfoAPI,
  startScheduledStreamAPI,
  followUserStream
} from "../../../services/liveStream";
import { follow, unfollow } from "../../../services/profile";
import { UPDATE_PROFILE_FOLLOWING } from "../../actions/auth";
import {
  setCreatedStreamData,
  setCurrentStreamAnalytics,
  setLiveStreams,
  leaveCurrentStream,
  setCurrentStreamUserInfo,
  setMessageStreamAction,
  setCurrentStreamIdAction,
} from "../../actions/liveStream/liveStream";
import { getDeviceId } from "../../../lib/helper/detectDevice";

export function* getLiveStreamSaga({
  streamType,
  streamStatus,
  country,
  search,
  limit,
  skip,
  callBackFn,
  isPagination,
  creatorId
}) {
  try {
    const response = yield getLiveStreamAPI(
      streamType,
      streamStatus,
      country,
      search,
      limit,
      skip,
      creatorId
    );
    const pageCount = parseInt(skip / limit) + 1;
    if (response.data?.streams?.length) {
      const { streams, totalCount } = response.data;
      console.log("STREAM DATA==>>", streams);
      yield put(setLiveStreams(streamType, streamStatus, streams, totalCount, pageCount, isPagination, creatorId));
    } else if (response.status === 204 && !isPagination) {
      yield put(setLiveStreams(streamType, streamStatus, [], null, pageCount - 1, isPagination, creatorId));
    }
  } catch (err) {
    console.error(err);
  } finally {
    callBackFn?.();
  }
}

export function* getStreamAnalyticsSaga({ streamId, callBackFn }) {
  try {
    const response = yield getStreamAnalyticsAPI(streamId);
    if (response.status === 200) {
      const dataToSet = { ...response.data };
      dataToSet?.Message && delete dataToSet.Message;
      console.log(dataToSet, "<<=== is the analytics");
      yield put(setCurrentStreamAnalytics(dataToSet));
    }
  } catch (err) {
    console.error(err);
  } finally {
    callBackFn?.();
  }
}

export function* likeCurrentStreamSaga({ streamId, callBackFn, uid }) {
  try {
    const payload = {
      streamId,
      senderId: getStreamUserId(),
      senderIdentifier: "marika_jack",
      senderImage: "fanzly/users/profiles/lngygtsru6vgivm6mxzs",
      deviceId: getDeviceId() || uid,
      customType: "test"
    };
    const response = yield likeStreamAPI(payload);
  } catch (error) {
    console.error(error);
  } finally {
    callBackFn?.();
  }
}

export function* createNewStreamSaga({ streamPayload, callBackFn }) {
  try {
    const isScheduleStart = streamPayload.eventId;
    let response = {};
    if (isScheduleStart) response = yield startScheduledStreamAPI(streamPayload);
    else response = yield createNewStreamAPI(streamPayload);
    if (!streamPayload.isScheduledStream) {
      const dataToSet = { ...response.data };
      dataToSet?.message && delete dataToSet.message;
      yield put(setCreatedStreamData(dataToSet));
    }
    callBackFn?.(true);
  } catch (err) {
    console.error(err);
    callBackFn?.(false);
  }
}

export function* getCurrentStreamUserInfoSaga({
  streamId,
  userId,
  callBackFn,
}) {
  try {
    const isHost = !userId;
    const response = yield streamUserInfoAPI(streamId, userId);
    const dataToSet = { ...response.data };
    dataToSet.streamId = streamId;
    dataToSet?.message && delete dataToSet.message;
    yield put(setCurrentStreamUserInfo(dataToSet, isHost));
    yield put(setCurrentStreamIdAction(streamId));
  } catch (err) {
    console.error(err);
  } finally {
    callBackFn?.();
  }
}

export function* joinStreamViewerSaga({
  streamId,
  callBackSuccess,
  callBackFailure,
}) {
  try {
    const payload = {
      removeLocally: true,
      streamId,
      viewerId: getStreamUserId(),
    };
    console.log("streamJoinFunction", "inside", 1)
    const resposnse = yield joinStreamUserAPI(payload);
    if (resposnse.status === 200) {
      const dataToSet = { ...resposnse.data };
      dataToSet?.message && delete dataToSet.message;
      dataToSet.streamId = streamId;
      yield put(setCreatedStreamData(dataToSet));
      callBackSuccess?.(dataToSet);
    }
  } catch (err) {
    console.error(err);
    callBackFailure?.();
    if (err.response?.data?.message) Toast(err.response.data.message, "error");
  }
}

export function* leaveStreamViewerSaga({
  streamId,
  callBackSuccess,
  callBackFailure,
}) {
  try {
    const payload = {
      removeLocally: false,
      streamId,
      viewerId: getStreamUserId(),
    };
    const resposnse = yield leaveStreamUserAPI(payload);
    if (resposnse.status === 200) {
      yield put(leaveCurrentStream());
      callBackSuccess?.();
    }
  } catch (err) {
    console.error(err);
    callBackFailure?.();
  }
}

export function* stopCurrentStreamSaga({
  streamId,
  callBackSuccess,
  callBackFailure,
}) {
  try {
    const payload = {
      streamId,
      isometrikUserId: getStreamUserId(),
    };
    const response = yield stopStreamAPI(payload);
    if (response.status === 200) {
      yield put(leaveCurrentStream());
      callBackSuccess?.();
    }
  } catch (err) {
    console.error(err);
    callBackFailure?.();
  }
}

export function* getMessagesStreamSaga({
  streamId,
  limit,
  pageToken,
  callBackSuccess,
  callBackFailure
}) {
  try {
    const response = yield getStreamMessagesAPI(streamId, limit, pageToken);
    if (response.status === 200) {
      // const messagesFetched = response.data.messages.filter(item => item.message_type == 0);
      // const pageTokenFetched = response.data.pageToken;
      // yield put(setMessageStreamAction(messagesFetched.reverse(), pageTokenFetched, true));
      callBackSuccess?.()
    }
  } catch (err) {
    console.error(err);
    callBackFailure?.();
  }
}

const getProfileState = (state) => state.profileData;

export function* postMessagesStreamSaga({
  payload,
  streamId,
  addToStore,
  callBackSuccess,
  callBackFailure
}) {
  try {
    const profileInfo = yield select(getProfileState);
    const MessagePayload = { ...LiveStreamMessagePayload };
    MessagePayload.body = payload;
    MessagePayload.messageType = 0;
    MessagePayload.streamId = streamId;
    // MessagePayload.senderName = profileInfo.username;
    MessagePayload.senderIdentifier = profileInfo.username;
    // MessagePayload.senderImage = profileInfo.profilePic || "fanzly/users/profiles/dqla4ngfc8zlzvp6emfp_dxiame";
    // MessagePayload.senderId = profileInfo.streamUserId;
    MessagePayload.timestamp = Math.floor((new Date()).getTime());
    MessagePayload.searchableTags = ["public"]
    MessagePayload.metaData = { secretMessage: true }
    MessagePayload.deviceId = getDeviceId() || profileInfo._id
    MessagePayload.customType = "SelfDestruct"

    const response = yield postStreamMessagesAPI(MessagePayload);
    if (response.status === 200) {
      // if (addToStore) yield put(setMessageStreamAction([MessagePayload]));
      callBackSuccess?.()
    };
    // console.log("streamJoinFunction111", 22)
  } catch (err) {
    console.error(err);
    callBackFailure?.();
  }
}

export function* followUserSaga({ streamId, followingId, callBackSuccess, callBackFailure }) {
  try {
    const profileInfo = yield select(getProfileState);
    const reqPayload = { followerId: followingId, streamId };
    const response = yield followUserStream(reqPayload);
    if (response.status === 200) {
      yield put(UPDATE_PROFILE_FOLLOWING(profileInfo.totalFollowing + 1));
      callBackSuccess?.();
    }
  } catch (err) {
    console.error(err);
    callBackFailure?.();
  }
}

export function* unfollowUserSaga({ followingId, callBackSuccess, callBackFailure }) {
  try {
    const profileInfo = yield select(getProfileState);
    const reqPayload = { followingId };
    const response = yield unfollow(reqPayload);
    if (response.status === 200) {
      yield put(UPDATE_PROFILE_FOLLOWING(profileInfo.totalFollowing - 1));
      callBackSuccess?.();
    }
  } catch (err) {
    console.error(err);
    callBackFailure?.();
  }
}
