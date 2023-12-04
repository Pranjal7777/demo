//library import
import { MuiPickersUtilsProvider, DatePicker } from "material-ui-pickers";
import dateMomentUtils from "@date-io/moment";
import { withStyles, createTheme, ThemeProvider } from "@material-ui/core/styles";
import React, { useState, useEffect } from "react";
import { PRIMARY_COLOR } from "../../lib/color";
import { calenderIcon } from "../../lib/config";
import { inValidDate } from "../../lib/validation/validation";
import Image from "../image/image";
import isMobile from "../../hooks/isMobile";
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';


//styles for date picker
const styles = {
  root: {
    height: "38px",
    padding: " 3px 0px 0px 10px",
    border: `none`,
    fontSize: "0.8rem ",
    borderRadius: "20px",
    width: "100% ",
    // color: "#ffffff",
    opacity: 0.9,
    outline: "none",
    cursor: "pointer",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  input: {
    fontSize: "0.8rem",
    // color: "#fff",
    cursor: "pointer",
    "&::placeholder": {
      fontSize: "0.8rem",
      color: "#fff",
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
function datePicker(props) {
  const { isFromStripe = false } = props;
  const [state, setState] = useState({ value: "" || null });
  const [pageLoad, setPageLoad] = useState(false);
  let onDateSelect = (...arges) => {
    setState({
      value: arges[0],
    });
    if (props.onChange) {
      let e = {
        target: {
          value: arges[0].format("YYYY-MM-DD"),
          name: props.name,
        },
      };

      props.onChange(e);
    }
  };
  const [mobileView] = isMobile();

  // set initial date value
  useEffect(() => {
    setPageLoad(true);
  }, []);

  const { classes, addBankAccount } = props;

  return (
    <>
      <div
        className={
          mobileView
            ? "form-group forminput-date-picker position-relative"
            : addBankAccount ? "dv__forminput-date-picker position-relative custom_dv_forminput_date_picker" : "dv__forminput-date-picker position-relative"
        }
      >
        {pageLoad && (
          <ThemeProvider theme={theme}>
            <MuiPickersUtilsProvider utils={dateMomentUtils}>
              <DatePicker
                disabled={props.disabled ? props.disabled : false}
                disableUnderline={true}
                margin="normal"
                className={
                  classes.root +
                  ` ${props.className ? props.className : ""}   ${props.disabled ? " datepicker-disabled" : " datepicker-active"
                  }`
                }
                style={{ backgroundColor: "rgb(241, 242, 246)" }}
                value={state.value}
                placeholder="DD-MM-YYYY"
                format="DD-MM-YYYY"
                maxDate={props.type === "fullCalender" ? undefined : props.maxDate || new Date()}
                InputProps={{
                  classes: {
                    root: classes.input,
                    focused: classes.input,
                  },
                }}
                inputProps={{
                  className: `form-control ${props.inputClassName && props.inputClassName
                    } form-control-trans`,
                }}
                error={false}
                fullWidth={true}
                helperText={null}
                onChange={onDateSelect}
                minDate={props.min}
              />
            </MuiPickersUtilsProvider>
          </ThemeProvider>
        )}
        <CalendarTodayIcon fontSize="small" className="calanderIcon" />

        <style jsx>{`
          :global(.forminput-date-picker input, .dv__forminput-date-picker) {
            cursor: pointer;
          }

          :global(.forminput-date-picker > div, .dv__forminput-date-picker
              > div) {
            height: 44px;
            margin: 0px !important;
          }

          :global(.dv__forminput-date-picker input) {
            background: #ffffff !important;
            border: none !important;
            border-bottom: 1px solid #c4c4c4 !important;
            border-radius: 0 !important;
            height: 2vw !important;
            font-size: 1.171vw;
            font-family: "Roboto", sans-serif !important;
            color: #000000 !important;
            padding: 0 !important;
            padding-left: ${isFromStripe ? "10px" : "0"} !important;
          }

          :global(.custom_dv_forminput_date_picker input) {
            border-radius: ${isFromStripe ? "" : "5px !important"};
            border: ${isFromStripe ? "" : "5px !important"};
            padding-left: ${isFromStripe ? "" : "5px !important"};
          }

          :global(.forminput-date-picker input) {
            padding: 10px 0 1px 64px !important;
            font-size: 0.9rem;
            background: var(--l_app_bg) !important;
            color: var(--l_app_text) !important;
          }

          :global(.forminput-date-picker>div){
            background: var(--l_app_bg) !important;
            color: var(--l_app_text) !important;
            // overflow: hidden;
          }

          :global(.date-picker-input input) {
            cursor: pointer;
          }

          :global(.forminput-date-picker, .dv__forminput-date-picker) {
            width: 100%;
          }

          :global(.MuiFormControl-fullWidth){
            margin-top: ${isFromStripe ? "1px" : "0px"};
          }

          :global(.calanderIcon) {
            position: absolute;
            right: 15px;
            z-index: ${isFromStripe ? 0 : 1};
            cursor: pointer;
            top:${props.type === "fullCalender" ? "50%" : "38%"} ;
            transform: translateY(-50%);
            pointer-events: none !important;
          }
        `}</style>
      </div>
    </>
  );
}

export default withStyles(styles)(datePicker);
