import React from "react";
import ReactImageMagnify from "react-image-magnify";
import _JSXStyle from "styled-jsx/style";

import { WHITE_COLOR } from "../../lib/config";

const ImageMagnify = props => {
  const { largeImage, alt } = props;

  return (
    <div className="imageZoom">
        {/* <SideBySideMagnifier
        imageSrc={largeImage}
        magnifierSize={"50%"}
        imageAlt="Example"
        largeImageSrc={largeImage} // Optional
      /> */}
      <ReactImageMagnify
        {...{
          smallImage: {
            alt: alt || "Test Image",
            isFluidWidth: true,
            src: largeImage
          },
          imageStyle: {
            width: "70%"
          },
          smallImageStyle: {
            width: "90%",
            height: "100%",
            display: "block",
            margin: "auto"
          },
          largeImage: {
            src: largeImage,
            width: 1200,
            height: 1800
          },
          enlargedImageStyle: {
            zoom: 0.9,
            height: "470px",
            width: "370px"
          },
          lensStyle: {
            height: "391px"
          }
        }}
        enlargedImageContainerClassName="test1"
        imageClassName="mainImage"
        className="imgContainer"
        lensStyle={{ width: "222px" }}
      />

      <style jsx>
        {`
          .imageZoom :global(.test1) {
            height: 450px !important;
            width: 450px !important;
            background: ${WHITE_COLOR};
            z-index: 999;
            width: 50vw;
          }

          .imageZoom :global(.mainImage) {
            // width: 80% !important;
            // height: auto !important;
            // max-height: 100%;
            // margin: auto;
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            max-width: 100% !important;
            max-height: 100%;
            transition: opacity 0.5s linear;
            opacity: 1;
            margin: auto;
            z-index: 0;
            width: auto !important;
          }

          .imageZoom :global(.imgContainer) {
            height: 430px !important;
            max-height: 430px !important;
            left: 45px;
            // display: flex;
            // align-items: center;
            // flex-direction: column;
          }

          .lensClass {
            left: 0;
            right: 0;
            position: absolute;
            height: 100%;
            width: 100%;
          }
        `}
      </style>
    </div>
  );
};

export default ImageMagnify;
