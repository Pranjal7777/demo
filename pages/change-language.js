import React, { useState, useEffect, useRef } from "react";
import {
  guestLogin,
  open_drawer,
  startLoader,
  stopLoader,
  Toast,
} from "../lib/global";
import { getCookie, setCookie } from "../lib/session";
import { useRouter } from "next/router";
import { getLanguages } from "../services/auth";
import isMobile from "../hooks/isMobile";
import dynamic from "next/dynamic";
import CustomHead from "../components/html/head";
import DvMyAccountLayout from "../containers/DvMyAccountLayout/DvMyAccountLayout";
import HomePage from "../containers/sub-pages/homepage";
import ChangeLanguage from "../components/Drawer/ChangeLanguage";
import CustomDataLoader from "../components/loader/custom-data-loading";
import RouterContext from "../context/RouterContext";
// const HomePage = dynamic(()=>import("../containers/sub-pages/homepage"),{ssr:false});
// const DvMyAccountLayout = dynamic(()=>import("../containers/DvMyAccountLayout/DvMyAccountLayout"),{ssr:false});

function ChangeLanguagePage(props) {
  const { query } = props;
  const isValidGuest = getCookie("guest");
  const [validGuest, setValidGuest] = useState(isValidGuest);
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const auth = getCookie("auth");
  const router = useRouter();
  const [mobileView] = isMobile();
  const homePageref = useRef(null);
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    handleGetLanguages();
  }, []);

  const handleGetLanguages = async () => {
    try {
      const response = await getLanguages();
      if (response.status == 200) {
        let arr = response && response.data && response.data.data;
        setLanguages(arr);
        setToggleDrawer(true);
      }
    } catch (e) {
      Toast(e.response.data.message, "error");
    }
  };

  const handleCloseDrawer = () => {
    router.back();
  };


  const { tab = "timeline" } = query;
  const [activeNavigationTab, setActiveNavigationTab] = useState(tab);

  return (
    <RouterContext forLogin={false} forUser={true} forCreator={true} forAgency={true} {...props}>
      <>
        <div className="mv_wrap_home" ref={homePageref} id="home-page">
          {mobileView ? (
            <ChangeLanguage
              handleCloseDrawer={handleCloseDrawer}
              languages={languages}
            />
          ) : (
            // <>
            // 	{activeNavigationTab === "timeline" && (
            // 		<HomePage homePageref={homePageref} />
            // 	)}
            // 	{toggleDrawer
            // 		? open_drawer(
            // 				"ChangeLanguage",
            // 				{
            // 					handleCloseDrawer: handleCloseDrawer,
            // 					languages: languages,
            // 				},
            // 				"right"
            // 		  )
            // 		: ""}
            // </>
            <DvMyAccountLayout
              setActiveState={(props) => {
                setActiveNavigationTab(props);
              }}
              activeLink="change-language"
              languages={languages}
              homePageref={homePageref}
              {...props}
            />
          )}
        </div>
        <style jsx="true">{`
        :global(.mv_wrap_home) {
          overflow-y: ${mobileView ? "auto" : "hidden"};
          height: ${!mobileView && "inherit"};
        }
      `}</style>
      </>
    </RouterContext>
  );
}

ChangeLanguagePage.getInitialProps = async ({ ctx }) => {
  let { query = {}, req, res } = ctx;

  return {
    query: query,
  };
};

export default ChangeLanguagePage;
