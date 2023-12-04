import React from "react";

export default function InputField(props) {
  return (
    <div className="form-group">
      <label className="mv_label_profile_input">{props.label}</label>
      <div className="position-relative">
        <input
          type="text"
          className="form-control mv_form_control_profile_input"
          placeholder={props.placeholder}
          defaultValue={props.value}
        />
      </div>
    </div>
  );
}
