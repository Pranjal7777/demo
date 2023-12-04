import React, { useState, useEffect, useRef } from "react";
import { guestLogin, open_drawer } from "../lib/global";
import { getCookie, setCookie } from "../lib/session";
import { useRouter } from "next/router";
import isMobile from "../hooks/isMobile";
import dynamic from "next/dynamic";
import CustomHead from "../components/html/head";
import DvHomeLayout from "../containers/DvHomeLayout";
import RouterContext from "../context/RouterContext";
const HomePage = dynamic(() => import("../containers/sub-pages/homepage"), {
  ssr: false,
});

function BillingPlans(props) {
  const { query } = props;
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [validGuest, setValidGuest] = useState(false);
  const auth = getCookie("auth");
  const router = useRouter();
  const homePageref = useRef(null);
  const [mobileView] = isMobile();

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
      <>
        <div className="mv_wrap_home" ref={homePageref} id="home-page">
          {mobileView ? (
            <>
              {activeNavigationTab === "timeline" && (
                <HomePage homePageref={homePageref} />
              )}
              {toggleDrawer
                ? open_drawer(
                  "BillingPlans",
                  {
                    handleCloseDrawer: handleCloseDrawer,
                  },
                  "right"
                )
                : ""}
            </>
          ) : (
            <DvHomeLayout
              activeLink="billing-plans"
              pageLink="/billing-history"
              homePageref={homePageref}
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
          top: -16px !important;
        }
        :global(.filter_options){
          top : 6vh !important;
        }
      `}</style>
      </>
    </RouterContext>
  );
}

BillingPlans.getInitialProps = async ({ ctx }) => {
  let { query = {}, req, res } = ctx;

  return {
    query: query,
  };
};

export default BillingPlans;
