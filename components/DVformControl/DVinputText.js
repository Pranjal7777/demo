import React from "react";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Error from "../error/error";
import Valid from "../valid/valid";
import { Chevron_Right_Darkgrey, Right_Chevron_Icon, cross_icon_input } from "../../lib/config";
import isMobile from "../../hooks/isMobile";
import Image from "../image/image";
import Icon from "../image/icon";


const DVInputText = ({ className, ...props }, ref) => {
  const [mobileView] = isMobile();
  const { error, validMsg, contactus, isDropDown, labelTitle, id, type, switchToUser, disabledField, autoComplete, errorClass, errorIocnClass, isAgency, nextArrow = "" } = props;
  return (
    <div className={`form-group`}>
      {
        labelTitle && <label className={`label__title mb-1 ${props.labelClass}`} htmlFor={id}>{labelTitle}<span className="">{type && type !== "refCode" && type !== "lastname" && " *"}</span></label>
      }
      {
        props.label && <label className="dv__label_profile_input mb-0 dv_base_color dv_base_color" htmlFor={id}>{props.label}</label>
      }
      <div className="position-relative inputParentText">
        <input
          ref={ref}
          type="text"
          className={`form-control ${error && !contactus &&
            // "input-error-error"
            "dv_form_control"
            } form-control ${className || ""}`}
          {...props}
          autoComplete={autoComplete === 'off' && 'nope'}
          // readOnly={true} // This line is to stop auto fill by browser
          // onFocus={(e) => e?.target?.removeAttribute('readonly')}
          disabled={disabledField}
        />
        {
          !!nextArrow && <div onClick={props.nextArrowClick} className='handleNextArrow cursor-pointer'>
            <Icon
              icon={Right_Chevron_Icon + "#right-arrow"}
              size={14}
              alt="follow icon"
              viewBox="0 0 40 40"
              color="var(--l_app_text)"
            />
          </div>
        }
        {
          !!props.crossIcon && <div onClick={props.crossIconClick} className='handleNextArrow cursor-pointer'>
            <Icon
              icon={`${cross_icon_input}#cross_icon_input`}
              size={20}
              class="pointer"
              alt="cross_icon"
              viewBox="0 0 35 35"
            />
          </div>
        }
        {validMsg && !error && <Valid validMsg={validMsg} typeCheck={type} />}
        {error && <Error errorMessage={error} className={errorClass} errorIocnClass={errorIocnClass} typeCheck={type} switchToUser={switchToUser} name={props.name} />}
        {isDropDown && <ArrowForwardIosIcon className="arrow_on_right position-absolute dv_appTxtClr_web cursorPtr fntSz15" />}
      </div>
      {props.edit && (
        <Image
          src={
            // mobileView ? EDIT_WHITE :
            Chevron_Right_Darkgrey
          }
          style={{ top: "56%", right: "21px" }}
          className={!mobileView && "position-absolute"}
        />
      )}
       <style jsx>{`
       :global(.error-tooltip){
        right: ${props.switchToUser === "USER" && props.name === "refCode" && "5.1% !important"}
      }
      input::placeholder{
        text-transform:${isAgency && "lowercase" }!important;
      }
      `}
      </style>
    </div>
  );
};

export default React.forwardRef(DVInputText);
