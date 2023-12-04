//library import
import { MuiPickersUtilsProvider, DatePicker } from "material-ui-pickers";
import dateMomentUtils from "@date-io/moment";
import { withStyles, createTheme } from "@material-ui/core/styles";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import { useState, useEffect } from "react";
import { PRIMARY_COLOR } from "../../lib/color";
import * as config from "../../lib/config";
import Icon from "../image/icon";
import isMobile from "../../hooks/isMobile";

//styles for date picker
const styles = {
  root: {
    height: "38px",
    // padding: " 3px 0px 0px 10px",
    // border: "none",
    fontSize: "1rem ",
    borderRadius: "20px",
    width: "100% ",
    color: "#000",
    opacity: 0.9,
    outline: "none",
    cursor: "pointer",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  input: {
    fontSize: "0.8rem",
    // border: "1px solid #C4C4C4",
    // borderRadius: "3px",
    // height: "20px",
    color: "#000",
    cursor: "pointer",
    "&::placeholder": {
      fontSize: "1rem",
      color: "#000",
    },
    "&:after": {
      content: "none",
    },
    "&:before": {
      content: "none",
    },
  },
};

//set theame of the date picker
const theme = createTheme({
  palette: {
    primary: {
      light: "#fff",
      main: PRIMARY_COLOR,
      dark: "#000",
    },
    secondary: {
      main: "#fff",
    },
  },
  typography: {
    useNextVariants: true,
  },
});

//date picker component
function DVdatePickerInput(props) {
  const [mobileView] = isMobile()
  const [state, setState] = useState({ value: props.value || null });
  const [pageLoad, setPageLoad] = useState(false);
  let onDateSelect = (...arges) => {
    setState({
      value: arges[0],
    });
    // console.log(arges[0].year());
    if (props.onChange) {
      let e = {
        target: {
          value: arges[0].format("MM-DD-YYYY"),
          name: props.name,
        },
      };

      props.onChange(e);
    }
  };

  // set initial date value
  useEffect(() => {
    setPageLoad(true);
  }, []);

  const { classes } = props;
  // console.log("dasdda", props);

  return (
    <div className="forminput-date-picker position-relative form-control dv_form_control">
      {pageLoad && (
        <MuiThemeProvider theme={theme}>
          <MuiPickersUtilsProvider utils={dateMomentUtils}>
            <DatePicker
              disabled={props.disabled ? props.disabled : false}
              disableUnderline={true}
              margin="normal"
              className={
                classes.root +
                `form ${props.className ? props.className : ""}   ${props.disabled ? " datepicker-disabled" : " datepicker-active"
                }`
              }

              value={state.value}
              placeholder="MM-DD-YYYY"
              format="MM-DD-YYYY"
              maxDate={props.maxDate || new Date()}
              InputProps={{
                classes: {
                  root: classes.input,
                  focused: classes.input,
                },
              }}
              inputProps={{
                className: `dv_form_control ${props.inputClassName && props.inputClassName
                  }`,
              }}
              error={false}
              fullWidth={false}
              helperText={null}
              onChange={onDateSelect}
              style={{ width: "96%" }}
            />
          </MuiPickersUtilsProvider>
        </MuiThemeProvider>
      )}
      <div className="dvPickerIcon" style={{ top: "13%", pointerEvents: "none" }}>
        <Icon
          icon={`${config.calenderIcon}#calender_icon`}
          alt="calender-icon"
          color={"var(--l_light_app_text)"}
          width={mobileView ? 16 : 20}
          className="dv_setRgtPosAbs"
        />
      </div>
      <style jsx>{`
        :global(.forminput-date-picker input) {
          cursor: pointer;
          border: none !important;
        }
        :global(.forminput-date-picker > div) {
          margin: 0px !important;
          position: absolute !important;
          right:2% !important;
          display:flex !important;
          align-item:center !important;
          justify-content:center !important;
        }
        :global(.forminput-date-picker input) {
          padding: 12px 0px 6px 0px !important;
          font-size: 0.8rem;
          color:var(--l_app_text);
        }
        :global(.date-picker-input input) {
          cursor: pointer;
        }
        :global(.forminput-date-picker) {
          width: 100%;
        }
        :global(.forminput-date-picker .dvPickerIcon) {
          top: 50% !important;
          transform: translateY(-50%);
          right: 0.5rem !important;
          line-height: 0px;
      }
      `}</style>
    </div>
  );
}

export default withStyles(styles)(DVdatePickerInput);
