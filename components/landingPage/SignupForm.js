import React, { useRef, useState } from "react";
import useLang from "../../hooks/language";
import { Paper } from "@material-ui/core";
import {
  close_dialog,
  focus,
  greaterThanSixDigit,
  lowercaseCharacter,
  numericValue,
  open_dialog,
  open_drawer,
  setAuthData,
  specialCharacter,
  startLoader,
  stopLoader,
  Toast,
  uppercaseCharacter,
  validatePasswordField,
} from "../../lib/global";
import DVInputPassword from "../DVformControl/DVinputPassword";
import DVinputText from "../DVformControl/DVinputText";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { defaultTimeZone } from "../../lib/config";
import { TIME_ZONE_KEY_LABEL } from "../../lib/timezones";
import useForm from "../../hooks/useForm";
import {
  UserRegistrationPayload,
  VerifyEmail,
} from "../../lib/data-modeling";
import { signUp, validateEmail, validateReferralCodeRequest } from "../../services/auth";
import { setCookie, setLocalStorage } from "../../lib/session";
import { clearAllPostsAction } from "../../redux/actions/dashboard/dashboardAction";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import CheckOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import { useRouter } from "next/router";
import Button from "../button/button";
import { useTheme } from "react-jss";
import isMobile from "../../hooks/isMobile";
import { isSubDomain } from "../../lib/config/domain";

function Juicysignupform(props) {
  const [lang] = useLang();
  const theme = useTheme();
  const [mobileView] = isMobile();
  const router = useRouter();
  const renderCount = useRef(0);
  const [isSceduleTime, setIsSceduleTime] = useState({
    value: TIME_ZONE_KEY_LABEL[defaultTimeZone().toLowerCase()],
  });
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [signUpdata, setSignupPayload] = useState({
    ...(props.signup || {}),
  });
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [passwordValidationScreen, setPassvalidScreen] = useState(false);
  const [emailErrValid, setEmailErrValid] = useState(false);
  const [isNSFWAllow, setIsNSFWAllow] = React.useState();
  const [validRefCode, setValidRefCode] = useState(true);
  const [refValue, setRefValue] = useState("");

  const handleTimeScedule = (event) => {
    setIsSceduleTime(event);
  };

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

  const [
    Register,
    value,
    error,
    isValid,
    setElementError,
    validTik,
    setValidTik,
    setValidInputMsg,
    validMsg,
  ] = useForm({
    defaultValue: { ...(props.signup || {}) },
    emptyAllow: true,
    isDesktop: true,
    isUsername: false,
  });

  useEffect(() => {
    focus("firstName");
  }, []);

  useEffect(() => {
    if (Object.entries(value).length >= 3) {
      callUserSignUpApi();
    }
  }, [isNSFWAllow]);

  useEffect(() => {
    value.password = password;
    ValidatePassword();
    ValidateSixDigitsInPassword();
    ValidateNumeralInPassword();
    ValidateSpecialCharacterInPassword();
    ValidateUppercaseCharacterInPassword();
  }, [password]);

  // Validate Email Address
  const validateEmailAddress = async (inputValue) => {
    return new Promise(async (res, rej) => {
      try {
        VerifyEmail.email = inputValue || value.email;
        VerifyEmail.type = 2;
        // VerifyEmail.userType = getCookie("userType");
        const response = await validateEmail(VerifyEmail);
        setValidInputMsg("email", response?.data?.message);
        res();
      } catch (e) {
        console.error("validateEmailAddress", e);
        e.response && setElementError("email", e?.response?.data?.message);
        e.response.status == 412 ? setEmailErrValid(true) : '';
        rej();
      }
    });
  };

  // Validate Ref Code
  const validateRefCode = async (refCode) => {
    return new Promise(async (res, rej) => {
      try {
        const response = await validateReferralCodeRequest(refCode);
        setValidRefCode(true);
        res();
      } catch (e) {
        console.error("response", e);
        setValidRefCode(false);
        close_dialog();
        setElementError("refCode", e?.response?.data?.message);
        rej();
      }
    });
  };
  // Check validations and if valid then submit form
  const goToRef = async (e) => {
    e && e.preventDefault();
    // Check email validation whiile subm
    try {
      if (!e.target.value) setValidRefCode(true);
      if (e.target.value) {
        await validateRefCode(e.target.value);
      }
    } catch (e) {
      return;
    }
  };

  useEffect(() => {
    goToRef(refValue);
  }, [refValue, validRefCode]);

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

  const NSFWContentDialog = () => {
    !mobileView ? open_dialog("NSFW_Signup", {
      userSignup: true,
      setIsNSFWAllow: (value) => {
        setIsNSFWAllow(value);
      },
    }) : open_drawer("NSFW_Signup", {
      userSignup: true,
      setIsNSFWAllow: (value) => {
        setIsNSFWAllow(value);
      },
    }, "right");
  };

  const callUserSignUpApi = async () => {
    try {
      startLoader();
      let payload = { ...UserRegistrationPayload };

      payload.firstName = value.firstName;
      payload.email = value.email;
      payload.password = value.password;
      payload.isNSFWAllow = isNSFWAllow;
      if(value.lastName?.length > 0) {
        payload.lastName = value.lastName;
      }
      if (value.refCode?.length > 0) {
        payload.inviterReferralCode = value.refCode;
      }
      payload.timezone = isSceduleTime.value.value;

      const res = await signUp(payload);
      stopLoader();

      if (res.status === 200) {
        const data = res?.data?.data ? res.data.data : {};
        setLocalStorage("streamUserId", data?.user?.isometrikUserId);
        setAuthData({ ...data.token, ...data.user });
        dispatch(clearAllPostsAction());
        setCookie("auth", true);
        setCookie("guest", false);
        setCookie("userType", 1);
        setCookie("zone", payload.timezone);
        // setCookie("guest", false);
        // setCookie("auth", true);
        // setAuthData(res.data.data.data);

        // setVal(true);
        // Route.push("/");
        router.push("/");
        close_dialog();
      } else {
        close_dialog();
        
        return;
      }
    } catch (err) {
      stopLoader();
      if (err.response) {
        Toast(err.response.data.message, "error");
      }
      console.error("ERROR IN callUserSignUpApi", err);
      close_dialog();
      setIsNSFWAllow(null)
      return;
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
          },
        }));
      }

      setPasswordCheck((prev) => ({
        ...prev,
        six_digits: {
          ...prev.six_digits,
          state: false,
        },
      }));
    } catch (e) {
      console.error("ERROR IN ValidateSixDigitsInPassword", e);
      setPasswordCheck((prev) => ({
        ...prev,
        six_digits: {
          ...prev.six_digits,
          state: false,
        },
      }));
    }
  };

  const ValidateNumeralInPassword = () => {
    try {
      const response = numericValue(password);
      if (response) {
        return setPasswordCheck((prev) => ({
          ...prev,
          a_numeric: {
            ...prev.a_numeric,
            state: true,
          },
        }));
      }

      setPasswordCheck((prev) => ({
        ...prev,
        a_numeric: {
          ...prev.a_numeric,
          state: false,
        },
      }));
    } catch (e) {
      console.error("ERROR IN ValidateNumeralInPassword", e);
      setPasswordCheck((prev) => ({
        ...prev,
        a_numeric: {
          ...prev.a_numeric,
          state: false,
        },
      }));
    }
  };

  const ValidateSpecialCharacterInPassword = () => {
    try {
      const response = specialCharacter(password);
      if (response) {
        return setPasswordCheck((prev) => ({
          ...prev,
          special_char: {
            ...prev.special_char,
            state: true,
          },
        }));
      }

      setPasswordCheck((prev) => ({
        ...prev,
        special_char: {
          ...prev.special_char,
          state: false,
        },
      }));
    } catch (e) {
      console.error("ERROR IN ValidateSpecialCharacterInPassword", e);
      setPasswordCheck((prev) => ({
        ...prev,
        special_char: {
          ...prev.special_char,
          state: false,
        },
      }));
    }
  };

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
          },
        }));
      }

      setPasswordCheck((prev) => ({
        ...prev,
        uppercase: {
          ...prev.uppercase,
          state: false,
        },
      }));
    } catch (e) {
      console.error("ERROR IN ValidateUppercaseCharacterInPassword", e);
      setPasswordCheck((prev) => ({
        ...prev,
        uppercase: {
          ...prev.uppercase,
          state: false,
        },
      }));
    }
  };

  return (
    <>
      <form className="mb-2">
        <div className="row">
          <div className="col pr-1">
            <div className="position-relative">
              <DVinputText
                className="form-control forminput_firstname stopBack text-capitalize"
                id="firstName"
                defaultValue={signUpdata.firstName || ""}
                name="firstName"
                error={error.firstName}
                ref={Register({
                  validate: [
                    {
                      validate: "required",
                      error: lang.firstNameError,
                    },
                  ],
                })}
                placeholder={`${lang.firstNamePlaceholder} *`}
                autoFocus
                type="firstname"
                disabledField={!isSubDomain}
              />
            </div>
          </div>
          <div className="col pl-1">
            <div className="position-relative">
              <DVinputText
                className="form-control forminput_lastname stopBack text-capitalize"
                defaultValue={signUpdata.lastName || ""}
                name="lastName"
                error={error.lastName}
                ref={Register({ emptyAllow: true })}
                placeholder={`${lang.lastNamePlaceholder}`}
                type="lastname"
                disabledField={!isSubDomain}
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <div className="position-relative">
              <DVinputText
                className="form-control pl-2 forminput_email stopBack"
                id="email"
                name="email"
                defaultValue={signUpdata.email}
                error={error.email}
                validMsg={validMsg.email}
                ref={Register({
                  onBlur: validateEmailAddress,
                  validate: [
                    {
                      validate: "required",
                      error: lang.emailError1,
                    },
                    {
                      validate: "email",
                      error: lang.emailError2,
                    },
                  ],
                })}
                placeholder={`Email *`}
                style={{ borderBottom: "1px soild " }}
                type="email"
                switchToUser={'USER'}
                disabledField={!isSubDomain}
              />
            </div>
          </div>
        </div>
        <div className="row signup__modal">
          <div className="col">
            <div className="position-relative password_section">
              <DVInputPassword
                className="forminput_password stopBack"
                defaultValue={signUpdata.password}
                name="password"
                error={error.password}
                placeholder={`${lang.passwordPlaceholder} *`}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPassvalidScreen(true)}
                onBlur={() => setPassvalidScreen(false)}
                ref={Register({
                  validate: [
                    {
                      validate: "function",
                      function: () => {
                        if (
                          passwordCheck.six_digits.state &&
                          passwordCheck.a_numeric.state &&
                          passwordCheck.uppercase.state &&
                          passwordCheck.special_char.state
                        ) {
                          return {
                            error: false,
                            errorMessage: "",
                          };
                        } else {
                          return {
                            error: true,
                            errorMessage: lang.passwordError2,
                          };
                        }
                      },
                    },
                  ],
                })}
                disabledField={!isSubDomain}
              />
            </div>
            {passwordValidationScreen && (
              <Paper
                className={`position-absolute ${isPasswordValid ? "text-success" : "text-danger"
                  }`}
                style={{ zIndex: 2, width: "max-content" }}
              >
                {Object.values(passwordCheck).map((checker) => (
                  <div
                    key={checker.id}
                    className={`d-flex align-items-center p-1 ${checker.state ? "text-success" : "text-danger"
                      }`}
                  >
                    <CheckOutlineIcon fontSize="small" className="mr-2" />
                    <p className="mb-0 fntSz14 font-weight-500">
                      {checker.str}
                    </p>
                  </div>
                ))}
              </Paper>
            )}
          </div>
        </div>

        <div className="date_schedule_picker">
          <div
            className="position-relative p-0"
            onClick={() => {
              isSubDomain && mobileView ? open_drawer("timeZone", {
                setIsSceduleTime: (selectTimezone) =>
                    setIsSceduleTime(selectTimezone),
                isSceduleTime,
            },"right") :
            open_dialog("timeZone", {
                setIsSceduleTime: (selectTimezone) =>
                  setIsSceduleTime(selectTimezone),
                isSceduleTime,
              })
            }}
          >
            <DVinputText
              className="form-control dv_form_control cursor-pointer"
              name="juicyTimeZone"
              placeholder={lang.selectTimeZone}
              // onChange={handleTimeScedule}
              value={isSceduleTime?.value?.label}
              disabledField
            />
            <ArrowForwardIosIcon
              className="arrow_on_right position-absolute dv_appTxtClr_web cursor-pointer fntSz15"
              width='1em'
              height='1em'
            />
          </div>
        </div>
        <div className=" mb-3 signup__modal">
          {/* Referal Code Text Field */}
          <div className="">
            <div className="position-relative">
              <DVinputText
                // labelTitle="Referral Code"
                className="form-control forminput_lastname dv_registration_field dv_form_control"
                defaultValue={signUpdata.refCode || router.query.referId}
                ref={Register({ emptyAllow: true })}
                name="refCode"
                error={error.refCode}
                placeholder={lang.refCode}
                typeCheck="refCode"
                autoComplete='off'
                onChange={(e) => {
                  setRefValue(e);
                }}
                type="refCode"
                disabledField={!isSubDomain}
              />
            </div>
          </div>
        </div>
        <Button
          type="button"
          onClick={(e) => callUserSignUpApi()}
          fclassname="mt-2 w-100 cursorPtr font-weight-500"
          cssStyles={{
            ...theme.blueButton,
            padding: "12px 0px",
            fontFamily: 'Roboto',
            borderRadius: '12px',
            background: "linear-gradient(91.19deg, rgba(255, 26, 170) 0%, #460a56 100%)",
          }}
          disabled={!(isValid && isSubDomain)}
          // disabled
        >
          Signup as a User
        </Button>
      </form>
      <style jsx>
        {`
        :global(input:-webkit-autofill),
       :global( input:-webkit-autofill:hover),
        :global(input:-webkit-autofill:focus),
        :global(input:-webkit-autofill:active) {
            transition: background-color 5000s ease-in-out 0s !important;
            -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
        }
          :global(.error-tooltip-container) {
            top: 51% !important;
          }
          :global(.password_section .error-tooltip-container){
            right: 28px !important;
          }
          :global(.password_section .error-tooltip) {
            right: 47px !important;
          }
          :global(.forminput_email),
          :global(.forminput_password),
          :global(.forminput_firstname),
          :global(.forminput_lastname) {
            color: #e1e1e1 !important;
            background: none !important;
            border: 1px solid #818196 !important;
            border-radius: 12px !important;
            filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25)) !important;
            font-family: "Inter";
            padding: 15px 10% 15px 15px !important;
            height: 3.2rem !important;
            font-weight: 300 !important;
            font-size: 14px;
          }
          :global(.forminput_email:focus),
          :global(.forminput_password:focus),
          :global(.forminput_firstname:focus),
          :global(.forminput_lastname:focus) {
            color: #e1e1e1 !important;
            background: none !important;
            border: 1px solid #818196 !important;
            border-radius: 12px !important;
            filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25)) !important;
            font-family: "Inter";
            padding: 15px 10% 15px 15px !important;
            height: 3.2rem !important;
            font-weight: 300 !important;
            font-size: 14px;
          }
          :global(input::placeholder) {
            color: #ffffff !important;
          }
          :global(.forminput_password) {
            padding-right: 21% !important;
          }
          :global(.form-group) {
            margin-bottom: 7px !important;
          }
          :global(.MuiInputBase-input) {
            color: #e1e1e1 !important;
            font-weight: 300;
            font-size: 13px;
          }
          :global(.MuiInput-underline:before),
          :global(.MuiInput-underline:after) {
            border: none !important;
            color: #e1e1e1 !important;
          }
          :global(.MuiSelect-select:focus) {
            background: none !important;
            color: #e1e1e1 !important;
          }
          :global(svg) {
            color: #e9e9e9 !important;
            fill: #e9e9e9 !important;
          }
          // :global(.form-group .input-error-error ~ .setRgtPosAbs) {
          //   right: 18% !important;
          // }
          :global(.sign_up_nameInput .form-group .form-group) {
            margin-bottom: 0px !important;
          }
          :global(.dv_form_control),
          :global(.dv_form_control:focus) {
            color: #e1e1e1 !important;
            background: none !important;
            font-family: "Inter";
            padding-right: 15% !important;
          }
          :global(.date_schedule_picker .dv_form_control),
          :global(.date_schedule_picker .dv_form_control:focus) {
            border: none !important;
            font-size: 0.8rem !important;
          }
          :global(.dv_setRgtPosAbs) {
            top: 50% !important;
          }

          :global(.dv_appTxtClr_web) {
            top: 30% !important;
            transform: rotate(90deg);
          }
          @media screen and (min-width: 1400px) {
            :global(.forminput_email),
            :global(.forminput_password),
            :global(.forminput_firstname),
            :global(.forminput_lastname) {
              font-size: 1vw !important;
              height: 3.5vw !important;
              margin: 10px 0px;
            }
            :global(.time_selector div) {
              font-size: 1vw !important;
              line-height: initial;
            }
            :global(.sign_up_nameInput .form-group .form-group) {
              margin-bottom: 0px !important;
            }
          }
        `}
      </style>
    </>
  );
}

export default Juicysignupform;
