import React, { useRef, useState } from "react";
import EditProfileHeader from "./edit-profile-header";
import useLang from "../../../hooks/language";
import UpdateForm from "../../../components/edit-profile/update-form";
import PhoneNoInput from "../../../components/formControl/phoneNoInput";
import useLocation from "../../../hooks/location-hooks";
import {
  open_drawer,
  startLoader,
  stopLoader,
  Toast,
} from "../../../lib/global";
import {
  SendVerificationCode,
  ValidatePhoneNoPayload,
} from "../../../lib/data-modeling";
import {
  sendverificaitonCode,
  validatePhoneNumber,
} from "../../../services/auth";
import { useDispatch } from "react-redux";
import { updateReduxProfile } from "../../../redux/actions";
import { getCookiees } from "../../../lib/session";
import Button from "../../../components/button/button";
import { useTheme } from "react-jss";

export default function EditPhoneNumber(props) {
  const theme = useTheme();
  const [lang] = useLang();
  const [phoneInput, setPhoneInput] = useState({});
  const [errorMessage, setError] = useState("");
  const [location] = useLocation();
  const phoneRef = useRef({});
  const dispatch = useDispatch();

  // validate phone no
  const ValidatePhoneNo = () => {
    return new Promise(async (res, rej) => {
      try {
        ValidatePhoneNoPayload.phoneNumber = phoneInput.phoneNo;
        ValidatePhoneNoPayload.countryCode = phoneInput.countryCode;

        const response = await validatePhoneNumber(ValidatePhoneNoPayload);
        res();
      } catch (e) {
        phoneRef.current &&
          phoneRef.current.setError &&
          phoneRef.current.setError(e.response.data.message);
        // setError(e.response.data.message);
        rej();
      }
    });
  };

  // validate email and open otp dialog
  const gotoVerificationPage = async (e) => {
    let data = {};
    e && e.preventDefault();
    startLoader();
    try {
      await ValidatePhoneNo();
      SendVerificationCode.phoneNumber = phoneInput.phoneNo;
      SendVerificationCode.countryCode = phoneInput.countryCode;
      SendVerificationCode.trigger = 3;
      SendVerificationCode.userId = getCookiees("uid");
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
          updatePhone: true,
          setStap: () => {
            // console.log("success done");
            dispatch(
              updateReduxProfile({
                countryCode: phoneInput.countryCode,
                phoneNumber: phoneInput.phoneNo,
              })
            );
          },
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

  return (
    <div className="wrap">
      <div className="scr wrap-scr bg-dark-custom">
        <div className="col-12">
          <EditProfileHeader title={lang.changePhoneNumbr} />
        </div>
        <div className="col-12 py-4">
          <PhoneNoInput
            autoFocus
            setRef={(childRef) => (phoneRef.current = childRef.current)}
            errorMessage={errorMessage}
            iso2={location.country}
            onChange={(data) => setPhoneInput(data)}
            typeCheck="editNumber"
          ></PhoneNoInput>
          <Button
            type="submit"
            disabled={!phoneInput.error}
            fclassname="mb-3"
            cssStyles={theme.blueButton}
            onClick={gotoVerificationPage}
          >
            {lang.update}
          </Button>
          <div className="txt-roman fntSz12 text-center">{lang.editDesc}</div>
        </div>
      </div>
      <style jsx>
        {`
          :global(.error-tooltip){
           right:1.4em !important;
          }
          :global(.error-tooltip-container){
           right:0.5em !important;
          }
        `}
      </style>
    </div>
  );
}
