import React from "react";

import useLang from "../../hooks/language";
import useForm from "../../hooks/useForm";
import DVinputPassword from "./DVinputPassword";

const DVpassword = (props) => {
  const [lang] = useLang();
  const { setStap, signUpdata = {} } = props;

  const [Register, value, error, isValid, setElementError] = useForm({
    defaultValue: { ...signUpdata },
  });

  return (
    <form>
      <div className="row mb-3">
        <div className="col">
          <div className="position-relative">
            <DVinputPassword
              className="form-control dv_form_control"
              autoFocus
              name="password"
              error={error.password}
              defaultValue={signUpdata.password}
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
              placeholder="Password"
            />
          </div>
        </div>
        <div className="col">
          <div className="position-relative">
            <DVinputPassword
              className="form-control dv_form_control"
              // ref={Register()}
              defaultValue={signUpdata.confirmPassword}
              error={error.confirmPassword}
              ref={Register({
                validate: [{
                  validate: "password",
                  error: lang.passwordError2,
                }, {
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
    </form>
  );
};

export default React.memo(DVpassword);
