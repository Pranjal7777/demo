import React, { useEffect } from "react";
import Button from "../../../components/button/button";
import InputText from "../../../components/formControl/inputText";
import useLang from "../../../hooks/language";
import useForm from "../../../hooks/useForm";
import { VerifyEmail } from "../../../lib/data-modeling";
import { focus, startLoader, stopLoader } from "../../../lib/global";
import { getCookie } from "../../../lib/session";
import { validateEmail } from "../../../services/auth";
import { useTheme } from "react-jss";

const Email = (props) => {
  const theme = useTheme();
  const [lang] = useLang();
  const { setStap, signUpdata = {} } = props;
  const [
    Register,
    value,
    error,
    isValid,
    setElementError,
    validTik,
    setValidTik,
  ] = useForm({
    defaultValue: { ...signUpdata },
  });

  const validateEmailAddress = async (inputValue) => {
    return new Promise(async (res, rej) => {
      try {
        VerifyEmail.email = inputValue || value.email;
        VerifyEmail.type = 2;
        // VerifyEmail.userType = getCookie("userType");

        // VerifyEmail.email = VerifyEmail.email && VerifyEmail.email.toLowerCase() || ''
        const response = await validateEmail(VerifyEmail);
        setValidTik(true);
        res();
      } catch (e) {
        console.error("validateEmailAddress", e);
        e.response && setElementError("email", e.response.data.message);
        rej();
      }
    });
  };

  //check validations and if valid then submit form
  const goToNext = async (e) => {
    e && e.preventDefault();
    // check email validation whiile submit
    // startLoader();
    try {
      await validateEmailAddress();
    } catch (e) {
      return;
    }
    // stopLoader();
    setStap(value);
  };

  useEffect(() => {
    focus("email");
  }, []);

  // console.log("sadasdsadsa", signUpdata, isValid);
  return (
    <form onSubmit={goToNext}>
      <div className="w-330 mx-auto pb-3">
        <div className="col-12 text-center">
          <div className="mb-4">
            <div className="form-group">
              <InputText
                autoFocus
                valid={validTik}
                id={"email"}
                defaultValue={signUpdata.email}
                name="email"
                error={error.email}
                inputMode="email"
                autoCapitalize="off"
                type="email"
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
              ></InputText>
            </div>
          </div>
        </div>
      </div>
      <div className="posBtm">
        <Button
          disabled={!isValid}
          role="button"
          type="submit"
          // onClick={goToNext}
          cssStyles={theme.blueButton}
          id="scr6"
        >
          {lang.next}
        </Button>
      </div>
    </form>
  );
};

export default React.memo(Email);
