import React, { useEffect, useState } from "react";
import { useTheme } from "react-jss";
import { Paper } from "@material-ui/core";
import CheckOutlineIcon from "@material-ui/icons/CheckCircleOutline";

import Button from "../../../components/button/button";
import InputPassword from "../../../components/formControl/inputPassword";
import InputText from "../../../components/formControl/inputText";
import useLang from "../../../hooks/language";
import useForm from "../../../hooks/useForm";
import { VerifyEmail } from "../../../lib/data-modeling";
import { greaterThanSixDigit, lowercaseCharacter, movetoNext, numericValue, specialCharacter, startLoader, stopLoader, uppercaseCharacter, validatePasswordField } from "../../../lib/global";
import { validateEmail } from "../../../services/auth";


const Password = (props) => {
  const theme = useTheme();
  const [lang] = useLang();
  const { setStap, signUpdata = {} } = props;

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

  const [
    Register,
    value,
    error,
    isValid,
    setElementError,
    validTik,
    setValidTik,
  ] = useForm();

  const validateEmailAddress = async (inputValue) => {
    return new Promise(async (res, rej) => {

      if (error.email) {
        res();
        return;
      }
      try {
        VerifyEmail.email = inputValue || value.email;
        VerifyEmail.type = 2;
        // VerifyEmail.userType = getCookie("userType");

        const response = await validateEmail(VerifyEmail);

        setValidTik(true);
        res();
      } catch (e) {
        console.error("ERROR IN validateEmailAddress", e);
        setElementError(
          "email",
          (e && e.response && e.response.data && e.response.data.message) || ""
        );
        rej();
      }
    });
  };

  //check validations and if valid then submit form
  const goToNext = async (e) => {
    // check email validation whiile submit
    e && e.preventDefault();
    // startLoader();
    try {
      await validateEmailAddress();
    } catch (e) {
      console.error("ERROR IN goToNext", e);
      return;
    }
    // stopLoader();
    // console.log("ASdasdsd");
    setStap(value);
  };

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

  useEffect(() => {
    value.password = password;
    ValidatePassword();
    ValidateSixDigitsInPassword();
    ValidateNumeralInPassword();
    ValidateSpecialCharacterInPassword();
    ValidateUppercaseCharacterInPassword();
  }, [password]);

  const setCustomVhToBody = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vhCustom', `${vh}px`);
  };

  useEffect(() => {
    setCustomVhToBody();
    window.addEventListener('resize', setCustomVhToBody);

    return () => {
      window.removeEventListener('resize', setCustomVhToBody);
    };
  }, []);

  return (
    <form>
      <div>
        <div className="w-330 mx-auto content-secion" style={{ height: "calc(var(--vhCustom, 1vh) * 60)", overflow: "hidden" }}>
          <div className="col-12 text-center">
            {/* <h4 className="titleH4 mb-5">{lang.enterEmailPassword}</h4> */}
            <div className="mb-4">
              <div className="form-group" />
              {/* Email */}
              <InputText
                autoFocus
                valid={validTik}
                name="email"
                type="email"
                inputMode="email"
                onKeyUp={(e) => movetoNext(e, "password")}
                defaultValue={signUpdata.email}
                error={error.email}
                // onBlur={validateEmailAddress}
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
                placeholder={lang.emailPlaceholder}
              />

              {/* Password */}
              <div className="position-relative">
                <InputPassword
                  defaultValue={signUpdata.password}
                  name="password"
                  id="password"
                  onKeyUp={(e) => movetoNext(e, "conf_password")}
                  error={error.password}
                  ref={Register({
                    ref: "confirmPassword",
                    refErrorMessage: lang.passwordError3,
                    validate: [{
                      validate: "required",
                      error: lang.passwordError1,
                    },
                      // {
                      //   validate: "password",
                      //   error: lang.pwdErrorMsg3,
                      // },
                    ],
                  })}
                  placeholder={lang.passwordPlaceholder}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPassvalidScreen(true)}
                  onBlur={() => setPassvalidScreen(false)}
                />
                {passwordValidationScreen && (
                  <Paper className={`position-absolute w-100 ${isPasswordValid ? "text-success" : "text-danger"}`} style={{ zIndex: 2 }}>
                    {Object.values(passwordCheck).map((checker) => (
                      <div key={checker.id} className={`d-flex align-items-start p-1 card_bg ${checker.state ? "text-success" : "text-danger"}`}>
                        <CheckOutlineIcon fontSize="small" className='mr-2' />
                        <p className='mb-0 fntSz14 text-left font-weight-500'>{checker.str}</p>
                      </div>
                    ))}
                  </Paper>
                )}
              </div>

              {/* Confirm Password */}
              <InputPassword
                defaultValue={signUpdata.confirmPassword}
                // ref={Register()}
                id="conf_password"
                error={error.confirmPassword}
                ref={Register({
                  validate: [
                    {
                      validate: "password",
                      error: lang.passwordError2,
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
                name="confirmPassword"
                placeholder={lang.confirmPasswordPlaceholder}
              />
            </div>
          </div>
        </div>

        <div className={`${navigator.userAgent.match(/Android/i) ? "" : "terms_policy_sec"}`}>
          <div className="txt-book fntSz14 text-center mb-3">
            {lang.byCreating + " "} <br />
            <a
              className="txt-heavy"
              href="terms-and-conditions"
              target="_blank"
            >
              {lang.termandcondition + " "}
            </a>{" "}
            {lang.and + " "} &nbsp;
            <a className="txt-heavy" href="privacy-policy" target="_blank">
              {lang.privacyAndPolicy}
            </a>
          </div>
        </div>
        <div className={`${navigator.userAgent.match(/Android/i) ? "posBtm2" : "posBtm"}`}>
          <Button
            disabled={!isValid}
            type="submit"
            onClick={goToNext}
            // onClick={props.submitForm}
            cssStyles={theme.blueButton}
            id="scr2"
          >
            {lang.next}
          </Button>
        </div>
      </div>
      <style jsx>{`
          .posBtm2 {
            position: relative;
            bottom: 20px;
            left: 50%;
            z-index: 1;
            width: 100%;
            max-width: 350px;
            transform: translateX(-50%);
            padding: 0 15px;
          }
          :global(.MuiPaper-rounded){
            border-radius:0px;
            border:1px solid var(--l_grey_border);
          }
      `}</style>
    </form>
  );
};

export default React.memo(Password);
