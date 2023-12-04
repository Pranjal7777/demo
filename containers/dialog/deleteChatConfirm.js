import React from "react";
import Wrapper from "../../hoc/Wrapper";
import { useTheme } from "react-jss";
import Button from "../../components/button/button";

const DeleteChatConfirmation = (props) => {
  const theme = useTheme();

  return (
    <Wrapper>
      <div className="py-3 px-5">
        <div className="text-center pb-3">
          <h5 className="txt-black dv__fnt34">{props.dialogTitle}</h5>
          <h6 className="dv_appTxtClr dv__fnt20">{props.title1}</h6>
          {props.title2 && (
            <h6 className="dv_appTxtClr dv__fnt20">{props.title2}</h6>
          )}
        </div>

        <div className="row align-items-center justify-content-between">
          <div className="col-6">
            <button
              type="button"
              className="btn btn-default greyBorderBtn"
              data-dismiss="modal"
              data-toggle="modal"
              onClick={props.onClose}
            >
              {props.b1Text || lang.no}
            </button>
          </div>
          <div className="col-6">
            <Button
              type="button"
              // fclassname={`${props.dangerBtn ? "dangerBgBtn" : ""}`}
              cssStyles={theme.blueButton}
              onClick={(e) => {
                props.b2Click && props.b2Click();
                props.onClose();
              }}
            >
              {props.b2Text || lang.yes}
            </Button>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default DeleteChatConfirmation;
