import React, { useState, useEffect } from "react";
import { close_drawer, open_dialog,open_drawer, startLoader, stopLoader } from "../../lib/global";
import { getAllStories, getFeaturedStoryDetailsApi } from "../../services/assets";
import isMobile from "../../hooks/isMobile";
import { useSwipeable } from 'react-swipeable';
import dynamic from "next/dynamic";
import Wrapper from "../../hoc/Wrapper"
const Skeleton = dynamic(() => import("@material-ui/lab/Skeleton"), { ssr: false });
const StoryModule = dynamic(() => import("./OtherUsersStories"), { ssr: false });
import { useSelector } from "react-redux";
import { isAgency } from "../../lib/config/creds";
import { useRouter } from 'next/router';

/**
 * @description This is the Story Dialog which is opened for Other User Stories. Here, the shimmer is also included
 * @author Paritosh
 * @date 07/04/2021
 * @param {*} props
 * @return {*}
 */
const StoryDialog = (props) => {
  const {
    back,
    drawerData,
    setActiveState,
    ownStory,
    creator,
    isLast,
    prevSlide = () => { },
    nextSlide = () => { },
    isFirst = false,
    isPlayedFirst = true,
    slideNum = 0,
    navigateSlide = () => { },
    activeSlideNum = 0,
    fromHighlightStories,
    ...others
  } = props;
  const [mobileView] = isMobile();
  const [stories, setStories] = useState([]);
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
  const profile = useSelector((state) => state.profileData);
  const [pause, setPause] = useState(null);
  const router = useRouter();
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

  const swipeHandler = useSwipeable({ // To manage the swipe events in Mobile Device only
    onSwipedLeft: nextSlide,
    onSwipedRight: prevSlide,
    trackMouse: false,
    trackTouch: true,
    preventDefaultTouchmoveEvent: true,
  })

  useEffect(() => {
    fromHighlightStories ? getFeaturedStories() : getUserStories(drawerData.userId);
    return () => {
      setStories([]);
    };
  }, []);

  // This function returns the User Stories
  const getUserStories = (userId) => {
    startLoader();
    getAllStories(userId, isAgency() ? selectedCreatorId : "")
      .then((res) => {
        if (res && res.data) {
          setStories(res.data.data);
        }
        stopLoader();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const getFeaturedStories = (pageCount = 0) => {
    const list = {
      limit: 10,
      offset: pageCount * 10,
      id: drawerData?.featCollectionId,
      userId: creator.userId,
    };
    if (isAgency()) {
      list["creatorId"] = selectedCreatorId;
    }
    getFeaturedStoryDetailsApi(list)
      .then((res) => {
        if (res && res.data && res.data.data) {
          setStories(res.data.data);
        }
        stopLoader();
      })
      .catch((err) => {
        stopLoader();
        console.error("getFeaturedStoryDetailsApi -> error -> ", err);
      });
  };

  const moreClickHandler = (activeStory) => {
    mobileView
      ? open_drawer(
        "HIGHLIGHT_STORY_OPTIONS",
        {
          featCollectionId: drawerData?.featCollectionId,
          activeStoryId: activeStory?.storyId,
          data: stories,
          coverImage: drawerData?.coverImage,
          title: drawerData?.title,
          handleClose: () => {
            setPause(false);
          },
          back: () => {
            back && back();
          },
        },
        "bottom"
      )
      : open_dialog("HIGHLIGHT_STORY_OPTIONS", {
        featCollectionId: drawerData?.featCollectionId,
        activeStoryId: activeStory?.storyId,
        data: stories,
        coverImage: drawerData?.coverImage,
        title: drawerData?.title,
        handleClose: () => {
          setPause(false);
        },
        back: () => {
          back && back();
        },
        closeAll: true,
      });
  };

  const customDesktopStyle = () => {
    if (mobileView) return;
    let slide_Difference = activeSlideNum - slideNum;
    if (slide_Difference === 2) {
      return 'flex-end'
    }
    else if (slide_Difference === -2) {
      return 'flex-start'
    }
    return 'center'
  }

  // This is the shimmer based on Mobile and Desktop View
  const skeleton_shimmer = mobileView ? (
    <div
      style={{
        position: "absolute",
        width: "100%",
        bottom: "15px",
        right: 0,
        left: 0,
      }}
    >
      <Skeleton
        className=""
        style={{
          width: "96%",
          height: "70vh",
          backgroundColor: props.theme.palette.l_shimmer_bgColor,
          margin: "auto",
          borderRadius: "8px",
        }}
        variant="rect"
      />
      <div className="mt-3" style={{ width: "100%" }}>
        <Skeleton
          className="ml-3"
          style={{
            backgroundColor: props.theme.palette.l_shimmer_bgColor,
            borderRadius: "8px",
          }}
          width={100}
          height={50}
          variant="rect"
        />
        <Skeleton
          className="my-3"
          style={{
            backgroundColor: props.theme.palette.l_shimmer_bgColor,
            width: "96%",
            margin: "auto",
            borderRadius: "8px",
          }}
          height={40}
          variant="rect"
        />
        <Skeleton
          style={{
            backgroundColor: props.theme.palette.l_shimmer_bgColor,
            width: "96%",
            margin: "auto",
            borderRadius: "8px",
          }}
          height={10}
          variant="rect"
        />
      </div>
    </div>
  ) : (
    <div
      style={{
        backgroundColor:"var(--l_stories_background)",
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: `${customDesktopStyle()}`,
      }}
    >
      {isPlayedFirst ? (
        <div
          className="position-relative"
          style={{
            width: "388px",
            height: "95vh",
          }}
        >
          <Skeleton
            className="w-100 h-100"
            style={{
              backgroundColor: props.theme.palette.l_shimmer_bgColor,
              margin: "auto",
              borderRadius: "8px",
            }}
            variant="rect"
          />
          <Skeleton
            className="position-absolute"
            style={{
              backgroundColor: props.theme.palette.l_shimmer_bgColor,
              top: "100px",
              left: "8px",
              width: "95%",
              height: "70%",
              margin: "auto",
              borderRadius: "8px",
            }}
            variant="rect"
          />
          <Skeleton
            className="position-absolute"
            style={{
              backgroundColor: props.theme.palette.l_shimmer_bgColor,
              top: "23px",
              left: "65px",
              width: "75px",
            }}
            variant="text"
          />
          <Skeleton
            className="position-absolute"
            style={{
              backgroundColor: props.theme.palette.l_shimmer_bgColor,
              top: "50px",
              left: "65px",
              width: "75px",
              height: "15px",
            }}
            variant="text"
          />
          <Skeleton
            className="position-absolute"
            style={{
              backgroundColor: props.theme.palette.l_shimmer_bgColor,
              borderRadius: "8px",
              bottom: "50px",
              left: "8px",
            }}
            width={100}
            height={50}
            variant="rect"
          />
          <Skeleton
            className="position-absolute"
            style={{
              backgroundColor: props.theme.palette.l_shimmer_bgColor,
              top: "20px",
              left: "10px",
            }}
            variant="circle"
            width={50}
            height={50}
          />
          <Skeleton
            className="position-absolute"
            style={{
              backgroundColor: props.theme.palette.l_shimmer_bgColor,
              width: "96%",
              borderRadius: "8px",
              bottom: "10px",
              left: "6px",
            }}
            height={10}
            variant="rect"
          />
        </div>
      ) : (
        <div
          className="position-relative d-flex justify-content-center align-items-center"
          style={{ width: "10.18vw", height: "229px" }}
        >
          <Skeleton
            className="w-100 h-100 position-absolute"
            style={{
              backgroundColor: props.theme.palette.l_shimmer_bgColor,
              margin: "auto",
              borderRadius: "20px",
            }}
            variant="rect"
          />
          <div className="text-center position-relative">
            <Skeleton
              style={{
                backgroundColor: props.theme.palette.l_shimmer_bgColor,
                margin: "auto",
                display: "block",
              }}
              variant="circle"
              width={44}
              height={44}
            />
            <Skeleton
              className="mt-2"
              style={{
                backgroundColor: props.theme.palette.l_shimmer_bgColor,
                width: "100%",
                borderRadius: "8px",
              }}
              height={10}
              variant="rect"
            />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Wrapper>
      <div id="chat_cont" className={`bg-dark-custom`} {...swipeHandler}>
        <Wrapper>
          <div className="stories_cont">
            <div
              className="stories_dialog"
              style={{ height: "100%", position: "relative" }}
            >
              {stories && stories.length ? (
                <StoryModule
                  prevSlide={prevSlide}
                  routerPass={router}
                  nextSlide={nextSlide}
                  propref={props.parentRef}
                  isPlayedFirst={isPlayedFirst}
                  ownStory={ownStory}
                  isFirst={isFirst}
                  isLast={isLast}
                  back={() => back()}
                  creator={fromHighlightStories ? creator : drawerData}
                  setActiveState={setActiveState}
                  stories={stories}
                  mobileView={mobileView}
                  slideNum={slideNum}
                  navigateSlide={navigateSlide}
                  activeSlideNum={activeSlideNum}
                  S3_IMG_LINK={S3_IMG_LINK}
                  pause={pause}
                  highlightMoreClickHandler={moreClickHandler}
                  isHightlight={fromHighlightStories}
                  {...others}
                />
              ) : (
                skeleton_shimmer
              )}
            </div>
          </div>
        </Wrapper>
      </div>
      <style >
        {`
          :global(.MuiDrawer-paper) {
            width: 100% !important;
            max-width: 100% !important;
            color: inherit;
          }
          :global(.MuiDrawer-paper > div) {
            width: 100% !important;
            max-width: 100% !important;
          }
        `}
      </style>
    </Wrapper>
  );
};
export default StoryDialog;
