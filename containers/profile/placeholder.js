import React from "react";
import Image from "../../components/image/image";
import Route from "next/router";
import {
  NO_POST_PLACEHOLDER_DV,
  NO_VIDEO_POST_PLACEHOLDER,
  NO_IMAGE_POST_PLACEHOLDER,
  NO_PURCHASED_POST_PLACEHOLESR,
  NO_LIKED_POST_PLACEHOLDER,
  NO_COLLECTION_PLACEHOLDER,
  NO_ORDER_PLACEHOLDER,
  NO_DIAMOND_POST_DV
} from "../../lib/config/placeholder";
import isMobile from "../../hooks/isMobile";
import useLang from "../../hooks/language";
import { useTheme } from "react-jss";

const Placeholder = (props) => {
  const { pageName, label, placeholderImage, click } = props;
  const [mobileView] = isMobile();
  const [lang] = useLang();
  const theme = useTheme();

  const placeholderText = () => {
    switch (pageName) {
      case "videoProfile":
        return (
          <>
            <Image
              src={NO_VIDEO_POST_PLACEHOLDER}
              alt="No Video Post Placeholder SVG Image"
            />
            <p
              className={`text-app m-0 mt-2 p-2 nopost_placeholder_txt`}
            >
              {label || "No Video Post!"}
            </p>
          </>
        );
      case "imageProfile":
        return (
          <>
            <Image
              src={NO_IMAGE_POST_PLACEHOLDER}
              alt="No Image Post Placeholder SVG Image"
            />
            <p
              className={`text-app m-0 mt-2 p-2 nopost_placeholder_txt`}
            >
              {label || "No Image Post!"}
            </p>
          </>
        );
      case "exclusive-post":
        return (
          <div className={`text-center container ${mobileView && "mt-5"}`}>
            <Image
              src={NO_DIAMOND_POST_DV}
              alt="No Purchased Post Placeholder SVG Image"
            />
            <p
              className={`text-app m-0 mt-2 p-2 nopost_placeholder_txt`}
            >
              {props.otherProfile ? lang.noOtherPostDiamondMsg : lang.noPostDiamondMsg}
            </p>
          </div>
        );
      case "purchased-post":
        return (
          <div className="text-center container">
            <Image
              src={NO_PURCHASED_POST_PLACEHOLESR}
              alt="No Purchased Post Placeholder SVG Image"
            />
            <p className={`text-app m-0 mt-2 p-2 nopost_placeholder_txt`}>
              {lang.noPostLockMsg}
            </p>
          </div>
        );
      case "collections":
        return (
          <div className={`text-center  ${!mobileView && "mt-5"} container`}>
            <Image
              src={NO_COLLECTION_PLACEHOLDER}
              alt="No Collection Post Placeholder SVG Image"
            />
            <p
              className={`text-app m-0 mt-2 p-2 nopost_placeholder_txt`}
            >
              {lang.collectionPlaceholdrTxt}
            </p>
          </div>
        );
      case "manageList":
        return (
          <div className={`text-center  ${!mobileView && "mt-5"} container`}>
            <Image
              src={NO_COLLECTION_PLACEHOLDER}
              alt="No Collection Post Placeholder SVG Image"
            />
            <p
              className={`text-app m-0 mt-2 p-2 nopost_placeholder_txt`}
            >
              {label || lang.manageListPlaceholdrTxt}
            </p>
          </div>
        );
      case "liked-post":
        return (
          <div className="text-center container">
            <Image
              src={NO_LIKED_POST_PLACEHOLDER}
              alt="No Like Post Placeholder SVG Image"
            />
            <p
              className={`text-app m-0 mt-2 p-2 nopost_placeholder_txt`}
            >
              {lang.likedPlaceholdrTxt}
            </p>
          </div>
        );
      case "tagged-post":
        return (
          <div className="text-center container mt-5">
            <Image
              src={NO_IMAGE_POST_PLACEHOLDER}
              alt="No Tagged Post Placeholder SVG Image"
            />
            <p
              className={`text-app m-0 mt-2 p-2 nopost_placeholder_txt`}
            >
              {lang.taggedPost}
            </p>
          </div>
        );
      case "orderList":
        return (
          <div className="text-center container">
            <Image
              src={NO_ORDER_PLACEHOLDER}
              alt="No Order Found Image"
            />
            <p
              className={`text-app m-0 mt-2 p-2 nopost_placeholder_txt`}
            >
              {label || lang.noOrderFound}
            </p>
          </div>
        );
      default:
        return (
          <div
            className="text-center container mt-5"
            onClick={() => {
              click && Route.push("/");
            }}
          >
            <Image
              width={"72"}
              src={placeholderImage || NO_POST_PLACEHOLDER_DV}
              alt="No Post Placeholder SVG Image for Desktop" />
            <p className="text-app m-0 mt-2 p-2 nopost_placeholder_txt">
              No Post Yet !
            </p>
          </div>
        );
    }
  };

  return (
    <div
      className={
        mobileView
          ? "d-flex my-5 pb-5 flex-column justify-content-center align-items-center mx-auto"
          : "d-flex mt-5 flex-column justify-content-center align-items-center"
      }
    >
      {placeholderText()}
      {props.children}
    </div>
  );
};
export default Placeholder;
