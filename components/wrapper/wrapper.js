import React from "react";

const Wrapper = ({ children }) => {
  return (
    // <div className="wrap">
    <div className="scr wrap-scr dynamicHeightForIos">{children}</div>
    // </div>
  );
};
export default Wrapper;
