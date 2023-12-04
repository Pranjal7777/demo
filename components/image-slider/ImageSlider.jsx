import FigureCloudinayImage from "../cloudinayImage/cloudinaryImage";
import Carousel, { consts } from "react-elastic-carousel";
import { close_dialog, close_drawer, open_dialog, open_drawer } from "../../lib/global/loader";
import { authenticate } from "../../lib/global/routeAuth";
import isMobile from "../../hooks/isMobile";
import {
  DV_Sent_Tip,
  BANNER_PLACEHOLDER_IMAGE,
  UNLOCK_ICON,
  rightSideIconWhite,
  leftSideIconWhite,
  DOLLAR_ICON,
  IMAGE_LOCK_ICON2,
  COVER_IMAGE_ICON,
} from "../../lib/config/homepage";
import Img from "../ui/Img/Img";
import { getCookie } from "../../lib/session";
import Icon from "../image/icon";
import { useTheme } from "react-jss";
import useLang from "../../hooks/language"
import { useRouter } from "next/router";
import FeedVideoPlayer from "../videoplayer/feed-video-player";
import { useEffect, useRef, useState } from "react";
import { IMAGE_OUTLINE_ICON, VIDEO_OUTLINE_ICON } from "../../lib/config";
import { PostMediaCount } from "../post/PostMediaCount";
import { CoinPrice } from "../ui/CoinPrice";
import { isAgency, defaultCurrency } from "../../lib/config/creds";
import { useSelector } from "react-redux";
import { authenticateUserForPayment, isOwnProfile } from "../../lib/global";
import { useUserWalletBalance } from "../../hooks/useWalletData";
import { s3ImageLinkGen } from "../../lib/UploadAWS/uploadAWS";
import { handleContextMenu } from "../../lib/helper";

/**
 * @description Image slider for Cloudinary images ( using in timeline Posts )
 * Old Code By
 * @author Jagannath
 * @date 2020-12-15
 * @param props{
 *  imagesList: object[] - array of object containing "url" key [{url: ""}]
 *
 *  transitionMs: int - default 400 ms
 *
 *  enableAutoPlay: boolean - default false
 * }
 *
 */
const CustomImageSlider = (props) => {
  const {
    imagesList: imgList,
    transitionMs,
    isVisible,
    enableAutoPlay,
    updatePostPurchase,
    updateTipHandler,
    transformWidth = null,
    width,
    isProgressiveLoading = false,
    post,
    aspectWidth,
    isFullHeight,
    ...others
  } = props;
  const router = useRouter()
  const [mobileView] = isMobile();
  const [lang] = useLang()
  const auth = getCookie("auth")
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

  const uid = isAgency() ? selectedCreatorId : getCookie("uid");
  const theme = useTheme();
  const [imagesList, setImageList] = useState(imgList || [])
  const [showCoverText, setShowCoverText] = useState(post.previeWData && post.previeWData.length > 0)
  const [currSlideIndex, setCurrentSlideIndex] = useState(0)
  const [userWalletBalance] = useUserWalletBalance()
  const [sliderHeight, setSliderHeight] = useState(0)
  const sliderRef = useRef()
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
  const previewData = post?.previewData || []

  useEffect(() => {
    if (sliderRef.current) {
      setSliderHeight(sliderRef.current.offsetWidth)
    }
  }, [])

  const handleCallback = (data) => {
    if (previewData.length > 0) {
      setImageList([...previewData.map((p) => { return { ...p, isPreview: true } }), ...data])
    } else {
      setImageList([...data])
    }
    mobileView ? open_drawer("successPayment", { successMessage: lang.postSucessPurchased }, "bottom") : open_dialog("successPayment", { successMessage: lang.postSucessPurchased })
  }

  useEffect(() => {

    if (previewData.length > 0) {
      setShowCoverText(true)
      if (!isVisible && !isOwnProfile(props?.userId)) {
        setImageList((pre) => [...previewData.map((p) => { return { ...p, isPreview: true } }), imgList[0]])
      } else {
        setImageList((pre) => [...previewData.map((p) => { return { ...p, isPreview: true } }), ...imgList])
      }
    } else {
      setImageList(imgList)
    }
  }, [previewData, imgList])

  const handlePaymentThroughWallet = () => {
    authenticateUserForPayment(mobileView, lang.paymentDisabledForCreatorText, auth).then(() => {
      !isAgency() && authenticate(router.asPath).then(() => {
        if (mobileView) {
          open_drawer("buyPost", {
            creatorId: props.userId,
            postId: props.postId,
            price: props.price,
            currency: (props.currency && props.currency.symbol) || "$",
            updatePostPurchase,
            postType: props.postType,
            lockedPost: props.lockedPost,
            messageId: props.messageId,
            lockedPostId: props.lockedPostId,
            chatId: props.chatId,
            callBack: handleCallback,
            purchaseUsingCoins: true,
            title: lang.purchasePost,
            description: lang.unlockPost,
            button: lang.purchasePost
          }, "bottom"
          )
        } else {
          open_dialog("buyPost", {
            creatorId: props.userId,
            postId: props.postId,
            price: props.price || 0,
            currency: (props.currency && props.currency.symbol) || defaultCurrency,
            updatePostPurchase,
            postType: props.postType,
            lockedPost: props.lockedPost,
            messageId: props.messageId,
            lockedPostId: props.lockedPostId,
            chatId: props.chatId,
            callBack: handleCallback,
            purchaseUsingCoins: true,
            title: lang.purchasePost,
            description: lang.unlockPost,
            button: lang.purchasePost
          });
        }
      })
    })
  }

  const handlePurchaseNewPost = () => {
    handlePaymentThroughWallet()
  }

  const handlePurchaseSuccess = () => {
    mobileView ? open_drawer("coinsAddedSuccess", { handlePurchaseNewPost: handlePurchaseNewPost }, "bottom") : open_dialog("coinsAddedSuccess", { handlePurchaseNewPost: handlePurchaseNewPost })
  }

  const handlePurchasePost = (data = {}) => {
    authenticateUserForPayment(mobileView, lang.paymentDisabledForCreatorText, auth).then(() => {
      !isAgency() && authenticate(router.asPath).then(() => {
        mobileView
          ?
          (userWalletBalance < props.price) ?
            open_drawer("addCoins", { handlePurchaseSuccess: handlePurchaseSuccess }, "bottom") : handlePurchaseNewPost()
          :
          (userWalletBalance < props.price) ?
            open_dialog("addCoins", { handlePurchaseSuccess: handlePurchaseSuccess }) : handlePurchaseNewPost()
      });
    })
  };

  const handleSubscribeDrawer = () => {
    authenticateUserForPayment(mobileView, lang.paymentDisabledForCreatorText, auth).then(() => {
      !isAgency() && authenticate(router.asPath).then(() => {
        mobileView
          ? open_drawer("CreatorPlanSubscription", {
            back: () => close_drawer(),
            creatorId: props.userId,
            creatorName: props.profileName,
            subscribedEvent: props.subscribedEvent,
          },
            "bottom"
          )
          : open_dialog("CreatorPlanSubscription", {
            back: () => close_dialog(),
            creatorId: props.userId,
            creatorName: props.profileName,
            subscribedEvent: props.subscribedEvent,
          });
      })
    })
  };

  const myArrow = ({ type, onClick, isEdge }) => {
    const pointer = type === consts.PREV
      ? <Img src={leftSideIconWhite} alt="prev_icon" style={{ left: "5%", zIndex: "3" }} className="position-absolute" />
      : <Img src={rightSideIconWhite} alt="nxt_icon" style={{ right: "5%", zIndex: "3" }} className="position-absolute" />

    return imagesList && imagesList.length > 1 && !mobileView ? (
      <button onClick={onClick} disabled={isEdge} style={{ border: "none", background: "none", padding: "0" }}>
        {pointer}
      </button>
    ) : <></>
  }
  const postImages = imgList || []
  let imageCount = imagesList ? [...previewData, ...postImages].filter(i => i.type === 1).length : 0;
  let videoCount = imagesList ? [...previewData, ...postImages].filter(i => i.type === 2).length : 0;

  return (
    <div className="callout-none" onContextMenu={handleContextMenu} ref={sliderRef} style={{ height: props.height || '100%', width: props.width || '100%' }}>
      {
        showCoverText ? <div className="d-flex align-items-center text-white coverLabel">
          <Icon
            icon={`${COVER_IMAGE_ICON}#cover_image`}
            color={theme.palette.white}
            size={14}
            class="d-flex align-items-center"
            viewBox="0 0 20 20"
          />
          <div className="fntSz14 ml-2">Preview</div>
        </div> : <></>
      }
      <div className={`media-count ${currSlideIndex > 0 ? 'd-none' : 'd-block'}`}>
        {
          (props.postType == 1 && isOwnProfile(props.userId)) || (props.postType == 1 && !isVisible) || (props.postType == 2 && !isVisible && !props.exploreMobile) || (imagesList && imagesList.length > 1) ? <PostMediaCount fontSize={mobileView ? 12 : 16} iconSize={mobileView ? 16 : 18} imageCount={imageCount} videoCount={videoCount} /> : ''
        }
      </div>
      <div>
        {((isOwnProfile(props.userId) && Number(props?.price) > 0))
          ?
          <span className="btn-subscribe btnPurchase txt-heavy fntSz14" onClick={handlePurchasePost}>
            <CoinPrice displayStyle={'flex'} price={props?.price || "0.00"} size={mobileView ? 12 : 16} iconSize={mobileView ? 14 : 18} />
          </span>
          : <></>}
      </div>
      <Carousel
        enableSwipe={true}
        enableMouseSwipe={false}
        enableAutoPlay={enableAutoPlay}
        focusOnSelect={true}
        transitionMs={transitionMs || 400}
        itemsToScroll={1}
        autoTabIndexVisibleItems={true}
        disableArrowsOnEnd={!imagesList || imagesList.length <= 1}
        itemsToShow={1}
        pagination={imagesList && imagesList.length > 1 ? true : false}
        renderArrow={myArrow}
        onChange={(currentItemObject, currentPageIndex) => {
          setCurrentSlideIndex(currentPageIndex)
          if (!!imagesList[currentPageIndex]?.isPreview) {
            setShowCoverText(true)
          } else {
            setShowCoverText(false)
          }
        }}
      >
        {imagesList && imagesList.length > 0 &&
          imagesList.map((item, i) => {
            if ((item.type == 2 && isVisible) || (item.isPreview && item.type == 2)) {
              return (
                <div className="position-relative w-100 imgSliderSquare callout-none" onContextMenu={handleContextMenu}>
                  <FeedVideoPlayer
                    publicId={item.url}
                    thumbnail={item.thumbnail}
                    isVisible={props.isLockedPost ? props.isVisible : post?.isVisible || item.isPreview || 0}
                    updatePostPurchase={updatePostPurchase}
                    className={mobileView ? `postImg` : "dv__postImg"}
                    postId={post?.postId}
                    postType={post?.postType}
                    price={post?.price}
                    currency={post?.currency}
                    setVideoAnalytics={post?.setVideoAnalytics}
                    width={aspectWidth > 900 ? 900 : aspectWidth}
                    height={sliderHeight}
                    transformWidth={mobileView ? "90vw" : "50vw"} // Exact For Mob - 83vw and For DV - 44vw
                    subscribedEvent={props.handleUpdateHashTag}
                    userId={post?.userId}
                    alt={post?.fullName}
                  />
                </div>
              )
            } else {
              return (
                <div className="position-relative imgSliderSquare callout-none" onContextMenu={handleContextMenu}>
                  <div className={`bgOverlay${props.postId}`}></div>
                  <FigureCloudinayImage
                    key={i}
                    isSlider={true}
                    publicId={item.url ? (item.type == 2 ? item.thumbnail : item.url) : item.thumbnail || BANNER_PLACEHOLDER_IMAGE}
                    className={props.className}
                    width={transformWidth ? null : width}
                    transformWidth={transformWidth}
                    height={props.height}
                    isVisible={isVisible && !isOwnProfile(props.userId)}
                    ratio={props.ratio}
                    handlePurchasePost={handlePurchasePost}
                    handleSubscribeDrawer={handleSubscribeDrawer}
                    uid={uid}
                    isProgressiveLoading={isProgressiveLoading}
                    visibleByDefault={props?.visibleByDefault}
                    aspectRatio={'1/1'}
                    isPreview={item.isPreview}
                    {...others}
                  />

                </div>
              );
            }

          })}
      </Carousel>
      <div className={mobileView ? "" : `${props?.isExplorePage ? "dv__tipSec_search" : "dv__tipSec"}  d-flex align-items-center`}>

        {/* {!props.HideUnlockAndDollar && (props.postType == 1 || props.postType == 4) && props.userId != uid && (
          <div onClick={!isVisible ? handlePurchasePost : () => { }}>
            {!isVisible ? "" : (
              <div className={`btn btn-default py-1 d-flex align-items-center ${mobileView ? "ml-2 btn_price_tag" : "dv__btn_price_tag"
                } `}
                style={{ bottom: !mobileView && props?.isExplorePage && "47px" }}
              >
                <Img src={UNLOCK_ICON} width={16} alt="lock" className="p-1" />
                <div className="ml-1 fntSz12 w-600">{lang.unlocked}</div>
              </div>
            )}
          </div>
        )} */}

        {router.pathname === "/search" &&
          props.userId != uid && !mobileView && (
            <div
              className={`${!isVisible && props.postType == 1 ? "" : "dv__sendTip"} cursorPtr mx-2 px-2 py-1`}
              onClick={() => {
                authenticateUserForPayment(mobileView, lang.paymentDisabledForCreatorText, auth).then(() => {
                  !isAgency() && authenticate(router.asPath).then(() => {
                    if (!isVisible && props.postType == 1) {
                      open_dialog("buyPost", {
                        creatorId: props.userId,
                        postId: props.postId,
                        price: props.price || 0,
                        currency:
                          (props.currency && props.currency.symbol) ||
                          defaultCurrency,
                        updatePostPurchase,
                        postType: props.postType,
                      });
                    } else {
                      open_dialog("sendTip", {
                        creatorId: props.userId,
                        postId: props.postId,
                        updateTip: (tipCount) =>
                          updateTipHandler && updateTipHandler(tipCount),
                      });
                    }
                  });
                })
              }}
            >
              {!isVisible && props.postType == 1 ? "" : (
                <div className={`d-flex ${props?.isExplorePage ? "py-0 px-2" : "pb-1 mx-2 p-2"} dv__sendTip`}>
                  <Icon
                    icon={`${DV_Sent_Tip}#_Icons_11_Dollar_2`}
                    color={theme.palette.l_app_bg}
                    viewBox="0 0 20 20"
                  />
                  <span className="txt-heavy ml-2 dv__fnt14 pt-1">{lang.sendTip}</span>
                </div>
              )}
            </div>
          )}
      </div>
      <style>{`
        :global(.media-count .countItem) {
          line-height: 0 !important;
        }
        img{
          object-fit:contain;
        }
        :global(.rec.rec-carousel-wrapper){
          width:109% !important;
        }
        :global(.MuiDialog-paper){
          min-width:51vw;
        }
        :global(.coinprice) {
          display: flex !important; 
          align-items: center;
        }
        .purchasedPrice{
          position: absolute;
          bottom: 10px;
          left: 123px;
          height: 28px;
        }
        .purchasedPriceNonUnlocked, .purchasedPrice {
          position: absolute;
          top: 10px;
          left: 10px;
          height: fit-content;
          line-height: 0;
          z-index: 4;
          padding: ${mobileView ? '8px 12px' : '12px 14px'} !important;
        }
        .btnPurchase {
          position: absolute;
          top: 16px;
          left: 16px;
          height: fit-content;
          z-index: 4;
          box-shadow: 0px 4px 8px 0px #0000001F;
          padding: ${mobileView ? '8px 12px' : '12px 14px'} !important;
          line-height: 16px
        }
        .coverLabel {
          font-size: 12px;
          color: var(--l_app_text);
          position: absolute;
          z-index: 2;
          top: 10px;
          right: 10px;
          padding: ${mobileView ? '3px 5px' : '5px 8px'};
          background: var(--l_badge_light);
          border-radius: 20px;
        }
        :global(.rec-item-wrapper) {
          aspect-ratio: 1/1 !important;
          /* width: 100% !important; */
        }
        .imgSliderSquare {
          position: relative;
          height: ${sliderHeight && !isFullHeight ? sliderHeight + "px" : 'auto'} !important;
        }
        .bgOverlay${props.postId} {
          /* The image used */
          background-image: url(${s3ImageLinkGen(S3_IMG_LINK, imagesList[0].type == 1 ? imagesList[0].url : imagesList[0].thumbnail || BANNER_PLACEHOLDER_IMAGE, 30, 420, 420)});
          
          /* Add the blur effect */
          filter: blur(30px);
          -webkit-filter: blur(30px);
          
          /* Full height */
          height: 100%; 
          
          /* Center and scale the image nicely */
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
};
export default CustomImageSlider;
