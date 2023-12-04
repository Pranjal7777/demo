import React, { useState, useEffect } from "react";
import Wrapper from "../../hoc/Wrapper";
import CustomHeader from "../header/CustomHeader";
import FigureCloudinayImage from "../cloudinayImage/cloudinaryImage";
import { EMPTY_PROFILE } from "../../lib/config";
import StorySlider from "./StorySlider";
import { close_drawer, startLoader, stopLoader } from "../../lib/global";
import { getAllStories } from "../../services/assets";
import { Skeleton } from "@material-ui/lab";
import isMobile from "../../hooks/isMobile";
import StoryModule from "../../containers/stories/OtherUsersStories";
import { useSelector } from "react-redux";
import { isAgency } from "../../lib/config/creds";
import { useTheme } from "react-jss";
import { useRouter } from 'next/router';

const StoryDialog = (props) => {
  const { back, drawerData, setActiveState, ownStory } = props;
  const [mobileView] = isMobile();
  const router = useRouter();
  // console.log("props", props);
  const [stories, setStories] = useState([]);
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);
  const theme = useTheme();
  useEffect(() => {
    getUserStories(drawerData.userId);
    return () => {
      setStories([]);
    };
  }, []);

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

  return (
    <Wrapper>
      <div id="chat_cont" className={`bg-dark-custom vh-100`}>
        <Wrapper>
          {/* <CustomHeader back={back} size={25}>
            <div className="form-row align-items-start">
              <div className="col-auto">
                <FigureCloudinayImage
                  publicId={
                    drawerData && drawerData.profilePic
                      ? drawerData.profilePic
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
                <p className="m-0 fntSz18">{drawerData.username}</p>
              </div>
            </div>
          </CustomHeader> */}
          <div className="stories_cont">
            <div className="stories_dialog">
              {stories && stories.length ? (
                <StoryModule
                  back={() => back()}
                  routerPass={router}
                  creator={drawerData}
                  setActiveState={setActiveState}
                  stories={stories}
                  mobileView={mobileView}
                  S3_IMG_LINK={S3_IMG_LINK}
                  theme={theme}
                />
                // <StorySlider
                // back={() => back()}
                // creator={drawerData}
                // setActiveState={setActiveState}
                // data={stories}
                // />
              ) : (
                <div
                  style={{
                    position: "fixed",
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
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      margin: "auto",
                      borderRadius: "8px",
                    }}
                    variant="rect"
                  />
                  <div className="mt-3" style={{ width: "100%" }}>
                    <Skeleton
                      className="ml-3"
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "8px",
                      }}
                      width={100}
                      height={50}
                      variant="rect"
                    />
                    <Skeleton
                      className="my-3"
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        width: "96%",
                        margin: "auto",
                        borderRadius: "8px",
                      }}
                      height={40}
                      variant="rect"
                    />
                    <Skeleton
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        width: "96%",
                        margin: "auto",
                        borderRadius: "8px",
                      }}
                      height={10}
                      variant="rect"
                    />
                  </div>
                </div>
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
