import React from "react";
import Wrapper from "../../hoc/Wrapper";
import isMobile from "../../hooks/isMobile";
import useLang from "../../hooks/language";
import { useTheme } from "react-jss";
import Button from "../button/button";
import { close_dialog, close_drawer } from "../../lib/global";

export default function DeleteCardConfirm(props) {
  const theme = useTheme();
  const [lang] = useLang();
  const { handleDeleteCard, selectedCard, title, index } = props;
  const [mobileView] = isMobile();

  const closeDialog = () => {
    props?.onClose();
    mobileView ? close_drawer("confirmDeleteAddress") : close_dialog("confirmDeleteAddress")
  }

  return (
    <Wrapper>
      <div className="btmModal">
        <div className="modal-dialog">
          <div
            className={`${mobileView ? "modal-content-mobile" : "modal-content"
              } pt-4 pb-4`}
          >
            <div className="col-12 w-330 mx-auto">
              <h5
                className={
                  mobileView
                    ? `mb-0 ${theme.type == "light"
                      ? "confirmTextMobileLight"
                      : "confirmTextMobileDark"
                    } fntSz22 pb-2`
                    : "dialogTextColor confirmTextWeb px-1 py-3 m-0 text-center"
                }
              >
                {title}
              </h5>
              <div className="d-flex pt-3 align-items-center justify-content-between">
                <div className="col-6">
                  <Button
                    type="button"
                    fixedBtnClass={"inactive"}
                    data-dismiss="modal"
                    data-toggle="modal"
                    onClick={() => handleDeleteCard(selectedCard, index)}
                  >
                    {lang.confirm}
                  </Button>
                </div>
                <div className="col-6">
                  <Button
                    type="button"
                    // fclassname={
                    //   mobileView ? "" : "btn btn-default dv__blueBgBtn"
                    // }
                    fixedBtnClass={"active"}
                    onClick={() => closeDialog()}
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
