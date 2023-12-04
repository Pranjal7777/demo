import React, { useState } from "react";
import Button from "../dialogButton/dialogButton";

const RecoverWarningDialog = (props) => {
  let [loader, setLoader] = useState(false);
  return (
    <div className="p-4 warning-dailog card_bg">
      <div className="text-center dialog-title text-app">{props.subTitle}</div>
      <div className="d-flex justify-content-center mt-4 dialog-button">
        {props.button &&
          props.button.map((Item, index) => {
            return (
              <Button
                key={index}
                classes={`bg-color-primary text-color-white py-2 m-3 button-shadow responsiveBtn ${Item.class || ""
                  }`}
                disabled={Item.loader ? loader : false}
                clickHandler={() => {
                  setLoader(true);
                  Item.onClick();
                }}
                fontSize="0.9rem"
                radius="5px"
              >
                {Item.text}
              </Button>
            );
          })}
      </div>

      <style jsx>{`
        .dialog-title {
          font-size: 0.9rem;
          font-weight: 500;
          line-height: 25px;
        }
        .warning-dailog {
          max-width: 450px;
        }

        :global(.responsiveBtn) {
          padding: 10px 15px !important;
          min-width: 110px !important;
        }
        @media only screen and (max-width: 767px) {
          :global(.responsiveBtn) {
            padding: 10px 15px !important;
            min-width: 110px !important;
          }
        }
      `}</style>
    </div>
  );
};
export default RecoverWarningDialog;
