import React from "react";

const DVRadioButton = (props) => {
    const {
        checked = false,
        label = "",
        name = "radio",
        value,
        onChange,
        timezonelabel,
        disabled
    } = props;
    return (
        <>
            <label className="gender_container">
                {label}
                <input
                    type="radio"
                    name={name}
                    onChange={(e) => onChange(timezonelabel ? {value:e.target.value,label:timezonelabel}:e.target.value)}
                    value={value}
                    checked={checked}
                    disabled={disabled}
                />
                <span className="checkmark" style={{background: 'none'}} />
            </label>
        </>
    );
};
export default DVRadioButton;
