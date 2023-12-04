import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Radio } from "@material-ui/core";
import { PRIMARY } from "../../lib/color";

const RadioButton = withStyles({
  root: {
    color: "var(--l_base)" || PRIMARY,
    "&$checked": {
      color: "var(--l_base)" || PRIMARY,
    },
  },
  checked: {},
})((props) => <Radio color="default" {...props} />);
export default RadioButton;
