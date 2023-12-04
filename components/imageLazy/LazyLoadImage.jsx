import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import {
  BANNER_PLACEHOLDER_IMAGE,
  BANNER_PLACEHOLDER_IMAGE_COVER,
} from "../../lib/config/homepage";
import { handleContextMenu } from "../../lib/helper";

/**
 * @description component to use lazy load image
 * @author jagannath
 * @date 28/04/2021
 * @param image*: Object - {src, alt}
 * @param width?: String - 100%
 * @param height?: String - 100%
 * @param effect?: String - blur |
 * @param threshold?: Number - 10
 */
const LazyLoadImg = ({
  image = {},
  width,
  height,
  effect,
  errorImage,
  mobileView,
  isProgressiveLoading = false,
  progressiveThumbnail,
  visibleByDefault = false,
  ...others
}) => (
  <>
    <LazyLoadImage
      alt={image?.alt || "Lazy loading image"}
      effect={effect || "blur"}
      threshold={100}
      visibleByDefault={visibleByDefault}
      width={width || "100%"}
      height={height || "100%"}
      src={image?.src}
      placeholderSrc={isProgressiveLoading ? progressiveThumbnail : ""}
      onError={(e) => {
        // e.target.style.backgroundColor = "var(--l_white)";
        // e.target.style.padding = "4px";
        e.target.style.height = height;
        e.target.width = width || "100%";
        e.target.src =
          errorImage || mobileView
            ? BANNER_PLACEHOLDER_IMAGE
            : BANNER_PLACEHOLDER_IMAGE_COVER;
      }}
      className="callout-none"
      style={{
        ...others.style,
        width: "100%",
        padding: 0,
      }}
      onContextMenu={handleContextMenu}
      {...others}
    />
  </>
);

export default LazyLoadImg;
