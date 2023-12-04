import { takeEvery } from "redux-saga/effects";
import {
  CREATE_NEW_STREAM,
  FOLLOW_USER,
  GET_CURRENT_STREAM_ANALYTICS,
  GET_CURRENT_STREAM_USER_INFO,
  GET_LIVE_STREAMS,
  GET_MESSAGES_STREAM,
  JOIN_STREAM_VIEWER,
  LEAVE_STREAM_VIEWER,
  LIKE_CURRENT_STREAM,
  POST_MESSAGES_STREAM,
  STOP_CURRENT_STREAM_STREAMER,
  UNFOLLOW_USER,
} from "../../actions/liveStream/liveStream";
import {
  createNewStreamSaga,
  followUserSaga,
  getCurrentStreamUserInfoSaga,
  getLiveStreamSaga,
  getMessagesStreamSaga,
  getStreamAnalyticsSaga,
  joinStreamViewerSaga,
  leaveStreamViewerSaga,
  likeCurrentStreamSaga,
  postMessagesStreamSaga,
  stopCurrentStreamSaga,
  unfollowUserSaga,
} from "./liveStream";

export default function liveStreamSaga() {
  return [
    takeEvery(GET_LIVE_STREAMS, getLiveStreamSaga),
    takeEvery(GET_CURRENT_STREAM_ANALYTICS, getStreamAnalyticsSaga),
    takeEvery(LIKE_CURRENT_STREAM, likeCurrentStreamSaga),
    takeEvery(CREATE_NEW_STREAM, createNewStreamSaga),
    takeEvery(GET_CURRENT_STREAM_USER_INFO, getCurrentStreamUserInfoSaga),
    takeEvery(JOIN_STREAM_VIEWER, joinStreamViewerSaga),
    takeEvery(LEAVE_STREAM_VIEWER, leaveStreamViewerSaga),
    takeEvery(STOP_CURRENT_STREAM_STREAMER, stopCurrentStreamSaga),
    takeEvery(GET_MESSAGES_STREAM, getMessagesStreamSaga),
    takeEvery(POST_MESSAGES_STREAM, postMessagesStreamSaga),
    takeEvery(FOLLOW_USER, followUserSaga),
    takeEvery(UNFOLLOW_USER, unfollowUserSaga),
  ];
}
