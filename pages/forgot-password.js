import React from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import Route, { useRouter } from "next/router";
import * as config from "../lib/config";
import useLang from "../hooks/language";

import {
  goBack,
  startLoader,
  stopLoader,
  Toast,
  drawerToast,
  close_drawer,
  open_drawer,
} from "../lib/global";
import { forgotPassword } from "../services/auth";
import { forgotPasswordViaEmailPayload } from "../lib/data-modeling";
import dynamic from "next/dynamic";
const InputText = dynamic(() => import("../components/formControl/inputText"), {
  ssr: false,
});
const Image = dynamic(() => import("../components/image/image"), {
  ssr: false,
});
const Button = dynamic(() => import("../components/button/button"), {
  ssr: false,
});
import CustomHead from "../components/html/head";
import { useTheme } from "react-jss";
import { getCookie } from "../lib/session";

function ForgetPassword(props) {
  const userType = getCookie("userType") == 2 ? "model" : "user";
  const theme = useTheme();
  const [lang] = useLang();

  const callForgotPasswordApi = (values, event) => {
    let payload = { ...forgotPasswordViaEmailPayload };
    payload.emailOrPhone = values.email;

    startLoader();
    forgotPassword(payload)
      .then(async (res) => {
        stopLoader();
        if (res.status === 200) {
          drawerToast({
            drawerClick: () => {
              Route.push("/login");
            },
            title: lang.resetLinkSet,
            desc: res.data.message,
            closeIconVisible: false,
            isMobile: true,
          });

          setTimeout(() => {
            close_drawer();
            Route.push("/login");
          }, 2000);
        }
      })
      .catch(async (err) => {
        stopLoader();
        // if (err.response) {
        //   Toast(err.response.data.message, "error");
        // }
        open_drawer(
          "confirmDrawer",
          {
            title: lang.forgotPass,
            subtitle: lang.forgotPassSubTitle,
            cancelT: lang.tryAgain,
            submitT: lang.btnSignUp,
            yes: () => Route.replace(`/registration?type=${userType}`),
            handleClose: async () => {
              await event.resetForm?.();
              document.getElementById("frgP_email_usr").focus();
            },
          },
          "bottom"
        );
      });
  };

  return (
    <Formik
      initialValues={{ email: "" }}
      onSubmit={(values, e) => {
        callForgotPasswordApi(values, e);
      }}
      //here we will define validation
      validationSchema={Yup.object().shape({
        email: Yup.string().email().required(`${lang.required}`),
      })}
    >
      {(props) => {
        const {
          values,
          touched,
          errors,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
        } = props;

        return (
          <div className="wrap">
            <CustomHead {...props.seoSettingData}></CustomHead>
            <div
              className="scr"
              // style={{ backgroundImage: `url(${config.BG_FORGET_PASSWORD})` }}
              style={theme.forgetPassBg}
            >
              <div className="header-top-secion w-330 mx-auto py-3">
                <div className="col-12">
                  <div className="row justify-content-between">
                    <div className="col-auto">
                      <Image
                        alt="back-arrow"
                        src={theme.type === "light" ? config.backArrow : config.backArrow_lightgrey}
                        width="28"
                        id="scr2"
                        // alt="backArrow"
                        onClick={() => {
                          goBack();
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-330 mx-auto content-secion py-3  overflow-hidden">
                <div className="col-12 text-center">
                  <h4 className="titleH4">{lang.forgotPassword}</h4>
                  <div className="txt-book fntSz16 mb-5">
                    {lang.forgotPswdVerCode}
                  </div>
                  <form className="mb-4" onSubmit={handleSubmit}>
                    <div className="form-group">
                      <InputText
                        id="frgP_email_usr"
                        placeholder={lang.emailPlaceholder}
                        name="email"
                        autoCapitalize="off"
                        inputMode="email"
                        type="email"
                        value={values.email}
                        error={
                          errors.email && touched.email ? errors.email : ""
                        }
                        onChange={handleChange}
                        onBlur={handleBlur}
                        style={{ border: "1px solid var(--l_app_text)" }}
                      />
                    </div>
                    <div className="posBtm">
                      <Button
                        type="submit"
                        cssStyles={theme.blueButton}
                        id="confirm"
                        children={lang.confirm}
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </Formik>
  );
}
export default ForgetPassword;
