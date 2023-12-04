import React, { useEffect, useRef } from "react";
import Head from 'next/head';

import { signUp } from "../services/auth";
import { FOLDER_NAME_IMAGES, signupBackground } from "../lib/config";
import {
    close_drawer,
    handleCreateWallet,
    setAuthData,
    startLoader,
    stopLoader,
    Toast,
    UploadImage,
} from "../lib/global";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import {
    UserRegistrationPayload,
    ModelRegistrationPayload,
} from "../lib/data-modeling";

import { getCookie, setCookie, setLocalStorage } from "../lib/session";
import isMobile from "../hooks/isMobile";
import dynamic from "next/dynamic";

const ProfileSubmited = dynamic(() => import("../containers/registration/profile-submited"), { ssr: false });
import { useTheme } from "react-jss";
import { getCognitoToken } from "../services/userCognitoAWS";
import fileUploaderAWS from "../lib/UploadAWS/uploadAWS";
import { clearAllPostsAction } from "../redux/actions/dashboard/dashboardAction";
import CreatorRegistration from "../containers/registration/creatorRegistration";
import userGoogleAuth from "../hooks/useGoogleAuth";

const PageType = {
    user: "user",
    model: "model",
    success: "submitted",
};
const Registration = (props) => {
    // console.log("profile intgraytop", props);
    const theme = useTheme();
    const dispatch = useDispatch();
    const router = useRouter();
    const { type } = router.query;
    const [mobileView] = isMobile();
    const [handleLogin] = userGoogleAuth()

    // for user in signup payload parent key is password and
    const keyName = type == "user" ? "password" : "email";

    const signUpdata = useRef({
        name: {
            firstName:
                router.query && router.query.firstName ? router.query.firstName : null,
            lastName:
                router.query && router.query.lastName ? router.query.lastName : null,
        },
        [keyName]: {
            email: router.query && router.query.email ? router.query.email : "",
        },
        refCode: router?.query?.referId || getCookie("referId")
    });
    // form data
    const handlerRegistrationData = (key, formData, finish = false) => {
        signUpdata.current = {
            ...signUpdata.current,
            [key]: {
                ...signUpdata.current[key],
                ...formData,
            },
        };

        finish && submitForm();
    };
    // submit for
    const submitForm = async () => {
        const {
            name,
            password,
            profilePic,
            phoneNo,
            social,
            birthDate,
            refCode,
            email,
            userName,
            gender,
            nsfw,
            category,
            ScheduleTime
        } = signUpdata.current;
        startLoader();

        let requestPayload = {};
        // normal user registration
        if (type == PageType.user) {
            requestPayload = { ...UserRegistrationPayload };
            requestPayload.firstName = name.firstName;
            requestPayload.lastName = name.lastName;
            // requestPayload.username = userName.userName;
            requestPayload.email = password.email;
            requestPayload.password = password.password;
            requestPayload.isNSFWAllow = nsfw.isNSFWAllow;
            requestPayload.timezone = ScheduleTime.value;
            setCookie("userType", 1);
        }

        if (type == PageType.model) {
            // console.log(profilePic);
            requestPayload = { ...ModelRegistrationPayload };
            requestPayload.username =
                (userName.userName && userName.userName.replaceAll(/\s/g, "")) || "";
            const cognitoToken = await getCognitoToken();
            const tokenData = cognitoToken?.data?.data;
            const imgFileName = `${Date.now()}_${requestPayload.username?.toLowerCase()}`;
            const folderName = `users/${FOLDER_NAME_IMAGES.profile}`;
            const url = await fileUploaderAWS(
                profilePic.file[0],
                tokenData,
                imgFileName,
                false,
                folderName,
                _, _, _, false
            );

            requestPayload.firstName = name.firstName;
            requestPayload.lastName = name.lastName;
            requestPayload.email = email.email;
            requestPayload.profilePic = url;
            requestPayload.countryCode = phoneNo.countryCode;
            requestPayload.phoneNumber = phoneNo.phoneNo;
            requestPayload.dateOfBirth = birthDate.dateOfBirth;
            requestPayload.gender = gender.gender;
            requestPayload.timezone = ScheduleTime.value
            if (Object.keys(category).length > 0) {
                requestPayload.groupIds = Object.values(category);
            }
            if (refCode.refCode || getCookie("referId")) {
                requestPayload.inviterReferralCode = refCode.refCode || getCookie("referId");
                requestPayload.referralSource = getCookie("referralSource") || "copyPaste";
            }

            // social.link ? (requestPayload.socialMediaLink = social.link) : "";
            requestPayload.password = password.password;
            requestPayload.isNSFWAllow = nsfw.isNSFWAllow;
        }
        try {
            const result = await signUp(requestPayload);
            if (getCookie("userType") == 1) {
                console.log("signup result", result);
                const data = result.data && result.data.data ? result.data.data : {};
                setLocalStorage('streamUserId', data.user.isometrikUserId);
                setAuthData({ ...data.token, ...data.user });
                dispatch(clearAllPostsAction());
                setCookie("auth", true);
                setCookie("guest", false);
                setCookie('zone', requestPayload.timezone);
                setCookie('isometrikToken', data?.user?.isometrikToken || "");
                setCookie('isometrikUserId', data?.user?.isometrikUserId || "");
            } else {
                setCookie("email", requestPayload.email);
            }

            type == PageType.model
                ? ""
                : handleCreateWallet(result.data.data.token.accessToken);
            // Router.replace("registration?type=submitted");
            router.push("/registration?type=submitted");

        } catch (e) {
            if (!e.response) {
                console.error("ERROR IN submitForm", e);
            } else {
                const { message } = e.response.data;
                Toast(message, "error");
            }
        }
        stopLoader();
    };

    // useEffect(() => {
    //   // use effect action
    //   if (mobileView) {
    //     // document.getElementById("registration_cont").style.caretColor = "white";
    //   }
    // }, []);

    const setCustomVhToBody = () => {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vhCustom', `${vh}px`);
    };

    useEffect(() => {
        if (router?.query?.referralSource) setCookie("referralSource", router?.query?.referralSource)
        if (router?.query?.referId) setCookie("referId", router?.query?.referId)
        stopLoader();
        close_drawer("join_juicy")
        setCustomVhToBody();
        window.addEventListener('resize', setCustomVhToBody);

        return () => {
            window.removeEventListener('resize', setCustomVhToBody);
        };
    }, []);

    return (
        <>
            <Head>
                <script defer={true} src="https://sdk.amazonaws.com/js/aws-sdk-2.19.0.min.js" />
            </Head>
            {/* {mobileView
                ? <div className="dynamicHeight overflow-auto " id="registration_cont">
                    <CustomHead {...props.seoSettingData} />
                    <div className="scr" style={theme.signupBg}>
                        <ModalRegistration
                            handlerRegistrationData={handlerRegistrationData}
                            signUpdata={signUpdata}
                            submitForm={submitForm}
                        />
                        {type == PageType.success && <ProfileSubmited />}
                    </div>
                </div>
                :  */}
            <div className="scr" style={theme.signupBg}>
                <CreatorRegistration BecomeCreator={props.BecomeCreator} handleLogin={handleLogin} />
                    {type == PageType.success && <ProfileSubmited />}
                </div>
            {/* } */}
            <style jsx>{`
        .dynamicHeight {
          height: calc(var(--vhCustom, 1vh) * 100) !important;
        }
        :global(.scr){
          overflow-y:hidden;
          min-height:calc(var(--vhCustom, 1vh) * 100) !important;
        }
      `}</style>
        </>
    );
};

export default Registration;
