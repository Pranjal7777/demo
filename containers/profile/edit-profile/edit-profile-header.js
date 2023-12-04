import React from "react";

import useLang from "../../../hooks/language";
import * as config from "../../../lib/config";
import { goBack } from "../../../lib/global";
import FigureImage from "../../../components/image/figure-image";
import { useTheme } from "react-jss";
import Icon from "../../../components/image/icon";
import isMobile from "../../../hooks/isMobile";

export default function Header(props) {
  const [lang] = useLang();
  const theme = useTheme();
  const [mobileView] = isMobile();

  return (
    <>
      <div className="row nav-header justify-content-between align-items-center py-3">
        <div className="col-auto">
          {/* <FigureImage
            fclassname="mb-0"
            src={config.backArrow}
            width={22}
            alt="backArrow"
            onClick={() => {
              props.back ? props.back?.() : goBack();
            }}
          /> */}
          <Icon
            icon={`${config.backArrow}#left_back_arrow`}
            color={theme.type === "light" ? "#000" : "#fff"}
            width={22}
            height={30}
            onClick={() => {
              props.back ? props.back?.() : goBack();
            }}
            alt="backArrow"
          />
        </div>
        <div
          className={`col-auto txt-heavy fntSz18 ${
            mobileView
              ? theme.type == "light"
                ? "text-black"
                : "text-white"
              : "text-black"
          }`}
        >
          {props.title}
        </div>
        {props.saveButton ? (
          <div className="col-auto txt-heavy fntSz17">
            <a type="submit" className="" onClick={props.onSave}>
              {lang.save}
            </a>
          </div>
        ) : (
          <div className="col-auto txt-heavy fntSz18"></div>
        )}

        <style jsx>{`
          .nav-header {
            position: fixed;
            top: 0;
            z-index: 12;
            background-color: ${theme.type == "light"
              ? theme.palette.l_app_bg
              : theme.palette.d_app_bg};
            width: 100%;
            height: 49px !important;
          }
        `}</style>
      </div>
      <div style={{ height: "49px" }}></div>
    </>
  );
}
