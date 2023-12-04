import { EMPTY_OTHER_PROFILE_DATA, OTHER_ALL_DATA, UPDATE_BOOKMARK_POSTSLIDER, SET_CANCEL_SUBSCRIPTION_ID, UPDATE_OTHER_PROFILE_DATA, UPDATE_PURCHASED_POST, SEND_PURCHASED_EXCLUSIVE_DATA_TO_REDUX, UPDATE_VIDEOCALL_PRICE } from "./actionTypes";

export const otherProfileData = (data, pageNo) => {
  return {
    type: OTHER_ALL_DATA,
    payload: data,
    pageNo: pageNo,
  };
};
export const updateOtherProfileData = (data) => {
  return {
    type: UPDATE_OTHER_PROFILE_DATA,
    payload: data,
  };
};

export const emptyOtherProfileData = () => {
  return {
    type: EMPTY_OTHER_PROFILE_DATA,
  }
}

export const updatePurchasedPost = (payload) => {
  return {
    type: UPDATE_PURCHASED_POST,
    payload
  }
}

export const sendPurchasedExclusiveDataToRedux = (payload) => {
  return {
    type: SEND_PURCHASED_EXCLUSIVE_DATA_TO_REDUX,
    payload
  }
}

export const updateBookmarkPostslider = (payload) => ({ type: UPDATE_BOOKMARK_POSTSLIDER, payload })
export const setCancelSubscriptionId = (payload) => {
  return {
    type: SET_CANCEL_SUBSCRIPTION_ID,
    payload
  }
}

export const updateVideoCallPrice = (payload) => {
  return {
    type: UPDATE_VIDEOCALL_PRICE,
    payload
  }
}