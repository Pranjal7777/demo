import React, { useEffect, useRef, useState } from 'react'
import { greaterThanSixDigit, lowercaseCharacter, numericValue, specialCharacter, stopLoader, uppercaseCharacter } from '../../../lib/global';
import { useFormik } from 'formik';
import { ValidatePhoneNoPayload, VerifyEmail } from '../../../lib/data-modeling';
import { ValidatePhoneNumber } from '../../../lib/validation/validation';
import { getCognitoToken } from '../../../services/userCognitoAWS'
import { addEmployee, updateEmployee } from '../../../services/agency';
import { getProfile, validateEmail } from '../../../services/auth';
import { validatePasswordField } from '../../../lib/global/password';
import useLang from '../../../hooks/language';
import { getCookie } from '../../../lib/session';
import { FOLDER_NAME_IMAGES, test_defaultCountry } from '../../../lib/config/creds';
import { Toast, startLoader } from '../../../lib/global/loader';
import { useRouter } from 'next/router';
import { ParseToken } from '../../../lib/parsers/token-parser';
import { getEmployeeData } from '../../../redux/actions/agency';
import { useDispatch, useSelector } from 'react-redux';

const useAddEmployee = () => {
  const [pic, setPic] = useState({});
  const [phoneError, setPhoneError] = useState()
  const [emailError, setEmailerror] = useState();
  const [phoneInput, setPhoneInput] = useState({});
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [phone, setPhone] = useState();
  const [passwordValidationScreen, setPassvalidScreen] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const phoneRef = useRef({});
  const [lang] = useLang();
  const router = useRouter();
  const dispatch = useDispatch();
  let uid = getCookie("uid");
  let token = getCookie("token");
  const [isValid, setIsValid] = useState(false);
  const employeeData = useSelector((state) => state?.employeeData)

  const [passwordCheck, setPasswordCheck] = useState({
    six_digits: {
      id: 1,
      str: lang.passSixDigits,
      state: false,
    },
    a_numeric: {
      id: 2,
      str: lang.passNumeral,
      state: false,
    },
    uppercase: {
      id: 3,
      str: lang.passUpper,
      state: false,
    },
    special_char: {
      id: 4,
      str: lang.passSpecialChar,
      state: false,
    },
  });
  const onProfileImageChange = async (file, url) => {
    setPic({
      file,
      url,
    });
  };

  const ValidateSixDigitsInPassword = () => {
    try {
      const response = greaterThanSixDigit(formik.values.password);

      if (response) {
        return setPasswordCheck((prev) => ({
          ...prev,
          six_digits: {
            ...prev.six_digits,
            state: true,
          },
        }));
      }

      setPasswordCheck((prev) => ({
        ...prev,
        six_digits: {
          ...prev.six_digits,
          state: false,
        },
      }));
    } catch (e) {
      console.error("ERROR IN ValidateSixDigitsInPassword", e);
      setPasswordCheck((prev) => ({
        ...prev,
        six_digits: {
          ...prev.six_digits,
          state: false,
        },
      }));
    }
  };

  const ValidateNumeralInPassword = () => {
    try {
      const response = numericValue(formik.values.password);
      if (response) {
        return setPasswordCheck((prev) => ({
          ...prev,
          a_numeric: {
            ...prev.a_numeric,
            state: true,
          },
        }));
      }

      setPasswordCheck((prev) => ({
        ...prev,
        a_numeric: {
          ...prev.a_numeric,
          state: false,
        },
      }));
    } catch (e) {
      console.error("ERROR IN ValidateNumeralInPassword", e);
      setPasswordCheck((prev) => ({
        ...prev,
        a_numeric: {
          ...prev.a_numeric,
          state: false,
        },
      }));
    }
  };

  const ValidateSpecialCharacterInPassword = () => {
    try {
      const response = specialCharacter(formik.values.password);
      if (response) {
        return setPasswordCheck((prev) => ({
          ...prev,
          special_char: {
            ...prev.special_char,
            state: true,
          },
        }));
      }

      setPasswordCheck((prev) => ({
        ...prev,
        special_char: {
          ...prev.special_char,
          state: false,
        },
      }));
    } catch (e) {
      console.error("ERROR IN ValidateSpecialCharacterInPassword", e);
      setPasswordCheck((prev) => ({
        ...prev,
        special_char: {
          ...prev.special_char,
          state: false,
        },
      }));
    }
  };

  const ValidateUppercaseCharacterInPassword = () => {
    try {
      const response1 = uppercaseCharacter(formik.values.password);
      const response2 = lowercaseCharacter(formik.values.password);
      if (response1 && response2) {
        return setPasswordCheck((prev) => ({
          ...prev,
          uppercase: {
            ...prev.uppercase,
            state: true,
          },
        }));
      }

      setPasswordCheck((prev) => ({
        ...prev,
        uppercase: {
          ...prev.uppercase,
          state: false,
        },
      }));
    } catch (e) {
      console.error("ERROR IN ValidateUppercaseCharacterInPassword", e);
      setPasswordCheck((prev) => ({
        ...prev,
        uppercase: {
          ...prev.uppercase,
          state: false,
        },
      }));
    }
  };
  useEffect(() => {
    if (employeeData) {
      formik.setFieldValue("firstName", employeeData.firstName)
      formik.setFieldValue("lastName", employeeData.lastName)
      formik.setFieldValue("email", employeeData.email)
      formik.setFieldValue("aboutAgency", employeeData.aboutAgency)
      formik.setFieldValue("countryCode", employeeData.countryCode)
      formik.setFieldValue("phoneNumber", employeeData.phoneNumber)
      setPic(employeeData.profilePic)
      setPhoneInput((prev) => ({
        ...prev,
        phoneNo: employeeData.phoneNumber,
        countryCode: employeeData.countryCode
      }))
    }
  }, [employeeData])
  const formik = useFormik({
    validateOnMount: true,
    initialValues: {
      agencyId: uid,
      firstName: "",
      lastName: "",
      email: "",
      countryCode: test_defaultCountry,
      phoneNumber: "",
      profilePic: "",
      password: "",
    },
    validate: values => {
      const errors = {};

      if (!values.firstName)
        errors.firstName = "Required"
      if (!values.lastName)
        errors.lastName = "Required"
      if (!values.email) {
        errors.email = "Required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        errors.email = "Invalid Email Format";
      }
      if (Object.keys(errors).length) {
        setIsValid(false)
      } else {
        setIsValid(true)
      }
      return errors;
    },
    onSubmit: values => {
      addEmployeeHandler();
    }
  });
  const validatePhoneNo = () => {
    return new Promise(async (res, rej) => {
      try {
        ValidatePhoneNoPayload.phoneNumber = phoneInput.phoneNo.toString();;
        ValidatePhoneNoPayload.countryCode = phoneInput.countryCode;

        // API CALL
        const response = await ValidatePhoneNumber(ValidatePhoneNoPayload);

        response.status === 200
        res();
        setPhoneError()
      } catch (e) {
        setPhoneError(e?.response?.data?.message);
        // setElementError("phoneNumbere", e?.response?.data?.message);
        console.error(e?.response?.data?.message);
      }
    });
  };

  const addEmployeeHandler = async () => {
    const fileUploaderAWS = (await import('../../../lib/UploadAWS/uploadAWS')).default
    const cognitoToken = await getCognitoToken();
    const tokenData = cognitoToken?.data?.data;
    const imgFileName = `${Date.now()}_${formik.values.firstName?.toLowerCase()}`;
    const folderName = `users/${FOLDER_NAME_IMAGES.profile}`;
    const url = await fileUploaderAWS(
      pic.file[0],
      tokenData,
      imgFileName,
      false,
      folderName,
      null, null, null, false
    );
    let payload = formik.values
    payload.profilePic = url;
    payload.phoneNumber = phoneInput.phoneNo.toString();
    payload.countryCode = phoneInput.countryCode
    addEmployee(payload)
      .then((res) => {
        let response = res;
        if (response.status === 200) {
          Toast("Created")
          router.push('/agencyEmployee')
        }
      })
      .catch((e) => {
        // stopLoader();
        console.error("update error", e);
        Toast(e?.response?.data?.message, "error");
      })
  }
  const validateEmailAddress = async () => {
    return new Promise(async (res, rej) => {
      VerifyEmail.email = formik.values.email;
      VerifyEmail.type = 2;

      try {
        const res = await validateEmail(VerifyEmail);
        if (res.status === 200) {
        }
      } catch (err) {
        setEmailerror(err?.response?.data.message);
        console.error(err);
      }
    })
  }

  const ValidatePassword = () => {
    try {
      const response = validatePasswordField(formik.values.password);
      response ? setIsPasswordValid(true) : setIsPasswordValid(false);
    } catch (e) {
      console.error("ERROR IN ValidatePassword", e);
      setIsPasswordValid(false);
    }
  };
  const fecthProfileDetails = async (uid) => {
    const res = await getProfile(uid, ParseToken(token), getCookie('selectedCreatorId'));
    if (res.status === 200) {
      dispatch(getEmployeeData(res.data.data))
    }
  };
  const updateEmployeeData = async () => {
    const fileUploaderAWS = (await import('../../../lib/UploadAWS/uploadAWS')).default
    let payload = {
      agencyUserId: router.query.id,
      profilePic: "",
      phoneNumber: "",
      countryCode: "",
      email: formik.values.email,
      lastName: formik.values.lastName,
      firstName: formik.values.firstName,
    }
    delete payload.email
    if (pic.file) {
      const cognitoToken = await getCognitoToken();
      const tokenData = cognitoToken?.data?.data;
      const imgFileName = `${Date.now()}_${formik.values.firstName?.toLowerCase()}`;
      const folderName = `users/${FOLDER_NAME_IMAGES.profile}`;
      let url = await fileUploaderAWS(
        pic.file[0],
        tokenData,
        imgFileName,
        false,
        folderName,
        null, null, null, false
      );
      payload.profilePic = url;
    } else {
      payload.profilePic = pic
    }
    if (phoneInput.phoneNo !== employeeData.phoneNumber || phoneInput.countryCode !== employeeData.countryCode) {
      payload.phoneNumber = phoneInput.phoneNo;
      payload.countryCode = phoneInput.countryCode;
    } else {
      delete payload.phoneNumber
      delete payload.countryCode
    }
    updateEmployee(payload)
      .then((res) => {
        startLoader()
        let response = res;
        if (response.status == 200) {
          router.push('/agencyEmployee')
          Toast("Updated Sucessfully")
        }
        stopLoader()
      })
      .catch((e) => {
        // stopLoader();
        console.error("update error", e);
        Toast(e?.response?.data?.message, "error");
        stopLoader();
      })
  }
  useEffect(() => {
    ValidatePassword();
    ValidateSixDigitsInPassword();
    ValidateNumeralInPassword();
    ValidateSpecialCharacterInPassword();
    ValidateUppercaseCharacterInPassword();
  }, [formik.values.password]);
  return (
    {
      formik,
      pic,
      uid,
      lang,
      phoneRef,
      phone,
      isPhoneValid,
      isPasswordValid,
      phoneInput,
      passwordValidationScreen,
      passwordCheck,
      isValid,
      setPic,
      setPasswordCheck,
      setPassvalidScreen,
      addEmployeeHandler,
      validateEmailAddress,
      setPhone,
      setPhoneInput,
      validatePhoneNo,
      onProfileImageChange,
      fecthProfileDetails,
      updateEmployeeData
    }
  )
}

export default useAddEmployee