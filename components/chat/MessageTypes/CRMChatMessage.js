// @flow 
import * as React from 'react';
import { s3ImageLinkGen } from '../../../lib/UploadAWS/s3ImageLinkGen';
import { useSelector } from 'react-redux';
// import { ChatState } from 'isometrik-chat'
import isMobile from '../../../hooks/isMobile';
import { MessageFooter } from './MessageFooter';
import { open_drawer } from '../../../lib/global/loader';
import { handleContextMenu } from '../../../lib/helper';

export const CRMChatMessage = ({ message, isSelf }) => {
    const [mobileView] = isMobile()
    const S3_IMG_LINK = useSelector((state) => state?.appConfig?.baseUrl);
    const S3_BASE_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
    const scrolledPositionRef = React.useRef()
    // const { sidebarChatItem } = ChatState()

    const handleImageClick = (message) => {
        const assets = [{
            id: 1,
            seqId: 1,
            mediaType: "IMAGE",
            mediaThumbnailUrl: S3_IMG_LINK + '/' + message.metaData.url,
            mediaUrl: S3_IMG_LINK + '/' + message.metaData.url,
        }]
        open_drawer("openMediaCarousel", {
            assets: assets,
            selectedMediaIndex: 0,
            scrolledPositionRef: scrolledPositionRef,
            isLocked: false,
            price: message?.metaData?.price,
            isTransform: false,
            handleUnlock: () => { }
        }, "bottom")
    }

    const getImgUrl = (message) => {
        let vaultUpload = (message.metaData.url).includes("vaultMedia")
        if (vaultUpload) {
            return s3ImageLinkGen(S3_BASE_IMG_LINK, message.metaData.url, 80, 300, 300);
        } else {
            return S3_IMG_LINK + '/' + message.metaData.url;
        }
    }

    const getVideoUrl = (message) => {
        let vaultUpload = (message.metaData.url).includes("http")
        if (vaultUpload) {
            return message.metaData.url;
        } else {
            return S3_IMG_LINK + '/' + message.metaData.url;
        }
    }

    return (
        <div className={`dv_appTxtClr crmMsg py-2 px-3 ${isSelf ? 'user_self_chat' : 'user_chat'}`}>
            <div className='msgFrame cursorPtr'>
                {
                    message.metaData?.type === 'IMAGE' ?
                        <div className='chat-image' style={{ width: mobileView ? '300px' : '350px', height: mobileView ? '300px' : '350px' }} onClick={() => handleImageClick(message)}>
                            <img
                                objectFit='contain'
                                height={mobileView ? 300 : 350}
                                width={mobileView ? 300 : 350}
                                src={getImgUrl(message)}
                                contextMenu={handleContextMenu}
                                className='callout-none'
                                style={{ objectFit: 'contain', objectPosition: 'center' }}
                            />
                        </div> : ''
                }
                {
                    message.metaData?.type === 'VIDEO' ?
                        <div className='chat-video'>
                            <video width={mobileView ? 300 : 350} height={mobileView ? 300 : 350} controls controlslist="nodownload" class="jsx-2003864536">
                                <source src={getVideoUrl(message)} type="video/mp4" class="jsx-2003864536" />
                            </video>
                        </div> : ''
                }
                <MessageFooter message={message} isSelf={isSelf} />
            </div>


            <style jsx>
                {
                    `
                    .crmMsg {
                     padding:  ${mobileView ? '8px' : isSelf ? '20px 16px' : '16px'};
                     border-radius: 20px;
                     position: relative;
                     max-width: ${message.metaData?.type === 'IMAGE' || message.metaData?.type === 'VIDEO' ? mobileView ? '316px' : '382px' : '80%'} !important;
                     min-width: ${message.metaData?.type === 'IMAGE' || message.metaData?.type === 'VIDEO' ? mobileView ? '316px' : '382px' : 'auto'} !important;
                     margin-left: ${isSelf ? 'auto' : '0px'};
                     margin-right: ${isSelf ? '0px' : 'auto'};
                    }
                    .chat-time {
                        float: right;
                        font-size: 12px;
                        margin-top: 2px;
                    }
                    .txtmsg {
                        max-width: ${mobileView ? 300 : 350}px !important;
                    }
                    `
                }
            </style>
        </div>
    );
};