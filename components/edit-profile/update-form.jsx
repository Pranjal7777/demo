import React from "react";
import Button from "../button/button";
import { useTheme } from "react-jss";

export default function UpdateForm(props) {
  const theme = useTheme();

  return (
    //onSubmit={props.handleSubmit}
    <form>
      <div className="form-group">
        <div className="position-relative">
          <input
            type="text"
            className="form-control mv_form_control_profile_input"
            placeholder={props.placeholder}
            defaultValue={props.value}
          />
        </div>
      </div>
      <Button type="submit" fclassname="mb-3" cssStyles={theme.blueButton}>
        {props.butnTitle}
      </Button>
    </form>
  );
}
