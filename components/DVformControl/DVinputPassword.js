import React, { useState } from "react";
import { passwordHideBlack, eye_grey } from "../../lib/config/logo";
import Error from "../error/error";
import Icon from "../image/icon";
import { useTheme } from "react-jss";
import Button from "../button/button";

const DVInputPassword = ({ className, errorIocnClass, inicatorClass, showBtn = false, btnOnClick, ...props }, ref) => {
  const [visible, setVisible] = useState(false);
  const { error, labelTitle, id, type, disabledField, disabled = true } = props;
  const theme = useTheme();

  return (
    <div className="form-group">
      <div className="position-relative">
        {
          labelTitle && <label className={`label__title mb-1 ${props.labelClass}`} for={id}>{labelTitle}<span className="">{props.name === "password" && " *"}</span></label>
        }
        <input
          ref={ref}
          type={visible ? "text" : "password"}
          className={`form-control ${error &&
            // "input-error-error"
            "dv_form_control"
            } form-control ${className || ""}`}
          {...props}
          maxLength="30"
          onBlur={props.onBlur}
          onFocus={props.onFocus}
          autoComplete="off"
          disabled={disabledField}
        />
        <div onClick={() => setVisible(!visible)} className="dv_setRgtPosAbs">
          {!visible
            ?
            <Icon
              icon={`${passwordHideBlack}#invisible`}
              color={props.isAgency
                ? "#979797"
                : "var(--l_light_grey)"
              }
              size={20}
              viewBox="0 0 14.153 10.566"
            />
            :
            <Icon
              icon={`${eye_grey}#passVisibleGery`}
              color={props.isAgency
                ? "#979797"
                : "var(--l_light_grey)"
              }
              size={20}
              viewBox="0 0 14.153 10.566"
            />
          }
        </div>
        {error && <Error className={inicatorClass} errorIocnClass={errorIocnClass} errorMessage={error} name={props.name} />}
      </div>
      {showBtn && <div className="mt-5">
        <Button
          type="submit"
          disabled={disabled}
          onClick={btnOnClick}
          fclassname="btnGradient_bg rounded-pill"
          cssStyles={theme.blueButton}
        >
          {props.btnName || "Done"}
        </Button>
      </div>}
      <style jsx>{`
        :global(.dv_setRgtPosAbs){
          top:${(props.name === "password" || props.name === "confirmPassword") && "70%!important"};
        }
      `}</style>
    </div>
  );
};

export default React.forwardRef(DVInputPassword);
