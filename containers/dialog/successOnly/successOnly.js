import React from "react";
import Img from "../../../components/ui/Img/Img";
import {
  CHECK,
  DIALOG_CLOSE1,
  ERROR,
} from "../../../lib/config";
import Button from "../../../components/ui/dialogButton/dialogButton";
import isMobile from "../../../hooks/isMobile"

const SuccessOnly = (props) => {
  const [mobileView] = isMobile();

  return (
    <div
      className={`
      ${props.dialogClick && "cursorPtr"} 
      ${mobileView ? "success-drawer" : "success-dialogs"}
      `}
      onClick={(e) => {
        if (props.dialogClick) {
          props.dialogClick();
          props.onClose();
        }
      }}>
      {!props.disable && (
        <div onClick={props.onClose}>
          <Img
            src={DIALOG_CLOSE1}
            className="view-dialog-close" alt="Dialog Close Icon" />
        </div>
      )}
      <div className="d-flex flex-column align-items-center">
        <Img
          src={props.image || props.wraning ? ERROR : CHECK}
          className="check-icon" alt="check icon"
        />
        <div
          className={`payment-successfull ${props.lableClass}`}>
          {props.label}
          {props.label1 && (
            <div className={`mt-0 ${props.lableClass}`}>
              {props.label1}
            </div>
          )}
        </div>
        {props.button &&
          props.button.map((button, index) => {
            return (
              <Button
                classes={`success-dialog-button bg-color-primary button-shadow ${button.class}`}
                key={index}
                clickHandler={button.onClick}>
                {button.text}
              </Button>
            );
          })}
      </div>
      <style jsx>{`
        :global(.success-dialog-button) {
          font-size: 0.7rem;
          width: 104px;
          padding: 7px;
          margin-top: 12px;
          color: white;
        }
        :global(.view-dialog-close) {
          position: absolute;
          height: 33px;
          right: 10px;
          cursor: pointer;
          z-index: 2;
          top: 10px;
        }
        .payment-successfull {
          margin-top: 15px;
          text-align: center;
          padding: 0px 10px;
          font-size: 0.9rem;
          font-weight: 600;
        }
        .success-drawer {
          height: 200px;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 280px;
          max-width: 280px;
        }
        .success-dialogs {
          height: 200px;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 415px;
          // max-width: 280px;
        }
        :global(.check-icon) {
          width: 79px;
        }
      `}</style>
    </div>
  );
};

export default SuccessOnly;
