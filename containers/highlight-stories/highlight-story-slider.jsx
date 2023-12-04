import React, { useEffect, useState } from "react";
import Carousel from "react-elastic-carousel";
import {
  BANNER_PLACEHOLDER_IMAGE,
  TIP_ICON_WHITE,
} from "../../lib/config";
import { LinearProgress } from "@material-ui/core";
// import { submitViewStory } from "../../services/assets";
import {
  authenticate,
  authenticateUserForPayment,
  open_dialog,
  open_drawer,
  sleep,
} from "../../lib/global";
import isMobile from "../../hooks/isMobile";
import dynamic from "next/dynamic";
import useLang from "../../hooks/isMobile";
const FigureCloudinayImage = dynamic(
  () => import("../../components/cloudinayImage/cloudinaryImage"),
  { ssr: false }
);
const Img = dynamic(() => import("../../components/ui/Img/Img"), {
  ssr: false,
});
import { commentParser } from "../../lib/helper/userRedirection";
import { useRouter } from 'next/router';


const HighlightStorySlider = (props) => {
  const { data, uid, pause, creator, back, setActiveState, ...others } = props;
  const [carousel, setCarousel] = useState();
  const [progressValue, setProgressValue] = useState(10);
  const [autoNext, setAutoNext] = useState(0);
  const [activeItem, setActiveItem] = useState(0);
  const [playerVideo, setPlayerVideo] = useState(null);
  const [videoInt, setVideoInt] = useState();
  const [imageInt, setImageInt] = useState();
  const [videoTimeout, setVideoTimeout] = useState();
  const [imageTimeout, setImageTimeout] = useState();
  const [clickEvent, setClickEvent] = React.useState(1);
  const [leftRight, setLeftRight] = React.useState();
  const [exit, setExit] = React.useState(false);
  const [mobileView] = isMobile();
  const [lang] = useLang();
  const router = useRouter();

  // const VIDEO_LINK = useSelector((state) => state.cloudinaryCreds.VIDEO_LINK)


  const leftRightClickHandler = (e) => {
    const clientWidth = window.innerWidth / 2;
    const lr = e.clientX > clientWidth ? "right" : "left";
    setAutoNext(null);
    setClickEvent((prev) => prev + 1);
    setLeftRight(lr);
  };

  useEffect(() => {
    if (autoNext >= 1) {
      clearPlayerVideo();
      carousel && carousel.slideNext();
    }
  }, [autoNext]);

  useEffect(() => {
    if (leftRight == "left") {
      clearPlayerVideo();
      carousel && carousel.slidePrev();
    }

    if (leftRight == "right") {
      clearPlayerVideo();
      if (activeItem == data.length - 1) {
        return back();
      }
      carousel && carousel.slideNext();
    }
  }, [leftRight, clickEvent]);

  useEffect(() => {
    pauseHandler(pause);
  }, [pause]);

  const pauseHandler = (pause) => {
    if (pause) {
      clearTimeout(videoInt);
      clearTimeout(imageInt);
      clearInterval(videoTimeout);
      clearInterval(imageTimeout);
      props.setActiveStory && props.setActiveStory(data[activeItem]);
    }
    if (pause == false) {
      setProgressValue(100);
      clearPlayerVideo();
      carousel && carousel.slideNext();
      // setTimeout(() => {
      //     carousel && carousel.slideNext();
      //     setProgressValue(100);
      //     clearPlayerVideo();
      // }, 10);
    }
  };

  const onNextStartHandler = (currentItem, nextItem) => {
    setProgressValue(10);
    clearPlayerVideo();
    clearTimeout(videoInt);
    clearTimeout(imageInt);
    clearInterval(videoTimeout);
    clearInterval(imageTimeout);
    if (
      currentItem &&
      currentItem.item &&
      currentItem.item.data &&
      (currentItem.item.data.isVisible == 1 ||
        currentItem.item.data.storyType == 3) &&
      currentItem.item.data.storyData.type == 2
    ) {
      const video = document.getElementById(currentItem.item.id);
      const duration = video && parseInt(video.duration) * 1000;
      video.play();
      setPlayerVideo({ id: currentItem.item.id, duration: duration });
      let vidTimeOut = setInterval(() => {
        setProgressValue((prev) => prev + 10);
      }, parseInt(duration / 10));
      setVideoTimeout(vidTimeOut);
      let videoInterval = setTimeout(() => {
        clearPlayerVideo();
        if (activeItem == data.length - 1) {
          return back();
        }
        carousel.slideNext();
      }, duration);
      setVideoInt(videoInterval);
    } else {
      let imgTimeOut = setInterval(() => {
        setProgressValue((prev) => prev + 10);
      }, parseInt(400));
      setVideoTimeout(imgTimeOut);
      let imageInterval = setTimeout(() => {
        clearPlayerVideo();
        if (activeItem == data.length - 1) {
          return back();
        }
        carousel.slideNext();
      }, 4000);
      setImageInt(imageInterval);
    }

    // if (
    //   currentItem &&
    //   currentItem.item &&
    //   currentItem.item.data &&
    //   currentItem.item.data.userId != uid &&
    //   !currentItem.item.data.isViewed
    // ) {
    //   console.log('currentItem.item',currentItem.item)
    //   submitViewStory(currentItem.item.data._id)
    //     .then((res) => {
    //       console.log(res);
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // }
  };

  const handleFirstItem = async (item) => {
    if (
      item &&
      item.storyData.type == 2 &&
      (item.isVisible == 1 || item.storyType == 3)
    ) {
      var video = document.getElementById(item._id);
      await sleep(1000);
      if (video) {
        const duration = parseInt(video.duration) * 1000 || 10000;
        video.play();
        setPlayerVideo({ id: item._id, duration: duration });
        let vidTimeOut = setInterval(() => {
          setProgressValue((prev) => prev + 10);
        }, parseInt(duration / 10));
        setVideoTimeout(vidTimeOut);
        let videoInterval = setTimeout(() => {
          clearPlayerVideo();
          setAutoNext(1);
        }, duration);

        setVideoInt(videoInterval);
      }
    } else {
      let imgTimeOut = setInterval(() => {
        setProgressValue((prev) => (prev >= 100 ? 100 : prev + 10));
      }, parseInt(400));
      setVideoTimeout(imgTimeOut);
      let imageInterval = setTimeout(() => {
        clearPlayerVideo();
        setAutoNext(1);
      }, 4000);
      setImageInt(imageInterval);
    }

    // if (item && !item.isViewed && item.userId != uid) {
    //   submitViewStory(item._id)
    //     .then((res) => {
    //       console.log(res);
    //     })

    //     .catch((err) => {
    //       console.log(err);
    //     });
    // }
  };

  useEffect(() => {
    handleFirstItem(data[getItemIndex(data)]);
  }, []);

  useEffect(() => {
    if (activeItem == data.length - 1 && progressValue >= 100) {
      setTimeout(() => {
        setExit(true);
      }, 500);
    }

    if (activeItem == data.length - 1 && progressValue >= 100 && exit) {
      return back();
    }
  }, [activeItem, progressValue, exit]);

  const clearPlayerVideo = () => {
    if (playerVideo && playerVideo.id) {
      const video = document.getElementById(playerVideo.id);
      video.pause();
      video.currentTime = 1;
      setPlayerVideo(null);
    } else {
      return;
    }
  };

  useEffect(() => {
    return () => {
      clearTimeout(videoInt);
      clearTimeout(imageInt);
      clearInterval(imageTimeout);
      clearInterval(videoTimeout);
    };
  }, []);

  const handleStoryViewClick = (data) => {
    if (!data.views) return;
    pauseHandler(true);
    open_drawer(
      "STORY_VIEWS",
      {
        data: data,
        back: (e) => {
          e == "deleted" && back();
        },
        handleClose: () => pauseHandler(false),
      },
      "right"
    );
  };

  const sendTipHandler = (story) => {
    // console.log('data', story)
    clearTimeout(videoInt);
    clearTimeout(imageInt);
    clearInterval(videoTimeout);
    clearInterval(imageTimeout);
    authenticate().then(() => {
      mobileView
        ? open_drawer(
          "SentTip",
          {
            creatorId: creator.userId,
            creatorName: creator.username,
            postId: story.storyId,
            trigger: 2,
            onCloseDrawer: () => {
              carousel && carousel.slidePrev();
              setTimeout(() => {
                carousel && carousel.slideNext();
                setProgressValue(100);
                clearPlayerVideo();
              }, 100);
            },
            updateTip: (tipCount) => {
              // console.log("\n\n\n\n\n......top sent.....\n\n\n\n\n", tipCount);
            },
          },
          "right"
        )
        : open_dialog("sendTip", {
          creatorId: creator.userId,
          creatorName: creator.username,
          postId: story._id,
          trigger: 2,
          updateTip: (tipCount) => { },
        });
    });
  };

  const renderPaginationHandler = ({ pages, activePage, onClick }) => {
    setActiveItem(activePage);
    return (
      <div
        className="d-flex"
        style={{ width: "90%", position: "fixed", bottom: "10px" }}
      >
        <div
          className="col-12 p-0"
          style={{ position: "fixed", bottom: "30px" }}
        >
          <div className="col-12 row">
            {creator.userId != uid ? (
              <button
                onClick={() => {
                  authenticate(router?.asPath).then(() => {
                    authenticateUserForPayment(mobileView, lang.paymentDisabledForCreatorText).then(() => {
                      sendTipHandler(data[activePage]);
                    })
                  })
                }}
                className="btn btn-default d-flex align-items-center dv__sendTip"
              // className="btn btn-primary btn_send_tip_tag py-1 mb-2"
              >
                <Img className="mr-1" src={TIP_ICON_WHITE} width={18} />
                <span style={mobileView ? { fontSize: "15px" } : {}}>{lang.sendTip}</span>
              </button>
            ) : (
              <p className="py-1 mb-2 d-flex">
                <Img className="mr-1" src={TIP_ICON_WHITE} width={18} />
                {/* {(data[activePage].currency &&
                  data[activePage].currency.symbol) ||
                  "$ "} */}
                {data[activePage].totalTipReceived || 0} Tips
              </p>
            )}
            {/* <button type="button" className="btn btn-outline-light highlight_btn ml-auto px-2">
                        <Img className="mr-1" src={TIP_ICON_WHITE} width={18} />
                        Send tip
                    </button> */}
            {/* <button 
                        type="button" 
                        onClick={()=>handleStoryViewClick(data[activePage])}
                        className="btn btn-outline-light highlight_btn ml-auto px-2">
                        <Img className="mr-1" src={circled_eye} width={18} />
                        {data[activePage].views || 0}
                    </button> */}
          </div>
          <br />
          {commentParser(
            data[activePage].description,
            data[activePage].taggedUsers
          )}
        </div>

        {pages.map((page) => {
          const isActivePage = activePage === page;
          const viewdItems = page <= activePage;
          return (
            <LinearProgress
              key={page}
              style={{
                background: "#d3d3d35e !important",
                marginLeft: "2px",
                marginRight: "2px",
                color: "red !important",
              }}
              variant="determinate"
              color={"primary"}
              className={`w-100 dv_appTxtClr ${(isActivePage || viewdItems) && "active"
                }`}
              value={
                page < activePage ? 100 : page == activePage ? progressValue : 0
              }
            />
          );
        })}
      </div>
    );
  };

  const getItemIndex = (data) => {
    const itemIndex = data.findIndex((item) => !item.isViewed);
    props.setActiveStory &&
      props.setActiveStory(data[itemIndex == -1 ? 0 : itemIndex]);
    return itemIndex == -1 ? 0 : itemIndex;
  };

  return (
    <React.Fragment>
      <Carousel
        onChange={onNextStartHandler}
        enableSwipe={false}
        enableMouseSwipe={false}
        ref={(ref) => setCarousel(ref)}
        showArrows={false}
        transitionMs={400}
        itemsToScroll={1}
        autoTabIndexVisibleItems={true}
        itemsToShow={1}
        pagination={true}
        initialActiveIndex={getItemIndex(data)}
        renderPagination={renderPaginationHandler}
      >
        {data.map((item, i) => {
          if (
            item.isVisible == 0 &&
            item.storyType != 3 &&
            item.storyData &&
            item.storyData.type == 2
          ) {
            return (
              <FigureCloudinayImage
                key={i}
                publicId={
                  item.storyData && item.storyData.thumbnail
                    ? item.storyData.thumbnail
                    : BANNER_PLACEHOLDER_IMAGE
                }
                data={item}
                className={""}
                onClick={leftRightClickHandler}
                isVisible={item.isVisible}
                postType={item.storyType}
                width={window.innerWidth}
                videoIcon={true}
                style={{
                  objectFit: "contain",
                  maxHeight: "100vh",
                  width: "100%",
                  height: "100%",
                }}
                {...others}
              />
            );
          } else if (item.storyData && item.storyData.type == 2) {
            const videoUrl = item.storyData.url;
            return (
              <video
                id={item._id}
                className="first_item"
                data={item}
                onClick={leftRightClickHandler}
                style={{
                  objectFit: "contain",
                  maxHeight: "100vh",
                  width: "100%",
                  height: "100%",
                }}
                controlsList="nodownload"
              >
                <source src={videoUrl} type="video/webm" />
                <source src={videoUrl} type="video/mp4" />
                <source src={videoUrl} type="video/ogg" />
              </video>
            );
          } else {
            return (
              <FigureCloudinayImage
                publicId={
                  item.storyData && item.storyData.url
                    ? item.storyData.url
                    : BANNER_PLACEHOLDER_IMAGE
                }
                data={item}
                className={""}
                onClick={leftRightClickHandler}
                isVisible={item.isVisible}
                postType={item.storyType}
                width={window.innerWidth}
                style={
                  mobileView
                    ? {
                      objectFit: "contain",
                      maxHeight: "100vh",
                      width: "100%",
                      height: "100%",
                    }
                    : {
                      objectFit: "contain",
                      maxHeight: "80vh",
                      width: "100%",
                      height: "100%",
                    }
                }
                {...others}
              />
            );
          }
        })}
      </Carousel>
    </React.Fragment>
  );
};

export default HighlightStorySlider;
