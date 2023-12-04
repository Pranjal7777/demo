import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { getCookie, setCookie } from "../lib/session";
import {
  guestLogin,
  open_drawer,
  startLoader,
  stopLoader,
  Toast,
} from "../lib/global";
import DvMyAccountLayout from "../containers/DvMyAccountLayout/DvMyAccountLayout";
import ChangeLanguage from "../components/Drawer/ChangeLanguage";
import isMobile from "../hooks/isMobile";
import { getLanguages } from "../services/auth";

const LanguagePage = () => {
  const auth = getCookie("auth");
  const isValidGuest = getCookie("guest");
  const [validGuest, setValidGuest] = useState(isValidGuest);
  const Router = useRouter();
  const [mobileView] = isMobile();
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    if (!auth) {
      if (!validGuest) {
        guestLogin().then((res) => {
          setCookie("guest", true);
          setValidGuest(true);
        });
      }
    }
    handleGetLanguages();
  }, []);

  const handleGetLanguages = async () => {
    startLoader();
    try {
      const response = await getLanguages();
      if (response.status == 200) {
        let arr = response && response.data && response.data.data;
        setLanguages(arr);
        stopLoader();
        // setToggleDrawer(true);
      }
    } catch (e) {
      console.error("e", e);
      stopLoader();
      Toast(e?.response?.data?.message || "Failed to load languages!", "error");
    }
  };

  const handleCloseDrawer = () => {
    Router.back();
  };

  return (
    <React.Fragment>
      <div className="mv_wrap_home" id="home-page">
        {mobileView ? (
          <ChangeLanguage
            handleCloseDrawer={handleCloseDrawer}
            languages={languages}
          ></ChangeLanguage>
        ) : (
          // <>
          //   {toggleDrawer
          //     ? open_drawer(
          //         "ChangeLanguage",
          //         {
          //           handleCloseDrawer: handleCloseDrawer,
          //           languages: languages,
          //         },
          //         "right"
          //       )
          //     : ""}
          // </>
          <DvMyAccountLayout
            //   setActiveState={(props) => {
            //     setActiveNavigationTab(props);
            //   }}
            setActiveState={() => {}}
            activeLink="change-language"
            languages={languages}
            homePageref={homePageref}
            {...props}
          ></DvMyAccountLayout>
        )}
      </div>
    </React.Fragment>
  );
};

export default LanguagePage;
