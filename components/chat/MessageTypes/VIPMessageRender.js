// @flow 
import * as React from 'react';
import { dateFormate, textdecode } from '../../../lib/chat';
import Image from 'next/image';
import { s3ImageLinkGen } from '../../../lib/UploadAWS/s3ImageLinkGen';
import { useSelector } from 'react-redux';
import MessageStatus from '../MessageStatus';
import { ChatState } from 'isometrik-chat'
import { Icon } from '@material-ui/core';
import Img from '../../ui/Img/Img';
import { DIAMOND_COLOR } from '../../../lib/config';

export const VIPMessageRender = ({ message, isSelf, MessageComponent }) => {
    const S3_IMG_LINK = useSelector((state) => state?.appConfig?.baseUrl);
    const { sidebarChatItem } = ChatState()
    return (
        <div className={`dv_appTxtClr vipMessage`}>
            <div className='vipIcon'>
                <Img
                    src={DIAMOND_COLOR}
                    width={16}
                    className="mr-1"
                    alt="Vip chat user icon"
                />
            </div>
            {MessageComponent}

            <style jsx>
                {
                    `
                    .vipMessage {
                        position: relative;
                        max-width: 80%;
                        margin-left: ${isSelf ? 'auto' : '0px'};
                        margin-right: ${isSelf ? '0px' : 'auto'};
                    }
                    :global(.vipMessage .user_chat), :global(.vipMessage .user_self_chat){
                        max-width: 100% !important;
                    }
                    .vipIcon {
                        position: absolute;
                        top: -7px;
                        left: ${isSelf ? '-5px' : 'auto'};
                        right: ${isSelf ? 'auto' : '-7px'};
                        z-index: 2;
                    }
                    `
                }
            </style>
        </div>
    );
};