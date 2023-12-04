import React, { useEffect, useState } from "react";
import { useTheme } from "react-jss";
import { Paper } from "@material-ui/core";
import CheckOutlineIcon from "@material-ui/icons/CheckCircleOutline";

import Button from "../../../components/button/button";
import InputPassword from "../../../components/formControl/inputPassword";
import useLang from "../../../hooks/language";
import useForm from "../../../hooks/useForm";
import { greaterThanSixDigit, lowercaseCharacter, movetoNext, numericValue, specialCharacter, uppercaseCharacter, validatePasswordField } from "../../../lib/global";

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

  // Form Hooks
  const [Register, value, error, isValid, setElementError] = useForm({
    defaultValue: { ...signUpdata },
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

  React.useEffect(() => {
    setCustomVhToBody();
    window.addEventListener('resize', setCustomVhToBody);

    return () => {
      window.removeEventListener('resize', setCustomVhToBody);
    };
  }, []);

  return (
    <form
      onSubmit={(e) => {
        e && e.preventDefault();
        setStap(value);
      }}
    >
      <div className="w-330 mx-auto dynamicHeight">
        <div className="col-12">
          <div className="mb-4">

            {/* Password */}
            <div className="position-relative">
              <InputPassword
                // autoFocus
                name="password"
                error={error.password}
                onKeyUp={(e) => movetoNext(e, "conf_pass")}
                defaultValue={signUpdata.password}
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
                      <p className='mb-0 fntSz10 text-left font-weight-500'>{checker.str}</p>
                    </div>
                  ))}
                </Paper>
              )}
            </div>

            {/* Confirm Password */}
            {/* <InputPassword
              // ref={Register()}
              id="conf_pass"
              defaultValue={signUpdata.confirmPassword}
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
            /> */}
          </div>
        </div>
        <div className="posBtm">
          <Button
            disabled={!isValid}
            type="submit"
            // onClick={(e) => {
            //   e && e.preventDefault();
            //   setStap(value);
            // }}
            cssStyles={theme.blueButton}
            id="scr6"
          >
            {lang.next}
          </Button>
        </div>
      </div>
      <style jsx>{`
        .dynamicHeight {
            height: calc(var(--vhCustom, 1vh) * 100) !important;
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
