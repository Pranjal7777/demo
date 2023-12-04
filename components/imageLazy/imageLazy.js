import React, { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { handleContextMenu } from "../../lib/helper";
const ImageLazyLoad = ({ src, placeholder, className, ...restParams }) => {
  let [imageLoad, setImageLoad] = useState(false);
  return (
    <div>
      <LazyLoadImage
        alt={"A Lazy Loading Image"}
        height={176}
        width={190}
        afterLoad={() => {
          setImageLoad(true);
        }}
        wrapperClassName={`${className || ""} callout-none  ${(!imageLoad && "image-placeholder") || ""
          }`}
        onContextMenu={handleContextMenu}
        placeholderSrc={placeholder}
        src={src} // use normal <img> attributes as props
      />

      <style jsx>
        {`
          :global(.image-placeholder) {
            overflow: hidden;
            filter: blur(4px);
            flex: none;
            height: 100%;
            position: absolute;

            transform: scale(1.03);
            width: 100%;
            z-index: 1;

            background-position: 50% 50%;
            background-size: cover;
          }
        `}
      </style>
      {/* <LazyLoadImage
        height={176}
        width={190}
        onContentVisible={() => {
          // console.log("image loadedd");
          //   setImageLoad(true);
          //   setSrc(src)
        }}
      >
        <Img
          src={imageLoad ? src : placeholder}
          className={`${className || ""} ${!imageLoad && "imageblur"}`}
          {...restParams}
        ></Img> */}
      {/* </LazyLoadImage> */}
    </div>
  );
};

export default ImageLazyLoad;
