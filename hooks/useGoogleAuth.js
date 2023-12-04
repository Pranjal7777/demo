import { useCallback } from "react"
import { login } from "../services/auth";
import { DevicePayload } from "../lib/data-modeling";
import { setCookie, setLocalStorage } from "../lib/session";
import { Toast, close_drawer, drawerToast, open_dialog, open_drawer, sticky_bottom_snackbar, stopLoader } from "../lib/global/loader";
import { setAuthData } from "../lib/global/setAuthData";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { clearAllPostsAction } from "../redux/actions/dashboard/dashboardAction";
import isMobile from "./isMobile";
import { signOut } from "../lib/global/clearAll";
import { reConnectionSubject } from "../lib/rxSubject";

const userGoogleAuth = () => {
    const router = useRouter()
    const dispatch = useDispatch()
    const [mobileView] = isMobile()
    const handleLoginResponse = (status, data = {}) => {
        try {
            const desc = data.message;

            if (status == 410) {
                if (!mobileView) {
                    return open_dialog("MsgDialog", {
                        title: lang.submitted,
                        desc: desc,
                        button: {
                            text: lang.contactUs,
                            onClick: () => {
                                sendMail();
                            },
                        },
                    });
                } else {
                    return drawerToast({
                        title: lang.submitted,
                        desc: desc,
                        isMobile: true,
                        button: {
                            text: lang.contactUs,
                            onClick: () => {
                                sendMail();
                            },
                        },
                    });
                }
            }
            if (status == 411) {
                if (!mobileView) {
                    return open_dialog("MsgDialog", {
                        title: lang.profileRejected,
                        desc: desc,
                        button: {
                            text: lang.contactUs,
                            onClick: () => {
                                sendMail();
                            },
                        },
                    });
                } else {
                    return drawerToast({
                        title: lang.profileRejected,
                        desc: desc,
                        button: {
                            text: lang.contactUs,
                            onClick: () => {
                                sendMail();
                            },
                        },
                    });
                }
            }
            if (status == 415) {
                setAuthData({ ...data.data.token, ...data.data.user });
                dispatch(clearAllPostsAction());
                if (!mobileView) {
                    return open_dialog("AccAccepted", {
                        title: lang.congratulation,
                        desc: desc,
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
                        desc: desc,
                        button: {
                            text: lang.continue,
                            onClick: (e) => {
                                Route.push({
                                    pathname: "/document",
                                });
                            },
                        },
                        isMobile: true,
                    });
                }
            } else {
                { mobileView ? Toast(desc, "error") : "" }
                setPassError(desc)
            }
        } catch (e) { }
    };

    const handleLogin = useCallback((values, isUser) => {

        let loginPayload = {
            email: values && values.email && values.email.toLowerCase(),
            password: values && values.password,
            loginType: values.loginType ? values.loginType : 1, //email login
            ...DevicePayload,
            googleId: values.googleId ? values.googleId : null,
            twitterId: values.twitterId ? values.twitterId : null,
            facebookId: values.facebookId ? values.facebookId : null,
        };
        login(loginPayload)
            .then(async (res) => {
                const result = res.data.data;
                setCookie("userType", result?.user?.userTypeCode);

                if (!result) {
                    Toast("We are facing some issues in logging in this user!", "warning");
                    router.push({ pathname: "/login" });
                }

                setLocalStorage('streamUserId', result.user.isometrikUserId);
                setCookie("auth", true);
                setCookie("guest", false);
                setCookie('zone', loginPayload.timezone);
                setCookie("email", loginPayload.email);
                setAuthData({ ...result.token, ...result.user });
                dispatch(clearAllPostsAction());
                if (result.user && result.user.sumsubToken?.length > 0) {
                    if (mobileView) {
                        open_drawer("SumSub", {
                            config: {
                                email: loginPayload.email,
                                phone: loginPayload.email
                            },
                            accessToken: result.user.sumsubToken,
                            onBackdropClick: true
                        })
                    } else {
                        open_dialog("SumSub", {
                            config: {
                                email: loginPayload.email,
                                phone: loginPayload.email
                            },
                            accessToken: result.user.sumsubToken,
                            onBackdropClick: true
                        })
                    }
                    return
                }
                if (result.user && result.user.statusCode == 6) {
                    stopLoader();
                    return drawerToast({
                        drawerClick: () => {
                            signOut(false);
                            close_drawer();
                        },
                        title: lang.rejectTital,
                        desc: lang.profileRejected1,
                        button: {
                            text: lang.continue,
                            onClick: (e) => {
                                router.push({
                                    pathname: "/document",
                                });
                            },
                        },
                    });
                    return;
                }

                setCookie("auth", true);
                setCookie("guest", false);
                if (result.user.statusCode == 5 || result.user.statusCode == 6) {
                    setCookie("nonVarifiedProfile", true);
                    sticky_bottom_snackbar({
                        message:
                            "Your profile is inactive. We are verifying your identity.",
                        type: "warning",
                    });
                }
                stopLoader();
                reConnectionSubject.next();
                router.push({
                    pathname: "/",
                });
                return true;
            })
            .catch(async (err) => {
                console.error("err", err);
                stopLoader();

                if (err && err.response && err.response.status === 413) {
                    // redirecting to the signup page if user is not registered
                    Toast(
                        (err.response &&
                            err.response.data &&
                            err.response.data.message) ||
                        "No message from api",
                        "error"
                    );
                    let query = '?s=1';
                    if (values.email) query = query + `&email=${values.email}`;
                    if (values.userName)
                        query = query + `&userName=${values.userName}`;
                    if (values.firstName)
                        query = query + `&firstName=${values.firstName}`;
                    if (values.lastName)
                        query = query + `&lastName=${values.lastName}`;
                    setTimeout(() => {
                    if (query.length > 4) {
                        if (isUser) window.open(`/signup-as-user${query}`, "_self");
                        else window.open(`/signup-as-creator${query}`, "_self");
                    }
                    }, 1000)
                }
                else {
                    if (err.response) {
                        const { status, data } = err.response;

                        handleLoginResponse(status, data);
                    }
                }
                return false;
            });
    },
        []
    );

    return [handleLogin]

}

export default userGoogleAuth