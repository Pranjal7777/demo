import React, { useRef, useState } from "react";
import Router from "next/router";
import { useTheme } from "react-jss";
import { useSelector } from "react-redux";

import DVotp from "../../components/DVformControl/DVotp";
import * as config from "../../lib/config";
import Button from "../../components/button/button";
import OtpInput from "../../components/formControl/otpInput";
import Image from "../../components/image/image";
import { backArrow, black4, signupBackground } from "../../lib/config";
import useCountDown from "react-countdown-hook";
import {
  sendverificaitonCode,
  validateVerificaitonCode,
  signUp,
} from "../../services/auth";
import {
  SendVerificationCode,
  ValidateVerifcationCodePayload,
  ModelRegistrationPayload,
} from "../../lib/data-modeling";
import { timerConversion } from "../../lib/date-operation/date-operation";
import { open_dialog, startLoader, stopLoader, Toast, UploadImage } from "../../lib/global";
import useLang from "../../hooks/language";
import SubmittedModel from "./SubmittedModel";
import Img from "../../components/ui/Img/Img";
import { getCognitoToken } from "../../services/userCognitoAWS";
import fileUploaderAWS from "../../lib/UploadAWS/uploadAWS";
import { setCookie } from "../../lib/session";

let validOtp = false;

const SignUpModel1 = (props) => {
  const theme = useTheme();
  const { updatePhone = false } = props;
  const [lang] = useLang();
  const otpRef = useRef({});
  const {
    firstName,
    lastName,
    email,
    password,
    userName,
    phoneNumber,
    dateOfBirth,
    gender,
    verificationid,
    pic,
    socialMediaLink,
    isNSFWAllow,
    setStap,
    onClose,
    countryCode,
    verificationId,
    timer,
    inviterReferralCode,
    groupIds,
    timezone
  } = props;
  const [timeLeft, { start, pause, resume, reset }] = useCountDown(
    timer * 1000
  );
  const [verificationData, setVerificationData] = useState({
    verificationId,
    timer,
  });
  let style = {};
  let buttonText = "";
  const otpValue = useRef("");

  const [error, setError] = useState(true);
  const [next, setNext] = useState(false);
  const [vid, setverificationid] = useState(props.verificationid);
  const [errorMessage, setErrorMessage] = useState("");

  const verify = async (e) => {
    startLoader();
    e && e.preventDefault();
    // ValidateVerifcationCodePayload.phoneNumber = phoneNumber;
    // ValidateVerifcationCodePayload.countryCode = countryCode;
    ValidateVerifcationCodePayload.phoneNumber = phoneNumber;
    ValidateVerifcationCodePayload.countryCode = countryCode;
    ValidateVerifcationCodePayload.verificationId = vid || verificationid;
    ValidateVerifcationCodePayload.code = otpValue.current;
    ValidateVerifcationCodePayload.trigger = 1;
    try {
      const data = await validateVerificaitonCode(
        ValidateVerifcationCodePayload
      );
      // Toast(data.data.message);
      validOtp = true;
      stopLoader();
    } catch (e) {
      stopLoader();
      // console.log("sadasdda", e.response.data.message);
      setError(true);
      validOtp = false;

      e.response &&
        otpRef.current &&
        otpRef.current.setError(e.response.data.message);
    }
    // stopLoader();
  };

  // resend verification code
  const resendVerificationCode = async () => {
    startLoader();
    try {
      SendVerificationCode.phoneNumber = phoneNumber;
      SendVerificationCode.countryCode = countryCode;
      SendVerificationCode.trigger = 1;
      const data = await sendverificaitonCode(SendVerificationCode);
      stopLoader();
      const newTimer = Number(data.data.data.expiryTime) * 1000;
      setverificationid(data.data.data.verificationId);
      setVerificationData({
        timer: newTimer,
        verificationId: verificationid,
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

  // console.log("sdasad", verificationid);
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

  const callModelSignUpApi = async () => {
    try {
      startLoader();
      let payload = { ...ModelRegistrationPayload };
      const cognitoToken = await getCognitoToken();
      const tokenData = cognitoToken?.data?.data;
      const imgFileName = `${Date.now()}_${userName?.toLowerCase()}`;
      const folderName = `users/${config.FOLDER_NAME_IMAGES.profile}`;
      const url = await fileUploaderAWS(
        pic.file[0],
        tokenData,
        imgFileName,
        false,
        folderName
      );

      payload.firstName = firstName;
      payload.lastName = lastName;
      payload.email = email;
      payload.password = password;
      payload.username = userName;
      payload.profilePic = url;
      payload.countryCode = countryCode;
      payload.phoneNumber = phoneNumber;
      payload.dateOfBirth = dateOfBirth;
      payload.gender = gender;
      payload.socialMediaLink = socialMediaLink;
      payload.isNSFWAllow = isNSFWAllow;
      payload.inviterReferralCode = inviterReferralCode;
      payload.timezone = timezone
      if(props?.groupIds.length > 0){
        payload.groupIds = props?.groupIds
      }

      const res = await signUp(payload);
      stopLoader();

      if (res?.status === 200) {
        Router.push("/login");
        setCookie("userType", 2)
        open_dialog("profileSubmitted", {});
      }

    } catch (err) {
      stopLoader();
      if (err.response) {
        Toast(err?.response?.data?.message, "error");
      }
      console.error(err);
    }
  };

  return (
    <div>
      <div>
        <Img
          src={config.LEFT_ARROW}
          width={18}
          className="close dv_modal_close_left cursorPtr"
          onClick={() => props.onBack()}
          alt="left-arrow"
        />
        <div className="dv_modal_wrap">
          <div className={`$!updatePhone && col-12`}>
            <div className="dv_modal_title text-center mb-3">
              {lang.verificationCode}
            </div>
            <p className="txt-book fntSz14 text-center dv_text_shdw">
              {lang.enterCode} {`${phoneNumber}`}
            </p>
            <form>
              {updatePhone && (
                <div className="col-12 txt-roman fntSz12 text-center mb-5">
                  {lang.enter4digit} {countryCode} {phoneNumber}
                </div>
              )}
              <div className="w-250 mx-auto">
                <DVotp
                  setRef={(childRef) => (otpRef.current = childRef.current)}
                  error={errorMessage}
                  verify={() => verify()}
                  onChange={(value, err) => {
                    otpValue.current = value;
                    setError(err);
                  }}
                />

                <div className="row justify-content-center mb-3">
                  <div className="col-auto txt-book fntSz16 dv_upload_txt_color dv_text_shdw text-center">
                    {timeLeft == 0 ? (
                      <div
                        className="pointer"
                        onClick={() => resendVerificationCode()}
                      >
                        {lang.resend}
                      </div>
                    ) : (
                      timerConversion(timeLeft)
                    )}
                  </div>
                </div>
              </div>
              <Button
                type="button"
                // disabled={validOtp ? false : true} // Uncomment to remove hardcoded value
                onClick={() => {
                  callModelSignUpApi();
                }}
                fclassname="mb-3"
                cssStyles={theme.blueButton}
                children={lang.next}
              />
            </form>
          </div>
        </div>
        <style jsx>
              {`
                :global(.dv_modal_close_left){
                  color: ${theme.text} !important;
                }
              `}
            </style>
      </div>

      <SubmittedModel />
    </div>
  );
};

export default SignUpModel1;
