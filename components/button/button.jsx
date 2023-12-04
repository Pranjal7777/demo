import React from "react";
import { createUseStyles, useTheme } from "react-jss";
import Icon from "../image/icon";
import PulseLoader from 'react-spinners/PulseLoader'

const Button = ({
  role = "button",
  type = "button",
  cssStyles = {},
  fclassname,
  isDisabled,
  btnSpanClass,
  leftIcon,
  rightIcon,
  btnSpanStyle,
  fixedBtnClass,
  isLoading = false,
  loadingColor,
  loadingSize,
  loadingMargin,
  ...props
}) => {
  const useStyles = createUseStyles({
    myButton: (props) => ({
      backgroundColor: props.background || props.theme?.button?.background,
      background: props.background || props.theme?.button?.background,
      width: "100%",
      display: "block",
      borderRadius:
        props.borderRadius || props.theme?.button?.borderRadius || "6px",
      margin: props.background || props.theme?.button?.background,
      padding: props.padding || props.theme?.button?.padding,
      border: props.border || props.theme?.button?.border,
      color: props.text || props.theme?.button?.text,
      fontFamily: props.fontFamily || props.theme?.button?.fontFamily,
      "&:focus, &:hover": {
        boxShadow: "none !important",
        outline: "red !important",
        backgroundColor:
          props.hoverBackground ||
          props.background ||
          props.theme?.button?.background,
        color: props.hoverText || props.text || props.theme?.button?.text,
      },
      "&:active": {
        boxShadow: "none !important",
        outline: "red !important",
        background: props.theme?.gradientActiveBtnClr + "!important",
      },
      "&:disabled": {
        opacity: 0.65,
        pointerEvents: "none"
      },
    }),
    myLabel: (props) => ({
      fontFamily: props.fontFamily || props.theme?.button?.fontFamily,
      fontSize: props.fontSize || props.theme?.button?.fontSize,
      color: props.text || props.theme?.button?.text,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      // textTransform: "capitalize",
      "&:focus, &:hover": {
        color: props.hoverText || props.text || props.theme?.button?.text,
      },
    }),
  });

  const theme = useTheme();
  const classes = useStyles({ ...cssStyles, theme });
  return (
    <button
      disabled={isDisabled || isLoading || false}
      role={role}
      type={type}
      className={`position-relative ${classes.myButton} ${fclassname} ${fixedBtnClass ? (fixedBtnClass === "active" ? "btnGradient_bg" : `background_none ${fixedBtnClass === "inactiveClr" ? "borderStrokeClr" : "borderStroke"}`) : ""} py-2 rounded-pill`}
      {...props}
    >
      {leftIcon && <Icon
        icon={`${leftIcon?.src}#${leftIcon?.id}`}
        height={props?.iconHeight}
        width={props?.iconWidth}
        color={props?.iconColor}
        class={`${props?.iconClass} ${isLoading ? "isBtnLoading" : ''}`}
        viewBox={props?.iconViewBox}
      />}
      <span className={`${classes.myLabel} ${btnSpanClass} postBtn  ${fixedBtnClass ? fixedBtnClass === "inactiveClr" ? "gradient_text w-500" : "" : ""} ${isLoading ? "isBtnLoading" : ''}`} style={{ ...btnSpanStyle }}>{props.children}</span>
      {rightIcon && <Icon
        icon={`${rightIcon?.src}#${rightIcon?.id}`}
        height={props?.iconHeight}
        width={props?.iconWidth}
        color={props?.iconColor}
        class={`${props?.iconClass} ${isLoading ? "isBtnLoading" : ''}`}
        viewBox={props?.iconViewBox}
      />}
      {
        isLoading ? <div className="btnLoader d-flex align-items-center justify-content-center">
          <PulseLoader
            sizeUnit={"px"}
            size={loadingSize || 8}
            margin={loadingMargin || 4}
            color={loadingColor || '#fff'}
            loading={true}
            css={"line-height: 0"}
          />
        </div> : ''
      }

      <style jsx>
        {`
          @media (min-width: 700px) and (max-width: 991.98px){
            :global(.postBtn){
              font-size: calc(0.878vw + 4px) !important;
            }
          }
          .btnLoader {
            position:absolute;
            width: 100%;
            height: 100%;
            left:0;
            top: 0;
          }
          :global(.isBtnLoading) {
            opacity: 0.1;
          }
        `}
      </style>
    </button>
  );
};

export default Button;
