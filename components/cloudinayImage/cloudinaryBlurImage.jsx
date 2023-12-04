import React from "react";
import { BANNER_PLACEHOLDER_IMAGE, FILM_ICON, IMAGE_LOCK_ICON } from "../../lib/config/homepage";
import Img from "../image/image";
import LazyLoadImg from "../imageLazy/LazyLoadImage";
import { useTheme } from "react-jss";
import Icon from "../image/icon";
import isMobile from "../../hooks/isMobile";
import useLang from "../../hooks/language"
import { useSelector } from "react-redux";
import { s3ImageLinkGen } from "../../lib/UploadAWS/s3ImageLinkGen";
import { CoinPrice } from "../ui/CoinPrice";
import { isOwnProfile } from "../../lib/global";
import { handleContextMenu } from "../../lib/helper";

/**
 * @description Cloudinary Image Blur Image Transformation
 * @author Satyam
 * @date 2020-12-15
 * @param props {
 *  publicId: string - image public id
 *
 *  width/height: str/int - transformatino width
 *
 *  ratio: transformation ratio
 *
 *  crop: objectFit type for transformation
 * }
 */
const FigureCloudinaryBlurImage = (props) => {
  const theme = useTheme();
  const [lang] = useLang()
  const [mobileView] = isMobile();

  // const IMAGE_LINK = useSelector((state) => state?.cloudinaryCreds?.IMAGE_LINK);
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);

  const {
    publicId,
    crop = "scale",
    height,
    width,
    ratio,
    price,
    lockTop,
    lockLeft,
    videoIcon,
    onClick,
    isVisible,
    postType,
    handlePurchasePost,
    errorImage,
    imgFormat = "png",
    handleSubscribeDrawer,
    transformWidth = null,
    style,
    isPreview,
    isSlider,
    aspectRatio,
    userId,
    ...other
  } = props;
  const url = s3ImageLinkGen(S3_IMG_LINK, publicId, null, transformWidth || width, transformWidth ? null : height || parseInt(+width / 3 * 2) || null, isPreview ? 0 : 10)
  return (
    <div
      onClick={(postType == 1 || postType == 5) && !isVisible ? handlePurchasePost : postType == 2 && !isVisible ? handleSubscribeDrawer : props.onClick}
      style={{ position: "relative", width: "100%", height: "100%", aspectRatio: aspectRatio || 'auto' }}
      onContextMenu={handleContextMenu}
      className={`callout-none ${(!isPreview && !isVisible && !isOwnProfile(userId)) ? "blurrImg" : ""} ${!isVisible ? "cursorPtr" : ""} overflow-hidden position-relative callout-none BlurImageSlider`}
    >
      <LazyLoadImg
        image={{
          src: url,
          alt: props.alt || "A lazyload blurred image",
        }}
        id={props.postId}
        className={props.className}
        posttype={postType}
        mobileView={props.mobileView}
        style={{ ...style }}
        height={height}
      />

      {(!isPreview && !isVisible && !isOwnProfile(userId)) || (!isSlider && !isVisible && !isOwnProfile(userId))
        ? <div
          className="lockIcon"
          style={props?.billingScreen
            ? {
              position: "absolute",
              top: lockTop || "50%",
              left: lockLeft || "45%",
              transform: "translate(-50%, -50%)",
              zIndex: 1,
            }
            : {
              position: "absolute",
              top: lockTop || "50%",
              left: lockLeft || "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 0,
              textAlign: "center"
            }
          }>
          <Icon
            icon={`${IMAGE_LOCK_ICON}#lock_icon`}
            color={theme.palette.white}
            size={props?.billingScreen || postType == 5 && !props.lockedPost
              ? 35
              : mobileView ? 80 : props.size ? props.size : 100}
            unit="px"
            viewBox={`0 0 ${props?.billingScreen || postType == 5 && !props.lockedPost
              ? 35
              : mobileView ? 80 : props.size ? props.size : 100} ${props?.billingScreen || postType == 5 && !props.lockedPost
                ? 35
                : mobileView ? 80 : props.size ? props.size : 100}`}
          />
          {(postType == 1 || postType == 5) && !isVisible && !props.exploreMobile || (isOwnProfile(props.userId) && (postType == 1 || postType == 5)) ? (
            <span className={`btn btn-default px-3 py-2 buy_post_btn font-weight-bold mt-3 ${postType == 5 ? "fntSz11" : props.adjustUnlockSubscribetext ? "adjustUnlockSubscribetext" : mobileView ? 'fntSz13' : ''}`}>
              <CoinPrice displayStyle={'flex'} price={price || "0.00"} size={isSlider ? mobileView ? 14 : 18 : 12} iconSize={isSlider ? mobileView ? 14 : 18 : 12} />
              {/* {props?.currency?.symbol || "$"}
            {price || "0.00"} */}
            </span>
          ) : ""}
          {postType == 2 && !isVisible && !props.exploreMobile ? (
            <span className={`btn btn-default px-3 py-2 buy_post_btn font-weight-bold mt-3 ${mobileView ? 'fntSz13' : props.adjustUnlockSubscribetext ? "adjustUnlockSubscribetext" : ''}`}>
              {lang.subscribeTo} {props.username || props.userName}
            </span>
          ) : ""}
        </div>
        : ""
      }

      {videoIcon && (
        <div
          className="p-1 position-absolute w-100"
          style={{
            top: "0",
            right: "0",
            left: "0",
            right: "0",
            height: "fit-content",
          }}
        >
          <Img
            src={FILM_ICON}
            alt="video-thumbnail-icon"
            style={{
              maxHeight: "30px",
              maxWidth: "30px",
              objectFit: "cover",
              objectPosition: "center",
            }}
            className="video-thumbnail-icon"
            onError={(e) => {
              e.target.style.backgroundColor = "var(--l_app_bg)";
              e.target.style.padding = "4px";
              e.target.height = "100%";
              e.target.width = "100%";
              e.target.src = BANNER_PLACEHOLDER_IMAGE;
            }}
          />
        </div>
      )}
      <style jsx>
        {`
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
        :global(.blurrImg img) {
          filter: blur(40px);
        }
        .lockIcon {
          z-index: 2 !important;
        }
        `}
      </style>
    </div>
  );
};

export default FigureCloudinaryBlurImage;
