import moment from "moment";
import * as Yup from "yup";

export const inValidDate = (date) => {
  // console.log("asdasdadasd", date, moment().diff(date, "years") >= 18);
  return date && moment().diff(date, "years") >= 18 ? false : true;
};

export const emailValidator = (input) => {
  let pattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;

  return pattern.test(input) ? false : true;
};

export const passwordValidator = (input) => {
  // Old Validation for Password
  // return input.length >= 4 ? false : true;

  const pass_pattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@#$-/:-?{-~!"^_`\[\]])[A-Za-z0-9@#$-/:-?{-~!"^_`\[\]]{6,}$/;

  // let pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

  return pass_pattern.test(input) ? false : true;
};

export const pinValidator = (input) => {
  return input.length == 5 ? true : false;
  // let pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

  // return pattern.test(input) ? true : false;
};
export const dateValidator = (input) => {
  var pattern = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
  return pattern.test(input) ? true : false;
};

export const websiteValidator = (input) => {
  let pattern = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

  return pattern.test(input) || input == "" ? false : true;
};

export const username = (input) => {
  if (String(input).length > 2 && String(input).length < 20) {
    return true;
  }

  return false;
};
export const require = (value) => {
  if (value == "") {
    return true;
  }
  return false;
};

export const isValidEmail = (email) => {
  let schema = Yup.string().email();
  let result = schema.isValidSync(email);
  // console.log("ASdadad", result);
  return !result;
};
export const requiredValidator = (value, validation) => {
  switch (validation.validate) {
    case "required":
      return { error: require(value), errorMessage: validation.error };
    case "email":
      return { error: isValidEmail(value), errorMessage: validation.error };
    // case "password":
    //   return {
    //     error: passwordValidator(value),
    //     errorMessage: validation.error,
    //   };
    case "userName":
      return {
        error: userNameValidator(value),
        errorMessage: validation.error,
      };
    case "link":
      return {
        error: websiteValidator(value),
        errorMessage: validation.error,
      };
    case "function":
      return validation.function && validation.function(value);
    default:
      return { error: false, errorMessage: "default" };
  }
};

export const TextValidator = (event) => {
  var keyCode = event.keyCode ? event.keyCode : event.which;
  if (
    !(
      (keyCode >= 65 && keyCode <= 90) ||
      (keyCode >= 97 && keyCode <= 122) ||
      keyCode === 32 ||
      keyCode === 8
    )
  ) {
    return false;
  } else {
    return true;
  }
};

export const TextWithNumberValidator = (event) => {
  var keyCode = event.charCode ? event.charCode : event.which;

  let keyValue = [...event.target.value];
  let string = keyValue[keyValue.length - 1];

  if (
    !(
      (keyCode >= 96 && keyCode <= 105) ||
      (keyCode >= 65 && keyCode <= 90) ||
      (keyCode >= 48 && keyCode <= 57) ||
      (keyCode >= 97 && keyCode <= 122) ||
      keyCode === 8
    )
  ) {
    return false;
  } else {
    return true;
  }
};

export const PureTextValidator = (event) => {
  var keyCode = event.keyCode ? event.keyCode : event.which;

  if (
    !(
      (keyCode >= 97 && keyCode <= 122) ||
      (keyCode >= 65 && keyCode <= 90) ||
      keyCode === 32 ||
      keyCode === 8
    )
  ) {
    return false;
  } else {
    return true;
  }
};

export const NumberValidator = (event) => {
  let keyCode = event.charCode ? event.charCode : event.which;
  // console.log("djwod", event);
  if (!(keyCode >= 48 && keyCode <= 57)) {
    event.preventDefault();
    return false;
  } else {
    return true;
  }
};

export const ValidatePhoneNumber = (controlId) => {
  let phoneInput = document.getElementById(controlId);
  phoneInput
    ? phoneInput.addEventListener("keypress", (event) => {
      let keyCode = event.keyCode;
      if (!(keyCode >= 48 && keyCode <= 57)) {
        event.preventDefault();
      }
    })
    : "";
};

export const ValidateTwoDecimalNumber = (input) => {
  const pattern = /^(?:\d*\.\d{1,2}|\d+)$/;
  return pattern.test(input) ? true : false;
};

export const userNameValidator = (input) => {
  return !/^[A-Za-z._0-9]{1,}$/.test(input);
};