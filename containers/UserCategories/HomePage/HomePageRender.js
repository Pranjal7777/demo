import React, { useEffect, useState } from "react";
import Router from "next/router";
import { useSelector } from "react-redux";
import CustomSlider from "../../../components/slider/slider";
import Wrapper from "../../../hoc/Wrapper";
import isMobile from "../../../hooks/isMobile";
import useLang from "../../../hooks/language";
import { s3ImageLinkGen } from "../../../lib/UploadAWS/uploadAWS";
import {
  tagIcon,
  user_category_time,
  BANNER_PLACEHOLDER_IMAGE,
} from "../../../lib/config";
import { useTheme } from "react-jss";
import { Skeleton } from "@material-ui/lab";
import HorizonatalPagination from "../../../components/pagination/horizonatalPagination";
import CustomDataLoader from "../../../components/loader/custom-data-loading";
import Icon from "../../../components/image/icon";
import FigureCloudinayImage from "../../../components/cloudinayImage/cloudinaryImage";
import { open_dialog, open_drawer } from "../../../lib/global";

const HomePageData = (props) => {
  const { sectionData, type, skeleton } = props;
  const [mobileView] = isMobile();
  const theme = useTheme();

  const [lang] = useLang();
  const APP_IMG_LINK = useSelector((state) => state?.appConfig?.baseUrl);
  const [liveMoment, setLiveMoment] = useState(props?.sectionData || []);
  const [isLoading, setIsLoading] = useState(false);
  const settings = {
    slidesToShow: 6.2,
    dots: false,
    lazyLoad: true,
    initialSlide: 0,
    infinite: false,
    autoplay: false,
    speed: 500,
    arrows: true,
    slidesToScroll: 1,
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

  const handleCategoryClicks = (mom) => {
    switch (type) {
      case "SINGLE_IMAGE_BANNER":
        break;
      case "CATEGORY_SLIDER":
        break;
      case "SINGLE_VIDEO_BANNER":
        let videoUrl = mobileView ? mom?.appUrl : mom?.webUrl;
        let indexOfpublicId = videoUrl.indexOf("admin");
        videoUrl = videoUrl.slice(indexOfpublicId);
        handleShoutoutVideo(videoUrl);
        break;
      case "SHOUTOUT_PROFILE_SLIDER":
        Router.push(`/${mom.username || mom.userName}`);
        break;
      case "RECENTLY_VIEWED":
        Router.push(`/${mom.username || mom.userName}`);
        break;
      case "VIDEO_CALL_PROFILE_SLIDER":
        Router.push(`/${mom.username || mom.userName}`);
        break;
      case "SHOUTOUT_SLIDER":
        handleShoutoutVideo(mom?.videoUrl);
        break;
      default:
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
    setIsLoading(true);
  };

  useEffect(() => {
    setLiveMoment(props?.sectionData);
  }, []);
  return (
    <Wrapper>
      {!mobileView ? (
        <div className="col-12 px-0 pb-4">
          <div className="d-flex justify-content-between">
            <h6 className="mv_subHeader mb-0 mt-3">{props.label}</h6>
            <p
              className="mb-0 mt-3 app-link pr-5 pointer"
              onClick={() =>
                Router.push(
                  `/user_category/user_avilabel_categories?caterory_label=${props.label}`
                )
              }
            >
              {lang.viewAll}
            </p>
          </div>
          <div className="globalArrowSlick px-2">
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
              <CustomSlider settings={settings} className="m-0">
                {sectionData &&
                  sectionData.length > 0 &&
                  sectionData.map((mom, index) => (
                    <>
                      <div
                        key={index}
                        className={`cursorPtr ${
                          mobileView
                            ? "position-relative mx-2"
                            : "position-relative  img-zoom-hover px-2 webStyleCss"
                        }`}
                        onClick={() => handleCategoryClicks(mom)}
                      >
                        <FigureCloudinayImage
                          publicId={handelImage(mom)}
                          width="auto"
                          height={type == "CATEGORY_SLIDER" ? 115 : 209}
                          crop="thumb"
                          ratio={1}
                          errorImage={BANNER_PLACEHOLDER_IMAGE}
                          style={
                            type == "CATEGORY_SLIDER"
                              ? {
                                  width: "100%",
                                  borderRadius: "0.366vw",
                                  objectFit: "cover",
                                  objectPosition: "top",
                                  filter: `brightness(${50}%)`,
                                }
                              : {
                                  width: "100%",
                                  borderRadius: "0.366vw",
                                  objectFit: "cover",
                                  objectPosition: "top",
                                  height: "100%",
                                }
                          }
                          className="titleImg bg-shadow"
                          alt={mom.username || "banner_image"}
                          id={mom._id}
                        />
                      </div>
                      {props.isVideoCallComp ? (
                        <>
                          <p className="mb-0 px-2 fntSz16">
                            talk to snick about..
                          </p>
                          <p className="mb-0 px-2 fntSz14 sublineCss">
                            Symonnie Harrison
                          </p>
                        </>
                      ) : (
                        <>
                          {type !== "CATEGORY_SLIDER" &&
                            type !== "SHOUTOUT_SLIDER" &&
                            type !== "SINGLE_VIDEO_BANNER" && (
                              <>
                                <p className="mb-0 px-2 fntSz16">
                                  {mom?.username}
                                </p>
                                <p className="mb-0 px-2 fntSz14 sublineCss">
                                  NFL Hall of Fame - Londen
                                </p>
                              </>
                            )}
                        </>
                      )}
                      {type !== "CATEGORY_SLIDER" &&
                        type !== "SHOUTOUT_SLIDER" &&
                        type !== "SINGLE_VIDEO_BANNER" && (
                          <div className="d-flex px-2 pt-2 justify-content-between">
                            <div className="d-flex align-items-center">
                              <div className="fntSz14 d-flex align-items-center">
                                <Icon
                                  icon={`${tagIcon}#tagIconId`}
                                  size={12}
                                  color={theme.text}
                                  class="pr-1"
                                  viewBox="0 0 14.693 14.57"
                                />
                                <span>$50</span>
                              </div>
                              {props.isVideoCallComp && (
                                <div className="fntSz14 d-flex align-items-center pl-1 fntSz14 pl-2">
                                  <img
                                    src={user_category_time}
                                    height="12px"
                                    className="pr-1"
                                  />
                                  <span>5 mins</span>
                                </div>
                              )}
                            </div>
                            <div className="fntSz14 bookBtnStyle cursorPtr">
                              {lang.book}
                            </div>
                          </div>
                        )}
                    </>
                  ))}
              </CustomSlider>
            )}
          </div>
        </div>
      ) : (
        <div className="col-12 p-0 pb-2">
          <div className="d-flex justify-content-between">
            <h6 className="mv_subHeader mb-3 mt-3">{props.label}</h6>
            <p
              className="mb-3 mt-3 app-link cursorPtr"
              onClick={() =>
                Router.push(
                  `/user_category/user_avilabel_categories?caterory_label=${props.label}`
                )
              }
            >
              {lang.viewAll}
            </p>
          </div>
          <div
            className="nav sliUL"
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
                {sectionData &&
                  sectionData.length > 0 &&
                  sectionData.map((mom, index) => (
                    <div
                      className="mx-2 position-relative"
                      key={index}
                      onClick={() => handleCategoryClicks(mom)}
                    >
                      <FigureCloudinayImage
                        publicId={handelImage(mom)}
                        width={133}
                        height={type == "CATEGORY_SLIDER" ? 100 : 155}
                        crop="thumb"
                        ratio={1}
                        errorImage={BANNER_PLACEHOLDER_IMAGE}
                        style={
                          type == "CATEGORY_SLIDER"
                            ? {
                                height: "100px",
                                width: "142PX",
                                borderRadius: "8px",
                                filter: `brightness(${40}%)`,
                              }
                            : {
                                height: "155px",
                                width: "133px",
                                borderRadius: "8px",
                              }
                        }
                        className="titleImg bg-shadow"
                        alt={mom.username || "banner_image"}
                        id={mom._id}
                      />
                      {props.isVideoCallComp ? (
                        <>
                          <p className="mb-0 px-0 pt-1 fntSz16">
                            talk to snick about..
                          </p>
                          <p className="mb-0 px-0 fntSz14 sublineCss">
                            Symonnie Harrison
                          </p>
                        </>
                      ) : (
                        <>
                          {type !== "CATEGORY_SLIDER" &&
                            type !== "SHOUTOUT_SLIDER" &&
                            type !== "SINGLE_VIDEO_BANNER" && (
                              <>
                                <p className="mb-0 px-0 pt-1 fntSz16">
                                  {mom?.username}
                                </p>
                                <p className="mb-0 px-0 fntSz14 sublineCss">
                                  NFL Hall of Fame - Londen
                                </p>
                              </>
                            )}
                        </>
                      )}
                      {type !== "CATEGORY_SLIDER" &&
                        type !== "SHOUTOUT_SLIDER" &&
                        type !== "SINGLE_VIDEO_BANNER" && (
                          <div className="d-flex px-0 align-items-center pt-2 justify-content-between">
                            <div className="d-flex align-items-center w-100 justify-content-between">
                              <div className="fntSz14 d-flex align-items-center">
                                <Icon
                                  icon={`${tagIcon}#tagIconId`}
                                  size={12}
                                  color={theme.text}
                                  class="pr-1"
                                  viewBox="0 0 14.693 14.57"
                                />
                                <span>$50</span>
                              </div>
                              {props.isVideoCallComp && (
                                <div className="fntSz14 d-flex align-items-center pl-1 fntSz14 pl-2">
                                  <img
                                    src={user_category_time}
                                    height="12px"
                                    className="pr-1"
                                  />
                                  <span>5 mins</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
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
          color: #adaeb5;
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
          width: 14px !important;
          cursor: pointer;
          top: -4% !important;
          left: 98% !important;
        }

        :global(.globalArrowSlick .slick-next) {
          width: 14px !important;
          cursor: pointer;
          top: -4% !important;
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
        }

        :global(.globalArrowSlick .slick-next:before) {
          color: ${theme.type == "light" ? "#5a5757" : "#fff"};
        }

        
      `}</style>
    </Wrapper>
  );
};

export default HomePageData;
