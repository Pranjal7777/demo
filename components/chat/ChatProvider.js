
import * as React from 'react';
import { useTheme } from 'react-jss';
import { useDispatch, useSelector } from 'react-redux';
import { handleCustomChatMessage } from '../../lib/chat/handleCustomChatMessage';
import { useRouter } from 'next/router';
import useProfileData from '../../hooks/useProfileData';
import { getChatNotificationCount } from '../../redux/actions';
import dynamic from 'next/dynamic';
import { getCookie } from '../../lib/session';
import { CHAT_ATTACHMENT, CHAT_EMOJI, CHAT_RECORD, CHAT_SEND } from '../../lib/config/chat';
import { PROJECTS_CREDS, WEB_LINK } from '../../lib/config/creds';
import { renderChatMediaGallery } from './hooks/renderChatMediaGallery';
import { handleSortConvoList } from '../../lib/helper/chat';
import { renderChatUserTitle } from './hooks/renderChatUserTitle';
import { renderFiltersList } from './hooks/renderFiltersList';
import { getUnreadChatCount } from '../../services/chat';
import { Toast } from '../../lib/global/loader';
import useLang from '../../hooks/language';
import { s3ImageLinkGen } from '../../lib/UploadAWS/s3ImageLinkGen';
import renderMessageSendForm from './hooks/renderMessageSendForm';
const ChatContext = dynamic(() => import('isometrik-chat').then(module => module.ChatContext))

export const ChatProvider = ({ children, appConfig, auth }) => {
    const dispatch = useDispatch()
    // const auth = getCookie('auth');
    const theme = useTheme()
    const router = useRouter()
    const [profile] = useProfileData()
    const [lang] = useLang()
    const otherProfile = useSelector(state => state.chatOtherProfile)
    const getChatNotificationCnt = async (message) => {
        if (getCookie('auth')) {
            try {
                // API Call
                let res = await getUnreadChatCount();
                if (res && res.data.count) {
                    dispatch(getChatNotificationCount(res?.data?.count));
                } else {
                    dispatch(getChatNotificationCount(0));
                }
                // console.log("chat notification", res)
            } catch (err) {
                if (err?.response?.status == 404) {
                    dispatch(getChatNotificationCount(0));
                }
                console.error('ERROR IN getChatNotificationCnt', err)
            }
        }
    }

    React.useEffect(() => {
        getChatNotificationCnt()
    }, [router.asPath]);

    const handleMessageReceived = (message, { state, setState }) => {
        getChatNotificationCnt();
        setState((prev) => {
            const newList = handleSortConvoList(prev?.conversations || [])
            console.log("new messsageee", prev?.conversations)
            return { ...prev, conversations: newList };
        })
    }

    if (!auth) {
        return (
            <div>
                {children}
            </div>
        )
    }
    const handleOnMsgSubmit = () => {
        const textarea = document.getElementById("autosizeTextarea");
        if (textarea) {
          textarea.style.height = 'auto';
        }
    }
    return (
        <ChatContext
            dateFormat='MM/DD/YYYY'
            sortByCustomType={true}
            auth={auth}
            showStatusMessages={false}
            hideHiddenConversations={true}
            renderCustomMessage={handleCustomChatMessage}
            onConversationRead={getChatNotificationCnt}
            onMessage={handleMessageReceived}
            onViewProfilleClick={(user, convo) => {
                if (otherProfile && otherProfile?.userTypeCode == 2) {
                    if (!convo?.messagingDisabled) {
                        router.push(`/${user.userName}`)
                    } else if (convo?.messagingDisabled) {
                        Toast(lang.chatBlockedAction, 'error', 3500)
                    } else {
                        Toast(lang.reportErrMsg, 'error')
                    }
                } else if (Toast(lang.chatBlockedAction, 'error', 3500)) {
                    Toast(lang.chatBlockedAction, 'error', 3500)
                }
            }}
            baseImageUrl='https://photo.testbombshellsite.com/'
            chatTheme={theme.type} showSideChatHeader={true}
            manageMessage={profile?.userTypeCode == 2}
            isometrikCreds={!appConfig?.isometrikLicenseKey ? {
                licenseKey: PROJECTS_CREDS.licenseKey,
                projectId: PROJECTS_CREDS.projectId,
                keysetId: PROJECTS_CREDS.keysetId,
                accountId: PROJECTS_CREDS.accountId,
                appSecret: PROJECTS_CREDS.appSecret,
                userSecret: PROJECTS_CREDS.userSecret,
            } : {
                licenseKey: appConfig.isometrikLicenseKey,
                projectId: appConfig.isometrikProjectId,
                keysetId: appConfig.isometrikKeysetId,
                accountId: appConfig.isometrikAccountId,
                appSecret: appConfig.isometrikAppSecret,
                userSecret: appConfig.isometrikUserSecret,
            }}
            emojiIcon={WEB_LINK + CHAT_EMOJI}
            attachFileIcon={WEB_LINK + CHAT_ATTACHMENT}
            sendIcon={WEB_LINK + CHAT_SEND}
            recordIcon={WEB_LINK + CHAT_RECORD}
            notiFicationIcon={WEB_LINK + 'notification-icon.png'}
            renderChatMediaContainer={(args) => renderChatMediaGallery({ ...args, otherProfile: otherProfile },)}
            renderCustomChatListTile={(obj) => renderChatUserTitle({ ...obj })}
            renderChatListFilter={renderFiltersList}
            renderLastMessage={({ message, component }) => message?.metaData?.messageType === 'CRM_MESSAGE' ? <div className='chlastMessage'>{message?.body}</div> : component}
            s3ImageLinkGen={s3ImageLinkGen}
            renderCustomMessageSendForm={renderMessageSendForm}
            onMessageSent={handleOnMsgSubmit}
        >
            {children}
        </ChatContext >
    );
};