import React from "react";
import Radio from "@material-ui/core/Radio";
import { makeStyles } from "@material-ui/core/styles";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Wrapper from "../../../hoc/Wrapper";
import isMobile from "../../../hooks/isMobile";
import { useTheme } from "react-jss";

const useStyles = (props) =>
  makeStyles((theme) => ({
    root: {
      display: "flex",
      color: props.theme.text,
      fontSize: props.mobileView ? "20px" : "15px",
      width: props.mobileView ? "auto" : "170px",
      padding: props.mobileView ? "9px 0 5px 0" : "9px 9px 5px 0",
    },
    formControl: {
      margin: theme.spacing(0),
      width: "100%",
    },
    group: {
      margin: theme.spacing(1, 0),
    },
  }));

export default function FilterRadioGroup(props) {
  const {
    labelPlacement,
    radioClass,
    formLabelClass,
    radioOptionList,
    radioValue,
    radioLabel
  } = props;
  const [value, setValue] = React.useState(radioValue);
  const theme = useTheme();
  const [mobileView] = isMobile();
  const classes = useStyles({ mobileView: mobileView, theme: theme })();
  const handleChange = (event) => {
    props?.setFilterValue(event.target.value, radioLabel)
    setValue(event.target.value);
  };

  return (
    <Wrapper>
      <FormControl component="fieldset" className={classes.root}>
        <RadioGroup
          aria-label="gender"
          name="gender1"
          value={value}
          onChange={handleChange}
        >
          {radioOptionList && radioOptionList.length > 0
            ? radioOptionList.map((radioBtn, radioBtnIndex) => (
                <FormControlLabel
                  key={"radio-btn-" + radioBtnIndex}
                  value={radioBtn.value}
                  className={`d-flex ${
                    mobileView
                      ? "justify-content-between"
                      : "justify-content-start"
                  } m-0 ${formLabelClass}`}
                  control={
                    <Radio
                      color="primary"
                      size="small"
                      className={radioClass}
                      style={{ color: theme.text }}
                    />
                  }
                  label={radioBtn?.label}
                  labelPlacement={labelPlacement || "end"}
                  checked={radioValue == radioBtn.value}
                  style={{ fontSize: "15px" }}
                />
              ))
            : ""}
        </RadioGroup>
      </FormControl>
      <style jsx>{`
        :global(.MuiTypography-body1) {
          font-size: ${mobileView ? "" : "15px"} !important;
        }
      `}</style>
    </Wrapper>
  );
}
