import React from "react";
import { createUseStyles, useTheme } from "react-jss";



const InputBox = (props, ref) => {
  const useStyles = createUseStyles({
    myInput: (props) => ({
      backgroundColor: props.background || props.theme?.inputBox?.background,
      color: props.color || props.theme?.inputBox?.color,
      width: props.width || "100%",
      height: props.height || props.theme?.inputBox?.height,
      padding: props.padding || props.theme?.inputBox?.padding,
      fontSize: props.fontSize || props.theme?.inputBox?.fontSize,
      fontFamily: props.fontFamily || props.theme?.inputBox?.fontFamily,
      border: props.border || props.theme?.inputBox?.border,
      borderRadius: props.borderRadius || props.theme?.inputBox?.borderRadius,
      "&:hover, &:focus": {
        backgroundColor: props.background || props.theme?.inputBox?.background,
        color: props.color || props.theme?.inputBox?.color,
      },
      "&:disabled": {
        backgroundColor: props.background || props.theme?.inputBox?.background,
        color: props.color || props.theme?.inputBox?.color,
      },
      "&::placeholder": {
        color:
          props.placeholderColor || props.color || props.theme?.inputBox?.color,
        opacity: props.placeholderColor ? 1 : 0.6,
      },
    }),
  });
  const theme = useTheme();
  const { cssStyles = {}, type, fclassname, inputRef, autoComplete, ...others } = props;
  const classes = useStyles({ ...cssStyles, theme });

  return (
    <div>
      {props?.label && !props.editLabel && <div className="text-left">
        <label>{props.label}</label>
      </div>}
      <input
      ref={inputRef ? inputRef : ref}
      type={type || "text"}
      className={`${classes.myInput} ${fclassname}`}
      {...others}
        autoFocus={props.focus}
      autoComplete={autoComplete === "off" && 'nope'}
    />
    </div>
  );
};

export default React.forwardRef(InputBox);
