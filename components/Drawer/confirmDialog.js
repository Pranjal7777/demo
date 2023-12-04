import React from "react";
import Wrapper from "../../hoc/Wrapper";
import isMobile from "../../hooks/isMobile";
import useLang from "../../hooks/language";
import Button from "../button/button";
import { close_dialog } from "../../lib/global";
import { CLOSE_ICON_WHITE } from "../../lib/config/logo";
import Icon from "../image/icon";

export default function ConfirmDialog(props) {
  const [lang] = useLang();
  const { title, subtitle, btn_class, cancelT, submitT, noHandler, onClose, showCancel=true } = props;
  // console.log("btn_class", btn_class);
  const [mobileView] = isMobile();

  const handleClose = () => {
    props?.no && props?.no();
    noHandler?.();
    onClose();
  }

  return (
    <Wrapper>
      <div
        className={"py-4 px-0 px-sm-5 text-center"}
      >
        <div className="text-right">
          <Icon
            icon={`${CLOSE_ICON_WHITE}#close-white`}
            color={"var(--l_app_text)"}
            size={16}
            onClick={() => props.onClose()}
            alt="back_arrow"
            class="cursorPtr px-3"
            viewBox="0 0 16 16"
          />
        </div>
        <div className="col-12 px-4 pt-1">
          <h5 className="w-700">
            {title}
          </h5>
          <p className="light_app_text">{subtitle}</p>
          <div
            className={
              mobileView
                ? "row pt-4 align-items-center justify-content-between"
                : "row align-items-center justify-content-between"
            }
          >
            <div className="col-6">
              {showCancel ? <Button
                type="button"
                fclassname="background_none rounded-pill borderStroke text-app"
                data-dismiss="modal"
                data-toggle="modal"
                onClick={handleClose}
              >
                {cancelT || lang.no}
              </Button> : ""}
            </div>
            <div className={showCancel ? "col-6" : "col-12"}>
              <Button
                type="button"
                fclassname={`rounded-pill ${btn_class ? btn_class : "btnGradient_bg"}`}
                onClick={(e) => {
                  props.yes && props.yes();
                  mobileView ? props.onClose() : close_dialog();
                }}
              >
                {submitT || lang.yes}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
