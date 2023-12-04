import dynamic from "next/dynamic";
import { CRMChatMessage } from "../../components/chat/MessageTypes/CRMChatMessage";
import { LockedMessage } from "../../components/chat/MessageTypes/LockedMessage";
import { VIPMessageRender } from "../../components/chat/MessageTypes/VIPMessageRender";
import { RequestTipMessage } from "../../components/chat/MessageTypes/RequestTipMessage";
import { CustomMsgWrapper } from "../../components/chat/MessageTypes/CustromMsgWrapper";

export const handleCustomChatMessage = ({ chat: message, isSelf, MessageComponent, chatProfile, messageMenu, setMenuOpen, conversation }) => {

    if (message?.metaData?.messageType === 'CRM_MESSAGE') {
        return (<CRMChatMessage message={message} isSelf={isSelf} />)
    }
    if (message?.metaData?.messageType === 'VIP_MESSAGE') {
        return (<VIPMessageRender message={message} isSelf={isSelf} MessageComponent={MessageComponent} />)
    }
    if (message?.metaData?.messageType === 'TIP_REQUEST' || message?.metaData?.messageType === 'TIP_SENT' ) {
        return (
            <CustomMsgWrapper conversation={conversation} message={message} isSelf={isSelf} chatProfile={chatProfile} messageMenu={messageMenu} setMenuOpen={setMenuOpen}>
                <RequestTipMessage message={message} isSelf={isSelf} MessageComponent={MessageComponent} tipSent={message?.metaData?.messageType === 'TIP_SENT'} />
            </CustomMsgWrapper> 
        )
    }
    if (message?.metaData?.messageType === 'LOCKED_POST' || message?.metaData?.messageType === '1:1_FREE_SHARING' || message.metaData?.messageType === 'FREE_MEDIA_CHAT' || message.metaData?.messageType === 'BULK_MESSAGE') {

        return <LockedMessage isDisabled={conversation?.messagingDisabled} conversation={conversation} message={message} isSelf={isSelf} chatProfile={chatProfile} messageMenu={messageMenu} setMenuOpen={setMenuOpen} isFree={!message?.metaData?.price} />
    }
    return MessageComponent;
};