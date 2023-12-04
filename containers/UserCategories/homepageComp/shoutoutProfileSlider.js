import React, { useEffect, useState } from "react";
import Router from "next/router";
import { useSelector } from "react-redux";
import CustomSlider from "../../../components/slider/slider";
import Wrapper from "../../../hoc/Wrapper";
import isMobile from "../../../hooks/isMobile";
import useLang from "../../../hooks/language";
import {
  tagIcon,
  user_category_time,
  right_slick_arrow_dark,
  left_slick_arrow_dark,
  STAR_ICON_OTHERPROFIE,
} from "../../../lib/config/homepage";
import {
  BANNER_PLACEHOLDER_IMAGE,
} from "../../../lib/config/placeholder";
import { useTheme } from "react-jss";
import { Skeleton } from "@material-ui/lab";
import HorizonatalPagination from "../../../components/pagination/horizonatalPagination";
import CustomDataLoader from "../../../components/loader/custom-data-loading";
import Icon from "../../../components/image/icon";
import FigureCloudinayImage from "../../../components/cloudinayImage/cloudinaryImage";
import { close_progress, open_dialog, open_drawer, open_progress, startLoader } from "../../../lib/global/loader";
import { getCookie, setCookie } from "../../../lib/session";
import Image from "../../../components/image/image";
import isTablet from "../../../hooks/isTablet";

const ShoutoutProfileSlider = (props) => {
  const { data, type, skeleton, label, id, aspectRatio } = props;
  const [mobileView] = isMobile();
  const [tabletView] = isTablet();
  const theme = useTheme();
  const [lang] = useLang();
  const APP_IMG_LINK = useSelector((state) => state?.appConfig?.baseUrl);
  const [liveMoment, setLiveMoment] = useState(props?.shoutouts || []);
  const [isLoading, setIsLoading] = useState(false);
  const settings = {
    slidesToShow: mobileView ? 2.5 : tabletView ? 3.2 : 5.2,
    dots: false,
    lazyLoad: true,
    initialSlide: 0,
    infinite: false,
    autoplay: false,
    speed: 500,
    arrows: mobileView ? false : true,
    slidesToScroll: 1,
    prevArrow:
      <Image
        src={left_slick_arrow_dark}
        className="logoImg"
        alt="leftArrow"
      />,
    nextArrow:
      <Image
        src={right_slick_arrow_dark}
        className="logoImg"
        alt="rightArrow"
      />
  };

  const handelImage = (movments) => {
    switch (type) {
      case "SINGLE_IMAGE_BANNER":
        let bannerUrl = mobileView ? movments?.appUrl : movments?.webUrl;
        return bannerUrl;
      case "CATEGORY_SLIDER":
        let catUrl = mobileView ? movments?.appUrl : movments?.webUrl;
        return catUrl;
      case "SINGLE_VIDEO_BANNER":
        let imageUrl = mobileView ? movments?.appUrl : movments?.webUrl;
        return imageUrl;
      case "SHOUTOUT_PROFILE_SLIDER":
        return movments?.profilePic;
      case "RECENTLY_VIEWED":
        return movments?.profilePic;
      case "VIDEO_CALL_PROFILE_SLIDER":
        return movments?.profilePic;
      case "SHOUTOUT_SLIDER":
        return movments?.thumbnailUrl;
      default:
        return;
    }
  };

  const handleCategoryClicks = (sectionPostData) => {
    mobileView ? startLoader() : open_progress();

    if (getCookie("guest") === "true") {
      setCookie("otherProfile", `${sectionPostData?.username.trim() || sectionPostData?.userName.trim() || sectionPostData?.profilename}$$${sectionPostData?.creatorId || sectionPostData?.userid || sectionPostData?._id}`);
      return Router.push(`/${sectionPostData.username.trim() || sectionPostData.userName.trim()}`);
    }

    switch (type) {
      case "SINGLE_IMAGE_BANNER":
        break;
      case "CATEGORY_SLIDER":
        break;
      case "SINGLE_VIDEO_BANNER":
        let videoUrl = mobileView ? sectionPostData?.appUrl : sectionPostData?.webUrl;
        let indexOfpublicId = videoUrl.indexOf("admin");
        videoUrl = videoUrl.slice(indexOfpublicId);
        handleShoutoutVideo(videoUrl);
        break;
      case "SHOUTOUT_PROFILE_SLIDER":
        if (getCookie("uid") === sectionPostData.creatorId) {
          Router.push("/profile");
        } else {
          setCookie("otherProfile", `${sectionPostData?.username.trim() || sectionPostData?.userName.trim() || sectionPostData?.profilename.trim()}$$${sectionPostData?.creatorId || sectionPostData?.userid || sectionPostData?._id}`);
          Router.push(`/${sectionPostData.username.trim() || sectionPostData.userName.trim()}`);
        }
        // commenting this code for reference -> getCookie("uid") == sectionPostData._id ? Router.push("/profile") : Router.push(`/${sectionPostData.username || sectionPostData.userName}`);
        break;
      case "RECENTLY_VIEWED":
        if (getCookie("uid") == sectionPostData._id) {
          Router.push("/profile");
        } else {
          setCookie("otherProfile", `${sectionPostData?.username.trim() || sectionPostData?.userName.trim() || sectionPostData?.profilename.trim()}$$${sectionPostData?.creatorId || sectionPostData?.userid || sectionPostData?._id}`);
          Router.push(`/${sectionPostData.username || sectionPostData.userName}`);
        }
        break;
      case "VIDEO_CALL_PROFILE_SLIDER":
        if (getCookie("uid") == sectionPostData._id) {
          Router.push("/profile");
        } else {
          setCookie("otherProfile", `${sectionPostData?.username.trim() || sectionPostData?.userName.trim() || sectionPostData?.profilename.trim()}$$${sectionPostData?.creatorId || sectionPostData?.userid || sectionPostData?._id}`);
          Router.push(`/${sectionPostData.username || sectionPostData.userName}`);
        }
        break;
      case "SHOUTOUT_SLIDER":
        if (getCookie("uid") == sectionPostData._id) {
          Router.push("/profile?tabType='shoutout_post'")
        } else {
          setCookie("otherProfile", `${sectionPostData?.username.trim() || sectionPostData?.userName.trim() || sectionPostData?.profilename.trim()}}$$${sectionPostData?.creatorId || sectionPostData?.userId || sectionPostData?.userid || sectionPostData?._id}`);
          Router.push(`/${sectionPostData.username || sectionPostData.userName}?tabType='shoutout_post'`);
        }
        // handleShoutoutVideo(sectionPostData?.videoUrl);
        break;
      default:
        mobileView ? stopLoader() : close_progress();
        return;
    }
  };

  const handleShoutoutVideo = (videoUrl) => {
    mobileView
      ? open_drawer(
        "VDO_DRAWER",
        { vdoUrl: `${APP_IMG_LINK}/${videoUrl}` },
        "right"
      )
      : open_dialog(
        "VDO_DRAWER",
        { vdoUrl: `${APP_IMG_LINK}/${videoUrl}` },
        "right"
      );
  };

  const pageEventHandler = () => {
    // setIsLoading(true);
    // props?.handelPagination(props.page + 1);
  };

  const handleCategoryLabel = (data) => {
    let url = "";
    if (data.length > 0) {
      data.forEach((category, index) => {
        url = url + `${category.title}${data.length - 1 == index ? "" : ", "}`
      })
    }
    return url;
  }

  useEffect(() => {
    setLiveMoment(props?.shoutouts);
  }, []);
  return (
    <Wrapper>
      {!mobileView ? (
        <div className="col-12 px-0">
          <div className="d-flex align-items-center justify-content-between">
            <h6 className="mv_subHeader mb-0">{props.label}</h6>
            <p
              className="mb-3 mt-3 fntSz16 position-absolute font-weight-600 appTextColor cursorPtr"
              onClick={() =>
                Router.push(
                  `/homepage/user_avilabel_categories?caterory_label=${props.label}&&id=${id}&&type=${type}`
                )
              }
              // style={{ top: "1%", right: "7%" }}
              style={{ right: `${tabletView ? "8%" : "7%"}`}}
            >
              {lang.viewAll}
            </p>
          </div>
          <div className="globalArrowSlick px-0">
            {skeleton ? (
              <div className="row">
                {[...new Array(6)].map((item, index) => (
                  <div className={`${mobileView ? "col-6" : "col-2"} p-2`}>
                    <Skeleton
                      variant="rect"
                      width="100%"
                      height={209}
                      className="imgStyle"
                      style={{
                        borderRadius: "8px",
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <CustomSlider settings={settings} className="featuredSectionCss">
                {data &&
                  data.length > 0 &&
                  data.map((sectionPostData, index) => (
                    <>
                      <div
                        key={index}
                        style={{ aspectRatio: `${tabletView ? "210/275" : "210/324"}`, height: "100%" }}
                      >
                        <div
                          className={`cursorPtr ${mobileView
                              ? "position-relative mx-2"
                              : "position-relative img-zoom-hover webStyleCss"
                            }`}
                          style={{ paddingRight: !mobileView && "20px", width: "100%" }}
                          onClick={() => handleCategoryClicks(sectionPostData)}
                        >
                          {sectionPostData?.avgUserRating && <div className="position-absolute d-flex px-2 rounded-sm justify-content-center align-items-center  badge badge-dark rating ">
                            <img src={STAR_ICON_OTHERPROFIE} alt="rating icon" />
                            <span className="ml-1">{sectionPostData?.avgUserRating?.toFixed(2)}</span>
                          </div>}
                          <FigureCloudinayImage
                            publicId={handelImage(sectionPostData)}
                            visibleByDefault={true}
                            crop="thumb"
                            ratio={1}
                            quality={100}
                            transformWidth="17vw"
                            errorImage={BANNER_PLACEHOLDER_IMAGE}
                            style={
                              type == "CATEGORY_SLIDER"
                                ? {
                                  width: "100%",
                                  borderRadius: "0.366vw",
                                  objectFit: "cover",
                                  objectPosition: "top",
                                  filter: `brightness(${50}%)`,
                                  transition:
                                    "transform 0.4s cubic-bezier(0.17, 0.67, 0.13, 1.02) 0s",
                                }
                                : {
                                  width: "100%",
                                  borderRadius: "0.366vw",
                                  objectFit: "cover",
                                  objectPosition: "top",
                                  transition:
                                    "transform 0.4s cubic-bezier(0.17, 0.67, 0.13, 1.02) 0s",
                                  aspectRatio: "210/236",
                                }
                            }
                            className="titleImg object-fit-cover bg-shadow"
                            alt={sectionPostData.username || "banner_image"}
                          />
                        </div>
                        <div>
                          {props.isVideoCallComp ? (
                            <>
                              {/* commenting this part as now not getting anything from backend */}
                              {/* <p className="mb-0 px-0 fntSz16 fntWeight600">
                                talk to snick about..
                              </p> */}
                              <p className="mb-0 px-0 fntSz16 fntWeight600 appTextColor">
                                {sectionPostData?.username}
                              </p>
                              <p className="mb-0 pl-0 fntSz14 sublineCss font-weight-500 text-truncate"
                                style={{ width: "224px" }}
                              >
                                {handleCategoryLabel(sectionPostData?.categories)}
                              </p>
                            </>
                          ) : (
                            <>
                              {type !== "CATEGORY_SLIDER" &&
                                type !== "SHOUTOUT_SLIDER" &&
                                type !== "SINGLE_VIDEO_BANNER" && (
                                  <>
                                    <p className="mb-0 pl-0 fntSz16 fntWeight700">
                                      {sectionPostData?.username}
                                    </p>
                                    <p className={`mb-0 pl-0 sublineCss text-truncate ${tabletView ? 'fntSz12' : 'fntSz14'}`}
                                      style={{ maxWidth: "224px" }}
                                    >
                                      {handleCategoryLabel(sectionPostData?.categories)}
                                    </p>
                                  </>
                                )}
                            </>
                          )}
                          {(sectionPostData?.shoutoutPrice?.price || sectionPostData?.videoCallPrice?.price) && type !== "CATEGORY_SLIDER" &&
                            type !== "SHOUTOUT_SLIDER" &&
                            type !== "SINGLE_VIDEO_BANNER" && (
                              <div className="d-flex pl-0 pr-3 pt-2 align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                  <div className="fntSz14 d-flex align-items-center">
                                    {((sectionPostData?.shoutoutPrice?.price && !props.isVideoCallComp) || (sectionPostData?.videoCallPrice?.price)) && <span className="fntSz12 font-weight-100">
                                      <Icon
                                        icon={`${tagIcon}#tagIconId`}
                                        size={15}
                                        color={theme.text}
                                        class="pr-1 pb-1"
                                        viewBox="0 0 14.693 14.57"
                                      />
                                    </span>}
                                    <span className={`${tabletView ? 'fntSz12' : 'pl-1 fntWeight600 fntSz14'}`}>{props.isVideoCallComp ? sectionPostData?.videoCallPrice?.currencyCode : sectionPostData?.shoutoutPrice?.currencySymbol}
                                      {props.isVideoCallComp ? sectionPostData?.videoCallPrice?.price : (sectionPostData?.shoutoutPrice?.price).toFixed(2)}</span>
                                  </div>
                                </div>
                                {props.isVideoCallComp && sectionPostData?.videoCallPrice?.duration && (
                                  <div className="fntSz14 d-flex align-items-center pl-1 fntSz14 px-2">
                                    <Icon
                                      icon={`${user_category_time}#time`}
                                      size={12}
                                      color={theme.text}
                                      class="pr-1 pb-1"
                                      viewBox="0 0 13 13"
                                    />
                                    <span className="fntSz12">{sectionPostData?.videoCallPrice?.duration}</span>
                                  </div>
                                )}
                              </div>
                            )}

                        </div>
                      </div>
                    </>
                  ))}
              </CustomSlider>
            )}
          </div>
        </div>
      ) : (
        <div className="col-12 p-0 pb-2">
          <div className="d-flex align-items-center justify-content-between">
            <p className="mv_subHeaderMobile fntWeight600 fntSz24 mb-3 mt-3 ml-sm-2 ml-lg-0">{props.label}</p>
            <p
              className="mb-3 mt-3 app-link cursorPtr"
              onClick={() =>
                Router.push(
                  `/homepage/user_avilabel_categories?caterory_label=${props.label}&&id=${id}&&type=${type}`
                )
              }
            >
              {lang.viewAll}
            </p>
          </div>
          <div
            className="nav sliUL mobileContainerCss"
            id="homapageData"
            style={{
              flexWrap: "nowrap",
              overflow: "hidden",
              overflowX: "auto",
            }}
          >
            {skeleton ? (
              <>
                {[...new Array(3)].map((skalaton) => (
                  <Skeleton
                    variant="rect"
                    width={133}
                    height={155}
                    className="mx-2 feat_skelt bg-color"
                  />
                ))}
              </>
            ) : (
              <>
                {data &&
                  data.length > 0 &&
                  data.map((sectionPostData, index) => (
                    <div
                      className="mx-2 position-relative h-100"
                      style={{
                        aspectRatio: `${isMobile ? 'unset' : '144/241'}`,
                        minWidth: `${isMobile ? 'calc(100% / 3)' : '133px'}`
                      }}
                      key={index}
                      onClick={() => handleCategoryClicks(sectionPostData)}
                    >
                      {sectionPostData?.avgUserRating && <div className="position-absolute d-flex px-2 rounded-sm justify-content-center align-items-center  badge badge-dark ratingmobile ">
                        <img src={STAR_ICON_OTHERPROFIE} alt="rating icon" />
                        <span className="ml-1">{sectionPostData?.avgUserRating?.toFixed(2)}</span>
                      </div>}
                      <FigureCloudinayImage
                        publicId={handelImage(sectionPostData)}
                        crop="thumb"
                        quality={100}
                        transformWidth={133}
                        ratio={1}
                        height="auto"
                        errorImage={BANNER_PLACEHOLDER_IMAGE}
                        style={
                          type == "CATEGORY_SLIDER"
                            ? {
                              width: "100%",
                              borderRadius: "8px",
                              filter: `brightness(${40}%)`,
                            }
                            : {
                              width: "100%",
                              borderRadius: "8px",
                              aspectRatio: "144/144"
                            }
                        }
                        className="titleImg bg-shadow"
                        alt={sectionPostData.username || "banner_image"}
                        id={sectionPostData._id}
                      />
                      <div>
                        {props.isVideoCallComp ? (
                          <>
                            <p className="mb-0 px-0 text-truncate pt-2 fntSz16">
                              talk to snick about..
                            </p>
                            <p className="mb-0 px-0 fntSz14 sublineCss">
                              {sectionPostData?.username}
                            </p>
                          </>
                        ) : (
                          <>
                            {type !== "CATEGORY_SLIDER" &&
                              type !== "SHOUTOUT_SLIDER" &&
                              type !== "SINGLE_VIDEO_BANNER" && (
                                <>
                                  <p className="mb-0 px-0 pt-1 fntSz16 fntWeight700 text-truncate">
                                    {sectionPostData?.username}
                                  </p>
                                  <p className="mb-0 text-truncate px-0 fntSz14 sublineCss">
                                    {handleCategoryLabel(sectionPostData?.categories)}
                                  </p>
                                </>
                              )}
                          </>
                        )}
                        {(sectionPostData?.shoutoutPrice?.price || sectionPostData?.videoCallPrice?.price) && type !== "CATEGORY_SLIDER" &&
                          type !== "SHOUTOUT_SLIDER" &&
                          type !== "SINGLE_VIDEO_BANNER" && (
                            <div className="d-flex px-0 pt-1 align-items-center justify-content-between">
                              <div className="d-flex align-items-center w-100 justify-content-between">
                                <div className="fntSz14 d-flex align-items-center">
                                  {(sectionPostData?.shoutoutPrice?.price && !props.isVideoCallComp) && <Icon
                                    icon={`${tagIcon}#tagIconId`}
                                    size={12}
                                    color={theme.text}
                                    class="pr-1 pb-1"
                                    viewBox="0 0 14.693 14.57"
                                  />}
                                  {(props.isVideoCallComp && sectionPostData?.videoCallPrice?.price) && <Icon
                                    icon={`${tagIcon}#tagIconId`}
                                    size={13}
                                    color={theme.text}
                                    class="pr-1 pb-1"
                                    viewBox="0 0 14.693 14.57"
                                  />}
                                  <span className="pl-1 fntSz12 font__resp__tabView">{props.isVideoCallComp ? sectionPostData?.videoCallPrice?.currencyCode : sectionPostData?.shoutoutPrice?.currencySymbol}
                                    {props.isVideoCallComp ? sectionPostData?.videoCallPrice?.price : (sectionPostData?.shoutoutPrice?.price).toFixed(2)}</span>
                                </div>
                                {props.isVideoCallComp && sectionPostData?.videoCallPrice?.price && (
                                  <div className="fntSz14 d-flex align-items-center pl-1 fntSz14 pl-2">
                                    <Icon
                                      icon={`${user_category_time}#time`}
                                      size={12}
                                      color={theme.text}
                                      class="pr-1 pb-1"
                                      viewBox="0 0 13 13"
                                    />
                                    <span className="fntSz12">{sectionPostData?.videoCallPrice?.duration}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  ))}
                <HorizonatalPagination
                  pageEventHandler={!isLoading && pageEventHandler}
                  id="homapageData"
                />
                <div className="feat_loader mx-2">
                  {isLoading && (
                    <CustomDataLoader loading={true}></CustomDataLoader>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
      <style jsx>{`
        .sublineCss {
          color: ${theme.type == "light" ? theme?.text : "#d4d5dc"};
        }
        :global(.sliUL .feat_skelt) {
          min-width: 133px;
          border-radius: 8px;
        }
        .feat_loader {
          display: flex;
          justify-content: center;
          align-items: center;
          transform: rotate(90deg);
        }
        :global(.MuiSkeleton-root, .bg-color) {
          background-color: #00000094 !important;
        }
        :global(.globalArrowSlick .slick-prev) {
          width: auto;
          height: 25px;
          cursor: pointer;
          top: -5% !important;
          left: 94% !important;
        }
        :global(.globalArrowSlick .slick-next) {
          width: auto;
          height: 25px;
          cursor: pointer;
          top: -5% !important;
          right: 1rem !important;
        }
        :global(.globalArrowSlick .slick-track) {
          position: relative;
          top: 0;
          left: 0;
          display: block;
          margin: 0;
        }
        :global(.globalArrowSlick .slick-prev:before) {
          color: ${theme.type == "light" ? "#5a5757" : "#fff"};
          font-size: 25px;
        }
        :global(.globalArrowSlick .slick-next:before) {
          color: ${theme.type == "light" ? "#5a5757" : "#fff"};
          font-size: 25px;
        }
        :global(.webStyleCss .lazy-load-image-loaded) {
          overflow: hidden;
        }
        :globla(.featuredSectionCss .slick-list){
          aspect-ratio: ${aspectRatio.width} / ${aspectRatio.height};
        }
        .mobileContainerCss{
          aspect-ratio: ${aspectRatio.width} / ${aspectRatio.height};
        }
        .cursorPtr:hover{
          background-color: ${theme?.markatePlaceBackground} !important;
        }
        .mv_subHeaderMobile{
          font-family: "Roboto", sans-serif !important;
        }
        .rating {
          bottom: 6px;
          right: 28px;
          z-index: 2;
          background: #000000c4;
        }
        .ratingmobile {
          top: 24vw;
          right: 6px;
          z-index: 2;
          background: #000000c4;
        }

        @media (min-width: 700px) and (max-width: 991.98px){
          :global(.globalArrowSlick .slick-next) {
            top: -5% !important;
            right: 0 !important;
          }
          :global(.globalArrowSlick .slick-prev) {
            top: -5%!important;
            left: 93%!important;
          }
        }
      `}</style>
    </Wrapper>
  );
};

export default ShoutoutProfileSlider;
