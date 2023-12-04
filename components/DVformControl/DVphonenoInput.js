import dynamic from "next/dynamic";
import React, { useEffect, useRef, useState } from "react";
import useLang from "../../hooks/language";
import { test_defaultCountry } from "../../lib/config/creds";
import { ValidatePhoneNumber } from "../../lib/validation/validation";
import Error from "../error/error";
const IntlTelInput = dynamic(() => import("react-intl-tel-input"));
import "react-intl-tel-input/dist/main.css";

const DVphonenoInput = (props) => {
  const [lang] = useLang();
  const { onChange, contactus } = props;
  const parentPass = useRef({});
  const [input, setInput] = useState({
    error: false,
    value: props.phoneNo || "",
    countryCode: props.countryCode || "",
    PhoneNo: props.PhoneNo || "",
    iso2: props.iso2 || test_defaultCountry,
    errorMessage: lang.phoneNoError,
  });

  const SetError = (error) => {
    setInput((prevState) => {
      return {
        ...prevState,
        error: true,
        errorMessage: error,
      };
    });
  };

  useEffect(() => {
    parentPass.current["setError"] = SetError;
    props.setRef(parentPass);
    // props.errorMessage &&
    //   setInput((prevState) => {
    //     return {
    //       ...prevState,
    //       error: true,
    //       errorMessage: props.errorMessage,
    //     };
    //   });
  }, [props.errorMessage]);

  // Works similar to componentDidMount()
  useEffect(() => {
    ValidatePhoneNumber(props.Index || "phoneNum");
  }, []);

  // handle on flag change value and handle flag change error
  const changeFlag = (...arges) => {
    let InputObject = { ...input };
    let error = !arges[arges.length - 1];

    if (arges[1]) {
      InputObject["countryCode"] = "+" + arges[1].dialCode;
      InputObject["iso2"] = arges[1].iso2;
    }
      onChange &&
      onChange({ error: error, ...InputObject });
    InputObject["error"] = error;

    if (error) {
      InputObject["errorMessage"] = lang.phoneNoError;
    }

    setInput(InputObject);
  };

  // handle on flag change value and handle flag change error
  const inputValue = (...arges) => {
    // console.log("ASdasdasdad", arges);
    let InputObject = { ...input };
    const error = arges[0];
    if (arges[2]) {
      InputObject["countryCode"] = "+" + arges[2].dialCode;

      InputObject["iso2"] = arges[2].iso2;
    }
    InputObject["phoneNo"] = arges[1].replace(/[^0-9]/g, "");
    InputObject["error"] != !error &&
      onChange &&
      onChange({ error: !error, ...InputObject });
    InputObject["error"] = !arges[0];
    InputObject["value"] = arges[1].replace(/[^0-9]/g, "");;
    if (!arges[0]) {
      InputObject["errorMessage"] = lang.phoneNoError;
    }
    setInput(InputObject);
  };

  // console.log("arges", props);
  return (
    <div className="form-group dv_appTxtClr">
      <IntlTelInput
        autoFocus={props.autoFocus || false}
        key={props.iso2}
        preferredCountries={[props.iso2 || test_defaultCountry]}
        numberType="MOBILE"
        inputClassName={`form-control ${contactus ? "dv_form_control custom_border_bottom_radius" : "dv_form_control dv_appTxtClr"} ${input.error &&
          // "input-error-error"
          "dv_form_control"
          } ${props.inputClass || ""} ${props.error ? "input-error" : ""} `}
        // geoIpLookup={function (success, failure) {}}
        separateDialCode={true}
        onPhoneNumberChange={inputValue}
        id="form-telinput"
        containerClassName="intl-tel-input"
        value={input.value}
        onSelectFlag={changeFlag}
        useMobileFullscreenDropdown={false}
        onPhoneNumberBlur={props.onBlur ? props.onBlur : () => { }}
        fieldId={props.Index || "phoneNum"}
        placeholder={props.placeholder || "Phone No*"}
        onblur={props.onBlur ? props.onBlur.bind(this, props.Index) : () => { }}
        disabled={props.disabledField}
      />
      {input.error && <Error errorMessage={input.errorMessage} typeCheck={props.typeCheck} />}
    </div>
  );
};

export default DVphonenoInput;
