import Route from "next/router";
import React, { useEffect } from "react";
import { useTheme } from "react-jss";
import { useDispatch } from "react-redux";

import Button from "../../components/button/button";
import DVInputPassword from "../../components/DVformControl/DVinputPassword";
import {
  default as DVInputText,
  default as DVinputText,
} from "../../components/DVformControl/DVinputText";
import Wrapper from "../../hoc/Wrapper";
import useLang from "../../hooks/language";
import useForm from "../../hooks/useForm";
import { UserRegistrationPayload, VerifyEmail } from "../../lib/data-modeling";
import {
  focus,
  setAuthData,
  startLoader,
  stopLoader,
  Toast,
} from "../../lib/global";
import { getCookie, setCookie, setLocalStorage } from "../../lib/session";
import { clearAllPostsAction } from "../../redux/actions/dashboard/dashboardAction";
import {
  signUp,
  validateEmail,
  validateUserNameRequest,
} from "../../services/auth";
import NotSafeForWork from "../registration/model-registration/nsfw";


const SignUpForm = (props) => {
  const theme = useTheme();
  const [lang] = useLang();
  const dispatch = useDispatch();
  const { setVal } = props;

  const { setStap, signUpdata } = props;
  // form hook
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
    defaultValue: { ...(props.signUpdata || {}) },
    emptyAllow: true,
  });
  const [currentScreen, setCurrentScreen] = React.useState();
  const [isNSFWAllow, setIsNSFWAllow] = React.useState(false);

  useEffect(() => {
    focus("firstName");
  }, []);

  // const [val, setVal] = useState(false);

  // validate username
  const validateUserName = async () => {
    return new Promise(async (res, rej) => {
      if (error.userName) {
        rej();
      }
      try {
        const { userName } = value;
        // startLoader();
        const response = await validateUserNameRequest(userName);
        setValidInputMsg("userName", response?.data?.message);
        res();
      } catch (e) {
        setElementError("userName", e.response.data.message);
        rej();
      }
    });
  };

  const validateEmailAddress = async (inputValue) => {
    return new Promise(async (res, rej) => {
      try {
        VerifyEmail.email = inputValue || value.email;
        VerifyEmail.type = 2;
        // VerifyEmail.userType = getCookie("userType");

        const response = await validateEmail(VerifyEmail);
        res();
      } catch (e) {
        console.error("validateEmailAddress", e);
        console.error("VALUE EMAIL:", e.response);
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
    // setStap(value);
  };

  // Function for changing screen
  const updateScreen = (screen) => {
    setCurrentScreen(screen);
  };

  const NSFWContentDialog = () => {
    updateScreen(
      <NotSafeForWork
        userSignup={true}
        setIsNSFWAllow={(value) => {
          setIsNSFWAllow(value);
          callUserSignUpApi()
        }}
      />
    )
  }

  const callUserSignUpApi = () => {

    let payload = { ...UserRegistrationPayload };

    payload.firstName = value.firstName;
    payload.lastName = value.lastName;
    payload.username = value.userName;
    payload.email = value.email;
    payload.password = value.password;
    // payload.isNSFWAllow = isNSFWAllow;

    startLoader();
    signUp(payload)
      .then(async (res) => {
        stopLoader();
        if (res.status === 200) {
          // drawerToast({
          //     drawerClick: () => {
          //         Route.push("/login");
          //     },
          //     desc: res.data.message,
          //     closeIconVisible: false,

          // });

          const data = res.data && res.data.data ? res.data.data : {};
          setLocalStorage('streamUserId', data.user.isometrikUserId);
          setAuthData({ ...data.token, ...data.user });
          dispatch(clearAllPostsAction());
          setCookie("auth", true);
          setCookie("guest", false);
          setCookie("userType", 1);
          // setCookie("guest", false);
          // setCookie("auth", true);
          // setAuthData(res.data.data.data);

          // setVal(true);
          // Route.push("/");
          window.location.href = "/";
          props.onClose();
          // setTimeout(() => {
          //     // close_drawer();
          //     //
          // }, config.DRAWER_TOASTER_TIME); 
        }
      })
      .catch(async (err) => {
        stopLoader();
        if (err.response) {
          Toast(err.response.data.message, "error");
        }
        console.error(err);
      });
  };

  return (
    <Wrapper>
      {!currentScreen
        ? <div>
          <button
            type="button"
            className="close dv_modal_close"
            onClick={() => props.onClose()}
          >
            {lang.btnX}
          </button>
          <div className="dv_modal_wrap">
            <div className="col-12">
              <div className="dv_modal_title text-center mb-3">{lang.signUp}</div>
              <form>
                <div className="row mb-4">
                  <div className="col">
                    <div className="position-relative">
                      <DVInputText
                        className="form-control dv_form_control"
                        autoFocus
                        id="firstName"
                        defaultValue={signUpdata.firstName}
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
                        placeholder={`${lang.firstNamePlaceholder}*`}
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="position-relative">
                      <DVInputText
                        className="form-control dv_form_control"
                        defaultValue={signUpdata.lastName}
                        name="lastName"
                        error={error.lastName}
                        ref={Register({
                          validate: [
                            {
                              validate: "required",
                              error: lang.lastNameError,
                            },
                          ],
                        })}
                        placeholder={`${lang.lastNamePlaceholder}*`}
                      />
                    </div>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col">
                    <div className="position-relative">
                      <DVInputText
                        className="form-control dv_form_control"
                        defaultValue={signUpdata.userName}
                        name="userName"
                        error={error.userName}
                        validMsg={validMsg.userName}
                        ref={Register({
                          onBlur: validateUserName,
                          validate: [
                            {
                              validate: "required",
                              error: lang.userNameError,
                            },
                          ],
                        })}
                        placeholder={`${lang.userNamePlaceHolder}*`}
                      />
                    </div>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col">
                    <div className="position-relative">
                      <DVinputText
                        className="form-control dv_form_control"
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
                        placeholder={`${lang.emailPlaceholder}*`}
                      />
                    </div>
                  </div>
                </div>
                <div className="row mb-4 signup__modal">
                  <div className="col">
                    <div className="position-relative">
                      <DVInputPassword
                        className="form-control dv_form_control"
                        defaultValue={signUpdata.password}
                        name="password"
                        error={error.password}
                        ref={Register({
                          ref: "confirmPassword",
                          refErrorMessage: lang.passwordError3,
                          validate: [
                            {
                              validate: "required",
                              error: lang.passwordError1,
                            },
                            {
                              validate: "password",
                              error: lang.pwdErrorMsg3,
                            },
                          ],
                        })}
                        placeholder={`${lang.passwordPlaceholder}*`}
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="position-relative">
                      <DVInputPassword
                        className="form-control dv_form_control"
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
                        placeholder={`${lang.confirmPasswordPlaceholder}*`}
                      />
                    </div>
                  </div>
                </div>
                <div className="txt-book fntSz16 text-center mb-3 dv_text_shdw">
                  {lang.byCreating + " "}
                  <a href="terms-and-conditions" target="_blank">
                    {lang.termandcondition + " "}
                  </a>
                  {lang.and + " "}
                  <a href="privacy-policy" target="_blank">
                    {lang.privacyAndPolicy}
                  </a>
                </div>
                <Button
                  disabled={!isValid}
                  type="button"
                  onClick={(e) => callUserSignUpApi()}
                  cssStyles={theme.blueButton}
                  id="scr6"
                  children={lang.btnSignUp}
                />
              </form>
            </div>
          </div>
        </div>
        : currentScreen
      }
    </Wrapper>
  );
};

export default SignUpForm;
