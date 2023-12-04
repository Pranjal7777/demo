import React from "react";

import PasswordInput from "./inputPassword";

function LabelInputPassword(props) {
  return (
    <div className="form-group">
      <label> {props.label} </label>
      <div className="position-relative">
        <PasswordInput
          id={props.id}
          placeholder={props.placeholder}
          name={props.name}
          value={props.values}
          onChange={props.handleChange}
          onBlur={props.handleBlur}
          error={props.errors && props.touched ? props.errors : ""}
        />
      </div>
    </div>
  );
}
export default LabelInputPassword;
