import dynamic from "next/dynamic";
import React, { useCallback, useEffect, useRef, useState } from "react";
import useLang from "../../hooks/language";
import {
  defaultCountry,
  test_defaultCountry,
  // EDIT_WHITE,
  Chevron_Right_Darkgrey,
} from "../../lib/config";
import Error from "../error/error";
import Image from "../image/image";
import { ValidatePhoneNumber } from "../../lib/validation/validation";
import debounce from "lodash/debounce";
import CheckCircleOutlineOutlinedIcon from "@material-ui/icons/CheckCircleOutlineOutlined";
import isMobile from "../../hooks/isMobile";
import { useTheme } from "react-jss";
const IntlTelInput = dynamic(() => import("react-intl-tel-input"));
import "react-intl-tel-input/dist/main.css";

const PhoneNoInput = (props) => {
  const theme = useTheme()
  const [lang] = useLang();
  const { onChange, disabled = false, errorIocnClass, errorClass } = props;
  const parentPass = useRef({});
  const [input, setInput] = useState({
    error: false,
    value: props.phoneNo || "",
    countryCode: props.countryCode || "",
    phoneNo: props.phoneNo || "",
    iso2: props.iso2 || test_defaultCountry,
    errorMessage: lang.phoneNoError,
  });
  const [mobileView] = isMobile();
  const [isValid, setValid] = useState(false);

  useEffect(() => {
    setInput((prev) => ({
      ...prev,
      error: false,
      value: props.phoneNo || "",
      countryCode: props.countryCode || "",
      phoneNo: props.phoneNo || "",
      iso2: props.iso2 || test_defaultCountry,
      errorMessage: lang.phoneNoError,
    }))
  }, [props.phoneNo])
  // debounce
  const onBlur = useCallback(
    debounce((func, value, isValid) => {
      // console.log("Sdsadasd");
      isValid && func(value?.phoneNo);
    }, 500),
    [] // will be created only once initially
  );

  const SetError = (error) => {
    setInput((prevState) => {
      return {
        ...prevState,
        error: true,
        errorMessage: error,
      };
    });
  };

  // Works similar to componentDidMount()
  useEffect(() => {
    ValidatePhoneNumber(props.Index || "phoneNum");
  }, []);

  const setValidTik = () => {
    setValid(true);
  };

  useEffect(() => {
    parentPass.current["setError"] = SetError;
    parentPass.current["setValid"] = setValidTik;
    props.setRef && props.setRef(parentPass);
    // props.errorMessage &&
    //   setInput((prevState) => {
    //     return {
    //       ...prevState,
    //       error: true,
    //       errorMessage: props.errorMessage,
    //     };
    //   });
  }, [props.errorMessage]);

  // handle on flag change value and handle flag change error
  const changeFlag = (...arges) => {
    let InputObject = { ...input };
    let error = !arges[arges.length - 1];
    setValid(false);
    if (arges[1]) {
      InputObject["countryCode"] = "+" + arges[1].dialCode;
      InputObject["iso2"] = arges[1].iso2;
    }
    InputObject["error"] != error &&
      onChange &&
      onChange({ error: error, ...InputObject });
    InputObject["error"] = error;

    if (error) {
      InputObject["errorMessage"] = lang.phoneNoError;
    }

    props.onBlur &&
      onBlur(
        props.onBlur,
        {
          countryCode: InputObject["countryCode"],
          phoneNo: InputObject["phoneNo"],
        },
        error
      );
    setInput(InputObject);
  };

  // handle on flag change value and handle flag change error
  const inputValue = (...arges) => {
    // console.log("ASdasdasdad", arges);
    setValid(false);
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
    InputObject["value"] = arges[1].replace(/[^0-9]/g, "");
    if (!arges[0]) {
      InputObject["errorMessage"] = lang.phoneNoError;
    }

    props.onBlur &&
      onBlur(
        props.onBlur,
        {
          countryCode: InputObject["countryCode"],
          PhoneNo: InputObject["phoneNo"],
        },
        arges[0]
      );
    setInput(InputObject);
  };

  return (
    <div className="form-group position-relative">
      {props.label && (
        <label
          className={
            mobileView ? "mv_label_profile_input" : "fntClrTheme mb-0 position-absolute"
          }
        >
          {props.label}
        </label>
      )}
      <div className="position-relative">
        <IntlTelInput
          disabled={disabled}
          autoFocus={props.autoFocus || false}
          key={props.iso2}
          preferredCountries={[props.iso2 || test_defaultCountry]}
          numberType="MOBILE"
          inputClassName={`dt__input form-control bold rounded-pill ${input.error && "input-error-error"
            } intlInput-control form-control-trans ${props.inputClass || ""} ${props.error ? "input-error" : ""
            }`}
          // geoIpLookup={function (success, failure) {}}
          separateDialCode={true}
          onPhoneNumberChange={inputValue}
          id="form-telinput"
          containerClassName={`intl-tel-input ${props.containerClassName}`}
          value={input.value}
          onSelectFlag={changeFlag}
          useMobileFullscreenDropdown={false}
          onPhoneNumberBlur={props.onBlur ? props.onBlur : () => { }}
          fieldId={props.Index || "phoneNum"}
          placeholder=""
          onblur={
            props.onBlur ? props.onBlur.bind(this, props.Index) : () => { }
          }
          style={{ color: 'var(--l_app_text) !important', background: 'var(--l_app_bg) !important' }}
        />
        {!input.error && isValid && (
          <div className="error-tooltip-container">
            <CheckCircleOutlineOutlinedIcon
              style={{ fill: "green", color: "white" }}
            />
          </div>
        )}
        {props.edit && (
          <Image
            src={
              // mobileView ? EDIT_WHITE :
              Chevron_Right_Darkgrey
            }
            className={mobileView ? "edit-icon" : "dv__edit-icon"}
          />
        )}
        {input.error && <Error errorMessage={input.errorMessage} className={errorClass} errorIocnClass={errorIocnClass} typeCheck={props.typeCheck}></Error>}
      </div>

    </div>
  );
};

export default PhoneNoInput;
