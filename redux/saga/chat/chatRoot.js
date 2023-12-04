import { takeEvery } from "redux-saga/effects";
import {
  GET_CHATLIST,
  GET_CHAT_MESSAGES,
  USER_STATUS_ARRIVE,
  GET_PRODUCT_DETAILS,
} from "../../actions/chat/action";
import { getChatData } from "./chat";
import {
  getChatMessages,
  userStatus,
  getProductDetails,
} from "./chat";

export default function chatSaga() {
  return [
    takeEvery(GET_CHATLIST, getChatData),
    takeEvery(GET_CHAT_MESSAGES, getChatMessages),
    takeEvery(USER_STATUS_ARRIVE, userStatus),
    takeEvery(GET_PRODUCT_DETAILS, getProductDetails),
  ];
}