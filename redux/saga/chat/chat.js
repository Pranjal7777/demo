import { put, call } from "redux-saga/effects";
export function* getChatData({ payload }) {
  // console.log("request came", payload);
  let offset = payload.offset || 0;
  let limit = payload.limit || 10;
  let assetId = payload.assetId || "ass";
  // yield put(setChat(Chatpayload));
  const { getChatList } = yield call(() => import("../../../services/chat"))
  const { setChat } = yield call(() => import("../../actions/chat/action"))
  try {
    let chatData = yield getChatList(payload.type, offset, limit, assetId);
    let chats = {};

    yield chatData &&
      chatData.data &&
      chatData.data.data.map((items) => {
        // console.log("GET Address  SAGA -->", items);
        Object.keys(items);
        chats = {
          ...chats,
          [items.chatId.toString()]: items,
        };
        // chats[items.chatId.toString()] = items;
      });

    // console.log("GET Address  SAGA 11-->", chats);
    let Chatpayload = {
      chats: chats,
      key: payload.name,
      new: payload.new ? true : false,
      initial: payload.initial,
    };

    yield put(setChat(Chatpayload));
  } catch (ex) {
    console.error("GET Address  SAGA Error-->", ex);
  }
}

export function* getChatMessages({ payload }) {
  const { getMessages } = yield call(() => import("../../../services/chat"))
  const { setMessages } = yield call(() => import("../../actions/chat/action"))
  try {
    let data = yield getMessages(payload.cid, payload.timestamp);
    // console.log("request came getChatMessages", data.data.data.finalRess);
    let messages = [];

    if (typeof data.data.data.finalRes == "undefined") {
      messages = data.data.data.reverse();
      // yield data &&
      //   data.data &&
      //   data.data.data &&
      //   data.data.data.reverse().map((items) => {
      //     messages[items.messageId.toString()] = items;
      //   });
    }

    // console.log("GET Address  SAGA -->", chatData);
    let messagePayload = {
      messages: messages,
      cid: payload.cid,
      key: payload.name,
      pageChange: payload.timestamp ? true : false,
    };
    // console.log("GET Address  SAGA -->", messagePayload, payload.timestamp);
    yield put(setMessages(messagePayload));
  } catch (ex) {
    console.error("GET Address  SAGA Error-->", ex);
  }
}

export function* userStatus({ payload }) {
  // yield put(setChat(Chatpayload));

  // console.log("user status arrive", payload);
  try {
    // use the promise as usual
    // anytime later
    // promise.cancel();
    // delay
  } catch (ex) {
    console.error("GET Address  SAGA Error-->", ex);
  }
}

export function* getProductDetails({ payload }) {
  // yield put(setChat(Chatpayload));

  // console.log("user status arrive", payload);
  const { getProductDetail } = yield call(() => import("../../../services/assets"))
  const { getProductDetailsSuccess } = yield call(() => import("../../actions/chat/action"))
  try {
    // use the promise as usual
    // anytime later
    // promise.cancel();
    // delay
    let data = yield getProductDetail(payload);

    let productData = data.data.result;
    let { title, images, _id } = productData;
    let filterProductData = {
      _id: _id,
      title: title,
      image: (images && images[0] && images[0].url) || "",
    };
    yield put(getProductDetailsSuccess(filterProductData));
  } catch (ex) {
    console.error("GET Address  SAGA Error-->", ex);
  }
}

export function* getProductList({ payload }) {
  // console.log("request came", payload);
  let offset = payload.offset || 0;
  let limit = payload.limit || 10;
  // yield put(setChat(Chatpayload));
  const { getProductListService } = yield call(() => import("../../../services/chat"))
  const { setProductList } = yield call(() => import("../../actions/chat/action"))

  try {
    let chatData = yield getProductListService(payload.type, offset, limit);
    let chats = {};
    // console.log("GET Address  SAGA -->", chatData);
    yield chatData &&
      chatData.data &&
      chatData.data.data.map((items) => {
        // console.log("GET Address  SAGA -->", items);
        Object.keys(items);
        chats = {
          ...chats,
          [items._id.toString()]: items,
        };
        // chats[items.chatId.toString()] = items;
      });

    // console.log("GET Address  SAGA 11-->", chats);
    let Chatpayload = {
      chats: chats,
      key: payload.name,
      new: payload.new ? true : false,
      initial: payload.initial,
    };

    yield put(setProductList(Chatpayload));
  } catch (ex) {
    console.error("GET Address  SAGA Error-->", ex);
  }
}
