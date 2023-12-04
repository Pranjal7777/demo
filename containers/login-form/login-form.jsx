import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import Route from "next/router";
import InputText from "../../components/formControl/inputText";
import PasswordInput from "../../components/formControl/inputPassword";
import Button from "../../components/button/button";
import useLang from "../../hooks/language";
import { validateEmail } from "../../services/auth";
import { startLoader, stopLoader } from "../../lib/global/loader";
import { movetoNext } from "../../lib/global/movetoNext";
import { useDispatch, useSelector } from "react-redux";
import { getCookie } from "../../lib/session";
import { SUBMIT_PROFILE } from "../../redux/actions/actionTypes";
import { VerifyEmail } from "../../lib/data-modeling";
import { useTheme } from "react-jss";
const CancelOutlined = dynamic(() => import("@material-ui/icons/CancelOutlined"));

function LoginForm(props) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [lang] = useLang();
  const userType = getCookie("userType");
  const { handleLoginResponse } = props;
  const isSubmittedProfile = useSelector((state) => state.submitProfile);
  useEffect(() => {
    if (isSubmittedProfile) {
      validateDetails({
        email: getCookie("email"),
      });
      dispatch({
        type: SUBMIT_PROFILE,
        data: false,
      });
    }
  }, []);

  const validateDetails = (values) => {
    VerifyEmail.email = values.email;
    VerifyEmail.type = 1;
    startLoader();

    validateEmail(VerifyEmail)
      .then(async (res) => {
        if (res.status === 200) {
          handleLogin(values);
        }
      })
      .catch(async (err) => {
        stopLoader();
        if (err.response) {
          const { status, data } = err.response;
          handleLoginResponse(status, data);
        }
      });
  };

  const handleLogin = (values) => {
    return props.handleLogin(values);
  };

  const handleReset = (resetForm, values, type) => {
    resetForm({ values: { ...values, [type]: "" } });
  }

  return (
    <>
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={(values, { setSubmitting }) => {
          validateDetails(values);
        }}
        //here we will deefine validation
        validationSchema={Yup.object().shape({
          email: Yup.string().email().required(`${lang.required}`),
          password: Yup.string()
            .required(`${lang.pwdErrorMsg1}`)
            .min(4, `${lang.pwdErrorMsg2}`)
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
            resetForm,
          } = props;

          return (
            <form className="mb-4" onSubmit={handleSubmit} autoComplete="off">
              <div className="form-group">
                <InputText
                  id="email_usr"
                  placeholder={lang.emailPlaceholder}
                  onKeyUp={(e) => movetoNext(e, "pwd_usr2")}
                  autoCapitalize="off"
                  inputMode="email"
                  type="email"
                  name="email"
                  value={values.email}
                  error={errors.email && touched.email ? errors.email : ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                ></InputText>
                {values.email ? <CancelOutlined onClick={() => handleReset(resetForm, values, "email")} className="cursor-pointer position-absolute" style={{ right: "4px", top: "10px", width: "18px" }} /> : ""}
              </div>

              <div className="form-group">
                <div className="position-relative">
                  <PasswordInput
                    id="pwd_usr2"
                    placeholder={lang.passwordPlaceholder}
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={
                      errors.password && touched.password ? errors.password : ""
                    }
                  />
                  {values.password ? <CancelOutlined onClick={() => handleReset(resetForm, values, "password")} className="cursor-pointer position-absolute" style={{ right: "4px", top: "10px", width: "18px" }} /> : ""}
                </div>
              </div>

              <p
                type="button"
                className="fntClrTheme fntSz14 mb-4"
                onClick={() => {
                  Route.push(
                    `/forgot-password?type=${userType}`,
                    "/forgot-password"
                  );
                }}
              >
                {lang.forgetPassword}
              </p>

              <Button
                type="submit"
                fclassname="mb-4"
                id="logIn2"
                cssStyles={theme.blueButton}
                children={lang.btnLogin}
              />
            </form>
          );
        }}

      </Formik>
      <style jsx>{`
        :global(.error-tooltip-container){
          right: 41px !important;
          top: 51% !important;
        }
        :global(.error-tooltip){
          right:60px !important;
        }
        `}
      </style>
    </>
  );
}

export default LoginForm;
