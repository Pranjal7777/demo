import * as React from 'react';
import { DIAMOND_COLOR } from '../../../lib/config';
import Button from '../../button/button';
import Img from '../../ui/Img/Img';
import useLang from '../../../hooks/language';
import isMobile from '../../../hooks/isMobile';
import { Toast, open_dialog, open_drawer } from '../../../lib/global/loader';
import { getblockChatUser } from '../../../services/chat';
import { authenticateUserForPayment } from '../../../lib/global';

export const VIPChatButton = ({ conversation, isDisabled, vipChatCount, lastVip, handleVipSuccess, profile, otherProfile, ...props }) => {
    const [lang] = useLang();
    const [mobileView] = isMobile();


    React.useEffect(() => {
        if (lastVip) {
            if (mobileView) {
                open_drawer("confirmDrawer", {
                    title: lang.vipMsgTitle,
                    subtitle: lang.vipMsgSubTite,
                    cancelT: lang.cancelT,
                    submitT: lang.submitT,
                    yes: () => setTimeout(() => {
                        open_drawer(
                            "VIP_MESSAGE_PLANS",
                            {
                                handleSubmit: (res) => {
                                    handleAfterPlanPurchase(res);
                                },
                                withChatUserId: conversation?.opponentDetails?.metaData?.userId,
                                creatorId: conversation?.opponentDetails?.metaData?.userId,
                                userName: otherProfile.username,
                                chatId: conversation.conversationId,
                                noRedirect: true
                            },
                            "bottom"
                        )
                    }, 500)
                }, "bottom")
            } else {
                open_dialog("confirmDialog", {
                    title: lang.vipMsgTitle,
                    subtitle: lang.vipMsgSubTite,
                    cancelT: lang.cancelT,
                    submitT: lang.submitT,
                    yes: () => setTimeout(() => {
                        open_dialog("VIP_MESSAGE_PLANS", {
                            handleSubmit: (res) => {
                                handleAfterPlanPurchase(res);
                            },
                            withChatUserId: conversation?.opponentDetails?.metaData?.userId,
                            creatorId: conversation?.opponentDetails?.metaData?.userId,
                            userName: otherProfile.username,
                            chatId: conversation.conversationId,
                            noRedirect: true
                        });
                    }, 500)
                }, "bottom")
            }
        }
    }, [lastVip])

    const authenticateChatUser = (userStatus) => {
        if (userStatus === "SUSPENDED" || userStatus === "DELETED") {
            open_dialog("successOnly", {
                wraning: true,
                label: this.state.lang.isUserSuspendedOrDeletedText,
            });
            return true
        }
        return false
    }

    const checkUserBlocked = async () => {
        let userId = ""
        try {
            let getBlockUser = await getblockChatUser(userId);
            let data = getBlockUser.data.data;
            // console.log("get User Block", getBlockUser);
            return data.blocked
        } catch (e) {
            console.error(e);
        }
    };

    const handleAfterPlanPurchase = (res) => {
        handleVipSuccess(res)
    }

    const handleClickVipPlans = async () => {
        if (vipChatCount > 0) {
            Toast(lang.alreadyVipMessage, 'warning', 3000)
            return
        }
        if (isDisabled) {
            Toast(lang.blockVipPurchase, 'error')
            return
        }
        // if (props.authenticateChatUser(profileData.statusCode)) return
        // purchase plan here
        // if (isUserblock) {
        //     return props.unBlock();
        // } else {

        authenticateUserForPayment(mobileView, lang.paymentDisabledForCreatorText).then(() => {
            mobileView
                ? open_drawer(
                    "VIP_MESSAGE_PLANS",
                    {
                        handleSubmit: (res) => {
                            handleAfterPlanPurchase(res);
                        },
                        withChatUserId: conversation?.opponentDetails?.metaData?.userId,
                        creatorId: conversation?.opponentDetails?.metaData?.userId,
                        userName: otherProfile.username,
                        chatId: conversation.conversationId,
                        noRedirect: true
                    },
                    "bottom"
                )
                : open_dialog("VIP_MESSAGE_PLANS", {
                    handleSubmit: (res) => {
                        handleAfterPlanPurchase(res);
                    },
                    withChatUserId: conversation?.opponentDetails?.metaData?.userId,
                    creatorId: conversation?.opponentDetails?.metaData?.userId,
                    userName: otherProfile.username,
                    chatId: conversation.conversationId,
                    noRedirect: true
                });
        })

        // if (mobileView) {
        //     return open_drawer("VIP_MESSAGE_POPUP", {
        //         handleSubmit: (res) => {
        //             handleAfterPlanPurchase(res);
        //         },
        //         withChatUserId: conversation?.opponentDetails?.metaData?.userId,
        //         creatorId: conversation?.opponentDetails?.metaData?.userId,
        //         userName: otherProfile.username,
        //         chatId: conversation.conversationId,
        //         noRedirect: true
        //     }, 'bottom');
        // } else {
        //     return open_dialog("VIP_MESSAGE_POPUP", {
        //         handleSubmit: (res) => {
        //             handleAfterPlanPurchase(res);
        //         },
        //         withChatUserId: conversation?.opponentDetails?.metaData?.userId,
        //         creatorId: conversation?.opponentDetails?.metaData?.userId,
        //         userName: otherProfile.username,
        //         chatId: conversation.conversationId,
        //         noRedirect: true
        //     });
        // }

        // }
    };
    return (
        <div className='vipChatBtn'>
            {
                <Button
                    onClick={handleClickVipPlans}
                    className="row btn py-2 mx-2 dv_vip_chat_count gradient_bg rounded-pill"
                    btnSpanClass="text-white noLineHeight d-flex align-items-center"
                >
                    <Img
                        src={DIAMOND_COLOR}
                        width={mobileView ? 12 : 14}
                        className="mr-1"
                        alt="Vip chat user icon"
                    />
                    <span className={`${mobileView ? 'fntSz12' : 'fntSz14'}`}>{vipChatCount > 0 ? vipChatCount : lang.vipCaps}</span>
                </Button>
            }
            <style jsx>
                {
                    `
                    :global(.vipChatBtn .dv_vip_chat_count) {
                        border-width: 0px;
                    }
                    `
                }
            </style>
        </div>
    );
};