import React, { useCallback, useEffect, useState } from "react";
import Route from "next/router";
import dynamic from "next/dynamic";
import { useDispatch } from "react-redux";
import { useTheme } from "react-jss";
import CancelIcon from "@material-ui/icons/Cancel";

import useLang from "../hooks/language";

import isMobile from "../hooks/isMobile";
import { setAuthData } from "../lib/global/setAuthData";
import { signOut } from "../lib/global/clearAll";
import {
  sendMail,
  returnDocument,
  returnHome,
} from "../lib/global/routeAuth";
import {
  close_dialog,
  close_drawer,
  open_dialog,
  sticky_bottom_snackbar,
  drawerToast,
  stopLoader,
  Toast,
  startLoader,
  open_drawer,
} from "../lib/global/loader";

import { login } from "../services/auth";
import { DevicePayload } from "../lib/data-modeling";
import { getCookiees, setCookie, setLocalStorage } from "../lib/session";
import { reConnectionSubject } from "../lib/rxSubject";
import CustomHead from "../components/html/head";
import { clearAllPostsAction } from "../redux/actions/dashboard/dashboardAction";
import isTablet from "../hooks/isTablet";
import { DARK_LOGO, LOGO } from "../lib/config/logo";

import AuthProvider from "../hoc/AuthProvider"
const Button = dynamic(() => import("../components/button/button"), { ssr: false });
const FigureImage = dynamic(() => import("../components/image/figure-image"), { ssr: false });
const LoginForm = dynamic(() => import("../containers/login-form/login-form"), { ssr: false });
const LoginIcon = dynamic(() => import("../containers/login-form/login-icon"), { ssr: false });
import DVLOGIN from "../containers/login-form/desktop-login"

const Login = (props) => {
  const theme = useTheme();
  const [lang] = useLang();
  const dispatch = useDispatch();
  const [mobileView] = isMobile();
  const [tabletView] = isTablet();
  const reff = React.createRef(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [val, setVal] = useState(false);
  const [modelSignupOpen, toggleModelSignup] = useState(false);
  const [userSignupOpen, toggleUserSignup] = useState(false);
  const [signup, setSignupData] = useState({});
  const [userType, setUserType] = useState(1);
  const [passError, setPassError] = useState([])


  const handleOpenJoinAs = () => {
    open_drawer(
      "joinAs",
      {},
      "right"
    )
  }
  // const handle toast drawer
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

  const handleLogin = useCallback((values) => {
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
          Route.push({ pathname: "/login" });
        }

        setLocalStorage('streamUserId', result.user.streamUserId);
        setCookie("auth", true);
        setCookie("guest", false);
        setCookie('zone', loginPayload.timezone);
        setCookie("email", loginPayload.email);
        setAuthData({ ...result.token, ...result.user });
        dispatch(clearAllPostsAction());
        // if (result.user && result.user.sumsubToken.length > 0) {
        //   if (mobileView) {
        //     open_drawer("SumSub", {
        //       config: {
        //         email: loginPayload.email,
        //         phone: loginPayload.email
        //       },
        //       accessToken: result.user.sumsubToken,
        //       onBackdropClick: true
        //     })
        //   } else {
        //     open_dialog("SumSub", {
        //       config: {
        //         email: loginPayload.email,
        //         phone: loginPayload.email
        //       },
        //       accessToken: result.user.sumsubToken,
        //       onBackdropClick: true
        //     })
        //   }
        //   return
        // }
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
                Route.push({
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
        Route.push({
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
          // }

          if (values.googleId || values.facebookId || values.twitterId)
            if (userType === 1) {
              toggleUserSignup(true);
            } else {
              toggleModelSignup(true);
            }

          setSignupData({
            email: values && values.email && values.email.toLowerCase(),
            userName:
              values && values.userName && values.userName.toLowerCase(),
            firstName:
              values &&
              values.firstName &&
              values.firstName.toLowerCase(),
            lastName:
              values && values.lastName && values.lastName.toLowerCase(),
          });
          if (query.length > 4) window.open(`/signup-as-creator${query}`, '_self');
        }

        if (err.response) {
          const { status, data } = err.response;

          handleLoginResponse(status, data);
        }
        return false;
      });
  },
    [reff.current, userType]
  );

  return (
    <div
      id="login_cont"
      style={mobileView
        ? { height: 'calc(var(--vhCustom, 1vh) * 100)' }
        : { height: "100vh" }}
    >
      <AuthProvider />
      <CustomHead {...props.seoSettingData} />
        <>
          {
            !tabletView ?
              <div className="h-100">
                <div className={submitSuccess ? "dv_app_submit" : null}></div>
                {!val && (
                  <DVLOGIN
                    handleLoginResponse={handleLoginResponse}
                    setUserType={setUserType}
                    handleLogin={handleLogin}
                    setSubmitSuccess={setSubmitSuccess}
                    isMobile={isMobile}
                    setVal={setVal}
                    toggleModelSignup={toggleModelSignup}
                    toggleUserSignup={toggleUserSignup}
                    modelSignupOpen={modelSignupOpen}
                    userSignupOpen={userSignupOpen}
                    signup={signup}
                    passError={passError}
                  />
                )}
              </div>
              :
              <div
                className="scr py-4"
              >
                <div className={`row mx-0 w-330 mb-5 pb-4 mx-auto text-center ${isMobile ? 'h-100' : ''}`}>
                  <div className={`col-12 ${isMobile ? 'align-self-center' : 'align-self-start'}`}>
                    <div className="d-flex align-items-center justify-content-center mb-3 position-relative w-100">
                      <div
                        className="text-muted cursorPtr position-absolute"
                        style={{ right: 0, top: 0 }}
                        onClick={() => Route.push("/")}
                      >
                        <CancelIcon fontSize="large" />
                      </div>

                      <FigureImage
                        src={theme.type === "light" ? LOGO : DARK_LOGO}
                        width="129"
                        fclassname="m-0"
                        id="logoUser"
                        alt="logoUser"
                      />
                    </div>

                    <div className="text-app fntSz16 mb-4">{lang.loginHeading}</div>

                    <LoginForm
                      handleLoginResponse={handleLoginResponse}
                      userType={userType}
                      handleLogin={handleLogin}
                    />

                    <div className="fntSz14 mb-4 bgLine">
                      <span className="bgLineSpan">{lang.otherSignText}</span>
                    </div>

                    <LoginIcon handleLogin={handleLogin} />
                    <div className={`col-12 ${isMobile ? 'align-self-start' : 'align-self-end'}`}>
                      <Button
                        type="button"
                        cssStyles={theme.blueBorderButton}
                        id="forCreator"
                        children={lang.signUpMsg}
                        onClick={handleOpenJoinAs}
                        style={{ fontWeight: "bold" }}
                      />
                    </div>
                  </div>


                </div>
              </div>
          }
      </>
    </div>
  );
};

Login.getInitialProps = async ({ Component, ctx }) => {
  const { req, res } = ctx;
  const auth = getCookiees("auth", req);
  const uid = getCookiees("uid", req);
  returnHome(req, res);
  if (uid) return returnDocument(req, res);
  return {};
};
export default Login;