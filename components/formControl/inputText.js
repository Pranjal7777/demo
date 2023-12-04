import React, { useEffect } from "react";
import Error from "../error/error";
import CheckCircleOutlineOutlinedIcon from "@material-ui/icons/CheckCircleOutlineOutlined";
import InputBox from "../input-box/input-box";
import { useTheme } from "react-jss";

const InputText = ({ parentClass, className, ...props }, ref) => {
  const { error, type = "text", validCheck,disUeff } = props;
  const theme = useTheme();
  useEffect(() => {
    const element = document.querySelector("input[type=number]");
    !disUeff && element &&
      element.addEventListener("keypress", function (evt) {
        if (
          (evt.which != 8 && evt.which != 0 && evt.which < 48) ||
          evt.which > 57
        ) {
          evt.preventDefault();
        }
      });
    // console.log("sdsadada", element);
  }, []);
  return (
    <div className={`form-group position-relative ${parentClass || ""}`}>
      <InputBox
        ref={ref}
        type={type}
        fclassname={`form-control ${error && "input-error-error"} ${className || ""
          }`}
        {...props}
      />
      {!error && props.valid && (
        <div className="error-tooltip-container">
          <CheckCircleOutlineOutlinedIcon
            style={{ fill: "green", color: "white" }}
          />
        </div>
      )}
      {error && error !== "" && <Error errorMessage={error} typeCheck={props.id}></Error>}
      <style jsx>{`
          :global(.form-group){
            margin-bottom:${props.name === "collection" && "0px"};
          }
      `}</style>
    </div>
  );
};

export default React.forwardRef(InputText);
