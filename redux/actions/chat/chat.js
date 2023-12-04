import * as actions from "./action";
const chatPrefix = "Chat";
import {
  newMesageHanlder,
  changeReadStatus,
  changeReachStatus,
  addNewChatList,
  setChat,
  changeReadCount,
  setMessages,
  chatListStatus,
  deleteChat,
  changeUserStatus,
  productData,
  setProductList,
  updateChat,
} from "./helper";
import { SET_NOTIFICATION_COUNT } from "../appConfig/action";
let intialState = {
  sale: {},
  userList: {},
  shopping: {},
  saleProducts: {},
  exchangeRecivedProducts: {},
  exchangeRecived: {},
  exchangeSend: {},
  chats: {},
  Chatshopping: {},
  exchangeRecivedshopping: {},
  ExchangeSendshopping: {},
  saleFetch: false,
  shoppingFetch: false,
  exchangeSendFetch: false,
  exchangeRecivedFetch: false,
  activeChat: "",
  saleFetchSatus: 1, //1:success  , 2:loading ,3:fail
  shoppingFetchStatus: 1, //1:success  , 2:loading ,3:fail,
  productData: {},
  notification: 0,
};

const Chat = (state = intialState, action) => {
  switch (action.type) {
    case actions.CHAT_INITIAL:
      // console.log("reduct chat state status 1", JSON.stringify(state));
      return intialState;

    case "setActiveChat":
      return {
        ...state,
        activeChat: action.payload
      }
    case actions.SET_CHAT:
      // console.log("reduct chat state status 2", JSON.stringify(state));
      return setChat(state, action.payload);
    case actions.SET_PRODUCT_LIST:
      // console.log("reduct chat state status 2", JSON.stringify(state));
      return setProductList(state, action.payload);
    case actions.SET_MESSAGES:
      // console.log("reduct chat state status 3", JSON.stringify(state));
      return setMessages(state, action.payload);
    case actions.NEW_MESSAGE:
      // console.log("reduct chat state status 444", JSON.stringify(state));
      return newMesageHanlder(state, action.payload);
    case actions.SET_SHOPPING:
      // console.log("reduct chat state status 5", JSON.stringify(state));
      return intialState;
    case actions.SET_EXCHANGE_SEND:
      // console.log("reduct chat state status 6", JSON.stringify(state));
      return intialState;
    case actions.SET_EXCHANGE_RECIVED:
      // console.log("reduct chat state status 7", JSON.stringify(state));
      return intialState;
    case actions.ADD_NEW_CHATLIST:
      // console.log("reduct chat state status 8", JSON.stringify(state));
      let data1 = action.payload;
      return addNewChatList(state, action.payload);
    case actions.CHANGE_REACH_STATUS:
      // console.log("reduct chat state status 9", JSON.stringify(state));
      return changeReachStatus(state, action.payload);
    case actions.CHANGE_READ_STATUS:
      // console.log("reduct chat state status 10", JSON.stringify(state));
      return changeReadStatus(state, action.payload);
    case actions.CHANGE_READ_COUNT:
      // console.log("reduct chat state status 11", JSON.stringify(state));
      return changeReadCount(state, action.payload);
    case actions.CHAT_LIST_STATUS:
      // console.log("reduct chat state status 12", JSON.stringify(state));
      return chatListStatus(state, action.payload);
    case actions.DELETE_CHAT:
      // console.log("reduct chat state status 13", JSON.stringify(state));
      return deleteChat(state, action.payload);
    case actions.USER_STATUS:
      // console.log("reduct chat state status 14", JSON.stringify(state));
      return changeUserStatus(state, action.payload);

    // case actions.ACTIVE_CHAT:
    //   console.log('actions.payload', actions.payload)
    //   return {
    //     ...state,
    //     activeChat: action.payload,
    //   };
    case actions.GET_PRODUCT_SUCCESS:
      return productData(state, action.payload);
    case SET_NOTIFICATION_COUNT:
      return {
        ...state,
        notification: action.payload.unreadCount,
      };

    case actions.UPDATE_CHAT:
      return updateChat(state, action.payload);

    default:
      return state;
  }
};

export default Chat;
