import Script from "next/script";
import { useTheme } from "react-jss";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { Button as MuiButton, Paper } from "@material-ui/core";
import React, { useState, useRef, useEffect } from "react";
import CheckOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";

import { defaultTimeZone, dvLoginImg, LOGO } from "../../lib/config";
import * as config from "../../lib/config";
import useLang from "../../hooks/language";
import useForm from "../../hooks/useForm";
import Button from "../../components/button/button";
import DVInputPassword from "../../components/DVformControl/DVinputPassword";
import DVphoneno from "../../components/DVformControl/DVphoneno";
import DVdatePicker from "../../components/DVformControl/DVdatePicker";
import DVimagePicker from "../../components/DVformControl/DVimagePicker";
import DVinputText from "../../components/DVformControl/DVinputText";
import DVRadioButton from "../../components/DVformControl/DVradioButton";
import { greaterThanSixDigit, lowercaseCharacter, numericValue, specialCharacter, uppercaseCharacter, validatePasswordField } from "../../lib/global/password";
import { close_dialog, open_dialog, startLoader, stopLoader, Toast } from "../../lib/global/loader";
import { setAuthData } from "../../lib/global/setAuthData";
import { ModelRegistrationPayload, UserRegistrationPayload, ValidatePhoneNoPayload, VerifyEmail } from "../../lib/data-modeling";
import { signUp, validateEmail, validatePhoneNumber, validateReferralCodeRequest, validateUserNameRequest } from "../../services/auth";
import { getCookie, setCookie, setLocalStorage } from "../../lib/session";
import { clearAllPostsAction } from "../../redux/actions/dashboard/dashboardAction";
import { TIMEZONE_LIST, TIME_ZONE_KEY_LABEL } from '../../lib/timezones';
import Link from 'next/link';
import Slider from "react-slick";
import SimpleSlider from "../../components/hastag/image-slider";
import { getCognitoToken } from "../../services/userCognitoAWS";
import fileUploaderAWS from "../../lib/UploadAWS/uploadAWS";
import Icon from "../../components/image/icon";

const DvRegistration = (props) => {
  const theme = useTheme();
  const [lang] = useLang();
  const router = useRouter();
  const dispatch = useDispatch();

  const phoneRef = useRef({});
  const [pic, setPic] = useState({});
  const [phone, setPhone] = useState();
  const [date, setDatePicker] = useState();
  const NSFWSignupDataRef = React.useRef(null);
  const [validRefCode, setValidRefCode] = useState(true);
  const [refValue, setRefValue] = useState("");
  const [phoneInput, setPhoneInput] = useState({});
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [availabelCategories, setAvailabelCategories] = useState([]);
  const [selectedCategoryinputValue, setSelectedCategoryInputValue] =
    useState("");
  const [signUpdata, setSignupPayload] = useState({
    ...(props.signup || {}),
  });
  const [gender, setGender] = useState(signUpdata.gender || "");
  const [password, setPassword] = useState("");
  const [switchToUser, setSwitchToUser] = useState("USER");
  const [isNSFWAllow, setIsNSFWAllow] = React.useState();
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isSceduleTime, setIsSceduleTime] = useState({
    value: TIME_ZONE_KEY_LABEL[defaultTimeZone().toLowerCase()],
  });

  const [passwordValidationScreen, setPassvalidScreen] = useState(false);
  const [userName, setUserName] = useState(signUpdata.userName || "");
  const renderCount = useRef(0);
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

  useEffect(() => {
    if (router.query?.type) {
      setSwitchToUser(router.query?.type)
    }
  }, [router.query?.type])

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
  });

  useEffect(() => {
    focus("firstName");
    setSignupPayload({
      ...signUpdata,
      refCode: router.query.referId || getCookie("referId")
    });
  }, []);

  // Setting Phone Number Data
  useState(() => {
    signUpdata.value &&
      setPhoneInput({
        ...phoneInput,
        ...signUpdata,
        error: true,
      });
  }, []);

  useEffect(() => {
    const categoryLabel = [];
    availabelCategories.forEach((cat, index) => {
      if (selectedCategory.includes(cat?._id)) {
        categoryLabel.push(cat?.title);
      }
    });
    setSelectedCategoryInputValue(categoryLabel.join(", "));
  }, [selectedCategory]);

  useEffect(() => {
    if (Object.entries(value).length >= 5) {
      callUserSignUpApi();
    }
  }, [isNSFWAllow]);

  useEffect(() => {
    ((firstName = "", lastName = "") => setUserName(firstName + lastName))(
      value.firstName,
      value.lastName
    );
  }, [value.firstName, value.lastName]);

  useEffect(() => {
    renderCount.current++;
    if (renderCount.current > 1) validateUserName();
    value.userName = userName;
  }, [userName]);

  useEffect(() => {
    value.password = password;
    ValidatePassword();
    ValidateSixDigitsInPassword();
    ValidateNumeralInPassword();
    ValidateSpecialCharacterInPassword();
    ValidateUppercaseCharacterInPassword();
  }, [password]);

  // Validate Username
  const validateUserName = async () => {
    return new Promise(async (res, rej) => {
      if (error.userName) {
        rej();
      }
      try {
        const response = await validateUserNameRequest(userName);
        setElementError("userName", false);
        setValidInputMsg("userName", response?.data?.message);
        res();
      } catch (e) {
        setElementError("userName", e?.response?.data?.message);
        rej();
      }
    });
  };

  // Scedule time zone...
  const handleTimeScedule = (event) => {
    setIsSceduleTime(event);
  };

  // Validate Email Address
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
        e.response && setElementError("email", e?.response?.data?.message);
        rej();
      }
    });
  };

  // Check Validations and if valid then submit form
  const goToNext = async (e) => {
    e && e.preventDefault();
    try {
      await validateEmailAddress();
      await validateUserName();
    } catch (e) {
      console.error("ERROR IN goToNext", e);
      return;
    }
  };

  // Validate Phone Number
  const ValidatePhoneNo = () => {
    return new Promise(async (res, rej) => {
      try {
        ValidatePhoneNoPayload.phoneNumber = phoneInput.phoneNo;
        ValidatePhoneNoPayload.countryCode = phoneInput.countryCode;

        // API CALL
        const response = await validatePhoneNumber(ValidatePhoneNoPayload);

        response.status === 200 && phoneInput.error
          ? setIsPhoneValid(true)
          : setIsPhoneValid(false);
        res();
      } catch (e) {
        console.error(phoneRef.current);
        phoneRef.current &&
          phoneRef.current.setError &&
          phoneRef.current.setError(e?.response?.data?.message);
        // setElementError("phoneNumbere", e?.response?.data?.message);
        console.error(e?.response?.data?.message);
        setIsPhoneValid(false);
      }
    });
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

  useEffect(() => {
    goToRef(refValue);
  }, [refValue, validRefCode]);

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

  const gotoNSFWVerification = () => {
    try {
      NSFWSignupDataRef.current = {
        firstName: value.firstName,
        lastName: value.lastName,
        email: value.email,
        password: value.password,
        // confirmPassword: value.password,
        userName: value.userName,
        countrycode: phoneInput.countryCode,
        phoneNumber: phoneInput.phoneNo,
        gender,
        dateOfBirth: date,
        pic: pic,
        phone: phone,
        iso2: phoneInput.iso2,
        socialLink: value.link,
        // inviterReferralCode: value.refCode,
        groupIds: selectedCategory,
        timezone: isSceduleTime.value.value,
      };
      if (value?.refCode?.length > 0) {
        NSFWSignupDataRef.current.inviterReferralCode = value.refCode;
      }
      open_dialog("NSFW_Signup", {
        signupData: NSFWSignupDataRef.current,
        // setSubmitSuccess: props.setSubmitSuccess
      });
    } catch (err) {
      console.error("ERROR IN gotoNSFWVerification", err);
    }
  };

  const NSFWContentDialog = () => {
    open_dialog("NSFW_Signup", {
      userSignup: true,
      setIsNSFWAllow: (value) => {
        setIsNSFWAllow(value);
      },
    });
  };

  const callModelSignUpApi = async () => {
    try {
      startLoader();
      let payload = { ...ModelRegistrationPayload };
      const cognitoToken = await getCognitoToken();
      const tokenData = cognitoToken?.data?.data;
      const imgFileName = `${Date.now()}_${value.userName?.toLowerCase()}`;
      const folderName = `users/${FOLDER_NAME_IMAGES.profile}`;
      const url = await fileUploaderAWS(
        pic.file[0],
        tokenData,
        imgFileName,
        false,
        folderName,
        null, null, null, false
      );
      payload.firstName = value.firstName;
      payload.lastName = value.lastName;
      payload.email = value.email;
      payload.password = value.password;
      payload.username = value.userName;
      payload.profilePic = url;
      payload.countryCode = phoneInput.countryCode;
      payload.phoneNumber = phoneInput.phoneNo;
      payload.dateOfBirth = date;
      // payload.gender = gender;
      // payload.socialMediaLink = value.socialLink;
      // payload.isNSFWAllow = recieveNSFW == "true" ? true : value.false;
      if (value.refCode) {
        payload.inviterReferralCode = value.refCode;
        payload.referralSource = getCookie("referralSource") || "copyPaste"
      }
      payload.timezone = isSceduleTime.value.value;
      if (selectedCategory.length > 0) {
        payload.groupIds = selectedCategory;
      }
      const res = await signUp(payload);

      if (res?.status === 200) {
        router.push("/login");
        setCookie("userType", 2)
        open_dialog("profileSubmitted", {});
      }
      stopLoader();
    } catch (err) {
      stopLoader();
      if (err.response) {
        Toast(err?.response?.data?.message, "error");
      }
      console.error(err);
    }
  };

  const callUserSignUpApi = async () => {
    try {
      startLoader();
      let payload = { ...UserRegistrationPayload };

      payload.firstName = value.firstName;
      payload.lastName = value.lastName;
      // payload.username = value.userName;
      payload.email = value.email;
      payload.password = value.password;
      payload.isNSFWAllow = isNSFWAllow;
      if (value.refCode) {
        payload.inviterReferralCode = value.refCode;
        payload.referralSource = getCookie("referralSource") || "copyPaste"
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

  // let isPasswordMatch = value["password"] === value["confirmPassword"]
  const FormInputs = () => {
    return (
      <div className="pr-3 fntSz12">
        {/* Upload Image */}
        <div className="my-3">
          {switchToUser == "USER" ? (
            ""
          ) : (
            <div className="row">
              <div className="col-12">
                <label className="label__title">Upload image</label>
                <DVimagePicker
                  signUpdata={signUpdata}
                  // setFile={setFile}
                  setPic={setPic}
                  dvCreatorSignup={true}
                  pic={pic.url}
                />
              </div>
            </div>
          )}
        </div>

        <div className="row">
          {/* FirstName Text Field */}
          <div className={`${switchToUser == "USER" ? "col pr-1" : 'col-12'}`}>
            <div className="position-relative">
              <DVinputText
                labelTitle={`${lang.firstNamePlaceholder}`}
                className="form-control dv_registration_field dv_form_control stopBack"
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
                placeholder={`${lang.firstNamePlaceholder}`}
                autoFocus
                type="firstname"
              />
            </div>
          </div>

          {/* LastName Text Field */}
          <div className={`${switchToUser == "USER" ? "col pl-1" : 'col-12'}`}>
            <div className="position-relative">
              <DVinputText
                labelTitle="Last Name"
                className="form-control dv_registration_field dv_form_control stopBack"
                defaultValue={signUpdata.lastName || ""}
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
                placeholder={`${lang.lastNamePlaceholder}`}
                type="lastname"
              />
            </div>
          </div>
        </div>
        {switchToUser == "USER" ? (
          ""
        ) : (
          <div className="fntSz11">
            {/* Date Picker */}
            <div className="position-relative">
              <DVdatePicker
                labelTitle="Date Of Birth"
                signUpdata={signUpdata}
                setDatePicker={setDatePicker}
                placeholder={lang.refCode}
              />
            </div>
          </div>
        )}

        {/* Gender */}
        {switchToUser == "USER" ? (
          ""
        ) : (
          <div className="row mb-4">
            <div className="col-12 text-left">
              <div className="txt-book  dv_upload_txt_color dv_text_shdw mb-2">
                {`${lang.gender}`}
                <span className=""> *</span>
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
        )}

        {/* UserName Text Field */}
        {switchToUser == "USER" ? (
          ""
        ) : (
          <div className="">
            <div className="position-relative">
              <DVinputText
                labelTitle="Username"
                className="form-control dv_registration_field dv_form_control stopBack"
                defaultValue={userName}
                  onChange={(e) => {
                    setUserName(e.target.value);
                  }}
                  value={userName}
                  switchToUser={switchToUser}
                  id="userName"
                  name="userName"
                  error={error.userName}
                  validMsg={validMsg.userName}
                  ref={Register({
                    validate: [
                      {
                        validate: "required",
                        error: lang.userNameError,
                      },
                    ],
                  })}
                  placeholder={`${lang.userNamePlaceholder}*`}
                  type="username"
                />
              </div>
            </div>
        )}

        {/* Email Text Field */}
        <div className="row">
          <div className="col">
            <div className="position-relative">
              <DVinputText
                labelTitle="Email"
                className="form-control dv_form_control stopBack"
                id="email"
                name="email"
                defaultValue={signUpdata.email}
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
                placeholder={`Email`}
                style={{ borderBottom: "1px soild " }}
                type="email"
                switchToUser={switchToUser}
              />
            </div>
          </div>
        </div>

        {/* Phone Number Text Field */}
        {switchToUser == "USER" ? (
          ""
        ) : (
          <div className="">
            <div className="position-relative">
              <DVphoneno
                labelTitle="Phone Number"
                setRef={(childRef) => (phoneRef.current = childRef.current)}
                // setPhoneNo={setPhoneNo}
                setPhone={setPhone}
                setPhoneInput={setPhoneInput}
                phoneInput={phoneInput}
                onBlur={() => ValidatePhoneNo()}
                phoneNo={signUpdata.phoneNumber}
                countryCode={signUpdata.countrycode}
                iso2={signUpdata.iso2}
                isPhoneValid={isPhoneValid ? lang.validPhoneNumber : ""}
                typeCheck="phoneNumber"
              />
            </div>
          </div>
        )}

        {/* Password Field */}
        <div className="row signup__modal">
          {/* Input Password Text Field */}
          <div className="col">
            <div className="position-relative password_section">
              <DVInputPassword
                labelTitle="Password"
                className="dv_registration_field dv_form_control stopBack"
                defaultValue={signUpdata.password}
                name="password"
                error={error.password}
                placeholder={lang.passwordPlaceholder}
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
        </div >



        {/* category Text Field */}
        {switchToUser == "USER" ? (
          ""
        ) : (
          <div className="row mb-2">
            <div className="col">
              <div className="position-relative">
                <DVinputText
                    labelTitle="Category *"
                    onClick={() =>
                      open_dialog("category", {
                        setSelectedCategoryState: (data) =>
                          setSelectedCategory(data),
                        selectedCategoryState: selectedCategory,
                        setAvailabelCategories: (data) =>
                          setAvailabelCategories(data),
                      })
                    }
                  className="form-control dv_registration_field cursorPtr pr-5 dv_form_control stopBack"
                  id="category"
                  name="category"
                  placeholder={`${lang.chooseCategory}`}
                  style={{ borderBottom: "1px soild " }}
                  defaultValue={selectedCategoryinputValue}
                  isDropDown
                />
              </div>
            </div>
          </div>
        )}

        {/* TimeZone Option  */}
        {switchToUser == "USER" ? (
          ""
        ) : (
          <div className="col p-0 timezone_section">
            <div
              className="position-relative p-0"
              onClick={() => {
                open_dialog("timeZone", {
                  setIsSceduleTime: (selectTimezone) =>
                    setIsSceduleTime(selectTimezone),
                  isSceduleTime,
                });
                }}
              >
                <DVinputText
                  labelTitle="Timezone *"
                  className="form-control dv_form_control cursor-pointer dv_appTxtClr"
                  name="timezone"
                  placeholder={lang.selectTimeZone}
                  // onChange={handleTimeScedule}
                  value={isSceduleTime.value.label}
                />
                <ArrowForwardIosIcon className="arrow_on_right position-absolute dv_appTxtClr_web cursor-pointer fntSz15" />
              </div>
            </div>
        )}

        <div className=" mb-2 signup__modal">

          {/* Referal Code Text Field */}
          {switchToUser == "USER" ? (
            ""
          ) : (
            <div className="">
              <div className="position-relative">
                <DVinputText
                  labelTitle="Referral Code"
                  className="form-control dv_registration_field dv_form_control"
                  defaultValue={signUpdata.refCode}
                  // onBlur={() => goToRef()}
                  ref={Register({ emptyAllow: true })}
                  name="refCode"
                  error={error.refCode}
                  placeholder={lang.refCode}
                  typeCheck="refCode"
                    onChange={(e) => {
                      setRefValue(e);
                    }}
                    switchToUser={switchToUser}
                    type="refCode"
                  />
                </div>
              </div>
          )}
        </div>
        <style jsx>{`
          :global(.success-tooltip) {
            right: ${switchToUser == "USER"
            ? "3.9% !important"
            : "7%!important"};
          }
        `}</style>
      </div>
    );
  };

  const settings = {
    dots: true,
    className: "w-100 h-100",
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: false,
  };

  const signImageList = [
    { id: 1, webImage: '/Bombshell/images/signup-user-banner.png' },
    { id: 2, webImage: '/Bombshell/images/signup-creator-banner.png' },
    { id: 3, webImage: '/Bombshell/images/signup-login-banner.png' },
  ];

  return (
    <>
      <Script
        defer={true}
        src="https://sdk.amazonaws.com/js/aws-sdk-2.19.0.min.js"
      />

      <div className="h-screen overflow-hidden">
        <div className="col-12 row p-0 m-0" style={{ height: '100vh', overflow: 'hidden' }}>
          <div className="col-md-6 col-sm-6 p-0 vh-100 d-flex reg__left__sec ">
            <Slider {...settings}>
              {signImageList?.map((img) => (
                <div className="cursorPtr w-100  " key={img._id}>
                  <img
                    src={img?.webImage}
                    alt="desktop login image"
                    className="w-100 wrap"
                    style={{ objectFit: "fill" }}
                  />
                </div>
              ))}
            </Slider>
          </div>

          <div
            className=" d-flex justify-content-center vh-100 reg__right__sec"
            style={{
              background: `${theme.type == "light" ? "#FFF" : "#242a37"}`,
              overflowY: "scroll",
            }}
          >
            <div className="m-auto  reg__right__sec__inner pt-5">
              {/* <div
                className="text-muted cursorPtr reg__right__sec__inner__child"
                onClick={() => router.push("/login")}
              >
                <CancelOutlined fontSize="large" />
              </div>

              <FigureImage
                fclassname="my-3 text-left px-3"
                src={theme.type == "light" ? LOGO : DARK_LOGO}
                width="184"
                alt={APP_NAME}
                style={{ width: '13.981vw' }}
              />

              <div className="text-center pl-3 pr-3 mr-3">
                <h3>Create an Account</h3>
                <div style={{ color: "#6F7173" }}>Hey ! Let’s get started.</div>
                <div style={{
                  background:
                    "linear-gradient(94.91deg, #7426F2 0%, #C926F2 100%)",
                  padding: '1px',
                  borderRadius: "8px",
                  margin: '1.5rem 0px 0.5rem 0px'
                }}>
                  <div style={{ background: '#121212', borderRadius: "8px", }}>
                  <div
                      className="d-flex align-items-center justify-content-center flex-nowrap py-3"
                    style={{
                      background:
                        "linear-gradient(94.91deg, rgba(115, 33, 244, 0.25) 0%, rgba(200, 38, 242, 0.25) 100%)",
                      fontWeight: "300",
                      borderRadius: "8px",
                      fontFamily: "Inter",
                      fontSize: '0.73rem',
                      letterSpacing: '0.39996px',
                    }}
                  >
                      <Icon
                        icon={`${config.google_icon_white}#google`}
                        viewBox="0 0 22.313 22.313"
                        width="15"
                        height="16"
                        style={{ paddingRight: '1rem' }}
                      />
                    Login With Google
                  </div>
                  </div>
                </div>
                <div style={{ color: "#6F7173" }}>— OR —</div>
              </div>

              {/* <div className='col-12'>
                <div className='col-12  rounded py-3' style={{ background: `${theme.type == "light" ? '#F9F7FD' : "#000"}` }}>
                  <div className='row'>
                    <div className="col-12 mb-0">
                      <div className="dv_modal_title text-left mb-0">{lang.signUpFanzly}</div>
                    </div>

                    User/Creator Switch Button
                    <div className="col-12 my-3 row no-gutters align-items-center">

                      Creator Switch Button
                      <div className="col">
                        <MuiButton
                          variant="dafault"
                          className={`py-1 custBtn px-3 defaultLeftTab ${switchToUser == "CREATOR" ? "primaryColor" : ""}`}
                          onClick={() => setSwitchToUser("CREATOR")}
                          fullWidth
                        >
                          <div className="fntWeight600 text-app letterSpacing2px text-capitalize font-weight-normal">
                            {lang.creator}
                          </div>
                          <div className="text-capitalize">
                      {lang.clickHere}
                    </div>
                        </MuiButton>
                      </div>

                      OR Text
                      <div className="col-2">
                  <span className="text-uppercase p-2 bg-dark text-light rounded-pill fntSz14">
                    {lang.or}
                  </span>
                </div>

                      User Switch Button
                      <div className="col">
                        <MuiButton
                          variant="dafault"
                          className={`py-1 custBtn px-3 defaultRightTab ${switchToUser == "USER" ? "primaryColor" : ""}`}
                          onClick={() => setSwitchToUser("USER")}
                          fullWidth
                        >
                          <div className="fntWeight600 text-app letterSpacing2px text-capitalize font-weight-normal">
                            {lang.user}
                          </div>
                          <div className="text-capitalize">
                      {lang.clickHere}
                    </div>
                        </MuiButton>
                      </div>
                    </div>

                    <div className="col-12 mb-2">
                      <div className="fntSz12 text-left mb-0 signIn__txt">
                        {switchToUser == "USER"
                          ? lang.signupUserTxt
                          : lang.signupCreatorTxt
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}

              {/* SignUp Form */}
              <div className="col-12 mb-4">
                <form>
                  <div style={{ margin: "10px 0" }}>{FormInputs()}</div>

                  {/* Sign Up Button */}
                  <div className="my-2 pr-3">
                    {switchToUser === "USER" ? (
                      <Button
                        type="button"
                        onClick={(e) => callUserSignUpApi()}
                        cssStyles={{
                          ...theme.blueButton,
                          background:
                            "linear-gradient(91.19deg, rgba(255, 26, 170) 0%, #460a56 100%)",
                          padding: "14px 0px",
                          fontFamily: 'Roboto',
                          fontSize: '13px'
                        }}
                        children={"Signup to Your Account"}
                        // id="scr6"
                        disabled={!(isValid)}
                      />
                    ) : (
                      <Button
                        type="button"
                          disabled={
                            !(
                              isValid &&
                              Object.keys(pic).length != 0 &&
                              gender &&
                              phoneInput &&
                              isPhoneValid &&
                              date &&
                              isPasswordValid &&
                              validRefCode
                            )
                          }
                        onClick={(e) => callModelSignUpApi(e)}
                          cssStyles={{
                            ...theme.blueButton,
                            background:
                              "linear-gradient(91.19deg, rgba(255, 26, 170) 0%, #460a56 100%)",
                            padding: "14px 0px",
                            fontFamily: 'Roboto',
                            fontSize: '13px',
                          }}
                          fclassname='mt-4'
                          children={'Signup to Your Account'}
                      // id="scr6"
                      />
                    )}
                  </div>

                  <div className="txt-book fntSz11 dv_text_shdw pt-2 pr-3">
                    By signing up you agree to our <a href="terms-and-conditions" target="_blank" className="font-weight-600">
                      Terms & Conditions
                    </a> and <a href="privacy-policy" target="_blank" className="font-weight-600">
                      Privacy Policy
                    </a>, and confirm that you are at least 18 years old.
                    {/* {lang.byCreating + " "}
                    <a href="terms-and-conditions" target="_blank">
                      {lang.termandcondition + " "}
                    </a>
                    {lang.and + " "}
                    <a href="privacy-policy" target="_blank">
                      {lang.privacyAndPolicy}
                    </a> */}
                  </div>

                  {/* Sign Up Button */}
                  <div className="mt-3">
                    <div className="text-center text-muted fntSz12" style={{ letterSpacing: '0.39996px' }}>
                      Already a member?{' '}
                      <span className="text-white cursorPtr" onClick={() => window.open('/login', '_self')}>
                        Login Now
                      </span>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        :global(.custBtn) {
          display: initial !important;
        }
        :global(.defaultLeftTab.primaryColor) {
          background: var(--l_base) !important;
          color: #fff !important;
          border-radius: 4px 0px 0px 4px !important;
        }
        :global(.defaultRightTab.primaryColor) {
          background: var(--l_base) !important;
          color: #fff !important;
          border-radius: 0 4px 4px 0 !important;
        }
        .letterSpacing2px {
          letter-spacing: 2px;
        }
        .reg__left__sec {
          background: #121212;
          width: 45%;
        }
        .reg__right__sec {
          overflow-y: scroll;
          background: ${theme.type == "light" ? "#fff" : "#121212"} !important;
          width: 55%;
        }
        .reg__right__sec__inner {
          max-width: 400px;
        }
        .reg__right__sec__inner__child {
          right: 30px;
          top: 20px;
          position: absolute;
        }
        :global(.password_section .error-tooltip-container) {
          right: 28px !important;
        }
        :global(.dv_form_control) {
          border: ${theme.type === "dark" && "none !important;"};
          background: ${theme.type === "light" ? "#000" : "#1E1C22"} !important;
          padding: 1.5rem 1rem;
        }
        :global(.dv_form_control:focus) {
          box-shadow:  ${theme.type === "dark" && "inset 0px 0px 0px 1px #7426F2 !important"};
          border: ${theme.type === "dark" && "none !important;"};
          background: ${theme.type === "light" ? "#000" : "#121212"} !important;
          padding: 1.5rem 1rem;
        }
        :global(.label__title) {
          color: ${theme.type === "light" ? "#000" : "#EEEEEE"} !important;
        }
        :global(.dv_upload_txt_color) {
          color: ${theme.type === "light" ? "#000" : "#EEEEEE"} !important;
        }
        :global(.img_picker) {
          color: ${theme.type === "light" ? "#000" : "#EEEEEE"} !important;
        }

        :global(.slick-dots) {
          font-family: "slick";
          font-size: 10px;
          line-height: 20px;
          position: absolute;
          bottom: 0px;
          left: 40%;
          width: 100px;
          height: 49px;
          content: "•";
          text-align: center;
          color: #fff;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        :global(.slick-arrow){
          display: none !important;
        }
        :global(.slick-dots li.slick-active button:before) {
          opacity: 1;
          color: #fff;
          font-size: 9px;
        }
        :global(.slick-dots li button:before) {
          opacity: 0.5;
          color: var(--l_light_grey);
        }
        :global(input::placeholder) {
          color: #8B8B8B !important;
        }
        :global(input){
          font-family: Roboto;
        }
        :global(.forminput-date-picker>div){
          top: 5px;
          padding-left: 10px;
        }
        :global(.forminput-date-picker>div svg){
          margin-top: 10px !important;
        }
        :global(.gender_container){
          font-size: 12px !important;
        }
        :global(.arrow_on_right){
          top: 38%;
          transform: rotate(90deg);
        }
        :global(.timezone_section .arrow_on_right){
          top: 56%;
        }
      `}</style>
    </>
  );
};

export default DvRegistration;
