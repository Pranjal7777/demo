import { useFormik } from 'formik'
import React, { useEffect, useRef, useState } from 'react'
import useLang from '../../../hooks/language';
import { getCognitoToken } from '../../../services/userCognitoAWS';
import { FOLDER_NAME_IMAGES, test_defaultCountry } from '../../../lib/config/creds';
import { DevicePayload, VerifyEmail } from '../../../lib/data-modeling';
import { getAgencyDetails, getTaxDetail, registerAgency, updateAgencyProfile } from '../../../services/agency';
import { Toast, open_dialog, startLoader, stopLoader } from '../../../lib/global/loader';
import { greaterThanSixDigit, lowercaseCharacter, numericValue, specialCharacter, uppercaseCharacter, validatePasswordField } from '../../../lib/global/password';
import { getCityStateLatLongWithZipCode } from '../../../lib/url/fetchCityState';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { getCookie, setCookie } from '../../../lib/session';
import { getAgencyData, getOwnerData } from '../../../redux/actions/agency';
import { getProfile } from '../../../services/profile';
import { ParseToken } from '../../../lib/parsers/token-parser';
import { phoneNumber, updateEmail, updateProfile, validateEmail } from '../../../services/auth';

const useAgencyRegistration = () => {
  // const profileData = useSelector((state) => state?.agencyProfile);
  const [lang] = useLang();
  const [phoneInput, setPhoneInput] = useState({});
  const [agencyPhoneInput, setAgencyPhoneInput] = useState({});
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [agencyphone, setAgencyPhone] = useState();
  const [phone, setPhone] = useState();
  const [pic, setPic] = useState({});
  const [passwordValidationScreen, setPassvalidScreen] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [taxField, setTaxField] = useState();
  const [sameAddress, setSameAddress] = useState(false)
  const [imgUrl, setImgUrl] = useState();
  const router = useRouter()
  const dispatch = useDispatch();
  const uid = getCookie("uid");
  const token = getCookie("token");
  const profileData = useSelector((state) => state?.agencyProfile)
  const ownerData = useSelector((state) => state?.ownerData)
  const [employeeData, setEmployeeData] = useState()
  const phoneRef = useRef({})
  const [billingAddress, setBillingAddress] = useState({
    line1: "",
    address: "",
    zipCode: "",
    city: "",
    state: "",
    country: "",
    lat: "",
    long: "",
    area: ""
  });
  const [physicalAddress, setPhysicalAddress] = useState({
    line1: "",
    address: "",
    zipCode: "",
    city: "",
    state: "",
    country: "",
    lat: "",
    long: "",
    area: ""
  });
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
  useEffect(() => {
    if (profileData) {
      formik.setFieldValue("agencyBrandName", profileData.agencyBrandName)
      formik.setFieldValue("agencyLegalName", profileData.agencyLegalName)
      formik.setFieldValue("agencyEmail", profileData.agencyEmail)
      formik.setFieldValue("aboutAgency", profileData.aboutAgency)
      formik.setFieldValue("standardCommission", profileData.standardCommission)
      formik.setFieldValue("website", profileData.website)
      formik.setFieldValue("noOfCreators", profileData.noOfCreators)
      formik.setFieldValue("yearInBusiness", profileData.yearInBusiness)
      formik.setFieldValue("yearInBusiness", profileData.yearInBusiness)
      formik.setFieldValue("socialMediaLink.Twitter", profileData.socialMediaLink?.Twitter)
      formik.setFieldValue("socialMediaLink.Instagram", profileData.socialMediaLink?.Instagram)
      formik.setFieldValue("socialMediaLink.Facebook", profileData.socialMediaLink?.Facebook)
      formik.setFieldValue("taxInformation.value", profileData.taxInformation?.value)
      formik.setFieldValue("taxInformation.fieldName", profileData.taxInformation?.fieldName)
      formik.setFieldValue("agencyCountryCode", profileData?.agencyCountryCode)
      formik.setFieldValue("agencyPhoneNumber", profileData?.agencyPhoneNumber)
      setPic(profileData.logo)
      setAgencyPhoneInput((prev) => ({
        ...prev,
        phoneNo: profileData?.agencyPhoneNumber,
        countryCode: profileData?.agencyCountryCode
      }))
      setBillingAddress((prev) => ({
        ...prev,
        line1: profileData.billingAddress?.addressLine1 || "",
        area: profileData.billingAddress?.address || "",
        address: profileData.billingAddress?.address || "",
        zipCode: profileData.billingAddress?.zipCode || "",
        city: profileData.billingAddress?.city || "",
        state: profileData.billingAddress?.state || "",
        country: profileData.billingAddress?.country || "",
        lat: profileData.billingAddress?.lat || 13.14,
        long: profileData.billingAddress?.long || 13.14
      }))
      setPhysicalAddress((prev) => ({
        ...prev,
        line1: profileData.physicalAddress?.addressLine1 || "",
        area: profileData.physicalAddress?.address || "",
        address: profileData.physicalAddress?.address || "",
        zipCode: profileData.physicalAddress?.zipCode || "",
        city: profileData.physicalAddress?.city || "",
        state: profileData.physicalAddress?.state || "",
        country: profileData.physicalAddress?.country || "",
        lat: profileData.physicalAddress?.lat || 13.14,
        long: profileData.physicalAddress?.long || 13.14
      }))
    } if (ownerData) {
      formik.setFieldValue("firstName", ownerData?.firstName)
      formik.setFieldValue("lastName", ownerData?.lastName)
      formik.setFieldValue("email", ownerData?.email)
      formik.setFieldValue("countryCode", ownerData?.countryCode)
      formik.setFieldValue("phoneNumber", ownerData?.phoneNumber)
      setPhoneInput((prev) => ({
        ...prev,
        phoneNo: ownerData?.phoneNumber,
        countryCode: ownerData?.countryCode
      }))
      setPic(ownerData.profilePic)
    }
  }, [profileData, ownerData])
  const formik = useFormik({
    initialValues: {
      agencyBrandName: "",
      agencyLegalName: "",
      countryCodeName: "",
      agencyEmail: "",
      agencyPhoneNumber: "",
      agencyCountryCode: "",
      logo: "",
      aboutAgency: "",
      standardCommission: null,
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      countryCode: "",
      password: "",
      taxInformation: {
        fieldName: taxField?.fieldName,
        value: ""
      },
      website: "",
      socialMediaLink: {
        Twitter: "",
        Instagram: "",
        Facebook: ""
      },
      yearInBusiness: null,
      noOfCreators: null
    },
    validate: values => {
      const errors = {};
      if (!values.agencyLegalName) errors.agencyLegalName = lang.required
      if (!values.agencyBrandName) errors.agencyBrandName = lang.required
      if (!values.agencyEmail) {
        errors.agencyEmail = lang.required
      }
      else if ((!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.agencyEmail))) {
        errors.agencyEmail = "Invalid Email Format";
      }
      if (!values.website) {
        errors.website = lang.required
      }
      if (!values.noOfCreators) errors.noOfCreators = lang.required
      if (!values.yearInBusiness) errors.yearInBusiness = lang.required
      if (!values.firstName) errors.firstName = lang.required
      if (!values.lastName) errors.lastName = lang.required

      if (!values.email) {
        errors.email = lang.required
      }
      else if ((!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))) {
        errors.email = "Invalid Email Format";
      }
      if (!values.standardCommission) {
        errors.standardCommission = lang.required;
      }
      if (!values.taxInformation || !values.taxInformation.value) {
        errors.taxInformation = {};
        errors.taxInformation.value = lang.required;
      }
      if (Object.keys(errors).length) {
        setIsValid(false)
      } else {
        setIsValid(true)
      }
      return errors;
    },
    onsubmit: values => {
      registerAgencyHandler()
    }

  })

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
  const ValidatePassword = () => {
    try {
      const response = validatePasswordField(formik.values.password);
      response ? setIsPasswordValid(true) : setIsPasswordValid(false);
    } catch (e) {
      console.error("ERROR IN ValidatePassword", e);
      setIsPasswordValid(false);
    }
  };
  useEffect(() => {
    ValidatePassword();
    ValidateSixDigitsInPassword();
    ValidateNumeralInPassword();
    ValidateSpecialCharacterInPassword();
    ValidateUppercaseCharacterInPassword();
  }, [formik.values.password]);

  const blockInvalid = (e) => {
    if (e.keyCode === 38 || e.keyCode === 40) {
      e.preventDefault(); // Prevent the default behavior of increasing or decreasing the number
    }
  }
  const registerAgencyHandler = async () => {
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
    let payload = { ...formik.values, ...DevicePayload, billingAddress, physicalAddress }
    payload.logo = url;
    payload.agencyPhoneNumber = agencyPhoneInput.phoneNo?.toString();
    payload.agencyCountryCode = agencyPhoneInput.countryCode
    payload.phoneNumber = phoneInput.phoneNo?.toString();
    payload.countryCode = phoneInput.countryCode
    payload.countryCodeName = agencyPhoneInput?.agencyPhoneInput?.toUpperCase() || test_defaultCountry;
    payload.billingAddress.line1 = billingAddress.address
    payload.billingAddress.area = billingAddress.address
    payload.physicalAddress.line1 = physicalAddress.address
    payload.physicalAddress.area = physicalAddress.address
    payload.taxInformation.fieldName = taxField?.fieldName
    registerAgency(payload)
      .then((res) => {
        let response = res;
        if (response.status === 200) {
          Toast("Created")
          router.push('/agencyLogin')
          open_dialog("profileSubmitted", {
            isAgency: true
          });
        }
      })
      .catch((e) => {
        // stopLoader();
        console.error("update error", e);
        Toast(e?.response?.data?.message, "error");
      })
  }
  const updateAgProfile = async () => {
    const fileUploaderAWS = (await import('../../../lib/UploadAWS/uploadAWS')).default
    const imgFileName = `${Date.now()}_${formik.values.firstName?.toLowerCase()}`;
    const folderName = `users/${FOLDER_NAME_IMAGES.profile}`;
    let payload = { ...formik.values, billingAddress, physicalAddress }
    if (pic.file) {
      const cognitoToken = await getCognitoToken();
      const tokenData = cognitoToken?.data?.data;
      let url = await fileUploaderAWS(
        pic.file[0],
        tokenData,
        imgFileName,
        false,
        folderName,
        null, null, null, false
      );
      payload.logo = url;
    } else {
      payload.logo = pic
    }

    payload.agencyPhoneNumber = agencyPhoneInput.phoneNo?.toString();
    payload.agencyCountryCode = agencyPhoneInput.countryCode
    payload.phoneNumber = phoneInput.phoneNo?.toString();
    payload.countryCode = phoneInput.countryCode
    payload.countryCodeName = test_defaultCountry;
    payload.billingAddress.line1 = billingAddress.address
    payload.billingAddress.area = billingAddress.address
    payload.physicalAddress.line1 = physicalAddress.address
    payload.physicalAddress.area = physicalAddress.address
    payload.taxInformation.fieldName = taxField?.fieldName
    delete payload.password
    delete payload.countryCode
    delete payload.phoneNumber
    delete payload.email
    delete payload.lastName
    delete payload.firstName
    startLoader();
    updateAgencyProfile(payload)
      .then((res) => {
        let response = res;
        if (response.status === 200) {
          Toast("Updated Sucessfully")
          handleGetAgency();
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
    if (sameAddress) {
      setPhysicalAddress((prev) => ({
        ...prev,
        line1: billingAddress?.addressLine1 || "",
        area: billingAddress?.address || "",
        address: billingAddress?.address || "",
        zipCode: billingAddress?.zipCode || "",
        city: billingAddress?.city || "",
        state: billingAddress?.state || "",
        country: billingAddress?.country || "",
        lat: billingAddress?.lat || 13.14,
        long: billingAddress?.long || 13.14
      }))
    }
  }, [sameAddress, billingAddress])

  const taxDetailhandler = async () => {
    let countryCode = agencyPhoneInput?.iso2?.toUpperCase() || test_defaultCountry;
    try {
      let response = await getTaxDetail(countryCode);
      if (response && response.data) {
        setTaxField(response && response.data && response.data.data);
      }
    } catch (e) {
      Toast(e?.response?.message, "error");
    }
  };

  useEffect(() => {
    if (Object.keys(agencyPhoneInput).length) {
      taxDetailhandler();
    }
  }, [agencyPhoneInput])


  const changeBillingAddress = async (e, field) => {
    let { name, value } = e.target;
    if (name == "zipCode") {
      setBillingAddress((prev) => ({ ...prev, [name]: value.toUpperCase() }));
    } else {
      setBillingAddress((prev) => ({ ...prev, [name]: value }))
    }
    if (field === "zipCode" && name === 'zipCode') {
      const cityStateObj = await getCityStateLatLongWithZipCode(value);
      const addressComponents = cityStateObj?.address_components;
      let city = '';
      if (addressComponents) {
        for (const component of addressComponents) {
          if (component.types.includes('locality')) {
            city = component.long_name;
            break;
          }
        }
      }

      if (cityStateObj) {
        setBillingAddress((prev) => ({ ...prev, 'city': city || cityStateObj?.postcode_localities[0] }))
        setBillingAddress((prev) => ({ ...prev, 'state': cityStateObj?.address_components.find(state => state?.types[0] === "administrative_area_level_1")?.long_name }))
        setBillingAddress((prev) => ({ ...prev, 'country': cityStateObj?.address_components.find(country => country?.types[0] === "country")?.long_name }))
        setBillingAddress((prev) => ({ ...prev, 'lat': cityStateObj?.geometry.location?.lat || 13.14 }))
        setBillingAddress((prev) => ({ ...prev, 'long': cityStateObj?.geometry.location?.lng || 13.14 }))
      } else {
        setBillingAddress((prev) => ({
          ...prev,
          city: "",
          state: "",
          country: "",
        }))
      }
    }
  };
  const changePhysicalAddress = async (e, field) => {
    let { name, value } = e.target;
    if (name == "zipCode") {
      setPhysicalAddress((prev) => ({ ...prev, [name]: value.toUpperCase() }));
    } else {
      setPhysicalAddress((prev) => ({ ...prev, [name]: value }))
    }
    if (field === "zipCode" && name === 'zipCode') {
      const cityStateObj = await getCityStateLatLongWithZipCode(value);
      if (cityStateObj) {
        setPhysicalAddress((prev) => ({ ...prev, 'city': cityStateObj?.postcode_localities?.[2] || cityStateObj?.address_components.find(city => city?.types[0] === "locality" || city.types[0] === "political")?.long_name }))
        setPhysicalAddress((prev) => ({ ...prev, 'state': cityStateObj?.address_components.find(state => state?.types[0] === "administrative_area_level_1")?.long_name }))
        setPhysicalAddress((prev) => ({ ...prev, 'country': cityStateObj?.address_components.find(country => country?.types[0] === "country")?.long_name }))
        setPhysicalAddress((prev) => ({ ...prev, 'lat': cityStateObj?.geometry.location?.lat || 13.14 }))
        setPhysicalAddress((prev) => ({ ...prev, 'long': cityStateObj?.geometry.location?.lng || 13.14 }))
      } else {
        setPhysicalAddress((prev) => ({
          ...prev,
          city: "",
          state: "",
          country: "",
        }))
      }
    }
  };
  const onProfileImageChange = async (file, url) => {
    setPic({
      file,
      url,
    });
  };
  const handleGetAgency = async () => {
    try {
      let response = await getAgencyDetails();
      if (response.status === 200) {
        dispatch(getAgencyData(response.data.data))
        setCookie("agencyId", response.data.data._id)
      }
    } catch (e) {
      Toast(e.response.message, "error");
    }
  };

  const fecthProfileDetails = async () => {
    const res = await getProfile(uid, ParseToken(token));
    if (res.status === 200) {
      dispatch(getOwnerData(res.data.data))
      setEmployeeData(res.data.data);
    }
  };
  const validateEmailAddress = async () => {
    return new Promise(async (res, rej) => {
      try {
        VerifyEmail.email = formik.values.email;
        VerifyEmail.type = 2;
        // VerifyEmail.userType = getCookie("userType");

        const response = await validateEmail(VerifyEmail);
        res();
      } catch (e) {
        stopLoader();
        // console.log("ASdsadd", e);
        Toast("email", e.response.data.message);
        rej();
      }
    });
  };
  const updateEmailAddress = async (e) => {
    e && e.preventDefault();
    // check email validation whiile submit
    startLoader();
    try {
      await validateEmailAddress();
    } catch (e) {
      return;
    }

    // setStap(value);
    updateEmail({
      newEmail: formik.values.email,
    })
      .then((data) => {
        stopLoader();
        Toast(lang.checkEmail);
      })
      .catch((e) => {
        stopLoader();
        e.response && Toast(e.response.data.message, "error");
      });
  };

  const updatePhone = async () => {
    let payload = {
      countryCode: phoneInput.countryCode,
      phoneNumber: phoneInput.phoneNo?.toString()
    }
    try {
      await phoneNumber(payload)
    } catch (e) {
      return;
    }
  }

  const updateOwnerProfile = async () => {
    let payload = {
      firstName: formik.values.firstName,
      lastName: formik.values.lastName,
    }
    const fileUploaderAWS = (await import('../../../lib/UploadAWS/uploadAWS')).default
    const imgFileName = `${Date.now()}_${formik.values.firstName?.toLowerCase()}`;
    const folderName = `users/${FOLDER_NAME_IMAGES.profile}`;
    if (pic.file) {
      const cognitoToken = await getCognitoToken();
      const tokenData = cognitoToken?.data?.data;
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
    if (formik.values.email !== employeeData.email) {
      try {
        await updateEmailAddress();
      } catch (e) {
        return;
      }
    }
    if (formik.values?.phoneNumber !== phoneInput.phoneNo || formik.values.countryCode !== phoneInput.countryCode) {
      try {
        await updatePhone();
      } catch (e) {
        Toast(e?.response?.data?.message, "error");
        return;
      }
    }
    try {
      let res = await updateProfile(payload)
      if (res.status === 200) {
        handleGetAgency();
        fecthProfileDetails();
        Toast(res?.data?.message)
      }
    } catch (e) {
      Toast(e?.response?.data?.message, "error");
      return;
    }
  }
  return (
    {
      formik,
      lang,
      isPasswordValid,
      passwordValidationScreen,
      phone,
      pic,
      isPhoneValid,
      phoneInput,
      agencyphone,
      agencyPhoneInput,
      passwordCheck,
      billingAddress,
      physicalAddress,
      taxField,
      sameAddress,
      isValid,
      imgUrl,
      phoneRef,
      employeeData,
      fecthProfileDetails,
      handleGetAgency,
      setIsPasswordValid,
      setIsPhoneValid,
      setPassvalidScreen,
      setPhone,
      setPic,
      setIsValid,
      setPhoneInput,
      setAgencyPhone,
      setAgencyPhoneInput,
      registerAgencyHandler,
      setPasswordCheck,
      setBillingAddress,
      setPhysicalAddress,
      changeBillingAddress,
      changePhysicalAddress,
      setSameAddress,
      blockInvalid,
      onProfileImageChange,
      updateAgProfile,
      updateOwnerProfile,
      updateEmailAddress
    }
  )
}

export default useAgencyRegistration