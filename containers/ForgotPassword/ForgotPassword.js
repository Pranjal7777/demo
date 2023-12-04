import React, { useEffect, useState } from "react";
import useLang from "../../hooks/language";
import useForm from "../../hooks/useForm";
import Button from "../../components/button/button";
import DVinputText from "../../components/DVformControl/DVinputText";
import { close_dialog, open_dialog, startLoader, stopLoader, Toast } from "../../lib/global";
import { forgotPassword } from "../../services/auth";
import { forgotPasswordViaEmailPayload } from "../../lib/data-modeling";
import { useTheme } from "react-jss"
import Route from "next/router";

const ForgotPassword = (props) => {
  const [lang] = useLang();
  const theme = useTheme()
  // console.log("password");

  const { setStap, signUpdata = {} } = props;
  // form hook
  const [Register, value, error, isValid] = useForm({
    defaultValue: { ...signUpdata },
  });

  const [forgotNext, setForgotNext] = useState(false);
  // const resetLink = false;

  useEffect(() => {
    focus("email");
  }, []);


  const callForgotPasswordApi = (event) => {
    event.preventDefault();
    // console.log("Forgot password:", value.email);

    let payload = { ...forgotPasswordViaEmailPayload };
    payload.emailOrPhone = value.email;

    startLoader();
    forgotPassword(payload)
      .then(async (res) => {
        stopLoader();
        if (res.status === 200) {
          // console.log(res);
          // resetLink = true;
          setForgotNext(true);
          open_dialog("FrgtPass1", { closeAll: true });
          // setResetLink(true);
          // console.log("ResetLink: ", forgotNext);
          // drawerToast({
          //   drawerClick: () => {
          //     // Route.push("/");
          //   },
          //   title: lang.resetLinkSet,
          //   desc: res.data.message,
          //   closeIconVisible: false,
          //   icon: `${ config.checkedLogo }`
          // });
          // setTimeout(() => {
          //   // close_drawer();
          //   //
          // }, config.DRAWER_TOASTER_TIME);
        }
      })
      .catch(async (err) => {
        stopLoader();
        // if (err.response) {
        //   Toast(err.response.data.message, "error");
        // }
        console.error("ERROR IN callForgotPasswordApi", err);
        open_dialog("confirmDialog",
          {
            title: lang.forgotPass,
            subtitle: lang.forgotPassSubTitle,
            cancelT: lang.tryAgain,
            submitT: lang.btnSignUp,
            yes: () => {
              close_dialog();
            },
            handleClose: () => close_dialog("confirmDialog")
          })
      });
  };

  return (
    <div>
      {/* //  user_forgot_modal */}
      <div>
        <button
          type="button"
          className="close dv_modal_close"
          data-dismiss="modal"
          onClick={() => props.onClose()}
        >
          {lang.btnX}
        </button>
        <div className="dv_modal_wrap">
          <div className="col-12">
            <div className="dv_modal_title text-center mb-3">
              {lang.forgotPassword}
            </div>
            <p className="col-auto txt-book fntSz16 dv_upload_txt_color dv_text_shdw text-center mb-4">
              {lang.forgotPswdVerCode}
            </p>

            <form onSubmit={callForgotPasswordApi}>
              <div className="row mb-5">
                <div className="col">
                  <div className="position-relative">
                    <DVinputText
                      className="form-control dv_form_control"
                      id={"email"}
                      defaultValue={signUpdata.email}
                      name="email"
                      type="email"
                      autoCapitalize="off"
                      inputMode="email"
                      error={error.email}
                      ref={Register({
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
                      placeholder="Enter email address"
                    />
                  </div>
                </div>
              </div>
              <Button
                type="submit"
                disabled={!isValid}
                children={lang.confirm}
                cssStyles={theme.blueButton}
              // className="btn btn-default dv_bseBtn"
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
