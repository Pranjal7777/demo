import React from "react";
import Router from "next/router";
import Wrapper from "../../hoc/Wrapper";
import { CLOSE_ICON_WHITE } from "../../lib/config/logo";
import Icon from "../image/icon";
const CustomHeader = (props) => {
  const { children, className, back, size, icon, iconColor, ...other } = props;
  return (
    <Wrapper>
      <div className={`col-12 trans-global-nav-header px-0 ${className ? className : ''}`}>
        <div className="d-flex pt-3 mb-3 align-items-center justify-content-between">
          {children}
          <div className="col-auto px-2">
            <Icon
              icon={CLOSE_ICON_WHITE + "#close-white"}
              onClick={() => {
                back ? back() : Router.back();
              }}
              color={iconColor || "var(--l_app_text)"}
              size={size || 20}
              class="pointer"
              alt="close_icon"
            />
          </div>
        </div>
      </div>
    </Wrapper>
  );
};
export default CustomHeader;
