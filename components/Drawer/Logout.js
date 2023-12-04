import React from "react";
import Wrapper from "../../hoc/Wrapper";
import useLang from "../../hooks/language";
import isMobile from "../../hooks/isMobile";

import { backNavMenu, signOut } from "../../lib/global";
import { useTheme } from "react-jss";
import Button from "../button/button";
import { getCookie } from "../../lib/session";
import { useSelector } from "react-redux";

export default function Logout(props) {
  const [lang] = useLang();
  const theme = useTheme();
  const [mobileView] = isMobile();
  const userType = getCookie("userType");
  return (
    <Wrapper>
      <div className="btmModal">
        <div className="modal-dialog rounded">
          <div
            className={`${mobileView ? "modal-content-mobile" : "modal-content"
              } p-4`}
          >
            <div>
              <h3
                className={`fntSz22 pb-2 bold text-center ${mobileView
                  ? `${theme.type == "light"
                    ? "confirmTextMobileLight"
                    : "confirmTextMobileDark"
                  }`
                  : "confirmTextWeb"
                  }`}
              >
                {lang.logoutHeading}
              </h3>
              <div
                className="fntSz16 mb-3 text-center"
                style={{ color: theme.palette.l_light_grey1 }}
              >
                {lang.logoutMsg}
              </div>
              <div className="d-flex pt-3 align-items-center justify-content-between">
                <div className="col-6">
                  <Button
                    type="button"
                    fixedBtnClass={"inactive"}
                    data-dismiss="modal"
                    data-toggle="modal"
                    onClick={() => signOut(userType !== "3", userType === "3")}
                  >
                    {lang.yes}
                  </Button>
                </div>
                <div className="col-6">
                  <Button
                    type="button"
                    fixedBtnClass={"active"}
                    onClick={() => backNavMenu(props)}
                  >
                    {lang.no}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
