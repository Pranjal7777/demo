import React from "react";
import { P_CLOSE_ICONS } from "../../lib/config";
import Image from "../image/image";
import Router from "next/router";
import Wrapper from "../../hoc/Wrapper";
const Header = (props) => {
  const {
    icon = P_CLOSE_ICONS,
    closeTrigger,
    back,
    title = "",
    subtitle = "",
  } = props;

  React.useEffect(() => {
    props.right && props.right();
  }, []);
  return (
    <Wrapper>
      <div className="global-nav-header-shoutout" id={props.id || "nav-bar"}>
        {props.children}
        <div className="row d-flex justify-content-between pt-3 mb-3">
          <div className="col-2 pl-4 d-flex">
            <Image
              src={props.icon ? props.icon : P_CLOSE_ICONS}
              onClick={() => {
                closeTrigger && closeTrigger();
                back ? back() : Router.back();
              }}
              width="20"
              alt="close_icon"
              style={{ marginBottom: "4px" }}
            />
          </div>
          <div className="col text-center txt-heavy">
            <p className="m-0 fntSz14">{title}</p>
            {subtitle && <p className="m-0 w-400 fntSz15 text-muted">{subtitle}</p>}
          </div>
          <div
            className={
              props.right
                ? "col-2 p-0 text-center txt-heavy fntSz18 mr-3 pointer"
                : "col-2 p-0 text-center"
            }
          >
            <div className="w_40">{props.right ? props.right() : ""}</div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};
export default Header;
