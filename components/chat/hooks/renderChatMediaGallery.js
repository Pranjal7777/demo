import * as React from 'react';
import { getMediaMessageList } from '../../../services/bulkMessage';
import Image from '../../image/image';
import FigureCloudinayImage from '../../cloudinayImage/cloudinaryImage';
import { Toast, close_dialog, close_drawer, open_dialog, open_drawer, startLoader, stopLoader } from '../../../lib/global/loader';
import { getPostById } from '../../../services/assets';
import { authenticateUserForPayment } from '../../../lib/global';
import { defaultCurrency, isAgency } from '../../../lib/config/creds';
import { authenticate } from '../../../lib/global/routeAuth';
import isMobile from '../../../hooks/isMobile';
import { getCookie } from '../../../lib/session';
import FigureCloudinaryBlurImage from '../../cloudinayImage/cloudinaryBlurImage';
import useLang from '../../../hooks/language';
import { useUserWalletBalance } from '../../../hooks/useWalletData';
import { MESSAGE_LOCKED, MESSAGE_UNLOCKED } from '../../../lib/config/chat';
import Icon from '../../image/icon';
import PaginationIndicator from '../../pagination/paginationIndicator';
import { getElementMaxHeight, handleContextMenu } from '../../../lib/helper';
import { dateformatter } from '../../../lib/date-operation/date-operation';
import CustomDataLoader from '../../loader/custom-data-loading';
import { useSelector } from 'react-redux';


export const MediaGallery = ({ conversation, otherProfile }) => {
    const [currentTab, setCurrentTab] = React.useState(1);
    const [loading, setLoading] = React.useState(true)
    const [mediaList, setMediaList] = React.useState([])
    const scrolledPositionRef = React.useRef()
    const [pageCount, setPageCount] = React.useState(0)
    const [hasMore, setHasMore] = React.useState(true)
    const [mobileView] = isMobile()
    const userId = getCookie('uid')
    const [lang] = useLang()
    const [userWalletBalance] = useUserWalletBalance()
    const [timeGroup, setTimeGroup] = React.useState([]);
    const isDisabled = conversation?.messagingDisabled;
    const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

    React.useEffect(() => {
        let tempArray = [];
        const currIndex = 0;
        const tempFileList = [...mediaList] || [];
        tempFileList?.forEach((data, index) => {
            if (index == 0) {
                tempArray[currIndex] = [data]
            } else {
                const prevDate = new Date(tempFileList[index - 1].sentAt).getDate();
                const currDate = new Date(tempFileList[index].sentAt).getDate();
                if (currDate == prevDate) {
                    tempArray[currIndex].push(data)
                } else {
                    currIndex++;
                    tempArray[currIndex] = [data]
                }
            }
        })
        setTimeGroup(tempArray)
    }, [mediaList])

    React.useEffect(() => {
        const payload = {
            conversationId: conversation?.conversationId,
            skip: pageCount * 20,
            limit: 20
        }
        setLoading(true)
        getMediaMessageList(payload).then(res => {
            const messages = res?.data?.messages;
            if (messages) {
                console.log(messages.length)
                if (messages.length < 20) {
                    setHasMore(false)
                }
                if (pageCount > 0) {
                    setMediaList(prev => [...prev, ...messages])
                } else {
                    setMediaList(messages)
                }

            } else {
                setHasMore(false)
            }
            setLoading(false)
        }).catch(err => {
            setLoading(false)
            setHasMore(false)
        })
    }, [pageCount])

    const onMessageUnlock = (message) => {
        setMediaList((prev) => {
            const prevList = [...prev]
            const currentMsgIndex = prevList.findIndex(p => p?.messageId === message?.messageId)
            if (currentMsgIndex !== -1) {
                prevList.splice(currentMsgIndex, 1, { ...prevList[currentMsgIndex], metaData: { ...prevList[currentMsgIndex]?.metaData, isVisible: true } })
                return prevList
            }
            return prev;
        })
    }

    const handlePaymentThroughWallet = (message) => {
        authenticateUserForPayment(mobileView, lang.paymentDisabledForCreatorText).then(() => {
            !isAgency() && authenticate().then(() => {
                if (mobileView) {
                    open_drawer("buyPost", {
                        messageType: message?.metaData?.messageType === 'BULK_MESSAGE' ? "BULK" : message?.metaData?.messageType === 'LOCKED_POST' ? 'SINGLE' : '',
                        creatorId: message?.metaData?.creatorId || message?.senderInfo?.metaData?.userId || coversation?.metaData?.userId,
                        postId: message.metaData?.postId,
                        price: message.metaData?.price || 0,
                        currency: defaultCurrency,
                        postType: 5,
                        lockedPost: true,
                        messageId: message.messageId,
                        broadcastListId: message?.broadcastListId,
                        lockedPostId: message.metaData?.postId,
                        chatId: message.conversationId,
                        callBack: () => { Toast("Unlocked successfully", "success"); onMessageUnlock(message); handleLockMessageClick({ ...message, metaData: { ...message.metaData, isVisible: true } }) },
                        purchaseUsingCoins: true,
                        title: lang.confirm + " " + lang.unlock,
                        description: lang.purchaseMsgFor,
                        button: lang.unlock
                    }, "bottom"
                    )
                } else {
                    open_dialog("buyPost", {
                        messageType: message?.metaData?.messageType === 'BULK_MESSAGE' ? "BULK" : message?.metaData?.messageType === 'LOCKED_POST' ? 'SINGLE' : '',
                        creatorId: message?.metaData?.creatorId || message?.senderInfo?.metaData?.userId || coversation?.opponentDetails?.metaData?.userId,
                        postId: message.metaData?.postId,
                        price: message.metaData?.price || 0,
                        currency: defaultCurrency,
                        postType: 5,
                        lockedPost: true,
                        messageId: message.messageId,
                        broadcastListId: message?.broadcastListId,
                        lockedPostId: message.metaData?.postId,
                        chatId: message.conversationId,
                        callBack: () => { Toast("Unlocked successfully", "success"); onMessageUnlock(message); handleLockMessageClick({ ...message, metaData: { ...message.metaData, isVisible: true } }) },
                        purchaseUsingCoins: true,
                        title: lang.confirm + " " + lang.unlock,
                        description: lang.purchaseMsgFor,
                        button: lang.unlock
                    });
                }
            })
        })

    }

    const handlePurchaseNewPost = (message) => {
        handlePaymentThroughWallet(message)
    }

    const handlePurchaseSuccess = (message) => {
        mobileView ? close_drawer() : close_dialog()
        mobileView ? open_drawer("coinsAddedSuccess", { handlePurchaseNewPost: () => handlePurchaseNewPost(message) }, "bottom") : open_dialog("coinsAddedSuccess", { handlePurchaseNewPost: () => handlePurchaseNewPost(message) })
    }

    const handlePurchasePost = (message) => {
        authenticateUserForPayment(mobileView, lang.paymentDisabledForCreatorText).then(() => {
            if (isDisabled) {
                Toast(lang.blockedPurchaseMsg, 'error')
                return
            }
            !isAgency() && authenticate().then(() => {
                mobileView
                    ?
                    (userWalletBalance < message.metaData?.price) ?
                        open_drawer("addCoins", { handlePurchaseSuccess: () => handlePurchaseSuccess(message) }, "bottom") : handlePurchaseNewPost(message)
                    :
                    (userWalletBalance < message.metaData?.price) ?
                        open_dialog("addCoins", { handlePurchaseSuccess: () => handlePurchaseSuccess(message) }) : handlePurchaseNewPost(message)
            });
        })
    };

    const checkIfLocked = (message, isSelf) => {
        return !isSelf && !message.metaData.isVisible && message.metaData?.messageType !== '1:1_FREE_SHARING'
    }

    const handleLockMessageClick = async (message) => {
        const isSelf = isAgency() ? message?.metaData?.creatorId === selectedCreatorId : message?.metaData?.creatorId === userId;
        const isMsgLocked = checkIfLocked(message, isSelf)

        try {
            startLoader()
            const postRes = await getPostById(message?.metaData?.postId)
            const post = postRes?.data?.result[0];
            stopLoader()
            if (post.isVisible || isSelf || message.metaData?.isPreview) {
                const assets = [];
                if (post.previewData && post.previewData.length > 0) {
                    const previewList = post.previewData.map((file, idx) => {
                        return ({
                            id: idx + 1,
                            seqId: idx + 1,
                            mediaType: file.type == 1 ? "IMAGE" : "VIDEO",
                            mediaThumbnailUrl: file.thumbnail || file.url,
                            mediaUrl: file.url || file.thumbnail,
                            isPreview: true
                        })
                    })
                    assets = [...previewList]
                }

                const postImages = isMsgLocked ? post.postData.filter((p, index) => index === 0).map((file, idx) => {
                    return ({
                        id: idx + post.previewData ? post.previewData.length : 1,
                        seqId: idx + post.previewData ? post.previewData.length : 1,
                        mediaType: file.type == 1 ? "IMAGE" : "VIDEO",
                        mediaThumbnailUrl: file.thumbnail || file.url,
                        mediaUrl: file.url || file.thumbnail,
                        isLocked: true
                    })
                }) : post.postData.map((file, idx) => {
                    return ({
                        id: idx + post.previewData ? post.previewData.length : 1,
                        seqId: idx + post.previewData ? post.previewData.length : 1,
                        mediaType: file.type == 1 ? "IMAGE" : "VIDEO",
                        mediaThumbnailUrl: file.thumbnail || file.url,
                        mediaUrl: file.url || file.thumbnail,
                    })
                })

                assets = [...assets, ...postImages]

                open_drawer("openMediaCarousel", {
                    assets: assets,
                    selectedMediaIndex: 0,
                    scrolledPositionRef: scrolledPositionRef,
                    isLocked: isMsgLocked,
                    price: message?.metaData?.price,
                    handleUnlock: () => handlePurchasePost(message)
                }, "right")
            } else {
                return
            }

        } catch (e) {
            console.log(e)
            Toast("Something went wrong!", 'error',)
        }

    }

    return (<div className='chat-gallery' style={{ maxHeight: getElementMaxHeight([document.querySelector('.isoChat .contactInfo .contact_header'), document.querySelector('.isoChat .contactInfo .topProfile')], '100vh'), overflow: 'auto' }} id='chatMediaList'>
        <h3 className='my-2 fntSz20 dv_appTxtClr sectionHeading'>Media Files</h3>
        {/* <div className='postTabs d-flex'>
            <div className={`tabItem ${currentTab === 1 ? 'active gradient_bg' : ''}`} onClick={() => setCurrentTab(1)}>Mass Messages</div>
            <div className={`tabItem ${currentTab === 2 ? 'active gradient_bg' : ''}`} onClick={() => setCurrentTab(2)}>Personal Messages</div>
        </div> */}

        {
            timeGroup.map((tData, tIndex) => {
                const timeLine = dateformatter(tData[0].sentAt)
                return (
                    <div key={`tData_${tIndex}`}>
                        <h5 className='timeLine'>
                            {timeLine}
                        </h5>
                        <div className='row mx-0'>
                            < div className='chatMediaRow d-flex w-100'>
                                {
                                    tData?.map?.(message => {
                                        const isSelf = isAgency() ? message?.metaData?.creatorId === selectedCreatorId : message?.metaData?.creatorId === userId;
                                        const isMsgLocked = checkIfLocked(message, isSelf)
                                        return (
                                            <div className='col-4 p-0 my-1 mediaItem position-relative cursorPtr' onClick={() => { handleLockMessageClick(message) }} key={message?.messageId}>
                                                <div className='mr-2 subWrap callout-none' onContextMenu={handleContextMenu}>
                                                    {
                                                        isMsgLocked
                                                            ? <FigureCloudinaryBlurImage publicId={message?.metaData?.url} alt="chat media"
                                                                transformWidth={300}
                                                                transformHeight={300}
                                                                quality={75}
                                                                style={{ objectFit: 'cover' }}
                                                            />
                                                            : <FigureCloudinayImage
                                                                publicId={message?.metaData?.url}
                                                                transformWidth={300}
                                                                transformHeight={300}
                                                                quality={75}
                                                                alt="chat media"
                                                                style={{ objectFit: 'cover' }}
                                                            />
                                                    }
                                                    {
                                                        isSelf && message?.metaData?.price ? <div className='unlockStatus'>
                                                            <Icon
                                                                icon={message?.metaData?.isVisible ? `${MESSAGE_UNLOCKED}#unlockGreen` : `${MESSAGE_LOCKED}#lockRed`}
                                                                color={message?.metaData?.isVisible ? '#fff' : '#FF7C76'}
                                                                size={24}
                                                                unit="px"
                                                                viewBox="0 0 68.152 97.783"
                                                            />
                                                        </div> : ""
                                                    }
                                                </div>

                                            </div>
                                        )
                                    })
                                }
                                <PaginationIndicator
                                    id="chatMediaList"
                                    totalData={mediaList}
                                    pageEventHandler={() => {
                                        if (!loading && hasMore) {
                                            setPageCount(prev => prev + 1)
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>)
            })
        }
        <div className='d-flex justify-content-center py-2'>
            <CustomDataLoader loading={loading} />
        </div>

        {
            !loading && !hasMore && !mediaList?.length ? <div className='noData dv_appTxtClr py-2'>{lang.noMediaFiles}</div> : ""
        }
        <style jsx>
            {`
            .chat-gallery {
                padding: 15px;
            }
            .chat-gallery .tabItem {
                padding: 8px 22px;
                color: var(--l_light_app_text);
                border: 1px solid var(--l_border);
                border-radius: 28px;
                cursor: pointer;
            }
            .chat-gallery .tabItem.active {
                color: var(--l_app_text);
            }
            .chat-gallery .tabItem:not(:first-child) {
                margin-left: 15px;
            }
            .chat-gallery .mediaItem {
                aspect-ratio: 1/1;
                flex: 1 1 333.333%;
              }
            :global(.mediaItem .lazy-load-image-loaded) {
                height:100% !important;
                width: 100% !important;
            }
            .subWrap {
                border-radius: 18px;
                overflow: hidden;
                aspect-ratio: 1/1;
            }
            :global(.chat-gallery .lockIcon svg) {
                width: 40px !important;
            }
            :global(.unlockStatus) {
                position: absolute;
                top: 10px;
                right: 10px;
                padding: 6px;
                border-radius: 50%;
                background: var(--l_badge_light);
                height: fit-content;
              }
            .chatMediaRow {
                flex-wrap: wrap;
            }
            :global(.chatMediaRow img){
                object-fit: cover;
            }
            .timeLine {
                font-size: 18px;
                font-weight: 400;
                margin-top: 20px;
                margin-bottom: 8px;
            }
            `}
        </style>
    </div >)
}


export const renderChatMediaGallery = ({ ...props }) => {
    return (
        <MediaGallery {...props} />
    );
};