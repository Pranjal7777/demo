import React, { useState, useEffect } from "react";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import FigureCloudinaryBlurImage from "../cloudinayImage/cloudinaryBlurImage";
import CloudinaryVideoThumbnail from "../cloudinayImage/cloudinaryVideoThumbnail";
import {
  authenticate,
  open_dialog,
  open_drawer,
} from "../../lib/global";
import Videoplayer from "../videoplayer/jw-player";
import isMobile from "../../hooks/isMobile";
import { getCookie } from "../../lib/session";
import { useSelector } from "react-redux";
import { s3ImageLinkGen } from "../../lib/UploadAWS/uploadAWS";

/**
 * @description Cloudinary Video transformation
 * @author Jagannath
 * @date 2020-12-14
 * @param props {
 *  publicId: string - image public id
 *
 *  width/height: str/int - transformation width/height
 *
 *  ratio: transformation ratio
 *
 *  crop: objectFit type for transformation
 *
 *  blur: video background blur
 * }
 */
const CloudinaryVideo = (props) => {
  // console.log('CloudinaryVideo', props)
  // const [playlist, setPlaylist] = useState({})
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
    ...otherProps
  } = props;
  const [mobileView] = isMobile();
  // const IMAGE_LINK = useSelector((state) => state?.cloudinaryCreds?.IMAGE_LINK)
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
  // const VIDEO_LINK = useSelector((state) => state?.cloudinaryCreds?.VIDEO_LINK)


  // console.log('publicId', props)
  // useEffect(() => {
  if (props.postType == 3 || isVisible) {
    var playlistData = {
      // image: `${IMAGE_LINK}c_${crop}${ratio ? ",r_" + ratio : ""
      //   }${width ? ",w_" + width : ""}/q_auto/${props.thumbnail
      //   }.png`,
      image: s3ImageLinkGen(S3_IMG_LINK, props.thumbnail, false, +width || false, +height || false ),
      // file:
      //   `${VIDEO_LINK}b_blurred:400:15,vc_auto` +
      //   `,c_${crop}${ratio ? ",r_" + ratio : ""}${width ? ",w_" + width : ""
      //   }${height ? ",h_" + height : ""}/q_auto/${publicId}.mp4`,
      file: publicId
    };
  }

  // console.log('playlistData',publicId, playlistData)
  return (
    <>
      {isVisible || props.postType == 3 ? (
        <Videoplayer
          publicId={publicId}
          playlist={playlistData}
        />
      ) : (
        // (<Video
        //     resourceType="video"
        //     controls={controls == false ? false : true}
        //     cloud_name={CLOUDINARY_CLOUD_NAME}
        //     publicId={publicId}
        //     autoplay={autoplay || false}

        //     {...otherProps}
        //     >
        //     <Transformation
        //         width={width}
        //         height={height}
        //         background="blurred:400:15"
        //         crop={crop || "scale"}
        //         aspectRatio={ratio}
        //         videoCodec="auto" />
        // </Video>
        <CloudinaryVideoThumbnail
          crop={crop}
          height={height}
          width={width}
          ratio={ratio}
          isVisible={isVisible}
          publicId={props.thumbnail}
          {...otherProps}
        />
      )}
      {/* Commented By Bhavleen on May 11th, 2021 */}
      {/* {props.postType == 1 && isVisible == 0 && (
        <button
          onClick={() => {
            authenticate().then(() => {
              mobileView
                ? open_drawer(
                  "buyPost",
                  {
                    creatorId: props.userId,
                    postId: props.postId,
                    price: props.price,
                    currency:
                      (props.currency &&
                        props.currency.symbol) ||
                      "$",
                    updatePostPurchase: () =>
                      updatePostPurchase(),
                    postType: props.postType,
                  },
                  "bottom"
                )
                : open_dialog("buyPost", {
                  creatorId: props.userId,
                  postId: props.postId,
                  price: props.price || 0,
                  currency:
                    (props.currency &&
                      props.currency.symbol) ||
                    config.defaultCurrency,
                  updatePostPurchase: () =>
                    updatePostPurchase(),
                  postType: props.postType,
                });
            });
          }}
          className="btn btn-primary btn_price_tag pl-1 pr-2 py-1 ml-2">
          <LocalOfferIcon className="tag_btn" />
          {props.currency && props.currency.symbol
            ? props.currency.symbol
            : "$"}
          {props.price || "0.00"}
        </button>
      )} */}
    </>
  );
};

export default CloudinaryVideo;
