import React, { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import Button from '../components/button/button';
import { createAccountPassword, login, sendverificaitonCodeEmail, signUp, validateEmail, validateReferralCodeRequest, validateUserNameRequest } from '../services/auth';
import { getCookie, setCookie, setLocalStorage } from '../lib/session';
import { setAuthData } from '../lib/global/setAuthData';
import { DevicePayload, UserRegistrationPayload, VerifyEmail } from '../lib/data-modeling';
import DVinputText from '../components/DVformControl/DVinputText';
import DVinputPassword from '../components/DVformControl/DVinputPassword';
import useLang from '../hooks/language';
import { Toast, close_dialog, close_drawer, drawerToast, open_dialog, open_drawer, startLoader, stopLoader } from '../lib/global/loader';
import { sendMail } from '../lib/global/routeAuth';
import { useDispatch } from 'react-redux';
import useAgencyRegistration from './agency/hook/useAgencyRegistration';
import { useEffect } from 'react';
import Icon from '../components/image/icon';
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import DvVerifyOtp from './DvEditProfile/DvVerifyOtp';
import isMobile from '../hooks/isMobile'
import { Arrow_Left2 } from '../lib/config/homepage';
import { Paper } from '@material-ui/core';
import CheckOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import { greaterThanSixDigit, lowercaseCharacter, numericValue, specialCharacter, uppercaseCharacter, validatePasswordField } from '../lib/global/password';
import { TIMEZONE_LIST, TIME_ZONE_KEY_LABEL } from '../lib/timezones';
import { defaultTimeZone } from '../lib/config/creds';
import { clearAllPostsAction } from '../redux/actions/dashboard/dashboardAction';
import { signOut } from '../lib/global/clearAll';
import { JUICY_HEADER_DARK_LOGO } from '../lib/config/logo';
import FigureImage from '../components/image/figure-image';
import VerifyLoginOtp from './DvEditProfile/VerifyLoginOtp';
import debounce from 'lodash/debounce';
import SelectMenuInput from '../components/select-input/select-input';

const userMigrationLoginForm = (props) => {
    const [lang] = useLang();
    const router = useRouter();
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const timeZoneList = TIMEZONE_LIST;
    const userType = getCookie("userType");
    const userRole = getCookie("userRole");
    const [verificationData, setVerificationData] = useState({
        verificationId: "",
        timer: 0,
        enterCode: false
    });
    const [mobileView] = isMobile()
    const renderCount = useRef(0);
    const [userName, setUserName] = useState("");
    const [usernameError, setUsernameError] = useState(false);
    let userMigration = true
    const { step, setStepper } = props
    const [passwordValidationScreen, setPassvalidScreen] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [isSceduleTime, setIsSceduleTime] = useState({ value: TIME_ZONE_KEY_LABEL[defaultTimeZone().toLowerCase()] });
    const [refValue, setRefValue] = useState("");
    const [validRefCode, setValidRefCode] = useState(true);
    const [reffError, setReffError] = useState("");
    const [userTypeCode, setUserTypeCode] = useState();
    const { redirect } = router.query;
    const passwordInputRef = useRef();

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

    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validate: values => {
            const errors = {};

            if (!values.email) {
                errors.email = "Required";
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
                errors.email = "Invalid Email Format";
            }

            if (!values.password) {
                errors.password = "Required";
            }
            if (!userName) {
                errors.userName = "Required";
            } if (usernameError) {
                errors.userName = "username already exist";
            }

            return errors;
        },
        onSubmit: values => {
            // SigninHandler(values);
        }
    });

    useEffect(() => {
        if (userTypeCode && userTypeCode?.toString() === '3') {
            router.push('/agencyLogin?email=' + formik.values.email)
        }
        if (userType && userType?.toString() === '3') {
            router.push('/homePageAgency')
        }
    }, [userTypeCode, userType])

    useEffect(() => {
        let firstName = formik.values.firstName || "";
        let lastName = formik.values.lastName || "";
        ((firstName = "", lastName = "") => setUserName((firstName + lastName).trim().toLowerCase()))(
            firstName,
            lastName
        );
    }, [formik.values.firstName, formik.values.lastName]);

    // Validate Username
    const validateUserName = async (userName) => {
        if (!userName?.length) return;
        try {
            const response = await validateUserNameRequest(userName);
            if (response?.status === 200) {
                setUsernameError(false);
            }
        } catch (err) {
            setUsernameError(err?.response?.data?.message || true);
        }
    };

    // Validate Username
    const debounceValidateUserName = useCallback(debounce(
        validateUserName,
        700), []);

    useEffect(() => {
        renderCount.current++;
        if (renderCount.current > 1) debounceValidateUserName(userName);
    }, [userName]);

    // Validate Ref Code
    const validateRefCode = async (refCode) => {
        const refValue = refCode?.target?.value;
        if (refValue?.length < 6) return;
        return new Promise(async (res, rej) => {
            if (!refValue) {
                setReffError("");
                setValidRefCode(true);
            }
            if (refValue) {
                try {
                    const response = await validateReferralCodeRequest(refValue);
                    setValidRefCode(true);
                    res();
                } catch (e) {
                    console.error("response", e);
                    setValidRefCode(false);
                    setReffError(e?.response?.data?.message)
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

    useEffect(() => {
        if (step === 3) passwordInputRef.current.focus();
    }, [step]);

    const verifyEmail = async (values) => {
        if (step > 0) return
        VerifyEmail.email = formik.values.email;
        VerifyEmail.type = 1;
        let res;
        try {
            res = await validateEmail(VerifyEmail);
            if (res.status === 200) {
                setError("")
                if (res?.data?.data?.userTypeCode != "3") {
                    setStepper(3)
                }
                setUserTypeCode(res?.data?.data?.userTypeCode)
            }
        } catch (err) {

            if (err?.response?.status == 413) {
                // means user is registered but password is not set
                setVerificationData({
                    verificationId: err.response.data.data.verificationId,
                    timer: err.response.data.data.expiryTime,
                    enterCode: true
                })
                setStepper(1)

                let payload = {
                    email: formik.values.email,
                    type: 2,
                    trigger: 9
                }
            }
            if (err?.response?.status === 408) {
                setStepper(5)
            }

            if (err?.response?.status == 410) {
                {
                    mobileView ? open_drawer("MsgDialog", {
                        title: lang.submittedProfile,
                        desc: err.response.data.message,
                        button: {
                            text: lang.contactUs,
                            onClick: () => {
                                sendMail();
                            },
                        },
                        theme: "white"
                    }, "bottom")
                        :
                        open_dialog("MsgDialog", {
                            title: lang.submittedProfile,
                            desc: err.response.data.message,
                            button: {
                                text: lang.contactUs,
                                onClick: () => {
                                    sendMail();
                                },
                            },
                            theme: "white"
                        });
                }
            } else {
                setError(err?.response?.data.message);
            }
            console.error(err);
        }
    };

    const handleSignin = (otpValue = "", verificationId = "") => {
        let loginPayload = {
            email: formik.values && formik.values.email && formik.values.email.toLowerCase(),
            password: formik.values && formik.values.password,
            loginType: 1, //email login
            ...DevicePayload,
        };
        if (userTypeCode === 2) {
            loginPayload.verificationCode = otpValue;
            loginPayload.verificationId = verificationId || verificationData.verificationId;
        }
        startLoader()
        grecaptcha.ready(function () {
            grecaptcha.execute(process.env.NEXT_PUBLIC_RECAPTCHA_KEY, { action: 'submit' }).then(function (token) {
                if (token) {
                    loginPayload['googleRecaptchaToken'] = token
                }
                login(loginPayload)
                    .then(async (res) => {
                        const result = res.data.data;
                        setCookie("userType", result?.user?.userTypeCode);
                        setCookie("userRole", result?.user?.userRole);
                        if (!result) {
                            Toast("We are facing some issues in logging in this user!", "warning");
                            router.push({ pathname: "/agencyLogin" });
                        }
                        setLocalStorage('streamUserId', result.user.isometrikUserId);
                        setCookie("auth", true);
                        setCookie("guest", false);
                        setCookie('zone', loginPayload.timezone);
                        setCookie("email", loginPayload.email);
                        setAuthData({ ...result.token, ...result.user });
                        // dispatch(clearAllPostsAction());
                        stopLoader()
                        if (redirect) {
                            window.location.href = `/${redirect}`
                        } else {
                            router.push('/');
                        }
                        return true;
                    })
                    .catch(async (err) => {
                        stopLoader();
                        let data = err.response
                        if (err?.response?.status == 410) {
                            {
                                mobileView ? open_drawer("MsgDialog", {
                                    title: lang.profileSuspended,
                                    desc: err.response.data.message,
                                    button: {
                                        text: lang.contactUs,
                                        onClick: () => {
                                            sendMail();
                                        },
                                    },
                                    theme: "white"
                                }, "bottom")
                                    : open_dialog("MsgDialog", {
                                        title: lang.profileSuspended,
                                        desc: err.response.data.message,
                                        button: {
                                            text: lang.contactUs,
                                            onClick: () => {
                                                sendMail();
                                            },
                                        },
                                    });
                            }
                        }
                        if (err?.response?.status == 415) {
                            setAuthData({ ...data.data.data.token, ...data.data.data.user });
                            dispatch(clearAllPostsAction());
                            if (!mobileView) {
                                return open_dialog("AccAccepted", {
                                    title: lang.congratulation,
                                    desc: data.data.message,
                                    dialogClick: () => {
                                        signOut(false);
                                        close_dialog();
                                    },
                                });
                            } else {
                                return drawerToast({
                                    drawerClick: () => {
                                        signOut(false);
                                        close_drawer();
                                    },
                                    title: lang.congratulation,
                                    desc: data.data.message,
                                    button: {
                                        text: lang.continue,
                                        onClick: (e) => {
                                            router.push({
                                                pathname: "/document",
                                                query: { theme: "white" },
                                            });
                                        },
                                    },
                                    isMobile: true,
                                    logoutBtnOnTop: true
                                });
                            }
                        }
                        // if (![410, 415].includes(err?.response?.status)) {
                        //     setStepper(3);
                        // }
                        setError(err?.response?.data.message);
                        Toast(err?.response?.data.message, "error")
                    });
            });
        });
    }

    const handleSignUp = async () => {
        try {
            startLoader();
            let payload = { ...UserRegistrationPayload };

            payload.firstName = formik.values.firstName;
            payload.email = formik.values.email;
            payload.password = formik.values.password;
            payload.username = userName;
            if (formik.values.lastName?.length > 0) {
                payload.lastName = formik.values.lastName;
            }
            if (refValue?.target?.value?.length > 0) {
                payload.inviterReferralCode = refValue.target.value;
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
            const response = greaterThanSixDigit(formik.values.password);

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
            const response = numericValue(formik.values.password);
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
            const response = specialCharacter(formik.values.password);
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
            const response1 = uppercaseCharacter(formik.values.password);
            const response2 = lowercaseCharacter(formik.values.password);
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
    const ValidatePassword = () => {
        try {
            const response = validatePasswordField(formik.values.password);
            response ? setIsPasswordValid(true) : setIsPasswordValid(false);
        } catch (e) {
            console.error("ERROR IN ValidatePassword", e);
            setIsPasswordValid(false);
        }
    };

    useEffect(() => {
        ValidatePassword();
        ValidateSixDigitsInPassword();
        ValidateNumeralInPassword();
        ValidateSpecialCharacterInPassword();
        ValidateUppercaseCharacterInPassword();
    }, [formik.values.password]);

    const FormInputs = () => {
        return (
            <div className={`fntSz12`} >

                <div className="row">
                    {/* FirstName Text Field */}
                    <div className={mobileView ? 'col-12' : "col pr-1"}>
                        <div className="position-relative firstNameDiv">
                            <DVinputText
                                labelTitle={`${lang.firstNamePlaceholder}`}
                                className="form-control dv_registration_field dv_form_control stopBack text-capitalize"
                                id="firstName"
                                labelClass="text-greymuted"
                                name="firstName"
                                placeholder={`${lang.firstNamePlaceholder}`}
                                autoFocus
                                {...formik.getFieldProps('firstName')}
                                type="firstname"
                            />
                        </div>
                    </div>

                    {/* LastName Text Field */}
                    <div className={mobileView ? 'col-12' : "col pl-1"}>
                        <div className="position-relative ">
                            <DVinputText
                                labelTitle="Last Name"
                                className="form-control dv_registration_field dv_form_control stopBack text-capitalize"
                                name="lastName"
                                labelClass="text-greymuted"
                                placeholder={`${lang.lastNamePlaceholder}`}
                                type="lastname"
                                {...formik.getFieldProps('lastName')}
                            />
                        </div>
                    </div>

                </div>
                {/* UserName Text Field */}
                <div className="signup__modal">
                    <div className="position-relative">
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
                            id="userName"
                            name="userName"
                            autoComplete='off'
                            error={(formik.errors.userName && formik.touched.userName) ? formik.errors.userName : usernameError || null}
                            placeholder={`${lang.userNamePlaceholder}`}
                            type="username"
                        />
                        <div className="pb-3 dv_base_color" style={{ marginTop: "-10px", opacity: userName ? "1" : "0.5" }}>Username cannot be changed after Signup</div>
                    </div>
                </div>

                {/* Password Field */}
                <div className="row signup__modal">
                    {/* Input Password Text Field */}
                    <div className="col">
                        <div className="position-relative password_section">
                            <DVinputPassword
                                labelTitle="Password"
                                className="dv_registration_field dv_form_control stopBack"
                                name="password"
                                error={error.password}
                                placeholder={lang.passwordPlaceholder}
                                showBtn={false}
                                labelClass="text-greymuted"
                                onChange={formik.handleChange}
                                onFocus={() => setPassvalidScreen(true)}
                                onBlur={() => setPassvalidScreen(false)}
                            />
                            {passwordValidationScreen && (
                                <Paper
                                    className={`${isPasswordValid ? "text-success" : "text-danger"
                                        }`}
                                    style={{ zIndex: 2, width: "max-content", maxWidth: "fit-content" }}
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
                </div>
                <div className=" mb-2 signup__modal">
                    {/* Referal Code Text Field */}
                    <div className="refCodeDiv">
                        <div className="position-relative">
                            <DVinputText
                                labelTitle="Referral Code"
                                className="form-control dv_registration_field dv_form_control"
                                labelClass="text-greymuted"
                                name="refCode"
                                error={reffError}
                                placeholder={lang.refCode}
                                maxLength={6}
                                typeCheck="refCode"
                                autoComplete='off'
                                onChange={(e) => {
                                    setRefValue(e);
                                }}
                                type="refCode"
                            />
                        </div>
                    </div>
                </div>
                <div className="row mb-2">
                    <div className="col">
                        <label className='text-greymuted'>Timezone *</label>
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
                <style jsx>{`
          :global(.success-tooltip) {
            right: "3.9% !important";
          }
          :global(.inputParentText>.dv_form_control){
            background-color: initial !important;
            color:black !important;
        }
        :global(.dv_form_control){
            border-radius: 5px !important;
        }
        :global(.refCodeDiv .error-tooltip-container){
            right:1% !important;
        }
        :global(.refCodeDiv .error-tooltip){
            right:5% !important;
        }
        :global(.refCodeDiv .stopBack .dv_form_control){
            color:black !important;
        }
        `}</style>
            </div>
        );
    };

    const handleCreateAccountPassword = async () => {
        let payload = {
            verificationId: verificationData.verificationId,
            newPassword: formik.values.password
        }
        try {
            const response = await createAccountPassword(payload)
            if (response.status === 200) {
                setStepper(0)
                Toast("Password created successfully", "success")
            }
        } catch (error) {
            setError(error.message)
            console.log(error.message, "error")
        }
    }

    const verifyHandleremail = async () => {
        setError("")
        try {
            const paylod = {
                email: formik.values.email,
                password: formik.values && formik.values.password,
            }
            const res = await sendverificaitonCodeEmail(paylod);
            if (res.status === 200) {
                setVerificationData({
                    verificationId: res.data.data.verificationId,
                    timer: res.data.data.expiryTime,
                })
                setStepper(6)
            }
        }
        catch (err) {
            console.error("ERROR IN callUserSignUpApi", err);
            setError("Please Enter The Valid Password.")
            Toast(err.response.data.message, "error")
        }
    }

    const clearEmailField = () => {
        formik.setFieldValue('email', ''); // Clear the email field
    };


    const twoFactorAuth = () => {
        return (
            <div className=" text-center">
                <div>
                    <div className="d-flex justify-content-center mb-4">
                        <FigureImage
                            src={JUICY_HEADER_DARK_LOGO}
                            width="190"
                            height='90'
                            fclassname="m-0"
                            id="logoUser"
                            alt="logoUser"
                        />
                    </div>
                </div>
                <div className='position-relative d-flex'>
                    <h2 className={`text-black ${"mx-auto"}`} style={{ fontSize: mobileView && "7vw" }} >{"2 Factor Authentication"}</h2>
                </div>
                <div className='text-muted pb-2  pt-3'>Your security is our first priority.
                    To establish secure connection please enter the security code sent to your registered email
                </div>
                <div className=''>
                    <VerifyLoginOtp
                        ContinueToLogin={(value, id) => handleSignin(value, id)}
                        timer={Number(verificationData.timer) * 100}
                        email={formik.values.email}
                        errorText={error}
                        btnText={"Continue"}
                    ></VerifyLoginOtp>
                </div>
            </div>
        )
    }

    return (
        <div className={`col-12 loginFormControl scroll-hide position-relative ${step !== 6 && "justify-content-center"} ${step === 5 && "transition-div fade-in "} ${mobileView && `${step !== 5 && "h-100"} w-100 handleControlFormMobile`}`} style={(step === 5 && mobileView) ? { height: "fit-content" } : {}}>
            <div className={`${mobileView && "w-100"}`}> {([0, 1, 3, 5].includes(step)) ? <div className=" text-center ">
                <div className="text-center" style={{ marginTop: step === 5 && !mobileView && "60px" }}>
                    <div>
                        <div className="d-flex justify-content-center mb-4">
                            <FigureImage
                                src={JUICY_HEADER_DARK_LOGO}
                                width="190"
                                height='90'
                                fclassname="m-0"
                                id="logoUser"
                                alt="logoUser"
                                onClick={() => router.push("/")}
                            />
                        </div>
                    </div>
                    <div className='position-relative d-flex'>
                        <h2 className={`text-black text-nowrap ${"mx-auto"}`} style={{ fontSize: mobileView && "7vw" }} >{"Continue To Your Account"}</h2>
                    </div>
                    <div className='text-muted'>{lang.supportFavorite}</div>
                </div>
            </div> : <div className={`text-center ${step === 6 && "d-none"}`} >
                <div className="d-flex">
                    <Icon
                        icon={`${Arrow_Left2}#arrowleft2`}
                        hoverColor='var(--l_base)'
                        color={'black'}
                        width={20}
                        height={20}
                        onClick={() => {
                            setError("")
                            step === 5 ? setStepper(0) : step === 2 ? setStepper(0) : setStepper(1)
                        }}
                        class={`backArrow ${mobileView ? "mt-1" : "mt-2"}`}
                        alt="Back Arrow"
                        viewBox="0 0 20 20"
                    />
                    <h2 style={{ fontSize: mobileView && "7vw" }} className='text-black m-auto'>
                        {"Create New Password"}</h2>
                </div>
            </div>}
                <form onSubmit={formik.handleSubmit} className='mt-2'>
                    {!!([0, 1, 3, 5].includes(step)) && <div className='my-3 emailDiv'>
                        <DVinputText
                            labelTitle="Email"
                            className="form-control dv_form_control stopBack emailTextInputFiled mb-0"
                            id="email"
                            name="email"
                            autoComplete='off'
                            placeholder={"Email"}
                            labelClass="text-greymuted fntSz12"
                            style={{ borderBottom: "1px soild " }}
                            type="email"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                            error={(formik.errors.email && formik.touched.email) ? formik.errors.email : null}
                            setStepper={setStepper}
                            nextArrow={!step}
                            crossIcon={step === 5 || step === 1 || step === 2 || step === 3}
                            crossIconClick={() => {
                                setError("");
                                clearEmailField();
                                step === 3 ? setStepper(0) : step === 5 ? setStepper(0) : setStepper(0)
                            }}
                            onKeyDown={(e) => {
                                if (e.keyCode == 13) {
                                    verifyEmail()
                                }
                            }}
                            nextArrowClick={verifyEmail}
                            disabledField={step === 5 || step === 3}
                            {...formik.getFieldProps('email')}
                        />
                    </div>}
                    {!!(step === 1) && <div className='my-3'>
                        <DvVerifyOtp
                            updatePhone={false}
                            setStepper={() => {
                                console.log("sijdadijijdij")
                                setError("")
                                setStepper(2)
                            }}
                            timer={Number(verificationData.timer) * 100}
                            verificationId={verificationData.verificationId}
                            email={formik.values.email}
                            userMigration={userMigration}
                            onClose={props.onClose}
                            showError={true}
                            errorText={error}
                        ></DvVerifyOtp>
                    </div>
                    }

                    {step === 2 && <div className='mt-5 passwordDiv'>
                        <DVinputPassword
                            labelTitle="New Password"
                            className="dv_registration_field dv_form_control stopBack password"
                            name="password"
                            id="password"
                            labelClass="text-greymuted"
                            placeholder={lang.newPassword}
                            inicatorClass={"alertClass"}
                            btnName="Confirm"
                            errorIocnClass={"iconClass"}
                            btnOnClick={handleCreateAccountPassword}
                            error={(formik.errors.password && formik.touched.password) ? formik.errors.password : null}
                            onFocus={() => setPassvalidScreen(true)}
                            onBlur={() => setPassvalidScreen(false)}
                            onChange={formik.handleChange}
                            disabled={!isPasswordValid}
                            showBtn={true}
                        />
                        {passwordValidationScreen && (
                            <Paper
                                className={`${isPasswordValid ? "text-success" : "text-danger"
                                    }`}
                                style={{ zIndex: 2, width: "max-content", maxWidth: "fit-content" }}
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
                    }

                    {step === 3 && <div className='mt-3 position-relative passwordDiv'>
                        <DVinputPassword
                            labelTitle="Password"
                            ref={passwordInputRef}
                            className="dv_registration_field dv_form_control stopBack password"
                            name="password"
                            labelClass="text-greymuted"
                            isAgency={false}
                            placeholder={lang.enterPass}
                            inicatorClass={"alertClass"}
                            showBtn={true}
                            errorIocnClass={"iconClass"}
                            btnName="Login"
                            disabled={formik.values.password.length < 6}
                            btnOnClick={() => {
                                if (userTypeCode === 2) {
                                    verifyHandleremail();
                                } else {
                                    handleSignin();
                                }
                            }}
                            error={(formik.errors.password && formik.touched.password) ? formik.errors.password : null}
                            {...formik.getFieldProps('password')}
                        />
                        <p className='text-app mb-0 text-right position-absolute gradient_text cursor-pointer' style={{ top: "72px", right: 0 }} onClick={() => { mobileView ? open_drawer("FrgtPass", { closeAll: true }, "bottom") : open_dialog("FrgtPass", { closeAll: true }) }}
                        >{lang.forgotPassword}?</p>
                    </div>}
                    {error && ![1, 6].includes(step) && <p className='text-danger fntSz12'>{error}</p>}

                    {/* Signup Flow Below */}
                    {step === 5 && <>
                        {FormInputs()}
                        <Button
                            fclassname="font-weight-500 my-3 btnGradient_bg rounded-pill"
                            btnSpanClass="text-white"
                            type="submit"
                            onClick={handleSignUp}
                            disabled={!(isPasswordValid && formik.values.email && formik.values.firstName && userName && !usernameError && validRefCode)}
                        >
                            {lang.signup}
                        </Button>
                    </>
                    }
                    {step === 6 && <>

                        {twoFactorAuth()}
                    </>}
                </form></div>
            {step === 0 &&
                <div className='text-center pt-2 w-100 handleSignupSection mb-2'>
                    <p className='text-greymuted text-center' onClick={() => router.push("/signup-as-creator")}>Are you a Creator? <span className='gradient_text cursor-pointer text_underline_hover'>Signup as a Creator</span></p>
                </div>
            }
            <style jsx>{`
        :global(.iconClass){
          right:13% !important;
        }
        :global(.dv_form_control::placeholder){
            color: gray !important;
        }
        :global(.stopBack.dv_form_control){
          border: 1px solid silver !important;
          background-color:var(--l_app_bg)!important;
          color:black !important;
        }
        :global(.alertClass){
          right:19% !important;
        }
        :global(.otp-input .error-tooltip-container),:global(.otp-input .error-tooltip){
            display:none !important;
        }
        :global(.stopBack.dv_form_control, .inputParentText>.dv_form_control){
            background-color: initial !important;
        }
        :global(input:-webkit-autofill){
            -webkit-box-shadow: 0 0 0px 1000px white inset !important;
            -webkit-text-fill-color:black !important;
        }
        :global(.emailDiv .dv_form_control){
            border-radius:5px 0px 0px 5px!important;
        }
        :global(.inputParentText){
            display:flex !important; 
        }
        :global(.passwordDiv .iconClass){
            right:8% !important;
        }
        :global(.passwordDiv .error-tooltip){
            right:12% !important;
        }
        .handleControlFormMobile{
            display: flex;
            align-content: space-between;
            flex-wrap: wrap;
        }
        :global(.FrgtPass .card_bg){
            background:inherit !important;
        }
        :global(.timezone_section .dv_appTxtClr){
            color:gray !important;
        }
        :global(.FrgtPass .specific_section_bg),:global( .FrgtPass1 .specific_section_bg ){
            background-color: inherit !important;
        }
        :global(.FrgtPass .borderStroke),:global( .FrgtPass1 .borderStroke ){
            border: inherit !important;
        }
        :global(.FrgtPass .dv_form_control),:global( .FrgtPass1 .dv_form_control ){
            background: inherit !important;
        }
        :global(.FrgtPass .dv_form_control::placeholder,.dv_form_control::placeholder){
            color: gray !important;
        }
        :global(.FrgtPass .dv_modal_title),:global( .FrgtPass1 .dv_modal_title ){
            color: inherit !important;
        }
        :global(.FrgtPass .inputParentText .error-tooltip-container){
            right: 0 !important;
        }
        :global(.handleNextArrow){
            width: 12%;
            display:flex;
            align-items:center;
            justify-content:center;
            background: linear-gradient(102.33deg, rgb(254, 111, 166) 0%, rgb(212, 59, 253) 100%);
            border-radius:0px 5px 5px 0px;
        }
        :global(.firstNameDiv .error-tooltip-container),:global(.emailDiv .error-tooltip-container){
            right: 43px !important;
        }
        
        :global(.inputParentText .error-tooltip){
            right: 5% !important;
        }
        :global(.error-tooltip){
            right: 17% !important;
        }
        :global(.emailTextInputFiled){
            width:88%;
        }
        .loginFormControl{
            height: ${step !== 5 && "100%"};
            // overflow-y:auto;
            display:flex !important;
            flex-direction: column;
            justify-content: ${mobileView ? "space-between" : "space-around"};
        }
        :global(.emailDiv .dv_form_control:focus){
            border-radius:5px 0px 0px 5px!important;
            color:black;
        }
        :global(.dv__modelHeading){
            font-size:14px !important;
            text-align:start;
            color:#8B8B8B !important;
            font-weight:normal;
        }
        .transition-div {
            transition: all 3s ease-in-out;
            // overflow: hidden;
            opacity: 0;
          }
          .fade-in {
            animation: fade-in-animation 1s forwards;
          }
          @keyframes fade-in-animation {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        :global(.dv_form_control){
            border: 1px solid silver !important;
        }
        :global(.dv_form_control:focus){
            border-radius:5px !important;
        }
        :global(.arrow_on_right){
            top: 67%; !important;
        }
        :global(.FrgtPass .error-tooltip){
            right: ${mobileView ? "43px !important" : "4% !important"}
        }
        :global(.FrgtPass .dv_form_control:focus){
            color: inherit !important;
        }
        :global(.dv__verifyCodeSec .form-control){
            width:100% !important;
            height: ${mobileView ? "calc(20vw - 35px) !important" : "calc(5vw - 18px) !important"};
            border-radius:8px !important;
        }
        :global(.dv__verifyCodeSec .handleOtpBox > div > div){
            width: calc(100% / 6);
        }
        :global(.dv__verifyCodeSec .form-group) {
            width: 100%;
        }
        :global(.borderColor){
            border-radius:1.5px solid silver!important
        }
        :global(.emailDiv > div){
            margin-bottom:0 !important;
        }
        :global(.AccAccepted > .targetDialog){
            background: white !important;
            color: black !important;
            border: none !important;
        }
        :global(.AccAccepted > .targetDialog .dv__RadioContainer ){
            color: black !important;
        }
        :global(.AccAccepted > .targetDialog .user__docType__modal__layout .select_reason_bg-color ){
            background: white !important;
        }
        :global(.AccAccepted > .targetDialog > div > div > div),:global(.AccAccepted > .targetDialog > div > div ){
            color: black !important;
        }
        :global(.AccAccepted > .targetDialog > div > div > .user__docType__modal__layout > div ),:global(.AccAccepted > .targetDialog > div > div > .user__docType__modal__layout > h6 ),:global(.AccAccepted > .targetDialog > div > div > .user__docType__modal__layout > p ){
            color: black !important;
        }

        :global(.drawerToaster #signInContent){
            background:white !important;
        }
        :global(.drawerToaster #signInContent h5),:global(.drawerToaster #signInContent > div > div){
            color:black !important;
        }
      `}</style>
        </div>
    );
};

export default userMigrationLoginForm;
