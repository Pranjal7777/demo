import React, { useState } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { s3ImageLinkGen } from "../../lib/UploadAWS/uploadAWS";

/**
 * @description Next js image componenet for optimization
 * @author Bhavleen
 * @date 07/04/2021
 * @param {*} props
 * @param href - provide full image url
 * @param
 */
const NextImage = (props) => {
  const {
    crop = "scale",
    ratio,
    width,
    height,
    radius,
    publicId,
    alt,
    imgFormat,
    href,
    ...other
  } = props;

  // const IMAGE_LINK = useSelector((state) => state?.cloudinaryCreds?.IMAGE_LINK)
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);

  let url = "";
  if (publicId?.startsWith?.("http")) {
    url = publicId;
  } else {
    url = s3ImageLinkGen(S3_IMG_LINK, publicId, null, width, height);
  }
  // console.log(url);
  return (
    <Image
      src={href || url}
      width={width || "auto"}
      height={height || "auto"}
      alt={alt || "next image"}
      // layout="fill"

      {...other}
    />
  );
};
export default NextImage;
