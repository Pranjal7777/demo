import { useEffect, useState } from "react";
import withRedux from "next-redux-wrapper";
import dynamic from "next/dynamic";
import Head from "next/head";
import { Provider } from "react-redux";
import { ThemeProvider } from "react-jss";
import { GoogleOAuthProvider } from '@react-oauth/google';

//lib
import customTheme from "../lib/theme";
import { guestLogin } from "../lib/global/guestLogin";
import { registerWorker } from "../lib/registerWorker";
import { ParseToken } from "../lib/parsers/token-parser";
import { detectDevice, detectTablet } from "../lib/helper/detectDevice";
import { getCookie, getCookiees, isBrowser, removeLocalStorage, setCookie, setLocalStorage } from "../lib/session";
import { setToken, unsubscibeFCMTopic } from "../lib/notification/handleNotification";
import { useRouter } from 'next/router'
//redux
import createStore from "../redux/store";
import { setSeoSettings } from "../redux/actions/seo";
import { SET_APP_CONFIG } from "../redux/actions/actionTypes";
import { commonUtility } from "../redux/actions/commonUtility";
import { changeCurrentTheme } from "../redux/actions/change-theme";
import { setProfile, setLanguage, getWallet, getAddress } from "../redux/actions/index";
import { setGuestToken, setMobileView, setPg, getNotificationCount, setTabletView } from "../redux/actions/auth";
//services
import { getConfigURL } from "../services/getConfigURL";
import { getFollowCount } from "../services/profile";
import { getProfile, getSeoSettings } from "../services/auth";
import { getCountryList } from "../services/payments";
import { notificationUnreadCount } from "../services/notification";


const MQTTc = dynamic(() => import("../hoc/mqtt"));
const IsometrikMQTTHoc = dynamic(() => import("../hoc/isometrikMQTTHoc"));

// All Important HOCs using Rxjs
import LoaderHoc from "../hoc/loader";
import ProgressBarLoader from "../hoc/ProgressBar";
import SnackBar from "../components/snackbar/snackbar";
import { sticky_bottom_snackbar } from "../lib/rxSubject";
import DialogHoc from "../hoc/dialogHoc";
import DrawerHoc from "../hoc/drawerHoc";
import FixedBottonSnackbar from "../components/snackbar/fixed-botton-snackbar";

// CSS Imports
import "bootstrap/dist/css/bootstrap.min.css";
import "../public/scss/style.scss";
import "../public/css/theme_variables.css";
import "../public/css/styles.css";
import "../public/css/slick.css";
import "../public/css/slick-them.css";
import "../public/css/modals.css";
import "../public/css/colors.css";
import "../public/css/home_mobile.css";
import "../public/css/highlight_stories.css";
import 'react-nice-dates/build/style.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { APP_NAME, defaultLang, FCM_CHAT_TOPIC, FCM_TOPIC, GOOGLE_ID, isAgency } from "../lib/config/creds";
import { getAgencyData, setSelectCreator } from "../redux/actions/agency";
import { END } from "redux-saga";
import { startLoader, stopLoader } from "../lib/global/loader";
import { setupNotifications } from "../lib/global";
import { fetchIpConfig } from "../lib/request";
import NextNProgress from 'nextjs-progressbar'

const ChatProvider = isBrowser() ? dynamic(() => import("../components/chat/ChatProvider").then(mode => mode.ChatProvider), {
  ssr: false,
}) : (props) => <div>{props.children}</div>

function MyApp(props) {
  const { Component, pageProps, store, apiCalled, seoSetting, isMobile, token, auth } = props;
  const userType = getCookiees("userType");
  const profile = store.getState().profileData;
  const [appTheme, setAppTheme] = useState(customTheme[store.getState().theme]);
  const router = useRouter()

  if (!auth && token) setCookie('token', ParseToken(token));

  const getConfig = async (token) => {
    try {
      const response = await getConfigURL(token);
      store.dispatch({ type: SET_APP_CONFIG, config: response?.data?.data });
    } catch (e) {
      console.log(e)
    }
  }

  const fetchSeoSettings = async () => {
    let seoSettingData = getCookiees('seoSetting');
    if (seoSettingData) seoSettingData = JSON.parse(decodeURIComponent(seoSettingData));
    if (seoSettingData?._id) return
    console.log('Calling SEO Setting API to Refresh Data::');
    try {
      const seoData = await getSeoSettings(token);
      if (seoData?.data?.data) {
        setCookie('seoSetting', JSON.stringify(seoData.data.data));
        store.dispatch(setSeoSettings(seoData.data.data));
      }
    } catch (e) {
      console.log(e)
    }
  };

  const fecthProfileDetails = async () => {
    console.log('Calling Profile API to Refresh Data::');
    const uid = isAgency() ? store.getState().selectedCreator.creatorId : getCookie("uid");
    const res = await getProfile(uid, ParseToken(token), getCookie('selectedCreatorId'));
    if (res?.data?.data.agencyId) setCookie("agencyId", res?.data?.data.agencyId);
    setCookie("profileData", JSON.stringify({
      ...res?.data?.data,
      ...followCount?.data?.data,
    }))
    setCookie("categoryData", JSON.stringify([...res?.data?.data?.categoryData]))
    const followCount = await getFollowCount(uid, ParseToken(token), isAgency() ? store.getState().selectedCreator.creatorId : "");
    store.dispatch(
      setProfile({
        ...res?.data?.data,
        ...followCount?.data?.data,
      })
    );
  };

  // const getStripKey = async () => {
  //   try {
  //     // API Call
  //     const res = await getStripeKey();
  //     const stripe_key = res?.data?.data?.publicKey;
  //     setLocalStorage("STRIPE_KEY", stripe_key);
  //   } catch (err) {
  //     console.error("ERROR IN _app.js", err);
  //   }
  // };

  const getNotificationCnt = async () => {
    try {
      // API Call
      let notification = await notificationUnreadCount();

      store.dispatch(getNotificationCount(notification?.data?.unreadCount));
    } catch (err) {
      console.error('ERROR IN getNotificationCnt', err)
    }
  }


  const setCustomVhToBody = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vhCustom', `${vh}px`);
  };

  useEffect(() => {
    setCustomVhToBody();
    window.addEventListener('resize', setCustomVhToBody);

    return () => {
      window.removeEventListener('resize', setCustomVhToBody);
    };
  }, []);

  // useEffect(() => {
  //   (function (d, u, ac, a) {
  //     var s = d.createElement("script");
  //     s.type = "text/javascript";
  //     s.src = "https://c1a138.juicy.network/app/js/api.min.js";
  //     s.async = true;
  //     s.dataset.user = u;
  //     s.dataset.account = ac;
  //     s.dataset.api = a;
  //     d.getElementsByTagName("head")[0].appendChild(s);
  //   })(document, 227445, 244005, "campaigns");
  // },[]);

  useEffect(() => {
    if (seoSetting) {
      setCookie('seoSetting', JSON.stringify(props.seoSetting));
      if (!apiCalled.seoSettingAPI) fetchSeoSettings();
    }

    if (token) {
      getConfig(props.token);
    }

    // Theme Set
    const themeType = store.getState().theme;
    // const themeType = localStorage.getItem("userTheme") || "light";
    if (themeType === "dark") {
      document.body.classList.toggle("dark_theme", true);
      // store.dispatch(changeCurrentTheme("dark"));
      // setAppTheme(customTheme.dark);
    }
    store.dispatch(setSelectCreator(getCookie("selectedCreator") ? JSON.parse(getCookie("selectedCreator")) : ""))
    store.dispatch(getAgencyData(getCookie("agencyProfileData") ? JSON.parse(getCookie("agencyProfileData")) : ""))
  }, []);

  useEffect(() => {
    registerWorker();
    if (getCookie("ipConfigFetched") !== "true") fetchIpConfig();
    if (window?.deviceId) {
      setCookie("deviceId", window?.deviceId)
    }
  }, []);

  useEffect(() => {
    if (!auth) return;

    if (profile?._id) {
      const { categoryData = [], userPreference = [], ...profileData } = profile
      setCookie('profileData', JSON.stringify(profileData));
      setCookie('categoryData', JSON.stringify(categoryData));
      setCookie('userPreference', JSON.stringify(userPreference));
      if (!apiCalled.profileDataAPI) fecthProfileDetails();
    }
    getCountryList()
      .then((data) => {
        store.dispatch(setPg(data.data.data.data));
      })
      .catch((e) => {
        console.error(e);
      });


    let topic = localStorage.getItem(FCM_TOPIC);
    if (topic && topic != props.store.getState().profileData.fcmTopic) {
      unsubscibeFCMTopic();
      removeLocalStorage(FCM_CHAT_TOPIC);
    }

    // console.log("asdadasdasdad notifications");
    // getStripKey();
    store.dispatch(getWallet()); // get walletDetails
    //not using address functionality
    // store.dispatch(getAddress());
    getNotificationCnt();
    setupNotifications({ topic: props.store.getState().profileData.fcmTopic, chat_topic: "chat-android-" + props.store.getState().profileData.isometrikUserId })
  }, [auth]);

  useEffect(() => {
    store.dispatch(commonUtility({ changeThemeUtility: changeTheme }))
  }, [])

  useEffect(() => {
    if (!auth) return;
    if (profile.statusCode === 5) {
      setCookie("nonVarifiedProfile", true);
      setTimeout(() => {
        sticky_bottom_snackbar({
          message: "Your profile is inactive. We are verifying your identity.",
          type: "warning",
        });
      }, 100);
    }
    if (profile.statusCode === 6) {
      setCookie("nonVarifiedProfile", true);
      setTimeout(() => {
        sticky_bottom_snackbar({
          message: "Your Documents have been rejected, please go to the Edit Profile Section and re-upload your documents.",
          type: "warning",
        });
      }, 100);
    }
  }, [auth, profile]);

  const changeTheme = (e) => {
    if (store.getState().theme === "light") {
      document.body.classList.toggle("dark_theme");
      setAppTheme(customTheme["dark"]);
      store.dispatch(changeCurrentTheme("dark"));
      setCookie("userTheme", "dark");
      e?.stopPropagation();
    } else {
      document.body.classList.toggle("dark_theme");
      setAppTheme(customTheme["light"]);
      store.dispatch(changeCurrentTheme("light"));
      setCookie("userTheme", "light");
      e?.stopPropagation();
    }
  };

  useEffect(async () => {
    if ('serviceWorker' in navigator) {
      console.log(await navigator.serviceWorker.getRegistration())
      navigator.serviceWorker.getRegistrations().then(registrations => {
        if (![...registrations].find(s => s.active?.scriptURL?.includes("uppysw.js"))) {
          navigator.serviceWorker
            .register('/uppysw.js', { scope: '/' }) // path to your bundled service worker with GoldenRetriever service worker
            .then((registration) => {
              console.log(
                'ServiceWorker registration successful with scope: ',
                registration.scope,
              );
            })
            .catch((error) => {
              console.log(`Registration failed with ${error}`);
            });
        }
      });

    }
  }, [])

  useEffect(() => {
    router.events?.on('routeChangeStart', () => {
      window['myPrevRoute'] = window?.location?.href;
    });
  }, [])

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, interactive-widget=resizes-content" />
        <title>{APP_NAME}</title>
        <script src="https://api.myuser.com/js/checkout.js" />
      </Head>
      <Provider store={store}>
        {auth && <MQTTc store={store} render={() => { }} />}
        {auth && <IsometrikMQTTHoc store={store} render={() => { }} />}
        <ThemeProvider theme={appTheme}>
          <GoogleOAuthProvider clientId={GOOGLE_ID}>
            <ChatProvider appConfig={store.getState().appConfig} auth={auth}>
              <NextNProgress color="#D33AFF" />
              <Component {...pageProps} seoSettingData={seoSetting} isMobile={isMobile} changeTheme={changeTheme} userToken={decodeURIComponent(token)} isLoggedIn={auth == 'true'} userProfile={profile} />
            </ChatProvider>
            <LoaderHoc color={appTheme.appColor} />
            <div className="dv__btm_nav_creator">
              <FixedBottonSnackbar />
            </div>
            <div id="animationId"></div>
            <DialogHoc />
            <DrawerHoc />
            <SnackBar />
            <ProgressBarLoader />
          </GoogleOAuthProvider>
        </ThemeProvider>
      </Provider>
    </>
  )
}

MyApp.getInitialProps = async ({ Component, ctx }) => {
  let pageProps = {};
  let seoSetting = {};
  const apiCalled = {
    seoSettingAPI: false,
    profileDataAPI: false
  };
  let isMobile = null;
  const auth = getCookiees("auth", ctx.req);
  const lan = getCookiees("language", ctx.req) || defaultLang;
  const theme = getCookiees("userTheme", ctx.req) || "light";
  const userType = getCookiees("userType", ctx.req);
  const selectedCreatorId = getCookiees("selectedCreatorId", ctx.req)
  ctx.store.dispatch(changeCurrentTheme(theme));
  let token = await getCookiees("token", ctx.req) || ctx?.store?.getState()?.guestToken
  isMobile = detectDevice(ctx);
  ctx.store.dispatch(setMobileView(isMobile));

  let isTablet = detectTablet(ctx);
  if (!isMobile && !isTablet) { ctx.store.dispatch(setTabletView(isTablet)); }

  if (!token?.toString?.().length) {
    console.log("guest login call");
    const guestData = await guestLogin(ctx.req);
    token = guestData.token;
  }

  ctx.store.dispatch(setGuestToken(token));

  ctx.store.dispatch(setLanguage(lan));


  if (Component && Component.getInitialProps) {
    pageProps = await Component.getInitialProps({ ctx, userToken: token });
  }

  if (token) {
    let seoSettingData = getCookiees('seoSetting', ctx.req);
    if (seoSettingData) seoSettingData = JSON.parse(decodeURIComponent(seoSettingData));
    let sepSettingApiCall = () => {
      return new Promise(async (res, rej) => {
        if (!seoSettingData?._id) {
          try {
            let seoData = await getSeoSettings(token);
            apiCalled.seoSettingAPI = true;
            // console.log('_app - seoData', seoData)
            res(seoData.data.data);
            ctx.store.dispatch(setSeoSettings(seoData.data.data));
          } catch (e) {
            res({});
          }
        } else {
          apiCalled.seoSettingAPI = false;
          res(seoSettingData);
        }
        res({});
      });
    };

    try {
      seoSetting = await sepSettingApiCall();
    } catch (e) {
      // console.log("dsdasd", e);
    }
    const getConfig = async (token) => {
      const response = await getConfigURL(token);
      ctx.store.dispatch({ type: SET_APP_CONFIG, config: response?.data?.data });
    }
    // await getConfig(token)
  }

  if (auth) {
    let profileDataCookie = getCookiees('profileData', ctx.req);
    let userPreference;
    let categoryData;
    try {
      categoryData = JSON.parse(decodeURIComponent(getCookiees('categoryData', ctx.req)))
    } catch (error) {
    }
    if (profileDataCookie) {
      profileDataCookie = JSON.parse(decodeURIComponent(profileDataCookie));
      userPreference = JSON.parse(decodeURIComponent(getCookiees('userPreference', ctx.req)))
    }
    if (!profileDataCookie?._id) {
      try {
        const uid = userType === "3" ? selectedCreatorId : getCookiees("uid", ctx.req);
        const token = decodeURIComponent(getCookiees("token", ctx.req));
        const res = await getProfile(uid, token, selectedCreatorId);
        if (res?.data?.data.agencyId) setCookie("agencyId", res?.data?.data.agencyId);
        let followCount = await getFollowCount(uid, token, userType === "3" ? true : false);
        apiCalled.profileDataAPI = true;
        ctx.store.dispatch(
          setProfile({
            ...res?.data?.data,
            ...followCount.data.data,
          })
        );
      } catch (e) {
        // console.log(e, e.response);
      }
    } else {
      apiCalled.profileDataAPI = false;
      ctx.store.dispatch(setProfile({ ...profileDataCookie, categoryData, userPreference }))
    };
  }

  // end saga
  if (ctx.req) {
    ctx.store.dispatch(END);
    await ctx.store.sagaTask.toPromise();
  }
  const returnObject = { seoSetting, isMobile, token, apiCalled, auth }
  if (pageProps && Object.keys(pageProps).length) returnObject.pageProps = pageProps
  return returnObject;
};

export default withRedux(createStore)(MyApp);
