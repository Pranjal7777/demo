import React, { useState, useEffect, useRef } from "react";
import Script from "next/script";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import dynamic from "next/dynamic";

import { guestLogin, open_drawer } from "../lib/global";
import { getCookie, getCookiees, setCookie } from "../lib/session";
import isMobile from "../hooks/isMobile";
import { getConnectAccount } from "../services/payments";
import CustomHead from "../components/html/head";
import DvHomeLayout from "../containers/DvHomeLayout";
import useProfileData from "../hooks/useProfileData";
import Error from "./_error";
import WalletIndex from "../components/Drawer/WalletIndex";
import { isAgency } from "../lib/config/creds";
import RouterContext from "../context/RouterContext";

const HomePage = dynamic(() => import("../containers/sub-pages/homepage"), { ssr: false });

function Cards(props) {
  const { query } = props;
  const [validGuest, setValidGuest] = useState(false);
  const auth = getCookie("auth");
  const dispatch = useDispatch();
  const [account, setAccount] = useState({});
  const router = useRouter();
  const [mobileView] = isMobile();
  const homePageref = useRef(null);
  const [profileData] = useProfileData();
  const [pageError, setPageError] = useState(false);

  const getStripAccount = async () => {
    try {
      const data = await getConnectAccount();
      setAccount(data.data.data);
    } catch (err) {
      console.log(err)
    };
  };

  const handleCloseDrawer = () => {
    router.back();
  };

  const { tab = "timeline" } = query;
  const [activeNavigationTab, setActiveNavigationTab] = useState(tab);

  return (
    <RouterContext forLogin={true} forUser={true} forCreator={true} forAgency={true} {...props}>
      <React.Fragment>
        {pageError ? <Error /> : (<><div>
          <Script defer={true} src="https://sdk.amazonaws.com/js/aws-sdk-2.19.0.min.js" />
        </div>

          <div className={`${mobileView ? "mv_wrap_home" : ""} `} ref={homePageref} id="home-page">
            {mobileView
              ? activeNavigationTab === "timeline" && (
                <WalletIndex handleCloseDrawer={handleCloseDrawer}
                  getStripe={getStripAccount}
                  account={account} />
              )
              : <>
                <DvHomeLayout
                  setActiveState={(props) => {
                    setActiveNavigationTab(props);
                  }}
                  activeLink="wallet"
                  getStripe={getStripAccount}
                  account={account}
                  setAccount={setAccount}
                  homePageref={homePageref}
                  featuredBar={isAgency() ? false : true}
                  agencyMenuOpen
                  {...props}
                />
              </>
            }
          </div>
          <style jsx="true">{`
        :global(.mv_wrap_home) {
          overflow-y: ${mobileView ? "auto" : "hidden"};
          height: ${!mobileView && "inherit"};
        }
      `}</style></>)}
      </React.Fragment>
    </RouterContext>
  );
}

Cards.getInitialProps = async ({ ctx }) => {
  let { query = {}, req, res } = ctx;
  let token = decodeURIComponent(getCookiees("token", ctx.req));
  let account = {};
  // let getAccountDetails = await getConnectAccount(token);
  // account = getAccountDetails.data.data;
  return {
    query: query,
    account,
  };
};

export default Cards;
