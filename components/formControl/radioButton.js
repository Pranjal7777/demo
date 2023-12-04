import React from "react";
import isMobile from "../../hooks/isMobile";
const RadioButton = (props) => {
  const {
    checked = false,
    label = "",
    name = "radio",
    value,
    onChange,
    labelPlacement,
    leftLabel,
    labelClass = "",
  } = props;
  const [mobileView] = isMobile();

  return (
    <label
      className={
        labelPlacement == "right"
          ? mobileView
            ? `rightlabelRadioContainer ${labelClass}`
            : `dv__rightlabelRadioContainer ${labelClass}`
          : mobileView
            ? `radioContainer bold ${labelClass}`
            : `dv__RadioContainer ${labelClass}`
      }
      style={{ display: leftLabel ? `flex` : `flex` }}
    >
      {label}
      <input
        type="radio"
        name={name}
        onChange={(e) => {
          onChange && onChange(e.target.value);
        }}
        value={value}
        checked={checked}
      />
      <span className="checkmark" />

    </label>
  );
};
export default RadioButton;
