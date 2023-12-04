import { useEffect, useRef, useState } from "react";
import OtpInput from "react-otp-input";
import Wrapper from "../../hoc/Wrapper";
import useLang from "../../hooks/language";
import Error from "../error/error";

const DVotp = (props) => {
  const [lang] = useLang();
  // const [otp, setOtp] = useState(null); // Uncomment to remove hardcoded value
  const [otp, setOtp] = useState(1111);
  const [error, setError] = useState(false);
  const otpRef = useRef({});
  const [errorMessage, setErrorMessage] = useState("");

  // handle otp value and check otp is valid or not
  const handlerOtp = (value) => {
    let isError = false;
    // console.log("feifj", value);
    setOtp(value);
    // if (value.length < 4) {
    //   isError = true;
    //   !error && setError(true);
    //   setErrorMessage(lang.otpError);
    // } else {
    //   isError = false;
    //   error && setError(false);
    // }
    if (value.length == 4) {
      props.onChange && props.onChange(value, isError);
      if (!isError) {
        props.verify && props.verify();
      }
    }
  };

  const setErrorMes = (error) => {
    setError(true);
    setErrorMessage(error);
    setTimeout(() => {
      setOtp(null);
      setError(false);
      setErrorMessage("");
    }, 2000);
  };

  useEffect(() => {
    otpRef.current["setError"] = setErrorMes;
    props.setRef && props.setRef(otpRef);
  }, []);

  return (
    // <div className="form-group position-relative">
    //     <div className="d-flex  justify-content-center">
    //         <OtpInput
    //             placeholder="0000"
    //             shouldAutoFocus={true}
    //             onChange={handlerOtp}
    //             numInputs={4}
    //             inputStyle={`dv_form_control ${error && "input-error-error"} ${error && "input-error-error"
    //                 } mx-2`}
    //             isInputNum={true}
    //             value={otp}
    //         />
    //     </div>
    //     <div className="mt-2 otp-input">
    //         {error && <Error errorMessage={errorMessage}></Error>}
    //     </div>
    // </div>
    <Wrapper>
      <div className="form-row justify-content-center mb-2 position-relative">
        <OtpInput
          className={`form-control col otpInput ${error && "input-error-error"
            }`}
          placeholder="0000"
          // shouldAutoFocus={true}
          onChange={handlerOtp}
          numInputs={4}
          inputStyle={`dv_form_control mx-2`}
          isInputNum={true}
          value={otp}
        />
        <div className="otp-input dv-otp">
          {error && <Error errorMessage={errorMessage} />}
        </div>
      </div>
      <style jsx>{`
            :global(.dv_form_control){
              padding:0px;
            }
      `}</style>
    </Wrapper>
  );
};

export default DVotp;
