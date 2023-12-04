import Router from "next/router";
import React from "react";
import { useTheme } from "react-jss";
import Icon from "../image/icon";
import isMobile from "../../hooks/isMobile";
import { CLOSE_ICON_WHITE, EMPTY_PROFILE, more_symbol } from "../../lib/config";
import { close_dialog, open_dialog, open_drawer, open_progress, startLoader, stopLoader, Toast, } from "../../lib/global";
import { storyDeleteApi } from "../../services/assets";
import FigureCloudinayImage from "../cloudinayImage/cloudinaryImage";
import CustomHeader from "../header/CustomHeader";
import Image from "../image/image";
import MenuModel from "../model/postMenu";
import useLang from "../../hooks/language"
import { refreshStoryApi } from "../../lib/rxSubject";
import CancelIcon from "@material-ui/icons/Cancel";
import useProfileData from "../../hooks/useProfileData";
import { handleContextMenu } from "../../lib/helper";

/**
 * @description : This is the custom header we used in the story module. It contains the Profile Info of User and Menu for the story
 * @author Paritosh
 * @date 07/04/2021
 * @param {*} props
 * @param back : f() - Used to Navigate Back
 * @param action : f() - Used to Play and Pause the Story, If passes 'pause' as argument, story will pause. Same for 'play'
 * @param ownStory : boolean - True if the story is of logged in User, and false for story of other users.
 */
const CustomHeaderComponent = (props) => {
  // console.log("CustomHeaderComponent", props);
  const { back, creator = {}, ownStory, action, activeStory, isHightlight = false, highlightMoreClickHandler } = props;
  const menuItems = [{ label: "Delete", value: 1 }];
  const [mobileView] = isMobile();
  const theme = useTheme();
  const [lang] = useLang();
  const [profile] = useProfileData();

  const handleOpenMenu = (flag) => {
    action("pause");
  };

  const deleteStoryHandler = (flag) => {
    startLoader();
    const payload = {
      storyId: activeStory._id,
    };
    storyDeleteApi(payload)
      .then((res) => {
        back();
        stopLoader();
        Toast("Story Deleted Successfully", "success")
        refreshStoryApi.next()
      })
      .catch((err) => {
        stopLoader();
        console.error("Error in deleting story", err);
        Toast("An error occurred while deleting your story", "error")
      });

    close_dialog()
  };

  const openProfile = () => {
    if (ownStory) return;
    props.action("pause");
    open_progress();
    Router.push(
      `/${creator.username || creator.userName}`
    );

  }

  const moreClickHandler = (res) => {
    // console.log('active story details ', activeStory)
    if (res.value == 1) {
      mobileView ? (
        open_drawer(
          "confirmDrawer",
          {
            title: lang.dltStoryConfirmation,
            btn_class: "dangerBgBtn",
            cancelT: "Cancel",
            submitT: "Delete",
            yes: deleteStoryHandler,
            handleClose: () => {
              // setPause(false);
            },
            subtitle: lang.dltStory,
          },
          "bottom"
        )
      ) : (
        open_dialog("confirmDialog", {
          title: lang.dltStoryConfirmation,
          subtitle: lang.dltStory,
          btn_class: "dangerBgBtn",
          cancelT: 'Cancel',
          submitT: 'Delete',
          yes: deleteStoryHandler,
          closeAll: true,
        })
      )
    }
  };

  const handleHighlightOptions = () => {
    props.action("pause");
    highlightMoreClickHandler(activeStory);
  };

  return (
    <>
      {mobileView ? (
        <div style={styles.main ? styles.main : {}}>
          <CustomHeader back={back} iconColor="#fff">
            <div onClick={openProfile} className="form-row align-items-center text-app">
              <div className="col-auto callout-none" onContextMenu={handleContextMenu}>
                <FigureCloudinayImage
                  publicId={
                    creator.profilePic ? creator.profilePic : EMPTY_PROFILE
                  }
                  className="tileRounded active"
                  style={{ borderRadius: "50%", width: "50px", height: "50px" }}
                  width={50}
                  height={50}
                />
                {/* <span className="mv_online_true" /> */}
              </div>
              <span style={styles.text}>
                <p
                  style={{
                    ...styles.heading,
                  }}
                >
                  {`${creator.userName || creator.username}`}
                </p>
              </span>
              {/* <div className="col text-center txt-heavy m-auto">
                    <p className="m-0 fntSz18">{creator.username}</p>
                </div> */}
            </div>
            {ownStory && !isHightlight ? (
              <MenuModel
                items={menuItems}
                isOwnProfile={true}
                imageWidth={32}
                className="ml-auto my-auto"
                handleOpenMenu={handleOpenMenu}
                handleChange={moreClickHandler}
                selected={{ label: "Revenue", value: 1 }}
                iconColorWhite={true}
              />
            ) : (
              <></>
            )}
            {
              ownStory && isHightlight ? (
                <>
                  <Icon
                    onClick={handleHighlightOptions}
                    icon={`${more_symbol}#_Icons_Close_Copy_4`}
                    color="#fff"
                    width={30}
                    height={100}
                    unit="px"
                    viewBox="0 0 4.145 17.292"
                    class="ml-auto"
                  />
                </>
              ) : <></>
            }
          </CustomHeader>
        </div>
      ) : (
        <div style={styles.mainDesktop}>
          {ownStory ? <div style={styles.closeBtn}>
            <Icon
              icon={CLOSE_ICON_WHITE + "#close-white"}
              onClick={() => {
                back ? back() : Router.back();
              }}
              width={21}
              height={21}
              color={"#fff"}
              alt="Back Option"
              style={{
                position: "fixed",
                top: "25px",
                right: "250px",
                zIndex: "1",
              }}
            />
            {/* <CancelIcon
              className="text-muted cursorPtr"
              fontSize="large"
              onClick={() => {
                back ? back() : Router.back();
              }}
            /> */}

          </div> : <> </>}
          <div onClick={openProfile} className={`form-row align-items-center text-app ${ownStory ? 'cursor-default' : 'cursorPtr'}`}>
            <div className="col-auto callout-none" onContextMenu={handleContextMenu}>
              <FigureCloudinayImage
                publicId={
                  creator.profilePic ? creator.profilePic : EMPTY_PROFILE
                }
                className="tileRounded active"
                style={{ borderRadius: "50%", width: "40px", height: "40px" }}
                width={40}
                height={40}
              />
              {/* <span className="mv_online_true" /> */}
            </div>
            <span style={styles.text}>
              <p
                style={{
                  ...styles.heading, ...styles.desktopHeading,
                }}
              >
                {`${creator.userName || creator.username}`}
              </p>
            </span>
            {/* <div className="col text-center txt-heavy m-auto">
                  <p className="m-0 fntSz18">{creator.username}</p>
              </div> */}
          </div>
          {ownStory && !isHightlight ? (
            <MenuModel
              items={menuItems}
              isOwnProfile={true}
              imageWidth={24}
              className="ml-auto my-auto"
              handleOpenMenu={handleOpenMenu}
              handleChange={moreClickHandler}
              selected={{ label: "Revenue", value: 1 }}
              iconColorWhite={true}
            />
          ) : (
            <></>
          )}

          {
            ownStory && isHightlight ? (
              <>
                <Icon
                  onClick={handleHighlightOptions}
                  icon={`${more_symbol}#_Icons_Close_Copy_4`}
                  color={"#fff"}
                  width={44}
                  height={44}
                  unit="px"
                  viewBox="0 0 44 44"
                  class="ml-auto cursorPtr"
                />
              </>
            ) : <></>
          }
          <style jsx>{`
       :global(.dangerBgBtn,.dangerBgBtn:hover,.dangerBgBtn:focus){
        border-radius:6px !important;
       } 
       `}
          </style>
        </div>
      )}
    </>
  );
};
const styles = {
  main: {
    display: "flex",
    alignItems: "center",
    position: "absolute",
    top: "0px",
    right: "10px",
    left: "10px",
    width: "auto",
    zIndex: 1000,
    padding: 0,
  },
  mainDesktop: {
    display: "flex",
    alignItems: "center",
    position: "absolute",
    top: "15px",
    right: "10px",
    left: "15px",
    zIndex: 1000,
    padding: 0,
  },
  closeBtn: {
    position: "fixed",
    top: '25px',
    right: '25px',
    cursor: 'pointer',
  },
  img: {
    width: 40,
    height: 40,
    borderRadius: 40,
    marginRight: 10,
    filter: "drop-shadow(0 0px 2px rgba(0, 0, 0, 0.5))",
    border: "2px solid rgba(255, 255, 255, 0.8)",
  },
  text: {
    display: "flex",
    flexDirection: "column",
    filter: "drop-shadow(0 0px 3px rgba(0, 0, 0, 0.9))",
  },
  heading: {
    fontSize: "1rem",
    color: "rgba(255, 255, 255, 0.9)",
    margin: 0,
    marginBottom: 2,
    fontWeight: "bold",
  },
  desktopHeading: {
    fontSize: "0.8rem",
  },
  desktopSubHeading: {
    fontSize: "0.55rem",
  },
  subheading: {
    fontSize: "0.6rem",
    color: "rgba(255, 255, 255, 0.8)",
    margin: 0,
    fontWeight: "bold",
    textAlign: "left",
  },
};
export default CustomHeaderComponent;
