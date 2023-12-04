import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import HomePage from "../sub-pages/homepage";
import useProfileData from "../../hooks/useProfileData";
import isMobile from "../../hooks/isMobile";
import { useSelector } from "react-redux";

const GuestBottomNavigation = dynamic(() => import("../timeline/bottom-navigation-guest"));
const ModelBottomNavigation = dynamic(() => import("../timeline/bottom-navigation-model"));
const UserBottomNavigation = dynamic(() => import("../timeline/bottom-navigation-user"));

const SocialPosts = (props) => {
  const [profile] = useProfileData();
  const homePageref = useRef(null);
  const [mobileView] = isMobile();
  const [activeNavigationTab, setActiveNavigationTab] = useState("social");
  const statusCode = useSelector((state) => state.profileData.statusCode)
  const setCustomVhToBody = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vhCustom', `${vh}px`);
  };
  useEffect(() => {
    setCustomVhToBody();
    window.addEventListener('resize', setCustomVhToBody);

    return () => {
      window.removeEventListener('resize', setCustomVhToBody);
    };
  }, []);

  return (
    <div style={mobileView
      ? { height: 'calc(var(--vhCustom, 1vh) * 100)' }
      : { height: statusCode !== 1 ? "92vh" : "100vh" }
    } id="home-page" ref={homePageref} className="overflow-auto scroll-hide">
      <HomePage
        setActiveState={(props) => {
          setActiveNavigationTab(props);
        }}
        homePageref={homePageref}
        {...props}
      />
      {profile?.userTypeCode === 1 && mobileView && (
        <UserBottomNavigation
          setActiveState={(props) => {
            setActiveNavigationTab(props);
          }}
          tabType={activeNavigationTab}
        />
      )}
      {profile?.userTypeCode === 2 && mobileView && (
        <ModelBottomNavigation
          setActiveState={(props) => {
            setActiveNavigationTab(props);
          }}
          tabType={activeNavigationTab}
        />
      )}
      {profile?.userTypeCode !== 2 &&
        profile?.userTypeCode !== 1 &&
        mobileView && (
          <GuestBottomNavigation
            setActiveState={(props) => {
              setActiveNavigationTab(props);
            }}
            tabType={activeNavigationTab}
          />
        )}
    </div>
  );
};

export default SocialPosts;
