import React, { useState } from "react";
import * as env from "../../../lib/config";
import Img from "../../../components/ui/Img/Img";

const DialogBodyWrapper = (props) => {
  return (
    <div
      className={`dialog-body-wrapper  w-100 ${
        props.className && props.className
      }`}
    >
      <div className="dialog-body-header ">
        {props.onClose && (
          <div onClick={props.onClose}>
            <Img src={env.DIALOG_CLOSE1} className="view-dialog-close"></Img>
          </div>
        )}
        <div className={`like-view-header ${props.titleClass}`}>
          {props.title}
        </div>
      </div>
      {props.children}
      <style jsx>{`
        .like-view-header {
          border-top-left-radius: 6px;
          font-size: 1.1rem;
          height: 50px;
          color: ${env.WHITE};
          background-color: ${env.PRIMARY};
          display: flex;
          justify-content: center;
          align-items: center;
          border-top-left-radius: 5px;
        }
        :global(.view-dialog-close) {
          position: absolute;
          height: 33px;
          right: 5px;
          cursor: pointer;
          z-index: 3;
          top: 8px;
        }
      `}</style>
    </div>
  );
};

export default DialogBodyWrapper;
