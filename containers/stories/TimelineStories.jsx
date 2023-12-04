import { Skeleton } from "@material-ui/lab";
import dynamic from "next/dynamic";
import Route from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import isMobile from "../../hooks/isMobile";
import useLang from "../../hooks/language";
import { EMPTY_PROFILE } from "../../lib/config/placeholder";
import { skalatonDark } from "../../lib/color";

import {
  close_drawer,
  drawerToast,
  open_dialog,
  open_drawer,
} from "../../lib/global/loader";
import { getCookie } from "../../lib/session";
import { getStories } from "../../services/assets";
const FigureCloudinayImage = dynamic(
  () => import("../../components/cloudinayImage/cloudinaryImage"),
  { ssr: false }
);
const CustomDataLoader = dynamic(
  () => import("../../components/loader/custom-data-loading"),
  { ssr: false }
);
const HorizonatalPagination = dynamic(
  () => import("../../components/pagination/horizonatalPagination"),
  { ssr: false }
);
const OwnStoryPage = dynamic(() => import("../../components/story/OwnStoryPage"), { ssr: false });
import { useTheme } from "react-jss";
import { sendMail } from "../../lib/global/routeAuth";
import { isAgency } from "../../lib/config/creds";
import { handleContextMenu } from "../../lib/helper";

/**
 * @description This is to show the Story Tiles on Timeline
 * @author Jagannath
 * @date 07/04/2021
 * @param {*} props
 * @return {*}
 */
const TimelineStories = (props) => {
  const theme = useTheme();
  const [lang] = useLang();
  const limit = 7;
  const userType = getCookie("userType");
  const profile = useSelector((state) => state.profileData);
  const [page, setPage] = useState(0);
  const { handleRefresh, setActiveState } = props;
  const [stories, setStories] = useState([]);
  const [skeleton, setSkeleton] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileView] = isMobile();
  const [materialUI, setPageCheck] = useState(false);
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

  useEffect(() => {
    getAllStories();
    setPageCheck(true);
  }, []);

  const getAllStories = (skip = 0) => {
    let payload = {
      skip: skip * limit
    }
    if (isAgency()) {
      payload["userId"] = selectedCreatorId;
    }
    getStories(payload)
      .then((res) => {
        if (res && res.data) {
          if (skip) {
            setStories([...stories, ...res.data.data]);
          } else {
            setStories(res.data.data);
          }
          setPage(skip);
        }
        setSkeleton(false);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setSkeleton(false);
        setIsLoading(false);
      });
  };

  const storyClickHandler = (list, index) => {
    if (mobileView) {
      open_drawer("STORY_CAROUSEL_MOB", {
        drawerData: list,
        activeStory: index,
        theme: theme,
        setActiveState: setActiveState,
        back: () => back(),
      }, "right"
      );
    } else {
      open_drawer("STORY_CAROUSEL_DESKTOP", {
        drawerData: list,
        activeStory: index,
        setActiveState: setActiveState,
        theme: theme,
        back: () => back(),
      }, "right"
      );
    }
  };

  const back = () => {
    getAllStories();
    close_drawer();
  };

  const addStoryClickHandler = () => {
    if (profile && profile.statusCode == 5) {
      return drawerToast({
        closing_time: 10000,
        title: lang.submitted,
        desc: lang.unverifiedProfile,
        closeIconVisible: true,
        button: {
          text: lang.contactUs,
          onClick: () => {
            sendMail();
          },
        },
        titleClass: "max-full",
        autoClose: true,
        isMobile: mobileView,
      });
    } else if (!mobileView) {
      open_dialog("POST_DIALOG", {
        story: true
      });
    }
    else {
      open_drawer('CREATE_POST', {
        story: true,
    }, "bottom")
    }
  };

  const pageEventHandler = (e) => {
    setIsLoading(true);
    getAllStories(page + 1);
  };

  return (
    <div className={mobileView ? "col-12 specific_section_bg" : "col-12 px-1 pt-3 pb-2 card_bg"}>
      {stories.length || userType != 1 
        ? materialUI
          ? <div
            className={`form-row ${mobileView ? "align-items-baseline" : ` pt-1 pb-1 pl-2 story_profiles align-items-baseline ${theme?.type === "light" && "borderStroke"}`}`}
            id="story_list"
            style={{
              flexWrap: "nowrap",
              overflowX: "auto",
              overflowY: "hidden",
            }}
          >
            {skeleton &&
              [1, 2, 3, 4, 5, 6].map((item, i) => {
                return (
                  <div key={i} className="col-auto">
                    <div className="position-relative mb-2 w-100 h-100 justify-content-between d-flex">
                      <Skeleton
                        className={`${theme.type == "light" ? "bg-white" : skalatonDark} story_profiles ${theme?.type === "light" && "borderStroke"}`}
                        variant="circle"
                        width={70}
                        height={70}
                      />
                    </div>
                    <Skeleton
                      className={`${theme.type == "light" ? "bg-white" : skalatonDark} story_profiles ${theme?.type === "light" && "borderStroke"}`}
                      variant="rect"
                      width={76}
                      height={12}
                      marginTop={40}
                    />
                  </div>
                );
              })}
            {!skeleton && userType != 1 && (
              <OwnStoryPage
                handleClick={addStoryClickHandler}
                handleRefresh={handleRefresh}
                setActiveState={setActiveState}
                profilePic={profile.profilePic}
              />
            )}
            {stories.map((user, i) => {
              return (
                <div
                  key={i}
                  onClick={() => {
                    storyClickHandler(stories, i);
                  }}
                  className="col-auto cursorPtr mx-2"
                >
                  <div className={`position-relative d-flex justify-content-around rounded-pill callout-none ${!user.isViewed ? "gradient_bg" : "story_viewedBg"}`} style={{ padding: "2px" }} onContextMenu={handleContextMenu} >
                    <FigureCloudinayImage
                      publicId={user.profilePic}
                      errorImage={EMPTY_PROFILE}
                      transformWidth={mobileView ? 80 : "7.685vw"}
                      transformHeight={mobileView ? 80 : "7.685vw"}
                      // width={50}
                      ratio={1}
                      style={
                        mobileView
                          ? { height: "80px", width: "80px" }
                          : {
                            height: "4.685vw",
                            width: "4.685vw",
                            border: "3px solid var(--l_profileCard_bgColor)"
                          }
                      }
                      className={`rounded-pill`}
                    />
                  </div>
                  <p className={mobileView ? "text-truncate text-center" : "dv__usernameStory"}
                    style={mobileView ? { maxWidth: "80px" } : {}}>
                    @{user.username}
                  </p>
                </div>
              );
            })}
            <HorizonatalPagination
              pageEventHandler={pageEventHandler}
              id="story_list"
            />
            <span className="story_loader">
              {isLoading && (
                <CustomDataLoader
                  loading={true}
                  type="PulseLoader"
                />
              )}
            </span>
          </div>
          : ""
        : <></>
      }
      <style>{`
        .story_loader{
            position: absolute;
            right: 5px;
            height: 80px;
              text-align: center;
            display: flex;
            justify-content: center;
            transform: rotate(90deg);
        }
      `}</style>
    </div>
  );
};

export default TimelineStories;
