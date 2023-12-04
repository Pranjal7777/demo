import React, { useState, useEffect, useRef } from "react";
import { guestLogin, open_drawer } from "../lib/global";
import { getCookie, getCookiees, setCookie } from "../lib/session";
import isMobile from "../hooks/isMobile";
import dynamic from "next/dynamic";
const HomePage = dynamic(() => import("../containers/sub-pages/homepage"), {
  ssr: false,
});
import CustomHead from "../components/html/head";
import { useRouter } from "next/router";
import DvHomeLayout from "../containers/DvHomeLayout";
function ReportProblems(props) {
  const { query } = props;
  const [validGuest, setValidGuest] = useState(false);
  const auth = getCookie("auth");
  const [mobileView] = isMobile();
  const homePageref = useRef(null);
  const router = useRouter();
  const [toggleDrawer, setToggleDrawer] = useState(false);
  useEffect(() => {
    if (!auth) {
      guestLogin().then((res) => {
        setCookie("guest", true);
        setValidGuest(true);
      });
    }

    mobileView && setToggleDrawer(true);
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

  const { tab = "timeline" } = query;
  const [activeNavigationTab, setActiveNavigationTab] = useState(tab);

  return (
    <div className="mv_wrap_home" ref={homePageref} id="home-page">
      {mobileView ? (
        <>
        {activeNavigationTab === "timeline" && (
          <HomePage homePageref={homePageref} />
        )}
        {toggleDrawer
            ? open_drawer(
              "report_problem",
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
          //   activeLink="report-problem"
          //   homePageref={homePageref}
          //   {...props}
          // ></DvMyAccountLayout>
          <DvHomeLayout
            activeLink="report-problem"
            pageLink="/report-problem"
            homePageref={homePageref}
            withMore
            {...props}
          />
      )}
    </div>
  );
}

ReportProblems.getInitialProps = async ({ ctx }) => {
  let { query = {}, req, res } = ctx;
  let token = decodeURIComponent(getCookiees("token", ctx.req));
  let account = {};
  return {
    query: query,
    account,
  };
};

export default ReportProblems;
