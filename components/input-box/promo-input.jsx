import React from "react";
import useLang from "../../hooks/language";
import Button from "../button/button";
import { useTheme } from "react-jss";

const PromoInput = (props) => {
  const theme = useTheme();

  // Updated By Bhavleen on April 7th
  const [lang] = useLang();
  const {
    handleChange,
    applyBtn,
    removeBtn,
    handleApplyPromo,
    disabled,
    isMobile,
    ...other
  } = props;
  return (
    <>
      <div className="d-flex promo_inp_cont">
        <input
          type="text"
          className="form-control promo_input"
          id="promo_code"
          autoComplete="off"
          placeholder="Have a promocode?"
          onChange={(e) => {
            handleChange?.(e.target.value);
          }}
          disabled={removeBtn || false}
          {...other}
        />
        {applyBtn && (
          <Button
            onClick={() => handleApplyPromo(true)}
            fclassname="apply_btn"
            cssStyles={theme.blueButton}
          >
            {lang.apply}
          </Button>
        )}
        {removeBtn && (
          <p
            onClick={() => handleApplyPromo(false)}
            className="m-auto text-muted cursorPtr"
          >
            {lang.remove}
          </p>
        )}
      </div>
      <style>{`
            .promo_input {
                background: transparent !important;
                border: none;
                font-family: 'Roboto';
                color: ${isMobile ? "white" : "black"} !important;
            }
            .apply_btn, .apply_btn:hover, .apply_btn:focus{
                padding: 0 !important;
                width: 117px !important;
                border-radius: 10px !important;
                color: white;
            }
            .promo_inp_cont{
                border: 1px dashed #2689f4;
                border-radius: 10px;
                padding: 4px;
            }
            .promo_input:focus{
                border-bottom: none !important;
            }
            @media all and (min-width: 768px){
                .promo_input:focus{
                    border-bottom: none !important;
                }
            }

        `}</style>
    </>
  );
};

export default PromoInput;
