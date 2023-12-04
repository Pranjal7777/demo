import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { EMPTY_PROFILE, PLUS_ICONS } from "../../lib/config";
import {
  close_drawer,
  open_drawer,
} from "../../lib/global";
import { SET_OWN_STORIES } from "../../redux/actions/actionTypes";
import { getOwnStories } from "../../services/assets";
import FigureCloudinayImage from "../cloudinayImage/cloudinaryImage";
import { useDispatch, useSelector } from "react-redux";
import isMobile from "../../hooks/isMobile";
import { refreshStoryApi } from "../../lib/rxSubject";
import { useTheme } from "react-jss";
const Avatar = dynamic(() => import("@material-ui/core/Avatar"), { ssr: false });
import Router from "next/router";
import useLang from "../../hooks/language";
import Image from "../image/image";
import Icon from "../image/icon";
import { isAgency } from "../../lib/config/creds";
import { handleContextMenu } from "../../lib/helper";

/**
 * @description this component is to show story profile of logged in creator 
 * @author Paritosh
 * @date 07/04/2021
 * @param {*} props
 * @return {*} 
 */
const OwnStoryPage = (props) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { handleRefresh, handleClick } = props;
  const [story, setStory] = useState(null);
  const profile = useSelector((state) => state.profileData);
  // const CLOUD_NAME = useSelector((state) => state?.cloudinaryCreds?.cloudName);
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

  const [mobileView] = isMobile();
  const [lang] = useLang();

  const userData = {
    userId: profile._id,
    profilePic: profile.profilePic,
    username: profile.username,
    firstName: profile.firstName,
    lastName: profile.lastName,
  };

  useEffect(() => {
    getActiveStories();
  }, [handleRefresh]);

  useEffect(() => {
    const refresh = refreshStoryApi.subscribe((params) => {
      if (params.isUploading) {
        getActiveStories()
      }
  });
    return () => refresh.unsubscribe()
  }, [])

  const getActiveStories = () => {
    let payload = {
    }
    if (isAgency()) {
      payload["userId"] = selectedCreatorId;
    }
    getOwnStories(payload)
      .then((res) => {
        if (res && res.data && res.data.data) {
          setStory(res.data.data);
          dispatch({
            type: SET_OWN_STORIES,
            payload: res.data.data,
          });
        }
        res.data === "" && setStory("")
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const storyClickHandler = (data) => {
    open_drawer("OWN_STORY", {
      stories: story,
      ownStory: true,
      creator: userData,
      theme,
      setActiveState: props.setActiveState,
      S3_IMG_LINK,
      back: () => back(),
    },
      "right"
    );
  };

  const back = () => {
    getActiveStories();
    close_drawer();
  };

  const handleNewPost = () => {
    Router.push("/post?type=story")
  };

  return (
    <div className="col-auto">
      <div className="py-1 my-1 justify-content-between align-items-center">
        <div className="col-12 p-0">
          <div className="row">
            <div className="col-auto">
              <div className="position-relative cursorPtr callout-none" onContextMenu={handleContextMenu}>
                {props.profilePic
                  ? <FigureCloudinayImage
                    publicId={props.profilePic}
                    errorImage={EMPTY_PROFILE}
                    // width={80}
                    ratio={1}
                    style={
                      mobileView
                        ? { height: "80px", width: "80px" }
                        : { height: "4.685vw", width: "4.685vw" }
                    }
                    className="tileRounded active"
                    onClick={story ? storyClickHandler : handleClick}
                  />
                  : <Avatar className="username__avatar mb-1  solid_circle_border" style={{ width: `${mobileView ? '80px' : '4.685vw'}`, height: `${mobileView ? '80px' : '4.685vw'}` }}>
                    {profile && profile.username && profile.lastName && (
                      <span className="avatar__initial">
                        {profile.firstName[0] + (profile.lastName ? profile.lastName[0] : '')}
                      </span>
                    )}
                  </Avatar>
                }
                {!story && (
                  <span onClick={story ? storyClickHandler : handleClick}
                    className={
                      mobileView
                        ? "add_story_option"
                        : "dv__add_story_option"
                    }>
                    <Icon
                      icon={`${PLUS_ICONS}#plus_icon`}
                      height={20}
                      width={24}
                      color={"var(--l_base)"}
                      alt="back arrow icon"
                      style={{ bottom: "-2%" }}
                      class="cursorPtr position-absolute"
                    />
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        {story && (
          <p
            className={`new__story text-center cursorPtr ${mobileView ? "mt-1 fntSz15 mb-0" : "fntSz10"}`}
            onClick={handleClick}>
            {lang.new}
          </p>
        )}
      </div>
    </div>
  );
};
export default OwnStoryPage;
