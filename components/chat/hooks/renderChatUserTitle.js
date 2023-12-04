import { useMemo } from "react";
import useLang from "../../../hooks/language";
import { textdecode, textencode } from "../../../lib/textEncodeDecode";
import { chatTipStatus } from "../../../lib/config/chat";
import { getCookie } from "../../../lib/session";


const UserTileComponent = ({ data, index, renderuserDetails }) => {
    const [lang] = useLang()
    let convoData = { ...data };

    const getMessageByAction = (msg) => {
        switch (msg?.action) {
            case "userBlockConversation":
                return 'Conversation Blocked'
            case "userUnblockConversation":
                return 'Conversation Unblocked'
            case "messageDetailsUpdated":
                if (msg?.details?.metaData?.isVisible) {
                    return 'Message Unlocked'
                }
                if (msg?.details?.metaData?.messageType === 'TIP_REQUEST' && msg?.details?.metaData?.status === chatTipStatus.SENT) {
                    if(msg?.userId === getCookie("isometrikUserId")) {
                        return 'Tip Received'
                    }
                    return 'Tip Sent'
                }
                if (msg?.details?.metaData?.messageType === 'TIP_REQUEST' && msg?.details?.metaData?.status === chatTipStatus.REQUESTED) {
                    return 'Tip Request Updated'
                }
                return textdecode(msg.body)
            case "conversationDetailsUpdated":
                if (msg?.details?.customType === "VipChat") {
                    return 'VIP Purchased'
                }
                if (msg?.details?.customType === "SingleChat") {
                    return 'VIP Completed'
                }
                return ""
            default:
                return ""
        }
    }

    if (convoData.lastMessageDetails.action && !convoData.lastMessageDetails.body) {
        convoData.lastMessageDetails.body = convoData.lastMessageDetails.action ? textencode(getMessageByAction(convoData.lastMessageDetails)) : ''
    }

    return (<>{renderuserDetails(convoData, index)}</>)
}



export const renderChatUserTitle = ({ data, index, renderuserDetails }) => {
    if (!data) return null

    return (
        <UserTileComponent data={data} index={index} renderuserDetails={renderuserDetails} />
    );
};