import * as actionTypes from "./actionTypes";

export const guestLogin = () => {
  return {
    type: actionTypes.AUTH_INIT_GUEST_LOGIN,
  };
};

export const serverLogin = () => {
  return {
    type: actionTypes.SERVER_LOGIN,
  };
};

export const setProfile = (data) => {
  return {
    type: actionTypes.ACTIVE_PROFILE,
    data: data,
  };
};

export const updateReduxProfile = (data) => {
  return {
    type: actionTypes.UPDATE_PROFILE,
    data: data,
  };
};

// Added By Bhavleen on June 10th, 2021
export const updateSubPlanReduxProfile = (data) => {
  return {
    type: actionTypes.UPDATE_SUB_PLAN_PROFILE,
    data: data,
  };
};

// Added By Bhavleen on April 19th, 2021
export const UPDATE_PROFILE_FOLLOWING = (data) => {
  return {
    type: actionTypes.UPDATE_PROFILE_FOLLOWING,
    data: data
  }
}

export const setSubmitProfile = (data) => {
  return {
    type: actionTypes.SUBMIT_PROFILE,
    data,
  };
};

export const setGuestToken = (token) => ({
  type: actionTypes.SET_GUEST_TOKEN,
  token
});

export const setLanguage = (selectedLang) => {
  return {
    type: actionTypes.INIT_LANGUAGE_CHANGE,
    selectedLang,
  };
};

export const setPg = (data) => {
  return {
    type: actionTypes.SET_PG,
    paymentGetway: data,
  };
};

export const setMobileView = (data) => {
  return {
    type: actionTypes.IS_MOBILE,
    data: data,
  };
};

export const setTabletView = (data) => {
  return {
    type: actionTypes.IS_TABLET,
    data: data,
  };
};

export const setSubscriptionPlan = (data) => {
  return {
    type: actionTypes.SET_SUBSCRIPTION_PLAN,
    payload: data,
  }
}

export const popularPost = (data) => {
  return {
    type: actionTypes.UPDATE_POPULAR_POST,
    data: data,
  }
}

export const latestPost = (data) => {
  return {
    type: actionTypes.UPDATE_LATEST_POST,
    data: data,
  }
}
export const setCloudinaryCred = (creds) => {
  return {
    type: actionTypes.SET_CLOUDINARY_CREDS,
    creds,
  };
};

export const getNotificationCount = (data) => {
  return {
    type: actionTypes.GET_NOTIFICATION_COUNT,
    payload: data,
  };
};

export const getChatNotificationCount = (data) => {
  return {
    type: actionTypes.GET_CHAT_NOTIFICATION_COUNT,
    payload: data,
  };
};

export const getBannerImgs = (data) => {
  return {
    type: actionTypes.GET_BANNERS_IMGS,
    data
  };
};

export const getRecentSearches = (data) => {
  return {
    type: actionTypes.GET_RECENT_SEARCHES,
    data
  };
};

export const appUpdateBot = (data) => {
  return {
    type: actionTypes.GET_APP_UPDATE_BOT,
    payload: data,
  };
};

export const setUpdateAcknowledgementStatus = (flag = true) => (
  {
    type: actionTypes.MARK_UPDATES_STATUS,
    flag
  }
);

export const viewedHashtag = (data) => {
  return {
    type: actionTypes.UPDATE_VIEWED_HASHTAG,
    payload: data,
  };
};
export const updateHashtag = (data) => {
  return {
    type: actionTypes.UPDATE_HASHTAG,
    payload: data,
  };
};