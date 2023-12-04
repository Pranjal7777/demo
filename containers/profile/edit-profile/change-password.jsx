import React, { useEffect, useRef, useState } from "react";
import CheckOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import Router from "next/router";
import { useTheme } from "react-jss";
import { Paper } from "@material-ui/core";

import useLang from "../../../hooks/language";
import InputPassword from "../../../components/formControl/inputPassword";
import {
  clearAll,
  drawerToast,
  greaterThanSixDigit,
  lowercaseCharacter,
  numericValue,
  open_dialog,
  specialCharacter,
  startLoader,
  stopLoader,
  Toast,
  uppercaseCharacter,
  validatePasswordField,
} from "../../../lib/global";
import { updatePassword } from "../../../services/auth";
import useForm from "../../../hooks/useForm";
import useProfileData from "../../../hooks/useProfileData";
import isMobile from "../../../hooks/isMobile";
import Button from "../../../components/button/button";
import Header from "../../../components/header/header";

export default function ChangePassword(props) {
  const { isAgency } = props;
  const theme = useTheme();
  const [profile] = useProfileData();
  const [mobileView] = isMobile();
  const [lang] = useLang();

  const [Register, value, error, isValid, setElementError] = useForm({
    defaultValue: {},
  });

  const [password, setPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [passwordValidationScreen, setPassvalidScreen] = useState(false);
  const [passwordCheck, setPasswordCheck] = useState({
    six_digits: {
      id: 1,
      str: lang.passSixDigits,
      state: false,
    },
    a_numeric: {
      id: 2,
      str: lang.passNumeral,
      state: false,
    },
    uppercase: {
      id: 3,
      str: lang.passUpper,
      state: false,
    },
    special_char: {
      id: 4,
      str: lang.passSpecialChar,
      state: false,
    },
  });

  // Validate Password
  const ValidatePassword = () => {
    try {
      const response = validatePasswordField(password);
      response ? setIsPasswordValid(true) : setIsPasswordValid(false);

    } catch (e) {
      console.error("ERROR IN ValidatePassword", e);
      setIsPasswordValid(false);
    }
  };

  const ValidateSixDigitsInPassword = () => {
    try {
      const response = greaterThanSixDigit(password);

      if (response) {
        return setPasswordCheck((prev) => ({
          ...prev,
          six_digits: {
            ...prev.six_digits,
            state: true,
          }
        }));
      }

      setPasswordCheck((prev) => ({
        ...prev,
        six_digits: {
          ...prev.six_digits,
          state: false,
        }
      }));
    } catch (e) {
      console.error("ERROR IN ValidateSixDigitsInPassword", e);
      setPasswordCheck((prev) => ({
        ...prev,
        six_digits: {
          ...prev.six_digits,
          state: false,
        }
      }));
    }
  }

  const ValidateNumeralInPassword = () => {
    try {
      const response = numericValue(password);
      if (response) {
        return setPasswordCheck((prev) => ({
          ...prev,
          a_numeric: {
            ...prev.a_numeric,
            state: true,
          }
        }));
      }

      setPasswordCheck((prev) => ({
        ...prev,
        a_numeric: {
          ...prev.a_numeric,
          state: false,
        }
      }));

    } catch (e) {
      console.error("ERROR IN ValidateNumeralInPassword", e);
      setPasswordCheck((prev) => ({
        ...prev,
        a_numeric: {
          ...prev.a_numeric,
          state: false,
        }
      }));
    }
  }

  const ValidateSpecialCharacterInPassword = () => {
    try {
      const response = specialCharacter(password);
      if (response) {
        return setPasswordCheck((prev) => ({
          ...prev,
          special_char: {
            ...prev.special_char,
            state: true,
          }
        }));
      }

      setPasswordCheck((prev) => ({
        ...prev,
        special_char: {
          ...prev.special_char,
          state: false,
        }
      }));

    } catch (e) {
      console.error("ERROR IN ValidateSpecialCharacterInPassword", e);
      setPasswordCheck((prev) => ({
        ...prev,
        special_char: {
          ...prev.special_char,
          state: false,
        }
      }));
    }
  }

  const ValidateUppercaseCharacterInPassword = () => {
    try {
      const response1 = uppercaseCharacter(password);
      const response2 = lowercaseCharacter(password);

      if (response1 && response2) {
        return setPasswordCheck((prev) => ({
          ...prev,
          uppercase: {
            ...prev.uppercase,
            state: true,
          }
        }));
      }

      setPasswordCheck((prev) => ({
        ...prev,
        uppercase: {
          ...prev.uppercase,
          state: false,
        }
      }));

    } catch (e) {
      console.error("ERROR IN ValidateUppercaseCharacterInPassword", e);
      setPasswordCheck((prev) => ({
        ...prev,
        uppercase: {
          ...prev.uppercase,
          state: false,
        }
      }));
    }
  }

  const resetPassword = () => {
    if (value.currentPassword == value.password) {
      Toast(lang.passwordError5, "error");
      return;
    }

    startLoader();
    updatePassword({
      newPassword: value.password,
      currentPassword: value.currentPassword,
    })
      .then((data) => {
        if (!mobileView) {
          open_dialog("successfullDialog", {
            title: lang.passwordChnaged,
            desc: data.data.message,
            closeIconVisible: false,
            titleClass: "max-full",
            autoClose: true,
            closeAll: true,
          });
        } else {
          drawerToast({
            title: lang.passwordChnaged,
            desc: data.data.message,
            closeIconVisible: false,
            titleClass: "max-full",
            autoClose: true,
          });
        }
        stopLoader();
        clearAll();
        setTimeout(() => {
          isAgency ? Router.push('/agencyLogin') : Router.push("/login");
        }, 1500);
      })
      .catch((e) => {
        stopLoader();
        e.response && Toast(e.response.data.message, "error");
      });
  };

  useEffect(() => {
    value.password = password;
    ValidatePassword();
    ValidateSixDigitsInPassword();
    ValidateNumeralInPassword();
    ValidateSpecialCharacterInPassword();
    ValidateUppercaseCharacterInPassword();
  }, [password]);

  return (
    <div className={mobileView ? "wrap" : ""}>
      {mobileView
        ? ""
        : <button
          type="button"
          className="close dv__modal_close"
          onClick={() => props.onClose()}
        >
          {lang.btnX}
        </button>
      }

      <div
        className={mobileView ? "scr wrap-scr bg-dark-custom" : ""}
        style={mobileView ? { paddingTop: "70px" } : {}}
      >
        <div className="col-12">
          {mobileView
            ? <Header title={lang.changePassword} />
            : <h5 className="content_heading px-1 py-3 m-0 text-center">
              {props.isAgency ? lang.resetPassword : lang.changePassword}
            </h5>
          }
        </div>
        <div className="col-12 py-2 px-4 widthmodal ">

          {/* Current Password */}
          {props.isAgency && <p className="label__title text-dark mb-1">CurrentPassword</p>}
          <InputPassword
            autoFocus
            name="currentPassword"
            error={error.currentPassword}
            // defaultValue={signUpdata.password}
            ref={Register({
              validate: [
                {
                  validate: "required",
                  error: lang.passwordError1,
                },
              ],
            })}
            className={mobileView ? "" : `dv__border_bottom_profile_input isAgborder`}
            placeholder={lang.currentPassword}
            isAgency
          />

          {/* New Password */}
          {props.isAgency && <p className="label__title text-dark mb-1">NewPassword</p>}
          <div className="position-relative">
            <InputPassword
              name="password"
              error={error.password}
              // defaultValue={signUpdata.password}
              className={mobileView ? "" : "dv__border_bottom_profile_input isAgborder"}
              ref={Register({
                ref: "confirmPassword",
                refErrorMessage: lang.passwordError3,
                validate: [
                  {
                    validate: "required",
                    error: lang.passwordError1,
                  },
                  // {
                  //   validate: "password",
                  //   error: lang.pwdErrorMsg3,
                  // },
                ],
              })}
              placeholder={lang.newPasswordPlaceholder}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPassvalidScreen(true)}
              onBlur={() => setPassvalidScreen(false)}
              isAgency
            />

            {passwordValidationScreen && (
              <Paper className={`position-absolute w-100 ${isPasswordValid ? "text-success" : "text-danger"}`} style={{ zIndex: 2 }}>
                {Object.values(passwordCheck).map((checker) => (
                  <div key={checker.id} className={`d-flex align-items-start p-1 ${checker.state ? "text-success" : "text-danger"}`}>
                    <CheckOutlineIcon fontSize="small" className='mr-2' />
                    <p className='mb-0 fntSz14 text-left font-weight-500'>{checker.str}</p>
                  </div>
                ))}
              </Paper>
            )}
          </div>

          {/* New Password Confirm */}
          {props.isAgency && <p className="label__title text-dark mb-1">Confirm Password</p>}
          <InputPassword
            // defaultValue={signUpdata.confirmPassword}
            error={error.confirmPassword}
            ref={Register({
              validate: [
                {
                  validate: "password",
                  error: lang.passwordError4,
                },
                {
                  validate: "function",
                  function: (cpassword) => {
                    if (cpassword != value.password) {
                      return {
                        error: true,
                        errorMessage: lang.passwordError3,
                      };
                    } else {
                      return {
                        error: false,
                        errorMessage: "",
                      };
                    }
                  },
                },
              ],
            })}
            className={mobileView ? "" : "dv__border_bottom_profile_input isAgborder"}
            name="confirmPassword"
            placeholder={lang.confirmPasswordPlaceholder}
            isAgency
          />

          <Button
            type="submit"
            disabled={!isValid}
            fclassname="my-3"
            cssStyles={theme.blueButton}
            onClick={resetPassword}
          >
            {lang.update}
          </Button>
          <div className="txt-roman fntSz12 text-center">
            {/* To change your phone number we need your confirmation. Please enter
            the verification code send to your phone. */}
          </div>
        </div>
      </div>
      <style jsx>{`
      :global(.isAgborder),
      :global(.isAgborder:focus){
        border: ${props.isAgency && "2px solid var(--l_grey_border)"} !important;
        border-radius:${props.isAgency && "8px"} !important;
        background:${props.isAgency && "#fff"} !important;
        color:#000 !important;
        padding-left:0.8rem !important;
      }
      :global(.isAgborder::placeholder){
        font-size:15px !important;
      }
      :global(.btmModal){
        background:${props.isAgency && "#fff"} !important;
        color:${props.isAgency && "#000"} !important;
      }
      :global(.dv__modal_close){
        color:${props.isAgency && "#000"} !important;
      }
      .content_heading{
        color:${props.isAgency && "#000"} !important;
      }
      .widthmodal{
        width:40rem;
      }
      `}</style>
    </div>
  );
}
