import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Skeleton from "@material-ui/lab/Skeleton";
import { useTheme } from "react-jss";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import FormLabel from "@mui/material/FormLabel";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    color: "var(--l_app_text)",
  },
  formControl: {
    margin: theme.spacing(0),
    width: "100%",
  },
  group: {
    margin: theme.spacing(1, 0),
  },
}));

export default function RadioButtonsGroup(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState("");
  const theme = useTheme()

  function handleChange(event) {
    setValue(event.target.value);
    props.onRadioChange
      ? props.onRadioChange(event.target.value)
      : "";
  }

  const {
    label,
    labelPlacement,
    radioClass,
    radioLabelClass,
    formLabelClass,
    buttonGroupData,
    disabled,
  } = props;

  useEffect(() => {
    setValue(props.value);
  }, [props]);

  return (
    <div className={classes.root}>
      <FormControl
        component="fieldset"
        className={classes.formControl}>
        {label && (
          <FormLabel component="legend">{label}</FormLabel>
        )}
        <RadioGroup
          aria-label={label}
          name={label}
          className={(classes.group, radioLabelClass)}
          value={value}
          style={{ width: "100%" }}
          onChange={handleChange}>
          {buttonGroupData && buttonGroupData.length > 0
            ? buttonGroupData.map(
              (radioBtn, radioBtnIndex) => (
                <FormControlLabel
                  key={"radio-btn-" + radioBtnIndex}
                  value={radioBtn.value}
                  className={`d-flex justify-content-between m-0 ${formLabelClass}`}
                  control={
                    <Radio
                      color="primary"
                      className={radioClass}
                    />
                  }
                  label={radioBtn?.label || radioBtn}
                  labelPlacement={labelPlacement || "end"}
                  checked={value == radioBtn.value}
                  disabled={disabled}
                />
              )
            )
            : ""}

          {!buttonGroupData ||
            (!buttonGroupData.length && (
              <>
                <div className="d-flex">
                  <Skeleton
                    variant="rect"
                    width="80%"
                    height={30}
                  />
                  <Skeleton
                    className="ml-auto"
                    variant="circle"
                    width={30}
                    height={30}
                  />
                </div>
                <br />
                <div className="d-flex">
                  <Skeleton
                    variant="rect"
                    width="80%"
                    height={30}
                  />
                  <Skeleton
                    className="ml-auto"
                    variant="circle"
                    width={30}
                    height={30}
                  />
                </div>
                <br />
                <div className="d-flex">
                  <Skeleton
                    variant="rect"
                    width="80%"
                    height={30}
                  />
                  <Skeleton
                    className="ml-auto"
                    variant="circle"
                    width={30}
                    height={30}
                  />
                </div>
              </>
            ))}

          {/* <FormControlLabel value="male" control={<Radio />} label="Male" />
          <FormControlLabel value="other" control={<Radio />} label="Other" /> */}
        </RadioGroup>
      </FormControl>
    </div>
  );
}
