import React, { useRef, useState } from "react";
import useLang from "../../hooks/language";
import DVphonenoInput from "../DVformControl/DVphonenoInput";
import { open_drawer, Toast } from "../../lib/global/loader";
import {
  ValidatePhoneNoPayload,
  SendVerificationCode,
} from "../../lib/data-modeling";
import { sendverificaitonCode, validatePhoneNumber } from "../../services/auth";

const DVphoneno = (props) => {
  const { setStap, signUpdata = {}, location, isPhoneValid, type } = props;
  const [lang] = useLang();
  const phoneRef = useRef({});
  const [phoneInput, setPhoneInput] = useState({});
  const [errorMessage, setError] = useState("");

  // validate phone no
  const ValidatePhoneNo = () => {
    return new Promise(async (res, rej) => {
      try {
        ValidatePhoneNoPayload.phoneNumber = phoneInput.phoneNo;
        ValidatePhoneNoPayload.countryCode = phoneInput.countryCode;
        const response = await validatePhoneNumber(ValidatePhoneNoPayload);
        res();

      } catch (e) {
        console.error(e, phoneRef.current);
        phoneRef.current &&
          phoneRef.current.setError &&
          phoneRef.current.setError(e.response.data.message);
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
    // startLoader();
    try {
      await ValidatePhoneNo();
      SendVerificationCode.phoneNumber = phoneInput.phoneNo;
      SendVerificationCode.countryCode = phoneInput.countryCode;
      SendVerificationCode.trigger = 1;
    } catch (e) {
      // stopLoader();
      // console.log("aDSas", e);
      return;
    }

    // console.log("ASdasdad child method", phoneRef.current);
    try {
      const data = await sendverificaitonCode(SendVerificationCode);
      // stopLoader();
      open_drawer("verification", {
        setStap: () => setStap(phoneInput),
        timer: Number(data.data.data.expiryTime) * 1000,
        verificationId: data.data.data.verificationId,
        phoneNo: phoneInput.phoneNo,
        countryCode: phoneInput.countryCode,
      },
        "bottom"
      );
    } catch (e) {
      // stopLoader();
      Toast(e.response.data.message, "error");
    }
  };

  return (
    <form style={props.style} className={props.className}>
      <div className="form-group">

        <DVphonenoInput
          typeCheck={props.typeCheck}
          contactus={props.contactus}
          className="form-control"
          onBlur={props.onBlur}
          setRef={(childRef) =>
            props.setRef
              ? props.setRef(childRef)
              : (phoneRef.current = childRef.current)
          }
          errorMessage={errorMessage}
          // iso2={location.country}
          {...signUpdata}
          onChange={(data) => {
            props.setPhoneInput(data);
            // props.setPhoneNo(phoneInput.phoneNo);
          }}
          placeholder={props.placeholder}
          {...props}
          disabledField={props.disabledField}
        />
        {
          props.labelTitle && <label className="form__label " for={props.id}>{props.labelTitle}<span className="">{props.typeCheck === "phoneNumber"}</span></label>
        }
        {props.setPhone(
          `${props.phoneInput.countryCode}${props.phoneInput.phoneNo}`
        )}
        {/* {isPhoneValid && <Valid type={props.phoneNumber} validMsg={isPhoneValid} extracls='setPos' />} */}
      </div>
      <style jsx>{`
        :global(.setPos) {
          position: absolute;
          right: 4px;
          top: 70%;
          display: flex;
          justify-content: flex-end;
          transform: translate(-50%, -50%);
        }
        .form__label {
          background-color:var(--l_app_bg);
          color: #9b9b9b;
          display: block;
          font-size: .9em;
          margin-left: 10px;
          padding: 0 10px;
          pointer-events: none;
          position: absolute;
          top: -10px;
          transition: 0.2s;
        }
        :global(.dv_form_control){
          background-color:var(--l_app_bg)!important;
        }
      `}</style>
    </form>
  );
};

export default React.memo(DVphoneno);
