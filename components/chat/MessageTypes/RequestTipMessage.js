// @flow 
import * as React from 'react';
import { useSelector } from 'react-redux';
import { DOLLAR_ICON_GRADIENT } from '../../../lib/config';
import Image from '../../image/image';
import useLang from '../../../hooks/language';
import isMobile from '../../../hooks/isMobile';
import { useTheme } from 'react-jss';
import { defaultCurrency } from '../../../lib/config/creds';
import ShowMore from '../../show-more-text/ShowMoreText';
import Button from '../../button/button';
import { authenticate } from '../../../lib/global/routeAuth';
import { open_dialog, open_drawer } from '../../../lib/global/loader';
import { useRouter } from 'next/router';
import { chatTipStatus } from '../../../lib/config/chat';
import useProfileData from '../../../hooks/useProfileData';
import { CoinPrice } from '../../ui/CoinPrice';

export const RequestTipMessage = ({ message, isSelf, tipSent = false }) => {
    const S3_IMG_LINK = useSelector((state) => state?.appConfig?.baseUrl);
    const [lang] = useLang()
    const [mobileView] = isMobile()
    const theme = useTheme()
    const router = useRouter()
    const otherProfile = useSelector(state => state.chatOtherProfile)
    const [profile] = useProfileData()

    const handleTipUpdate = () => {
        authenticate(router.asPath).then(() => {
            if (mobileView) {
                open_drawer("RequestTip", {
                    creatorId: otherProfile._id,
                    creatorName: otherProfile.username,
                    editMode: true,
                    editData: {
                        amount: message?.metaData?.amount,
                        comments: message?.metaData?.comments
                    },
                    message: message
                }, 'bottom');
            } else {
                open_dialog("RequestTip", {
                    creatorId: otherProfile._id,
                    creatorName: otherProfile.username,
                    editMode: true,
                    editData: {
                        amount: message?.metaData?.amount,
                        comments: message?.metaData?.comments
                    },
                    message: message
                });
            }
        })
    }

    const handleSendTip = () => {
        if (mobileView) {
            open_drawer("SentTip", {
                creatorId: otherProfile._id,
                creatorName: otherProfile.username,
                trigger: 3,
                isRequest: true,
                tipData: {
                    amount: message?.metaData?.amount,
                    comments: message?.metaData?.comments
                },
                messageId: message.messageId,
                conversationId: message.conversationId,
                metaData: {
                    ...message?.metaData,
                    status: "SENT"
                },
                handleSubmitCallback: (payload) => { console.log("tip send") }
            }, 'bottom');
        } else {
            open_dialog("sendTip", {
                creatorId: otherProfile._id,
                creatorName: otherProfile.username,
                trigger: 3,
                isRequest: true,
                tipData: {
                    amount: message?.metaData?.amount,
                    comments: message?.metaData?.comments
                },
                messageId: message.messageId,
                conversationId: message.conversationId,
                metaData: {
                    ...message?.metaData,
                    status: "SENT"
                },
                handleSubmitCallback: (payload) => { console.log("tip send") }
            });
        }
    }

    return (
        <div className={`dv_appTxtClr tipRequestMsg ${mobileView ? 'pt-2 px-2' : ''}`}>
            <div className='tipReqInner text-app'>
                <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className='d-flex align-items-center'>
                        <Image
                            src={`${DOLLAR_ICON_GRADIENT}#dollarGradient`}
                            width={22}
                            height={22}
                            viewBox="0 0 20 20"
                        />
                        <h5 className="ml-2 text-app fntSz18 weight-600 text-center m-0">{tipSent ? isSelf ? lang.tipSent : lang.tipReceived : lang.tipRequested}</h5>
                    </div>
                    {
                        profile?.userTypeCode == '1' ? <CoinPrice price={message?.metaData?.amount} displayStyle='flex' /> : <div className={`tamn text-app fntSz18 weight-600`}>{`${defaultCurrency}${message?.metaData?.amount}`}</div>
                    }
                </div>
                {message?.metaData?.comments ? <p className='tipDesc m-0'><ShowMore text={message?.metaData?.comments} /> </p> : ""}
                {
                    !tipSent ? isSelf
                        ?
                        <div className='tip-status mt-2'>
                            {
                                message?.metaData?.status === chatTipStatus.REQUESTED ?
                                    <Button
                                        fclassname='gradient_bg text-white radius_20'
                                        btnSpanClass='text-white'
                                        onClick={handleTipUpdate}
                                    >
                                        {lang.updateTip}
                                    </Button>
                                    : message?.metaData?.status === chatTipStatus.SENT ? <div className='tip-recieved-btn w-100' style={{ padding: '1px' }}>
                                        <div className='btn-tip-bg-inner'>
                                            <div className='btn-tip-inner text-center'>
                                                {lang.chatTipReceived}
                                            </div>
                                        </div>
                                    </div> : ""
                            }
                        </div>
                        : <div className='tip-status mt-2'>
                            {
                                message?.metaData?.status === chatTipStatus.REQUESTED ?
                                    <Button
                                        fclassname='gradient_bg text-white radius_20'
                                        btnSpanClass='text-white'
                                        onClick={handleSendTip}
                                    >
                                        {lang.chatSendTip}
                                    </Button>
                                    : message?.metaData?.status === chatTipStatus.SENT ? <div className='tip-recieved-btn w-100' style={{ padding: '1px' }}>
                                        <div className='btn-tip-bg-inner'>
                                            <div className='btn-tip-inner text-center'>
                                                {lang.chatTipSent}
                                            </div>
                                        </div>
                                    </div> : ""
                            }
                        </div> : ""
                }
            </div>

            <style jsx>
                {
                    `
                    .weight-600 {
                        font-weight: 600;
                    }
                    :global(.tip-status .text-white) {
                        color: #fff !important;
                    }
                    :global(.tipRequestMsg .user_chat), :global(.tipRequestMsg .user_self_chat){
                        max-width: 100% !important;
                    }

                    .tip-recieved-btn{
                        background: linear-gradient(180deg, #D33AFF 0%, #FF71A4 100%);
                        border-radius: 32px;
                    }
                    .btn-tip-bg-inner {
                        background: ${isSelf ? 'var(--sender_chatbg)' : "var(--l_sidebar_bg)"}  !important;
                        border-radius: 32px;
                    }
                    .btn-tip-inner{
                        background: linear-gradient(180deg, rgba(211, 58, 255, 0.1) 0%, rgba(255, 113, 164, 0.1) 100%);
                        border-radius: 32px;
                        padding: 10px 15px;
                    }
                    :global(.tipRequestMsg .coinprice) {
                        font-weight: 600;
                    }
                    `
                }
            </style>
        </div>
    );
};