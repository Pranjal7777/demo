import * as React from 'react';
import { MessageFooter } from './MessageFooter';
import isMobile from '../../../hooks/isMobile';
import useLang from '../../../hooks/language';
import { CoinPrice } from '../../ui/CoinPrice';
import { getCookie, setCookie } from '../../../lib/session';
import { authenticateUserForPayment, close_dialog, close_drawer, close_progress, linkify, startLoader } from '../../../lib/global';
import parse from "html-react-parser"
import { Toast, open_dialog, open_drawer, open_progress, stopLoader } from '../../../lib/global/loader';
import { useRouter } from 'next/router';
import Button from '../../button/button';
import { defaultCurrency, isAgency } from '../../../lib/config/creds';
import { authenticate } from '../../../lib/global/routeAuth';
import { useUserWalletBalance } from '../../../hooks/useWalletData';
import { getPostById } from '../../../services/assets';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { s3ImageLinkGen } from '../../../lib/UploadAWS/s3ImageLinkGen';
import Icon from '../../image/icon';
import { BANNER_PLACEHOLDER_IMAGE, IMAGE_LOCK_ICON } from '../../../lib/config/homepage';
import { PostMediaCount } from '../../post/PostMediaCount';
import { MESSAGE_LOCKED, MESSAGE_UNLOCKED } from '../../../lib/config/chat';
import { handleContextMenu } from '../../../lib/helper';

export const LockedMessage = ({ message, isSelf, isDisabled, coversation, chatProfile, isFree, messageMenu, setMenuOpen }) => {
    const scrolledPositionRef = React.useRef()
    const [mobileView] = isMobile()
    const [lang] = useLang()
    const router = useRouter()
    const [userWalletBalance] = useUserWalletBalance()
    const [parsedDescription, setParsedDescription] = React.useState(message?.metaData?.description || "");
    const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);

    const showMoreDescText = (text, flag) => {
        const count = mobileView ? 100 : 150;
        if (!text || text.length <= count || !flag) {
            setParsedDescription(text);
        } else {
            let nText = [...text].splice(0, count - 10).join("");
            console.log("counttt", nText.length, nText)
            setParsedDescription(nText);
        }
    };

    React.useEffect(() => {
        if (message?.metaData?.description && message?.metaData?.description.length > 0) {
            showMoreDescText(message?.metaData?.description, true)
        }
    }, [])

    const commentParser = (data) => {
        const taggedUsers = [];

        let improvedData = data.replace(/(\.)/gm, " ").replace(/(\r\n|\n|\r)/gm, "<br> ");
        let txt = improvedData.split(" ");

        txt = txt.map((item) => {
            if (item.startsWith("@")) {
                const uname = item.slice(1);
                if (taggedUsers.includes(uname)) {
                    item = `<b id="${item}" class="comment_tag">${item}</b>`;
                }
            }
            if (item.startsWith("#")) {
                item = `<b id="${item}" class="hashTags">${item}</b>`;
            }
            return item;
        })
            .join(" ");

        return parse(linkify(txt), {
            replace: (domNode) => {
                if (domNode.attribs && domNode.attribs.id) {
                    domNode.attribs.onClick = () =>
                        taggedUserClickHandler(domNode.attribs.id);
                }
            },
        });
    };

    const taggedUserClickHandler = (userName) => {
        let hashtag = userName.replace('#', '');
        let updatehashtag = hashtag.replace("<br>", " ")?.split(" ")?.[0];
        let updatehashtagmob = userName.replace("<br>", " ")?.split(" ")?.[0];

        if (userName?.startsWith("#")) {
            mobileView
                ? open_drawer("HashtagFollow", {
                    hashtag: updatehashtagmob,
                    S3_IMG_LINK,
                }, "right")
                : router.push(`/explore/${updatehashtag}`)
        }

        if (userName?.startsWith("@")) {
            open_progress();
            const usersList = [];
            const uname = userName.slice(1);
            usersList.map((item) => {
                if (item.username == uname) {
                    if (getCookie("uid") == item.userId) {
                        router.push(`/profile`);
                        close_progress();
                    } else {
                        setCookie("otherProfile", `${item?.username || item?.userName}$$${item?.userId || item?.userid || item?._id}`)
                        router.push(
                            `${item.username}`
                        );
                    }
                    return;
                }
            });
        }
    };

    const handlePaymentThroughWallet = () => {
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
                        callBack: () => { Toast("Unlocked successfully", "success"); handleLockMessageClick({ ...message, metaData: { ...message.metaData, isVisible: true } }) },
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
                        callBack: () => { Toast("Unlocked successfully", "success"); handleLockMessageClick({ ...message, metaData: { ...message.metaData, isVisible: true } }) },
                        purchaseUsingCoins: true,
                        title: lang.confirm + " " + lang.unlock,
                        description: lang.purchaseMsgFor,
                        button: lang.unlock
                    });
                }
            })
        })

    }


    const handlePurchaseNewPost = () => {
        handlePaymentThroughWallet()
    }

    const handlePurchaseSuccess = () => {
        mobileView ? close_drawer() : close_dialog()
        mobileView ? open_drawer("coinsAddedSuccess", { handlePurchaseNewPost: handlePurchaseNewPost }, "bottom") : open_dialog("coinsAddedSuccess", { handlePurchaseNewPost: handlePurchaseNewPost })
    }

    const handlePurchasePost = (data = {}) => {
        authenticateUserForPayment(mobileView, lang.paymentDisabledForCreatorText).then(() => {
            if (isDisabled) {
                Toast(lang.blockedPurchaseMsg, 'error')
                return
            }
            !isAgency() && authenticate().then(() => {
                mobileView
                    ?
                    (userWalletBalance < message.metaData?.price) ?
                        open_drawer("addCoins", { handlePurchaseSuccess: handlePurchaseSuccess }, "bottom") : handlePurchaseNewPost()
                    :
                    (userWalletBalance < message.metaData?.price) ?
                        open_dialog("addCoins", { handlePurchaseSuccess: handlePurchaseSuccess }) : handlePurchaseNewPost()
            });
        })
    };

    const handleLockMessageClick = async (message) => {
        try {
            // if (isFree) {
            //     const assets = message.metaData.files.map((file, idx) => {
            //         return ({
            //             id: idx + 1,
            //             seqId: idx + 1,
            //             mediaType: file.type == 1 ? "IMAGE" : "VIDEO",
            //             mediaThumbnailUrl: file.thumbnail || file.url,
            //             mediaUrl: file.thumbnail || file.url,
            //         })
            //     })
            //     open_drawer("openMediaCarousel", {
            //         assets: assets,
            //         selectedMediaIndex: 0,
            //         scrolledPositionRef: scrolledPositionRef,
            //         isLocked: !isSelf && !message.metaData.isVisible,
            //         price: message?.metaData?.price,
            //         handleUnlock: handlePurchasePost
            //     }, "right")
            //     return
            // }
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

                const postImages = !isSelf && !message.metaData.isVisible && message.metaData?.messageType !== '1:1_FREE_SHARING' ? post.postData.filter((p, index) => index === 0).map((file, idx) => {
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
                    isLocked: !isSelf && !message.metaData.isVisible && message.metaData?.messageType !== '1:1_FREE_SHARING',
                    price: message?.metaData?.price,
                    handleUnlock: handlePurchasePost
                }, "right")
            } else {
                return
            }

        } catch (e) {
            Toast("Something went wrong!", 'error')
        }

    }

    var onlongtouch;
    var timer;
    var touchduration = 200; //length of time we want the user to touch before we do something

    function touchstart(e) {
        console.log("touch start")
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(onlongtouch, touchduration);
    }

    function touchend(e) {
        //stops short touches from firing the event
        if (timer)
            clearTimeout(timer);
        // setMenuOpen(false)
        // clearTimeout, not cleartimeout..
    }

    onlongtouch = function () { setMenuOpen(true) };

    return (
        <>
            <div className={`chat-lock-post ${isSelf ? 'user_self_chat' : 'user_chat'}`} onTouchStart={isFree && isSelf ? touchstart : () => { return }} onTouchEnd={isFree && isSelf ? touchend : () => { return }} onMouseLeave={() => setMenuOpen(false)}>
                <div className={`imgWrap ${!isSelf && (!message.metaData?.isVisible && !message.metaData?.isPreview && message.metaData?.messageType !== '1:1_FREE_SHARING') ? 'blurrImg' : ''}`} onClick={() => isSelf || message.metaData?.isVisible || message.metaData?.isPreview || message.metaData?.messageType === '1:1_FREE_SHARING' ? handleLockMessageClick(message) : handlePurchasePost()}>
                    <Image
                        key={message.metaData?.url}
                        src={s3ImageLinkGen(S3_IMG_LINK, message.metaData?.url ? message.metaData?.url.split('?')[0] : BANNER_PLACEHOLDER_IMAGE, 70, 300, 300, !isSelf && (!message.metaData?.isVisible && !message.metaData?.isPreview && message.metaData?.messageType !== '1:1_FREE_SHARING') ? 12 : 0)}
                        height={mobileView ? 300 : 350}
                        width={mobileView ? 300 : 350}
                        objectFit='contain'
                        style={{ filter: !isSelf && (!message.metaData?.isVisible && !message.metaData?.isPreview && message.metaData?.messageType !== '1:1_FREE_SHARING') ? 'blur(40px)' : 'blur(0)' }}
                        placeholder='blur'
                        blurDataURL={BANNER_PLACEHOLDER_IMAGE}
                        onContextMenu={handleContextMenu}
                        className='callout-none'
                    />
                    {/* <CustomImageSlider
                        postType={5}
                        price={message.metaData?.price || 0}
                        currency={"$"}
                        isVisible={isSelf || message.metaData?.isVisible || 0}
                        userId={message?.senderInfo?.metaData?.userId || chatProfile?.metaData?.userId}
                        postId={message.metaData?.postId}
                        height={mobileView ? '300px' : '300px'}
                        width={mobileView ? '300px' : '300px'}
                        imagesList={[{
                            url: message.metaData?.url,
                            seqId: 1,
                            type: 1,
                        }]}
                        alt={"Image Lock Post"}
                        lockedPost={true}
                        messageId={message.messageId}
                        lockedPostId={message.metaData?.postId}
                        chatId={message.conversationId}
                        size={65}
                        adjustUnlockSubscribetext={true}
                    /> */}
                    {
                        message.metaData?.mediaCount ? <div className="media-count lockpost">
                            <PostMediaCount imageCount={message.metaData?.imageCount || 0} videoCount={message.metaData?.videoCount || 0} />
                        </div> : ""
                    }
                    {
                        !isFree && isSelf ? <div className='unlockStatus'>
                            <Icon
                                icon={message?.metaData?.isVisible ? `${MESSAGE_UNLOCKED}#unlockGreen` : `${MESSAGE_LOCKED}#lockRed`}
                                color={message?.metaData?.isVisible ? '#fff': '#FF7C76'}
                                size={32}
                                unit="px"
                                viewBox="0 0 68.152 97.783"
                            />
                        </div> : <></>
                    }
                    {
                        !message.metaData.isVisible && !isSelf && message.metaData?.messageType !== '1:1_FREE_SHARING' ? <div
                            className="lockIcon d-flex flex-column align-items-center"
                            style={{
                                position: "absolute",
                                top: "45%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                zIndex: 2,
                            }}
                            onClick={() => isSelf || message.metaData?.isVisible || message.metaData?.isPreview ? handleLockMessageClick(message) : handlePurchasePost()}
                        >
                            <Icon
                                icon={`${IMAGE_LOCK_ICON}#lock_icon`}
                                color={'#fff'}
                                size={50}
                                unit="px"
                                viewBox="0 0 68.152 97.783"
                            />

                            <span className={`btn btn-default px-3 py-2 buy_post_btn font-weight-bold mt-2 ${"fntSz11" || mobileView ? 'fntSz13' : ''}`}>
                                <CoinPrice displayStyle={'flex'} price={message.metaData?.price || "0"} prefixText={lang.unlockPostFor} size={14} iconSize='14' />
                            </span>
                        </div> : ""
                    }
                    {message?.senderInfo?.metaData.userId === getCookie('uid') && !isFree ?
                        <span className={`btn btn-default px-2 py-0 gradient_bg buy_post_btn m-0 coinPrice font-weight-bold`}>
                            <div className='postPrice'>
                                {`${defaultCurrency} ${message.metaData?.price}`}
                            </div>
                        </span>
                        : ""
                    }
                </div>
                {
                    isFree && isSelf ? <div className='deletedropDown'>{messageMenu}</div> : <></>
                }
                <p className="my-2 democheckingHei text-break mb-0 hideScroll text-break" style={{ maxWidth: mobileView ? '300px' : '300px' }}>
                    {commentParser(parsedDescription)}
                    {message?.metaData?.description &&
                        message?.metaData?.description.length > (mobileView ? 100 : 150) ?
                        <>{parsedDescription.length > (mobileView ? 100 : 150) ? (
                            <a
                                onClick={() => showMoreDescText(message?.metaData?.description, true)}
                                className="cursorPtr text-underline"
                            >
                                {lang.showLess}
                            </a>
                        ) : (
                            <a
                                onClick={() => showMoreDescText(message?.metaData?.description, false)}
                                className="cursorPtr text-underline"
                            >
                                {lang.showMore}
                            </a>
                        )}</> : ""}
                </p>
                {
                    !isSelf && !message.metaData?.isVisible && message.metaData?.messageType !== '1:1_FREE_SHARING' ? <Button
                        type="button"
                        fclassname='gradient_bg rounded-pill py-3 mt-3 d-flex align-items-center justify-content-center text-white'
                        btnSpanClass='text-white'
                        btnSpanStyle={{ lineHeight: '0px', paddingTop: '2.5px' }}
                        onClick={handlePurchasePost}
                        children={'Unlock Message'}
                    /> : <></>
                }
                <MessageFooter message={message} isSelf={isSelf} />
            </div>
            <style jsx>
                {`
             .chat-lock-post {
                padding:  ${mobileView ? '8px' : isSelf ? '20px 16px' : '16px'};
                border-radius: 20px;
                position: relative;
                max-width: ${mobileView ? '316px' : '382px'};
                min-width: ${mobileView ? '316px' : '382px'};
                margin-left: ${isSelf ? 'auto' : '0px'};
                margin-right: ${isSelf ? '0px' : 'auto'};
             }
             .chat-lock-post:hover .deletedropDown {
                display: block;
             }
             :global(.chat-lock-post .coinPrice *), :global(.chat-lock-post .media-count *) {
                color: #fff !important;
             } 
             :global(.chat-lock-post .coinPrice) {
                position: absolute;
                left:${mobileView ? '10px' : '10px'};
                top: ${mobileView ? '10px' : '10px'};
                z-index: 1;
                padding: 10px 22px !important;
             }
             .text-underline {
                text-decoration: underline !important
             }
             .imgWrap {
                position: relative;
                cursor: pointer;
                border-radius: 20px; 
                overflow: hidden;
                width: ${mobileView ? '300px' : '350px'};
                height: ${mobileView ? '300px' : '350px'};
             }
             :global(.blurrImg::after) {
                display:block;
                content: "";
                width: 100%;
                height: 100%;
                position: absolute;
                top:0;
                left:0;
                background: var(--l_linear_btn_bg);
                z-index:1;
                opacity: 0.7;
              }
              :global(.unlockStatus) {
                position: absolute;
                bottom: 10px;
                right: 10px;
                padding: 6px;
                border-radius: 50%;
                background: rgb(255, 255, 255, 0.4);
              }
              .deletedropDown {
                display: none;
                position: absolute;
                right: 7px;
                top: -3px;
              }
              .media-count.lockpost {
                bottom: 10px !important;
                height: auto;
              }
              :global(.media-count.lockpost *) {
                font-size: 18px;
              }
              :global(.media-count .countItem) {
                background: linear-gradient(96.81deg, #D33AFF 0%, #FF71A4 100%) !important;
              }
            `}
            </style>
        </>
    )
};