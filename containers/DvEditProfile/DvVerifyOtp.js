import React, { useRef, useState, useEffect } from "react";
import Image from "../../components/image/image";
import useLang from "../../hooks/language";
import { backArrow_lightgrey, CHECK } from "../../lib/config";
import OtpInput from "../../components/formControl/otpInput";
import {
  SendVerificationCode,
  ValidateVerifcationCodePayload,
} from "../../lib/data-modeling";
import useCountDown from "react-countdown-hook";
import { useDispatch } from "react-redux";
import {
  resendverificaitonCode,
  sendverificaitonCode,
  validateVerificaitonCode,
} from "../../services/auth";
import {
  drawerToast,
  open_dialog,
  startLoader,
  stopLoader,
  Toast,
} from "../../lib/global";
import Router from "next/router";
import { updateReduxProfile } from "../../redux/actions";
import { timerConversion } from "../../lib/date-operation/date-operation";
import { useTheme } from "react-jss";
import Button from "../../components/button/button";

export default function DvVerifyOtp(props) {
  const theme = useTheme();
  const {
    setStepper,
    onClose,
    phoneNo,
    countryCode,
    verificationId,
    timer,
    showError = false,
    errorText = ""
  } = props;
  const [lang] = useLang();
  const otpRef = useRef({});
  const otpValue = useRef("");
  let style = {};
  const [timeLeft, { start, pause, resume, reset }] = useCountDown(timer / 100);
  let buttonText = updatePhone ? "Verify code" : "Verify";
  const [verificationData, setVerificationData] = useState({
    verificationId,
    timer,
  });
  const dispatch = useDispatch();
  const { updatePhone = false } = props;
  const [error, setError] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const verify = async (e) => {
    startLoader();
    e && e.preventDefault();
    ValidateVerifcationCodePayload.phoneNumber = phoneNo;
    ValidateVerifcationCodePayload.countryCode = countryCode;
    ValidateVerifcationCodePayload.verificationId =
      verificationData.verificationId;
    ValidateVerifcationCodePayload.code = otpValue.current;
    // ValidateVerifcationCodePayload.code = "1111";
    ValidateVerifcationCodePayload.trigger = updatePhone ? 3 : props.userMigration ? 9 : 1;

    try {
      const data = await validateVerificaitonCode(
        ValidateVerifcationCodePayload
      );

      if (updatePhone) {
        stopLoader();
        dispatch(
          updateReduxProfile({
            phoneNumber: phoneNo,
            countryCode: countryCode,
          })
        );
        open_dialog("successfullDialog", {
          title: lang.phoneNoChnaged,
          desc: data.data.message,
          closeIconVisible: false,
          titleClass: "max-full",
          autoClose: true,
          closeAll: true,
        });

        return;
      } else {
        onClose?.();
        Toast(data.data.message);
      }
      stopLoader();
      setStepper?.();
    } catch (e) {
      console.log(e.message, "error")
      stopLoader();
      otpRef.current.setError(e?.response?.data?.message);
    }
  };
  // resend verification code
  const resendVerification = async () => {
    startLoader();
    try {
      const payload = {
        emailOrPhone: props.email,
        type: 2,
        trigger: 9
      }
      const data = await resendverificaitonCode(payload);
      stopLoader();
      const newTimer = Number(data.data.data.expiryTime) * 100;
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

  useEffect(() => {
    start();
  }, []);

  return (
    <div>
      <div className="text-center">
        <h6 className="dv__modelHeading my-2">
          {lang.Enter} {lang.verificationCodeText}
        </h6>

        {props.updatePhone && (
          <div className="col-12 txt-roman fntSz12 text-center">
            {lang.enterPhoneNo} {props.countryCode} {props.phoneNo},{" "}
            {lang.enterVerification}
          </div>
        )}

        <div className="form-row justify-content-center mt-2 dv__verifyCodeSec">
          <OtpInput
            setRef={(childRef) => (otpRef.current = childRef.current)}
            error={errorMessage}
            verify={verify}
            onChange={(value, err) => {
              otpValue.current = value;
              setError(err);
            }}
          />
        </div>
        <div className="txt-book fntSz12 text-start text-black">
          {timeLeft == 0 ? (
            <div className="pointer" onClick={resendVerification}>
              Verification code not received? <span className="gradient_text">Resend</span>
            </div>
          ) : (
              `Verification code expires in ${timerConversion(timeLeft)} sec`
          )}
        </div>
        {showError && <p className='text-danger fntSz12 my-1 text-start'>{errorText}</p>}
        <div className="mt-3">
          <Button
            type="submit"
            // disabled={error} // Uncomment to remove hardcoded value
            onClick={() => verify()}
            fclassname="gradient_bg"
            cssStyles={theme.blueButton}
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
}
