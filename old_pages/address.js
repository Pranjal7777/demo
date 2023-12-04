import React, { useState, useEffect, useRef } from "react";
import { guestLogin, open_drawer } from "../lib/global";
import { getCookie, setCookie } from "../lib/session";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { getAddress } from "../redux/actions/address";
import isMobile from "../hooks/isMobile";
import dynamic from "next/dynamic";
const HomePage = dynamic(() => import("../containers/sub-pages/homepage"), {
  ssr: false,
});
import CustomHead from "../components/html/head";
const DvMyAccountLayout = dynamic(
  () => import("../containers/DvMyAccountLayout/DvMyAccountLayout"),
  { ssr: false }
);

function Address(props) {
  const { query } = props;
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [validGuest, setValidGuest] = useState(false);
  const auth = getCookie("auth");
  const dispatch = useDispatch();
  const router = useRouter();
  const [mobileView] = isMobile();
  const homePageref = useRef(null);

  useEffect(() => {
    if (!auth) {
      guestLogin().then((res) => {
        setCookie("guest", true);
        setValidGuest(true);
      });
    }
    handleGetAddress();
    setToggleDrawer(true);
  }, []);

  const handleGetAddress = () => {
    dispatch(getAddress());
  };

  const handleCloseDrawer = () => {
    router.back();
  };

  if (!validGuest && !auth) {
    return (
      <div className="mv_wrap_home">
        <CustomHead {...props.seoSettingData}></CustomHead>
      </div>
    );
  }

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
                "Address",
                {
                  handleCloseDrawer: handleCloseDrawer,
                  getAddress: handleGetAddress,
                },
                "right"
              )
            : ""}
        </>
      ) : (
        <DvMyAccountLayout
          setActiveState={(props) => {
            setActiveNavigationTab(props);
          }}
          activeLink="address"
          getAddress={handleGetAddress}
          homePageref={homePageref}
          {...props}
        ></DvMyAccountLayout>
      )}
    </div>
  );
}

Address.getInitialProps = async ({ ctx }) => {
  let { query = {}, req, res } = ctx;

  return {
    query: query,
  };
};

export default Address;
