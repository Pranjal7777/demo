import React, { useRef, useState } from "react";
import Button from "../../../components/button/button";
import InputPassword from "../../../components/formControl/inputPassword";
import InputText from "../../../components/formControl/inputText";
import PhoneNoInput from "../../../components/formControl/phoneNoInput";
import Image from "../../../components/image/image";
import useLang from "../../../hooks/language";
import useForm from "../../../hooks/useForm";
import { eye } from "../../../lib/config";
import {
  open_drawer,
  startLoader,
  stopLoader,
  Toast,
} from "../../../lib/global";
import {
  ValidatePhoneNoPayload,
  SendVerificationCode,
} from "../../../lib/data-modeling";
import {
  sendverificaitonCode,
  validatePhoneNumber,
} from "../../../services/auth";
import useLocation from "../../../hooks/location-hooks";
import { useTheme } from "react-jss";

const PhoneNo = (props) => {
  const theme = useTheme();
  const { setStap, signUpdata = {}, location } = props;
  const [lang] = useLang();
  const phoneRef = useRef({});
  const [phoneInput, setPhoneInput] = useState({});
  const [errorMessage, setError] = useState("");

  // validate phone no
  const ValidatePhoneNo = (value = {}) => {
    return new Promise(async (res, rej) => {
      try {
        ValidatePhoneNoPayload.phoneNumber =
          value.phoneNo || phoneInput.phoneNo;
        ValidatePhoneNoPayload.countryCode =
          value.phoneNo || phoneInput.countryCode;

        const response = await validatePhoneNumber(ValidatePhoneNoPayload);

        phoneRef.current &&
          phoneRef.current.setValid &&
          phoneRef.current.setValid(true);
        stopLoader();
        res();
      } catch (e) {
        console.error("ValidatePhoneNo", e);
        e.response &&
          phoneRef.current &&
          phoneRef.current.setError &&
          phoneRef.current.setError(e.response.data.message);
        stopLoader();
        // setError(e.response.data.message);
        rej();
      }
    });
  };

  // setting phone nodata
  useState(() => {
    signUpdata.value &&
      setPhoneInput({
        ...phoneInput,
        ...signUpdata,
        error: true,
      });
  }, []);

  // validate email and open otp dialog
  const gotoVerificationPage = async (e) => {
    let data = {};
    e && e.preventDefault();
    startLoader();
    try {
      await ValidatePhoneNo();
      SendVerificationCode.phoneNumber = phoneInput.phoneNo;
      SendVerificationCode.countryCode = phoneInput.countryCode;
      SendVerificationCode.trigger = 1;
    } catch (e) {
      stopLoader();
      // console.log("aDSas", e);
      return;
    }

    // console.log("ASdasdad child method", phoneRef.current);
    try {
      const data = await sendverificaitonCode(SendVerificationCode);
      stopLoader();
      open_drawer(
        "verification",
        {
          setStap: () => setStap(phoneInput),
          timer: Number(data.data.data.expiryTime) * 1000,
          verificationId: data.data.data.verificationId,
          phoneNo: phoneInput.phoneNo,
          countryCode: phoneInput.countryCode,
        },
        "bottom"
      );
    } catch (e) {
      stopLoader();
      Toast(e.response.data.message, "error");
    }
  };

  const goToNext = async (e) => {
    e && e.preventDefault();
    startLoader();
    try {
      await ValidatePhoneNo();
      setStap(phoneInput);
    } catch (e) {
      stopLoader();
    }
    stopLoader();
  };

  return (
    <form id="form" onSubmit={goToNext}>
      <div className="w-330 mx-auto phone-input content-secion pb-3">
        <div className="col-12 text-center">
          <div className="mb-4">
            <PhoneNoInput
              autoFocus
              setRef={(childRef) => (phoneRef.current = childRef.current)}
              errorMessage={errorMessage}
              iso2={location.country}
              {...signUpdata}
              onChange={(data) => setPhoneInput(data)}
              onBlur={(value) => ValidatePhoneNo(value)}
            ></PhoneNoInput>
          </div>{" "}
        </div>
      </div>
      <div className="posBtm">
        <Button
          role="button"
          disabled={!phoneInput.error}
          type="submit"
          // onClick={gotoVerificationPage}
          cssStyles={theme.blueButton}
          id="scr6"
        >
          {lang.next}
        </Button>
      </div>
    </form>
  );
};

export default React.memo(PhoneNo);
