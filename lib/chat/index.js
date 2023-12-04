import moment from "moment";
import { Message } from "paho-mqtt";
import { APP_NAME, MQTT_TOPIC, TRIGGER_POINT } from "../config";
import Route from "next/router";
import {
	ackSubject,
	messageSubject,
	userBlockStatus,
	changeDealStatus,
	OnlineOfflineSubject,
} from "../rxSubject";
import {
	getChatList,
	changeReachSatus,
	changeReadSatus,
	getProductList,
	getNotificationCount,
} from "../../redux/actions/chat/action";
import { newMessage, addNewChatList } from "../../redux/actions/chat/action";
import { getCookie } from "../session";
import { sendNotifications } from "../notification/handleNotification";
import { Toast } from "../global";
import btoa from "btoa";
import {
	sendMessage,
	sendChatAck,
	getUnreadChatCount
} from "../../services/chat";
import find from "lodash/find";
import { chatNotificationUnreadCnt } from "../../services/notification";
import { getChatNotificationCount } from "../../redux/actions";
import { getCognitoToken } from "../../services/userCognitoAWS";
import { FOLDER_NAME_IMAGES } from "../config/creds";
import fileUploaderAWS from "../UploadAWS/uploadAWS";
import { startLoader, stopLoader } from "../global/loader";
import dynamic from "next/dynamic";

export const MessagePayload = {
	username: "",
	// client_id: "",
	// senderId: "",
	receiverId: "",
	payload: "",
	chatId: "",
	// timestamp: moment().valueOf().toString(),
	// messageId: moment().valueOf().toString(),
	messageType: 12,
	actionType: 1,
	// assetId: "",
	// isExchange: false,
	// initiated: true,
	// retain: true,
	// topic: "",
	// qos: 1,
	profilePic: "",
	// mountpoint: "",
	// exchangeAssetId: "",
	isVipMessage: false,
};

export const chatList = {
	assetDetail: {
		userId: "",
		_id: "",
		title: "",
		description: "",
		imageUrl: "",
		price: 0,
		sold: false,
		statusCode: 4,
		statusText: "",
		title: "",
		units: { symbol: "₹", currency_code: "INR" },
	},
	assetId: "",
	chatId: "",
	deliveredAt: "",
	exchangeAssetId: "",
	groupChat: "",
	initiated: false,
	isExchange: false,
	messageId: "",
	messageType: 1,
	offerReplyStatus: null,
	payload: "",
	phoneNumber: "",
	profilePic: "",
	receiverId: "",
	recipientId: "",
	senderId: "",
	status: 3,
	totalUnread: 0,
	userName: "",
};

export const ReadAck = {
	chatId: "",
	senderId: "",
	client_id: "",
	status: 2,
	deliveryTime: moment().valueOf(),
	assetId: "",
};

export const blockUserPayload = {
	chatId: "",
};

export const ReachAck = {
	chatId: "",
	senderId: "",
	client_id: "",
	status: 3,
	readTime: moment().valueOf(),
	assetId: "",
};

// patch offer type
export const patchOfferType = {
	ACCEPTED: 1,
	REJECTED: 2,
	COUNTER: 3,
};

// put offer type
export const putOfferType = {
	EDIT: 1,
	CancelOffer: 2,
	CancelDeal: 3,
};

export const PublishMessage = async (payload, client, store) => {
	// let topic = MQTT_TOPIC.Message + "/" + payload.receiverId;
	// let topic2 = MQTT_TOPIC.Message + "/" + payload.senderId;

	// payload.timestamp = moment().valueOf();
	// payload.messageId = moment().valueOf();
	let shoppingData = store.getState().chat.shopping;

	// generate new chat not exist
	if (!shoppingData[payload.chatId] && !payload.isExchange) {
		try {
			let chatData = JSON.parse(localStorage.getItem("chatData"));
			chatData.deliveredAt = moment().valueOf();
			store.dispatch(addNewChatList(chatData));
		} catch (e) {
			console.error("ERROR IN PublishMessage", e)
		}
	}

	if (typeof payload.messageType != "undefined") {
		payload.messageType = parseInt(payload.messageType);
	}
	try {
		// let message = new Paho.Message(JSON.stringify(payload));
		// message.qos = 1;
		// message.destinationName = topic;

		// client.send(message);

		// changeDealStatus.next(payload);
		const { senderId, ...apiPayload } = payload
		sendMessage(apiPayload)
		// store.dispatch(newMessage({ ...payload, newMessage: false }));
		// let selfPayload = { ...payload };
		// selfPayload.selfMessage = true;
		// let message2 = new Paho.Message(JSON.stringify(selfPayload));
		// message2.qos = 1;
		// message2.destinationName = topic2;

		// client.send(message2);

	} catch (e) {
		console.error("error on message send", e);
	}

	if ([1, 2, 3, 4, 10].includes(parseInt(payload.messageType))) {
		let chatData = JSON.parse(localStorage.getItem("chatData")) || {};
		let title = "";
		let body = "";
		let notificationPaypoad = {
			userName: payload.username,
			profilePic: chatData.userImage,
			isExchnage: payload.isExchange,
			chatId: payload.chatId,
			isBuyer: payload.isBuyerMessage ? true : false,
			image: chatData.assetDetail && chatData.assetDetail.imageUrl,
			messageId: payload.messageId,
			assetDetail: chatData.assetDetail,
		};

		if (payload.messageType == 1) {
			title = payload.username;
			body = textdecode(payload.payload);
		} else if (payload.messageType == 2) {
			title = payload.username;
			body = `${payload.username} has sent you an image`;
		} else if (payload.messageType == 3) {
			title = payload.username;
			body = `${payload.username} has sent you an video`;
		} else if (payload.messageType == 4) {
			title = payload.username;
			body = `${payload.username} has shared location with you`;
		} else if (payload.messageType == 10) {
			title = payload.username;
			body = `${payload.username} has sent you an document`;
		}

		// console.log("sdadsdad ===>", notificationPaypoad);
		try {
			sendNotifications(payload.receiverId, title, body, notificationPaypoad, {
				isExchnage: payload.isExchange,
				chatId: payload.chatId,
				isBuyer: payload.isBuyerMessage ? true : false,
				image: chatData.assetDetail && chatData.assetDetail.imageUrl,
			});
		} catch (error) {
			Toast("Notification error", "error");
			console.error("error", error);
		}
	}
};

export const PublishCustomMessage = async ({ payloadToSend, client, topicToSend }) => {
	if (!payloadToSend || !client || !topicToSend) return;
	try {
		let message = new Message(JSON.stringify(payloadToSend));
		message.qos = 1;
		message.destinationName = topicToSend;
		console.log(message, "is the message ");
		client.send(message);
	} catch (err) {
		console.error("Error while publishing message", err);
	}
}

export const publishAck = async (payload, client, store) => {
	try {
		let sendTo = payload.sendTo;
		if (!sendTo) return;
		delete payload.sendTo;
		let message = new Message(JSON.stringify(payload));
		message.qos = 1;
		let topic = MQTT_TOPIC.Acknowledgement + "/" + sendTo;
		// console.log("ack", topic, payload);
		message.destinationName = topic;
		client.send(message);
	} catch (e) {
		console.error("ack send error", e);
	}
};

export const publishShoutOut = async (payload, client) => {
	try {
		let topic = MQTT_TOPIC.shoutout + "/" + payload.shoutoutBookingForId;
		let message = new Message(JSON.stringify({ ...payload, topic: topic }));
		message.qos = 1;
		message.destinationName = topic;

		client.send(message);
	} catch (e) {
		console.error("ack send error", e);
	}
};

export const onlineStatus = async (client) => {
	try {
		let userId = getCookie("uid");

		let payload = {
			status: 1,
			userId: userId,
			lastSeenEnabled: true,
		};
		let message = new Message(JSON.stringify(payload));
		message.qos = 1;
		let topic = MQTT_TOPIC.OnlineStatus + "/" + userId;
		// console.log("onlineStatus", topic, payload);
		message.destinationName = topic;
		message.retained = true;
		client.send(message);
	} catch (e) {
		console.error("onlineStatus error", e);
	}
};

export const offlineStatus = (client) => {
	try {
		let userId = getCookie("uid");
		let payload = {
			status: 0,
			userId: userId,
			lastSeenEnabled: true,
			timestamp: moment().valueOf(),
		};
		let message = new Message(JSON.stringify(payload));
		message.qos = 1;
		let topic = MQTT_TOPIC.OnlineStatus + "/" + userId;
		// console.log("offline status", topic, payload);
		message.destinationName = topic;
		message.retained = true;
		// client.send(message);
		return message;
	} catch (e) {
		console.error("offline Status error", e);
	}
};

export const sendChatMessage = async (payload) => {
	messageSubject.next(payload);
};

export const sendBlock = async (client, payload) => {
	try {
		let blockAck = new Message(JSON.stringify(payload));
		blockAck.qos = 1;

		blockAck.destinationName = MQTT_TOPIC.blockUser + "/" + payload.to;

		// console.log("sadsad", blockAck.destinationName, payload);
		client.send(blockAck);
	} catch (e) {
		console.error(e);
	}
};

export const newMessageCame = async (store, mqttData) => {
	try {
		if (!mqttData.isExchange) {
			let sale = store.getState().chat.sale;
			let saleProducts = store.getState().chat.saleProducts;
			let saleFatch = store.getState().chat.saleFetch;

			if (mqttData.assetId && !saleProducts[mqttData.assetId] && saleFatch) {
				store.dispatch(
					getProductList({
						name: "sale",
						type: TRIGGER_POINT.sale,
						skip: 0,
						limit: 10,
						new: true,
					})
				);
				// store.dispatch(getCha);
			}
			if (!sale[mqttData.chatId] && saleFatch) {
				store.dispatch(
					getChatList({
						name: "sale",
						type: TRIGGER_POINT.sale,
						skip: 0,
						limit: 20,
						new: true,
						assetId: mqttData.assetId,
					})
				);
				// store.dispatch(getCha);
			}
		} else {
			let exchangeRecived = store.getState().chat.exchangeRecived;
			let exchangeRecivedProducts =
				store.getState().chat.exchangeRecivedProducts;
			let exchangeRecivedFetch = store.getState().chat.exchangeRecivedFetch;

			if (
				mqttData.assetId &&
				!exchangeRecivedProducts[mqttData.assetId] &&
				exchangeRecivedFetch
			) {
				store.dispatch(
					getChatList({
						name: "exchangeRecived",
						type: TRIGGER_POINT.entry,
						skip: 0,
						limit: 20,
						new: true,
					})
				);

				// store.dispat ch(getCha);
			}
			if (!exchangeRecived[mqttData.chatId] && exchangeRecivedFetch) {
				store.dispatch(
					getChatList({
						name: "exchangeRecived",
						type: TRIGGER_POINT.entry,
						skip: 0,
						limit: 20,
						new: true,
						assetId: mqttData.assetId,
					})
				);

				// store.dispatch(getCha);
			}
		}

		ReadAck.client_id = mqttData.receiverId;
		ReadAck.chatId = mqttData.chatId;
		ReadAck.senderId = mqttData.receiverId;
		// ReadAck.fromUserId = mqttData.senderId;
		ReadAck.receiverId = mqttData.senderId;
		ReadAck.status = 2;
		ReadAck.deliveryTime = moment().valueOf();
		ReadAck.assetId = mqttData.assetId;
		// console.log("read acckckckckcck", ReadAck);
		if (!mqttData.selfMessage) {
			sendAck(ReadAck, store.dispatch);
		}

		if (store.getState().chat.chats[mqttData.chatId]) {
			if (
				find(store.getState().chat.chats[mqttData.chatId], {
					messageId: mqttData.messageId,
				})
			) {
				return;
			}
		}
		changeDealStatus.next(mqttData);
		store.dispatch(newMessage({ ...mqttData, newMessage: true }));

		if (
			store.getState().chat.activeChat != mqttData.chatId &&
			!mqttData.selfMessage
		) {
			setTimeout(() => {
				store.dispatch(getNotificationCount());
			}, 250);
		}
	} catch (e) {
		console.error(e);
	}
};

export const sendAck = ({ chatId, status, receiverId }, dispatch) => {
	sendChatAck({ chatId, status, receiverId }).then(async (res) => {
		try {
			if (status === 2 || status === 3) {
				// API Call
				let res = await getUnreadChatCount();
				if (res && res.data.count) {
					dispatch(getChatNotificationCount(res?.data.count));
				} else {
					dispatch(getChatNotificationCount(0));
				}
			}
		} catch (err) {
			if (err?.response?.status == 404) {
				dispatch(getChatNotificationCount(0));
			}
			console.error('ERROR IN notificationCnt', err)
		}
	})
	// ackSubject.next(payload);
};
export const sendBlockMessage = (payload) => {
	userBlockStatus.next(payload);
};

export const ackCame = (store, mqttData) => {
	try {
		if (parseInt(mqttData.status) == 2) {
			store.dispatch(changeReachSatus({ ...mqttData }));
		} else if (parseInt(mqttData.status) == 3) {
			store.dispatch(changeReadSatus({ ...mqttData }));
		}
	} catch (e) {
		console.error("ack status reach error", e);
	}
};

export const textencode = (str) => {
	try {
		return btoa(unescape(encodeURIComponent(str)));
	} catch (e) {
		console.error("ERROR IN textencode", e);
	}
};

export const textdecode = (str) => {
	try {
		return decodeURIComponent(escape(atob(str)));
	} catch (e) {
		console.error("ERROR IN textdecode", e);
	}
};

export const subscribe = (topic, client) => {
	try {
		client.subscribe(topic);
		// console.log("subscribe subscribe topics", topic);
	} catch (e) {
		console.error("subscribe error", e);
	}
};

export const unsubscribe = (topic, client) => {
	try {
		client.unsubscribe(topic);
		// console.log("unsubscribe subscribe", topic);
	} catch (e) {
		console.error("unsubscribe error", e);
	}
};

export const sendTypingAck = (client, { ...payload }) => {
	try {
		let typAck = new Message(JSON.stringify(payload));
		typAck.qos = 1;

		typAck.destinationName = MQTT_TOPIC.typ + "/" + payload.to;
		client.send(typAck);
	} catch (e) {
		console.error("onlineStatus error", e);
	}
};

export const handleImageUpload = async (file) => {
	return new Promise(async (res, rej) => {
		const imageFile = file;

		const options = {
			maxSizeMB: 0.6,
			maxWidthOrHeight: 1920,
			useWebWorker: true,
			fileType: file.type,
		};
		try {
			const imageCompression = (await import("browser-image-compression")).default;
			const compressedFile = await imageCompression(imageFile, options);
			console.log(compressedFile, imageFile)
			let name = file.name;
			var myFile = new File([compressedFile], name);
			const cognitoToken = await getCognitoToken();
			const tokenData = cognitoToken?.data?.data;
			const imgFileName = `${Date.now()}_${FOLDER_NAME_IMAGES.chatMedia.toLowerCase()}_thumb`;
			const folderName = `chatThumbnails/${FOLDER_NAME_IMAGES.chatMedia}`;
			const thumb = await fileUploaderAWS(imageFile, tokenData, imgFileName, false, folderName, false, true, null, true, false);
			myFile.thumb = thumb
			res(myFile);

			// thumbnailify(URL.createObjectURL(myFile), 100, (thumb) => {
			// 	myFile.thumb = thumb.replace(/^data:image\/[a-z]+;base64,/, "");
			// 	res(myFile);
			// });
			// write your own logic
		} catch (error) {
			rej(error);
			console.error(error);
		}
	});
};

export const thumbnailify = (base64Image, targetSize, callback) => {
	var img = new Image();

	img.onload = function () {
		var width = img.width,
			height = img.height,
			canvas = document.createElement("canvas"),
			ctx = canvas.getContext("2d");

		canvas.width = canvas.height = targetSize;

		ctx.drawImage(
			img,
			width > height ? (width - height) / 2 : 0,
			height > width ? (height - width) / 2 : 0,
			width > height ? height : width,
			width > height ? height : width,
			0,
			0,
			targetSize,
			targetSize
		);

		callback(canvas.toDataURL("image/png"));
	};
	img.src = base64Image;
};

export const generateThubnailFromVideo = (file, callback) => {
	return new Promise((res, rej) => {
		var video = document.createElement("VIDEO");
		video.setAttribute("src", file);
		video.currentTime = 3;
		video.load();
		let canvas = document.createElement("canvas");
		canvas.width = canvas.height = 100;
		video.addEventListener(
			"loadedmetadata",
			function () {
				setTimeout(() => {
					canvas.getContext("2d").drawImage(video, 0, 0, 100, 100);
					return res(
						canvas
							.toDataURL("image/png")
							.replace(/^data:image\/[a-z]+;base64,/, "")
					);
				}, 500);
			},
			false
		);
	});
};

export const downloadFile = (url, extension, fileName = "") => {
	fetch(url)
		.then((resp) => resp.blob())
		.then((blob) => {

			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.style.display = "none";
			a.href = url;
			fileName.length
				? a.download = `${fileName}`
				: a.download = `${APP_NAME}_${moment().valueOf()}.${extension}`;

			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
		})
		.catch((e) => {
			console.error("error", e);
		});
};

export const dateFormate = (date) => {
	const today = moment().endOf("day").valueOf();
	const yesterDay = moment().subtract(1, "day").endOf("day").valueOf();
	// console.log("dsedsda", date, yesterDay, today);
	if (date < yesterDay) {
		return moment(date).format("lll");
	} else if (date > yesterDay && date < today) {
		return `today , ${moment(date).format("hh:mm a")}`;
	} else {
		return `yesterday , ${moment(date).format("hh:mm a")}`;
	}
};

export const onlineOfflineStatus = (flag) => {
	return OnlineOfflineSubject.next(flag);
};

export const startChat = async ({ userId, userName, userProfileImage = "default-pic.png", searchableTags = [] }, isApi) => {
	startLoader()
	const { startConversation } = await import('isometrik-chat')
	console.log("startConversation", startConversation)
	const convo = await startConversation({ userId: userId, userName: userName, userProfileImage: userProfileImage, searchableTags: searchableTags })
	const convoId = convo?.conversationId
	stopLoader()
	if (isApi) {
		return convo;
	}
	Route.push('/chat?c=' + convoId)
}

export const getConversations = async (id) => {
	try {
		const { chatClient } = await import('isometrik-chat')
		const res = await chatClient()?.Conversation?.getConversations({ ids: id, includeConversationStatusMessagesInUnreadMessagesCount: false });
		return res.conversations[0];
	} catch (error) {
		console.log(error, "error");
	}
}
