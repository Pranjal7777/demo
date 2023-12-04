import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles(theme => ({
  button: {
    // margin: theme.spacing(1)
    position: "absolute",
    top: "-1px",
    fontSize: "11px",
    right: "-16px",
    color: "#999",
    "&:hover": {
      background: "transparent"
    }
  },
  customWidth: {
    maxWidth: 500
  },
  noMaxWidth: {
    maxWidth: "none"
  }
}));

const longText = `
Aliquam eget finibus ante, non facilisis lectus. Sed vitae dignissim est, vel aliquam tellus.
Praesent non nunc mollis, fermentum neque at, semper arcu.
Nullam eget est sed sem iaculis gravida eget vitae justo.
`;

export default function InfoTooltip(props) {
  const classes = useStyles();

  return (
    <div>
      <Tooltip title={props.tooltipContent}>
        <Button className={classes.button}>{props.children}</Button>
      </Tooltip>
    </div>
  );
}
