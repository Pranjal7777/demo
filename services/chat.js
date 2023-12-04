import {
	get,
	postWithToken,
	patchWithToken,
	putWithToken,
	deleteReq,
} from "../lib/request";
import { API_URL, ISOMETRIK_MQTT_CREDS, PROJECTS_CREDS } from "../lib/config/creds";
import Axios from "axios";
import { getCookie } from "../lib/session";

const API_HOST = API_URL;
export const getGroupChat = (id) => {
	return get(`/checkChat?identifier=${id}`);
};

export const createGroup = (data) => {
	return postWithToken("/groupChat", data);
};

export const sendOffer = (data) => {
	return postWithToken("/offer", data);
};

export const sendExchnageOffer = (data) => {
	return postWithToken("/offer", data);
};

export const getChatList = (
	trigger = "ALL",
	offset = 0,
	limit = 20,
	assetId = ""
) => {
	let extendsUrl = "";
	if (assetId) {
		extendsUrl += `&assetId=${assetId}`;
	}
	return get(`/chatList?trigger=${trigger}&offset=${offset}&limit=${100}`);
};
export const getProductListService = (
	trigger = "SALES",
	offset = 0,
	limit = 10
) => {
	return get(
		`/chat/productList?trigger=${trigger}&offset=${offset}&limit=${limit}`
	);
};

export const getMessages = (id, time, pageSize = 30) => {
	time = time ? time : (new Date()).getTime();
	// pageSize = time ? 10 : 20;
	return get(`/messages?chatId=${id}&timestamp=${time}&pageSize=${pageSize}`);
};

export const fileUpload = (data) => {
	return fetch(`${API_HOST}/v1/uploadFile`, {
		method: "POST",
		body: data,
	}).then((data) => data.json());
};

// patch offer
export const patchOffer = (data) => {
	return patchWithToken("/offer", data);
};

//getRatingParamiter
export const getRatingParamiters = (linkedWith = "BUYER") => {
	return get(`/ratingParameter?statusCode=1&linkedWith=${linkedWith}`);
};

//getRatingParamiter
export const getRatedParamiter = (linkedWith = "BUYER", orderId) => {
	return get(
		`/reviewRating/ratedParameters?orderId=${orderId}&linkedWith=${linkedWith}`
	);
};

//posr rating paramiter
export const postRating = (data) => {
	return postWithToken(`/reviewRating`, data);
};

export const patchRating = (data) => {
	return patchWithToken(`/reviewRating`, data);
};
// put offer
export const putOffer = (data) => {
	return putWithToken("/offer", data);
};

// delete chat
export const deleteChatService = (payload) => {
	return deleteReq("/chats", payload, {});
};

// block user
export const blockChatUser = (data) => {
	// return patchWithToken("/user/block", data);
	return postWithToken("/user/blockUnblock", data)
};

// block user
export const getblockChatUser = (opponentId) => {
	return get(`/user/block?opponentId=${opponentId}`);
};

// put offer
export const cancelDeal = (data) => {
	return postWithToken("/orders/cancelDeal", data);
};

// generate qr code
export const generateQrcode = (data) => {
	return postWithToken("/generateQrCode", data);
};
// generate qr code
export const postQrCode = (data) => {
	return postWithToken("/qrCode", data);
};

// rating
export const getUserrate = (linkWith, userId) => {
	return get(`/userRating?linkedWith=${linkWith}&userId=${userId}`);
};

// invoice
export const getInvoice = (orderId) => {
	return get(`/orders/invoice?orderId=${orderId}`);
};

// notification count
export const getNotificationCount = () => {
	return get(`/chat/unreadCount`);
};

export const getPerticular = (chatId) => {
	return get(`/chatList/detail?chatId=${chatId}`);
};

export const getVipMessagePlansApi = (list = {}) => {
	return get(
		`/user/vipMessagePlan?limit=${list.limit || 20}&offset=${list.offset || 0}`
	);
};

export const purchaseVipMessageApi = (data) => {
	return postWithToken(`/vipMessage/purchase`, data);
};

export const sendUpdates = (data) => {
	return get(`/sendUpdates?limit=${data.limit || 10}&offset=${data.offset || 0}`);
}
export const sendMessage = (data) => {
	return postWithToken(`/message/send`, data);
}
export const sendChatAck = (data) => {
	return postWithToken(`/message/acknowledge`, data);
}

export const sendVipMessage = (data) => {
	return postWithToken('/vipMessage/send', data)
}

export const sendUpdatesAcknowledge = () => postWithToken('/sendUpdates/acknowledge');

export const getUnreadChatCount = (includeConversationStatusMessagesInUnreadMessagesCount = false, headers = {}) => {
	const finalHeaders = {
		licenseKey: PROJECTS_CREDS.licenseKey,
		appSecret: PROJECTS_CREDS?.appSecret,
		userToken: getCookie('isometrikToken'),
		...headers
	}
	return Axios.get(`${ISOMETRIK_MQTT_CREDS.API_URL}/chat/conversations/unread/count?includeConversationStatusMessagesInUnreadMessagesCount=${includeConversationStatusMessagesInUnreadMessagesCount}`, { headers: { ...finalHeaders } })
}

export const isoChatLogin = (userId) => {
	return postWithToken('/isometrik/login', { userId: userId })
}

export const unhideChatForSender = (payload) => {
	return postWithToken('/isometrik/conversation/unhide', { ...payload });
}