import React from "react";
import _JSXStyle from "styled-jsx/style";
import { withStyles } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

import { FONT_FAMILY } from "../../lib/config";

import Wrapper from "../../hoc/Wrapper";

const CustomFormLabel = withStyles({
  root: {
    borderRadius: 3,
    border: 0,
    height: 30,
    padding: "0",
    fontSize: 12
  },
  label: {
    textTransform: "capitalize",
    fontFamily: FONT_FAMILY
  }
})(FormControlLabel);

function CustomCheckbox(props) {
  const [value, setValue] = React.useState("female");
  const { label, parent, onCBChange, customValue, penCount } = props;
  function handleChange(event) {
    setValue(event.target.value);
    onCBChange ? onCBChange(parent, event) : "";
  }

  return (
    <Wrapper>
      {/* <FormControl component="fieldset" style={{ display: "block" }}>
        <FormGroup
          aria-label="position"
          name="position"
          value={value}
          onChange={handleChange}
          row
          style={{ display: "block", height: "30px" }}
        >
          <CustomFormLabel
            value={customValue || label}
            control={<Checkbox color="primary" />}
            label={<span className="cbLabel">{label}</span>}
            labelPlacement="end"
          />
        </FormGroup>
      </FormControl> */}

      <label className="container">
        {
          <span className="cbLabel">
            {label} {penCount ? "(" + penCount + ")" : ""}{" "}
          </span>
        }
        <input
          type="checkbox"
          value={label}
          id={label}
          onChange={handleChange}
        />
        <span className="checkmark"></span>
      </label>

      <style jsx>
        {`
          .formControlLabel :global(span) {
            display: block;
            font-size: 12px;
            font-weight: 500;
            margin: 8px 0px 8px 22px;
          }

          .cbLabel {
            display: block;
            font-size: 14px;
            font-weight: 400;
          }

          /* The container */
          .container {
            display: block;
            position: relative;
            padding-left: 30px;
            cursor: pointer;
            font-size: 22px;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            font-size: 14px;
            text-transform: capitalize;
            font-family: ${FONT_FAMILY};
            margin: 5px 0;
          }

          /* Hide the browser's default checkbox */
          .container input {
            position: absolute;
            opacity: 0;
            cursor: pointer;
            height: 0;
            width: 0;
          }

          /* Create a custom checkbox */
          .checkmark {
            position: absolute;
            top: 0;
            left: 0;
            height: 18px;
            width: 18px;
            background-color: #fff;
            border: 2px solid #999;
            border-radius: 2px;
          }

          /* When the checkbox is checked, add a blue background */
          .container input:checked ~ .checkmark {
            background-color: #3f51b5;
            border: none;
          }

          /* Create the checkmark/indicator (hidden when not checked) */
          .checkmark:after {
            content: "";
            position: absolute;
            display: none;
          }

          /* Show the checkmark when checked */
          .container input:checked ~ .checkmark:after {
            display: block;
          }

          /* Style the checkmark/indicator */
          .container .checkmark:after {
            left: 6px;
            top: 3px;
            width: 5px;
            height: 10px;
            border: solid white;
            border-width: 0 2px 2px 0;
            -webkit-transform: rotate(45deg);
            -ms-transform: rotate(45deg);
            transform: rotate(45deg);
          }
        `}
      </style>
    </Wrapper>
  );
}

export default CustomCheckbox;
