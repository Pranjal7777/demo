import * as React from 'react';
import isMobile from '../../../hooks/isMobile';
import Icon from '../../image/icon';
import { CHAT_ATTACHMENT, CHAT_EMOJI, CHAT_RECORD, CHAT_SEND } from '../../../lib/config/chat';
import { ChatFooterRightOptions } from '../chatButtons/ChatFooterRightOptions';
import { useSelector } from 'react-redux';
import { useSendMedia } from './useSendMedia';
import useProfileData from '../../../hooks/useProfileData';
import OutsideAlerter from '../../../containers/OutsideAlerter';
import { P_CLOSE_ICONS } from '../../../lib/config';


const MessageSendForm = ({ conversation, isFooter, messageText, setMessageText, audioHandler, handleKeyDown, handleOnFocus, setIsShowEmojiPicker, isShowEmojiPicker, renderEmojiPicker, handleSubmit, showAudioRecordButton, audioRecorderStatus, renderAudioRecorder }) => {
    const [mobileView] = isMobile();
    const [profile] = useProfileData()
    const otherProfile = useSelector(state => state.chatOtherProfile)
    const { handleMediaClick } = useSendMedia({ recipientId: otherProfile?._id, userId: profile?._id, conversationId: conversation?.conversationId, isFanUser: otherProfile?.userTypeCode == 1 })

    function autosizeTextarea() {
        const textarea = document.getElementById("autosizeTextarea");
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
        if (textarea.value.trim() === '') {
            textarea.style.height = 'auto'; // Set a specific height when content is empty
        }
        return;
    }

    const handleInputChange = (e) => {
        e.preventDefault()
        setMessageText(e.target.value)
        autosizeTextarea()
    }

    return (
        <div className={`position-relative ${!isFooter ? "chat_footer footerChat" : "chat_footer footer"} ${mobileView ? 'chatMbFooter' : ''}`}>
            <div className='chatformWrap d-flex align-items-center'>
                {
                    !audioRecorderStatus ? <div className='msgInputWrap position-relative d-flex align-items-center'>
                        {
                            !isShowEmojiPicker ? <Icon
                                icon={`${CHAT_EMOJI}#chatEmoji`}
                                size={mobileView ? 26 : 28}
                                width={mobileView ? 26 : 28}
                                height={mobileView ? 26 : 28}
                                color={'var(--l_light_app_text)'}
                                class='chatEmoji cursorPtr'
                                onClick={() => setIsShowEmojiPicker(true)}
                            /> : <Icon
                                icon={`${P_CLOSE_ICONS}#cross_btn`}
                                size={mobileView ? 26 : 28}
                                width={mobileView ? 26 : 28}
                                height={mobileView ? 26 : 28}
                                color={'var(--l_light_app_text)'}
                                class='chatEmoji cursorPtr'
                                onClick={() => setIsShowEmojiPicker(false)}
                            />
                        }

                        <textarea
                            name="text"
                            value={messageText}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            onFocus={handleOnFocus}
                            id="autosizeTextarea"
                            className='inputText'
                            rows={1}
                            placeholder="Type a message..."
                        // onInput={autosizeTextarea}
                        />
                        {
                            !messageText ? <ChatFooterRightOptions conversation={conversation} otherProfile={otherProfile} /> : ""
                        }
                        {
                            !messageText && Number(profile?.userTypeCode) === 2 ? <Icon
                                icon={`${CHAT_ATTACHMENT}#chat_attachment`}
                                size={mobileView ? 26 : 28}
                                width={mobileView ? 26 : 28}
                                height={mobileView ? 26 : 28}
                                color={'var(--l_light_app_text)'}
                                class='chatAttachment cursorPtr'
                                style={{ marginLeft: '10px' }}
                                onClick={() => handleMediaClick()}
                            /> : ""}

                    </div> : ''
                }
                {
                    audioRecorderStatus ? renderAudioRecorder() : ''
                }

                {
                    (messageText?.length || messageText) ?
                        <div className='sendIcon cursorPtr rightIcon btnGradient_bg'> <Icon
                            icon={`${CHAT_SEND}#chat_send`}
                            color="#fff"
                            size={mobileView ? 26 : 28}
                            width={mobileView ? 26 : 28}
                            height={mobileView ? 26 : 28}
                            onClick={handleSubmit}
                        /></div> : ""
                }

                {
                    showAudioRecordButton && !messageText?.length ?
                        <div className='sendIcon cursorPtr rightIcon btnGradient_bg'> <Icon
                            icon={`${CHAT_RECORD}#micIcon`}
                            color="#fff"
                            size={mobileView ? 26 : 28}
                            width={mobileView ? 26 : 28}
                            height={mobileView ? 26 : 28}
                            onClick={audioHandler}
                        /></div> : ""
                }
            </div>
            <OutsideAlerter onClose={() => setIsShowEmojiPicker(false)}>
                {renderEmojiPicker()}
            </OutsideAlerter>

            <style jsx>
                {
                    `
                    .msgInputWrap {
                        flex: 1 1 100%;
                    }
                    .rightIcon {
                        flex: 1 1 auto;
                    }
                    .chat_footer {
                        padding: ${mobileView ? '12px' : '15px'};
                    }
                    .msgInputWrap {
                        background-color: var(--l_gray_color);
                        padding: ${mobileView ? '10px 12px' : '12px 16px'};
                        border-radius: 26px;
                    }
                    :global(.chatEmoji) {
                        align-self: flex-start;
                    }
                    .sendIcon {
                        padding: ${mobileView ? '10px' : '12px'};
                        border-radius: 50%;
                        margin-left: ${mobileView ? '10px' : '15px'};
                    }
                    .chatMbFooter {
                        position: fixed !important;
                        bottom: 0px;
                        left: 0px;
                        width: 100%;
                        z-index:999;
                    }
                    
                    `
                }
            </style>
        </div>
    );
}

const renderMessageSendForm = (props) => {
    return <MessageSendForm {...props} />
};

export default renderMessageSendForm