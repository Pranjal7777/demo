import React, { useState } from "react";
import { useTheme } from "react-jss";

import isMobile from "../../hooks/isMobile";
import {
  eye,
  hidePassword,
  eye_grey,
  hidePassword_grey,
} from "../../lib/config";
import Error from "../error/error";
import Icon from "../image/icon";
import InputBox from "../input-box/input-box";

// phone input password
const InputPassword = ({ className, isAgency, ...props }, ref) => {
  const [visible, setVisible] = useState(false);
  const { error } = props;
  const [mobileView] = isMobile();
  const theme = useTheme();
  return (
    <div className="form-group position-relative">
      <div>
        <InputBox
          ref={ref}
          type={visible ? "text" : "password"}
          fclassname={`form-control ${error && "input-error-error"}  ${className || ""
            }`}
          {...props}
        />
        {/* <Image
          src={
            !visible
              ? mobileView
                ? `${hidePassword}#hidePass`
                : hidePassword_grey
              : mobileView
              ? `${eye}#visiblePass`
              : eye_grey
          }
          width={15}
          onClick={() => setVisible(!visible)}
          className="setRgtPosAbs"
          alt="eye"
        /> */}
        {error && <Error errorMessage={error} />}
        <Icon
          icon={
            !visible
              ? mobileView
                ? `${hidePassword}#hidePass`
                : `${hidePassword_grey}#hidePassGrey`
              : mobileView
                ? `${eye}#visiblePass`
                : `${eye_grey}#passVisibleGery`
          }
          color={
            mobileView ? (theme.type == "light" ? "#000" : "#fff") : (theme.type == "light" || isAgency ? "#000" : "#fff")
          }
          width={15}
          onClick={() => setVisible(!visible)}
          class="setRgtPosAbs"
          alt="eye"
        />
      </div>
      <style jsx>{`
      :global(.setRgtPosAbs){
        ${error ? `right:${props.value ? "16%!important" : "2%!important"}` : `right:${props.value && "35px!important"}`};
        top:${props.value && "45% !important"};
      }
      :global(.error-tooltip-container){
        right:${props.name === "password" && "5%!important"};
        top:${props.name === "password" && "45%!important"};
      }
      :global(.input-error-error~.setRgtPosAbs){
        right:${props.name === "password" && "15%!important"};
        top:${props.name === "password" && "45%!important"};
      }
      :global(.error-tooltip){
        right:${props.name === "password" && "11%!important"};
      }
      `
      }
      </style>
    </div>
  );
};

export default React.forwardRef(InputPassword);
