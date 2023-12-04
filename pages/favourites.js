import React, { useState, useEffect, useRef } from "react";
import { getCookie } from "../lib/session";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import isMobile from "../hooks/isMobile";
import CustomHead from "../components/html/head";
import DvHomeLayout from "../containers/DvHomeLayout";
import FavouritePosts from "../components/Drawer/FavouritePosts";
import RouterContext from "../context/RouterContext";

function Favourites(props) {
  const { query } = props;
  const [validGuest, setValidGuest] = useState(false);
  const auth = getCookie("auth");
  const router = useRouter();
  const [mobileView] = isMobile();
  const homePageref = useRef(null);

  const { tab = "timeline" } = query;
  const [activeNavigationTab, setActiveNavigationTab] = useState(tab);

  const handleCloseDrawer = () => {
    router.back();
  };

  return (
    <RouterContext forLogin={true} forUser={true} forCreator={true} forAgency={true} {...props}>
    <div className="mv_wrap_home" ref={homePageref} id="home-page">
      {mobileView ? (
        <>
          <FavouritePosts
            handleCloseDrawer={handleCloseDrawer}
            homePageref={homePageref}
            {...props}
          />
        </>
      ) : (
        <DvHomeLayout
          activeLink="favourites"
          homePageref={homePageref}
          withMore
          pageLink="/favorites"
          {...props}
        />
      )}
      <style jsx>{`
      :global(.myAccount_sticky__section_header){
        top: -16px !important;
      }
      `}</style>
    </div>
    </RouterContext>
  );
}

Favourites.getInitialProps = async ({ ctx }) => {
  let { query = {}, req, res } = ctx;

  return {
    query: query,
  };
};

export default Favourites;
