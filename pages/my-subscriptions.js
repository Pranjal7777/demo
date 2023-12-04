import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { guestLogin, open_drawer } from "../lib/global";
import { getCookie, setCookie } from "../lib/session";
import { getCards } from "../redux/actions/index";
import isMobile from "../hooks/isMobile";
import dynamic from "next/dynamic";

import CustomHead from "../components/html/head";
import DvHomeLayout from "../containers/DvHomeLayout";
import RouterContext from "../context/RouterContext";
const HomePage = dynamic(() => import("../containers/sub-pages/homepage"), {
  ssr: false,
});

function MySubscriptions(props) {
  const { query } = props;
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [validGuest, setValidGuest] = useState(false);
  const auth = getCookie("auth");
  const router = useRouter();
  const [mobileView] = isMobile();
  const homePageref = useRef(null);
  const userType = getCookie('userType');

  useEffect(() => {
    setToggleDrawer(true);
  }, []);

  const handleCloseDrawer = () => {
    router.back();
  };


  const { tab = "timeline" } = query;
  const [activeNavigationTab, setActiveNavigationTab] = useState(tab);

  return (
    <RouterContext forLogin={true} forUser={true} forCreator={false} forAgency={false} {...props}>
      <div className="mv_wrap_home" ref={homePageref} id="home-page">
        {mobileView ? (
          <>
            {activeNavigationTab === "timeline" && (
              <HomePage homePageref={homePageref} />
            )}
            {toggleDrawer
              ? open_drawer("MySubsComponent", { handleCloseDrawer }, "right")
              : ""}
          </>
        ) : (<DvHomeLayout
          activeLink="mySubscriptions"
          homePageref={homePageref}
          pageLink="/my-subscriptions"
          featuredBar
          withMore={userType == 2 ? true : false}
          {...props}
        />
        )}
      </div>
    </RouterContext>
  );
}

MySubscriptions.getInitialProps = async ({ ctx }) => {
  let { query = {}, req, res } = ctx;

  return {
    query,
  };
};

export default MySubscriptions;
