import React, { useEffect } from "react";
import Image from "../../../components/image/image";
import isMobile from "../../../hooks/isMobile";
import { DRAWER_CLOSE, DRAWER_TOASTER_TIME } from "../../../lib/config";
import { useTheme } from "react-jss";
import Button from "../../../components/button/button";
import Icon from "../../../components/image/icon";
import { CLOSE_ICON_WHITE, DONE_ICON } from "../../../lib/config/logo";

const ToasterDrawer = (props) => {
  const theme = useTheme();
  const {
    onClose,
    drawerClick,
    button = {},
    title,
    desc,
    titleClass = "",
    closeIconVisible = true,
    closing_time,
    noClass,
    disableContactUsBtn = false,
    classForPayementsUi = ""
  } = props;
  const { text, onClick } = button;
  const [mobileView] = isMobile();

  useEffect(() => {
    props.autoClose &&
      setTimeout(() => {
        onClose();
      }, closing_time || DRAWER_TOASTER_TIME);
  });
  return (
    <div
      onClick={drawerClick ? drawerClick : onClose}
      // className="btmModal rounded"
      className={`rounded${noClass ? " txt-roman bold" : " btmModal"}`}
    >
      <div
        className={
          mobileView ? "modal-dialog text-center" : "modal-dialog text-center rounded"
        }
      >
        <div
          className={`${mobileView ? "modal-content-mobile" : "modal-content"
            } pt-4 pb-4`}
          id="signInContent"
        >
          <div className="col-12 w-330 mx-auto">
            {mobileView && closeIconVisible && (
              <figure className="text-right">
                <Icon
                  icon={`${CLOSE_ICON_WHITE}#close-white`}
                  color={"var(--l_app_text)"}
                  size={16}
                  onClick={() => props.onClose()}
                  alt="back_arrow"
                  class="cursorPtr px-2"
                  viewBox="0 0 16 16"
                />
              </figure>
            )}
            <div>
              {props.icon ? (
                <Image
                src={props.icon}
                width={84}
                height={84}
                className=""
              />
              ) : (

                <Image
                  src={DONE_ICON}
                  width={84}
                  height={84}
                  className="my-3"
                />
              )}
            </div>
{/* 
            {mobileView && closeIconVisible && (
              <figure style={{ position: "absolute", right: "20px", bottom: props.logoutBtnOnTop ? null : "64px" }}>
                <Icon
                  // onClick={drawerClick ? drawerClick : onClose}
                  icon={`${DRAWER_CLOSE}#logout-4`}
                  alt="close button"
                  viewBox="0 0 16.725 16.669"
                  size={20}
                  class="mb-1"

                />
              </figure>
            )} */}

            {title && (
              <h5
                className={`mb-3 ${titleClass} text-app`}
              >
                {title}
              </h5>
            )}
            {desc && (
              <div
                className={`txt-book fntSz16 text-app ${classForPayementsUi?.length ? classForPayementsUi : "mb-4"}`}
              >
                {desc}
              </div>
            )}
            {/* {text && isEmpty(button) && ( */}
            {!disableContactUsBtn && text && (
              <Button
                onClick={
                  onClick
                    ? (e, ...resc) => {
                      e && e.stopPropagation();
                      onClick();
                      onClose();
                    }
                    : () => {
                      onClose();
                    }
                }
                type="button"
                fclassname="btnGradient_bg rounded-pill"
                id="crtr_login_signup_modal3"
              >
                {text}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToasterDrawer;
