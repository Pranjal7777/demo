import Router, { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Badge, Tooltip } from "@material-ui/core";
import { useTheme } from "react-jss";

import FigureCloudinayImage from "../../components/cloudinayImage/cloudinaryImage";
import NotificationDrawer from "../../components/DropdownMenu/notificationDrawer";
import Image from "../../components/image/image";
import Wrapper from "../../hoc/Wrapper";
import useLang from "../../hooks/language";
import useProfileData from "../../hooks/useProfileData";
import * as env from "../../lib/config";
import {
  drawerToast,
  open_dialog,
} from "../../lib/global/loader";
import { getRandomColor, handleContextMenu } from "../../lib/helper";
import { getCookie } from "../../lib/session";
import DvSearchBar from "../../containers/DvSearchBar";
import ProfileDropdownMenu from "../../components/DropdownMenu/ProfileDropdownMenu";
import Icon from "../../components/image/icon";
import InputBox from "../../components/input-box/input-box";
import Img from "../../components/ui/Img/Img";
import isMobile from "../../hooks/isMobile";
import HashtagSearchDrawer from "../../components/Drawer/hashtag/HashtagSearchDrawer";
import DvHashtagSearch from '../../components/Drawer/hashtag/DvHashtagSearch';
import { sendMail } from "../../lib/global";
import { authenticate } from "../../lib/global/routeAuth";
// import {dialog} from '../../containers/dialog/dialog';

export default function DvHeader(props) {
  const theme = useTheme();
  const params = useRouter();
  const [isProfileDropdownToggled, setIsProfileDropdownToggled] = useState(false);
  let pathname = params.pathname == "/[tab]" ? params.query.tab : params.pathname;
  const [materialUI, setPageCheck] = useState(false);
  const auth = getCookie("auth");
  const [profile] = useProfileData();
  const [lang] = useLang();
  // const userType = getCookie("userType") || profile.userTypeCode;
  const userType = profile.userTypeCode;
  const [mobileView] = isMobile();
  const current_theme = useSelector((state) => state.theme);
  const notificationCount = useSelector((state) => state?.notificationCount)
  const chatNotificationCount = useSelector((state) => state?.chatNotificationCount)

  useEffect(() => {
    handleDefaultAvatar();
  }, []);

  const handleDefaultAvatar = () => {
    if (auth && profile && !profile.profilePic) {
      var firstName =
        profile && profile.firstName ? profile.firstName.toString() : "";
      var lastName =
        profile && profile.lastName ? profile.lastName.toString() : "";
      var intials = firstName.charAt(0) + lastName.charAt(0);
      var profileImage = document.getElementById("profileImage");
      profileImage && profileImage.textContent
        ? ""
        : profileImage.append(intials);
      profileImage.style.backgroundColor = getRandomColor();
    }
  };

  const handleNavigation = (linkName) => {
    switch (linkName) {
      case lang.profile:
        Router.push("/profile");
        props.setActiveState && props.setActiveState("profile");
        break;

      case lang.collections:
        Router.push("/collections");
        break;
      case lang.wallet:
        Router.push("/wallet");
        break;

      case lang.debitCreditCard:
        Router.push("/cards");
        break;

      case lang.manageAddress:
        Router.push("/address");
        break;

      case lang.referYourFriends:
        Router.push("/refer-friends");
        break;

      case lang.homepage:
        Router.push("/homepage");
        break;
      case lang.aboutUs:
          Router.push("/about");
        break
      case lang.contactUs:
          Router.push("/contact-us");
        break;
      case lang.logout:
        open_dialog("Logout", {});
        break;
    }
  };

  const creatorProfileMenu = [
    {
      icon: env.PROFILE_White,
      iconWidth: "1.449",
      iconHeight: "1.449",
      label: lang.profile,
      onClick: handleNavigation,
      id: "profile_icon",
    },
    {
      icon: env.Wallet_Icon,
      iconWidth: "2",
      iconHeight: "2",
      label: lang.wallet,
      onClick: handleNavigation,
      id: "wallet",
    },
    {
      icon: env.Credit_Card_Icon,
      iconWidth: "1.7",
      iconHeight: "2",
      label: lang.debitCreditCard,
      onClick: handleNavigation,
      id: "credit-card",
    },
    {
      icon: env.Collection_Icon,
      iconWidth: "1.449",
      iconHeight: "1.449",
      label: lang.collections,
      onClick: handleNavigation,
      id: "Group_40704",
    },
    // {
    //   icon: env.Manage_Address_Icon,
    //   iconWidth: "2.5",
    //   iconHeight: "2.5",
    //   label: lang.manageAddress,
    //   onClick: handleNavigation,
    //   id: "Group_10002",
    // },
    {
      icon: env.Refer_Friends_Icon,
      iconWidth: "2.3",
      iconHeight: "2.3",
      label: lang.referYourFriends,
      onClick: handleNavigation,
      id: "refer_frnd",
    },
    {
      icon: env.shoutoutIcon,
      iconWidth: "2.2",
      iconHeight: "2.2",
      label: lang.homepage,
      onClick: handleNavigation,
      id: "shoutoutIcon",
    },
    {
      icon: env.Logout_Icon,
      iconWidth: "2",
      iconHeight: "2",
      label: lang.logout,
      onClick: handleNavigation,
      id: "Group_9997",
    },
  ];

  const profileMenu = [
    {
      icon: env.PROFILE_White,
      iconWidth: "1.8",
      iconHeight: "1.8",
      label: lang.profile,
      onClick: handleNavigation,
      id: "profile_icon",
    },
    {
      icon: env.Wallet_Icon,
      iconWidth: "2",
      iconHeight: "2",
      label: lang.wallet,
      onClick: handleNavigation,
      id: "wallet",
    },
    {
      icon: env.Credit_Card_Icon,
      iconWidth: "1.449",
      iconHeight: "1.449",
      label: lang.debitCreditCard,
      onClick: handleNavigation,
      id: "credit-card",
    },
    // {
    //   icon: env.Manage_Address_Icon,
    //   iconWidth: "1.449",
    //   iconHeight: "1.449",
    //   label: lang.manageAddress,
    //   onClick: handleNavigation,
    //   id: "Group_10002",
    // },
    {
      icon: env.shoutoutIcon,
      iconWidth: "2.2",
      iconHeight: "2.2",
      label: lang.homepage,
      onClick: handleNavigation,
      id: "shoutoutIcon",
    },
    {
      icon: env.Refer_Friends_Icon,
      iconWidth: "1.449",
      iconHeight: "1.449",
      label: lang.referYourFriends,
      onClick: handleNavigation,
      id: "refer_frnd",
    },
    {
      icon: env.Logout_Icon,
      iconWidth: "1.449",
      iconHeight: "1.449",
      label: lang.logout,
      onClick: handleNavigation,
      id: "Group_9997",
    },
  ];

  const verifyAccount = (e) => {
    e.preventDefault();
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
        isMobile: false,
      });
    } else {
      open_dialog("POST_DIALOG", {
        story: false,
        onBackdropClick: true,
      });
      // Router.push("/post");
    }
  };

  return (
    <Wrapper>
      <div className="col-12 p-0 d-flex align-items-center dv__header">
        <div className="websiteContainer">
          <div className="row m-0 align-items-center justify-content-between">
            <div className="col-auto order-1 order-md-1 mb-3 mb-md-0 p-0">
              <Image
                src={env.LOGO}
                className="logoImg"
                onClick={() =>
                  authenticate().then(() => {
                    props.setActiveState && props.setActiveState("timeline");
                    Router.push("/");
                  })
                }
              />
            </div>
            <div className="col-md-auto order-3 order-md-2">
              <div className="position-relative">
                {/* {(!auth && pathname == "/") ||
                  (auth && userType == 1 && pathname == "/")
                  ? <DvSearchBar theme={theme} lang={lang} />
                  : params.pathname.includes('explore') || params.query.tab == 'explore'
                    ? <DvHashtagSearch theme={theme} lang={lang} />
                    : <DvSearchBar theme={theme} lang={lang} />
                } */}
                <DvHashtagSearch theme={theme} lang={lang} />
              </div>
            </div>
            <div className="col-auto order-2 order-md-2">
              <div className="row align-items-center">

                {/* Popular/Latest Post */}
                <Tooltip title={"Home"}>
                  <div className="col-auto">
                    <div
                      onClick={() => {
                        props.setActiveState && props.setActiveState("timeline");
                        Router.push("/");
                      }}
                    >
                      {/* <Icon
                        icon={`${env.DV_HOME_ACTIVE}#home_icon`}
                        color={pathname === "/" ? theme.appColor : theme.iconColor}
                        hoverColor={theme.appColor}
                        // size={!auth || userType == 1 ? 25 : 25}
                        width={mobileView ? 25 : 1.7}
                        height={mobileView ? 25 : 1.7}
                        unit={mobileView ? "px" : "vw"}
                        class="cursorPtr"
                        viewBox="0 0 28 26"
                      /> */}
                    </div>
                  </div>
                </Tooltip>

                {/* Live Stream */}
                {auth && (
                  <Tooltip title={"Live Stream"}>
                    <div className="col-auto">
                      <div
                        onClick={() =>
                          authenticate().then(() => {
                            props.setActiveState &&
                              props.setActiveState("live");
                            Router.push("/live/popular");
                          })
                        }
                      >
                        <Icon
                          icon={`${env.PLAY_ICON}#liveStream_button`}
                          color={
                            pathname.includes('/live')
                              ? theme.appColor
                              : theme.iconColor
                          }
                          hoverColor={theme.appColor}
                          width={mobileView ? 25 : 1.5}
                          height={mobileView ? 25 : 1.5}
                          unit={mobileView ? "px" : "vw"}
                          class="cursorPtr"
                          viewBox="0 0 24.813 24.813"
                        />
                      </div>
                    </div>
                  </Tooltip>
                )}

                {/* Hashtags */}
                <Tooltip title={"Explore"}>
                  <div className="col-auto">
                    <div
                      onClick={() => {
                        props.setActiveState && props.setActiveState("hashtags");
                        Router.push("/explore");
                      }}
                    >
                      <Icon
                        icon={`${env.EXPLORE_ICON_Active}#explore_icon`}
                        color={pathname === "/explore" ? theme.appColor : theme.iconColor}
                        hoverColor={theme.appColor}
                        // size={!auth || userType == 1 ? 25 : 25}
                        width={mobileView ? 25 : 1.5}
                        height={mobileView ? 25 : 1.5}
                        unit={mobileView ? "px" : "vw"}
                        class="cursorPtr"
                        viewBox="0 0 21.854 21.854"
                      />
                    </div>
                  </div>
                </Tooltip>

                {/* Post Media */}
                {auth && userType == 2 && (
                  <Tooltip title={"Post Media"}>
                    <div className="col-auto">
                      <div
                        onClick={(e) => {
                          verifyAccount(e);
                        }}
                      >
                        <Icon
                          icon={`${env.POSTING_ICON_Blue}#posting_icon`}
                          color={
                            pathname === "/post"
                              ? theme.appColor
                              : theme.iconColor
                          }
                          hoverColor={theme.appColor}
                          width={mobileView ? 25 : 1.5}
                          height={mobileView ? 25 : 1.5}
                          unit={mobileView ? "px" : "vw"}
                          class="cursorPtr"
                          viewBox="0 0 25 24.794"
                        />
                      </div>
                    </div>
                  </Tooltip>
                )}

                {/* Chat */}
                <Tooltip title={"Chat"}>
                  <div className="col-auto">
                    <Badge badgeContent={chatNotificationCount} color="secondary">
                      <div
                        onClick={() =>
                          authenticate().then(() => {
                            Router.push("/chat");
                          })
                        }
                      >
                        <Icon
                          icon={`${env.NAV_CHAT_ICON}#chat`}
                          color={
                            pathname === "chat" ? theme.appColor : theme.iconColor
                          }
                          hoverColor={theme.appColor}
                          width={mobileView ? 25 : 1.5}
                          height={mobileView ? 25 : 1.5}
                          unit={mobileView ? "px" : "vw"}
                          class="cursorPtr"
                          viewBox="0 0 25 25.794"
                        />
                      </div>
                    </Badge>
                  </div>
                </Tooltip>

                {/* Notification */}
                <Tooltip title={"Notification"}>
                  <div className="col-auto notification_icon">
                    {auth ? (
                      <Badge badgeContent={notificationCount} color="secondary">
                        <NotificationDrawer
                          button={
                            <Icon
                              icon={`${env.NOTIFICATION_ICON_Blue}#notification_icon`}
                              color={theme.type == "light" ? theme.iconColor : "#fff"}
                              hoverColor={theme.appColor}
                              width={mobileView ? 25 : 1.5}
                              height={mobileView ? 25 : 1.5}
                              unit={mobileView ? "px" : "vw"}
                              class="cursorPtr"
                              viewBox="0 0 23 23"
                            />
                          }
                        />
                      </Badge>
                    ) : (
                      <Badge badgeContent={notificationCount} color="secondary">
                        <Icon
                          icon={`${env.NOTIFICATION_ICON_Blue}#notification_icon`}
                          color={theme.type == "light" ? theme.iconColor : "#fff"}
                          hoverColor={theme.appColor}
                          width={mobileView ? 25 : 1.5}
                          height={mobileView ? 25 : 1.5}
                          unit={mobileView ? "px" : "vw"}
                          class="cursorPtr"
                          viewBox="0 0 23 23"
                        />
                      </Badge>
                    )}
                  </div>
                </Tooltip>

                 {/* Homepage */}
                 {!getCookie("userType") && <Tooltip title={lang.homepage}>
                  <div className="col-auto cursorPtr">
                      <div
                        onClick={() => Router.push("/homepage")}
                      >
                        <Icon
                          icon={`${env.homepage_guest}#homepage_guest`}
                          color={theme.type === "light" ? theme.iconColor : "#fff"}
                          width={24}
                          height={22}
                          alt="user_category_icon"
                          viewBox="0 0 23.756 18.846"
                          class="cursorPtr"
                        />
                      </div>
                  </div>
                </Tooltip>}

                {/* Profile */}
                <Tooltip title={"Profile"}>
                  <div className="col-auto pr-0 callout-none" onContextMenu={handleContextMenu}>
                    {auth ? (
                      <ProfileDropdownMenu
                        handleArow={(classBoll) => setIsProfileDropdownToggled(classBoll)}
                        button={
                          profile.profilePic ? (
                            <div className="d-flex align-items-center">
                              <FigureCloudinayImage
                                publicId={profile.profilePic}
                                errorImage={env.EMPTY_PROFILE}
                                style={{
                                  borderRadius: "50%",
                                  border: "1px solid theme.l_base",
                                  width: "1.903vw",
                                  height: "1.903vw",
                                  cursor: "pointer",
                                }}
                                width="70"
                                height="70"
                                crop={"fill"}
                              />
                              <Icon
                                icon={!isProfileDropdownToggled ? `${env.downArrowIcons}#Icon_feather-chevron-right` : `${env.upArrowIcon}#uparrow`}
                                color={theme.type == "light" ? "#666666" : "#fff"}
                                hoverColor={theme.appColor}
                                width={mobileView ? 25 : 0.950}
                                height={mobileView ? 25 : 0.950}
                                unit={mobileView ? "px" : "vw"}
                                class="cursorPtr pl-2"
                                viewBox="0 0 10.048 5.624"
                              />
                            </div>
                          ) : (
                            <div id="profileImage"></div>
                          )
                        }
                        menuItems={
                          userType == 1 ? profileMenu : creatorProfileMenu
                        }
                      />
                    ) : (
                      <>
                        <div
                          onClick={() =>
                              authenticate().then(() => { }).catch(err => console.log(err))
                          }
                        >
                          <Icon
                            icon={`${env.PROFILE_White}#profile_icon`}
                            color={theme.type == "light" ? "#666666" : "#fff"}
                            hoverColor={theme.appColor}
                            width={mobileView ? 25 : 1.5}
                            height={mobileView ? 25 : 1.5}
                            unit={mobileView ? "px" : "vw"}
                            class="cursorPtr"
                            viewBox="0 0 24.785 24.785"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </Tooltip>

              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>
        {` #profileImage {
            width: 1.903vw;
            height: 1.903vw;
            border-radius: 50%;
            font-size: 0.878vw;
            color: #fff;
            text-align: center;
            text-transform: uppercase;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          :global(.profileDropdown > button),
          :global(.profileDropdown > button:hover),
          :global(.profileDropdown > button:active),
          :global(.profileDropdown > button:focus) {
            background: transparent !important;
            border: none;
            padding: 0;
          }
          :global(.active-notification > button > span > div > svg) {
            color: ${theme.appColor};
          }
        `}
      </style>
    </Wrapper>
  );
}
