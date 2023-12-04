import React, { useEffect } from "react";
import Button from "../button/button";
import InputText from "../formControl/inputText";
import useLang from "../../hooks/language";
import useForm from "../../hooks/useForm";
import { VerifyEmail } from "../../lib/data-modeling";
import { focus, startLoader, stopLoader } from "../../lib/global";
import { validateEmail } from "../../services/auth";
import DVinputText from "./DVinputText";
import { getCookie } from "../../lib/session";

const DVemail = (props) => {
  const [lang] = useLang();
  const { setStap, signUpdata = {} } = props;
  const [Register, value, error, isValid, setElementError] = useForm({
    defaultValue: { ...signUpdata },
  });

  const validateEmailAddress = async (inputValue) => {
    return new Promise(async (res, rej) => {
      try {
        VerifyEmail.email = inputValue || value.email;
        VerifyEmail.type = 2;
        // VerifyEmail.userType = getCookie("userType");

        const response = await validateEmail(VerifyEmail);
        res();
      } catch (e) {
        console.error("ERROR IN validateEmailAddress", e);
        setElementError("email", e.response.data.message);
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
    <form>
      <div className="form-group">
        <DVinputText
          className="form-control dv_form_control"
          autoFocus
          id={"email"}
          defaultValue={signUpdata.email}
          name="email"
          error={error.email}
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
          placeholder={props.placeholder}
        // placeholder={lang.emailPlaceholder}
        />
      </div>
    </form>
  );
};

export default React.memo(DVemail);
