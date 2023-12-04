import CustomHead from "../components/html/head";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import isMobile from "../hooks/isMobile";
import { getCookie, setCookie } from "../lib/session";
import { useRouter } from "next/router";
import { open_drawer } from "../lib/global/loader";
import { useEffect } from "react";
import DvHomeLayout from "../containers/DvHomeLayout";
import RouterContext from "../context/RouterContext";

const HomePage = dynamic(() => import("../containers/sub-pages/homepage"), {
  ssr: false,
});

const DvMyAccountLayout = dynamic(
  () => import("../containers/DvMyAccountLayout/DvMyAccountLayout"),
  { ssr: false }
);

const MySubscriptions = (props) => {
  const { query } = props;
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [validGuest, setValidGuest] = useState(false);
  const auth = getCookie("auth");
  const router = useRouter();
  const homePageref = useRef(null);
  const [mobileView] = isMobile();

  useEffect(() => {
    if (!auth) {
      guestLogin().then((res) => {
        setCookie("guest", true);
        setValidGuest(true);
      });
    }
    setToggleDrawer(true);
  }, []);

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
    <RouterContext forLogin={true} forUser={false} forCreator={true} forAgency={true} {...props}>
      <>
        <CustomHead {...props.seoSettingData} />

        <div className="mv_wrap_home" ref={homePageref} id="home-page">
          {mobileView ? (
            <>
              {activeNavigationTab === "timeline" && (
                <HomePage homePageref={homePageref} />
              )}
              {toggleDrawer
                ? open_drawer(
                  "SubscriptionSettings",
                  {
                    handleCloseDrawer: handleCloseDrawer,
                  },
                  "right"
                )
                : ""}
            </>
          )
            :
            (<DvHomeLayout
              activeLink="subsSettings"
              pageLink="/subscription-settings"
              homePageref={homePageref}
              withMore
              {...props}
            />)}
        </div>
      </>
    </RouterContext>
  );
};

MySubscriptions.getInitialProps = async ({ ctx }) => {
  let { query = {}, req, res } = ctx;

  return {
    query: query,
  };
};

export default MySubscriptions;
