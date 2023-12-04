import React from "react";
import Wrapper from "../../hoc/Wrapper";
import isMobile from "../../hooks/isMobile";
import useLang from "../../hooks/language";
import { backNavMenu, close_drawer, goBack, signOut } from "../../lib/global";
import { useTheme } from "react-jss";
import Button from "../button/button";

export default function DeletePost(props) {
  const theme = useTheme();
  const [lang] = useLang();
  const [mobileView] = isMobile();

  return (
    <Wrapper>
      <div className="btmModal">
        <div className="modal-dialog">
          <div className="modal-content pt-4 pb-4">
            <div
              className={
                mobileView
                  ? "col-12 w-330 mx-auto"
                  : "col-11 mx-auto text-center"
              }
            >
              <h5
                className={
                  mobileView
                    ? "mb-0 fntSz22 pb-2"
                    : "dv__fnt24 mb-0 pb-2 mx-auto text-app"
                }
              >
                {lang.deletePostHeading}
              </h5>
              <div
                className={
                  mobileView
                    ? "fntSz12 bse_dark_text_clr mb-3"
                    : "dv__fnt14 txt-roman text-app"
                }
              >
                {lang.deletePostDescription}
              </div>
              <div className="d-flex pt-3 align-items-center justify-content-between">
                <div className="col-6">
                  <button
                    type="button"
                    className="btn btn-default greyBorderBtn"
                    data-dismiss="modal"
                    data-toggle="modal"
                    onClick={async () => {
                      await props.postDelete(props.id);
                      props.back();
                    }}
                  >
                    {lang.yes}
                  </button>
                </div>
                <div className="col-6">
                  <Button
                    type="button"
                    cssStyles={theme.blueButton}
                    onClick={() => props.back()}
                  >
                    {lang.cancel}
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
