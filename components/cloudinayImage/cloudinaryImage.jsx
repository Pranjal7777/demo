import React from "react";
import FigureCloudinaryBlurImage from "./cloudinaryBlurImage";
import { useSelector } from "react-redux";
import isMobile from "../../hooks/isMobile";
import LazyLoadImg from "../imageLazy/LazyLoadImage";
import { s3ImageLinkGen } from "../../lib/UploadAWS/s3ImageLinkGen";
import Icon from "../image/icon";
import { DOLLAR_ICON } from "../../lib/config/homepage";
import { getCookie } from "../../lib/session";

import dynamic from "next/dynamic";
import { CoinPrice } from "../ui/CoinPrice";
import { isOwnProfile } from "../../lib/global";
import useLang from "../../hooks/language";
const ScheduledButton = dynamic(() => import('../profileTimeline/scheduledButton'));

/**
 * @description Cloudinary Image transformation
 * @author Jagannath
 * @date 2020-12-14
 * @param props {
 *  publicId: string - image public id
 *
 *  width/height: str/int - transformatino width
 *
 *  ratio: transformation ratio
 *
 *  crop: objectFit type for transformation,
 *
 *  errorImage: string ( image url )
 * }
 */
const FigureCloudinayImage = (props) => {
  const createImageBitmap = useSelector((state) => state.createImageBitmap);

  // const IMAGE_LINK = useSelector((state) => state?.cloudinaryCreds?.IMAGE_LINK);
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
  const APP_IMG_LINK = useSelector((state) => state?.appConfig?.baseUrl);
  const uid = getCookie("uid");
  const [lang] = useLang();
  const {
    publicId,
    crop = "scale",
    height,
    width,
    postType,
    isVisible,
    radius,
    blurred,
    errorImage,
    ratio,
    data,
    videoIcon,
    handlePurchasePost,
    handleSubscribeDrawer,
    transformWidth,
    transformHeight,
    quality = false,
    isCollectionPage = false,
    isProgressiveLoading = false,
    visibleByDefault,
    isScheduled,
    creationTs,
    currentTime,
    coverImage,
    isSlider,
    aspectRatio,
    isPreview,
    ...other
  } = props;
  const [mobileView] = isMobile();
  if ((isCollectionPage && !isVisible) ||
    (!isVisible && postType != 3 && props.userId != props.uid) ||
    (props.lockIcon && postType == 1) || (props.lockedPost && !isVisible && props.userId != getCookie('uid'))
  ) {
    return (
      <FigureCloudinaryBlurImage
        publicId={publicId}
        isPreview={isPreview}
        isSlider={isSlider}
        crop={crop}
        height={height}
        width={transformWidth ? null : width}
        transformWidth={transformWidth}
        ratio={ratio}
        videoIcon={videoIcon}
        isVisible={isVisible}
        postType={postType}
        handlePurchasePost={handlePurchasePost}
        handleSubscribeDrawer={handleSubscribeDrawer}
        imgFormat={createImageBitmap ? "webp" : "png"}
        errorImage={errorImage}
        mobileView={mobileView}
        exploreMobile={props.exploreMobile}
        tileLockIcon={props.tileLockIcon || ""}
        visibleByDefault={visibleByDefault}
        {...other}
        aspectRatio={aspectRatio}
      />
    );
  } else {
    let url;

    if (props.editPage) {
      url = `${APP_IMG_LINK}/${publicId}`
    } else {
      url = s3ImageLinkGen(S3_IMG_LINK, publicId, quality, +width || transformWidth, +height || transformHeight);
    }
    const thumbnailImg = s3ImageLinkGen(S3_IMG_LINK, publicId, 1, mobileView ? "45vw" : "25vw");

    return (<>
      <div
        style={{ position: "relative", width: "100%", height: "100%", aspectRatio: props.postSliderImage === true ? "auto" : aspectRatio || 'auto' }}>
        <LazyLoadImg
          image={{
            src: url,
            alt: props.alt,
          }}
          id={props.postId || props.id}
          className={props.className}
          posttype={postType}
          mobileView={mobileView}
          errorImage={errorImage}
          style={props.style}
          onClick={props.onClick}
          threshold={props.threshold}
          width={props?.width}
          height={props?.height}
          isProgressiveLoading={isProgressiveLoading}
          progressiveThumbnail={thumbnailImg}
          visibleByDefault={visibleByDefault}
        />
        {props?.showUserName || ((props.showPriceOnGrid && (props.postType == 1 || props.postType == 4) && props.isVisible)) || isScheduled ? (<div className="d-flex justify-content-between align-items-center purchasedPrice w-100 px-3">
          {props?.showUserName && <div className="font-weight-500 text-app">
            @{props?.userName}
          </div>}
          <div>
            {(props.showPriceOnGrid && (props.postType == 1 || props.postType == 4) && props.isVisible && isOwnProfile(props.userId))
              ?
              <div className="dv__sendTip d-flex align-items-center px-2 py-1 ml-auto">
                <CoinPrice price={props.price} size='14' iconSize="15" />
              </div>
              : ""}
            {
              isScheduled ? <ScheduledButton
                {...props}
              /> : ""
            }
          </div>
        </div>) : ""}
      </div>
      <style jsx>{`
        .purchasedPrice{
          position: absolute;
          bottom: 10px;
        }
        :global(.lazy-load-image-background.blur.lazy-load-image-loaded > img) {
          width: 100%;
        }
        `}
      </style>
    </>
    );
  }
};

export default FigureCloudinayImage;
