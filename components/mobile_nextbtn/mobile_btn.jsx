import React from "react";
import _JSXStyle from "styled-jsx/style";
import Image from "../image/image";

// imported Components
import { MOBILE_NEXTARROW } from "../../lib/config";

let next_arrow = {
  background: "#aeaec5",
  position: "absolute",
  right: "25px",
  bottom: "25px",
  padding: "20px 15px",
  borderRadius: "60px",
};

let next_arrow_active = {
  background: "#3a3abf",
  position: "absolute",
  right: "25px",
  bottom: "25px",
  padding: "20px 15px",
  borderRadius: "60px",
};

class LoginSelectionMobile extends React.Component {
  render() {
    return (
      <div>
        <Image
          alt="mobile-next-arrow"
          src={MOBILE_NEXTARROW}
          style={
            this.props.disable ? { ...next_arrow_active } : { ...next_arrow }
          }
          onClick={this.props.onClick}
        />
      </div>
    );
  }
}

export default LoginSelectionMobile;
