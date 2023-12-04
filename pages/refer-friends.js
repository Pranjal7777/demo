import React, { useState, useEffect, useRef } from "react";
import { guestLogin, open_drawer } from "../lib/global";
import { getCookie, getCookiees, setCookie } from "../lib/session";
import isMobile from "../hooks/isMobile";
import dynamic from "next/dynamic";
import CustomHead from "../components/html/head";
import DvHomeLayout from "../containers/DvHomeLayout";

const HomePage = dynamic(() => import("../containers/sub-pages/homepage"), { ssr: false });

function ReferFriends(props) {
  const { query } = props;
  const [validGuest, setValidGuest] = useState(false);
  const auth = getCookie("auth");
  const [mobileView] = isMobile();
  const homePageref = useRef(null);

  useEffect(() => {
    if (!auth) {
      guestLogin().then((res) => {
        setCookie("guest", true);
        setValidGuest(true);
      });
    }
  }, []);

  if (!validGuest && !auth) {
    return (
      <div className="mv_wrap_home">
        <CustomHead {...props.seoSettingData} />
      </div>
    );
  }

  const { tab = "timeline" } = query;
  const [activeNavigationTab, setActiveNavigationTab] = useState(tab);

  return (
    <>
      <div className="mv_wrap_home" ref={homePageref} id="home-page">
        {mobileView ? (
          activeNavigationTab === "timeline" && (
            <HomePage homePageref={homePageref} />
          )
        ) : (
            // <DvMyAccountLayout
            //   setActiveState={(props) => {
            //     setActiveNavigationTab(props);
            //   }}
            //   homePageref={homePageref}
            //   activeLink="refer-friends"
            //   {...props}
            // />
            <DvHomeLayout
              homePageref={homePageref}
            activeLink="refer-friends"
              pageLink="/refer-friends"
              withMore
            {...props}
          />
        )}
      </div>
      <style jsx="true">{`
        :global(.mv_wrap_home) {
          overflow-y: ${mobileView ? "auto" : "hidden"};
          height: ${!mobileView && "inherit"};
        }
        :global(.myAccount_sticky__section_header){
          top: -16px!important;
        }
      `}</style>
    </>
  );
}

ReferFriends.getInitialProps = async ({ ctx }) => {
  let { query = {}, req, res } = ctx;
  let token = decodeURIComponent(getCookiees("token", ctx.req));
  let account = {};
  return {
    query: query,
    account,
  };
};

export default ReferFriends;
