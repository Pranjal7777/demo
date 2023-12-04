import React from "react";
import isMobile from "../../hooks/isMobile";

export default function List(props) {
  const [mobileView] = isMobile();

  return (
    <div
      className={
        props.sideMenu
          ? "col-auto px-2 d-flex flex-column"
          : `col-auto pr-2 d-flex ${!mobileView && "flex-column"} align-items-start ${props.managePadding && "managePadding"} ${props.className} ${props.title == "Posts" ? "" : !props.otherProfile ? "cursorPtr" : ""}`
      }
      onClick={props.onClick}
    >
      <div
        className={
          mobileView
            ? props.sideMenu
              ? "txt-roboto countValue white"
              : "txt-roboto fntSz15 pr-1 fntClrTheme"
            : "fntClrTheme dv__fnt18 w-600"
        }
      >
        {props.count}
      </div>
      <div className={mobileView ? !props.sideMenu ? "strong_app_text" : "followText_clr" : ""}>
        {props.title}
      </div>
    </div>
  );
}
