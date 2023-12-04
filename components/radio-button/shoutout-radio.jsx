import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import isMobile from "../../hooks/isMobile";
import { useTheme } from "react-jss";

const useStyles = props => makeStyles((theme) => ({
  body1: {
    color:`${props?.mobileView ? props?.theme?.text : props?.theme?.palette?.l_slider_bg} !important`,
  },
  formControl: {
    margin: 0,
    width: "100%",
  },
  controlLabel: {
    marginLeft: 0,
    marginRight: 0,
    justifyContent: "space-between",
    fontSize: "4.5vw",
    fontWeight: "500",
    color: `${props?.mobileView ? props?.theme?.text : 'var(--l_app_text)'} !important`,
  },
  colorPrimary: {
    color: "#8D8B99 !important",
  },
  colorSecondary: {
    color: "#8D8B99 !important",
  },
  checked: {
    color: `${props?.theme?.appColor} !important`,
  },
}));

export default function RadioButtonsGroup(props) {
  const [mobileView] = isMobile();
  const theme = useTheme();

  const propsVar = {
    mobileView: mobileView,
    theme: theme
  }
  const classes = useStyles(propsVar)();
  const { reason, handleReasonOnChange, reasonsList } = props;

  const handleChange = (event) => {
    handleReasonOnChange(event.target.value);
  };

  return (
    <div>
      <FormControl component="fieldset" className={classes.formControl}>
        <RadioGroup
          aria-label="gender"
          name="gender2"
          className={classes.body1}
          value={reason}
          onChange={handleChange}
        >
          {reasonsList &&
            reasonsList.length > 0 &&
            reasonsList.map((reasons, index) => (
              <FormControlLabel
                className={classes.controlLabel}
                value={reasons.reason}
                control={
                  <Radio
                    classes={{
                      colorPrimary: classes.colorPrimary,
                      colorSecondary: classes.colorSecondary,
                      checked: classes.checked,
                    }}
                    style={{ marginLeft: `${mobileView ? "30vw" : 0}` }}
                  />
                }
                label={reasons.reason}
                labelPlacement="start"
              />
            ))}
          <FormControlLabel
            className={classes.controlLabel}
            value="others"
            control={
              <Radio
                classes={{
                  colorPrimary: classes.colorPrimary,
                  colorSecondary: classes.colorSecondary,
                  checked: classes.checked,
                }}
                style={{ marginLeft: `${mobileView ? "30vw" : 0}` }}
              />
            }
            label="Other"
            labelPlacement="start"
          />
        </RadioGroup>
      </FormControl>
    </div>
  );
}
