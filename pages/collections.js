import React, { useState, useEffect, useRef } from "react";
import { guestLogin, open_drawer } from "../lib/global";
import { getCookie, getCookiees, setCookie } from "../lib/session";
import { useRouter } from "next/router";
import isMobile from "../hooks/isMobile";
import dynamic from "next/dynamic";
import DvHomeLayout from "../containers/DvHomeLayout";
import CollectionPosts from "../components/Drawer/CollectionPosts";
import RouterContext from "../context/RouterContext";

function Collections(props) {
  const router = useRouter();
  const [mobileView] = isMobile();
  const homePageref = useRef(null);


  return (
    <RouterContext forLogin={true} forUser={true} forCreator={true} forAgency={true} {...props}>
      <>
        <div className="mv_wrap_home" ref={homePageref} id="home-page">
          {mobileView ? (<CollectionPosts
            {...props}
            onClose={router.back}
          ></CollectionPosts>
          ) : (
            <DvHomeLayout
              activeLink="collections"
              homePageref={homePageref}
              pageLink="/collections"
              withMore
              {...props}
            />
          )}
        </div>
        <style jsx="true">{`
        :global(.mv_wrap_home) {
          overflow-y: auto;
          height: ${!mobileView && "inherit"};
        }
        :global(.myAccount_sticky__section_header){
          top: -16px !important;
        }
      `}</style>
      </>
    </RouterContext>
  );
}

Collections.getInitialProps = async ({ ctx }) => {
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

export default Collections;
