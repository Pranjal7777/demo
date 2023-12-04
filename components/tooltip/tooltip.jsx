import React from "react";
import ReactTooltip from "react-tooltip";

import Wrapper from "../../hoc/Wrapper";

// Generate Tooltips Using Component
export default function SimpleTooltips(props) {
  return (
    <Wrapper>
      <ReactTooltip />
      {/* // returning the same children, with tooltip initialization */}
      {props.children}
    </Wrapper>
  );
}
