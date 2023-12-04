import Route from "next/router";
import React, { useEffect, useRef, useState } from "react";
import Button from "../../components/button/button";
import DVdatePicker from "../../components/DVformControl/DVdatePicker";
import DVimagePicker from "../../components/DVformControl/DVimagePicker";
import DVinputPassword from "../../components/DVformControl/DVinputPassword";
import DVinputText from "../../components/DVformControl/DVinputText";
import DVphoneno from "../../components/DVformControl/DVphoneno";
import DVRadioButton from "../../components/DVformControl/DVradioButton";
import DVsocialMedia from "../../components/DVformControl/DVsocialMedia";
import useLang from "../../hooks/language";
import useForm from "../../hooks/useForm";
import * as config from "../../lib/config";
import {
  ModelRegistrationPayload,
  SendVerificationCode,
  ValidatePhoneNoPayload,
  VerifyEmail,
} from "../../lib/data-modeling";
import {
  drawerToast,
  focus,
  startLoader,
  stopLoader,
  Toast,
  UploadImage,
} from "../../lib/global";
import { getCookie } from "../../lib/session";
import {
  sendverificaitonCode,
  signUp,
  validateEmail,
  validateReferralCodeRequest,
  validateUserNameRequest,
} from "../../services/auth";
import NotSafeForWork from "../registration/model-registration/nsfw";
import { useTheme } from "react-jss";
import { useSelector } from "react-redux";

const SignUpModel = (props) => {
  const theme = useTheme();
  const [lang] = useLang();
  // const [submitSuccess, setSubmitSuccess] = useState(true);
  // const { setStap, signUpdata = {} } = props;
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
    defaultValue: { ...(props.signup || {}) },
    emptyAllow: true,
  });

  const [signUpdata, setSignupPayload] = useState({
    ...(props.signup || {}),
  });
  const phoneRef = useRef({});
  const [phoneInput, setPhoneInput] = useState({});
  const [errorMessage, setError] = useState("");

  useEffect(() => {
    focus("firstName");
  }, []);

  const [phone, setPhone] = useState();
  const [phoneNo, setPhoneNo] = useState();
  const [date, setDatePicker] = useState();
  const [pic, setPic] = useState({});
  const [gender, setGender] = useState(signUpdata.gender || "");
  // const [file, setFile] = useState(props.signupdata || {});
  const [verificationId1, setVerificationId1] = useState();
  const [butNext, setButNext] = useState(false);
  const [currentScreen, setCurrentScreen] = useState();
  const NSFWSignupDataRef = React.useRef(null);


  // Function for changing screen
  const updateScreen = (screen) => {
    setCurrentScreen(screen);
  };

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

      // stopLoader();
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
        // console.log("ASdsadd", e);
        e.response && setElementError("email", e.response.data.message);
        rej();
      }
    });
  };

  // console.log("fiwf", phoneInput);
  // check validations and if valid then submit form
  const goToNext = async (e) => {
    e && e.preventDefault();
    // check email validation whiile submit
    try {
      await validateEmailAddress();
      await validateUserName();
    } catch (e) {
      // console.log("errorro", e);
      return;
    }
  };

  // validate phone no
  const ValidatePhoneNo = () => {
    return new Promise(async (res, rej) => {
      try {
        ValidatePhoneNoPayload.phoneNumber = phoneInput.phoneNo;
        ValidatePhoneNoPayload.countryCode = phoneInput.countryCode;
        res();
      } catch (e) {
        console.error(phoneRef.current);
        phoneRef.current &&
          phoneRef.current.setError &&
          phoneRef.current.setError(e.response.data.message);
        setElementError("phoneNumbere", e.response.data.message);
        console.error(e.response.data.message);
      }
    });
  };

  // setting phone nodata
  useState(() => {
    signUpdata.value &&
      setPhoneInput({
        ...phoneInput,
        ...signUpdata,
        error: true,
      });
  }, []);

  // validate email and open otp dialog
  const gotoVerificationPage = async (e) => {
    e && e.preventDefault();
    startLoader();
    try {
      await ValidatePhoneNo();
      SendVerificationCode.phoneNumber = phoneInput.phoneNo;
      SendVerificationCode.countryCode = phoneInput.countryCode;
      SendVerificationCode.trigger = 1;
    } catch (e) {
      stopLoader();
      return;
    }

    try {
      const data = await sendverificaitonCode(SendVerificationCode);
      stopLoader();
      // open_drawer(
      //     "verification",
      //     {
      // setStap: () => setStap(phoneInput),
      // console.log(
      //   "verification data:",
      //   data.data.data,
      //   data.data.data.verificationId
      // );

      const timer = Number(data.data.data.expiryTime) * 1000;

      // const phoneNo = phoneInput.phoneNo;
      // const countryCode = phoneInput.countryCode;
      //     },
      //     "bottom"
      // );

      NSFWSignupDataRef.current = {
        firstName: value.firstName,
        lastName: value.lastName,
        email: value.email,
        password: value.password,
        confirmPassword: value.password,
        userName: value.userName,
        countrycode: phoneInput.countryCode,
        phoneNumber: phoneInput.phoneNo,
        gender,
        dateOfBirth: date,
        pic: pic,
        phone: phone,
        iso2: phoneInput.iso2,
        socialLink: value.link,
      }

      updateScreen(
        // <SignUpModel1
        //   firstName={value.firstName}
        //   lastName={value.lastName}
        //   email={value.email}
        //   password={value.password}
        //   userName={value.userName}
        //   countrycode={phoneInput.countryCode}
        //   phoneNumber={phoneInput.phoneNo}
        //   dateOfBirth={date}
        //   gender={gender}
        //   pic={pic}
        //   phone={phone}
        //   verificationid={data.data.data.verificationId}
        //   timer={data.data.data.expiryTime}
        //   setSubmitSuccess={props.setSubmitSuccess}
        //   onBack={() => updateScreen("")}
        //   updateScreen={updateScreen}
        //   socialMediaLink={value.link}
        // />
        <NotSafeForWork
          signUpdata={NSFWSignupDataRef.current}
          onBack={() => updateScreen("")}
          updateScreen={updateScreen}
          setSubmitSuccess={props.setSubmitSuccess}
          verificationid={data.data.data.verificationId}
          timer={data.data.data.expiryTime}
        />
      );
    } catch (e) {
      stopLoader();
      console.error("Response:", e);
      if (e.response) {
        Toast(e.response.data.message, "error");
      }
    }
    setButNext(true);
  };

  const gotoNSFWVerification = () => {
    try {
      setSignupPayload({
        firstName: value.firstName,
        lastName: value.lastName,
        email: value.email,
        password: value.password,
        confirmPassword: value.password,
        userName: value.userName,
        countrycode: phoneInput.countryCode,
        phoneNumber: phoneInput.phoneNo,
        gender,
        dateOfBirth: date,
        pic: pic,
        phone: phone,
        iso2: phoneInput.iso2,
        socialLink: value.link,
      });

      NSFWSignupDataRef.current = {
        firstName: value.firstName,
        lastName: value.lastName,
        email: value.email,
        password: value.password,
        confirmPassword: value.password,
        userName: value.userName,
        countrycode: phoneInput.countryCode,
        phoneNumber: phoneInput.phoneNo,
        gender,
        dateOfBirth: date,
        pic: pic,
        phone: phone,
        iso2: phoneInput.iso2,
        socialLink: value.link,
      }

      updateScreen(
        <NotSafeForWork
          signupData={NSFWSignupDataRef.current}
          onBack={() => updateScreen("")}
          updateScreen={updateScreen}
          setSubmitSuccess={props.setSubmitSuccess}
        // verificationid={data.data.data.verificationId}
        // timer={data.data.data.expiryTime}
        />
      );
    } catch (err) {
      console.error("ERROR IN gotoNSFWVerification", err);
    }

  }

  // validate ref code
  const validateRefCode = async () => {
    return new Promise(async (res, rej) => {
      try {
        // startLoader();
        const response = await validateReferralCodeRequest(value.refCode);
        res();
      } catch (e) {
        setElementError("refCode", e.response.data.message);
        rej();
        // stopLoader();
      }
    });
  };

  //check validations and if valid then submit form
  const goToRef = async (e) => {
    e && e.preventDefault();
    // check email validation whiile submit
    try {
      value.refCode && (await validateRefCode());
    } catch (e) {
      return;
    }
  };

  return (
    <div>
      {!currentScreen ? (
        <div>
          <button
            type="button"
            className="close dv_modal_close"
            onClick={() => props.onClose()}
          >
            {lang.btnX}
          </button>
          <div className="dv_modal_wrap">
            <div className="col-12">
              <div className="dv_modal_title text-center mb-3">
                {lang.signUpFreelyModels}
              </div>
              <form>
                <div className="row m-0">
                  <div className="col-4 mx-auto pb-3">
                    <DVimagePicker
                      signUpdata={signUpdata}
                      // setFile={setFile}
                      setPic={setPic}
                    />
                    <div className="txt-book fntSz16 dv_upload_txt_color text-center dv_text_shdw pointer">
                      {!pic.url ? lang.upload : lang.change}
                    </div>
                  </div>
                </div>
                {/* <DVname /> */}
                <div className="row mb-4">
                  <div className="col">
                    <div className="position-relative">
                      <DVinputText
                        className="form-control dv_form_control"
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
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="position-relative">
                      <DVinputText
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

                {/* <DVphoneno /> */}

                <div className="row mb-3 signup__modal">
                  <div className="col" id="dvPhoneInputPicker">
                    <DVphoneno
                      setRef={(childRef) =>
                        (phoneRef.current = childRef.current)
                      }
                      setPhoneNo={setPhoneNo}
                      setPhone={setPhone}
                      setPhoneInput={setPhoneInput}
                      phoneInput={phoneInput}
                      onBlur={() => ValidatePhoneNo()}
                      phoneNo={signUpdata.phoneNumber}
                      countryCode={signUpdata.countrycode}
                      iso2={signUpdata.iso2}
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col">
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
                  <div className="col">
                    {/* <DVuserName /> */}
                    <DVinputText
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

                <div className="row mb-4 signup__modal">
                  <div className="col">
                    <div className="position-relative">
                      <DVinputPassword
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
                      <DVinputPassword
                        className="form-control dv_form_control"
                        defaultValue={signUpdata.confirmPassword}
                        // ref={Register()}
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

                <div className="row mb-3">
                  <div className="col">
                    <DVinputText
                      className="form-control dv_form_control"
                      defaultValue={signUpdata.link}
                      name="link"
                      error={error.link}
                      ref={Register({ emptyAllow: true })}
                      placeholder={lang.linkPlaceHolder}
                    />
                  </div>
                </div>
                <div className="row mb-4">
                  <div className="col" id="dvDatePicker">
                    <DVdatePicker
                      signUpdata={signUpdata}
                      setDatePicker={setDatePicker}
                      placeholder={lang.refCode}
                    />
                  </div>
                  <div className="col">
                    <DVinputText
                      className="form-control dv_form_control"
                      onBlur={() => goToRef()}
                      ref={Register({
                        emptyAllow: true,
                      })}
                      name="refCode"
                      error={error.refCode}
                      placeholder={lang.refCode}
                    />
                  </div>
                </div>

                <div className="row mb-4">
                  <div className="col-12">
                    <div className="txt-book fntSz16 dv_upload_txt_color dv_text_shdw mb-3">
                      {`${lang.gender}*`}
                    </div>
                    <DVRadioButton
                      name={"gender"}
                      value={"Male"}
                      label={"Male"}
                      checked={gender === "Male"}
                      onChange={(value) => setGender(value)}
                    />
                    <DVRadioButton
                      name={"gender"}
                      value={"Female"}
                      label={"Female"}
                      checked={gender === "Female"}
                      onChange={(value) => setGender(value)}
                    />
                    <DVRadioButton
                      name={"other"}
                      value={"Other"}
                      label={"Other"}
                      checked={gender === "Other"}
                      onChange={(value) => setGender(value)}
                    />
                  </div>
                </div>

                <div className="txt-book fntSz16 text-center mb-3 dv_text_shdw">
                  {`${lang.byCreating} `}
                  <a href="terms-and-conditions" target="_blank">
                    {`${lang.termandcondition} `}
                  </a>
                  {`${lang.and} `}
                  <a href="privacy-policy" target="_blank">
                    {lang.privacyAndPolicy}
                  </a>
                </div>
                <Button
                  type="button"
                  disabled={!(
                    isValid &&
                    Object.keys(pic).length != 0 &&
                    gender &&
                    phoneInput &&
                    date
                  )
                  }
                  onClick={() => gotoNSFWVerification()}
                  cssStyles={theme.blueButton}
                  children={lang.next}
                  id="scr6"
                />
              </form>
            </div>
          </div>
        </div>
      ) : (
        currentScreen
      )}
    </div>
  );
};

export default SignUpModel;
