import React from "react";
import { FILM_ICON } from "../../lib/config/homepage";
import { EMPTY_PROFILE } from "../../lib/config/placeholder";
import { authenticate } from "../../lib/global/routeAuth";
import FigureCloudinayImage from "../cloudinayImage/cloudinaryImage";
import Image from "../image/image";
import { handleContextMenu } from "../../lib/helper";

const CloudinaryVideoThumbnail = (props) => {
  const { publicId, isVisible, width = 50, transformWidth = null, ...otherProps } = props;

  return (
    <>
      <div style={{ position: "relative", width: "100%" }} className="callout-none" onContextMenu={handleContextMenu}
        onClick={() => {
          authenticate().then(props.price && props.postType == 1 && !props.isVisible ? props.handlePurchasePost : props.postType == 2 && !props.isVisible ? props.handleSubscribeDrawer : "");
        }}
      >
        <FigureCloudinayImage
          publicId={publicId}
          ratio={1}
          width={transformWidth ? null : width}
          transformWidth={transformWidth}
          visibleByDefault={props?.visibleByDefault}
          blurred={true}
          style={{
            width: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}

          isVisible={isVisible}
          {...otherProps}
        />
        <div
          className="p-1 cursorPtr"
          style={{
            position: "absolute",
            top: "0",
            right: "0",
            left: "0",
            right: "0",
            height: "100%",
            width: "100%",
          }}
        >
          <Image
            src={FILM_ICON}
            alt="Video Thumbnail Icon"
            style={{
              maxHeight: "30px",
              maxWidth: "30px",
              objectFit: "cover",
              objectPosition: "center",
            }}
            className="video-thumbnail-icon"
            onClick={() => props.price && authenticate().then(props.handlePurchasePost)}
            onError={(e) => {
              e.target.style.backgroundColor = "black";
              e.target.style.padding = "4px";
              e.target.height = "100%";
              e.target.width = "100%";
              e.target.src = EMPTY_PROFILE;
            }}
          />
        </div>
      </div>
    </>
  );
};

export default CloudinaryVideoThumbnail;
