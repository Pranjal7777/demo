import Script from "next/script";
import { useTheme } from "react-jss";
import { useDispatch } from "react-redux";
import Router, { useRouter } from "next/router";
import { Paper } from "@material-ui/core";
import React, { useState, useRef, useEffect, useCallback } from "react";
import CheckOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import CancelIcon from "@material-ui/icons/Cancel";

import { defaultTimeZone } from "../../lib/config";
import * as config from "../../lib/config";
import useLang from "../../hooks/language";
import useForm from "../../hooks/useForm";
import FigureImage from "../../components/image/figure-image";
import Button from "../../components/button/button";
import DVInputPassword from "../../components/DVformControl/DVinputPassword";
import DVinputText from "../../components/DVformControl/DVinputText";
import {
    close_dialog,
    greaterThanSixDigit,
    lowercaseCharacter,
    numericValue,
    open_dialog,
    setAuthData,
    specialCharacter,
    startLoader,
    stopLoader,
    Toast,
    uppercaseCharacter,
    validatePasswordField,
} from "../../lib/global";
import {
    UserRegistrationPayload,
    VerifyEmail,
} from "../../lib/data-modeling";
import {
    signUp,
    validateEmail,
    validateReferralCodeRequest,
    validateUserNameRequest,
} from "../../services/auth";
import { setCookie, setLocalStorage } from "../../lib/session";
import { clearAllPostsAction } from "../../redux/actions/dashboard/dashboardAction";
import { TIME_ZONE_KEY_LABEL, TIMEZONE_LIST } from "../../lib/timezones";
import isMobile from "../../hooks/isMobile";
import Image from "../../components/image/image";
import { isSubDomain } from "../../lib/config/domain";
import { open_drawer } from "../../lib/global/loader";
import LoginWithGoogle from "../../components/socialLogin/google";
import { JUICY_HEADER_DARK_LOGO, SIGNUP_BANNER_CREATOR_1, SIGNUP_BANNER_CREATOR_2, SIGNUP_BANNER_CREATOR_3 } from "../../lib/config/logo";
import debounce from "lodash/debounce";
import SelectMenuInput from "../../components/select-input/select-input";

const DvUserRegistration = (props) => {
    const theme = useTheme();
    const [lang] = useLang();
    const router = useRouter();
    const [mobileView] = isMobile();
    const dispatch = useDispatch();
    const timeZoneList = TIMEZONE_LIST;

    const [validRefCode, setValidRefCode] = useState(true);
    const [refValue, setRefValue] = useState("");
    const [signUpdata, setSignupPayload] = useState({
        ...(props.signup || {}),
    });
    const [password, setPassword] = useState("");
    const [userName, setUserName] = useState("");
    const [switchToUser, setSwitchToUser] = useState("USER");
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [emailValue, setEmailValue] = useState(signUpdata.email || "");
    const [isSceduleTime, setIsSceduleTime] = useState(TIME_ZONE_KEY_LABEL[defaultTimeZone().toLowerCase()]);

    const [passwordValidationScreen, setPassvalidScreen] = useState(false);
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
        setValidInputMsg,
        validMsg,
    ] = useForm({
        defaultValue: { ...(props.signup || {}) },
        emptyAllow: true,
        isDesktop: true,
        // isUsername: false,
    });

    useEffect(() => {
        focus("firstName");
        setSignupPayload({
            ...signUpdata,
            refCode: router?.query?.referId || "",
            firstName: router?.query?.firstName || "",
            lastName: router?.query?.lastName || "",
            email: router?.query?.email || "",
        });
    }, []);

    useEffect(() => {
        ((firstName = "", lastName = "") => setUserName((firstName + lastName).trim().toLowerCase()))(
            value.firstName,
            value.lastName
        );
    }, [value.firstName, value.lastName]);

    // Validate Username
    const validateUserName = async (userName) => {
        if (!userName?.length) return;
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

    // Validate Username
    const debounceValidateUserName = useCallback(debounce(
        validateUserName,
        700), []);


    useEffect(() => {
        renderCount.current++;
        if (renderCount.current > 1) debounceValidateUserName(userName);
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

    // Validate Ref Code
    const validateRefCode = async (refCode) => {
        const refValue = refCode?.target?.value;
        if (refValue?.length < 6) return;
        return new Promise(async (res, rej) => {
            if (!refValue) setValidRefCode(true);
            if (refValue) {
                try {
                    const response = await validateReferralCodeRequest(refValue);
                    setValidRefCode(true);
                    res();
                } catch (e) {
                    console.error("response", e);
                    setValidRefCode(false);
                    close_dialog();
                    setElementError("refCode", e?.response?.data?.message);
                    rej();
                }
            }
        });
    };

    // Validate refcode
    const debounceValidate = useCallback(debounce(
        validateRefCode,
        700), []);

    useEffect(() => {
        debounceValidate(refValue);
    }, [refValue]);

    const callUserSignUpApi = async () => {
        try {
            startLoader();
            let payload = { ...UserRegistrationPayload };

            payload.firstName = value.firstName;
            payload.username = value.userName;
            payload.email = value.email;
            payload.password = value.password;
            // payload.isNSFWAllow = isNSFWAllow;
            if (value.lastName?.length > 0) {
                payload.lastName = value.lastName;
            }
            if (value.refCode?.length > 0) {
                payload.inviterReferralCode = value.refCode;
            }
            payload.timezone = isSceduleTime?.value;

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
                setCookie('isometrikToken', data?.user?.isometrikToken || "");
                setCookie('isometrikUserId', data?.user?.isometrikUserId || "");
                Router.push("/");
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
            <div className={`fntSz12 ${!mobileView && 'pr-3'}`}>

                <div className="row">
                    {/* FirstName Text Field */}
                    <div className={mobileView ? 'col-12' : "col pr-1"}>
                        <div className="position-relative adjustError">
                            <DVinputText
                                labelTitle={`${lang.firstNamePlaceholder}`}
                                className="form-control dv_registration_field dv_form_control stopBack text-capitalize"
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
                                autoFocus={mobileView ? false : true}
                                type="firstname"
                                disabledField={!isSubDomain}
                            />
                        </div>
                    </div>

                    {/* LastName Text Field */}
                    <div className={mobileView ? 'col-12' : "col pl-1"}>
                        <div className="position-relative">
                            <DVinputText
                                labelTitle="Last Name"
                                className="form-control dv_registration_field dv_form_control stopBack text-capitalize"
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

                {/* UserName Text Field */}
                <div className="">
                    <div className="position-relative adjustError">
                        <DVinputText
                            labelTitle="Username"
                            className="form-control dv_registration_field dv_form_control stopBack"
                            defaultValue={userName}
                            onChange={(e) => {
                                let inputValue = e.target.value;
                                let formattedValue = inputValue.replace(/[^\w\s]/g, '').trim().toLowerCase(); // Remove spaces and convert to lowercase
                                formattedValue = formattedValue.slice(0, 32);
                                setUserName(formattedValue);
                            }}
                            value={userName}
                            switchToUser={switchToUser}
                            id="userName"
                            name="userName"
                            autoComplete='off'
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
                            placeholder={`${lang.userNamePlaceholder}`}
                            type="username"
                            disabledField={!isSubDomain}
                        />
                        <div className="pb-3 dv_base_color" style={{ marginTop: "-10px", opacity: userName ? "1" : "0.5" }}>Username cannot be changed after Signup</div>
                    </div>
                </div>

                {/* Email Text Field */}
                <div className="row">
                    <div className="col">
                        <div className="position-relative adjustError">
                            <DVinputText
                                labelTitle="Email"
                                className="form-control dv_form_control stopBack"
                                id="email"
                                name="email"
                                defaultValue={signUpdata.email}
                                error={error.email}
                                onChange={(e) => {
                                    let inputValue = e.target.value;
                                    let formattedValue = inputValue.replace(/\s/g, '').toLowerCase(); // Remove spaces and convert to lowercase
                                    setEmailValue(formattedValue)
                                }}
                                value={signUpdata.email || emailValue || ""}
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
                                disabledField={!isSubDomain}
                            />
                        </div>
                    </div>
                </div>

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
                <div className="row mb-2">
                    <div className="col">
                        <label>Timezone *</label>
                        <div>
                            <SelectMenuInput
                                placeholder={lang.selectTimeZone}
                                categories={timeZoneList}
                                value={isSceduleTime?.label}
                                selectedCategoryValue={isSceduleTime?.label}
                                onChange={(data) => setIsSceduleTime(data.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className=" mb-2 signup__modal">
                    {/* Referal Code Text Field */}
                    <div className="">
                        <div className="position-relative">
                            <DVinputText
                                labelTitle="Referral Code"
                                className="form-control dv_registration_field dv_form_control"
                                defaultValue={signUpdata.refCode}
                                ref={Register({ emptyAllow: true })}
                                name="refCode"
                                maxLength={6}
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
                <style jsx>{`
          :global(.success-tooltip) {
            right: "3.9% !important";
          }
          :global(.adjustError .error-tooltip){
            right:20px !important; 
          }
        `}</style>
            </div>
        );
    };

    const handleGoBack = () => {
        const { referId = "", referralSource = "" } = router.query
        if (referId && referralSource) return window.open(`/signup-as-creator?referId=${referId}&referralSource=${referralSource}`, '_self');
        window.open('/', '_self')
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
        { id: 1, webImage: SIGNUP_BANNER_CREATOR_1 },
        { id: 2, webImage: SIGNUP_BANNER_CREATOR_2 },
        { id: 3, webImage: SIGNUP_BANNER_CREATOR_3 },
    ];

    const handleSignupAsCreator = () => {
        const { referId = "", referralSource = "" } = router.query
        if (referId && referralSource) return window.open(`/signup-as-creator?referId=${referId}&referralSource=${referralSource}`, '_self')
        window.open('/signup-as-creator', '_self')
    }

    return (
        <>
            <Script
                defer={true}
                src="https://sdk.amazonaws.com/js/aws-sdk-2.19.0.min.js"
            />

            <div className="overflow-hidden" style={{ height: "calc(var(--vhCustom, 1vh) * 100)" }}>
                <div
                    className="col-12 row p-0 m-0 justify-content-center"
                    style={{ height: "calc(var(--vhCustom, 1vh) * 100)", overflow: "hidden" }}
                >
                    {/* {!mobileView && <div className=" p-0 vh-100 d-flex reg__left__sec">
                        <Slider {...settings}>
                            {signImageList?.map((img) => (
                                <div className="cursorPtr w-100  " key={img._id}>
                                    <img
                                        src={img?.webImage}
                                        alt="desktop login image"
                                        className="w-100 wrap callout-none"
                                        onContextMenu={handleContextMenu}
                                        style={{ objectFit: "fill" }}
                                    />
                                </div>
                            ))}
                        </Slider>
                    </div>} */}
                    <div
                        className=" d-flex justify-content-center reg__right__sec scroll-hide"
                        style={{
                            background: `${theme.type == "light" ? "#FFF" : "#242a37"}`,
                            overflowY: "auto",
                            height: "calc(var(--vhCustom, 1vh) * 100)"
                        }}
                    >
                        {!mobileView && <div
                            className="text-muted cursorPtr position-absolute"
                            style={{ right: 10, top: 10 }}
                            onClick={() => handleGoBack()}
                        >
                            <CancelIcon fontSize="large" />
                        </div>}
                        <div className={`m-auto  reg__right__sec__inner ${!mobileView && 'pt-5'}`}>
                            {mobileView && <div className="pl-3 py-3 sticky-top d-flex flex-row align-items-center " style={{ background: "#fff", zIndex: '99' }}>
                                <Image
                                    alt="model-registration"
                                    onClick={() => handleGoBack()}
                                    src={theme.type === "light" ? config.backArrow : config.backArrow_lightgrey}
                                    width={28}
                                    id="scr2"
                                />
                                <div className="text-center w-100 pr-4">
                                    <h3 className="mb-0">{lang.signupAsUser}</h3>
                                </div>
                            </div>}
                            <div className={`text-center px-3 ${!mobileView && 'mr-3'}`}>
                                {mobileView && <div className="d-flex justify-content-center mb-4">
                                    <FigureImage
                                        src={JUICY_HEADER_DARK_LOGO}
                                        width="190"
                                        height='90'
                                        fclassname="m-0"
                                        id="logoUser"
                                        alt="logoUser"
                                    />
                                </div>}
                                <h3>{lang.signupAsUser}</h3>
                                <div className="light_app_text">{lang.getStarted}</div>
                                <LoginWithGoogle handleLogin={props.handleLogin} isUser={true} />
                                <div style={{ color: "#6F7173" }}>— OR —</div>
                            </div>

                            {/* SignUp Form */}
                            <div className="col-12 mb-4">
                                <form>
                                    <div style={{ margin: "10px 0" }}>{FormInputs()}</div>

                                    {/* Sign Up Button */}
                                    <div className={`my-2 ${!mobileView && 'pr-3'}`}>
                                        <Button
                                            type="button"
                                            onClick={(e) => callUserSignUpApi()}
                                            fclassname='mt-4 btnGradient_bg rounded-pill text-white'
                                            children={"Signup as a User"}
                                            // id="scr6"
                                            disabled={!(isValid && isSubDomain)}
                                        />
                                    </div>

                                    <div className={`txt-book fntSz12 pt-2 ${!mobileView && 'pr-3 fntSz11'}`}>
                                        By signing up you agree to our <a href="terms-and-conditions" target="_blank" className="font-weight-600">
                                            Terms & Conditions
                                        </a> and <a href="privacy-policy" target="_blank" className="font-weight-600">
                                            Privacy Policy
                                        </a>, and confirm that you are at least 18 years old.
                                    </div>

                                    {/* Sign Up Button */}
                                    <div className="mt-4">
                                        <div className="text-center fntSz12" style={{ letterSpacing: '0.39996px' }}>
                                            Already a member?{' '}
                                            <span className="fntClrTheme cursorPtr txt-underline" onClick={() => window.open('/login', '_self')}>
                                                Login now
                                            </span>
                                        </div>
                                        <div className="text-center fntSz12 mt-2" style={{ letterSpacing: '0.39996px' }}>
                                            Are you a creator?{' '}
                                            <span className="fntClrTheme cursorPtr txt-underline" onClick={handleSignupAsCreator}>
                                                Signup as a Creator
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
          overflow-y: auto;
          background: none !important;
          ${!mobileView && `width: 55%;`}
        }
        .reg__right__sec__inner {
          max-width: ${mobileView ? "100%" : "400px"};
          height: min-content;
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
            border: 1px solid var(--l_border) !important;
            background: var(--l_app_bg) !important;
            padding: 1.5rem 1rem;
          }
          :global(.dv_form_control:focus) {
            border: 1px solid var(--l_base) !important;
            background: var(--l_app_bg) !important;
            padding: 1.5rem 1rem;
          }
          :global(.label__title) {
            color: var(--l_app-text) !important;
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
          color: var(--l_light_app_text) !important;
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
        .txt-underline:hover{
            text-decoration: underline;
        }
      `}</style>
        </>
    );
};

export default DvUserRegistration;
