import React from "react";
import Router from "next/router";
import { useTheme } from "react-jss";
import { useSelector } from "react-redux";
import Wrapper from "../../hoc/Wrapper";
import isMobile from "../../hooks/isMobile";
import useLang from "../../hooks/language";
import {
  tagIcon,
  NO_FEATURE_CREATORE_HOLDER,
  playIconStory,
  BANNER_PLACEHOLDER_IMAGE,
  volume_up,
  volume_mute,
  user_category_time,
  STAR_ICON_OTHERPROFIE,
} from "../../lib/config";
import FigureCloudinayImage from "../../components/cloudinayImage/cloudinaryImage";
import Img from "../../components/ui/Img/Img";
import Icon from "../../components/image/icon";
import CustomDataLoader from "../../components/loader/custom-data-loading";
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import isTablet from "../../hooks/isTablet";

const GetUIaccrodingCategory = (props) => {
  const theme = useTheme();
  const [lang] = useLang();
  const [mobileView] = isMobile();
  const [tabletView] = isTablet();
  const handleCategoryLabel = (data) => {
    let url = "";
    if(data.length > 0){
      data.forEach((category, index)=>{
        url = url + `${category.title}${data.length-1 == index ? "" : ", "}`
      })
    }
    return url;
  }

  const handleCatUI = () => {
    switch (props?.headerTitle) {
      case lang.featured:
        return (
          <div className={`row m-0 ${mobileView ? "px-0" : "px-2"}`}>
            {props?.featureCreatorList.length > 0 ? (
              props?.featureCreatorList?.map((feature, index) => (
                <div
                  className={`${mobileView ? "col-6" : "col-3"} p-2 cursorPtr`}
                  onClick={() => props.profileClickHandler(feature)}
                >
                  <div style={{ height: "200px" }}>
                    <FigureCloudinayImage
                      publicId={feature.profilePic || feature.bannerImage}
                      alt={feature.fullName}
                      className="imgStyle"
                      height={200}
                    />
                  </div>
                  <div className="pt-1">{feature.fullName}</div>
                  <p className="fntSz12 userStatementColor m-0">
                    {handleCategoryLabel(feature?.categories)}
                  </p>
                  <div className="d-flex justify-content-between pt-1">
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
                    <div className="fntSz14 bookBtnStyle cursorPtr">book</div>
                  </div>
                </div>
              ))
            ) : (
              <div className={`placeHolderCss pt-5 ${!mobileView && "col-12"}`}>
                <Img
                  src={NO_FEATURE_CREATORE_HOLDER}
                  alt="No Post Yet! Placeholder Image"
                  className="pt-5"
                />
                <h3
                  className={`w-100 pt-2 text-center ${
                    mobileView && "fntSz20"
                  }`}
                >
                  {lang.noCategoryUser}
                </h3>
              </div>
            )}
            <style jsx>{`
              .userStatementColor {
                color: ${theme.type == "light" ? theme?.text : "#d4d5dc"};
              }
            `}</style>
          </div>
        );
        break;
      case lang.popular:
        return (
          <div className={`row m-0 ${mobileView ? "px-0" : "px-2"}`}>
            {props.popularCreatorList.length > 0 ? (
              props.popularCreatorList?.map((popular, index) => (
                <div
                  className={`${mobileView ? "col-6" : "col-3"} p-2 cursorPtr`}
                  onClick={() => props.profileClickHandler(popular)}
                >
                  <div style={{ height: "200px" }}>
                    <FigureCloudinayImage
                      publicId={popular.profilePic || popular.bannerImage}
                      alt={`${popular.firstName} ${popular.lastName}`}
                      className="imgStyle"
                    />
                  </div>
                  <div className="py-1">{`${popular.firstName} ${popular.lastName}`}</div>
                  <p className="fntSz12 userStatementColor m-0">
                    {handleCategoryLabel(popular?.categories)}
                  </p>
                  <div className="d-flex justify-content-between pt-1">
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
                    <div className="fntSz14 bookBtnStyle cursorPtr">book</div>
                  </div>
                </div>
              ))
            ) : (
              <div className={`placeHolderCss pt-5 ${!mobileView && "col-12"}`}>
                <Img
                  src={NO_FEATURE_CREATORE_HOLDER}
                  alt="No Post Yet! Placeholder Image"
                  className="pt-5"
                />
                <h3
                  className={`w-100 pt-2 text-center ${
                    mobileView && "fntSz20"
                  }`}
                >
                  {lang.noCategoryUser}
                </h3>
              </div>
            )}
            <style jsx>{`
              .userStatementColor {
                color: ${theme.type == "light" ? theme?.text : "#d4d5dc"};
              }
            `}</style>
          </div>
        );
        break;
      case lang.categories:
        return (
          <div className={`row w-100 m-0 ${mobileView ? "px-1" : "px-2"}`}>
            {props?.activeCateData.length > 0 ? (
              props?.activeCateData?.map((cate, index) => (
                <div
                  className={`${
                    mobileView ? "col-6" : "col-2"
                  } p-2 position-relative cursorPtr`}
                  onClick={() =>
                    Router.push(
                      `/homepage/user_avilabel_categories?caterory_label=${cate.categoryTitle || cate?.title}&&id=${cate?._id}&&type=CategorySection&&isFromCategorySection=${true}`
                    )
                  }
                style={{aspectRatio: mobileView ? "" : "179/124"}}
                >
                  <div
                    className="position-relative"
                    style={{ height: mobileView ? "102px" : "100%" }}
                  >
                    <FigureCloudinayImage
                      publicId={mobileView ? cate.appUrl : cate.webUrl}
                      alt="category"
                      className="imgStyle"
                      ratio={1}
                      quality={100}
                      crop="thumb"
                      style={{borderRadius: "8px"}}
                    />
                  </div>
                  <div
                    className={`py-1 ${
                      mobileView ? "catTitleMobileCss" : "w-100 text-center catTitle"
                    }`}
                  >
                    {cate?.categoryTitle || cate?.title}
                  </div>
                </div>
              ))
            ) : (
              <div className={`placeHolderCss pt-5 ${!mobileView ? "col-12" : "mx-auto"}`}>
                <Img
                  src={NO_FEATURE_CREATORE_HOLDER}
                  alt="No Post Yet! Placeholder Image"
                  className="pt-5"
                />
                 <h3
                  className={`${!mobileView && "w-100"} pt-2 text-center ${
                    mobileView && "fntSz20"
                  }`}
                  style={{width: mobileView ? "250px" : ""}}
                >
                  {lang.noCategoryAvailable}
                </h3>
              </div>
            )}
            <style jsx>{`
              .catTitle {
                position: absolute;
                bottom: 12px;
                left: 0;
                font-weight: 600;
                color: #fff;
              }
              .catTitleMobileCss {
                position: absolute;
                top: 74%;
                width: 100%;
                left: 50%;
                transform: translateX(-50%) translateY(-50%);
                font-weight: 600;
                text-align: center;
                color: #fff;
              }
            `}</style>
          </div>
        );
        break;
      case "user_categories":
      case "user_avilabel_categories":
      case "category_list":
        return (
          <div className={`row row-cols-5 w-100 m-0 ${mobileView ? "px-0" : "px-2"}`}>
            {props?.activeCateData && props?.activeCateData.length > 0 ? (
              props?.activeCateData?.map((live, index) => (
                <div
                  className={`${
                    mobileView
                      ? "col-6"
                      : `${
                          props?.isFilterVisible &&
                          props?.isFilterAvailabelForCat
                            ? "col-3 col-sm-4 col-lg-3"
                            : "col"
                        } pr-3`
                  } p-2 cursorPtr`}
                  onClick={() => props.profileClickHandler(live)}
                >
                  {live?.avgUserRating && <div className={`position-absolute d-flex px-2 rounded-sm justify-content-center align-align-items-center  badge badge-dark ${mobileView ? "ratingmobile" : "rating" }`}>
                          <img src={STAR_ICON_OTHERPROFIE} alt="rating icon" />
                    <span className="ml-1">{live?.avgUserRating?.toFixed(2)}</span>
                          </div>}
                  <div className={`${!mobileView && "img-zoom-hover position-relative"}`} style={{ height: mobileView ? "182px" : tabletView ? "162px" : "250px" }}>
                    <FigureCloudinayImage
                      publicId={live.profilePic || live.bannerImage}
                      alt={`${live.firstName} ${live.lastName}`}
                      className="imgStyle"
                      ratio={1}
                      quality={100}
                      crop="thumb"
                      style={{transition: !mobileView && "transform 0.4s cubic-bezier(0.17, 0.67, 0.13, 1.02) 0s", aspectRatio: mobileView ? "" : "234/280", height: mobileView ? "100%" : ""}}
                    />
                  </div>
                  <div className={`${mobileView ? "py-1" : "pb-1 pt-0"} fntWeight700`}>{live.username}</div>
                  {live?.shoutoutPrice?.price && (
                    <>
                      <p className="fntSz12 userStatementColor text-truncate font-weight-500 m-0">
                        {handleCategoryLabel(live?.categories)}
                      </p>
                    {live?.shoutoutPrice?.price && 
                    <div className="d-flex justify-content-between pt-1">
                        <div className="fntSz14 d-flex align-items-center">
                         {/* {mobileView ? (props?.isVidecall ? live?.videoCallPrice?.price : live?.shoutoutPrice?.price) && */}
                            <Icon
                              icon={`${tagIcon}#tagIconId`}
                              size={15}
                              color={theme.text}
                              class="pr-1 pb-1"
                              viewBox="0 0 14.693 14.57"
                            /> 
                            {/* // : <> */}
                              {/* {(!props?.isVidecall && live?.shoutoutPrice?.price) && <span className="fntSz12 font-weight-100">{lang.from}</span>}
                              {(props?.isVidecall && live?.videoCallPrice?.price) && <span className="fntSz12 font-weight-100">{lang.from}</span>}
                            </>} */}
                            <span className="pl-1 fntWeight600">{props?.isVidecall ? live?.videoCallPrice?.currencyCode : live?.shoutoutPrice?.currencySymbol}
                              {props?.isVidecall ? live?.videoCallPrice?.price : (+live?.shoutoutPrice?.price).toFixed(2)}</span>
                        </div>
                        {props?.isVidecall && live?.videoCallPrice?.duration && (
                          <div className="fntSz14 d-flex align-items-center pl-1 fntSz14 px-2">
                            <Icon
                              icon={`${user_category_time}#time`}
                              size={12}
                              color={theme.text}
                              class="pr-1 pb-1"
                              viewBox="0 0 13 13"
                            />
                            <span className="fntSz12">{live?.videoCallPrice?.duration}</span>
                          </div>
                        )}
                      </div>}
                    </>
                  )}
                </div>
              ))
            ) : (
              <div className={`placeHolderCss pt-5 ${!mobileView ? "col-12" : "mx-auto"}`}>
                <Img
                  src={NO_FEATURE_CREATORE_HOLDER}
                  alt="No Post Yet! Placeholder Image"
                  className="pt-5"
                />
                <h3
                  className={`${!mobileView && "w-100"} pt-2 text-center ${
                    mobileView && "fntSz20"
                  }`}
                  style={{width: mobileView ? "250px" : ""}}
                >
                  {lang.noCategoryUser}
                </h3>
              </div>
            )}
            <style jsx>{`
            .userStatementColor {
                color: ${theme.type == "light" ? theme?.text : "#d4d5dc"};
              }
              .rating {
                  top: 242px;
                  right: 22px;
                  z-index: 2;
                  background: #000000c4;
                }
              .ratingmobile {
                  top: 166px;
                  right: 15px;
                  z-index: 2;
                  background: #000000c4;
              }
            `}</style>
          </div>
        );
      case "feature_moment":
        return (
          <div className={`row row-cols-5 w-100 m-0 ${mobileView ? "px-0" : "px-2"}`}
            onMouseLeave={()=> props?.endVideoFunc(false)}
          >
            {props?.activeCateData.length > 0 ? (
              props?.activeCateData?.map((live, index) => {
                return (props?.isVideoPlayed && props?.videoId == live?._id) ? (
                  <div
                    className={`${
                      mobileView
                        ? "col-6 p-2"
                        : `${
                            props?.isFilterVisible &&
                            props?.isFilterAvailabelForCat
                              ? "col-3"
                              : "col"
                          }`
                    } cursorPtr`}
                    style={{aspectRatio: mobileView ? "" : "225/236", padding: mobileView ? "" : "9px 15px"}}
                  >
                    <div
                      style={{ height: mobileView ? "184px" : "calc(100% - 15px)", width: mobileView ? "" : "100%"}}
                    >
                       {props?.videoSpinnser && <div className="position-absolute" style={{
                            top: "46%",
                            left: "42%",
                        }}>
                            <CustomDataLoader type="ClipLoader" loading={true} size={20} />
                        </div>}
                        {!mobileView && 
                          <Icon
                          icon={`${playIconStory}#Icon_ionic-ios-play`}
                          size={16}
                          color="#fff"
                          class="position-absolute ml-2 mt-2"
                          viewBox="0 0 12.643 15.802"
                          style={{ zIndex: "1" }}
                          onClick={(e) => mobileView ? props?.playVideoOnHover(e,live) : props.handleShoutoutVideo(live)}
                      />
                    }
                    <video
                      src={
                        props?.videoUrl.includes("m3u8")
                          ? props?.videoUrl.slice(0, -4) + "mp4"
                          : props?.videoUrl
                      }
                      autoPlay
                      muted={props?.isVideoMute}
                      height="100%"
                      width="100%"
                      id="myvideo"
                      ref={props?.fullscreenEle}
                      style={{ background: "#000", borderRadius: "5px" }}
                      onEnded={() => {props.endVideoFunc(false);props?.setisVideoMute(prev=> !prev)}}
                      onLoadStart={()=> props?.setVideoSpinner(true)}
                      onLoadedData={()=> props?.setVideoSpinner(false)}
                    />
                     {props?.isVideoMute ?  <Icon
                              icon={`${volume_mute}#volumeMute`}
                              size={16}
                              color={theme.text}
                              class="position-absolute cursorPtr ml-2 mt-2"
                              viewBox="0 0 30.191 22.638"
                              style={{right: mobileView ? "20px" : "48px", zIndex: "9", top: "6px"}}
                              onClick={(e) => props?.setisVideoMute(prev=> !prev)}
                            /> : 
                      <Icon
                        icon={`${volume_up}#volumeUp`}
                        size={16}
                        color={theme.text}
                        class="position-absolute cursorPtr ml-2 mt-2"
                        viewBox="0 0 30.848 25.83"
                        style={{right: mobileView ? "20px" : "48px", zIndex: "9", top: "6px"}}
                        onClick={(e) => props?.setisVideoMute(prev=> !prev)}
                      />}
                      {!mobileView && <FullscreenIcon onClick={(e)=>props?.openFullscreen(e)}  className="position-absolute ml-2 cursorPtr mt-2" style={{right:"16px", color: "#fff"}} />}
                    </div>
                  </div>
                ) : (
                  <div
                    className={`${
                      mobileView
                        ? "col-6 p-2"
                        : `${
                            props?.isFilterVisible &&
                            props?.isFilterAvailabelForCat
                              ? "col-3"
                              : "col"
                          } py-2`
                    } cursorPtr`}
                    style={{aspectRatio: mobileView ? "" : "225/236"}}
                  >
                    <div style={{ height: mobileView ? "184px" : "", aspectRatio: mobileView ? "" : "225/236" }}>
                      <Icon
                        icon={`${playIconStory}#Icon_ionic-ios-play`}
                        size={16}
                        color="#fff"
                        class="position-absolute ml-2 mt-2"
                        viewBox="0 0 12.643 15.802"
                        style={{ zIndex: "1" }}
                        onClick={(e) => mobileView ? props?.playVideoOnHover(e,live) : props.handleShoutoutVideo(live)}
                      />
                      <div
                        className="position-relative h-100"
                        onClick={(e) => mobileView ? props?.handleShoutoutDetail(e,live) : props.handleShoutoutVideo(live)}
                      >
                        <FigureCloudinayImage
                          publicId={live?.thumbnailUrl}
                          className="imgStyle object-fit-cover"
                          crop="thumb"
                          ratio={1}
                          quality={100}
                        />
                        <div
                          className="blackLayer"
                          onMouseEnter={(e)=> mobileView ? props?.handleShoutoutDetail(e,live) : props.playVideoOnHover(e, live)}
                          onMouseLeave={()=> props.endVideoFunc(false)}
                        ></div>
                      </div>
                      <div
                        className="makeDivCenterCss"
                        onClick={() => props?.handleProfileDirection(live)}
                      >
                        <FigureCloudinayImage
                          publicId={live?.creator?.profilePic}
                          height={mobileView ? "50px" : "61px"}
                          width={mobileView ? "50px" : "61px"}
                          crop="thumb"
                          ratio={1}
                          quality={100}
                          errorImage={BANNER_PLACEHOLDER_IMAGE}
                          className="m-auto"
                          alt={live?.creator?.username || "banner_image"}
                          style={{ borderRadius: "50%" }}
                        />
                        <p className="white pt-2 text-center fntWeight700 mb-0 fntSz13">
                          {live?.creator?.username}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={`placeHolderCss pt-5 ${!mobileView ? "col-12" : "mx-auto"}`}>
                <Img
                  src={NO_FEATURE_CREATORE_HOLDER}
                  alt="No Post Yet! Placeholder Image"
                  className="pt-5"
                />
                <h3
                  className={`${!mobileView && "w-100"} pt-2 text-center ${
                    mobileView && "fntSz20"
                  }`}
                  style={{width: mobileView ? "250px" : ""}}
                >
                  {lang.noCategoryUser}
                </h3>
              </div>
            )}
            <style jsx>{`
            .userStatementColor {
                color: ${theme.type == "light" ? theme?.text : "#d4d5dc"};
              }
            `}</style>
          </div>
        );
      default:
        break;
    }
  };

  return (
    <Wrapper>
      {handleCatUI()}
      <style jsx>{`
        :global(.userStatementColor) {
          color: ${theme.type == "light" ? theme?.text : "#d4d5dc"};
        }
        .imgStyle {
          width: 100%;
        }
        :global(.userCardCss) {
          width: 100%;
          border-radius: 0.366vw;
          object-fit: cover;
          object-position: center top;
          height: 100%;
        }
        :global(.blackLayer) {
          background: transparent
            linear-gradient(0deg, #000000 0%, #54545400 100%) 0% 0% no-repeat
            padding-box;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 6px;
        }
        :global(.makeDivCenterCss) {
          position: absolute;
          top: ${mobileView ? "76%" : "73%"};
          left: ${mobileView ? "49%" : "51%"};
          -webkit-transform: translateX(-50%) translateY(-50%);
          transform: translateX(-50%) translateY(-50%);
        }
      `}</style>
    </Wrapper>
  );
};

export default GetUIaccrodingCategory;
