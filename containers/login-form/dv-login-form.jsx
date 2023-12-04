import React, { useState } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { makeStyles } from '@material-ui/core/styles';
import Button from "../../components/button/button";
import useLang from "../../hooks/language";
import { validateEmail } from "../../services/auth";
import { drawerToast, open_dialog, startLoader, stopLoader } from "../../lib/global/loader";
import { sendMail } from "../../lib/global/routeAuth";
import { VerifyEmail } from "../../lib/data-modeling";
import { useTheme } from "react-jss";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import CancelOutlined from "@material-ui/icons/CancelOutlined";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Visibility from "@material-ui/icons/Visibility";
import isMobile from "../../hooks/isMobile";
import { useRouter } from "next/router";
import Checkbox from '@mui/material/Checkbox';

const useStyles = props => makeStyles(() => ({
  input: {
    color: props?.theme?.text
  },
  root: {
    '& label.Mui-focused': {
      color: '#cccccc'
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: `${props.theme.appColor} !important`
    },
    '& .MuiInput-root': {
      '& fieldset': {
        borderColor: '#cccccc',
        border: '1px solid'
      },
      '&:hover fieldset': {
        borderColor: '#cccccc'
      },
      '&.Mui-focused fieldset': {
        borderColor: '#cccccc',
        border: '1px solid'
      }
    }
  },
  cssLabel: {
    fontFamily: "Roboto",
    fontWeight: "400 !important",
    "&$cssFocused": {
      color: props.theme.text,
    },
  },

  cssOutlinedInput: {
    color: props.theme.text,
  },

  cssFocused: {},

  // notchedOutline: {
  //   borderRadius: "10px",
  // },
}));

function DVLoginForm(props) {
  const theme = useTheme();
  const [lang] = useLang();
  const { handleLoginResponse, setVal } = props;
  const [passVisible, setPassVisible] = useState(false);
  const classes = useStyles({ theme: theme })();
  const [mobileView] = isMobile();
  const router = useRouter();

  const passError = props.passError;
  const validateDetails = (values) => {
    VerifyEmail.email = values.email;
    VerifyEmail.type = 1;
    startLoader();
    validateEmail(VerifyEmail)
      .then(async (res) => {
        if (res.status === 200) {
          handleLogin(values);
        }
      })
      .catch(async (err) => {
        stopLoader();
        if (err.response) {
          const { status, data } = err.response;
          console.error("validateEmail", data.message);
          handleLoginResponse(status, data);
        }
        if (err.response.status == 409) {
          if (!mobileView) {
            return open_dialog("MsgDialog", {
              title: lang.profileSuspended,
              desc: err.response.data.message,
              button: {
                text: lang.contactUs,
                onClick: () => {
                  sendMail();
                },
              },
            });
          } else {
            return drawerToast({
              title: lang.profileSuspended,
              desc: err.response.data.message,
              button: {
                text: lang.contactUs,
                onClick: () => {
                  sendMail();
                },
              },
            });
          }
        }
        err && err.response && err.response.status
          ? console.error(err && err.response && err.response.status)
          : console.error(err);
      });
  };
  const handleLogin = (values) => {
    // startLoader();
    return props.handleLogin(values);
  };

  const handlePasswordVisiblity = () => {
    setPassVisible(!passVisible)
  }

  const handleReset = (resetForm, values, type) => {
    resetForm({ values: { ...values, [type]: "" } });
  }

  return (
    <>
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={(values, { setSubmitting }) => {
          validateDetails(values);
        }}
        //here we will deefine validation
        validationSchema={Yup.object().shape({
          email: Yup.string().email().required(`${lang.required}`),

          password: Yup.string()
            .required(`${lang.pwdErrorMsg1}`)
            .min(4, `${lang.pwdErrorMsg2}`)
          // .matches(/(?=.*[0-9])/, `${lang.pwdErrorMsg3}`),
        })}
      >
        {(props) => {
          const {
            values,
            touched,
            errors,
            isSubmitting,
            handleChange,
            handleBlur,
            handleSubmit,
            resetForm,
          } = props;

          return (
            <form
              className="mb-2"
              id="loginForm1"
              onSubmit={handleSubmit}
              autoComplete="off"
            >
              <div className="form-group">
                <TextField
                  id="dv_email_usr"
                  label="Email/Username"
                  placeholder={'Email/Username'}
                  name="email"
                  variant="standard"
                  error={errors.email}
                  InputLabelProps={{
                    classes: {
                      root: classes.cssLabel,
                      focused: classes.cssFocused,
                    },
                    shrink: true
                  }}
                  InputProps={{
                    classes: {
                      root: classes.cssOutlinedInput,
                      focused: classes.cssFocused,
                      // notchedOutline: classes.notchedOutline,
                    },
                    disableUnderline: true
                  }}
                  helperText={errors.email && touched.email ? errors.email : ""}
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  className={`stopBack ${classes.root} defaultTxtBx fntSz10 emailSignin`}
                />
                {/* {values.email ? <CancelOutlined onClick={() => handleReset(resetForm, values, "email")} className="cursor-pointer position-absolute" style={{ right: "15px", top: "22px", width: "22px" }} /> : ""} */}
              </div>

              <div className="form-group mb-2">
                <div className="position-relative">
                  <TextField
                    id="pwd_usr1"
                    placeholder="Password"
                    label="Password"
                    name="password"
                    variant="standard"
                    type={passVisible ? "text" : "password"}
                    error={errors.password}
                    value={values.password}
                    onChange={handleChange}
                    helperText={<span className="text-danger">{passError}</span>}
                    onBlur={handleBlur}
                    fullWidth
                    InputLabelProps={{
                      classes: {
                        root: classes.cssLabel,
                        focused: classes.cssFocused,
                      },
                      shrink: true,
                    }}
                    InputProps={{
                      classes: {
                        root: classes.cssOutlinedInput,
                        focused: classes.cssFocused,
                        // notchedOutline: classes.notchedOutline,
                      },
                      endAdornment: (
                        <InputAdornment data-test="Eyepos" position="end" className={`position-absolute`} style={{ right: "15px", top: '57%' }} onClick={handlePasswordVisiblity}>
                          {passVisible ? (
                            <Visibility className={`cursor-pointer fntSz18`} />
                          ) : (
                              <VisibilityOff className={`cursor-pointer fntSz18`} style={{ color: '#8B8B8B' }} />
                          )}
                        </InputAdornment>
                      ),
                      disableUnderline: true,
                    }}
                    className={`${classes.root} defaultTxtBx stopBack passwordSignin`}
                  />
                  {/* {values.password ? <CancelOutlined onClick={() => handleReset(resetForm, values, "password")} className="cursor-pointer position-absolute" style={{ right: "15px", top: "22px", width: "22px" }} /> : ""} */}
                </div>
              </div>

              <div className="d-flex flex-row align-items-center justify-content-between mb-3 text-greymuted fntSz12">
                <div className="">
                  <Checkbox aria-label="Remember Me" sx={{ color: '#272635', padding: '2px', '&.Mui-checked': { color: '#039f54', }, }} disableRipple />Remember Me
                </div>

                <div className="">
                  <div
                    className="cursorPtr text-greymuted"
                    data-toggle="modal"
                    onClick={() => open_dialog("FrgtPass", { closeAll: true })}
                    //   className="btn btn-default txt-book fntSz14 mb-4 whtClrBtn"
                    id="frgtPwd"
                  >
                    {lang.forgetPassword}
                  </div>
                </div>
              </div>
              <Button
                type="submit"
                fclassname="font-weight-500 mt-4"
                cssStyles={{
                  ...theme.blueButton,
                  background:
                    "linear-gradient(91.19deg, rgba(255, 26, 170) 0%, #460a56 100%)",
                  padding: "15px 0px",
                  fontFamily: 'Roboto',
                  fontSize: '13px'
                }}
                id="logIn1"
                children={'Login to Your Account'}
              // onClick={() => {
              //   setCookie("guest", false);
              //   setCookie("auth", true);
              //   setVal(true);
              //   Route.reload("/");
              // }}
              />
              <div className="mt-3">
                <div className="text-center text-greymuted fntSz12" style={{ letterSpacing: '0.39996px' }}>
                  Not a member yet?{' '}
                  <span className="text-white cursorPtr txt-underline" onClick={() => window.open('/signup-as-user', '_self')}>
                    Signup as a User
                  </span>
                </div>
                <div className="text-center text-greymuted fntSz12 mt-2" style={{ letterSpacing: '0.39996px' }}>
                  Are you a Creator?{' '}
                  <span className="text-white cursorPtr txt-underline" onClick={() => window.open('/signup-as-creator', '_self')}>
                    Signup as a Creator
                  </span>
                </div>
              </div>
            </form>
          );
        }}
      </Formik>
      <style>{`

      :global(.MuiInput-underline:before) {
          border-bottom: 1px solid red !important;
        }
        .MuiFormLabel-root{
          color: ${theme.type === "light" ? "#000" : "#EEEEEE"};
        }

        input::placeholder{
          font-size:13px !important;
          color: var(--l_app_text) !important;
        }

        input{
          background:${theme.type === "light" ? "#fff" : "#1E1C22"} !important;
          border:${theme.type === "dark" && "none !important"};
          padding: 0.9rem !important;
          margin-top: 5px !important;
        }
        :global(.dv_form_control:focus) {
          box-shadow:  ${theme.type === "dark" && "inset 0px 0px 0px 1px #7426F2 !important"};
          border: ${theme.type === "dark" && "none !important;"};
          background: ${theme.type === "light" ? "#000" : "#121212"} !important;
          padding: 0.9rem !important;
        }
        label{
          color:${theme.type === "light" ? "#000" : "#EEEEEE"} !important;
        }
        .emailSignin #dv_email_usr{
          padding-right:10% !important;
        }
        .passwordSignin #pwd_usr1{
          padding-right:20% !important;
        }
        .txt-underline:hover{
          text-decoration: underline;
      }
        
      `} </style>
    </>
  );
}

export default DVLoginForm;
