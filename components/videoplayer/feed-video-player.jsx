import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ReactJWPlayer from "react-jw-player";
import { open_dialog, open_drawer } from "../../lib/global/loader";
import { authenticate } from "../../lib/global/routeAuth";
import CloudinaryVideoThumbnail from "../cloudinayImage/cloudinaryVideoThumbnail";
import BackdropComponent from "../backdrop/backdrop";
import isMobile from "../../hooks/isMobile";
import { getCookie } from "../../lib/session";
import { s3ImageLinkGen } from "../../lib/UploadAWS/uploadAWS";
import { defaultCurrency } from "../../lib/config/creds";
import { VideoAnalytics } from "../../lib/rxSubject";
import Img from "../ui/Img/Img";
import { DOLLAR_ICON, UNLOCK_ICON } from "../../lib/config/homepage";
import Icon from "../image/icon";

const FeedVideoPlayer = (props) => {
  const {
    ratio,
    crop = "scale",
    width,
    height,
    isVisible,
    controls,
    autoplay,
    publicId,
    data,
    updatePostPurchase,
    setVideoAnalytics,
    latestPage,
    transformWidth = null,
    ...otherProps
  } = props;
  const [mobileView] = isMobile();

  var observer;
  var videoElement;
  const [videoDuration, setVideoDuration] = useState(0);
  const [showBackdrop, toggleBackdrop] = useState(false);
  const uid = getCookie("uid");
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
  const onReady = (event) => {
    videoElement = document.getElementById(props.postId);
    observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // let player = window.jwplayer(entry.target.id);
            // player.play()
          }
          if (!entry.isIntersecting) {
            let player = window.jwplayer(entry.target.id);
            player && player.pause && player.pause();
          }
        });
      },
      { threshold: 1 }
    );
    observer.observe(videoElement);
  };

  useEffect(() => {
    return () => {
      if (observer && videoElement) {
        observer && observer.unobserve(videoElement);
      }
    };
  }, []);

  var playlistData = {
    image: s3ImageLinkGen(S3_IMG_LINK, props.thumbnail, 30, +width || transformWidth),
    file: `${publicId}`,
  };

  const handlePurchasePost = () => {
    authenticate().then(() => {
      mobileView
        ? open_drawer("buyPost", {
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
        },
          "bottom"
        )
        : open_dialog("buyPost", {
          creatorId: props.userId,
          postId: props.postId,
          price: props.price,
          currency: (props.currency && props.currency.symbol) || defaultCurrency,
          updatePostPurchase,
          postType: props.postType,
          lockedPost: props.lockedPost,
          messageId: props.messageId,
          lockedPostId: props.lockedPostId,
          chatId: props.chatId,
        });
    });
  };

  const handleSubscribeDrawer = () => {
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
  };

  const handleVideoPlay = (e, postId) => {
    let player = window.jwplayer(postId);
    setVideoDuration(player.getDuration() || 0);
  };

  const onPause = () => {
    let player = window.jwplayer(props.postId);
    const payload = {
      postType: props.postType,
      videoDuration: player.getDuration() || 0,
      postId: props.postId,
      watchedDuration: player.getCurrentTime() || 0,
      mediaType: 2,
    };
    VideoAnalytics.next(payload)
    setVideoAnalytics && setVideoAnalytics(payload);
  };

  if (!props.isScheduled && (isVisible || props.postType == 3 || props.userId == uid)) {
    return (
      <>
        <div className="react_jw_palyer">
          {showBackdrop && <BackdropComponent />}

          {/* <HelperComponent
          postId={props.postId}
          handleUnmount={props.handleUnmount} /> */}
          <ReactJWPlayer
            aspectRatio='9:16'
            playerId={latestPage ? `l_${props.postId}_${Math.random()}` : props.postId + props.thumbnail + '_' + Math.random()}
            onReady={onReady}
            onPause={onPause}
            onPlay={(e) => handleVideoPlay(e, props.postId)}
            playerScript="https://content.jwplatform.com/libraries/YIw8ivBC.js"
            playlist={[playlistData]}
            onEnterFullScreen={(event) => {
              toggleBackdrop(true);
              setTimeout(() => {
                screen.orientation.lock('portrait');
              }, 500)
            }}
            onExitFullScreen={(event) => {
              setTimeout(() => {
                toggleBackdrop(false);
              }, 100);
            }}
            height={props.height || '100%'}
          />
          {/* {!props.HideUnlockAndDollar && (props.postType == 1 || props.postType == 4) && props.userId != uid && (
            <div onClick={!isVisible ? handlePurchasePost : () => { }}>
              {!isVisible ? "" : (
                <div className={`btn btn-default py-1 d-flex align-items-center ${mobileView ? "ml-2 btn_price_tag" : "dv__btn_price_tag"
                  } `}
                  style={{ bottom: !mobileView && props?.isExplorePage && "47px" }}
                >
                  <Img src={UNLOCK_ICON} width={16} alt="lock" className="p-1" />
                  <div className="ml-1 fntSz12 w-600">unlocked</div>
                </div>
              )}
            </div>
          )} */}
          {/* {!props.HideUnlockAndDollar && (props.postType == 1 || props.postType == 4) && props.isVisible
            ? <div className="">
              <div className={`${(props.postType == 1 || props.postType == 4) && props.userId != uid ? "purchasedPrice" : "purchasedPriceNonUnlocked"}  dv__sendTip d-flex align-items-center px-2 py-1 ml-auto`} style={{ width: mobileView ? '17vw' : '5vw' }}>
                <Icon
                  icon={`${DOLLAR_ICON}#Dollar_tip`}
                  color={"#fff"}
                  size={16}
                  class="d-flex align-items-center"
                  viewBox="0 0 20 20"
                />
                <span className="txt-heavy ml-2 fntSz12">
                  {props.price}
                </span>
              </div>
            </div>
            : ""} */}

        </div>
        <style jsx>{`
          :global(.jw-error){
            height: ${props.postType == 4 && props.postType == 5 ? "250px !important" : ""};
          }
          .dv__btn_price_tag {
            bottom: 30px !important;
            left: 25px !important;
          }
          .purchasedPrice{
            position: absolute;
            bottom: ${mobileView ? "" : "30px"};
            left: 133px;
            height: 28px;
          }
          .purchasedPriceNonUnlocked{
            position: absolute;
            bottom: 20px;
            left: 25px;
            height: 28px;
          }
          :global(.react_jw_palyer) {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            width: 100%;
        }
        :global(.react_jw_palyer > div) {
          height: 100% !important;
        }
        :global(.react_jw_palyer .jwplayer.jw-flag-aspect-mode) {
          height: 100% !important;
        }
        `}</style>
      </>
    );
  } else {
    return (
      <CloudinaryVideoThumbnail
        crop={crop}
        height={height}
        width={width}
        ratio={ratio}
        isVisible={isVisible}
        publicId={props.thumbnail}
        handlePurchasePost={handlePurchasePost}
        handleSubscribeDrawer={handleSubscribeDrawer}
        uid={uid}
        isVideo={true}
        transformWidth={transformWidth}
        visibleByDefault={props?.visibleByDefault}
        {...otherProps}
      />
    );
  }

};
export default FeedVideoPlayer;
