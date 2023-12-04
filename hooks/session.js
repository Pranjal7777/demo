import React, { useCallback, useEffect } from "react";
import { clearAll, drawerToast, guestLogin } from "../lib/global";
import { sessionExpire } from "../lib/rxSubject";
import useLang from "./language";

const useSessionExpire = ({ lang }) => {
  useEffect(() => {
    const sessionObj = sessionExpire.subscribe(() => {
      drawerToast({
        closeIconVisible: false,
        drawerClick: () => {},
        disableBackdropClick: true,
        title: lang.sessionExpiredTitlte,
        desc: lang.sessionExpired,
        button: {
          text: lang.btnLogin,
          onClick: (e) => {
            clearAll();
            guestLogin();
            window.location = "/login";
          },
        },
      });
    }, []);
    return () => {
      sessionObj.unsubscribe();
    };
  }, []);
  return [];
};

export default useSessionExpire;
