import React, { useState, useRef } from "react";
import Router from "next/router";
import { useSelector } from "react-redux";
import Wrapper from "../../hoc/Wrapper";
import CustomSlider from "../../components/slider/slider";
import useLang from "../../hooks/language";
import Skeleton from "react-loading-skeleton";
import isMobile from "../../hooks/isMobile";
import { playIconStory, BANNER_PLACEHOLDER_IMAGE, volume_up, volume_mute, left_slick_arrow_dark, right_slick_arrow_dark } from "../../lib/config/homepage";
import { useTheme } from "react-jss";
import CustomDataLoader from "../../components/loader/custom-data-loading";
import Icon from "../../components/image/icon";
import FigureCloudinayImage from "../../components/cloudinayImage/cloudinaryImage";
import { getCookie, setCookie } from "../../lib/session";
import { open_dialog, open_drawer, open_progress, startLoader } from "../../lib/global/loader";
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import Image from "../../components/image/image";
import isTablet from "../../hooks/isTablet";
import { handleContextMenu } from "../../lib/helper";

const FeaturedMoment = (props) => {
  const { data, aspectRatio, type, label, id } = props;
  const [lang] = useLang();
  const theme = useTheme();
  const videoRef = useRef();
  const APP_IMG_LINK = useSelector((state) => state?.appConfig?.baseUrl);
  const [count, setCount] = useState(0);
  const [skeleton, setSkeleton] = useState(false);
  const [isVideoPlayed, setIsVideoPlayed] = useState(false);
  const [videoSpinnser, setVideoSpinner] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState("");
  const [isVideoMute, setisVideoMute] = useState(true);
  const [mobileView] = isMobile();
  const [tabletView] = isTablet();
  const settings = {
    slidesToShow: mobileView ? 5.2 : tabletView ? 3.2 : 5.2,
    dots: false,
    lazyLoad: true,
    initialSlide: 0,
    infinite: false,
    autoplay: false,
    speed: 500,
    arrows: true,
    slidesToScroll: 1,
    afterChange: (current) => setCount(current),
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

  const playVideo = (e, video) => {
    e.stopPropagation();
    mobileView ? open_drawer("VDO_DRAWER", 
    { vdoUrl: getVideoUrl(video), creator: video.creator}, "right") : 
    open_dialog("HOMEPAGE_VIDEO_DRAWER", { vdoUrl: getVideoUrl(video),  creator: video.creator });
    setIsVideoPlayed(false);

    // if video dont want to open in dialog and drawer than use these lines
    // setIsVideoPlayed(true);
    // setVideoId(video?._id)
    // setVideoUrl(`${APP_IMG_LINK}/${video?.videoUrl}`);
  };

  const handleShoutoutDetail = (e, shoutoutDetail) => {
    e.stopPropagation();
    mobileView && open_drawer("shoutoutDetail", {shoutoutDetail}, "right")
  }

  const getVideoUrl = (video) => {
    if(video?.otherUrls){
      return mobileView ? video?.otherUrls?.mobile : video?.otherUrls?.web
    }else{
      return `${APP_IMG_LINK}/${video?.videoUrl}`;
    }
  }

  const playVideoOnHover = (e, video) => {
    setIsVideoPlayed(true);
    setisVideoMute(true);
    setVideoId(video?._id);
    setVideoUrl(getVideoUrl(video));
    e.stopPropagation();
  }

  const handleProfileDirection = (user) => {
    mobileView ? startLoader() : open_progress();
    if(getCookie("uid") == user?.creator?.id){
      Router.push("/profile")
    }else{
      setCookie("otherProfile", `${user?.creator?.username.trim() || user?.creator?.userName.trim() || user?.creator?.profilename.trim()}$$${user?.creator?.creatorId || user?.creator?.userid || user?.creator?._id}`);
      Router.push(`/${user?.creator?.username || user?.creator?.username}`);
    }

  };

  const openFullscreen = (e) => {
    let fullscreenEle = document.getElementById("myvideo");
    if (fullscreenEle.requestFullscreen) {
      fullscreenEle.requestFullscreen();
    } else if (fullscreenEle.mozRequestFullScreen) {
      fullscreenEle.mozRequestFullScreen();
    } else if (fullscreenEle.webkitRequestFullscreen) {
      fullscreenEle.webkitRequestFullscreen();
    } else if (fullscreenEle.msRequestFullscreen) {
      fullscreenEle.msRequestFullscreen();
    } else {
      fullscreenEle.classList.toggle('fullscreen');
    }
  }

  return (
    <Wrapper>
      {!mobileView ? (
        <>
          <div className="col-12 pb-5 px-0">
            <div className="d-flex align-items-center align-items-center justify-content-between">
              <h6 className="mv_subHeader my-2">{lang.featuredMoments}</h6>
              <p
                className="mb-3 mt-3 fntSz16 position-absolute font-weight-600 appTextColor cursorPtr"
                onClick={() =>
                  Router.push(
                    `/homepage/feature_moment?caterory_label=${label}&&id=${id}&&type=${type}`
                  )
                }
                // style={{ top: "-3px", right: "7%"}}
                style={{ right: `${tabletView ? "8%" : "7%"}`}}
              >
                {lang.viewAll}
              </p>
            </div>
            <div className="d-flex">
              <div className="col-12 px-0 pt-0 globalMomentSlide"
                onMouseLeave={()=> setIsVideoPlayed(false)}
              >
                <CustomSlider settings={settings} className="featuredMoments">
                  {data.length > 0 &&
                    data.map((featureMov, index) => (
                      <>
                        {(isVideoPlayed && videoId == featureMov?._id) ? (
                          <div
                            key={index}
                            className="h-100 ml-1 position-relative"
                            style={{
                              // aspectRatio: "186/236",
                              background: "#000",
                              borderRadius: "0.366vw",
                              marginLeft: "2px",
                              width: "90%"
                            }}
                          >
                            {videoSpinnser && <div className="position-absolute" style={{
                              top: "50%",
                              left: "45%",
                            }}>
                                <CustomDataLoader type="ClipLoader" loading={true} size={20} />
                            </div>}
                            <Icon
                              icon={`${playIconStory}#Icon_ionic-ios-play`}
                              size={16}
                              color="#fff"
                              class="position-absolute ml-2 cursorPtr mt-2"
                              viewBox="0 0 12.643 15.802"
                              style={{ zIndex: "99" }}
                              onClick={(e) => playVideo(e, featureMov)}
                            />
                            <video
                              src={
                                videoUrl.includes("m3u8")
                                  ? videoUrl.slice(0, -4) + "mp4"
                                  : videoUrl
                              }
                              autoplay="autoplay"
                              muted={isVideoMute}
                              height="100%"
                              width="100%"
                              ref={videoRef}
                              id="myvideo"
                              onEnded={() => {setIsVideoPlayed(false);setisVideoMute(prev=> !prev)}}
                              onLoadStart={()=> setVideoSpinner(true)}
                              onLoadedData={()=> setVideoSpinner(false)}
                            />
                           {isVideoMute ?  <Icon
                              icon={`${volume_mute}#volumeMute`}
                              size={16}
                              color={theme.text}
                              class="position-absolute cursorPtr ml-2 mt-2"
                              viewBox="0 0 30.191 22.638"
                              style={{right:"40px", zIndex: "99", top: "-2px"}}
                              onClick={(e) => setisVideoMute(prev=> !prev)}
                            /> : 
                            <Icon
                              icon={`${volume_up}#volumeUp`}
                              size={16}
                              color={theme.text}
                              class="position-absolute cursorPtr ml-2 mt-2"
                              viewBox="0 0 30.848 25.83"
                              style={{right:"40px", zIndex: "99", top: "-2px"}}
                              onClick={(e) => setisVideoMute(prev=> !prev)}
                            />}
                            <FullscreenIcon onClick={(e)=>openFullscreen(e)}  className="position-absolute ml-2 cursorPtr mt-2" style={{right:"5px", color: "#fff"}} />
                          </div>
                        ) : (
                          <div
                            key={index}
                            className={`cursorPtr ${
                              mobileView
                                ? "position-relative mx-2 w-100 h-100"
                                : "position-relative webStyleCss h-100 w-100"
                            }`}
                            style={{ paddingRight: "20px", aspectRatio: "186/234" }}
                          >
                            <Icon
                              icon={`${playIconStory}#Icon_ionic-ios-play`}
                              size={16}
                              color="#fff"
                              class="position-absolute ml-2 mt-2"
                              viewBox="0 0 12.643 15.802"
                              style={{ zIndex: "99" }}
                              onClick={(e) => playVideo(e, featureMov)}
                            />
                              <div className="position-relative h-100 callout-none" onContextMenu={handleContextMenu}>
                              <FigureCloudinayImage
                                publicId={featureMov.thumbnailUrl}
                                crop="thumb"
                                ratio={1}
                                quality={100}
                                transformWidth="16vw"
                                errorImage={BANNER_PLACEHOLDER_IMAGE}
                                style={{
                                  width: "100%",
                                  borderRadius: "0.366vw",
                                  objectFit: "cover",
                                  objectPosition: "top",
                                  transition:
                                    "transform 0.4s cubic-bezier(0.17, 0.67, 0.13, 1.02) 0s",
                                }}
                                  visibleByDefault={true}
                                className="titleImg object-fit-cover bg-shadow"
                                alt={featureMov.username || "banner_image"}
                              />
                              <div
                                className="blackLayer"
                                onClick={(e) =>
                                  playVideoOnHover(e, featureMov)
                                }
                                onMouseEnter={(e)=> playVideoOnHover(e, featureMov)}
                                onMouseLeave={()=> setIsVideoPlayed(false)}
                              ></div>
                            </div>
                            <div
                                className="makeDivCenterCss callout-none" onContextMenu={handleContextMenu}
                              onClick={()=> handleProfileDirection(featureMov)}
                            >
                              <FigureCloudinayImage
                                publicId={featureMov?.creator?.profilePic}
                                height={64}
                                width={64}
                                crop="thumb"
                                ratio={1}
                                quality={100}
                                errorImage={BANNER_PLACEHOLDER_IMAGE}
                                className="m-auto"
                                alt={
                                  featureMov?.creator?.username ||
                                  "banner_image"
                                }
                                style={{ borderRadius: "50%" }}
                              />
                              <p className="pt-2 white text-center mb-0 fntSz16 fntWeight600">
                                {featureMov?.creator?.username}
                              </p>
                            </div>
                          </div>
                        )}
                        <div></div>
                      </>
                    ))}
                </CustomSlider>
              </div>
            </div>{" "}
          </div>
        </>
      ) : (
        <div className="w-100 pb-2">
          <div className="d-flex align-items-center justify-content-between">
            <p className="mv_subHeaderMobile fntSz24 mb-3 mt-3 ml-sm-2 ml-lg-0">{lang.featuredMoments}</p>
            <p
              className="mb-3 mt-3 app-link cursorPtr"
              onClick={() =>
                Router.push(
                  `/homepage/feature_moment?caterory_label=${label}&&id=${id}&&type=${type}`
                )
              }
            >
              {lang.viewAll}
            </p>
          </div>
          <div
            className="nav sliUL featuredMomentsMobile"
            style={{
              flexWrap: "nowrap",
              overflow: "hidden",
              overflowX: "auto",
            }}
          >
            {skeleton ? (
              <>
                  {[...new Array(3)].map((skalaton, index) => (
                  <Skeleton
                    variant="rect"
                    width={133}
                    height={155}
                    key={index}
                    className="mx-2 feat_skelt bg-color"
                  />
                ))}
              </>
            ) : (
              <>
                {data &&
                  data.map((featureMov, index) => {
                    return (
                      <>
                        {(isVideoPlayed && videoId == featureMov?._id) ? (
                          <div
                            className="mx-2 position-relative"
                            style={{
                              aspectRatio: "145/161",
                              minWidth: "133px"
                            }}
                          >
                            {videoSpinnser && <div className="position-absolute" style={{
                              top: "46%",
                              left: "42%",
                            }}>
                                <CustomDataLoader type="ClipLoader" loading={true} size={20} />
                            </div>}
                            <video
                              src={
                                videoUrl.includes("m3u8")
                                  ? videoUrl.slice(0, -4) + "mp4"
                                  : videoUrl
                              }
                              autoPlay
                              height="100%"
                              width="100%"
                              ref={videoRef}
                              muted={isVideoMute}
                              style={{background: "#000"}}
                              onEnded={() => setIsVideoPlayed(false)}
                              onLoadStart={()=> setVideoSpinner(true)}
                              onLoadedData={()=> setVideoSpinner(false)}
                            />
                            {isVideoMute ?  <Icon
                              icon={`${volume_mute}#volumeMute`}
                              size={16}
                              color={theme.text}
                              class="position-absolute cursorPtr ml-2 mt-2"
                              viewBox="0 0 30.191 22.638"
                              style={{right:"10px", zIndex: "99", top: "-2px"}}
                              onClick={(e) => setisVideoMute(prev=> !prev)}
                            /> : 
                            <Icon
                              icon={`${volume_up}#volumeUp`}
                              size={16}
                              color={theme.text}
                              class="position-absolute cursorPtr ml-2 mt-2"
                              viewBox="0 0 30.848 25.83"
                              style={{right:"10px", zIndex: "99", top: "-2px"}}
                              onClick={(e) => setisVideoMute(prev=> !prev)}
                            />}
                          </div>
                        ) : (
                          <div
                              className="mx-2 position-relative callout-none"
                              onContextMenu={handleContextMenu}
                            style={{
                              aspectRatio: `${isMobile ? '1/1' : '145/161'}`,
                              minWidth: `${isMobile ? 'calc(100% / 3)' : '133px'}`
                            }}
                          >
                            <Icon
                              icon={`${playIconStory}#Icon_ionic-ios-play`}
                              size={16}
                              color="#fff"
                              class="position-absolute ml-2 mt-2"
                              viewBox="0 0 12.643 15.802"
                              style={{ zIndex: "99" }}
                              onClick={(e) => playVideoOnHover(e, featureMov)}
                            />
                            <FigureCloudinayImage
                              publicId={featureMov.thumbnailUrl}
                              crop="thumb"
                              ratio={1}
                              quality={100}
                              transformWidth={133}
                              errorImage={BANNER_PLACEHOLDER_IMAGE}
                              style={{
                                width: "100%",
                                borderRadius: "8px",
                                objectFit: "cover",
                                objectPosition: "top",
                                height: "100%",
                                transition:
                                  "transform 0.4s cubic-bezier(0.17, 0.67, 0.13, 1.02) 0s",
                              }}
                              className="titleImg object-fit-cover bg-shadow"
                              alt={featureMov.username || "banner_image"}
                              onClick={(e) => handleShoutoutDetail(e, featureMov)}
                            />
                            <div
                                className="makeDivCenterCss callout-none"
                                onContextMenu={handleContextMenu}
                              onClick={()=> handleProfileDirection(featureMov)}
                            >
                              <FigureCloudinayImage
                                publicId={featureMov?.creator?.profilePic}
                                height={50}
                                width={50}
                                crop="thumb"
                                ratio={1}
                                quality={100}
                                errorImage={BANNER_PLACEHOLDER_IMAGE}
                                className="m-auto"
                                alt={
                                  featureMov?.creator?.username ||
                                  "banner_image"
                                }
                                style={{ borderRadius: "50%" }}
                              />
                              <p className="white py-2 text-center mb-0 fntSz14 fntWeight700">
                                {featureMov?.creator?.username}
                              </p>
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })}
              </>
            )}
          </div>
        </div>
      )}
      <style jsx>{`
        :global(.sliUL .feat_skelt) {
          min-width: 133px;
          border-radius: 8px;
        }
        .blackLayer {
          background: transparent
            linear-gradient(0deg, #000000 0%, #54545400 100%) 0% 0% no-repeat
            padding-box;
          position: absolute;
          top: ${mobileView ? "0" : "1px"};
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 6px;
        }
        .makeDivCenterCss {
          position: absolute;
          top: ${mobileView ? "73%" : "78%"};
          left: ${mobileView ? "49%" : "46%"};
          -webkit-transform: translateX(-50%) translateY(-50%);
          transform: translateX(-50%) translateY(-50%);
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
        :global(.globalMomentSlide .slick-prev) {
          width: auto;
          height: 25px;
          cursor: pointer;
          top: -11% !important;
          left: 94% !important;
        }
        :global(.globalMomentSlide .slick-next) {
          width: auto;
          height: 25px;
          cursor: pointer;
          top: -11% !important;
          right: 20px !important;
        }
        :global(.globalMomentSlide .slick-track) {
          position: relative;
          top: 0;
          left: 0;
          display: block;
          margin: 0;
        }
        :global(.globalMomentSlide .slick-prev:before) {
          color: ${theme.type == "light" ? "#5a5757" : "#fff"};
          font-size: 25px;
        }
        :global(.globalMomentSlide .slick-next:before) {
          color: ${theme.type == "light" ? "#5a5757" : "#fff"};
          font-size: 25px;
        }
        :global(.webStyleCss .lazy-load-image-loaded) {
          overflow: hidden;
        }
        :global(.webStyleCss .lazy-load-image-loaded) {
          overflow: hidden;
        }
        :global(.featuredMoments .slick-list) {
          aspect-ratio:${aspectRatio.width} / ${aspectRatio.height};
        }
        .featuredMomentsMobile {
          aspect-ratio: ${aspectRatio.width} / ${aspectRatio.height};
        }
        :global(.featuredMoments .slick-track) {
          height: 100%;
        }
        :global(.featuredMoments .slick-slide > div) {
          height: 100%;
        }
        .cursorPtr:hover{
          background-color: ${theme?.markatePlaceBackground} !important;
        }
        .mv_subHeaderMobile{
          font-family: "Roboto", sans-serif !important;
        }

        @media (min-width: 700px) and (max-width: 991.98px){
          :global(.globalMomentSlide .slick-next) {
            top: -16%!important;
            right: 0 !important;
          }
          :global(.globalMomentSlide .slick-prev) {
            top: -16% !important;
            left: 93%!important;
          }
        }
      `}</style>
    </Wrapper>
  );
};

export default FeaturedMoment;
