import React, { useState, useEffect } from "react";
import { EMPTY_PROFILE, MORE_ICON, SHARE_ICON } from "../../lib/config";
import {
  open_dialog,
  open_drawer,
  startLoader,
  stopLoader,
} from "../../lib/global";
import { getFeaturedStoryDetailsApi } from "../../services/assets";
import { useSelector } from "react-redux";
import isMobile from "../../hooks/isMobile";
import dynamic from "next/dynamic";
import Wrapper from "../../hoc/Wrapper"
const CustomHeader = dynamic(
  () => import("../../components/header/CustomHeader"),
  { ssr: false }
);
const FigureCloudinayImage = dynamic(
  () => import("../../components/cloudinayImage/cloudinaryImage"),
  { ssr: false }
);
const OwnStorySlider = dynamic(() => import("./highlight-story-slider"), {
  ssr: false,
});
const Img = dynamic(() => import("../../components/ui/Img/Img"), {
  ssr: false,
});
import { useTheme } from "react-jss";
import Icon from "../../components/image/icon";
import StoryModule from "../stories/OwnStories";
import { isAgency } from "../../lib/config/creds";

const HighlightStoryDialog = (props) => {
  const {
    back,
    featCollectionId,
    coverImage,
    title,
    creator,
    ownStory,
    setActiveState,
  } = props;
  const theme = useTheme();
  const [pause, setPause] = useState(null);
  const [featuredStoryList, setFeaturedStoryList] = useState(null);
  const profile = useSelector((state) => state.profileData);
  useEffect(() => {
    startLoader();
    getFeaturedStories(0);
  }, []);
  const [mobileView] = isMobile();
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

  const getFeaturedStories = (pageCount = 0) => {
    const list = {
      limit: 10,
      offset: pageCount * 10,
      id: featCollectionId,
      userId: creator.userId || profile._id,
    };
    if (isAgency()) {
      list["creatorId"] = selectedCreatorId;
    }
    getFeaturedStoryDetailsApi(list)
      .then((res) => {
        // console.log("getFeaturedStoryDetailsApi -> res -> ", res.data.data);
        if (res && res.data && res.data.data) {
          setFeaturedStoryList(res.data.data);
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
            featCollectionId: featCollectionId,
            activeStoryId: activeStory._id,
            data: featuredStoryList,
            coverImage,
            title,
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
          featCollectionId: featCollectionId,
          activeStoryId: activeStory._id,
          data: featuredStoryList,
          coverImage,
          title,
          handleClose: () => {
            setPause(false);
          },
          back: () => {
            back && back();
          },
          closeAll: true,
        });
  };

  return (
    <Wrapper>
      <div id="chat_cont" className={`bg-dark-custom vh-100`}>
        <Wrapper>
          <div className="stories_cont">
            <div className="stories_dialog">
              {featuredStoryList && featuredStoryList.length && (
                <StoryModule
                back={() => back()}
                theme={theme}
                ownStory={ownStory}
                pause={pause}
                creator={creator}
                uid={profile._id}
                setActiveState={setActiveState}
                stories={featuredStoryList}
                mobileView={mobileView}
                S3_IMG_LINK={S3_IMG_LINK}
                highlightMoreClickHandler={moreClickHandler}
                isHightlight
              />
              )}
            </div>
          </div>
        </Wrapper>
      </div>
      <style jsx>
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
          :global(.MuiList-padding) {
            padding: 0 20px;
            color: red;
          }
        `}
      </style>
    </Wrapper>
  );
};
export default HighlightStoryDialog;
