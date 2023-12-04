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

function MySubscribers(props) {
  const { query } = props;
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [validGuest, setValidGuest] = useState(false);
  const auth = getCookie("auth");
  const router = useRouter();
  const [mobileView] = isMobile();
  const homePageref = useRef(null);

  useEffect(() => {
    setToggleDrawer(true);
  }, []);

  const handleCloseDrawer = () => {
    router.back();
  };

  const { tab = "timeline" } = query;
  const [activeNavigationTab, setActiveNavigationTab] = useState(tab);

  return (
    <RouterContext forLogin={true} forUser={false} forCreator={true} forAgency={true} {...props}>
      <div className="mv_wrap_home" ref={homePageref} id="home-page">
        {mobileView ? (
          <>
            {activeNavigationTab === "timeline" && (
              <HomePage homePageref={homePageref} />
            )}
            {toggleDrawer
              ? open_drawer("MySubscribersComponent",
                { handleCloseDrawer },
                "right"
              )
              : ""}
          </>
        ) : (
          // <DvMyAccountLayout
          //   setActiveState={(props) => {
          //     setActiveNavigationTab(props);
          //   }}
          //   activeLink="mySubscribers"
          //   homePageref={homePageref}
          //   {...props}
          // />
          <DvHomeLayout
            activeLink="mySubscribers"
            homePageref={homePageref}
            pageLink="/my-subscribers"
            withMore
            {...props}
          />
        )}
        <style jsx>{`
      :global(.myAccount_sticky__section_header){
        top: -16px !important;
      }
      `}</style>
      </div>
    </RouterContext>
  );
}

MySubscribers.getInitialProps = async ({ ctx }) => {
  let { query = {}, req, res } = ctx;

  return {
    query,
  };
};

export default MySubscribers;
