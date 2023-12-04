import * as React from 'react';
import NoChat from '../../containers/message/noChat';
import dynamic from 'next/dynamic';
import { VIPChatButton } from './chatButtons/VIPChatButton';
import { getCookie, setCookie } from '../../lib/session';
import { ChatState, chatClient } from 'isometrik-chat'
const IsoChat = dynamic(() => import('isometrik-chat'), { ssr: false })
import useProfileData from '../../hooks/useProfileData';
import { getProfile } from '../../services/auth';
import { Toast, close_dialog, close_drawer, open_dialog, open_drawer, startLoader, stopLoader } from '../../lib/global/loader';
import { getConversations } from '../../lib/chat';
import { blockChatUser, sendVipMessage, unhideChatForSender } from '../../services/chat';
import { updateChatOtherProfile, updateVipCount } from '../../redux/actions/chat/action';
import { useDispatch, useSelector } from 'react-redux';
import isMobile from '../../hooks/isMobile';
import { ChatSideBarHeader } from './ChatSideBarHeader';
import { useRouter } from 'next/router';
const BulkMsgTiles = dynamic(() => import('./bulkMsg/bulkMsgTiles'), { ssr: false });
import { VIPbadge } from './userAvatar/VIPbadge';
import { useSendMedia } from './hooks/useSendMedia';
import { SendOptions } from './chatButtons/SendOptions';
import { ChatSelfMenu } from './chatButtons/ChatSelfMenu';
import { UserBadges } from './userAvatar/UserBadges';
import { updateBlkMsgSubject } from '../../lib/rxSubject';
import { getElementMaxHeight } from '../../lib/helper';
import { useTheme } from 'react-jss';
import { handleSortConvoList } from '../../lib/helper/chat';
import useLang from '../../hooks/language';
import { ChatNotesButton } from './chatButtons/ChatNotes';
import { ChatFooterRightOptions } from './chatButtons/ChatFooterRightOptions';
import 'isometrik-chat/build/index.css'
import { ChatVideoCallButton } from './chatButtons/ChatVideoCallButton';

const MainChat = (props) => {
    const router = useRouter()
    const { state, setState, sidebarChatItem: conversation, showLoader, loading: chLoading } = ChatState()
    const dispatch = useDispatch();
    const [mobileView] = isMobile();
    const theme = useTheme();
    const userTypeCode = useSelector(state => state.profileData.userTypeCode)
    const [profile] = useProfileData()
    const [lang] = useLang();
    const [otherProfile, setOtherProfile] = React.useState()
    // const [conversation, setConversation] = React.useState()
    const currentConvo = conversation && state?.conversations ? state?.conversations.find(c => c.conversationId === conversation?.conversationId) : undefined
    const [loading, setLoading] = React.useState(false)
    const [showSearch, setShowSearch] = React.useState(false);
    const [sidebarHeight, setSidebarHeight] = React.useState(mobileView ? getElementMaxHeight([document.querySelector('.isoChat .sidebar-header'), document.querySelector('.chat-bottom-nav > div'), document.querySelector('.isoChat .searchContainer'), document.querySelector('.isoChat .chat-filters')], '100vh', 10) : getElementMaxHeight([document.querySelector('.isoChat .sidebar-header'), document.querySelector('.isoChat .searchContainer')], '100vh', 10))
    const [lastVip, setLastVip] = React.useState(false)
    const vipChatCount = useSelector(state => state.vipChatCount)
    const { bulkMsg } = router?.query;

    React.useEffect(() => {
        setSidebarHeight(mobileView ? getElementMaxHeight([document.querySelector('.isoChat .sidebar-header'), document.querySelector('.chat-bottom-nav > div'), document.querySelector('.isoChat .searchContainer'), document.querySelector('.isoChat .chat-filters')], '100vh', 10) : getElementMaxHeight([document.querySelector('.isoChat .sidebar-header'), document.querySelector('.isoChat .searchContainer'), document.querySelector('.isoChat .chat-filters')], '100vh', 10))
    }, [showSearch])

    React.useEffect(() => {
        if ((showLoader || loading) && !(bulkMsg && profile?.userTypeCode && profile?.userTypeCode !== 1)) {
            startLoader()
        } else {
            stopLoader()
        }
    }, [showLoader, loading])

    React.useEffect(() => {
        setTimeout(() => {
            setSidebarHeight(mobileView ? getElementMaxHeight([document.querySelector('.isoChat .sidebar-header'), document.querySelector('.chat-bottom-nav > div'), document.querySelector('.isoChat .searchContainer'), document.querySelector('.isoChat .chat-filters')], '100vh', 10) : getElementMaxHeight([document.querySelector('.isoChat .sidebar-header'), document.querySelector('.isoChat .searchContainer'), document.querySelector('.isoChat .chat-filters')], '100vh', 10))
        }, 200)
        return () => {
            dispatch(updateChatOtherProfile(null))
        }
    }, [])

    React.useEffect(() => {
        if (otherProfile && otherProfile?.vipMessages) {
            dispatch(updateVipCount(otherProfile?.vipMessages))
        } else {
            dispatch(updateVipCount(0))
        }
        if (otherProfile) {
            dispatch(updateChatOtherProfile(otherProfile))
        } else {
            dispatch(updateChatOtherProfile(null))
        }
    }, [otherProfile])

    // React.useEffect(() => {
    //     if (currentConvo) {
    //         console.log("currentConvo", currentConvo)
    //         if(currentConvo?.customType === "VipChat") {
    //             chatClient()?.Conversation?.getConversations({ ids: conversation?.conversationId, includeConversationStatusMessagesInUnreadMessagesCount: false }).then(res => {
    //                 console.log("get conversationssss", res)
    //             })
    //         }

    //     }
    // }, [currentConvo])
    

    const getOtherProfile = async (userId) => {
        try {
            startLoader()
            const profileRes = await getProfile(userId, getCookie('token'), getCookie('selectedCreatorId'))
            const profileData = profileRes.data?.data;
            setOtherProfile(profileData)
            dispatch(updateVipCount(profileData?.vipMessages))
            setLoading(false)
            return true
        } catch (e) {
            setLoading(false)
            stopLoader()
            setOtherProfile()
            // router.back()
            return true
        }
    }

    const fetchConversation = async (conversationId) => {
        startLoader()
        try {
            const cres = await chatClient()?.Conversation?.getConversations({ ids: conversationId, includeConversationStatusMessagesInUnreadMessagesCount: false })
            const convo = cres.conversations[0];
            if (convo) {
                setState((prev) => {
                    const allConvo = [...prev?.conversations]
                    const currentConversation = allConvo.find(c => c.conversationId === conversationId)
                    if (currentConversation) {
                        currentConversation.metaData = { ...currentConversation.metaData, ...convo };
                        const currIndex = allConvo.findIndex(c => c.conversationId === conversationId)
                        allConvo.splice(currIndex, 1, currentConversation);
                    }
                    return {
                        ...prev,
                        conversations: [...allConvo]
                    }
                })
            }
            stopLoader();
            return convo
        } catch (e) {
            console.log("chat errorr", e)
            stopLoader()
            return false
        }
    }






    const handleChatChange = async (e, conversation) => {
        setLastVip(false)
        props.onChatChange(e, conversation)
        setOtherProfile()

        if (e && conversation?.conversationId) {
            await getOtherProfile(conversation?.opponentDetails?.metaData?.userId)
            stopLoader()
        }
    }

    const unHideConvo = (currentConvo, successCallBack = () => true) => {
        return new Promise((res, rej) => {
            const creatorId = currentConvo?.createdBy === otherProfile?.isometrikUserId ? otherProfile._id : currentConvo?.createdBy === profile?.isometrikUserId ? profile?._id : undefined;
            if (creatorId) {
                unhideChatForSender({ creatorId: creatorId, conversationId: currentConvo?.conversationId }).then(res => {
                    setState((prev) => {
                        const allConvo = [...prev?.conversations]
                        const currentConvoIdx = allConvo.findIndex(c => c.conversationId === currentConvo?.conversationId)
                        if (currentConvoIdx !== -1) {
                            const currConvo = allConvo[currentConvoIdx]
                            currConvo.hiddenForCreator = false
                            allConvo.splice(currentConvoIdx, 1, currConvo)
                        }
                        return {
                            ...prev,
                            conversations: [...allConvo]
                        }
                    })
                    res(true);
                    successCallBack(true)
                }).catch(e => {
                    res(true);
                    successCallBack(false)
                })
            }
        })
    }
    const handleVipSuccess = async (res) => {
        setLastVip(false)
        dispatch(updateVipCount(res?.data?.data?.totalNumberOfMsg))
        // await getOtherProfile(conversation?.opponentDetails?.metaData?.userId)
        if (currentConvo?.hiddenForCreator) {
            unHideConvo(currentConvo)
        }
        stopLoader()
    }

    const handleCustoMsgSend = async (messagePayload) => {
        const newMsgPayload = { ...messagePayload }
        if (currentConvo?.hiddenForCreator) {
            await unHideConvo(currentConvo)
        }
        if (vipChatCount > 0) {
            newMsgPayload['metaData'] = {
                ...messagePayload['metaData'],
                messageType: 'VIP_MESSAGE'
            }
            const payload = {
                "receiverId": otherProfile._id,
                "isometrikMsgPayload": {
                    ...newMsgPayload
                }
            }
            payload.isometrikMsgPayload['metaData'] = {
                ...messagePayload['metaData'],
                messageType: 'VIP_MESSAGE'
            }
            const msgRes = await sendVipMessage(payload)
            const msgCount = msgRes.data?.data?.totalNumberOfMsg
            if (msgCount) {
                dispatch(updateVipCount(msgCount))
            }
            if (msgCount === 0) {
                dispatch(updateVipCount(0))
                setLastVip(true)
                // chatClient().Conversation.patchDetails({conversationId: conversation?.conversationId, customType: 'singleChat'})

            }
        } else {
            await chatClient()?.message?.postMessages(newMsgPayload);
        }
    }

    const handleSubmitNotes = async (conversation, notes, callBack, userId) => {
        startLoader()
        try {
            const metaData = {
                ...conversation?.metaData,
                userNotes: conversation?.metaData?.userNotes && Object.keys(conversation?.metaData?.userNotes || {}).length > 0 ? { ...conversation?.metaData?.userNotes, [userId]: notes } : { [userId]: notes }
            }
            await chatClient()?.Conversation?.patchDetails({
                conversationId: conversation?.conversationId,
                metaData: metaData,
                updateConversationWithoutNotifyingMembers: true
            })
            stopLoader()
            Toast(lang.notesSuccess)
            setState((prev) => {
                const allConvo = [...prev?.conversations]
                const currentConversation = allConvo.find(c => c.conversationId === conversation?.conversationId)
                if (currentConversation) {
                    currentConversation.metaData = { ...currentConversation.metaData, userNotes: notes };
                    const currIndex = allConvo.findIndex(c => c.conversationId === conversation?.conversationId)
                    allConvo.splice(currIndex, 1, currentConversation);
                }
                return {
                    ...prev,
                    conversations: [...allConvo]
                }
            })
            callBack()
        } catch (e) {
            console.log(e)
            stopLoader()
            Toast(lang?.reportErrMsg, 'error')
        }
    }


    const handleProfileBadge = (data, isSideBar) => {
        let isotherVip = (data?.customType === 'VipChat')

        // if (!isotherVip) {
        //     return <VIPbadge />
        // }

        return (<UserBadges conversation={data} isSideBar={isSideBar} isOtherVip={isotherVip} profile={profile} />)
    }

    if (bulkMsg && profile?.userTypeCode && profile?.userTypeCode !== 1) {
        return (
            <>
                <BulkMsgTiles />
            </>
        )
    }

    const handleSearchClick = () => {
        setShowSearch(!showSearch)
    }

    const handleBlockApi = async (payload) => {
        startLoader()
        try {
            await blockChatUser(payload)
            setOtherProfile()
            if (payload?.trigger === 'UNBLOCK') {
                getOtherProfile(conversation?.opponentDetails?.metaData?.userId)
            }
            setState((prev) => {
                const allConvo = [...prev?.conversations]
                const currentConversation = allConvo.find(c => c.conversationId === conversation?.conversationId)
                if (currentConversation) {
                    if (payload?.trigger === 'BLOCK') {
                        currentConversation.messagingDisabled = true;
                    } else {
                        if (currentConvo?.messagingDisabled) {
                            currentConversation.messagingDisabled = false;
                        }
                    }
                    const currIndex = allConvo.findIndex(c => c.conversationId === conversation?.conversationId)
                    allConvo.splice(currIndex, 1, currentConversation);
                }
                return {
                    ...prev,
                    conversations: [...allConvo]
                }
            })
            stopLoader()
        } catch (e) {
            stopLoader()
            console.log(e)
            Toast(lang.reportErrMsg, 'error')
        }
    }

    const handleBlockUnBlock = (trigger) => {
        let requestPayload = {
            opponentUserId: otherProfile?._id || conversation?.opponentDetails?.metaData?.userId,
            trigger: "BLOCK",
        };
        if (currentConvo?.messagingDisabled) {
            requestPayload.trigger = 'UNBLOCK'
        }
        if (trigger === 'BLOCK') {

            if (mobileView) {
                open_drawer("confirmDrawer", {
                    title: `Block ${otherProfile?.username || currentConvo?.opponentDetails?.userName}`,
                    subtitle: `${lang.blockSure1} ${otherProfile?.username || currentConvo?.opponentDetails?.userName}, ${lang.blockSure2}`,
                    yes: async () => {
                        handleBlockApi(requestPayload)
                    }
                }, 'bottom')
            } else {
                open_dialog("confirmDialog", {
                    title: `Block ${otherProfile?.username}`,
                    subtitle: `${lang.blockSure1} ${otherProfile?.username || currentConvo?.opponentDetails?.userName}, ${lang.blockSure2}`,
                    yes: async () => {
                        handleBlockApi(requestPayload)
                    }
                })
            }
        } else {
            handleBlockApi(requestPayload)
        }
    }


    return (
        <div className={`chatWrapper ${otherProfile?.userTypeCode !== 2 ? 'noOtherProfile' : ''}`}>
            <IsoChat
                sideBarHeaderSlot={<ChatSideBarHeader searchOpen={showSearch} onSearchClick={handleSearchClick} changeTheme={props.changeTheme} />}
                showSideBarSearch={showSearch}
                customSend={vipChatCount > 0 || currentConvo?.hiddenForCreator}
                handleCustomSend={handleCustoMsgSend}
                chatHeaderRightSlot={
                    <div className='d-flex align-items-center chatHeaderSlot'>
                        {
                            (otherProfile && otherProfile?.userTypeCode == 2 && profile?.userTypeCode == 1) ?
                                <VIPChatButton lastVip={lastVip}
                                    vipChatCount={vipChatCount}
                                    handleVipSuccess={handleVipSuccess}
                                    otherProfile={otherProfile}
                                    profile={profile}
                                    conversation={conversation}
                                    chatId={conversation?.conversationId}
                                    isDisabled={currentConvo?.messagingDisabled}
                                /> : <></>

                        }
                        {
                            profile?.userTypeCode == 2 && otherProfile ? <ChatNotesButton otherProfile={otherProfile} conversation={currentConvo} handleSubmitNotes={handleSubmitNotes} fetchConversation={fetchConversation} /> : ""
                        }
                        {
                            profile?.userTypeCode == 1 && otherProfile && otherProfile.userTypeCode == 2 && !!otherProfile?.videoCallPrice?.price ? <ChatVideoCallButton otherProfile={otherProfile} conversation={currentConvo} profile={profile} /> : ""
                        }
                    </div>

                }
                sideBarPlaceHolder={<NoChat text="No Chats !" />}
                placeHolder={mobileView ? <></> : <NoChat text="Select a chat to view conversation" />}
                onChatChange={handleChatChange}
                showSideChatHeader={false}
                renderProfileBadge={handleProfileBadge}
                // extraAttachmentOptions={extraAttachmentOptions}
                showSearchIcon={false}
                renderSelfMoremenu={(menuData, menuClick, searchShowHandler) => <ChatSelfMenu
                    menuData={menuData}
                    menuClick={menuClick}
                    searchShowHandler={searchShowHandler}
                    handleBlockUnBlock={handleBlockUnBlock}
                />}
                sortConversationList={handleSortConvoList}
                allowProfileClick={true}
                onNewConversation={(newData, setNewData) => {
                    if (newData?.lastMessageDetails?.body && !newData?.lastMessageDetails?.action && newData?.hasOwnProperty('hiddenForCreator') && newData?.hiddenForCreator) {
                        unHideConvo(newData)
                        setState((prev) => {
                            const allConvo = [...prev?.conversations]
                            const currIndex = allConvo.findIndex(c => c.conversationId === newData?.conversationId)
                            if (currIndex === -1) {
                                allConvo = [{ ...newData, hiddenForCreator: false }, ...prev?.conversations]
                            }
                            return {
                                ...prev,
                                conversations: [...allConvo]
                            }
                        })
                    } else if (newData?.lastMessageDetails?.body && !newData?.lastMessageDetails?.action) {
                        setState((prev) => {
                            const allConvo = [...prev?.conversations]
                            const currIndex = allConvo.findIndex(c => c.conversationId === newData?.conversationId)
                            if (currIndex === -1) {
                                allConvo = [{ ...newData, hiddenForCreator: false }, ...prev?.conversations]
                            }
                            return {
                                ...prev,
                                conversations: [...allConvo]
                            }
                        })
                    }
                }}
            />
            <style jsx>
                {`
                 :global(.searchBox) {
                    width: 100%;
                 }
                 :global(.isoChat .chat) {
                    background-color: var(--l_app_bg) !important;
                 }
                 :global(.isoChat .sidebar) {
                    flex: ${mobileView ? '1 1 100%' : '1 1 33.33333%'};
                    max-width: ${mobileView ? '100%' : '33.33333%'} !important;
                    min-width: ${mobileView ? '100%' : '33.33333%'} !important;
                    background-color: var(--l_app_bg) !important
                 }
                 :global(.sidebarChat) {
                    height: ${sidebarHeight} !important;
                 }
                 :global(.dark-theme), :global(.light-theme) {
                    --chat_hover: ${theme.type === 'light' ? '#e4e4e4' : 'var(--l_app_bg2)'}!important;
                    --gray_color: var(--l_profileCard_bgColor) !important;
                    --profile-color: var(--l_base) !important;
                    --sender_chatbg: ${theme.type === 'light' ? '#F9E3FF' : '#31233A'}  !important;
                    --iso_white: var(--l_app_bg) !important;
                    --modal_color:  var(--l_app_bg) !important;
                    --primary-white: var(--l_app_bg) !important;
                    --button-primary-background: var(--l_base) !important;
                    --profile-header: var(--l_profileCard_bgColor) !important;
                    --border_color: var(--l_border) !important;
                 }
                 :global(.user_self_chat *:not(svg):not(use)) {
                    color: var(--l_app_text) !important;
                 }
                 :global(.user_chat) {
                    background-color: ${theme?.chatMsgBg} !important;
                    color: var(--l_app_text) !important;
                 }
                 :global(.user_self_chat), :global(.user_chat) {
                    width: fit-content;
                    max-width: 80% !important;
                 }
                 :global(.doubleTick) {
                    position: relative;
                    width: 20px;
                    height: 10px;
                 }
                 :global(.doubleTick > svg:first-child) {
                    position: absolute;
                    top: 0;
                    left: 0;
                 }
                 :global(.doubleTick > svg:last-child) {
                    position: absolute;
                    top: 0.5px;
                    left: 5px;
                 }
                 :global(.isoChat .sidebar) {
                    position: ${mobileView ? 'absolute' : 'relative'};
                    width: ${mobileView ? '100%' : 'auto'};
                    height: ${mobileView ? 'calc(100vh - 140px)' : '100%'};
                    border-right: 1px solid var(--l_border);
                 }
                 :global(.isoChat .close_icon) {
                    position: static !important;
                 }
                 :global(.isoChat .dark_footer_icons) {
                    filter: none !important;
                }
                :global(.isoChat .contactInfo .contactTitle) {
                    margin-bottom: 0 !important;
                    color: var(--l_app_text) !important;
                    font-size: 18px !important;
                    font-weight: 700 !important;
                }
                :global(.isoChat .contactInfo .closeIcon) {
                    width: 18px; 
                    height: 18px;
                }
                :global(.isoChat .contactInfo .contact_header) {
                    align-items: center !important;
                }
                :global(.isoChat .sendBtn), :global(.isoChat .recordBtn) {
                    height: 42px;
                }
                :global(.isoChat .attachBtn) {
                    width: auto !important;
                    height: 26px !important;
                }
                :global(.isoChat .chat_footer) {
                    background: ${theme?.chatMsgBg}!important;
                }
                :global(.isoChat #autosizeTextarea) {
                    background: inherit;
                }
                :global(.isoChat .msgWrapper) {
                    position: ${mobileView ? "static" : 'relative'} !important;
                    display: ${profile?.userTypeCode == 2 || userTypeCode == 2 ? 'block' : 'none'} !important;
                }
                :global(.sidebar-search) {
                    background-color: var(--l_app_bg) !important;
                } 
                :global(.sidebar-search .searchBox) {
                    border: 1px solid var(--l_border);
                }
                :global(.isoChat .searchContainer) {
                    border-top: 1px solid var(--border_color);
                }
                :global(.isoChat .logoutBtn) {
                    background: linear-gradient(96.81deg, #D33AFF 0%, #FF71A4 100%) !important;
                    color: #ffffff !important;
                }
                :global(.isoChat .cancleBtn) {
                    border: 1px solid var(--l_base) !important;
                    background:transparent !important;
                    color: var(--l_base) !important;
                }
                :global(.isoChat .chat_headerInfo ) {
                    max-width: 38% !important;
                }
                :global(.isoChat .loader) {
                    position: relative !important;
                }
                :global(.isoChat .user_Info:hover) {
                    background: ${theme.type === 'light' ? 'var(--l_app_bg2)' : 'var(--l_sidebar_bg)'}!important;
                }
                :global(.isoChat .topProfile) {
                    padding: 20px !important;
                    background: var(--gradient);
                    margin: 0px 15px;
                    border-radius: 12px;
                }
                :global(.isoChat .contactInfo) {
                    background: var(--l_profileCard_bgColor) !important;
                    border-left: 1px solid var(--l_border);
                }
                :global(.isoChat .contactInfo .profile_img) {
                    height: 60px !important;
                    width: 60px !important;
                }
                :global(.isoChat .contactInfo .topProfile p) {
                    color: var(--white) !important;
                }
                :global(.isoChat .contactInfo .viewProfile img) {
                    height: 20px !important;
                    width: 20px !important;
                    filter: brightness(1) !important;
                }
                :global(.isoChat .contactInfo .viewProfile) {
                    padding: 15px !important;
                }
                :global(.isoChat .messageMenu) {
                    border-radius: 8px;
                    background: var(--l_profileCard_bgColor) !important;
                    padding: 0 !important;
                }
                :global(.isoChat .messageMenu .menuBox p) {
                    line-height: normal !important;
                }
                :global(.isoChat .messageMenu .menuBox p) {
                    line-height: normal !important;
                }
                :global(.isoChat .messageMenu .menuBox) {
                    padding: 12px 22px;
                }
                :global(.isoChat .messageMenu .menuBox:not(:last-child)) {
                    border-bottom: 1px solid var(--l_border);
                }
                :global(.isoChat .chatBox) {
                    background: ${theme.type === "light" ? "url(/Bombshell/images/chat/bulkMsg-white-bg.svg)" : "url(/Bombshell/images/chat/bulkMsg-bg.svg)"} !important;
                    background-position: center;
                    background-size: cover;
                }
                :global(.isoChat .messageInfoBody) {
                    background: ${theme.type === "light" ? "url(/Bombshell/images/chat/bulkMsg-white-bg.svg)" : "url(/Bombshell/images/chat/bulkMsg-bg.svg)"} !important;
                }
                :global(.isoChat .chat_header) {
                    z-index:99 !important;
                }
                :global(.isoChat .sidebar-input) {
                    width: 100%;
                }
                :global(.isoChat .searchContainer) {
                    border-width: 0px !important;
                }
                :global(.isoChat .close_search) {
                    display: flex;
                    align-items:center;
                }
                :global(.isoChat .chat_header .postBtn) {
                    font-size: ${mobileView ? '12px' : '15px'} !important; 
                }
                :global(.noOtherProfile .isoChat .contactInfo .viewProfile) {
                    display: none;
                }
                :global(.noOtherProfile .isoChat .contactInfo .topProfile *) {
                    cursor: initial !important;
                    pointer-events: none;
                }
                :global(.noOtherProfile .isoChat .contactInfo .topProfile) {
                    cursor: initial !important;
                    pointer-events: none;
                }
                :global(.isoChat .totalSpend) {
                    color: var(--l_light_green);
                    font-size: 16px;
                    line-height: 0px;
                    padding-left: 8px;
                    font-weight: 600;
                }
                :global(.isoChat .totalSpend::before) {
                    content: '';
                    width: 4px;
                    height: 4px;
                    border-radius: 50%;
                    position: absolute;
                    display: block;
                    background: var(--l_light_green);
                    top: 50%;
                    transform: translateY(-50%);
                    left: 0;
                }
                :global(.isoChat .model-content .isoChat){
                    border-radius: 12px !important;
                }
                :global(.isoChat .vipBadge) {
                    line-height: 0px;
                }
                :global(.isoChat .activeMsg *) {
                    color: #fff !important;
                }
                :global(.isoChat .chlastMessage) {
                    display: inline-block;
                    align-items: flex-start;
                    position: relative;
                    overflow-x: hidden;
                    flex-grow: 1;
                    overflow-y: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                :global(.isoChat .mainLoader) {
                    display: none !important;
                }
                :global(.isoChat .notifPermission) {
                    background: var(--l_app_bg2);
                }
                :global(.isoChat .notifPermission img) {
                    filter: ${theme.type === 'light' ? 'brightness(1)' : 'brightness(5)'};
                }
                :global(.isoChat .chat_footer) {
                    background: var(--l_app_bg)!important;
                    border-top: 1px solid var(--l_border);
                }
                `}
            </style>
        </div>
    );
};

export default MainChat; 