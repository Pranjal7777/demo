import React, { useRef, useState } from "react";
import PhoneNoInput from "../../components/formControl/phoneNoInput";
import Wrapper from "../../hoc/Wrapper";
import useLang from "../../hooks/language";
import { open_dialog, startLoader, stopLoader, Toast } from "../../lib/global";
import { getCookiees } from "../../lib/session";
import { updateReduxProfile } from "../../redux/actions";
import { sendverificaitonCode, validatePhoneNumber } from "../../services/auth";
import { useDispatch } from "react-redux";
import useLocation from "../../hooks/location-hooks";
import {
  SendVerificationCode,
  ValidatePhoneNoPayload,
} from "../../lib/data-modeling";
import DvVerifyOtp from "./DvVerifyOtp";
import Button from "../../components/button/button";
import { useTheme } from "react-jss";

export default function DvEditPhoneNum(props) {
  const theme = useTheme();
  const [lang] = useLang();
  const [phoneInput, setPhoneInput] = useState({});
  const [errorMessage, setError] = useState("");
  const [location] = useLocation();
  const phoneRef = useRef({});
  const dispatch = useDispatch();
  const [currentScreen, setCurrentScreen] = useState();

  // Function for changing screen
  const updateScreen = (screen) => {
    setCurrentScreen(screen);
  };

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
      updateScreen(
        <DvVerifyOtp
          updatePhone={true}
          setStap={() => {
            // console.log("success done");
            dispatch(
              updateReduxProfile({
                countryCode: phoneInput.countryCode,
                phoneNumber: phoneInput.phoneNo,
              })
            );
          }}
          timer={Number(data.data.data.expiryTime) * 1000}
          verificationId={data.data.data.verificationId}
          phoneNo={phoneInput.phoneNo}
          countryCode={phoneInput.countryCode}
          backScreen={() => updateScreen()}
          updateScreen={updateScreen}
          onClose={props.onClose}
        ></DvVerifyOtp>
      );
    } catch (e) {
      stopLoader();
      Toast(e.response.data.message, "error");
    }
  };

  return (
    <Wrapper>
      {!currentScreen ? (
        <div>
          <button
            type="button"
            className="close dv__modal_close"
            onClick={() => props.onClose()}
          >
            {lang.btnX}
          </button>
          <div className="p-4 text-center">
            <h6 className="dv__modelHeading my-2 text-black">{lang.changePhoneNumbr}</h6>
            <PhoneNoInput
              autoFocus
              containerClassName="dv__border_bottom_phoneInput"
              inputClass="dv__border_bottom_profile_input"
              setRef={(childRef) => (phoneRef.current = childRef.current)}
              errorMessage={errorMessage}
              iso2={location.country}
              phoneNo={phoneInput.phoneNo}
              countryCode={phoneInput.countryCode}
              onChange={(data) => setPhoneInput(data)}
            />
            <div className="row">
              <div className="col-11 mx-auto">
                <div className="txt-roman fntSz12 text-center">
                  {lang.editDesc}
                </div>
                <Button
                  type="submit"
                  disabled={!phoneInput.error}
                  cssStyles={theme.blueButton}
                  fclassname="my-3"
                  onClick={gotoVerificationPage}
                >
                  {lang.update}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        currentScreen
      )}
      <style jsx>
        {`
          :global(.MuiDialog-paper) {
            max-width: 450px;
          }
          :global(.MuiDrawer-paper) {
            color: inherit;
          }
          :global(.dv__border_bottom_profile_input){
            padding-left: 86px !important;
          }
        `}
      </style>
    </Wrapper>
  );
}
