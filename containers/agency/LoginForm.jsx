import React, { useState } from 'react';
import TextField from "@material-ui/core/TextField";
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import Button from '../../components/button/button';
import { login, validateEmail } from '../../services/auth';
import { getCookie, setCookie, setLocalStorage } from '../../lib/session';
import { setAuthData } from '../../lib/global/setAuthData';
import { DevicePayload, VerifyEmail } from '../../lib/data-modeling';
import DVinputText from '../../components/DVformControl/DVinputText';
import DVinputPassword from '../../components/DVformControl/DVinputPassword';
import useLang from '../../hooks/language';
import { Toast, drawerToast, open_dialog, startLoader, stopLoader } from '../../lib/global/loader';
import { sendMail } from '../../lib/global/routeAuth';
import { getAgencyDetails } from '../../services/agency';
import { getAgencyData } from '../../redux/actions/agency';
import { useDispatch, useSelector } from 'react-redux';
import useAgencyRegistration from './hook/useAgencyRegistration';
import { useCallback } from 'react';
import { clearAllPostsAction } from '../../redux/actions/dashboard/dashboardAction';
import { reConnectionSubject } from '../../lib/rxSubject';
import { useEffect } from 'react';
import { changeCurrentTheme } from '../../redux/actions/change-theme';
import customTheme from '../../lib/theme';
import { isAgency } from '../../lib/config/creds';

const LoginForm = () => {
  const [lang] = useLang();
  const router = useRouter();
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const { fecthProfileDetails, handleGetAgency } = useAgencyRegistration();
  const themeType = useSelector((state) => state?.theme);
  const userType = getCookie("userType");
  const userRole = getCookie("userRole");
  const formik = useFormik({
    initialValues: {
      email: router?.query?.email || "",
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

      return errors;
    },
    onSubmit: values => {
      SigninHandler(values);
    }
  });
  useEffect(() => {
    if (userType === "3" && userRole === "ADMIN") {
      router.push('/homePageAgency');
      handleGetAgency();
    } else if (userType === "3") {
      router.push('/my_profile');
      fecthProfileDetails();
    }
  }, [userType, userRole])

  const SigninHandler = async (values) => {
    VerifyEmail.email = values.email;
    VerifyEmail.type = 1;

    try {
      const res = await validateEmail(VerifyEmail);

      if (res.status === 200) {
        signupApi(values);
      }
    } catch (err) {

      if (err.response.status == 410) {
        open_dialog("MsgDialog", {
          title: lang.submittedAgency,
          desc: err.response.data.message,
          button: {
            text: lang.contactUs,
            onClick: () => {
              sendMail();
            },
          },
        });
      } else {
        setError(err?.response?.data.message);
      }
      console.error(err);
    }
  };
  const signupApi = useCallback((values) => {
    let loginPayload = {
      email: values && values.email && values.email.toLowerCase(),
      password: values && values.password,
      loginType: values.loginType ? values.loginType : 1, //email login
      isAgencyLogin: true,
      ...DevicePayload,
    };
    startLoader()
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
        stopLoader();
        if (result?.user?.userRole === "ADMIN") {
          router.push('/homePageAgency');
          handleGetAgency();
        } else {
          router.push('/my_profile');
          fecthProfileDetails();
        }
        return true;
      })
      .catch(async (err) => {
        stopLoader();
        if (err?.response?.status == 410) {
          open_dialog("MsgDialog", {
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
        setError(err?.response?.data.message);
        router.push('/agencyLogin');
      });
  },
    []
  );
  const signupApi2 = async (values) => {
    const loginPayload = {
      email: values.email?.toLowerCase(),
      password: values.password,
      loginType: 1, //email login
      ...DevicePayload,
    };

    try {
      const res = await login(loginPayload);
      const result = res.data.data;

      setCookie("userType", result?.user?.userTypeCode);
      setCookie("userRole", result?.user?.userRole);
      setAuthData({ ...result.token, ...result.user });

      if (result?.user?.userRole === "ADMIN") {
        router.push('/homePageAgency');
        handleGetAgency();
      } else {
        router.push('/my_profile');
        fecthProfileDetails();

      }

    } catch (err) {
      console.error(err);
      if (err?.response?.status == 410) {
        open_dialog("MsgDialog", {
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
      setError(err?.response?.data.message);
      router.push('/agencyLogin');
    }
  };

  return (
    <div className='col-6'>
      <form onSubmit={formik.handleSubmit}>
        <div className='my-3'>
          <DVinputText
            labelTitle="E-mail"
            className="form-control dv_form_control stopBack"
            id="email"
            name="email"
            autoComplete='off'
            placeholder={lang.enterE_mail}
            style={{ borderBottom: "1px soild " }}
            type="email"
            error={(formik.errors.email && formik.touched.email) ? formik.errors.email : null}
            {...formik.getFieldProps('email')}
          />
        </div>
        <div className='mt-3'>
          <DVinputPassword
            labelTitle="Password"
            className="dv_registration_field dv_form_control stopBack password"
            name="password"
            isAgency={true}
            placeholder={lang.enterPassword}
            inicatorClass={"alertClass"}
            errorIocnClass={"iconClass"}
            error={(formik.errors.password && formik.touched.password) ? formik.errors.password : null}
            {...formik.getFieldProps('password')}
          />
          <p className='text-app mb-0 text-right'
            onClick={() => open_dialog("FrgtPass", { closeAll: true })}
          >{lang.forgotPassword}?</p>
        </div>
        {error && <p className='text-danger fntSz12'>{error}</p>}
        <Button
          fclassname="w-500 py-2 mt-3 text-white btnGradient_bg radius_22"
          children={lang.login}
          type="submit"
        >

        </Button>
      </form>
      <div className='text-center pt-2'>
        <a href='/signup-as-a-agency' className='text-app text-center py-2 bold'>Sign-up as an Agency</a>
      </div>
      <style jsx>{`
        :global(.iconClass){
          right:13% !important;
        }
        :global(.stopBack.dv_form_control){
          border: 1px solid silver !important;
          background-color:var(--l_app_bg)!important;
        }
        :global(.alertClass){
          right:19% !important;
        }
      `}</style>
    </div>
  );
};

export default LoginForm;
