export const SET_SHOPPING = "setShopping";
export const SET_CHAT = "setSale";
export const SET_MESSAGES = "setMessages";
export const SET_EXCHANGE_RECIVED = "setExchangeRecived";
export const SET_EXCHANGE_SEND = "setExchangeSend";
export const CHAT_INITIAL = "chatIntial";
export const GET_SHOPPING = "setShopping";
export const GET_CHATLIST = "getChatList";
export const GET_PRODUCT_LIST = "getProductList";
export const SET_PRODUCT_LIST = "setProductList";
export const GET_CHAT_MESSAGES = "getChatMessages";
export const GET_EXCHANGE_RECIVED = "setExchangeRecived";
export const GET_EXCHANGE_SEND = "setExchangeSend";
export const NEW_MESSAGE = "newMessage";
export const ADD_NEW_CHATLIST = "newChatList";
export const CHANGE_REACH_STATUS = "changeReachStatus";
export const CHANGE_READ_STATUS = "changeReadStatus";
export const CHANGE_READ_COUNT = "chnageReadCount";
export const CHAT_LIST_STATUS = "chatListStatus";
export const USER_STATUS = "userStatus";
export const USER_STATUS_ARRIVE = "userStatusArrive";
export const DELETE_CHAT = "deleteChat";
export const GET_PRODUCT_DETAILS = "getProductDetails";
export const GET_PRODUCT_SUCCESS = "getProductDetailsSuccess";
export const ACTIVE_CHAT = "setActiveChat";
export const GET_NOTIFICATION_COUNT = "GET_NOTIFICATION_COUNT";
export const UPDATE_CHAT = "updateChat";
export const UPDATE_VIP_COUNT = 'UPDATE_VIP_COUNT';
export const UPDATE_CHAT_OTHER_PROFILE = 'UPDATE_CHAT_OTHER_PROFILE';

export const setShopping = (data) => {
  return {
    type: SET_SHOPPING,
    payload: data,
  };
};
export const setActiveChat = (data) => {
  return {
    type: ACTIVE_CHAT,
    payload: data,
  };
};
export const newMessage = (data) => {
  return {
    type: NEW_MESSAGE,
    payload: data,
  };
};
export const setChat = (data) => {
  return {
    type: SET_CHAT,
    payload: data,
  };
};

export const setProductList = (data) => {
  return {
    type: SET_PRODUCT_LIST,
    payload: data,
  };
};

export const setMessages = (data) => {
  return {
    type: SET_MESSAGES,
    payload: data,
  };
};
export const setExchangeRecived = (data) => {
  return {
    type: SET_EXCHANGE_RECIVED,
    payload: data,
  };
};
export const setExchangeSend = (data) => {
  return {
    type: SET_EXCHANGE_SEND,
    payload: data,
  };
};

export const getShopping = (data) => {
  return {
    type: GET_SHOPPING,
    payload: data,
  };
};
export const getChatList = (data) => {
  return {
    type: GET_CHATLIST,
    payload: data,
  };
};

export const getProductList = (data) => {
  return {
    type: GET_PRODUCT_LIST,
    payload: data,
  };
};
export const getChatMessages = (data) => {
  return {
    type: GET_CHAT_MESSAGES,
    payload: data,
  };
};
export const getExchangeRecived = (data) => {
  return {
    type: GET_EXCHANGE_RECIVED,
    payload: data,
  };
};
export const getExchangeSend = (data) => {
  return {
    type: GET_EXCHANGE_SEND,
    payload: data,
  };
};

export const addNewChatList = (data) => {
  return {
    type: ADD_NEW_CHATLIST,
    payload: data,
  };
};

export const changeReadSatus = (data) => {
  return {
    type: CHANGE_READ_STATUS,
    payload: data,
  };
};

export const changeReachSatus = (data) => {
  return {
    type: CHANGE_REACH_STATUS,
    payload: data,
  };
};

export const ChangeReadCount = (data) => {
  return {
    type: CHANGE_READ_COUNT,
    payload: data,
  };
};

export const apiCallSatus = (data) => {
  return {
    type: CHANGE_READ_COUNT,
    payload: data,
  };
};

export const chatListStats = (data) => {
  return {
    type: CHAT_LIST_STATUS,
    payload: data,
  };
};

export const changeUserStatus = (data) => {
  return {
    type: USER_STATUS,
    payload: data,
  };
};

export const userStatusArrived = (data) => {
  return {
    type: USER_STATUS_ARRIVE,
    payload: data,
  };
};

export const deleteChat = (chatId) => {
  return {
    type: DELETE_CHAT,
    payload: chatId,
  };
};

export const getProductDetails = (productId) => {
  return {
    type: GET_PRODUCT_DETAILS,
    payload: productId,
  };
};

export const getProductDetailsSuccess = (data) => {
  return {
    type: GET_PRODUCT_SUCCESS,
    payload: data,
  };
};


export const getNotificationCount = (data) => {
  return {
    type: GET_NOTIFICATION_COUNT,
    payload: data,
  };
};

export const updateChat = (messageId, chatId) => {
  return {
    type: UPDATE_CHAT,
    payload: { messageId, chatId }
  }
}

export const updateVipCount = (payload) => {
  return {
    type: UPDATE_VIP_COUNT,
    payload: payload
  }
}

export const updateChatOtherProfile = (payload) => {
  return {
    type: UPDATE_CHAT_OTHER_PROFILE,
    payload: payload
  }
}