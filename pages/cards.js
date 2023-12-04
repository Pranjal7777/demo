import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { guestLogin, open_drawer } from "../lib/global";
import { getCookie, setCookie } from "../lib/session";
import { getCards } from "../redux/actions/index";
import isMobile from "../hooks/isMobile";
import dynamic from "next/dynamic";
import CustomHead from "../components/html/head";
import DvHomeLayout from "../containers/DvHomeLayout";
import { close_drawer } from "../lib/global/loader";
import RouterContext from "../context/RouterContext";
const HomePage = dynamic(() => import("../containers/sub-pages/homepage"), {
  ssr: false,
});

function Cards(props) {
  const { query } = props;
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [validGuest, setValidGuest] = useState(false);
  const auth = getCookie("auth");
  const dispatch = useDispatch();
  const router = useRouter();
  const [mobileView] = isMobile();
  const homePageref = useRef(null);

  useEffect(() => {
    // else {
    //   // remove cards option from links for now
    //   router.push('/');
    //   close_drawer("Cards");
    // }
    handleGetCard();
    setToggleDrawer(true);
  }, []);

  const handleGetCard = () => {
    dispatch(getCards());
  };

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
                  "Cards",
                  { handleCloseDrawer: handleCloseDrawer },
                  "right"
                )
                : ""}
            </>
          ) : (
            <DvHomeLayout
              setActiveState={(props) => {
                setActiveNavigationTab(props);
              }}
              activeLink="cards"
              homePageref={homePageref}
              withMore
              {...props}
            ></DvHomeLayout>
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

Cards.getInitialProps = async ({ ctx }) => {
  let { query = {}, req, res } = ctx;

  return {
    query: query,
  };
};

export default Cards;
