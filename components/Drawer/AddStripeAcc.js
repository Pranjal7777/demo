import React, { useEffect, useState } from "react";
import Select from 'react-select'
import moment from "moment";
import dynamic from "next/dynamic";
import { useTheme } from "react-jss";
import { useSelector } from "react-redux";

import { connectAccount, getConnectAccount, getPgCountryAPI } from "../../services/payments";
// import { countries } from "../../lib/CountriesList";
import useProfileData from "../../hooks/useProfileData";
import InputField from "../../containers/profile/edit-profile/label-input-field";
import useLang from "../../hooks/language";
import DatePicker from "../formControl/datePicker";
import { getCurrentAge } from "../../lib/date-operation/date-operation";
import { getCognitoToken } from "../../services/userCognitoAWS";
import fileUploaderAWS from "../../lib/UploadAWS/uploadAWS";
import { getCookie, setCookie } from "../../lib/session";
import * as env from "../../lib/config";
import { requiredValidator } from "../../lib/validation/validation";
import isMobile from "../../hooks/isMobile";
import Wrapper from "../../hoc/Wrapper";
import {
  getMyIP,
  startLoader,
  stopLoader,
  Toast,
} from "../../lib/global";
import { getCityStateWithZipCode } from "../../lib/url/fetchCityState";
import Icon from "../image/icon";
import usePg from "../../hooks/usePag";
import PhoneNoInput from "../formControl/phoneNoInput";
import useLocation from "../../hooks/location-hooks";

const Header = dynamic(() => import("../header/header"), { ssr: false });
const ImagePicker = dynamic(() => import("../formControl/imagePicker"), { ssr: false });
const Image = dynamic(() => import("../image/image"), { ssr: false });
const Img = dynamic(() => import("../ui/Img/Img"), { ssr: false });
const Button = dynamic(() => import("../button/button"), { ssr: false });

export default function AddStripeAcc(props) {
  const theme = useTheme();
  const [lang] = useLang();
  const [mobileView] = isMobile();
  const [profile] = useProfileData();
  const [pg] = usePg();


  // const countryList = [...countries];
  const { onClose, getStripe, getStripeAccount, getStripeAccounts } = props;

  const APP_IMG_LINK = useSelector((state) => state?.appConfig?.baseUrl);

  const formData = {
    first_name: {
      type: "text",
      inputType: "text",
      name: "first_name",
      placeholder: lang.firstNamePlaceholder,
      label: `${lang.firstNamePlaceholder}*`,
      value: "",
      errorr: false,
      validate: [{
        validate: "required",
        error: "Name Required",
      }],
    },
    last_name: {
      type: "text",
      inputType: "text",
      name: "last_name",
      placeholder: lang.lastNamePlaceholder,
      label: `${lang.lastNamePlaceholder}*`,
      value: "",
      errorr: false,
      validate: [{
        validate: "required",
        error: "Last Name Required",
      }],
    },
    document: {
      type: "text",
      inputType: "text",
      name: "document",
      placeholder: lang.documentLabel,
      label: `${lang.documentPlaceholder}*`,
      value: "",
      errorr: false,
    },
    ssn: {
      type: "number",
      inputType: "number",
      name: "ssn",
      placeholder: mobileView ? lang.ssnPlaceholder : lang.ssnLabel,
      label: `${lang.ssnLabel}*`,
      value: "",
      max: 9,
      errorr: false,
      validate: [{
        validate: "required",
        error: lang.ssnError,
      }, {
        validate: "function",
        function: (value) => {
          if (value.length != 9) {
            return {
              error: true,
              errorMessage: lang.ssnError,
            };
          } else {
            return {
              error: false,
              errorMessage: "",
            };
          }
        },
      }],
    },
    address: {
      type: "text",
      inputType: "text",
      name: "address",
      placeholder: lang.addressPlaceholder,
      label: `${lang.addressPlaceholder}*`,
      value: "",
      errorr: false,
      validate: [{
        validate: "required",
        error: "Address Required",
      }],
    },
    city: {
      type: "text",
      inputType: "text",
      placeholder: lang.cityPlaceholder,
      name: "city",
      label: `${lang.cityPlaceholder}*`,
      value: "",
      errorr: false,
      // validate: [{
      //   validate: "required",
      //   error: "City Required",
      // }],
    },
    state: {
      type: "text",
      inputType: "text",
      name: "state",
      placeholder: lang.statePlaceholder,
      label: `${lang.statePlaceholder}*`,
      value: "",
      errorr: false,
      // validate: [{
      //   validate: "required",
      //   error: "State Required",
      // }],
    },
    zipcode: {
      type: "text",
      inputType: "text",
      name: "zipcode",
      placeholder: lang.zipcodePlaceholder,
      label: `${lang.zipcodePlaceholder}*`,
      value: "",
      errorr: false,
      validate: [{
        validate: "required",
        error: "Zipcode Required",
      }],
    },
    country: {
      type: "text",
      inputType: "text",
      name: "country",
      label: `${lang.countryPlaceholder}*`,
      value: "",
      errorr: false,
      placeholder: `${lang.countryPlaceholder} (US)`,
      maxLength: "2",
      // validate: [{
      //   validate: "required",
      //   error: "Country Required",
      // }],
    },
    phone: {
      type: "number",
      inputType: "number",
      inputMode: "numeric",
      name: "phone",
      placeholder: lang.enterPhoneNum,
      label: `${lang.phoneNo}*`,
      value: "",
      errorr: false,
      // validate: [{
      //   validate: "required",
      //   error: "Please Enter Phone Number",
      // }],
    },
  };

  const [isValidate, setValidate] = useState(true);
  const [form, setForm] = useState(formData);
  const [date, setDate] = useState();
  const [file, setFile] = useState({});
  const [stripeCountryCode, setStripecountryCode] = useState({
    label: "United States",
    value: "US"
  });
  const [countries, setCountries] = useState([]);
  const [location] = useLocation();
  const addBankAccount = true;
  const [currency, setCurrency] = useState();
  const [currencyCode, setCurrencyCode] = useState();
  const [phoneInput, setPhoneInput] = useState({});
  const [allCountries, setAllCountries] = useState()
  const zipVal = stripeCountryCode.value === form.country.value

  const setCustomVhToBody = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vhCustom', `${vh}px`);
  };

  useEffect(() => {
    getCountryList();
  }, [])

  useEffect(() => {
    setCustomVhToBody();
    window.addEventListener('resize', setCustomVhToBody);

    return () => {
      window.removeEventListener('resize', setCustomVhToBody);
    };
  }, [stripeCountryCode]);

  const getCountryList = async () => {
    const PG_ID = typeof pg[0] != "undefined" ? pg[0].pgId : "";

    try {
      startLoader();
      const res = await getPgCountryAPI(PG_ID);
      const localCountries = res.data.data;

      localCountries.map((country) => {
        setCountries((prev) => ([
          ...prev,
          {
            label: country.name,
            value: country.countryCode,
          }
        ]));
      });

      setAllCountries(localCountries)

      // localCountries.map((country) => {
      //   if (country.countryCode === stripeCountryCode.value) {
      //     const currency = country.currencies
      //     currency.map((currency) => {
      //       const countryCurrencies = currency.symbol
      //       const countryCode = currency.code
      //       setCurrency(countryCurrencies)
      //       setCurrencyCode(countryCode)
      //     })
      //   }
      // })
      stopLoader();

    } catch (err) {
      stopLoader();
      console.error("ERROR IN getCountryList", err);
    }
  };

  useEffect(() => {
    if (
      Object.values(file).length > 0 &&
      form.first_name.value &&
      form.last_name.value &&
      form.address.value &&
      form.city.value &&
      form.state.value &&
      form.zipcode.value &&
      form.phone.value &&
      form.ssn.value &&
      date
    ) {
      setValidate(false);
    } else {
      setValidate(true);
    }

  }, [stripeCountryCode, form, date, file]);

  // Function to set img url and img file
  const onImageChange = (file, url) => {
    setFile({
      file,
      url,
    });
  };

  // Function to handle input control
  const changeInput = async (event, field) => {
    let inputControl = event.target;
    let stateObject = { ...form };
    let error = false;
    let errorMessage = "";

    stateObject[inputControl.name].value = inputControl.value;

    if (stateObject[inputControl.name].validate) {
      for (let i = 0; i < stateObject[inputControl.name].validate.length; i++) {
        let validation = requiredValidator(
          inputControl.value,
          stateObject[inputControl.name].validate[i]
        );
        error = validation.error;
        errorMessage = validation.errorMessage;
        if (error) {
          stateObject[inputControl.name].error = validation.errorMessage;
          break;
        } else {
          stateObject[inputControl.name].error = "";
        }
      }
    }

    // Dynamic Country, State and City from Google API
    if (field === "zipCode" && inputControl.value.length >= 3) {

      const cityStateObj = await getCityStateWithZipCode(inputControl.value);

      if (cityStateObj) {
        stateObject.country.value = cityStateObj.find(country => country.types[0] === "country")?.short_name;
        stateObject.city.value = cityStateObj.find(city => city.types[0] === "locality" || city.types[0] === "postal_town")?.long_name;
        stateObject.state.value = cityStateObj.find(state => state.types[0] === "administrative_area_level_1")?.long_name;
      }
    }

    setValidate(validate());
    setForm(stateObject);
  };

  // Function to validate form
  const validate = () => {
    let validate = true;

    for (let i in form) {
      if (form[i].validate) {
        if (((!form[i]["value"] || form[i]["value"] == "") && !(form?.country?.value?.toLowerCase() != "us" && i == "ssn")) || (form.country.value.toLowerCase() == "us" && i == "ssn" && form.ssn.value.length != 9) || form[i]["errorr"]) {
          validate = false;
          break;
        }
      }
    }

    let dateValid = date ? true : false;
    let imgValid = file.url ? true : false;
    return validate && dateValid && imgValid && !!phoneInput.error;
  };


  // Function to add Account API
  const addAccount = async () => {
    startLoader();
    try {
      const userId = getCookie('uid');
      const cognitoToken = await getCognitoToken();
      const tokenData = cognitoToken?.data?.data;
      const folderName = `${userId}/documents`;
      const imgFileName = `${userId}_${Date.now()}`;
      // setCookie("stripeCountryCode", stripeCountryCode.value)
      // setCookie("currency", currency)
      // setCookie("currencyCode", currencyCode)

      const url = await fileUploaderAWS(file.file[0], tokenData, imgFileName, false, folderName, false, 'no');
      let ip = await getMyIP();

      let requestPayload = {
        business_type: "individual",
        line1: form.address.value,
        city: form.city.value,
        state: form.state.value,
        country: stripeCountryCode.value,
        postal_code: form.zipcode.value,
        day: moment(date).format("DD"),
        month: moment(date).format("MM"),
        year: moment(date).get("year"),
        url: env.WEB_LINK,
        email: profile.email,
        first_name: form.first_name.value,
        last_name: form.last_name.value,
        gender: "male",
        // id_number: form.ssn.value,
        phone: phoneInput.countryCode + phoneInput.phoneNo,
        // ssn_last_4:
        //   form.ssn &&
        //   form.ssn.value &&
        //   form.ssn.value
        //     .toString()
        //     .slice(form.ssn.value.length - 4, form.ssn.value.length),
        ip,
        document: APP_IMG_LINK + '/' + url,
      };

      if (form.country.value.toLowerCase() === "us") {
        requestPayload["ssn_last_4"] = form.ssn && form.ssn.value && form.ssn.value.toString().slice(form.ssn.value.length - 4, form.ssn.value.length);
        requestPayload["id_number"] = form.ssn.value
      } else {
        requestPayload["id_number"] = form.document && form.document.value
      }

      await connectAccount(requestPayload);

      getStripe();
      mobileView ? getStripeAccounts() : getStripeAccount();
      stopLoader();

      setTimeout(() => {
        !mobileView && onClose();
        mobileView && window.location.reload()
      }, 2000);

    } catch (e) {
      stopLoader();
      console.error("ERROR IN addAccount", e);
      Toast(e?.response?.data?.message, "error");
    }
  };

  const handleCountryName = (option) => {
    const filterCountry = allCountries.find((country) =>
      country.countryCode === option.value
    )
    setCurrencyCode(filterCountry.currencies[0].code);
    setCurrency(filterCountry.currencies[0].symbol);
    setStripecountryCode(option);
  };

  return (
    <Wrapper>
      <div style={mobileView ? {} : { overflow: 'hidden' }} className={mobileView ? "drawerBgCss" : "dialogCss position-relative"}>
        {mobileView
          ? <Header
            title={lang.addStripeAccount}
            back={() => {
              onClose();
            }}
          />
          : <div className="row m-0 py-3 stripe_dialog position-relative">
            <div className="col-12">
              <div className="d-flex align-items-center justify-content-center">
                <Icon
                  icon={`${env.backArrow}#left_back_arrow`}
                  color="#fff"
                  width={25}
                  height={25}
                  onClick={() => onClose()}
                  class="cursorPtr position-absolute"
                  alt="backArrow"
                  style={{ left: "10px" }}
                />
                <h5 className="dv__fnt24 text-center txt-black m-0">
                  {lang.addStripeAccount}
                </h5>
              </div>
            </div>
          </div>
        }

        <div
          className={mobileView ? "" : "row m-0 scrollbar_hide"}
          style={mobileView ? {} : { height: '65vh', overflowY: "scroll" }}
        >
          <div className={!mobileView && "col-12"}>
            <div className={`flex-wrap ${mobileView ? "" : "m-0  mt-3"}`}
              style={{ marginTop: "70px" }}
            >

              {/* Photo ID  */}
              <div className="col-12 mb-1">
                {mobileView && (
                  <label className="mv_label_profile_input">
                    {`${lang.photoID}*`}
                  </label>
                )}
                <div className="text-center">
                  <ImagePicker
                    aspectRatio={1 / 1}
                    cropRoundImg={false}
                    onChange={onImageChange}
                    render={() => {
                      return (
                        <div
                          className={
                            mobileView ? "form-group" : "form-group mb-0"
                          }
                        >
                          {file.url
                            ? <Image
                              alt="stripe-placeholder"
                              src={file.url}
                              className={
                                file.url ? "stripe-img object-fit" : ""
                              }
                              width={70}
                              height={70}
                              id
                            />
                            : <div
                              className={
                                mobileView
                                  ? "placeholder-img"
                                  : "dv__placeholder-img cursorPtr"
                              }
                            >
                              <Img
                                src={
                                  mobileView
                                    ? env.Camera_Icon
                                    : env.DV_Camera_Icon
                                }
                                style={mobileView ? {} : { width: "2.049vw" }}
                              />
                            </div>
                          }
                        </div>
                      );
                    }}
                  />
                  {!mobileView && (
                    <label className="dv__fnt16 dv__blue_var_1">
                      {`${lang.photoID}*`}
                    </label>
                  )}
                </div>
              </div>

              <div className={mobileView ? "px-2" : ""}>
                <p className="font-weight-700 fntClrTheme fntSz16 ml-2 mb-2 text-uppercase">{lang.selectCountry}</p>
                <div className="mb-4">
                  <Select
                    placeholder={lang.selectCountry}
                    styles={{
                      control: (provided) => ({ ...provided, backgroundColor: mobileView ? theme.palette.l_section_bg : "var(--l_drawer)", borderRadius: mobileView ? "25px" : "0", borderStyle: "unset", color: "var(--l_light_grey)", borderBottom: mobileView ? "" : "1px solid #c4c4c4", padding: mobileView ? "5px 10px" : "" }),
                      placeholder: (provided) => ({ ...provided, color: "#c4c4c4", fontSize: "12px", fontFamily: "Roboto" }),
                      option: (provided) => ({ ...provided, zIndex: "99", backgroundColor: "var(--l_drawer)", color: "var(--l_app_text)", fontFamily: "Roboto", fontSize: "15px", fontWeight: "400" }),
                      singleValue: (provided) => ({ ...provided, color: "var(--l_app_text)" }),
                      menuList: (provided) => ({ ...provided, backgroundColor: "var(--l_drawer)", color: "var(--l_app_text)" }),
                    }}
                    // value={stripeCountryCode.label}
                    onChange={handleCountryName}
                    options={countries}
                  />
                </div>

                <p className="font-weight-700 fntClrTheme fntSz16 m-2 mb-2 text-uppercase">{lang.addressDetails}</p>
                <div className="row mb-3">

                  {/* Zip Code */}
                  <div className={mobileView ? "col-12" : "col-12 "}>
                    <InputField
                      addBankAccount={true}
                      {...form.zipcode}
                      autoComplete="off"
                      onChange={(e) => changeInput(e, "zipCode")}
                      className={mobileView ? "" : addBankAccount ? "dv__border_bottom_stripe_input custom_inputfield_styling p-2" : "dv__border_bottom_stripe_input"}
                    />
                    {/* {form.zipcode.value && <span className="fntSz9 ml-2 p-0 text-danger font-weight-bold">{zipVal ? "" : lang.zipCodeError}</span>} */}
                  </div>
                  {/* Country */}
                  {/* <div className={mobileView ? "col-12" : "col-6 srtripeLabel"}>
                <InputField
                  addBankAccount={true}
                  {...form.country}
                  autoComplete="off"
                  onChange={changeInput}
                  className={mobileView ? "" : addBankAccount ? "dv__border_bottom_stripe_input custom_inputfield_styling p-2" : "dv__border_bottom_stripe_input"}
                />
              </div> */}

                  {/* City */}
                  <div className={mobileView ? "col-12" : `col-12 srtripeLabel pt-2`}>
                    <InputField
                      addBankAccount={true}
                      {...form.city}
                      autoComplete="off"
                      onChange={changeInput}
                      className={mobileView ? "" : addBankAccount ? "dv__border_bottom_stripe_input custom_inputfield_styling p-2" : "dv__border_bottom_stripe_input"}
                    />
                  </div>

                  {/* State */}
                  <div className={mobileView ? "col-12" : "col-12 srtripeLabel"}>
                    <InputField
                      addBankAccount={true}
                      {...form.state}
                      autoComplete="off"
                      onChange={changeInput}
                      className={mobileView ? "" : addBankAccount ? "dv__border_bottom_stripe_input custom_inputfield_styling p-2" : "dv__border_bottom_stripe_input"}
                    />
                  </div>

                  {/* Address */}
                  <div className="col-12 srtripeLabel">
                    <InputField
                      addBankAccount={true}
                      {...form.address}
                      autoComplete="off"
                      onChange={changeInput}
                      className={mobileView ? "" : addBankAccount ? "dv__border_bottom_stripe_input custom_inputfield_styling p-2" : "dv__border_bottom_stripe_input"}
                    />
                  </div>
                </div>

                <p className="font-weight-700 fntClrTheme fntSz16 m-2 mb-2 text-uppercase">{lang.otherDetails}</p>
                <div className="row mb-3">

                  {/* First Name */}
                  <div className={mobileView ? "col-12" : "col-12 srtripeLabel"}>
                    <InputField
                      addBankAccount={true}
                      {...form.first_name}
                      autoComplete="off"
                      onChange={changeInput}
                      className={mobileView ? "" : addBankAccount ? "dv__border_bottom_stripe_input custom_inputfield_styling p-2" : "dv__border_bottom_stripe_input"}
                    />
                  </div>

                  {/* Last Name */}
                  <div className={mobileView ? "col-12" : "col-12 srtripeLabel"}>
                    <InputField
                      addBankAccount={addBankAccount}
                      {...form.last_name}
                      autoComplete="off"
                      onChange={changeInput}
                      className={mobileView ? "" : addBankAccount ? "dv__border_bottom_stripe_input custom_inputfield_styling p-2" : "dv__border_bottom_stripe_input"}
                    />
                  </div>

                  {/* Date of Birth */}
                  <div className={mobileView ? "col-12" : "col-12 mb-1 srtripeLabel"}>
                    <label className={mobileView ? "mv_label_profile_input" : "dv__label_profile_input mb-0 dv_base_color"
                    }>
                      {`${lang.dateOfBirth}*`}
                    </label>
                    <DatePicker
                      addBankAccount={addBankAccount}
                      maxDate={getCurrentAge()}
                      value={date}
                      placeholder="dd-mm-yyyy"
                      isFromStripe={true}
                      onChange={(e) => setDate(e.target.value)}
                      className={mobileView ? "datepickerInput" : "dv__border_bottom_stripe_input datepickerInput"}
                    />
                  </div>

                  {/* SSN - Social Security Number */}
                  {stripeCountryCode?.value?.toLowerCase() === "us"
                    ? <div className={mobileView ? "col-12" : "col-12 srtripeLabel"}>
                      <InputField
                        addBankAccount={true}
                        {...form.ssn}
                        autoComplete="off"
                        onChange={changeInput}
                        className={mobileView ? "" : addBankAccount ? "dv__border_bottom_stripe_input custom_inputfield_styling p-2" : "dv__border_bottom_stripe_input"}
                        informationText={lang.SSNdocumentTooltip}
                      />
                    </div>
                    : <div className={mobileView ? "col-12" : "col-12 srtripeLabel"}>
                      <InputField
                        addBankAccount={true}
                        {...form.document}
                        autoComplete="off"
                        onChange={changeInput}
                        className={mobileView ? "" : addBankAccount ? "dv__border_bottom_stripe_input custom_inputfield_styling p-2" : "dv__border_bottom_stripe_input"}
                        informationText={lang.documentTooltip}
                      />
                    </div>
                  }

                  {/* Phone Number */}
                  <div className={mobileView ? "col-12" : "col-12 srtripeLabel"}>
                    <PhoneNoInput
                      {...form.phone}
                      autoComplete="off"
                      iso2={stripeCountryCode.value || location.country}
                      phone={lang.stripePhoneNumValid}
                      onChange={(e) => setPhoneInput(e)}
                      className={mobileView ? "" : addBankAccount ? "dv__border_bottom_stripe_input custom_inputfield_styling p-2" : "dv__border_bottom_stripe_input"}
                      informationText={lang.stripePhoneNumValid}
                    />

                    {/* <InputField
                      {...form.phone}
                      autoComplete="off"
                      onChange={changeInput}
                      className={mobileView ? "" : addBankAccount ? "dv__border_bottom_stripe_input custom_inputfield_styling p-2" : "dv__border_bottom_stripe_input"}
                      informationText={lang.stripePhoneNumValid}
                    /> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="col-12 py-3">
          <div className="px-3">
            <Button
              onClick={addAccount}
              type="button"
              disabled={!validate()}
              cssStyles={theme.blueButton}
            >
              {lang.submit}
            </Button>
          </div>
        </div>
      </div>

      <style jsx>
        {`
          :global(.MuiDrawer-paper) {
            width: 100% !important;
            max-width: 100% !important;
            color: inherit;
          }
          :global(.MuiDrawer-paper > div) {
            width: 100% !important;
            max-width: 100% !important;
          }
          :global(.MuiDialog-paper) {
            max-width: 40.263vw;
          }
          :global(.MuiDialog-paper .MuiDialogContent-root) {
            overflow-y: hidden !important;
          }
          :global(.backArrow) {
            width: 2.317vw;
            margin-right: 0.366vw;
            cursor: pointer;
            position: absolute;
            top: 50%;
            left: 15px;
            transform: translateY(-50%);
          }

          :global(.AddStripeAcc .MuiDialog-paperScrollPaper){
            max-height:unset !important;
          }

          :global(.custom_inputfield_styling){
            border: ${mobileView ? "1px solid #c4c4c4 !important" : ""};
            border-bottom: ${mobileView ? "" : "1px solid #c4c4c4 !important"};
            border-radius:${mobileView ? "5px" : ""} !important;
            padding:10px !important;
            font-size:14px !important;
            background-color:${theme.type == "light" ? "" : "var(--l_app_bg)!important;"}
            color:var(--l_app_text)!important;
          }
          :global(.MuiPaper-root){
            overflow-y: auto !important;
          }
          :global(.story_profiles::-webkit-scrollbar, .scrollbar_hide::-webkit-scrollbar){
            display: block !important;
          }
          .dialogCss{
            background: ${theme.background} !important;
          }
          :global(.srtripeLabel){
            margin-bottom: 1rem;
          }

          input,
          input::-webkit-input-placeholder {
            font-size: 10px;
          }
          :global(.dv__label_profile_input){
            margin-left:10px;
          }
          :global(.custom_inputfield_styling::-webkit-input-placeholder){
            font-size: 10px!important;
          }
          :global(.custom_dv_forminput_date_picker input::-webkit-input-placeholder){
            font-size: 10px!important;
          }
          :global(.custom_dv_forminput_date_picker input){
            font-size: 10px!important;
            background-color:${theme.type == "light" ? "" : "var(--l_app_bg)!important;"}
            color:var(--l_app_text)!important;
          }
          :global(.dv__label_profile_input){
            font-size: 13px!important;
            font-weight: bold!important;
          }
          :global(.form-group){
            margin-bottom:0px};
          }
          :global(.dv__border_bottom_stripe_input::placeholder){
            color:var(--l_app_text)!important;
          }
        `}
      </style>
    </Wrapper>
  );
}
