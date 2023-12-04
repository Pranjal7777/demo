import React from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { green } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";

import { GREY_VARIANT_4, THEME_COLOR } from "../../lib/config";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    fontFamily: `"Poppins", "Raleway", "sans-serif" !important`
  },
  wrapper: {
    margin: "10px 0",
    position: "relative",
    width: "100%"
  },
  buttonSuccess: {
    backgroundColor: THEME_COLOR,
    "&:hover": {
      backgroundColor: green[700]
    }
  },
  buttonProgress: {
    color: THEME_COLOR,
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12
  }
}));

export default function CircularProgressButton(props) {
  const classes = useStyles();
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const timer = React.useRef();

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success
  });

  React.useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  function handleButtonClick() {
    if (!loading) {
      setSuccess(false);
      setLoading(true);
      timer.current = setTimeout(() => {
        setSuccess(true);
        setLoading(false);
      }, 2000);
    }
  }

  const { buttonText, type, styles } = props;

  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <Button
          variant="contained"
          color="primary"
          className={buttonClassname}
          disabled={props.loading || props.disabled}
          onClick={props.onClick}
          type={type || "button"}
          style={styles ? { ...styles } : {}}
        >
          {buttonText}
        </Button>
        {props.loading && (
          <CircularProgress size={24} className={classes.buttonProgress} />
        )}
      </div>
    </div>
  );
}
