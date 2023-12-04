import { useEffect, useRef, useState } from "react";
import OtpInput from "react-otp-input";
import useLang from "../../hooks/language";
import Error from "../error/error";

const Otp = (props) => {
  const [lang] = useLang();
  // const [otp, setOtp] = useState(null); // Uncomment to remove hardcoded value
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(false);
  const otpRef = useRef({});
  const [errorMessage, setErrorMessage] = useState("");

  // handle otp value and check otp is valid or not
  const handlerOtp = (value) => {
    let isError = false;

    setOtp(value);
    if (value.length < 4) {
      isError = true;

      !error && setError(true);
    } else {
      isError = false;
      error && setError(false);
    }

    setErrorMessage("");
    props.onChange && props.onChange(value, isError);
    if (!isError) {
      props.verify && props.verify();
    }
  };

  const setErrorMes = (error) => {
    setError(true);
    setErrorMessage(error);
  };

  useEffect(() => {
    otpRef.current["setError"] = setErrorMes;
    props.setRef(otpRef);
  }, []);

  return (
    <div className="form-group position-relative">
      <div className="d-flex  justify-content-center handleOtpBox">
        <OtpInput
          placeholder="0000"
          shouldAutoFocus={true}
          onChange={handlerOtp}
          numInputs={4}
          inputStyle={`form-control border borderColor   ${error && errorMessage && "input-error-error"
            } ${error && "sinput-error-error"} mx-2 form-control-trans`}
          isInputNum={true}
          value={otp}
        />
      </div>
      <div className="mt-2 otp-input">
        {error && errorMessage && <Error errorMessage={errorMessage} />}
      </div>
    </div>
  );
};

export default Otp;
