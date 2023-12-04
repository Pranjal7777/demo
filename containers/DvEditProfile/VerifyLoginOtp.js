import React, { useRef, useState, useEffect } from "react";
import useLang from "../../hooks/language";
import OtpInput from "../../components/formControl/otpInput";
import useCountDown from "react-countdown-hook";
import { sendverificaitonCodeEmail } from "../../services/auth";
import {
    startLoader,
    stopLoader,
    Toast,
} from "../../lib/global";
import { millisecondsToMinutesAndSeconds, timerConversion } from "../../lib/date-operation/date-operation";
import Button from "../../components/button/button";

export default function VerifyLoginOtp(props) {
    const {
        verificationId,
        timer,
        email,
        ContinueToLogin,
        errorText,
    } = props;
    const [lang] = useLang();
    const otpRef = useRef({});
    const [timeLeft, { start }] = useCountDown(timer / 100);
    const [reVerificationData, setReVerificationId] = useState(verificationId || "");
    const [otpValue, setOtpValue] = useState("")
    const [errorMessage, setErrorMessage] = useState(errorText || "");

    // resend verification code
    const resendVerification = async () => {
        startLoader();
        try {
            const payload = {
                email: email,
            }
            const data = await sendverificaitonCodeEmail(payload);
            stopLoader();
            const newTimer = Number(data.data.data.expiryTime);
            setReVerificationId(data.data.data.verificationId);
            start(newTimer);
        } catch (err) {
            stopLoader();
            Toast(err.response.data.message, "error")
        }
    };

    useEffect(() => {
        start();
    }, []);

    useEffect(() => {
        setErrorMessage(errorText || "");
    }, [errorText]);

    useEffect(() => {
        if (otpValue.length > 3) {
            ContinueToLogin(otpValue, (reVerificationData || verificationId))
        }
    }, [otpValue])

    return (
        <div>
            <div className="text-center">
                <h6 className="dv__modelHeading my-2 text-center">
                    {lang.Enter} {lang.verificationCodeText}
                </h6>

                <div className="form-row justify-content-center mt-2 dv__verifyCodeSec">
                    <OtpInput
                        setRef={(childRef) => (otpRef.current = childRef.current)}
                        error={errorMessage}
                        onChange={(value, err) => setOtpValue(value)}
                    />
                </div>
                <div className="">
                    {timeLeft == 0 ? (
                        <div className="pointer" onClick={resendVerification}>
                            Verification code not received? <span className="gradient_text">Resend</span>
                        </div>
                    ) : (
                        `Verification code expires in ${millisecondsToMinutesAndSeconds(timeLeft)}`
                    )}
                </div>
                {<p className='text-danger fntSz12 mt-4 text-center'>{errorMessage}</p>}
                {/* <div className="mt-4">
                    <Button
                        type="submit"
                        disabled={otpValue.length < 4}
                        onClick={() => ContinueToLogin(otpValue, (reVerificationData || verificationId))}
                        fclassname="btnGradient_bg rounded-pill"
                        children={"Continue"}
                    />
                </div> */}
            </div>
            <style jsx>{`
        :global(.handleOtpBox>div){
          justify-content: center;
        }
      `}</style>
        </div>
    );
}
