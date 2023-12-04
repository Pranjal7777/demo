import React, { useState, useEffect, useRef } from "react";
import Router, { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { useTheme } from "react-jss";
import { getDayDifference } from "../../lib/date-operation/date-operation";
import Wrapper from "../../hoc/Wrapper";
import isMobile from "../../hooks/isMobile";
import * as config from "../../lib/config";
import Icon from "../../components/image/icon";
import MenuModelShoutout from "./modelMenu";
import { deleteShoutout, getOrderInCreatorProfile } from "../../services/shoutout";
import { GO_LIVE_SCREEN } from "../../lib/config";
import {
  close_dialog,
  close_drawer,
  open_dialog,
  open_drawer,
  startLoader,
  stopLoader,
} from "../../lib/global";
import { getCookie } from "../../lib/session";
import PaginationIndicator from "../../components/pagination/paginationIndicator";
import useLang from "../../hooks/language";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import CustomDataLoader from "../../components/loader/custom-data-loading";
import FilterOption from "../../components/filterOption/filterOption";
import { isAgency } from "../../lib/config/creds";
import { handleContextMenu } from "../../lib/helper";
import { authenticate } from "../../lib/global/routeAuth";
const FigureCloudinayImage = dynamic(() => import("../../components/cloudinayImage/cloudinaryImage"), { ssr: false });

const ShoutoutPosts = (props) => {
  const { setSelectedSorting = () => { return } } = props;
  const [mobileView] = isMobile();
  const userIdState = props?.userId || getCookie("uid");
  const theme = useTheme();
  const [lang] = useLang();
  const IMAGE_LINK = useSelector((state) => state?.cloudinaryCreds?.IMAGE_LINK);
  const router = useRouter();
  let fullscreenEle = document.getElementById("myvideo");
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);
  const scrolledPositionRef = useRef()

  const [pageLoading, setPageLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [optionList, setOptionList] = useState([{ label: "Delete", value: 1 }]);
  const [creatorOrderList, setCreatorOrderList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPostCount, setTotalPostCount] = useState(0);
  const [page, setPage] = useState(1);
  const [isVideoPlayed, setIsVideoPlayed] = useState(false);
  const [videoSpinnser, setVideoSpinner] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState("");
  const [isVideoMute, setisVideoMute] = useState(true);
  const APP_IMG_LINK = useSelector((state) => state?.appConfig?.virtualBaseUrl);
  const ownUserId = isAgency() ? selectedCreatorId : getCookie("uid");

  useEffect(() => {
    getShoutoutOrderList();
  }, []);

  const filterList = [
    {
      title: "NEWEST",
      tab: "newest",
      value: 0,
    },
    {
      title: "OLDEST",
      tab: "oldest",
      value: 1,
    }
  ]

  const getShoutoutOrderList = async (pageCount = 0, isAfterDelete = false) => {
    let APIPayload = {
      limit: 10,
      offset: pageCount * 10,
      userId: userIdState,
    };
    startLoader();
    try {
      const res = await getOrderInCreatorProfile(APIPayload);
      const orderList = res?.data?.data;
      if (isAfterDelete && res.status == 204) {
        setCreatorOrderList([]);
      } else {
        if (isAfterDelete) {
          setCreatorOrderList([...orderList]);
        } else {
          setCreatorOrderList([...creatorOrderList, ...orderList]);
        }
      }
      setTotalPostCount(orderList.length);
      setPage(pageCount);
      setIsLoading(false);
      stopLoader();
    } catch (e) {
      console.error("Error in getShoutoutOrderList", e);
      setIsLoading(false);
      stopLoader();
    }
  };

  const playVideo = (e, video) => {
    e.stopPropagation();
    mobileView
      ? open_drawer(
        "VDO_DRAWER",
        {
          vdoUrl: `${video?.orderUrl}`,
          creator: video.requestedBy,
        },
        "right"
      )
      : open_dialog("VDO_DRAWER", {
        vdoUrl: `${video?.orderUrl}`,
        creator: video.requestedBy,
        disableHeader: true
      });
    setIsVideoPlayed(false);
  };

  const handleImageClick = (e, order) => {
    e.stopPropagation();

    const orderCompletedAsset = [{
      id: 1,
      seqId: 1,
      mediaType: (order?.attribute?.[3]?.type === "VIDEO_UPLOAD" ? "VIDEO" : "IMAGE"),
      mediaThumbnailUrl: order?.orderThumbnailUrl,
      mediaUrl: order?.orderUrl?.includes("https://") ? order?.orderUrl : `${APP_IMG_LINK}/${order?.orderUrl}`,
    }]

    open_drawer("openMediaCarousel", {
      assets: orderCompletedAsset,
      selectedMediaIndex: 0,
      scrolledPositionRef: scrolledPositionRef,
      isLocked: false,
      isProfileShow: false,
      isThumbnailShow: false,
    }, "bottom")
  }

  const playVideoOnHover = (e, video) => {
    e.stopPropagation();
    setIsVideoPlayed(true);
    videoId !== video?._id && setisVideoMute(true);
    setVideoId(video?._id);
    setVideoUrl(`${video?.orderUrl}`);
  };

  const openFullscreen = (e) => {
    e.stopPropagation()
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

  const openVideo = (videoUrl) => {
    mobileView
      ? open_drawer(
        "VDO_DRAWER",
        { vdoUrl: `${APP_IMG_LINK}/${videoUrl}` },
        "right"
      )
      : open_dialog("VDO_DRAWER", { vdoUrl: `${APP_IMG_LINK}/${videoUrl}` });
  };

  const deleteChatDialog = (success, cancel, orderId) => {
    return {
      title: lang.deleteShoutout,
      subTitle: lang.deleteShoutoutMsg,
      button: [
        {
          class: "btn btn-default blueBgBtn",
          loader: true,
          text: lang.yes,
          onClick: () => {
            success(orderId);
          },
        },
        {
          class: "btn btn-default blueBgBtn",
          text: lang.no,
          onClick: () => {
            cancel();
          },
        },
      ],
    };
  };

  const handleShoutoutMag = (orderId) => {
    mobileView ?
      open_drawer("DELETE_CHAT", deleteChatDialog(deleteVirtualOrder, close_drawer, orderId), "bottom") :
      open_dialog("DELETE_CHAT", deleteChatDialog(deleteVirtualOrder, close_dialog, orderId));
  }

  const deleteVirtualOrder = async (orderId) => {
    startLoader();
    let payLoad = {
      orderId: orderId,
      userId: isAgency() ? selectedCreatorId : ""
    }
    try {
      const res = await deleteShoutout(payLoad);
      getShoutoutOrderList(0, true);
      stopLoader();
      mobileView ? close_drawer("DELETE_CHAT") : close_dialog("DELETE_CHAT");
    } catch (e) {
      stopLoader();
      mobileView ? close_drawer("DELETE_CHAT") : close_dialog("DELETE_CHAT");
      console.error("Error in deleteVirtualOrder", e);
    }
  }
  return (
    <Wrapper>
      <div
        className={`row mx-0 ${router.pathname == "/profile" ? "pl-3" : isMobile ? "pb-4" : ""}`}
      >
        <div className={`col-12 d-flex justify-content-end pt-0 pt-sm-3 pb-1 ${!mobileView && "padding_profile"}`}>
          <div>
            <FilterOption leftFilterShow={mobileView ? false : true} filterList={filterList} setSelectedValue={(value) => setSelectedSorting(value)} />
          </div>
        </div>
        {creatorOrderList.length > 0 ? (
          creatorOrderList.map((creatorOrder, index) => {
            return <>
              {!(creatorOrder?.orderUrl.startsWith("https")) ? <>
                <div
                  className={`callout-none ${mobileView ? "col-4 p-1" : router.asPath !== "/profile" ? "col-3 p-1" : "col-2 p-1"
                    } position-relative d-flex flex-column cursorPtr align-items-center justify-content-center`}
                  onClick={(e) => setIsVideoPlayed(false)}
                  style={{ height: mobileView ? "121px" : "291px" }}
                  onContextMenu={handleContextMenu}
                >
                  <FigureCloudinayImage
                    publicId={creatorOrder?.orderThumbnailUrl}
                    crop="thumb"
                    ratio={1}
                    style={{
                      objectFit: "cover",
                      width: "100%",
                      height: mobileView ? "112px" : "277px",
                      borderRadius: "8px",
                      filter: "brightness(0.8)",
                    }}
                    alt="video thumbnail"
                  />
                  <div className="position-absolute ml-2 cursorPtr mt-2 setTop" style={{ right: "13px", color: "#fff", top: "7px" }}>
                    {ownUserId == userIdState && <div onClick={(e) => e.stopPropagation()} className="ml-auto d-inline-flex align-items-center justify-content-center rounded-circle block_circle_ico cursorPtr">
                      <img src={GO_LIVE_SCREEN.deleteIco} width={12} onClick={() => { handleShoutoutMag(creatorOrder?._id) }} alt="delete icon" />
                    </div>}
                  </div>
                </div>
              </> :
                <div
                  className={`callout-none ${mobileView ? "col-4 p-1" : router.asPath !== "/profile" ? "col-3 p-1" : "col-2 p-1"
                    } position-relative d-flex flex-column cursorPtr align-items-center justify-content-center`}
                  onClick={(e) => setIsVideoPlayed(false)}
                  onContextMenu={handleContextMenu}
                  // Commented by Pranjal k on 14 Feb 2022,
                  // onMouseLeave={() => !mobileView && setIsVideoPlayed(false)}
                  // onMouseEnter={(e) => !mobileView && playVideoOnHover(e, creatorOrder)}
                  style={{ height: mobileView ? "121px" : "198px" }}
                >
                  {isVideoPlayed && (videoId == creatorOrder?._id) ? (
                    <>
                      {videoSpinnser && (
                        <div
                          className="position-absolute"
                          style={{
                            position: "fixed",
                            top: "50%",
                            left: "50%",
                            transform: "translateX(-50%) translateY(-50%)",
                          }}
                        >
                          <CustomDataLoader
                            type="ClipLoader"
                            loading={true}
                            size={20}
                          />
                        </div>
                      )}
                      <video
                        src={
                          videoUrl.includes("m3u8")
                            ? videoUrl.slice(0, -4) + "mp4"
                            : videoUrl
                        }
                        autoplay="autoplay"
                        muted={isVideoMute}
                        height={mobileView ? "112px" : "277px"}
                        width="100%"
                        id="myvideo"
                        style={{ background: "#000", borderRadius: "7px" }}
                        onEnded={() => {
                          setIsVideoPlayed(false);
                          setisVideoMute((prev) => !prev);
                        }}
                        controlsList="nodownload"
                        onLoadStart={() => setVideoSpinner(true)}
                        onLoadedData={() => setVideoSpinner(false)}
                      />
                      <div className="position-absolute ml-2 cursorPtr mt-2 setTop" style={{ right: "13px", color: "#fff", top: "7px" }}>
                        {ownUserId == userIdState && <div onClick={(e) => e.stopPropagation()} className="ml-auto d-inline-flex align-items-center justify-content-center rounded-circle block_circle_ico cursorPtr">
                          <img src={GO_LIVE_SCREEN.deleteIco} width={12} onClick={() => { handleShoutoutMag(creatorOrder?._id) }} alt="delete icon" />
                        </div>}


                      </div>
                      {router.pathname == "/profile" && <div className="optionsDiv" >
                        <div>
                          {/* <p className="mb-0">Jack</p>  */}
                          <p className="w-100  text-left mb-0 fntSz10" style={{ lineHeight: "1" }}>
                            {getDayDifference(creatorOrder?.createdTs) == 0
                              ? "today"
                              : `${getDayDifference(
                                creatorOrder?.createdTs
                              )} days ago`}
                          </p>
                        </div>
                        {/* <div  onClick={(e)=>e.stopPropagation()}>
                    <MenuModelShoutout items={optionList} deleteShoutoutOrder={()=>handleShoutoutMag(creatorOrder?._id)} />
                  </div> */}
                      </div>}
                    </>
                  ) : (
                    <>
                      <FigureCloudinayImage
                        publicId={creatorOrder?.orderThumbnailUrl}
                        crop="thumb"
                        ratio={1}
                        style={{
                          objectFit: "cover",
                          width: "100%",
                          height: "100%",
                          borderRadius: "8px",
                          filter: "brightness(0.8)",
                        }}
                        onClick={(e) => authenticate(router.asPath).then(() => handleImageClick(e, creatorOrder))}
                        alt="video thumbnail"
                      />
                      <div
                        className="videoPlayBtn"
                      >
                        <Icon
                          icon={`${config.videoPlay_icon}#videoPlayIcon`}
                          width={55}
                          height={55}
                          alt="moreOption"
                          onClick={(e) => authenticate(router.asPath).then(() => handleImageClick(e, creatorOrder))}
                        />
                      </div>


                      <div className="position-absolute ml-2 cursorPtr mt-2 setTop" style={{ right: "13px", color: "#fff", top: "7px" }}>
                        {/* share Shoutout */}
                        {/* <div  onClick={(e)=>e.stopPropagation()} className="cursorPtr d-inline-flex align-items-center justify-content-center rounded-circle block_circle_ico">
                  <img src={GO_LIVE_SCREEN.shareIco} width={19} /> 
                  </div> */}

                        {ownUserId == userIdState && <div onClick={(e) => e.stopPropagation()} className="ml-auto d-inline-flex align-items-center justify-content-center rounded-circle block_circle_ico cursorPtr">
                          <img src={GO_LIVE_SCREEN.deleteIco} width={12} onClick={() => { handleShoutoutMag(creatorOrder?._id) }} alt="delete icon" />
                        </div>}


                      </div>


                      {router.pathname == "/profile" && <div className="optionsDiv" >
                        <div>
                          {/* <p className="mb-0 text-black">Jack</p>  */}
                          <p className="w-100  text-left mb-0 fntSz10" style={{ lineHeight: "1" }}>
                            {getDayDifference(creatorOrder?.createdTs) == 0
                              ? "today"
                              : `${getDayDifference(
                                creatorOrder?.createdTs
                              )} days ago`}
                          </p>
                        </div>
                        {/* <div  onClick={(e)=>e.stopPropagation()}>
                    <MenuModelShoutout items={optionList} deleteShoutoutOrder={()=>handleShoutoutMag(creatorOrder?._id)} />
                  </div>  */}
                      </div>
                      }
                    </>
                  )}

                </div>
              }
            </>
          }
          )
        ) : (
          <div className="w-100 text-center py-5 mt-5">
            <Icon
              icon={`${config.NO_SHOUTOUT_PLACEHOLDER}#noShoutoutPlaceHolder`}
              color={theme.text}
              width={140}
              height={80}
              alt="No shoutouts to display"
              class="m-0"
              viewBox="0 0 72.515 66.858"
            />
            <h5 className="mt-4">{lang.noShoutoutYet}</h5>
          </div>
        )}
      </div>
      <div>
        {creatorOrderList && creatorOrderList.length ? (
          <PaginationIndicator
            elementRef={props?.homePageref}
            totalData={creatorOrderList}
            id={mobileView && "profile_page_cont"}
            totalCount={creatorOrderList.length || 500}
            pageEventHandler={() => {
              if (!isLoading && creatorOrderList.length !== totalPostCount) {
                getShoutoutOrderList(page + 1);
              }
            }}
          />
        ) : (
          ""
        )}
      </div>
      <style jsx>{`
        .videoPlayBtn {
          position: absolute;
          padding: 12px;
          border-radius: 31px;
          cursor: pointer;
        }

        .moreOptionIcon {
          position: absolute;
          padding: 4px;
          border-radius: 31px;
          bottom: ${mobileView ? "50px" : "47px"};
          right: ${mobileView ? "5px" : "-1px"};
          cursor: pointer;
        }
        .optionsDiv{
          position: absolute;
          bottom: 7px;
          right: 12px;
          cursor: pointer;
          width: 89%;
          display: flex;
          justify-content: space-between;
          color:white;
          align-items: center;
          padding-left: 7px;
          padding-bottom: 7px;
        }
        .shoutout_margin{
          margin:${mobileView ? (`${!props.isSticky ? "0px 0px 0px 0px !important" : ""}`) : "10px 0px 0px 0px !important"};
        }
        .block_circle_ico {
          width: 35px;
          height: 35px;
          background-color: #5d5c5ca1;
        }
        .setTop{
          height: 100px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
      `}</style>
    </Wrapper>
  );
};

export default ShoutoutPosts;
