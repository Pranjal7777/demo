import { getCookie } from "../../../lib/session";
export const newMesageHanlder = (state, data) => {
  let userId = getCookie("uid");
  let stateObject = Object.assign(state);
  // console.log('stateObject', stateObject, '\ndata:', data)

  let chatExist = false;
  let chatType;
  let isVipMessage = data?.isVipMessage || false;
  let isExchange = data.isExchange ? Boolean(data.isExchange) : false;
  if (!isExchange) {
    if (stateObject["sale"][data["chatId"]]) {
      chatType = "sale";
      chatExist = true;
    } else if (stateObject["shopping"][data["chatId"]]) {
      chatType = "shopping";
      chatExist = true;
    }


  } else {
    if (stateObject["exchangeSend"][data["chatId"]]) {
      chatType = "exchangeSend";
      chatExist = true;
    } else if (stateObject["exchangeRecived"][data["chatId"]]) {
      chatType = "exchangeRecived";
      chatExist = true;
    }
  }

  if (chatExist) {

    let unreadCount = parseInt(
      stateObject[chatType][data["chatId"]].totalUnread || 0
    );

    // console.log(
    //   "chat existeedsss",
    //   !data.selfMessage,
    //   stateObject.activeChat == data["chatId"]
    // );
    if (!data.selfMessage) {
      unreadCount =
        stateObject.activeChat == data["chatId"]
          ? 0
          : parseInt(stateObject[chatType][data["chatId"]].totalUnread) + 1;
    }

    let extendsObject = {};
    if (typeof data["offerType"] != "undefined") {
      if (!data.isExchange) {
        extendsObject.lastOfferAmount = data["lastOfferAmount"];
      }

      extendsObject.lastOfferCurrency = data["lastOfferCurrency"];
      extendsObject.offerReplyUserId = data["senderId"];
      extendsObject.offerType = data["offerType"];
    }

    if (typeof data["offerId"] != "undefined") {
      extendsObject.offerId = data["offerId"];
    }

    if (typeof data["isDealCancel"] != "undefined") {
      extendsObject.isDealCancel = data["isDealCancel"] || false;
    }

    if (typeof data.offerCancelled != "undefined") {
      extendsObject.offerCancelled = data["offerCancelled"] || false;
    }
    if (typeof data.dealStatus != "undefined") {
      extendsObject.dealStatus = data["dealStatus"] || false;
    }
    if (typeof data.sellerReviewStatus != "undefined") {
      extendsObject.sellerReviewStatus = data["sellerReviewStatus"];
    }
    if (typeof data.buyerReviewStatus != "undefined") {
      extendsObject.buyerReviewStatus = data["buyerReviewStatus"];
    }
    if (typeof data.orderId != "undefined") {
      extendsObject.orderId = data["orderId"] || false;
    }
    if (typeof data.buyerQrcodeStatus != "undefined") {
      extendsObject.buyerQrcodeStatus = data["buyerQrcodeStatus"] || false;
    }
    if (typeof data.sellerQrcodeStatus != "undefined") {
      extendsObject.sellerQrcodeStatus = data["sellerQrcodeStatus"] || false;
    }
    if (data.messageType == 16) {
      extendsObject.paymentStatus = data["paymentStatus"];
    }
    let chatListObject = {
      [data["chatId"]]: {
        ...stateObject[chatType][data["chatId"]],
        receiverId: data.receiverId,
        senderId: data.senderId,
        recipientId: data.receiverId,
        messageType: data.messageType,
        payload: data.payload,
        totalUnread: unreadCount,
        status: 1,
        vipMessage: data.vipMessage ? data.vipMessage - 1 : data.vipMessage,
        type: data.isVipMessage && !data.newMessage ? 0 : 1,
        isLastVipMessage: data.isLastVipMessage || false,
        // isVipMessage: data.isVipMessage,
        ...extendsObject,
      },
    };
    if (data.isVipMessage) {
      chatListObject[data["chatId"]].type = 0
      chatListObject[data["chatId"]].isVipMessage = true;
    }
    if (!data.isVipMessage && data.senderId != userId) {
      chatListObject[data["chatId"]].type = 1;
      chatListObject[data["chatId"]].isVipMessage = false;
    }

    delete stateObject[chatType][data["chatId"]];
    stateObject[chatType] = {
      ...chatListObject,
      ...stateObject[chatType],
    };
    // if(isVipMessage){
    //   var vipChatListObject = {
    //     [data["chatId"]]: {
    //       ...stateObject['vipChat'][data["chatId"]],
    //       receiverId: data.receiverId,
    //       senderId: data.senderId,
    //       recipientId: data.receiverId,
    //       messageType: data.messageType,
    //       payload: data.payload,
    //       totalUnread: unreadCount,
    //       status: 1,
    //       ...extendsObject,
    //     },
    //   };
    //   delete stateObject['vipChat'][data["chatId"]];
    //   stateObject['vipChat'] = {
    //     ...vipChatListObject,
    //     ...stateObject['vipChat'],
    //   };
    // }

    // console.log("offertyoeeee", chatListObject, data, stateObject);
    // [data["chatId"]] = {
    //   ...stateObject[chatType][data["chatId"]],

    // };
  }

  let oldChats = state["chats"][data["chatId"]]
    ? state["chats"][data["chatId"]]
    : [];

  return {
    ...stateObject,
    chats: {
      ...state["chats"],
      [data["chatId"]]: [...oldChats, ...[data]],
    },
  };
};

export const changeReadStatus = (state, data) => {
  // console.log("changeReadStatus", data);
  let stateObject = { ...state };
  let chats = stateObject.chats[data.chatId] || [];
  chats.map((chat, index) => {
    chats[index]["status"] = 3;
  });

  stateObject.chats[data.chatId] = chats;

  let chatType = "";
  let chatExist = false;
  try {
    if (stateObject["sale"][data["chatId"]]) {
      chatType = "sale";
      chatExist = true;
    } else if (stateObject["shopping"][data["chatId"]]) {
      chatType = "shopping";
      chatExist = true;
    } else if (stateObject["exchangeSend"][data["chatId"]]) {
      chatType = "exchangeSend";
      chatExist = true;
    } else if (stateObject["exchangeRecived"][data["chatId"]]) {
      chatType = "exchangeRecived";
      chatExist = true;
    }

    if (chatExist) {
      stateObject[chatType][data.chatId]["status"] = 3;
    }
  } catch (e) {
    console.error("Error", e);
  }
  // console.log("change read count state", stateObject);
  return stateObject;
};

export const changeReachStatus = (state, data) => {
  // console.log("changeReachStatus", data);
  let stateObject = { ...state };
  let chats = stateObject.chats[data.chatId] || [];
  try {
    chats.map((items, index) => {
      if (chats[index]["status"] != 3 && chats[index]["status"] != 2) {
        chats[index]["status"] = 2;
      }
    });
  } catch (e) {
    console.error("chat reach status error", e);
  }
  stateObject.chats[data.chatId] = chats;
  // console.log("change read count state", stateObject);
  let chatType = "";
  let chatExist = false;
  if (stateObject["sale"][data["chatId"]]) {
    chatType = "sale";
    chatExist = true;
  } else if (stateObject["shopping"][data["chatId"]]) {
    chatType = "shopping";
    chatExist = true;
  } else if (stateObject["exchangeSend"][data["chatId"]]) {
    chatType = "exchangeSend";
    chatExist = true;
  } else if (stateObject["exchangeRecived"][data["chatId"]]) {
    chatType = "exchangeRecived";
    chatExist = true;
  }

  if (chatExist) {
    stateObject[chatType][data.chatId]["status"] = 2;
  }

  return stateObject;
};

export const addNewChatList = (state, data) => {
  return {
    ...state,
    shopping: {
      [data.chatId]: data,
      ...state.shopping,
    },
  };
};

export const setChat = (state, data) => {
  const activeChatId = state?.activeChat
  if (activeChatId && data.key === "sale") {
    const activeChatData = { ...state[data.key][activeChatId], totalUnread: 0, vipMessage: data.chats[activeChatId].vipMessage }
    if (Object.keys(activeChatData).length > 2) data.chats[activeChatId] = activeChatData
  }
  let chatss = {};
  if (data.new) {
    chatss = {
      ...data.chats,
      ...state[data.key],
    };
  } else {
    chatss = {
      ...state[data.key],
      ...data.chats,
    };
  }

  // if(!state[data.key + "Fetch"]){
  //   try{
  //     console.log("sadasddasd" , Object.keys(chatss));
  //     let firstChat =Object.keys(chatss)[0]

  //     if(data.key=="sale"){
  //       Router.replace(`/profile?type=message&p=sales-message&ut=user&ct=${firstChat}`)
  //     }else if(data.key=="shopping"){
  //       Router.replace(`/profile?type=message&p=shopping-message&ut=user&ct=${firstChat}`)

  //     }else if(data.key=="exchangeSend"){
  //       Router.replace(`/profile?type=message&p=exchanage-send&ut=user&ct=${firstChat}`)

  //     }else if(data.key=="exchangeRecived"){
  //       Router.replace(`/profile?type=message&p=exchange-recived&ut=user&ct=${firstChat}`)

  //     }
  //   }catch(e){
  //     console.log("sadasddasd" , e)
  //   }
  // }

  return {
    ...state,
    // chat group
    [data.key]: {
      ...chatss,
    },
    [data.key + "Fetch"]: true,
  };
};

export const setProductList = (state, data) => {
  let chatss = {};
  if (data.new) {
    chatss = {
      ...data.chats,
      ...state[data.key + "Products"],
    };
  } else {
    chatss = {
      ...state[data.key + "Products"],
      ...data.chats,
    };
  }

  // if(!state[data.key + "Fetch"]){
  //   try{
  //     console.log("sadasddasd" , Object.keys(chatss));
  //     let firstChat =Object.keys(chatss)[0]

  //     if(data.key=="sale"){
  //       Router.replace(`/profile?type=message&p=sales-message&ut=user&ct=${firstChat}`)
  //     }else if(data.key=="shopping"){
  //       Router.replace(`/profile?type=message&p=shopping-message&ut=user&ct=${firstChat}`)

  //     }else if(data.key=="exchangeSend"){
  //       Router.replace(`/profile?type=message&p=exchanage-send&ut=user&ct=${firstChat}`)

  //     }else if(data.key=="exchangeRecived"){
  //       Router.replace(`/profile?type=message&p=exchange-recived&ut=user&ct=${firstChat}`)

  //     }
  //   }catch(e){
  //     console.log("sadasddasd" , e)
  //   }
  // }

  return {
    ...state,
    // chat group
    [data.key + "Products"]: {
      ...chatss,
    },
    [data.key + "Fetch"]: true,
  };
};

export const setMessages = (state, data) => {
  let chatId = data.cid;
  let stateObject = { ...state };

  let oldChat =
    data.pageChange && stateObject["chats"][chatId]
      ? stateObject["chats"][chatId]
      : [];
  return {
    ...state,
    // chat group
    chats: {
      ...state["chats"],
      [chatId]: [...data.messages, ...oldChat],
    },
  };
};

export const changeReadCount = (state, data) => {
  if (state[data.key][data.chatId]) {
    return {
      ...state,
      notification: Math.abs(
        parseInt(state.notification) -
        parseInt(state[data.key][data.chatId].totalUnread)
      ),
      activeChat: data.chatId,
      // chat group
      [data.key]: {
        ...state[data.key],
        [data.chatId]: {
          ...state[data.key][data.chatId],
          totalUnread: 0,
        },
      },
    };
  }

  return {
    ...state,
    activeChat: data.chatId,
  };
};

export const chatListStatus = (state, data) => {
  if (state[data.key][data.chatId]) {
    return {
      ...state,
      [data.key + "FetchSatus"]: data.status,
    };
  }
};

export const changeUserStatus = (state, data) => {
  // console.log("change user statuasass", data);
  return {
    ...state,
    userList: {
      ...state.userList,
      [data.userId]: data.status,
    },
  };
};

export const deleteChat = (state, data) => {
  let stateObject = { ...state };
  let { type, chatId } = data;
  // console.log('this.props.type - action', type)

  if (type == "sale") {
    delete stateObject.sale[chatId];
  }
  // else if (type == "vipChat") {
  //   delete stateObject.vipChat[chatId];
  // } 
  else if (type == "shopping") {
    delete stateObject.shopping[chatId];
  } else if (type == "exchangeSend") {
    delete stateObject.exchangeSend[chatId];
  } else if (type == "exchangeRecived") {
    delete stateObject.exchangeRecived[chatId];
  }

  delete stateObject.chats[chatId];

  return {
    ...stateObject,
  };
};

export const productData = (state, data) => {
  // console.log("change user statuasass", data);
  return {
    ...state,
    productData: {
      ...state.productData,
      [data._id]: data,
    },
  };
};

export const updateChat = (state, data) => {
  try {
    if (state.chats.hasOwnProperty(data.chatId)) {
      let filteredChat = state.chats[data.chatId].map(updateableChat => {
        if (updateableChat.messageId === data.messageId) {
          updateableChat["isVisible"] = 1
        }

        return updateableChat;
      });

      return {
        ...state,
        chats: {
          ...state["chats"],
          [data.chatId]: filteredChat
        }
      }
    }
  } catch (err) {
    console.error("ERROR IN updateChat", err)
  }
};

export const uppercaseToCamelCase = (uppercaseText) => {
  // Convert uppercase text to camel case
  const convertToCamelCase = (text) => {
    const lowercaseText = text.toLowerCase();
    const words = lowercaseText.split('_'); // You can adjust the delimiter based on your input

    const camelCaseWords = [words[0]].concat(
      words.slice(1).map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    );

    return camelCaseWords.join('');
  };

  const camelCaseText = convertToCamelCase(uppercaseText);

  return camelCaseText;
};

export function getExcerpt( str, limit ){
  var fullText = str;
  var shortText = str;
  shortText = shortText.substr( 0, shortText.lastIndexOf( ' ', limit ) ) + '...';
  var returnString = {
      fullText: fullText,
      shortText: shortText
  };
  return returnString;
}

export const handleContextMenu = (e) => {
  e.preventDefault();
}
