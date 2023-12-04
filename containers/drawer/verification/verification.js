import React, { useEffect, useRef, useState } from "react";
import Button from "../../../components/button/button";
import OtpInput from "../../../components/formControl/otpInput";
import Image from "../../../components/image/image";
import {
  backArrow_lightgrey,
  backArrow,
  black4,
  CHECK,
  signupBackground,
} from "../../../lib/config";
import useCountDown from "react-countdown-hook";
import {
  sendverificaitonCode,
  validateVerificaitonCode,
} from "../../../services/auth";
import { updateReduxProfile } from "../../../redux/actions/index";

import {
  SendVerificationCode,
  ValidateVerifcationCodePayload,
} from "../../../lib/data-modeling";
import { useDispatch } from "react-redux";

import { timerConversion } from "../../../lib/date-operation/date-operation";
import {
  drawerToast,
  startLoader,
  stopLoader,
  Toast,
} from "../../../lib/global";
import useLang from "../../../hooks/language";
import Router from "next/router";
import Wrapper from "../../../hoc/Wrapper";
import { useTheme } from "react-jss";

const Verification = (props) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { updatePhone = false } = props;
  const [lang] = useLang();
  const otpRef = useRef({});
  const {
    setStap,
    onClose,
    phoneNo,
    countryCode,
    verificationId,
    timer,
  } = props;
  const [timeLeft, { start, pause, resume, reset }] = useCountDown(timer);
  const [verificationData, setVerificationData] = useState({
    verificationId,
    timer,
  });
  let style = {};
  let buttonText = "";
  const otpValue = useRef("");
  const [error, setError] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isBtnEnable, setIsBtnEnable] = useState(true);
  const innerHeight = useRef(null);

  const verify = async (e) => {
    startLoader();
    e && e.preventDefault();
    ValidateVerifcationCodePayload.phoneNumber = phoneNo;
    ValidateVerifcationCodePayload.countryCode = countryCode;
    ValidateVerifcationCodePayload.verificationId =
      verificationData.verificationId;
    // ValidateVerifcationCodePayload.code = otpValue.current;  // Uncomment to remove hardcoded value
    ValidateVerifcationCodePayload.code = otpValue.current || "1111";
    ValidateVerifcationCodePayload.trigger = updatePhone ? 3 : 1;
    try {
      const data = await validateVerificaitonCode(
        ValidateVerifcationCodePayload
      );

      if (updatePhone) {
        onClose();
        stopLoader();
        Router.back();
        dispatch(
          updateReduxProfile({
            phoneNumber: phoneNo,
            countryCode: countryCode,
          })
        );
        drawerToast({
          title: lang.phoneNoChnaged,
          desc: data.data.message,
          closeIconVisible: false,
          titleClass: "max-full",
          autoClose: true,
        });

        return;
      } else {
        onClose();
        Toast(data.data.message || "success");
      }
      stopLoader();
      setStap();
    } catch (e) {
      stopLoader();
      otpRef.current.setError(e.response.data.message);
    }
  };

  // resend verification code
  const resendVerificationCode = async () => {
    startLoader();
    try {
      SendVerificationCode.phoneNumber = phoneNo;
      SendVerificationCode.countryCode = countryCode;
      SendVerificationCode.trigger = updatePhone ? 3 : 1;
      const data = await sendverificaitonCode(SendVerificationCode);
      stopLoader();
      const newTimer = Number(data.data.data.expiryTime) * 1000;
      setVerificationData({
        timer: newTimer,
        verificationId: data.data.data.verificationId,
      });
      start(newTimer);
    } catch (e) {
      stopLoader();
      Toast(e.response.data.message, "error");
    }
  };

  React.useEffect(() => {
    start();
  }, []);

  // We can remove this
  if (updatePhone) {
    style = { backgroundColor: `url(${black4})`, color: "white" };
  } else {
    style = { backgroundImage: `url(${signupBackground})`, color: "white" };
  }

  if (updatePhone) {
    buttonText = "Verify code";
  } else {
    buttonText = "Confirm";
  }

  useEffect(() => {
    innerHeight.current = window.visualViewport.height;
    window.visualViewport.addEventListener("resize", hidebuttonhandler)
    return () => window.visualViewport.removeEventListener("resize", hidebuttonhandler);
  }, [])

  const hidebuttonhandler = () => {
    if (window.visualViewport.height === innerHeight.current) {
      setIsBtnEnable(true);
    } else {
      setIsBtnEnable(false);
    }
  }
  return (
    <Wrapper>
      <div className="wrap h-screen">
        <div
          className={`${!updatePhone ? "scr" : "wrap-scr bg-dark-custom h-100"
            }`}
          // style={{ ...style }}
          style={theme.forgetPassBg}
        >
          <div className="header-top-secion w-330 mx-auto pt-3">
            <div className="col-12">
              <div className="row justify-content-between">
                <div className="col-auto">
                  <Image
                    alt="verification-icon"
                    onClick={onClose}
                    src={theme.type === "light" ? backArrow : backArrow_lightgrey}
                    width={28}
                    id="scr2"
                  />
                </div>
              </div>
            </div>
          </div>{" "}
          <div className="w-330 mx-auto content-secion ">
            <div className="col-12 text-center">
              <h4 className={`titleH4 ${!updatePhone ? "mb-4" : ""}`}>
                {lang.Enter} <br></br> {lang.verificationCodeText}
              </h4>
            </div>
          </div>
          <div className="col-12 mb-4 text-center">
            <span className="fntSz11 font-weight-bold">{lang.otpText}</span>
          </div>
          {updatePhone && (
            <div className="col-12 txt-roman fntSz12 text-center mb-5">
              {lang.enterPhoneNo} {countryCode} {phoneNo},{" "}
              {lang.enterVerification}
            </div>
          )}
          <div>
            <div className="w-330 mx-auto pb-3">
              <div className="col-12 text-center">
                <div>
                  <form className="mb-4">
                    <div className="form-row justify-content-center verifyCodeSec">
                      <OtpInput
                        setRef={(childRef) =>
                          (otpRef.current = childRef.current)
                        }
                        error={errorMessage}
                        verify={verify}
                        onChange={(value, err) => {
                          otpValue.current = value;
                          setError(err);
                        }}
                      />
                    </div>
                  </form>
                  <div className="txt-book fntSz16">
                    {timeLeft == 0 ? (
                      <div className="pointer" onClick={resendVerificationCode}>
                        {lang.resendOtp || "Resend OTP"}
                      </div>
                    ) : (
                      timerConversion(timeLeft)
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="posBtm">
              {isBtnEnable && <Button
                type="submit"
                // disabled={error} // Uncomment to remove hardcoded value
                onClick={verify}
                cssStyles={theme.blueButton}
                id="scr6"
              >
                {buttonText}
              </Button>}
            </div>
          </div>
        </div>
      </div>
      <style jsx>
        {`
          :global(.MuiDrawer-paper) {
            color: inherit;
          }
          :global(.form-control:focus){
            background:rgb(255 255 255 / 0.2);
          }
        `}
      </style>
    </Wrapper >
  );
};

export default React.memo(Verification);
