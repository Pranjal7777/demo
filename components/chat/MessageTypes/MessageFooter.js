import * as React from 'react';
import { dateFormate } from '../../../lib/chat';
import MessageStatus from '../MessageStatus';
import { ChatState } from 'isometrik-chat'

export const MessageFooter = ({ message, isSelf }) => {
    const { sidebarChatItem } = ChatState()
    return (
        <div className='chat-footer'>
            <p className='mt-2 mb-0 txtmsg'>{message?.metaData?.text}</p>
            <div className='dv_appTxtClr chat-time d-flex align-items-center'>
                <div className='mr-1'>{dateFormate(message.sentAt)}</div>
                {isSelf ? <MessageStatus status={(message?.readBy ? message?.readBy?.find(r => r.userId === sidebarChatItem?.opponentDetails?.userId) : false) ? 3 : (message?.deliveredTo ? message?.deliveredTo?.find(r => r.userId === sidebarChatItem?.opponentDetails?.userId) : false) ? 2 : 1} /> : ''}
            </div>
            <style jsx>
                {
                    `
                    .chat-time {
                        float: right;
                        font-size: 12px;
                        margin-top: 2px;
                    }
                    `
                }
            </style>
        </div>
    );
};