//library import
import React from "react";
import useLang from "../../../hooks/language";
const DialogButton = (props) => {
  const click = props.clickHandler ? props.clickHandler : () => {};
  const [lang] = useLang();
  return (
    <button
      type={props.type ? props.type : "button"}
      onClick={click}
      className={`props dialog-btn  ${props.classes}`}
      disabled={
        props.isLoading
          ? true
          : typeof props.disabled != "undefined"
          ? props.disabled
          : false
      }
      style={{
        height: props.height,
        width: props.width,
        color: props.color || "default ",
        borderRadius: props.radius || "5px",
        cursor: "pointer",
        fontSize: props.fontSize || "0.85rem",
        padding: props.padding || "",
      }}
    >
      {props.isLoading ? (
        <React.Fragment>
          <i className="fa fa-circle-o-notch fa-spin"></i>&emsp;
          {props.loaderText
            ? props.loaderText
            : props.loaderText == " "
            ? ""
            : lang.loading}
        </React.Fragment>
      ) : (
        props.children
      )}
    </button>
  );
};

export default DialogButton;
