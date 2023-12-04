import React from "react";
import { WHITE, PRIMARY, color5 } from "../../../lib/config";
import DialogButton from "../dialogButton/dialogButton";

const CButton = (props) => {
  return (
    <DialogButton
      fontSize="0.8rem"
      classes={`cbutton  ${props.className || ""}`}
      {...props}
    >
      {props.title}
      <style jsx>{`
        :global(.cborder) {
          border: 1px solid ${PRIMARY} !important;
          background-color: ${WHITE} !important;
          color: ${PRIMARY} !important;
        }
        :global(.cfill) {
          border: 1px solid ${PRIMARY} !important;
          background-color: ${PRIMARY} !important;
          color: ${WHITE} !important;
        }
        :global(.cbutton) {
          box-shadow: 0px 3px 6px ${color5};
          margin: 0px 13px;
          border-radius: 2px !important;
          height: 36px;
          width: 140px;
        }
      `}</style>
    </DialogButton>
  );
};
const ConfirmDailog = (props) => {
  let { dialogTitle, title1, title2, b1Text, b2Text, onClose, b2Click } = props;

  return (
    <div className={`dialog-body-wrapper w-100`}>
      <div className="confirm-header">{dialogTitle || "Confim"}</div>
      <div className="text-center w-600 pt-3 text-color-blue ">
        <div>{title1 || "Are you sure you want to withdraw"}</div>
        {title2 && (
          <div className="website-link">{title2 || "the money ?"}</div>
        )}
      </div>
      <div className="my-4">
        <div className="row m-0 text-center justify-content-center px-3">
          <CButton
            title={b1Text || "Cancel"}
            clickHandler={props.b1Click ? b1Click : onClose}
            className="cborder m-0 mr-1"
          />
          <CButton
            title={b2Text || "Yes"}
            className="cfill m-0 ml-1"
            clickHandler={b2Click ? b2Click : () => { }}
          />
        </div>
      </div>
      <style jsx>{`
        .dialog-body-wrapper {
          width: 100% !important;
        }
        .font-large {
          font-size: 1.05rem;
        }
        .confirm-header {
          border-top-left-radius: 6px;
          border-top-right-radius: 6px;
          font-size: 1.1rem;
          height: 50px;
          color: ${WHITE};
          background-color: ${PRIMARY};
          display: flex;
          justify-content: center;
          align-items: center;
          border-top-left-radius: 5px;
        }
      `}</style>
    </div>
  );
};

export default ConfirmDailog;
