import debounce from "lodash/debounce";
import { useCallback, useEffect, useRef, useState } from "react";
import { requiredValidator } from "../lib/validation/validation";

const useForm = (form = {}) => {
  const { defaultValue = {}, isDesktop = false, isUsername = true } = form;
  const [error, setError] = useState({});
  const [validMsg, setValidMsg] = useState({});
  const [isValid, isFormValid] = useState(form.emptyAllow || false);
  const [validTik, setValidTik] = useState(false);
  const value = useRef({});
  const focusElement = useRef({});

  const formElement = useRef({});
  //   const [error, setError] = useState("");

  // debounce
  const onBlur = useCallback(
    debounce((func, value, isValid) => {
      // console.log("Sdsadasd");
      isValid && func(value);
    }, 500),
    [] // will be created only once initially
  );

  let element = {};

  useEffect(() => {
    if (defaultValue && Object.keys(defaultValue).length > 0) {
      Object.keys(defaultValue).map((key) => {
        formElement.current[key] = true;
      });
    }
    value.current = { ...value.current, ...defaultValue };
    ValdateForm();
    // Object.values(defaultValue).length > 0 && isFormValid(true);
  }, []);

  const onChnageMethod = (elementObject) => {
    let errorObject = { ...error };
    let msgObject = { ...validMsg };
    const {
      validate = [],
      name = "",
      inputValue,
      ref,
      refErrorMessage,
    } = elementObject;

    let isError = false;
    let isExist = errorObject.hasOwnProperty(name);
    let errorMessage = "";
    for (let i = 0; i < validate.length; i++) {
      let validation = requiredValidator(inputValue, validate[i]);
      isError = validation?.error;
      errorMessage = validation?.errorMessage;
      if (isError) {
        break;
      }
    }
    ref &&
      !errorObject[ref] &&
      value.current &&
      value.current[ref] &&
      value.current[ref] != inputValue
      ? (errorObject[ref] = refErrorMessage)
      : value.current[ref] &&
      value.current[ref] == inputValue &&
      delete errorObject[ref];
    if (isError) {
      // console.log("eroror object", errorObject, errorMessage);
      if (errorObject[name] != errorMessage) {
        errorObject[name] = errorMessage;
        setError(errorObject);
        if (msgObject[name]) {
          delete msgObject[name];
          setValidMsg(msgObject);
        }
        // console.log("eroror object", errorObject);
      }

      elementObject.onBlur && onBlur(elementObject.onBlur, inputValue, false);
    } else {
      delete errorObject[name];
      setError(errorObject);
      // console.log("sadasdasd", value.current[name], inputValue);
      elementObject.onBlur && onBlur(elementObject.onBlur, inputValue, true);
    }

    setValidTik(false);
    ValdateForm(errorObject);
  };

  const ValdateForm = (errorObject = error) => {
    const validForm =
      !Object.values(focusElement.current).includes(false) &&
      Object.keys(errorObject).length == 0;

    validForm && !isValid && isFormValid(true);
    !validForm && isValid && isFormValid(false);
  };

  const setElementError = (key = "", value = "") => {
    const errorObject = { ...error };
    const msgObject = { ...validMsg };
    if (value) {
      errorObject[key] = value;
      isValid && isFormValid(false);
      delete msgObject[key];
    } else {
      delete errorObject[key];
    }
    ValdateForm(errorObject);
    setError(errorObject);
    setValidMsg(msgObject);
  };

  const setValidInputMsg = (key = "", value = "") => {
    const msgObject = { ...validMsg };
    if (value) {
      msgObject[key] = value;
    } else {
      delete msgObject[key];
    }
    setValidMsg(msgObject);
  };

  const Register = useCallback(
    (elementObject = {}) =>
      (el) => {
        el && el.name && typeof focusElement.current[el.name] == "undefined"
          ? (focusElement.current[el.name] =
            elementObject.emptyAllow || el.defaultValue ? true : false)
          : "";

        // setting default value
        el && el.name && el.defaultValue
          ? !value.current[el.name] &&
          (value.current[el.name] = el.defaultValue)
          : "";

        el
          ? (el.onkeyup = (e) => {
            // console.log("onchange elemnt", e && e.which);
            if (e && e.which == 9) {
              return;
            }

            let inputValue = e.target.value || "";

            let name = e.target.name;
            if (isDesktop && isUsername) {
              focusElement.current.userName = value.current?.userName?.length ? true : false
            }
            focusElement.current[name] = true;
            value.current[name] = inputValue;
            if (["firstName", "lastName"].includes(name) && inputValue) {
              value.current[name] = inputValue?.[0].toUpperCase() + inputValue?.slice(1)
            }

            onChnageMethod({
              ...elementObject,
              name,
              inputValue: inputValue,
            });
          })
          : "";
      },

    [error, value.current, isValid]
  );

  return [
    Register,
    value.current,
    error,
    isValid,
    setElementError,
    validTik,
    setValidTik,
    setValidInputMsg,
    validMsg,
  ];
};

export default useForm;
