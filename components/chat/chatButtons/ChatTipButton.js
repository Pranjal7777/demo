import * as React from 'react';
import Icon from '../../image/icon';
import { DOLLAR_ICON } from "../../../lib/config/homepage";
import { useTheme } from 'react-jss';
import { authenticateUserForPayment } from '../../../lib/global';
import { isAgency } from '../../../lib/config/creds';
import { authenticate } from '../../../lib/global/routeAuth';
import { Toast, close_dialog, close_drawer, open_dialog, open_drawer, startLoader, stopLoader, stopPageLoader } from '../../../lib/global/loader';
import isMobile from '../../../hooks/isMobile';
import useLang from '../../../hooks/language';
import { getCookie } from '../../../lib/session';
import { useRouter } from 'next/router';
import useProfileData from '../../../hooks/useProfileData';
import { getDeviceId } from '../../../lib/helper/detectDevice';
import { textencode } from '../../../lib/chat';

export const ChatTipButton = ({ conversation, otherProfile }) => {
    const theme = useTheme()
    const [mobileView] = isMobile()
    const [lang] = useLang()
    const auth = getCookie('auth')
    const router = useRouter()
    const [profile] = useProfileData()

    const handleSubmitTip = async (tip, note) => {
        startLoader()
        try {
            const msgPayload = {
                "showInConversation": true,
                "metaData": {
                    "secretMessage": true,
                    "messageType": "TIP_SENT",
                    "amount": Number(tip),
                    "comments": note || '',
                    "status": "SENT" // REQUESTED, SENT
                },
                "messageType": 0,
                "events": {
                    "updateUnreadCount": true,
                    "sendPushNotification": true
                },
                "encrypted": true,
                "deviceId": getDeviceId(),
                "customType": "NormalMessage",
                "conversationId": conversation?.conversationId,
                "conversationType": 0,
                "isGroup": false,
                "body": "Tip",
                "searchableTags": [
                    "Tip Sent",
                    "Tip Received",
                    note || "Tip"
                ]
            }

            if (note) {
                msgPayload.searchableTags = [...msgPayload?.searchableTags, note, textencode(note)]
            }
            const { chatClient } = await import('isometrik-chat');
            await chatClient()?.message?.postMessages(msgPayload);
            stopPageLoader()
            mobileView ? close_drawer() : close_dialog()
        } catch (e) {
            stopLoader()
            console.log("tip sent", e)
            Toast(lang.somethingWrong, 'error')
        }
    }

    const handleSendTip = () => {
        authenticateUserForPayment(mobileView, lang.paymentDisabledForCreatorText, auth).then(() => {
            !isAgency() && authenticate(router.asPath).then(() => {
                if (mobileView) {
                    open_drawer("SentTip", {
                        creatorId: otherProfile._id,
                        creatorName: otherProfile.username,
                        trigger: 3,
                        successCallback: (tipAmount, anonymous, note) => {
                            if (!anonymous) {
                                handleSubmitTip(tipAmount, note)
                            }
                        }
                    }, 'bottom');
                } else {
                    open_dialog("sendTip", {
                        creatorId: otherProfile._id,
                        creatorName: otherProfile.username,
                        trigger: 3,
                        successCallback: (tipAmount, anonymous, note) => {
                            if (!anonymous) {
                                handleSubmitTip(tipAmount, note)
                            }
                        }
                    });
                }
            })
        })
    }

    return (
        <div className='chatTipBtn footerBtn' onClick={handleSendTip}>
            <Icon
                icon={`${DOLLAR_ICON}#Dollar_tip`}
                color={'var(--l_light_app_text)'}
                size={mobileView ? 26 : 28}
                class="d-flex align-items-center cursorPtr"
                viewBox="0 0 20 20"
            />
        </div>
    );
};