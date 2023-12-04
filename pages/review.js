import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import CustomHead from "../components/html/head";
import isMobile from "../hooks/isMobile";
import { guestLogin, open_drawer } from "../lib/global";
import { getCookie, setCookie } from "../lib/session";
import DvHomeLayout from "../containers/DvHomeLayout";
const HomePage = dynamic(() => import("../containers/sub-pages/homepage"), { ssr: false });

const Review = (props) => {
  const auth = getCookie("auth");
  const [mobileView] = isMobile();
  const homePageref = useRef(null);
  const router = useRouter();
  const [validGuest, setValidGuest] = useState(false);
  const [toggleDrawer, setToggleDrawer] = useState(false);
  useEffect(() => {
    if (!auth) {
      guestLogin().then((res) => {
        setCookie("guest", true);
        setValidGuest(true);
      });
    }

    // mobileView && setToggleDrawer(true);
  }, []);

  if (!validGuest && !auth) {
    return (
      <div className="mv_wrap_home">
        <CustomHead {...props.seoSettingData}></CustomHead>
      </div>
    );
  }

  const handleCloseDrawer = () => {
    router.back();
  };

  const [activeNavigationTab, setActiveNavigationTab] = useState("timeline");

  return (
    <div className="mv_wrap_home" ref={homePageref} id="home-page">
      {mobileView ? (
        <>
          {activeNavigationTab === "timeline" && (
            <HomePage homePageref={homePageref} />
          )}
          {toggleDrawer
            ? open_drawer(
              "reviewShoutout",
              { handleCloseDrawer, isCreatorSelf: true },
              "right"
            )
            : ""}
        </>
      ) :
      (<DvHomeLayout
        activeLink="reviews"
        pageLink="/review"
        isCreatorSelf="true"
        setActiveState={(props) => {
                setActiveNavigationTab(props);
              }}
        homePageref={homePageref}
        withMore
        {...props}
      />)}
    </div>
  );
}

export default Review;
