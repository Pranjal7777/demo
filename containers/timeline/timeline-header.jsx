import React, { useState, useEffect } from "react";
import useProfileData from "../../hooks/useProfileData";
import Router from "next/router";
import { drawerToast, open_drawer } from "../../lib/global/loader";
import { authenticate, sendMail } from "../../lib/global/routeAuth";
import { getCookie } from "../../lib/session";
import isMobile from "../../hooks/isMobile";
import FigureImage from "../../components/image/figure-image";
import Icon from "../../components/image/icon";
import { useTheme } from "react-jss";
import { Badge } from "@material-ui/core";
import { useSelector } from "react-redux";
import useLang from "../../hooks/language";
import { DARK_LOGO, JUICY_HEADER_DARK_LOGO, JUICY_HEADER_LOGO, LOGO } from "../../lib/config/logo";
import { Add_HomeScreen, HUMBERGER_ICON, NOTIFICATION_ICON, POSTING_ICON, SEARCHBAR_ICON } from "../../lib/config/header";
import { isCameoTheme } from "../../lib/config/homepage";
import dynamic from "next/dynamic";
import { s3ImageLinkGen } from "../../lib/UploadAWS/s3ImageLinkGen";
const Avatar = dynamic(() => import("@material-ui/core/Avatar"), { ssr: false });

let deferredPrompt;

export default function TimelineHeader(props) {
  const [profile] = useProfileData();
  const [auth] = useState(getCookie("auth"));
  const theme = useTheme();
  const notificationCount = useSelector((state) => state?.notificationCount)
  const [installable, setInstallable] = useState(false);
  const [isButtonShow, setIsButtonShow] = useState(false)
  const [mobileView] = isMobile();
  const profileData = useSelector(state => state.profileData);
  const [lang] = useLang();
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);

  useEffect(() => {
    handleCreateEvent();
  }, []);

  const handleCreateEvent = () => {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;
      setIsButtonShow(true);
      setInstallable(true)
    });
    window.addEventListener("appinstalled", () => {
      console.log("INSTALL: Success");
      setIsButtonShow(false);
    });
  };

  const handleInstallClick = (e) => {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }
    });
  };
  const handleNavigationMenu = () => {
    open_drawer(
      "SideNavMenu",
      {
        paperClass: "backNavMenu",
        setActiveState: props.setActiveState,
        changeTheme: props?.changeTheme,
        noBorderRadius: true
      },
      "right"
    );
  };

  const handleGuestNavigationMenu = () => {
    open_drawer("GuestSideNavMenu",
      { paperClass: "backNavMenu", setActiveState: props.setActiveState },
      "right"
    );
  };

  const verifyAccount = (e) => {
    e.preventDefault();
    if (profileData && [5, 6].includes(profileData.statusCode)) {
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
      open_drawer('CREATE_POST', {}, 'bottom')
    }
  };
  return (
    <div className={`${props.className}`} style={theme.header}>
      <div className="col-12">
        <div className="row">
          <div className={mobileView ? 'container-fluid' : 'container'}>
            <div className="row justify-content-between py-3">

              {/* App Logo */}
              <div className="col-auto">
                <FigureImage
                  fclassname="mb-0 logo__img"
                  src={theme.type === "light" ? JUICY_HEADER_DARK_LOGO : JUICY_HEADER_LOGO}
                  width={110}
                  height={44}
                  alt="logoUser"
                  onClick={() => Router.asPath === "/" ? props.scrollAndRedirect() : Router.push("/")}
                />
              </div>


              <div className="col-auto d-flex align-items-center">
                <div className="row m-0 align-items-center">

                  {/* PWA Control */}
                  {isButtonShow
                    ? <FigureImage
                      fclassname="mb-0 pointer mx-2"
                      src={Add_HomeScreen}
                      width={21}
                      height={21}
                      onClick={installable
                        ? () => handleInstallClick()
                        : () => open_drawer("addtoHomeScreen",
                          { handleCreateEvent },
                          "top"
                        )
                      }
                    />
                    : ""
                  }

                  {/* Search Control */}
                  {/* <Icon
                    icon={`${SEARCHBAR_ICON}#searchBar`}
                    color={theme.type == "light" ? theme.markatePlaceLabelColor : theme.text}
                    width={mobileView ? 20 : 13}
                    height={24}
                    class={`${props.isSharedProfile ? "px-1" : "mx-3 mx-lg-2"}`}
                    onClick={() => open_drawer("HashtagSearchDrawer", {}, "right")}
                    viewBox="0 0 511.999 511.999"
                  /> */}

                  {/* Add Post Control */}
                  {isCameoTheme && profile.userTypeCode === 2 && <div
                    className="col-auto pl-2 pr-3"
                    onClick={(e) => verifyAccount(e)}
                  >
                    <Icon
                      icon={`${POSTING_ICON}#posting`}
                      color={theme.type === 'light'
                        ? theme.markatePlaceLabelColor
                        : theme.text
                      }
                      size="21"
                      viewBox="0 0 24.999 25"
                    />
                  </div>
                  }

                  {/* Notification Control */}
                  <Badge badgeContent={notificationCount} color="secondary">
                    <Icon
                      icon={`${NOTIFICATION_ICON}#notification`}
                      color={theme.type === "light" ? theme.markatePlaceLabelColor : theme.text}
                      width={24}
                      height={22}
                      onClick={() =>
                        authenticate().then(() => {
                          Router.push("/notification");
                        })
                      }
                      viewBox="0 0 23 23"
                    />
                  </Badge>

                  {/* Menu Control */}

                  <div
                    className="ml-3"
                    onClick={() => handleNavigationMenu()}>
                    {auth ? profile.profilePic ? <Avatar style={{ height: '36px', width: '36px' }} className='profile-pic solid_circle_border' alt={profile.firstName} src={s3ImageLinkGen(S3_IMG_LINK, profile?.profilePic)} />
                      : <div className="tagUserProfileImage solid_circle_border">{profile?.firstName[0] + (profile?.lastName && profile?.lastName[0])}</div>
                      : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}
