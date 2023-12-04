import dynamic from "next/dynamic";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import isMobile from "../../hooks/isMobile";
import useProfileData from "../../hooks/useProfileData";
import { close_drawer } from "../../lib/global/loader";
import { guestLogin } from "../../lib/global/guestLogin";
import { getCookie, setCookie } from "../../lib/session";
import { getWallet } from "../../redux/actions/index";
import CustomHead from "../../components/html/head";
import { useTheme } from "react-jss";
import { APP_NAME } from "../../lib/appName";
const GuestBottomNavigation = dynamic(
  () => import("../timeline/bottom-navigation-guest"),
  { ssr: false }
);
const ModelBottomNavigation = dynamic(
  () => import("../timeline/bottom-navigation-model"),
  { ssr: false }
);
const UserBottomNavigation = dynamic(
  () => import("../timeline/bottom-navigation-user"),
  { ssr: false }
);

const CookieConsent = dynamic(() => import("react-cookie-consent"));
// import HomePageComp from "../../pages/homepage/index"


const Index = (props) => {
  const theme = useTheme();
  const [validGuest, setValidGuest] = useState(false);
  const [profile] = useProfileData();
  const { query } = props;
  const auth = getCookie("auth");
  const token = getCookie("token");
  const dispatch = useDispatch();
  const [mobileView] = isMobile();
  const homePageref = useRef(null);
  const [activeNavigationTab, setActiveNavigationTab] = useState("timeline");

  const setCustomVhToBody = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vhCustom', `${vh}px`);
  };

  useEffect(() => {
    if (!mobileView) return;
    setCustomVhToBody();
    window.addEventListener('resize', setCustomVhToBody);

    return () => {
      window.removeEventListener('resize', setCustomVhToBody);
    };
  }, []);

  useEffect(() => {
    close_drawer();
    if (!auth) {
      if (token) {
        setCookie("guest", true);
        setValidGuest(true);
      } else {
        guestLogin().then((res) => {
          setCookie("guest", true);
          setValidGuest(true);
        });
      }
    }
    if (auth) {
      dispatch(getWallet()); // get walletDetails
    }
  }, []);

  const paddingRemover = activeNavigationTab == "chat" ? "pb-0" : "";

  // if (!validGuest && !auth) {
  //   return (
  //     <div
  //       className={
  //         mobileView
  //           ? `mv_wrap_home  ${paddingRemover}`
  //           : `mv_wrap_home pb-0  ${paddingRemover}`
  //       }
  //       id="home-page"
  //     >
  //       <CustomHead {...props.seoSettingData} />
  //     </div>
  //   );
  // }




  return (
    <>
      <div
        className={
          mobileView
            ? `mv_wrap_home pb-0 ${paddingRemover}`
            : `mv_wrap_home pb-0 ${paddingRemover}`
        }
        id="home-page"
        ref={homePageref}
        style={{
          overflow: mobileView
            ? activeNavigationTab === "profile"
              ? "unset"
              : "auto"
            : "auto",
        }}
      >

        <CustomHead {...props.seoSettingData} />
        <HomePageComp
          setActiveState={(props) => {
            setActiveNavigationTab(props);
          }}
          homePageref={homePageref}
          {...props}
        />
        <CookieConsent
          location="bottom"
          cookieName="freelyCookies"
          style={{ background: theme.background }}
          containerClasses={
            mobileView ? "CookieConsent" : "dv__CookieConsent"
          }
          buttonWrapperClasses="acceptBtnWrapper"
          buttonClasses="btn btn-default"
          contentClasses="contentDiv"
          expires={150}
          hideOnAccept={true}
          buttonText="Accept"
        >
          <p
            className={`m-0 fntSz14 ${theme.type === "light" ? "text-black" : "text-white"
              } txt-roman`}
          >
            <span
              className={`fntSz15 
                ${theme.type === "light" ? "text-black" : "text-white"} txt-heavy`}
            >
              Let's talk cookies!
            </span>{" "}
            {`We and our trusted third-party partners use cookies and other data and tech to analyze, enhance and personalize your experience on and off ${APP_NAME}, Click 'Accept' to consent and continue enjoying ${APP_NAME}. Manage your data in your cookies settings.`}
          </p>
        </CookieConsent>

        {profile.userTypeCode === 1 && mobileView && (
          <UserBottomNavigation
            setActiveState={(props) => {
              setActiveNavigationTab(props);
            }}
            tabType={activeNavigationTab}
          />
        )}
        {profile.userTypeCode === 2 && mobileView && (
          <ModelBottomNavigation
            uploading={props.postingLoader}
            setActiveState={(props) => {
              setActiveNavigationTab(props);
            }}
            tabType={activeNavigationTab}
          />
        )}
        {!auth && mobileView && (
          <GuestBottomNavigation
            setActiveState={(props) => {
              setActiveNavigationTab(props);
            }}
            tabType={activeNavigationTab}
          />
        )}
        {props.children}
      </div>
      <style jsx="true">
        {`
      .mv_wrap_home {
        height: ${mobileView ? 'calc(var(--vhCustom, 1vh) * 100)' : '100vh'} !important;
      }
      `}
      </style>
    </>
  );
};


export default Index;