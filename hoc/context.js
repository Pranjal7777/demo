import React from "react";
import Context from "../context/context";

const ContextHoc = (CustomComponet) => {
  return class dialogHanlder extends React.Component {
    render() {
      // console.log("dialog wrapper props", this.props);

      return (
        <Context.Consumer>
          {(context) => {
            return (
              <CustomComponet {...context} {...this.props}></CustomComponet>
            );
          }}
        </Context.Consumer>
      );
    }
  };
};
export default ContextHoc;
