import React, { useEffect, useState } from "react";
import InfoIcon from "@material-ui/icons/Info";
import HelpOutlineOutlinedIcon from "@material-ui/icons/HelpOutlineOutlined";
import Fade from "react-reveal/Fade";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import isMobile from "../../hooks/isMobile";
import Icon from "../image/icon";
import { INFO_OUTLINE_RED } from "../../lib/config";
const Error = (props) => {
  const { errorMessage, className, errorIocnClass } = props;
  const [mobileView] = isMobile();
  const [show, toggle] = useState(true);
  useEffect(() => {
    // console.log("use effectcaled");
    toggle(true);
    setTimeout(() => {
      toggle(false);
    }, 2000);
  }, [errorMessage]);


  return (

    <>
      <div className={`error-tooltip-container ${errorIocnClass}`} style={(props.typeCheck === "email" || props.typeCheck === "username" || props.typeCheck === "firstname" || props.typeCheck === "lastname" || props.typeCheck === "phoneNumber" || props.name === "refCode" || props.typeCheck === "frgP_email_usr") ? { right: "0" } : props.type === "password" ? { position: "absolute", top: "16px", right: "-30px" } : props.name === "password" || props.name === "confirmPassword" ? { top: "70%", right: "5%" } : {}}>
        <div>
          <ClickAwayListener onClickAway={() => toggle(false)}>
            <Icon
              height={20}
              width={20}
              size={20}
              alt="Alter Icon"
              onClick={() => toggle(!show)}
              class="cursorPtr"
              viewBox="0 0 20 20"
              icon={`${INFO_OUTLINE_RED}#info_outline_7`}
            />
          </ClickAwayListener>
        </div>
      </div>
      <Fade when={show}>
        {show && <div className={`error-tooltip ${className}`} style={(props.switchToUser === "CREATOR" && props.typeCheck === "username" || props.typeCheck === "firstname" || props.typeCheck === "lastname" || props.typeCheck === "phoneNumber" || props.name === "refCode") ? { right: "7%" } : props.type === "phoneNumber" ? { right: "-11px" } : props.name === "password" || props.name === "confirmPassword" ? { right: "8%" } : props.typeCheck === "email" || (props.switchToUser === "USER" && props.typeCheck === "username" || props.name === "refCode") ? { right: "3%" } : props.typeCheck === "frgP_email_usr" ? { right: "6%" } : {}}>{errorMessage}</div>}
      </Fade>{" "}
      <style>{`
          .error-tooltip::before{
            top:-15px!important;
          }
      `}</style>
    </>
  );
};

export default Error;
