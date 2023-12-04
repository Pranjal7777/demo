import React from "react";
import Wrapper from "../../hoc/Wrapper";
import useLang from "../../hooks/language";
import isMobile from "../../hooks/isMobile";

import {
  backNavMenu,
  open_drawer,
  startLoader,
  stopLoader,
} from "../../lib/global";
import { getReasons } from "../../services/auth";
import { useTheme } from "react-jss";
import Button from "../button/button";

export default function DeactivateAcc(props) {
  const [lang] = useLang();
  const theme = useTheme();
  const [mobileView] = isMobile();

  const GetDeactivateReasons = async () => {
    startLoader();
    try {
      let reasonType = 3; // 3 -> delete userAccount
      const response = await getReasons(reasonType);
      if (response.status == 200) {
        stopLoader();
        let arr = response && response.data && response.data.data;
        open_drawer("DeactivateReasons", { reasons: arr }, "right");
      }
    } catch (e) {
      stopLoader();
      Toast(e.response.data.message, "error");
    }
  };

  return (
    <Wrapper>
      <div className="btmModal">
        <div className="modal-dialog">
          <div
            className={`
             ${
               mobileView ? "modal-content-mobile" : "modal-content"
             } pt-4 pb-4`}
          >
            <div className="col-12 w-330 mx-auto">
              <h5
                className={`mb-0 fntSz22 pb-2 maxWidth70 ${
                  mobileView
                    ? `${
                        theme.type == "light"
                          ? "confirmTextMobileLight"
                          : "confirmTextMobileDark"
                      }`
                    : "confirmTextWeb"
                }`}
              >
                {lang.deactivateHeading}
              </h5>
              <div
                className={`fntSz12 ${
                  mobileView
                    ? `${
                        theme.type == "light"
                          ? "bse_dark_text_clr_mobile_light"
                          : "bse_dark_text_clr_mobile_dark"
                      }`
                    : "bse_dark_text_clr"
                } mb-3 maxWidth70 `}
              >
                {lang.deactivateMsg}
              </div>
              <div className="d-flex pt-3 align-items-center justify-content-between">
                <div className="col-6">
                  <button
                    type="button"
                    className="btn btn-default greyBorderBtn"
                    data-dismiss="modal"
                    data-toggle="modal"
                    onClick={() => GetDeactivateReasons()}
                  >
                    {lang.confirm}
                  </button>
                </div>
                <div className="col-6">
                  <Button
                    type="button"
                    cssStyles={theme.blueButton}
                    onClick={() => backNavMenu(props)}
                  >
                    {lang.cancel}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>
        {`
          .maxWidth70 {
            max-width: 70%;
          }
        `}
      </style>
    </Wrapper>
  );
}
