import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import Route from "next/router";

import LabelInputPassword from "../components/formControl/labelInputPassword";
import Button from "../components/button/button";

import useLang from "../hooks/language";

import { checkMailExpire, resetPassword } from "../services/auth";
import { authenticate, startLoader, stopLoader, Toast } from "../lib/global";
import {
  checkMailExpirePayload,
  resetPasswordPayload,
} from "../lib/data-modeling";
import CustomHead from "../components/html/head";
import Image from "../components/image/image";
import Img from "../components/ui/Img/Img";
import { CLOSE_ICON_BLACK, CLOSE_ICON_WHITE, LOGO } from "../lib/config";

function ResetPassword(props) {
  const { query } = props;
  const [loading, setLoading] = useState(true);
  const [showError, setShowError] = useState(false);

  const [lang] = useLang();

  // useEffect(() => {
  // setLoading(false);
  // startLoader();
  // console.log("query", query.token)
  // checkMailExpire(query.token)
  //   .then(async (res) => {
  //     if (res.status === 200) {
  //       stopLoader();
  //       setLoading(false);
  //       // console.log(res);
  //       setShowError(false);
  //     }
  //   })
  //   .catch(async (err) => {
  //     if (err.response) {
  //       stopLoader();
  //       setLoading(false);
  //       console.error(err?.response?.data?.message);
  //       setShowError(true);
  //     }
  //     console.error(err);
  //   });
  // }, []);

  const validatePassword = (values) => {
    if (values.password === values.confirmPassword) {
      callResetPasswordApi(values.password);
    } else {
      Toast(lang.bothPwdNotMatch, "error");
    }
  };

  const callResetPasswordApi = (newPwd) => {
    const requestPayload = { ...resetPasswordPayload };

    requestPayload.userId = query.userId;
    requestPayload.newPassword = newPwd;
    requestPayload.token = query.token;

    startLoader();
    resetPassword(requestPayload)
      .then(async (res) => {
        stopLoader();
        if (res.status === 200) {
          // console.log(res);
          Toast(lang.pswdResetSuccessMsg);
          Route.push("/");
        }
      })
      .catch(async (err) => {
        stopLoader();
        if (err.response) {
          Toast(err.response.data.message, "error");
        }
        console.error(err);
      });
  };

  return (
    <>
      <Formik
        initialValues={{ password: "", confirmPassword: "" }}
        onSubmit={(values, { setSubmitting }) => {
          validatePassword(values);
        }}
        //here we will deefine validation
        validationSchema={Yup.object().shape({
          password: Yup.string()
            .required(`${lang.pwdErrorMsg1}`)
            .min(4, `${lang.pwdErrorMsg2}`)
            .matches(/(?=.*[0-9])/, `${lang.pwdErrorMsg3}`),

          confirmPassword: Yup.string()
            .required(`${lang.pwdErrorMsg1}`)
            .min(4, `${lang.pwdErrorMsg2}`)
            .matches(/(?=.*[0-9])/, `${lang.pwdErrorMsg3}`),
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
              <CustomHead
                pageTitle="Reset Password"
                {...props.seoSettingData}
              ></CustomHead>
              <div className="row m-0 align-items-center justify-content-between container-fluid">
                <div className="col-auto order-1 order-md-1 mb-3 mb-md-0 p-0">
                  <Image
                    src={LOGO}
                    className="logo_img pointer"
                    onClick={() =>
                      authenticate().then(() => {
                        Route.replace("/");
                      })
                    }
                    alt="app logo image"
                  ></Image>
                </div>
                <div className="col-auto order-2">
                  <Img
                    src={CLOSE_ICON_BLACK}
                    className="closeIcon pointer"
                    onClick={() => Route.replace("/")}
                    alt="Close icon"
                  ></Img>
                </div>
              </div>
              <div className="row mx-0 justify-content-center align-items-center vh-100">
                {loading ? null : showError ? (
                  <h4 className="titleH4 mb-5 text-center">
                    {lang.linkExpire}
                  </h4>
                ) : (
                  <div className="col-auto frgtPwdForm">
                    <h4 className="titleH4 mb-5 text-center">
                      {lang.plzPwdMsg}{" "}
                      <span className="baseClr"> {lang.pwdHere} </span>
                    </h4>
                    <form className="frgtForm" onSubmit={handleSubmit}>
                      <div className="form-group">
                        <LabelInputPassword
                          id="pswrd"
                          name="password"
                          label={lang.confirmPasswordLbl1}
                          values={values.password}
                          errors={errors.password}
                          touched={touched.password}
                          placeholder={lang.passwordPlaceholder}
                          handleChange={handleChange}
                          handleBlur={handleBlur}
                        />
                      </div>
                      <div className="form-group mb-5">
                        <LabelInputPassword
                          id="cPswrd"
                          name="confirmPassword"
                          label={lang.confirmPasswordLbl2}
                          values={values.confirmPassword}
                          errors={errors.confirmPassword}
                          touched={touched.confirmPassword}
                          placeholder={lang.confirmPasswordPlaceholder}
                          handleChange={handleChange}
                          handleBlur={handleBlur}
                        />
                      </div>
                      <Button
                        type="submit"
                        className="btn btn-primary blueBgBtn"
                        id="changePassword"
                        children={lang.changePassword}
                        cssStyles={{
                          text: "#fff",
                        }}
                      />
                    </form>
                  </div>
                )}
              </div>
            </div>
          );
        }}
      </Formik>
      <style jsx="true">{`
        .container-fluid {
          position: absolute;
          top: 10px;
        }
        .logo_img {
          // width: 8.053vw;
          // height: 3.221vw;
          cursor: pointer;
        }
      `}</style>
    </>
  );
}

ResetPassword.getInitialProps = async ({ ctx }) => {
  let { query = {}, req, res } = ctx;
  return { query: query };
};

export default ResetPassword;
