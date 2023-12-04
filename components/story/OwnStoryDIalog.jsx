import React, { useState, useEffect } from "react";
import Wrapper from "../../hoc/Wrapper";
import CustomHeader from "../header/CustomHeader";
import FigureCloudinayImage from "../cloudinayImage/cloudinaryImage";
import { EMPTY_PROFILE, MORE_ICON } from "../../lib/config";
import StorySlider from "./StorySlider";
import {
  close_dialog,
  open_dialog,
  open_drawer,
  startLoader,
  stopLoader,
  Toast,
} from "../../lib/global";
import { getAllStories, storyDeleteApi } from "../../services/assets";
import { Skeleton } from "@material-ui/lab";
import MenuModel from "../model/postMenu";
import { useSelector } from "react-redux";
import OwnStorySlider from "./OwnStorySlider";
import isMobile from "../../hooks/isMobile"
import useLang from "../../hooks/language"
import { handleContextMenu } from "../../lib/helper";

const OwnStoryDialog = (props) => {
  const { back, stories, creator, setActiveState } = props;
  const [pause, setPause] = useState(null);
  const [activeStory, setActiveStory] = useState(null);
  const menuItems = [{ label: "Delete", value: 1 }];
  const [mobileView] = isMobile();
  const [lang] = useLang();

  const moreClickHandler = (res) => {
    if (res.value == 1) {
      mobileView ? (
        open_drawer(
          "confirmDrawer",
          {
            title: lang.dltStoryConfirmation,
            btn_class: "dangerBgBtn",
            cancelT: lang.cancel,
            submitT: lang.delete,
            yes: deleteStoryHandler,
            handleClose: () => {
              setPause(false);
            },
            subtitle: lang.dltStory,
          },
          "bottom"
        )
      ) : (
        open_dialog("confirmDialog", {
          title: lang.dltStoryConfirmation,
          btn_class: "dangerBgBtn",
          cancelT: lang.cancel,
          submitT: lang.delete,
          yes: deleteStoryHandler,
          handleClose: () => {
            setPause(false);
          },
          subtitle: lang.dltStory,
        })
      )
    }
  };
  const deleteStoryHandler = (flag) => {
    startLoader();
    const payload = {
      storyId: activeStory._id,
    };
    storyDeleteApi(payload)
      .then((res) => {
        back();
        Toast(lang.storyDeleted, "success")
        stopLoader();
      })
      .catch((err) => {
        console.error("error in deleting story", err);
        Toast(lang.dltStoryFailed, "error")
        stopLoader();
      });
    close_dialog()
  };
  const handleOpenMenu = (flag) => {
    // console.log("flag", flag);
    setPause(flag);
  };

  return (
    <Wrapper>
      <div id="chat_cont" className={`bg-dark-custom vh-100`}>
        <Wrapper>
          <CustomHeader back={back} size={25}>
            <div className="form-row align-items-start">
              <div className="col-auto callout-none" onContextMenu={handleContextMenu}>
                <FigureCloudinayImage
                  publicId={
                    creator && creator.profilePic
                      ? creator.profilePic
                      : EMPTY_PROFILE
                  }
                  className="tileRounded active"
                  style={{ borderRadius: "50%", width: "50px", height: "50px" }}
                  width={50}
                  height={50}
                />
                <span className="mv_online_true" />
              </div>
              <div className="col text-center txt-heavy m-auto">
                <p className="m-0 fntSz18">{creator.username}</p>
              </div>
            </div>
            <MenuModel
              items={menuItems}
              isOwnProfile={true}
              imageWidth={24}
              className="ml-auto mr-2 my-auto"
              handleOpenMenu={handleOpenMenu}
              handleChange={moreClickHandler}
              selected={{ label: "Revenue", value: 1 }}
            />
          </CustomHeader>
          <div className="stories_cont">
            <div className="stories_dialog">
              <OwnStorySlider
                back={() => back()}
                pause={pause}
                creator={creator}
                setActiveStory={setActiveStory}
                setActiveState={setActiveState}
                data={stories}
              />
            </div>
          </div>
        </Wrapper>
      </div>
      <style>
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
export default OwnStoryDialog;
