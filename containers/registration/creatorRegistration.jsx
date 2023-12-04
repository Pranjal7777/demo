import Script from "next/script";
import { useTheme } from "react-jss";
import { Button as Paper } from "@material-ui/core";
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
import DVphoneno from "../../components/DVformControl/DVphoneno";
import DVdatePicker from "../../components/DVformControl/DVdatePicker";
import DVinputText from "../../components/DVformControl/DVinputText";
import DVRadioButton from "../../components/DVformControl/DVradioButton";
import {
    close_dialog,
    greaterThanSixDigit,
    lowercaseCharacter,
    numericValue,
    open_dialog,
    specialCharacter,
    startLoader,
    stopLoader,
    Toast,
    uppercaseCharacter,
    validatePasswordField,
} from "../../lib/global";
import {
    BecomeCreatorPayload,
    ModelRegistrationPayload,
    ValidatePhoneNoPayload,
    VerifyEmail,
} from "../../lib/data-modeling";
import {
    becomeCreator,
    signUp,
    validateEmail,
    validatePhoneNumber,
    validateReferralCodeRequest,
    validateUserNameRequest,
} from "../../services/auth";
import { getCookie, setCookie } from "../../lib/session";
import { TIME_ZONE_KEY_LABEL, TIMEZONE_LIST } from "../../lib/timezones";
import isMobile from "../../hooks/isMobile";
import Image from "../../components/image/image";
import { close_drawer, open_drawer } from "../../lib/global/loader";
import { isSubDomain } from "../../lib/config/domain";
import LoginWithGoogle from "../../components/socialLogin/google";
import { useRouter } from "next/router";
import useProfileData from "../../hooks/useProfileData";
import { JUICY_HEADER_DARK_LOGO, SIGNUP_BANNER_CREATOR_1, SIGNUP_BANNER_CREATOR_2, SIGNUP_BANNER_CREATOR_3 } from "../../lib/config/logo";
import { APP_NAME, FOLDER_NAME_IMAGES } from "../../lib/config/creds";
import debounce from "lodash/debounce";
import { clearAll } from "../../lib/global/clearAll";
import { PostPlaceHolder } from "../../components/post/PostPlaceHolder";
import { getFileType } from "../../lib/helper";
import SelectMenuInput from "../../components/select-input/select-input";
import { getCategoriesData } from "../../services/user_category";

const CreatorRegistration = (props) => {
    const theme = useTheme();
    const [lang] = useLang();
    const router = useRouter();
    const [mobileView] = isMobile();
    const [profile] = useProfileData();
    const timeZoneList = TIMEZONE_LIST;

    const phoneRef = useRef({});
    const [phone, setPhone] = useState();
    const [date, setDatePicker] = useState();
    const [validRefCode, setValidRefCode] = useState(true);
    const [refValue, setRefValue] = useState("");
    const [phoneInput, setPhoneInput] = useState({});
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [availabelCategories, setAvailabelCategories] = useState([]);
    const [selectedCategoryinputValue, setSelectedCategoryInputValue] =
        useState("");
    const [signUpdata, setSignupPayload] = useState({
        ...(props.signup || {}),
    });
    const [gender, setGender] = useState(signUpdata.gender || "");
    const [password, setPassword] = useState("");
    const [switchToUser, setSwitchToUser] = useState("USER");
    const [isPhoneValid, setIsPhoneValid] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [isSceduleTime, setIsSceduleTime] = useState(TIME_ZONE_KEY_LABEL[defaultTimeZone().toLowerCase()]);
    const [passwordValidationScreen, setPassvalidScreen] = useState(false);
    const [userName, setUserName] = useState(profile?.username || "");
    const [firstName, setFirstName] = useState(signUpdata.firstName || "");
    const [lastName, setLastName] = useState(signUpdata.lastName || "");
    const [emailValue, setEmailValue] = useState(signUpdata.email || "");
    const renderCount = useRef(0);
    const [selectedFiles, setSelectedFiles] = useState([]);
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

    const handleFirstName = (e) => {
        let value = e.target.value;
        const regex = /^[a-zA-Z]+$/.test(value);
        if (regex || !value) {
            setFirstName(value);
        }
    };
    const handleLastName = (e) => {
        let value = e.target.value;
        const regex = /^[a-zA-Z]+$/.test(value);
        if (regex || !value) {
            setLastName(value)
        }
    };

    const handleRemoveFile = (id) => {
        const currentFile = selectedFiles.find(f => f.id === id);
        const currentFileIndex = selectedFiles.findIndex(f => f.id === id);
        if (currentFile) {
            const allFiles = [...selectedFiles]
            allFiles.splice(currentFileIndex, 1)
            setSelectedFiles([...allFiles])
            // setRemoveFile(id)
        }
    }

    const handleUploadSuccess = (files) => {
        const allFiles = [{
            seqId: 1,
            preview: getFileType(files[0].data) === "VIDEO" ? files[0].meta?.thumb : files[0].preview,
            id: files[0].id,
            thumb: getFileType(files[0].data) === "VIDEO" ? files[0].meta?.thumb : files[0].meta.key,
            type: getFileType(files[0].data),
            file: files[0].meta.key,
        }]
        setSelectedFiles(allFiles);
        close_dialog("S3Uploader");
        close_drawer("S3Uploader");
    }


    const handleBeforUpload = (files, startUpload) => {
        startUpload(files)
    }

    const uploadDhoutoutVideo = () => {
        open_dialog("S3Uploader", {
            autoProceed: false,
            showUploadButton: true,
            targetId: "ProfilePic",
            fileTypes: ['image/*'],
            handleClose: function () { close_dialog("S3Uploader") },
            open: true,
            folder: `${FOLDER_NAME_IMAGES.profile}`,
            successCallback: (files) => handleUploadSuccess(files),
            // removeFile: removeFile,
            theme: theme.type,
            limit: 1,
            watermark: false,
            beforeUpload: (files, startUpload) => handleBeforUpload(files, startUpload),
            isTransForm: true,
            autoOpenFileEditor: true
        })
    };

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
            email: router.query.email || props.BecomeCreator && (profile?.email || getCookie('email') || ''),
            firstName: router.query.firstName || profile?.firstName || '',
            lastName: router.query.lastName || profile?.lastName || '',
            refCode: router.query.referId || getCookie("referId"),
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

    const handleCategories = async () => {
        if (availabelCategories?.length) return;
        try {
            // API CALL
            const res = await getCategoriesData();
            const data = res?.data?.data
            setAvailabelCategories(data)
        } catch (e) {
            console.error("Error in handleCategories", e);
        }
    }

    const handleSelectChange = (event) => {
        setSelectedCategories(event.target.value);
    };

    useEffect(() => {
        const categoryLabel = [];
        availabelCategories.forEach((cat, index) => {
            if (selectedCategories?.includes(cat?._id)) {
                categoryLabel?.push(cat?.title);
            }
        });
        setSelectedCategoryInputValue(categoryLabel);
    }, [selectedCategories]);

    useEffect(() => {
        if (!props.BecomeCreator) {
            ((firstName = "", lastName = "") => setUserName((firstName + lastName).replace(/[^\w\s]/g, '').slice(0, 32).toLowerCase()))(
                value.firstName,
                value.lastName
            );
        }
    }, [value.firstName, value.lastName, firstName, lastName]);

    useEffect(() => {
        value.password = password;
        ValidatePassword();
        ValidateSixDigitsInPassword();
        ValidateNumeralInPassword();
        ValidateSpecialCharacterInPassword();
        ValidateUppercaseCharacterInPassword();
    }, [password]);

    const validateUserName = async (userName) => {
        if (!userName?.length) {
            setElementError("userName", "Username required");
            return;
        }
        if (props.BecomeCreator && (profile.username == userName)) {
            setValidInputMsg("userName", 'userName is correct');
        } else {
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
        }
    }

    // Validate Username
    const debounceValidateUserName = useCallback(debounce(
        validateUserName,
        700), [profile, props.BecomeCreator]);

    useEffect(() => {
        renderCount.current++;
        if (renderCount.current > 1) debounceValidateUserName(userName);
        value.userName = userName;
    }, [userName]);

    // Validate Email Address
    const validateEmailAddress = async (inputValue) => {
        if (props.BecomeCreator) {
            setElementError("email", false);
            setValidInputMsg("email", 'email is correct');
        } else {
            return new Promise(async (res, rej) => {
                try {
                    VerifyEmail.email = inputValue || value.email;
                    VerifyEmail.type = 2;
                    // VerifyEmail.userType = getCookie("userType");
                    const response = await validateEmail(VerifyEmail);
                    setElementError("email", false);
                    setValidInputMsg("email", response?.data?.message);
                    res();
                } catch (e) {
                    console.error("validateEmailAddress", e);
                    e.response && setElementError("email", e?.response?.data?.message);
                    rej();
                }
            });
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

    const handleGoBack = () => {
        const { referId = "", referralSource = "" } = router.query;
        if (referId && referralSource) return window.open(`/signup-as-creator?referId=${referId}&referralSource=${referralSource}`, '_self');
        window.open('/', '_self');
    };

    const callModelSignUpApi = async () => {
        try {
            startLoader();
            let payload = props.BecomeCreator ? { ...BecomeCreatorPayload } : { ...ModelRegistrationPayload };
            let url = selectedFiles?.[0]?.file
            payload.firstName = value.firstName;
            //   payload.lastName = value.lastName;
            // payload.email = value.email;
            // payload.password = value.password;
            payload.username = value.userName;
            payload.profilePic = url;
            payload.countryCode = phoneInput.countryCode;
            payload.phoneNumber = phoneInput.phoneNo;
            payload.countryCodeName = phoneInput.iso2;
            payload.dateOfBirth = date;
            payload.groupIds = selectedCategories;
            payload.gender = gender;
            // payload.socialMediaLink = value.socialLink;
            if (value?.lastName?.length > 0) {
                payload.lastName = value.lastName;
            }
            if (value.refCode) {
                payload.inviterReferralCode = value.refCode;
            }
            payload.timezone = isSceduleTime.value;
            let res;

            if (props.BecomeCreator) {
                res = await becomeCreator(payload);
            } else {
                payload.isNSFWAllow = false;
                payload.email = value.email;
                payload.password = value.password;
                res = await signUp(payload);
            }

            stopLoader();
            if (res?.status === 200) {
                if (props.BecomeCreator) {
                    setCookie('zone', null);
                    setCookie("email", null);
                    setCookie("auth", false);
                    setCookie("guest", true);
                    clearAll()
                    mobileView ? open_drawer("profileSubmitted", {}, "right") : open_dialog("profileSubmitted", { onBackdropClick: true });
                } else {
                    const data = res.data && res.data.data ? res.data.data : {};
                    // setLocalStorage('streamUserId', data.user.streamUserId);
                    // setAuthData({ ...data.token, ...data.user });
                    // dispatch(clearAllPostsAction());
                    // setCookie("auth", true);
                    // setCookie("guest", false);
                    // setCookie('zone', payload.timezone);
                    // setCookie("email", payload.email);
                    // router.push("/login");
                    mobileView ? open_drawer("profileSubmitted", {}, "right") : open_dialog("profileSubmitted", { onBackdropClick: true });
                }
            }
        } catch (err) {
            stopLoader();
            if (err.response) {
                Toast(err?.response?.data?.message, "error");
            }
            console.error(err);
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

    // const timezoneHandler = () => {
    //     if (props.BecomeCreator || isSubDomain) {
    //         mobileView ?
    //             open_drawer("timeZone", {
    //                 setIsSceduleTime: (selectTimezone) =>
    //                     setIsSceduleTime(selectTimezone),
    //                 isSceduleTime,
    //             }, "right") :
    //             open_dialog("timeZone", {
    //                 setIsSceduleTime: (selectTimezone) =>
    //                     setIsSceduleTime(selectTimezone),
    //                 isSceduleTime,
    //             });
    //     }
    // }

    // let isPasswordMatch = value["password"] === value["confirmPassword"]
    const FormInputs = () => {
        return (
            <div className={`fntSz12 ${!mobileView && 'pr-3'}`}>
                {/* Upload Image */}
                <div className="my-3">
                    <div className="row">
                        <div className="col-12">
                            <h5 className="">{lang.imageUpload}</h5>
                            <p className="signIn__txt cursorPtr text-left fntSz11 mb-3 light_app_text" >{lang.coverImageText + APP_NAME}</p>
                            <div className="d-flex flex-row align-items-start signupPage">
                                <PostPlaceHolder
                                    isEdit
                                    showTitle={false}
                                    isSingle
                                    showThumb
                                    setFiles={setSelectedFiles}
                                    handleRemoveFile={handleRemoveFile}
                                    onClick={uploadDhoutoutVideo}
                                    files={selectedFiles}
                                />
                                <span className="ml-3">
                                    <h6 className="cursorPtr text-left">{lang.upload}</h6>
                                    <div className="fntSz11 signIn__txt my-2 light_app_text">{lang.supportImgUpload}</div>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    {/* FirstName Text Field */}
                    <div className='col-12'>
                        <div className="position-relative">
                            <DVinputText
                                labelTitle={`${lang.firstNamePlaceholder}`}
                                className="form-control dv_registration_field dv_form_control stopBack text-capitalize"
                                id="firstName"
                                // defaultValue={signUpdata.firstName || ""}
                                name="firstName"
                                error={error.firstName}
                                autoComplete='off'
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
                                disabledField={props.BecomeCreator ? false : !isSubDomain}
                                onChange={handleFirstName}
                                value={signUpdata.firstName || firstName || ""}
                            />
                        </div>
                    </div>
                    {/* LastName Text Field */}
                    <div className='col-12'>
                        <div className="position-relative">
                            <DVinputText
                                labelTitle="Last Name"
                                className="form-control dv_registration_field dv_form_control stopBack text-capitalize"
                                id="lastName"
                                // defaultValue={signUpdata.lastName || ""}
                                name="lastName"
                                autoComplete='off'
                                error={error.lastName}
                                ref={Register({ emptyAllow: true })}
                                placeholder={`${lang.lastNamePlaceholder}`}
                                type="lastname"
                                disabledField={props.BecomeCreator ? false : !isSubDomain}
                                onChange={handleLastName}
                                value={signUpdata.lastName || lastName || ""}
                            />
                        </div>
                    </div>
                </div>

                <div className="fntSz11">
                    {/* Date Picker */}
                    <div className="position-relative">
                        <DVdatePicker
                            labelTitle="Date Of Birth *"
                            signUpdata={signUpdata}
                            setDatePicker={setDatePicker}
                            placeholder={lang.refCode}
                            disabledField={props.BecomeCreator ? false : !isSubDomain}
                        />
                    </div>
                </div>

                {/* Gender */}
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
                            disabled={props.BecomeCreator ? false : !isSubDomain}
                        />
                        <DVRadioButton
                            name={"gender"}
                            value={"Female"}
                            label={"Female"}
                            checked={gender === "Female"}
                            onChange={(value) => setGender(value)}
                            disabled={props.BecomeCreator ? false : !isSubDomain}
                        />
                        <DVRadioButton
                            name={"other"}
                            value={"Other"}
                            label={"Other"}
                            checked={gender === "Other"}
                            onChange={(value) => setGender(value)}
                            disabled={props.BecomeCreator ? false : !isSubDomain}
                        />
                    </div>
                </div>

                {/* UserName Text Field */}
                <div className="">
                    <div className="position-relative">
                        <DVinputText
                            labelTitle="Username"
                            className="form-control dv_registration_field dv_form_control stopBack"
                            defaultValue={userName}
                            onChange={(e) => {
                                let inputValue = e.target.value;
                                let formattedValue = inputValue.replace(/[^\w\s]/g, '').trim().toLowerCase();
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
                            disabledField={props.BecomeCreator ? false : !isSubDomain}
                        />
                        <div className="pb-3 dv_base_color" style={{ marginTop: "-10px", opacity: userName ? "1" : "0.5" }}>Username cannot be changed after Signup</div>
                    </div>
                </div>

                {/* Email Text Field */}
                <div className="row">
                    <div className="col">
                        <div className="position-relative">
                            <DVinputText
                                labelTitle="Email"
                                className="form-control dv_form_control stopBack"
                                id="email"
                                name="email"
                                autoComplete='off'
                                defaultValue={signUpdata.email}
                                error={error.email}
                                validMsg={validMsg.email}
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
                                style={{ borderBottom: "1px soild ", paddingRight: "2.4rem" }}
                                type="email"
                                switchToUser={switchToUser}
                                disabledField={!isSubDomain || props.BecomeCreator}
                            />
                        </div>
                    </div>
                </div>

                {/* Phone Number Text Field */}
                <div className="">
                    <div className="position-relative">
                        <DVphoneno
                            labelTitle="Phone Number"
                            setRef={(childRef) => (phoneRef.current = childRef.current)}
                            // setPhoneNo={setPhoneNo}
                            setPhone={setPhone}
                            setPhoneInput={setPhoneInput}
                            placeholder='Phone Number'
                            phoneInput={phoneInput}
                            onBlur={() => ValidatePhoneNo()}
                            phoneNo={signUpdata.phoneNumber}
                            countryCode={signUpdata.countrycode}
                            iso2={signUpdata.iso2}
                            isPhoneValid={isPhoneValid ? lang.validPhoneNumber : ""}
                            typeCheck="phoneNumber"
                            disabledField={props.BecomeCreator ? false : !isSubDomain}
                        />
                    </div>
                </div>

                {/* Password Field */}
                {!props.BecomeCreator && <div className="row signup__modal">
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
                                disabledField={props.BecomeCreator ? false : !isSubDomain}
                            />
                        </div>
                        {passwordValidationScreen && (
                            <Paper
                                className={`position-absolute d-block bg-white ${isPasswordValid ? "text-success" : "text-danger"
                                    }`}
                                style={!mobileView ? { zIndex: 2, width: "max-content" } : { zIndex: 2, width: 'auto', marginRight: '15px' }}
                            >
                                {Object.values(passwordCheck).map((checker) => (
                                    <div
                                        key={checker.id}
                                        className={`d-flex align-items-center p-1 mr-1 ${checker.state ? "text-success" : "text-danger"
                                            }`}
                                    >
                                        <CheckOutlineIcon fontSize="small" className="mr-2" />
                                        <p className="mb-0 font-weight-500 text-left" style={{ fontSize: '0.66rem' }}>
                                            {checker.str}
                                        </p>
                                    </div>
                                ))}
                            </Paper>
                        )}
                    </div>
                </div>}

                {/* category Text Field */}
                <div className="row mb-2">
                    <div className="col">
                        <label>{lang.category} *</label>
                        <div>
                            <SelectMenuInput
                                handleClick={handleCategories}
                                placeholder={lang.chooseCategory}
                                isMultiple
                                categories={availabelCategories}
                                value={selectedCategories}
                                selectedCategoryValue={selectedCategoryinputValue}
                                onChange={handleSelectChange}
                            />
                        </div>
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
                                // onBlur={() => goToRef()}
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
                                switchToUser={switchToUser}
                                type="refCode"
                                disabledField={props.BecomeCreator ? false : !isSubDomain}
                            />
                        </div>
                    </div>
                </div>
                <style jsx>{`
          :global(.success-tooltip) {
            right: 5% !important;
          }
          :global(.MuiTypography-body1) {
            font-size: 1rem !important;
          }
          :global(.signupPage #uploadPostFile) {
            padding: 0px !important;
          }
          :global(.signupPage .contentBox) {
            width: 72px !important;
            height: 72px !important;
          }
          :global(.signupPage .fileItem), :global(.signupPage .fileItem img) {
            width: 72px !important;
            height: 72px !important;
            margin: 0px !important;
          }
          :global(.signupPage .fileItem .removeFile) {
            bottom: 3px !important;
            right: 3px !important;
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
        { id: 1, webImage: SIGNUP_BANNER_CREATOR_1 },
        { id: 2, webImage: SIGNUP_BANNER_CREATOR_2 },
        { id: 3, webImage: SIGNUP_BANNER_CREATOR_3 },
    ];

    const handleSignupAsUser = () => {
        const { referId = "", referralSource = "" } = router.query
        if (referId && referralSource) return window.open(`/signup-as-user?referId=${referId}&referralSource=${referralSource}`, '_self')
        window.open('/signup-as-user', '_self')
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
                    {/* {!mobileView && !props.BecomeCreator && <div className=" p-0 vh-100 d-flex reg__left__sec">
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
                        className={`d-flex reg__right__sec ${props.BecomeCreator ? 'justify-content-start' : 'justify-content-center'}`}
                        style={{
                            background: `${theme.type == "light" ? "#FFF" : "#242a37"}`,
                            overflowY: "auto",
                            height: "calc(var(--vhCustom, 1vh) * 100)"
                        }}
                    >
                        {!mobileView && !props.BecomeCreator && <div
                            className="text-muted cursorPtr position-absolute"
                            style={{ right: 10, top: 10 }}
                            onClick={() => handleGoBack()}
                        >
                            <CancelIcon fontSize="large" />
                        </div>}
                        <div className={`${!props.BecomeCreator && !mobileView && 'pt-5 m-auto'} reg__right__sec__inner`}>
                            {mobileView && <div className="pl-3 py-3 sticky-top d-flex flex-row align-items-center " style={{ background: "#fff", zIndex: '99' }}>
                                <Image
                                    alt="model-registration"
                                    onClick={() => { close_drawer('BECOME_CREATOR'), handleGoBack() }}
                                    src={theme.type === "light" ? config.backArrow : config.backArrow_lightgrey}
                                    width={28}
                                    id="scr2"
                                />
                                <div className="text-center w-100 pr-4">
                                    {!props.BecomeCreator ? <h3 className="mb-0">{lang.signupAsCreator}</h3> : <h3 className="mb-0">Become a Creator</h3>}
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
                                {!props.BecomeCreator ? <div><h3>{lang.signupAsCreator}</h3>
                                    <div className="light_app_text">{lang.getStarted}</div>
                                    <LoginWithGoogle handleLogin={props.handleLogin} />
                                    <div style={{ color: "#6F7173" }}>— OR —</div> </div> : <div className="text-left">
                                    <h3>Become a Creator</h3>
                                    <div className="light_app_text">{lang.getStarted}</div>
                                </div>}
                            </div>

                            {/* SignUp Form */}
                            <div className="col-12 mb-4">
                                <form>
                                    <div style={{ margin: "10px 0" }}>{FormInputs()}</div>

                                    {/* Sign Up Button */}
                                    <div className={`my-2 ${!mobileView && 'pr-3'}`}>
                                        <Button
                                            type="button"
                                            disabled={
                                                !(
                                                    (props.BecomeCreator ? true : isValid) &&
                                                    selectedFiles?.[0]?.file &&
                                                    gender &&
                                                    phoneInput &&
                                                    isPhoneValid &&
                                                    date &&
                                                    validRefCode &&
                                                    selectedCategories.length &&
                                                    isSubDomain &&
                                                    (props.BecomeCreator ? true : isPasswordValid)
                                                )
                                            }
                                            onClick={(e) => callModelSignUpApi(e)}
                                            fclassname='mt-4 btnGradient_bg rounded-pill text-white'
                                            children={props.BecomeCreator ? 'Become a Creator' : 'Signup as a Creator'}
                                        />
                                    </div>

                                    <div className={`txt-book fntSz12 pt-2 ${!mobileView && 'pr-3 fntSz11'} ${props.BecomeCreator && 'pb-4'}`}>
                                        By signing up you agree to our <a href="terms-and-conditions" target="_blank" className="font-weight-600">
                                            Terms & Conditions
                                        </a> and <a href="privacy-policy" target="_blank" className="font-weight-600">
                                            Privacy Policy
                                        </a>, and confirm that you are at least 18 years old.
                                    </div>

                                    {/* Sign Up Button */}
                                    {!props.BecomeCreator && <div className="mt-3">
                                        <div className="text-center fntSz12" style={{ letterSpacing: '0.39996px' }}>
                                            Already a member?{' '}
                                            <span className="fntClrTheme cursorPtr txt-underline" onClick={() => window.open('/login', '_self')}>
                                                Login now
                                            </span>
                                        </div>
                                        <div className="text-center fntSz12 mt-2" style={{ letterSpacing: '0.39996px' }}>
                                            Not a member yet?{' '}
                                            <span className="fntClrTheme cursorPtr txt-underline" onClick={handleSignupAsUser}>
                                                Signup as a User
                                            </span>
                                        </div>
                                    </div>}
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
            background: ${props.BecomeCreator ? "none" : "none"} !important;
            ${!mobileView && `width: ${props.BecomeCreator ? '100%' : '55%'}`};
        }
        ::-webkit-scrollbar {
            display: none !important;
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
        :global(.password_section .error-tooltip) {
            right: 47px !important;
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

export default CreatorRegistration;
