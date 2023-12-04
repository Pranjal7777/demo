import React, { useState, useEffect } from "react";
import isMobile from "../hooks/isMobile";
import {
  guestLogin,
  open_dialog,
  open_drawer,
  startLoader,
  stopLoader,
  Toast,
} from "../lib/global";
import { getCookie, setCookie } from "../lib/session";
import { deleteUser } from "../services/auth";
import Router from "next/router";
import dynamic from "next/dynamic";
import CustomHead from "../components/html/head";
import RouterContext from "../context/RouterContext";
const HomePage = dynamic(() => import("../containers/sub-pages/homepage"), { ssr: false });

function DeleteAccount(props) {
  const { query } = props;
  const [validGuest, setValidGuest] = useState(false);
  const auth = getCookie("auth");
  const [mobileView] = isMobile();

  useEffect(() => {
    handleDelteAcc();
  }, []);

  const handleDelteAcc = async () => {
    startLoader();
    try {
      let verificationToken = query.token;
      // console.log(">", verificationToken)
      const response = await deleteUser(verificationToken);

      if (response) {
        {
          mobileView
            ? open_drawer("DeleteUser", {}, "bottom")
            : open_dialog("DeleteUser", {});
        }

        setTimeout(() => {
          Router.push("/");
        }, 2000);
      }
      stopLoader();
      setValidGuest(true);

    } catch (e) {
      stopLoader();
      console.error("ERROR IN handleDelteAcc", e)
      Toast(e?.response?.data?.message, "error");

      setTimeout(() => {
        Router.push("/");
      }, 2000)
    }
  };


  const { tab = "timeline" } = query;
  const [activeNavigationTab, setActiveNavigationTab] = useState(tab);

  return (
    <RouterContext forLogin={true} forUser={true} forCreator={true} forAgency={true} {...props}>
    <div className="mv_wrap_home">
      {activeNavigationTab === "timeline" && <HomePage />}
    </div>
    </RouterContext>
  );
}

DeleteAccount.getInitialProps = async ({ ctx }) => {
  let { query = {}, req, res } = ctx;
  return { query: query };
};

export default DeleteAccount;
