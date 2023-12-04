import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import HomePage from "../containers/sub-pages/homepage";
import isMobile from "../hooks/isMobile";
import { useRouter } from "next/router";
import { getCookie } from "../lib/session";
import CustomHead from "../components/html/head";
import { open_drawer } from "../lib/global";
import DvHomeLayout from "../containers/DvHomeLayout";
import RouterContext from "../context/RouterContext";

const AutoMessage = (props) => {
  const [mobileView] = isMobile();
  const auth = getCookie("auth");
  const [validGuest, setValidGuest] = useState(false);
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const homePageref = useRef(null);
  const router = useRouter();
  const { query } = props;
  const { tab = "timeline" } = query;
  const [activeNavigationTab, setActiveNavigationTab] = useState(tab);

  useEffect(() => {
    mobileView && setToggleDrawer(true);
  }, []);

  const handleCloseDrawer = () => {
    router.back();
  };

  return (
    <RouterContext forLogin={true} forUser={false} forCreator={true} forAgency={true} {...props}>
      <React.Fragment>
        <div className="mv_wrap_home" id="home-page">
          {mobileView
            ? <>
              {activeNavigationTab === "timeline" && (
                <HomePage homePageref={homePageref} />
              )}
              {toggleDrawer
                ? open_drawer(
                  "auto_message",
                  { handleCloseDrawer },
                  "right"
                )
                : ""}
            </>
            : <DvHomeLayout
              setActiveState={() => { }}
              activeLink="auto-message"
              homePageref={homePageref}
              withMore
              {...props}
            />
          }
        </div>
      </React.Fragment>
    </RouterContext>
  );
};

AutoMessage.getInitialProps = async ({ ctx }) => {
  let { query = {}, req, res } = ctx;
  let token = decodeURIComponent(getCookie("token", ctx.req));
  let account = {};
  return {
    query: query,
    account,
  };
};

export default AutoMessage;
