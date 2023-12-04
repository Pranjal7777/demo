import * as React from 'react';
import isMobile from '../../../hooks/isMobile';
import { Toast, close_dialog, close_drawer, open_dialog, open_drawer } from '../../../lib/global/loader';
import { IMAGE_LOCK_ICON2 } from '../../../lib/config/homepage';
import { shareLockedPost } from '../../../services/bulkMessage';
import { chatClient } from 'isometrik-chat'
import { getCookie } from '../../../lib/session';
import { stopLoader } from '../../../lib/global';
import { textencode } from '../../../lib/textEncodeDecode';
import { ChatState } from 'isometrik-chat';

export const useSendMedia = ({ userId, recipientId, conversationId, isFanUser }) => {
    const [mobileView] = isMobile()

    const handleSendLockPost = async (postingPayload) => {
        return new Promise(async (resolve, reject) => {
            // if (Number(postingPayload.price) === 0 || !postingPayload?.price) {
            //     await handleFreeMediaSend(postingPayload)
            //     return resolve({ status: 200 });
            // }
            let imageCount = postingPayload['postData'].filter(p => p.type === 1).length
            let videoCount = postingPayload['postData'].filter(p => p.type === 2).length
            if (postingPayload.previewData && postingPayload.previewData.length > 0) {
                imageCount += postingPayload['previewData'].filter(p => p.type === 1).length
                videoCount += postingPayload['previewData'].filter(p => p.type === 2).length
            }
            const lockPayload = {
                "userId": userId,
                "sharedTo": recipientId,
                "price": postingPayload.price,
                "currencyCode": postingPayload.currency.currency_code,
                "currencySymbol": postingPayload.currency.symbol,
                "postData": [
                    ...postingPayload.postData
                ],
                "coverImage": postingPayload.coverImage,
                "description": postingPayload.description,
                "isometrikMsgPayload": {
                    "conversationId": conversationId,
                    "showInConversation": true,
                    "metaData": {
                        "secretMessage": true,
                        imageCount: imageCount,
                        videoCount: videoCount,
                        isPreview: postingPayload.previewData && postingPayload.previewData.length > 0,
                        creatorId: userId
                    },
                    "messageType": 0,
                    "events": {
                        "updateUnreadCount": true,
                        "sendPushNotification": true
                    },
                    "encrypted": true,
                    "deviceId": getCookie('uid'),
                    "customType": "NormalMessage",
                    "conversationType": 0,
                    "isGroup": false,
                    "body": textencode("Media"),
                    "searchableTags": [
                        "Media",
                        `mediaMessage:${(Number(postingPayload.price) === 0 || !postingPayload?.price) ? 'FREE' : 'LOCKED'}`,
                        `creator_${userId}`
                    ]

                }
            }
            if (Number(postingPayload.price) === 0 || !postingPayload?.price) {
                lockPayload['sharedType'] = '1:1_FREE_SHARING'
            } else {
                lockPayload['sharedType'] = 'LOCKED_POST'
            }
            if (postingPayload.previewData && postingPayload.previewData.length > 0) {
                lockPayload['previewData'] = [...postingPayload.previewData]
            }
            if (!postingPayload.description) {
                delete lockPayload.description
            }

            shareLockedPost(lockPayload).then(res => {
                return resolve(res);
            }).catch(e => {
                Toast("Something went wrong!", 'error')
            })
        })

    }

    const handleUploadSuccess = async () => {
        // const messages = state.messages;
        // const allMsgs =
        // Object.keys(messages).length > 0 &&
        //   !!messages?.[conversationId]
        //   ? messages[conversationId]?.length > 0
        //     ? [...messages[conversationId]]?.reverse()
        //     : [messages[conversationId]]?.reverse()
        //   : "";
        // console.log("upload successssss", allMsgs)
        stopLoader()
        close_dialog()
        close_drawer()
    }

    const handleLockClick = () => {
        console.log(recipientId)
        mobileView ? open_drawer('CREATE_POST', {
            sendLocked: true,
            isFanUser: isFanUser,
            sendTo: recipientId,
            sendLockPost: handleSendLockPost,
            onUploadSuccess: handleUploadSuccess
        }, "bottom")
            : open_dialog("POST_DIALOG", {
                sendLocked: true,
                isFanUser: isFanUser,
                sendTo: recipientId,
                sendLockPost: handleSendLockPost,
                onUploadSuccess: handleUploadSuccess
            })
    }
    const lockOption = { id: 'sendLock', title: 'Lock Post', imageUrl: window.location.origin + IMAGE_LOCK_ICON2, onClick: handleLockClick }
    return { lockOption, handleMediaClick: handleLockClick }
};