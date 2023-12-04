import React, { useEffect } from "react";
import Select from "react-select";
import Wrapper from "../../hoc/Wrapper";
import useLang from "../../hooks/language";
import useProfileData from "../../hooks/useProfileData";
import * as env from "../../lib/config";
import EditProfileCoverImageHeader from "../../containers/profile/edit-profile/edit-profile-CoverImage-header";
import { Formik } from "formik";
import InputField from "../profile/edit-profile/label-input-field";
import PhoneNoInput from "../../components/formControl/phoneNoInput";
import {
  close_dialog,
  open_dialog,
  startLoader,
  stopLoader,
  Toast,
} from "../../lib/global";
import { formatDate, formatDateOrder } from "../../lib/date-operation/date-operation";
import FigureCloudinayImage from "../../components/cloudinayImage/cloudinaryImage";
import { getReasons, phoneNumber } from "../../services/auth";
import { useRouter } from "next/router";
import Img from "../../components/ui/Img/Img";
import Icon from "../../components/image/icon";
import { useTheme } from "react-jss";
import isMobile from "../../hooks/isMobile";
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { TIMEZONE_LIST } from "../../lib/timezones";
import { useState } from "react";
import { drawerToast } from "../../lib/global/loader";
import { sendMail } from "../../lib/global/routeAuth";
import dynamic from "next/dynamic";
import DVinputText from "../../components/DVformControl/DVinputText";
import { isAgency } from "../../lib/config/creds";
import { useDispatch } from "react-redux";
import { setCookie } from "../../lib/session";
import { ValidatePhoneNoPayload } from "../../lib/data-modeling";
import { updateReduxProfile } from "../../redux/actions";
import { handleContextMenu } from "../../lib/helper";
import Button from "../../components/button/button";
const Switch = dynamic(() => import("../../components/formControl/switch"), { ssr: false });

export default function DvEditProfile(props) {
  const [lang] = useLang();
  const [profile] = useProfileData();
  const [mobileView] = isMobile();
  const { isNSFWAllow, handleNSFWChanges, timeZone, handleTimeZoneChange, isEnable, setIsEnable, handleShoutOutEnable, saveProfileDetails, selectedCategory, setSelectedCategory, selectedCategoryinputValue, setSelectedCategoryInputValue, availabelCategories, setAvailabelCategories } = props;
  const [inputDisabled, setInputDisabled] = useState(false);
  const router = useRouter();
  const theme = useTheme();
  const [phoneInput, setPhoneInput] = useState({
    phoneNo: profile?.phoneNumber || "",
    countryCode: profile?.countryCode || "",
  });
  const [errorMessage, setError] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    props.homePageref && props.homePageref.current.scrollTo(0, 0);
    if (profile && [5, 6].includes(profile.statusCode)) {
      setInputDisabled(true);
    }
  }, []);

  const GetDeactivateReasons = async () => {
    startLoader();
    try {
      let reasonType = 3; // 3 -> delete userAccount
      const response = await getReasons(reasonType);
      if (response.status == 200) {
        stopLoader();
        let arr = response && response.data && response.data.data;
        open_dialog("DeactivateReasons", { reasons: arr, closeAll: true });
      }
    } catch (e) {
      stopLoader();
      Toast(e.response.data.message, "error");
    }
  };

  const getSocialLink = () => {
    let linksArray = [];
    linksArray[0] = { label: "instagram", logo: props?.socialLinks?.instagram ? env.instagram_social : env.instagram_social_disble };
    linksArray[1] = { label: "facebook", logo: props?.socialLinks?.facebook ? env.facebook_social : env.facebook_social_disble };
    linksArray[2] = { label: "twitter", logo: props?.socialLinks?.twitter ? env.twitter_social : env.twitter_social_disble };
    linksArray[3] = { label: "youtube", logo: props?.socialLinks?.youtube ? env.youtube_social : env.youtube_social_disble };
    linksArray[4] = { label: "tiktok", logo: props?.socialLinks?.tiktok ? env.onlyfans_social : env.onlyfans_social_disble };
    linksArray[5] = { label: "snapchat", logo: props?.socialLinks?.snapchat ? env.snapchat_social : env.snapchat_social_disble };
    return linksArray;
  }

  const webInoutStyle = {
    background: theme.palette.l_input_bg,
    color: theme.palette.l_app_text,
  };
  const mobileInoutStyle = {
    background: theme.palette.d_input_bg,
    color: theme.palette.d_app_text,
  };

  const dispatchPayload = () => {
    let data = { ...profile };

    (data.phoneNumber = phoneInput.phoneNo)
    return data;
  };

  const savePhoneNumberDetail = async () => {
    dispatch(updateReduxProfile(dispatchPayload()));
    setCookie("profileData", JSON.stringify({ ...profile, phoneNumber: phoneInput.phoneNo }))
  };

  // validate phone no
  const ValidatePhoneNo = () => {
    return new Promise(async (res, rej) => {
      try {
        await savePhoneNumberDetail()
        await saveProfileDetails()
        ValidatePhoneNoPayload.phoneNumber = phoneInput.phoneNo;
        ValidatePhoneNoPayload.countryCode = phoneInput.countryCode;
        const response = await phoneNumber(ValidatePhoneNoPayload);
        setPhoneInput(response);
        res();
      } catch (e) {
        ;
        setError(phoneInput.errorMessage);
        rej();
      }
    });
  };

  const handleShoutOut = () => {
    inputDisabled ? drawerToast({
      closing_time: 10000,
      title: lang.submitted,
      desc: lang.unverifiedProfile,
      closeIconVisible: true,
      button: {
        text: lang.contactUs,
        onClick: () => {
          sendMail();
        },
      },
      titleClass: "max-full",
      autoClose: true,
      isMobile: false,
    })
      : isEnable ?
        open_dialog("EDIT_SHOUTOUT_PRICE", {
          disUeff: true,
          value: props.shoutoutPrice,
          currency: props.currency,
          onChange: props.handleShoutoutPrice,
          handleCurrencyChange: props.handleCurrencyChange,
          onBlur: props.handleBlur,
          closeAll: true,
          className: "pb-2"
        })
        : null
  }

  const handleVerifyProfile = () => {
    open_dialog('documentVerification', { doc: profile.document.documentTypeId })
  }

  return (
    <Wrapper>
      <div id="profile_page_cont">
        <Formik
          initialValues={props.initialValues}
          onSubmit={props.onSubmit}
          //here we will deefine validation
          validationSchema={props.validationSchema}
        >
          {(formProps) => {
            const {
              values,
              touched,
              errors,
              isSubmitting,
              handleChange,
              handleBlur,
              handleSubmit,
            } = formProps;

            return (
              <>
                <div className="d-flex align-items-center myAccount_sticky__section_header">
                  <Icon
                    icon={`${env.backArrow_black}#backArrow`}
                    color={theme?.text}
                    width={25}
                    height={20}
                    onClick={() => router.back()}
                    class="backArrow"
                    alt="back_arrow"
                  />
                  <h5 className="content_heading p-3 m-0 dv_appTxtClr" >{lang.edit}</h5>
                </div>
                <div
                  style={{ maxWidth: "51.976vw", margin: "0 auto" }}
                  className="px-2 editProfile_mainSection"
                >
                  <div className="row">
                    <div className="col-12 mb-4">
                      <EditProfileCoverImageHeader
                        bannerImage={props.bannerImage}
                        onBannerImageChange={props.onBannerImageChange}
                        profileImage={props.profileImage}
                        onProfileImageChange={props.onProfileImageChange}
                      />
                    </div>
                  </div>
                  <div className="d-flex flex-row justify-content-end gap_8">
                    {profile && [0, 6].includes(profile.statusCode) &&
                        <Button
                          type="button"
                          fclassname="btnGradient_bg rounded-pill py-1 w-fit-content text-nowrap"
                          onClick={handleVerifyProfile}
                          children={lang.verifyProfile}
                        />
                      }
                      <Button
                        type="button"
                        fclassname="btnGradient_bg rounded-pill py-1 w-fit-content"
                        onClick={() => {
                          if (phoneInput?.error && (profile?.phoneNumber !== phoneInput?.phoneNo)) {
                            ValidatePhoneNo();
                          }
                          if (values?.firstName && values?.lastName) {
                            handleSubmit();
                          } else {
                            Toast(lang.fieldsCantBlank, "error");
                          }
                        }}
                        children={lang.update}
                      />
                  </div>
                  <div className="row mt-4">
                    <div className="col-12">
                      <div className="row">
                        <div className="col-6">
                          <label
                            className={"dv__label_profile_edit_input mb-0 dv_base_color dv_base_color"}
                          >
                            {lang.firstNamePlaceholder}
                          </label>
                          <InputField
                            id="firstName"
                            // label={`${lang.firstNamePlaceholder}`}
                            name="firstName"
                            value={values.firstName}
                            placeholder={lang.enterFirstName}
                            error={
                              errors.firstName && touched.firstName
                                ? errors.firstName
                                : ""
                            }
                            disabled={isAgency()}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="dv_form_control_input"
                          />
                        </div>
                        <div className="col-6">
                          <label
                            className={"dv__label_profile_edit_input mb-0 dv_base_color dv_base_color"}
                          >
                            {lang.lastNamePlaceholder}
                          </label>
                          <InputField
                            id="lastName"
                            // label={`${lang.lastNamePlaceholder}`}
                            name="lastName"
                            value={values.lastName}
                            placeholder={lang.enterLastName}
                            error={
                              errors.lastName && touched.lastName
                                ? errors.lastName
                                : ""
                            }
                            disabled={isAgency()}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className="dv_form_control_input"
                          />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-6"
                          // onClick={() =>
                          //   !isAgency() && open_dialog("ChangeEmail", { closeAll: true, username: profile.username })
                          // }
                        >
                          <label
                            className={"dv__label_profile_edit_input mb-0 dv_base_color dv_base_color"}
                          >
                            {lang.userNamePlaceHolder}
                          </label>
                          <InputField
                            // label={`${lang.userNamePlaceHolder}`}
                            value={profile.username}
                            placeholder={lang.userNamePlaceHolder}
                            className="dv_form_control_input"
                            disabled={true}
                            lock
                            cssStyles={mobileView ? "" : webInoutStyle}
                          />
                        </div>
                        {profile.userTypeCode !== 1 ?
                          <div className="col-6">
                            <DVinputText
                              key={selectedCategoryinputValue}
                              edit
                              label={`${lang.categories}`}
                              onClick={() =>
                                open_dialog("category", {
                                  setSelectedCategoryState: (data) => setSelectedCategory(data),
                                  selectedCategoryState: selectedCategory,
                                  setAvailabelCategories: (data) => setAvailabelCategories(data)
                                })}
                              className="dv_form_control_input cursorPtr pr-5"
                              id="category"
                              name="category"
                              placeholder={`${lang.chooseCategory}`}
                              style={{ borderBottom: "1px soild ", padding: "21px 10px 21px 10px", borderRadius: "20px" }}
                              value={selectedCategoryinputValue}
                              disabled={isAgency()}
                              readOnly
                            />
                          </div> : ""}
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <div
                            onClick={() =>
                              open_dialog("ChangeBio", {
                                closeAll: true,
                                error:
                                  errors.bio && touched.bio ? errors.bio : "",
                                onChange: props.handleChangeBio,
                                onBlur: handleBlur,
                                placeholder: lang.enterBio,
                                value: props.bioValue,
                                bioLen: props.bioLen,
                              })
                            }
                          >
                            <label
                              className={"dv__label_profile_edit_input mb-0 dv_base_color dv_base_color"}
                            >
                              {lang.bio}
                            </label>
                            <InputField
                              edit
                              // key={props.bioValue}
                              id="bio"
                              // label={`${lang.bio}`}
                              name="bio"
                              // value={props.bioValue}
                              placeholder={props.bioValue || lang.enterBio}
                              maxLength="900"
                              // onBlur={handleBlur}
                              error={errors.bio && touched.bio ? errors.bio : ""}
                              // onChange={props.handleChangeBio}
                              // bioInput={true}
                              textarea={true}
                              rows={3}
                              style={{ borderRadius: "25px", height: '2.8rem', lineHeight: '2' }}
                              className="dv_form_control_input bio_input cursorPtr overflow-hidden px-3"
                              readOnly
                            />
                          </div>
                          {/* <p className="fontgreyClr m-0 fntSz13 mt-2 text-right">
                            {props.bioLen} of 900 characters
                          </p> */}
                        </div>
                      </div>

                      {/* Phone Number  */}
                      {!isAgency() && <div className="row">
                        {profile && profile.userTypeCode != 1 && (
                          <div className="col-6">
                            {/* <div
                              onClick={() =>
                                !isAgency() && open_dialog("ChangePhoneNum", { closeAll: true })
                              }
                            > */}
                            <label
                              className={"dv__label_profile_edit_input mb-0 dv_base_color dv_base_color"}
                            >
                              {lang.phone}
                            </label>
                            <PhoneNoInput
                              key={profile.phoneNumber}
                              // edit
                              // label={`${lang.phone}`}
                              name={lang?.phone}
                              value={phoneInput?.phoneNo}
                              containerClassName="dv__phoneInput rounded-pill"
                              inputClass="dv__form_control_profile_input"
                              iso2={"IN"}
                              countryCode={profile.countryCode}
                              phoneNo={
                                profile.countryCode + profile.phoneNumber
                              }
                              disabled={isAgency()}
                              onChange={(data) => setPhoneInput(data)}
                            />
                          </div>
                          // </div>
                        )}
                        <div className="col-6">
                          <div
                            onClick={() =>
                              !isAgency() && open_dialog("ChangeEmail", { closeAll: true })
                            }
                          >
                            <label
                              className={"dv__label_profile_edit_input mb-0 dv_base_color dv_base_color"}
                            >
                              {lang.emailId}
                            </label>
                            <InputField
                              edit
                              // label={`${lang.emailId}`}
                              value={profile.email}
                              placeholder={lang.search}
                              className="dv_form_control_input cursorPtr"
                              style={{ marginBottom: "0.5rem" }}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>}

                      {profile && profile.userTypeCode != 1 && (
                        <div className="row">
                          <div className="col-6">
                            <label
                              className={"dv__label_profile_edit_input mb-0 dv_base_color dv_base_color"}
                            >
                              {lang.gender}
                            </label>
                            <InputField
                              lock
                              // label={lang.gender}
                              value={props.gender.value || profile.gender}
                              placeholder={lang.gender}
                              disabled={true}
                              readOnly={true}
                              className="dv_form_control_input cursorPtr"
                            />
                          </div>
                          <div className="col-6">
                            <label
                              className={"dv__label_profile_edit_input mb-0 dv_base_color dv_base_color"}
                            >
                              {lang.dob}
                            </label>
                            <InputField
                              lock
                              id="dob"
                              // label={`${lang.dob}`}
                              name="dob"
                              value={formatDate(profile.dateOfBirth, 'MM/DD/YYYY')}
                              placeholder={lang.dob}
                              disabled={true}
                              readOnly={true}
                              // error={errors.bio && touched.bio ? errors.bio : ""}
                              // onChange={handleChange}
                              // onBlur={handleBlur}
                              className="dv_form_control_input cursorPtr"
                            />
                          </div>
                        </div>
                      )}

                      {/* NSFW Icon */}
                      {/* <div className="row">
                        <div className="col-12">
                          <div onClick={() => open_dialog("NSFW", {
                            isNSFWAllow,
                            handleNSFWChanges,
                          })}>
                            <label
                            className={"dv__label_profile_edit_input mb-0 dv_base_color dv_base_color"}
                          >
                            {lang.nsfwLabel}
                          </label>
                            <InputField
                              cssStyles={webInoutStyle}
                              // label={lang.nsfwLabel}
                              icon={isNSFWAllow ? env.TICK : env.CROSS}
                              iconId={isNSFWAllow ? "#tick" : "#cross"}
                              color={isNSFWAllow ? theme.palette.l_green : theme.palette.l_red}
                              value={"NSFW Content"}
                              readOnly={true}
                              className="dv_form_control_input mv_label_profile_input cursorPtr"
                            />
                          </div>
                        </div>
                      </div> */}

                      {/* Timezone  */}
                      <div className="row mb-2">
                        <div className="col-12">
                          <label
                            className={"dv__label_profile_edit_input mb-0 dv_base_color dv_base_color"}
                          >
                            {lang.selectTimeZone}
                          </label>
                          <Select
                            menuPlacement="top"
                            styles={{
                              control: (provided) => ({ ...provided, backgroundColor: "var(--l_input_bg_color)", borderColor: "var(--l_input_bg_color)", color: "var(--l_light_grey)", borderRadius: '20px', padding: '4px 8px' }),
                              placeholder: (provided) => ({ ...provided, color: "var(--l_app_text)", fontSize: "15px", fontFamily: "Roboto" }),
                              option: (provided) => ({ ...provided, backgroundColor: "var(--l_input_bg_color)", color: "var(--l_app_text)", fontFamily: "Roboto", fontSize: "15px", fontWeight: "400" }),
                              singleValue: (provided) => ({ ...provided, color: "var(--l_app_text)" }),
                              menuList: (provided) => ({ ...provided, backgroundColor: "var(--l_input_bg_color)", color: "var(--l_app_text)" }),
                            }}
                            value={timeZone}
                            placeholder={lang.selectTimeZone}
                            options={TIMEZONE_LIST}
                            onChange={handleTimeZoneChange}
                            isDisabled={isAgency()}
                          />
                        </div>
                      </div>
                      {profile && profile.userTypeCode != 1 && (
                        <div className="row">
                          <div className="col-6 mt-2"
                            onClick={() =>
                              open_dialog("ADDSocialMediaLinks", { handelSocialLinksBundle: props?.handelSocialLinksBundle, socialLinks: props?.socialLinks })
                            }
                          >
                            <div>
                              <div className="mv_label_profile_input pb-1 pl-2">{lang.soclMediaLink}</div>
                              <div className="goForwardIconWeb cursorPtr">
                                <ChevronRightIcon style={{ color: "#6c6c6c" }} /></div>
                              <div className=" d-flex align-items-center cursorPtr dv_form_control_input"
                                style={{ borderRadius: "25px" }}>
                                {getSocialLink().map((link, index) => (
                                  <img src={link.logo} height="45" width="45" className="pl-3 callout-none" onContextMenu={handleContextMenu} />
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="col-6 pt-1">
                            <div>
                              <div className="d-flex align-items-center justify-content-between">
                                <label
                                  className={"dv__label_profile_edit_input mb-0 dv_base_color dv_base_color"}
                                >
                                  {lang.shououtAmount}
                                </label>
                                {profile && profile.userTypeCode != 1 && <div className="row ">
                                  <div className="mb-2 mr-4">
                                    <Switch
                                      checked={isEnable}
                                      onChange={() => { handleShoutOutEnable(inputDisabled) }}
                                    />
                                  </div>
                                </div>}
                              </div>
                              <InputField
                                edit
                                // label={`${lang.shououtAmount}`}
                                name="shoutoutPrice"
                                id="shoutoutPrice"
                                value={`${props.currency.toLowerCase() === 'dollar' ? '$' : props.currency.toLowerCase() === 'euro' ? '€' : '₹'} ${props.shoutoutPrice || lang.enterPrice}`}
                                placeholder={`${props.currency.toLowerCase() === 'dollar' ? '$' : props.currency.toLowerCase() === 'euro' ? '€' : '₹'} ${props.shoutoutPrice || lang.enterPrice}`}
                                disabled={false}
                                error={errors.shoutoutPrice && touched.shoutoutPrice ? errors.shoutoutPrice : ""}
                                className="dv_form_control_input cursorPtr"
                                onClick={handleShoutOut}
                                readOnly
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="row">
                        {/* <div className="col-6">
                            <div
                              onClick={() =>
                                open_dialog("EDIT_SHOUTOUT_PRICE", {
                                  value: props.shoutoutPrice,
                                  currency: props.currency,
                                  onChange: props.handleShoutoutPrice,
                                  handleCurrencyChange: props.handleCurrencyChange,
                                  onBlur: props.handleBlur,
                                  closeAll: true
                                })
                              }
                            >
                              <InputField
                                edit
                                label={`${lang.shououtAmount}`}
                                name="shoutoutPrice"
                                id="shoutoutPrice"
                                label={`${lang.shououtAmount}`}
                                value={`${props.currency.toLowerCase() === 'dollar' ? '$' : props.currency.toLowerCase() === 'euro' ? '€' : '₹'} ${props.shoutoutPrice || lang.enterPrice}`}
                                placeholder={`${props.currency.toLowerCase() === 'dollar' ? '$' : props.currency.toLowerCase() === 'euro' ? '€' : '₹'} ${props.shoutoutPrice || lang.enterPrice}`}
                                disabled={false}
                                error={errors.shoutoutPrice && touched.shoutoutPrice ? errors.shoutoutPrice : ""}
                                style={{ cursor: "pointer" }}
                                cssStyles={mobileView ? "" : webInoutStyle}
                              />
                            </div>
                          </div> */}
                      </div>
                      {/* {profile.userTypeCode == 2 && (
                        <div className="col-12">
                          <div className="row">
                            <div className="col-6 pl-0">
                              <label className="dv__label_profile_edit_input">
                                {lang.idVerificationDocuments}
                              </label>
                            </div>
                            <div className="col-6">
                              <div className="dv_label_document_change cursorPtr"
                                onClick={() => open_dialog('documentVerification', { doc: profile.document.documentTypeId })}
                              >
                                {lang.changeDocuments}
                              </div>
                            </div>
                          </div>
                        </div>
                      )} */}
                      {!isAgency() && <div className="row">
                        <div className="col-7">
                          {profile && profile.userTypeCode != 1 && (
                            <>
                              <div className="txt-book dv__fnt16 appTextColor txt-book mb-2">
                                {profile?.document?.name}
                              </div>
                              <div className="row callout-none" onContextMenu={handleContextMenu}>
                                {profile.document && profile.document.frontImage && (
                                  <div className="col-4">
                                    <figure>
                                      <button
                                        type="button"
                                        className="btn btn-default p-0"
                                        data-toggle="modal"
                                      >
                                        <FigureCloudinayImage
                                          ratio={1}
                                          width={100}
                                          publicId={profile?.document?.frontImage}
                                          className="img-box"
                                          editPage={true}
                                        />
                                        <div className="dv_appTxtClr txt-trans">
                                          {lang.front}
                                        </div>
                                      </button>
                                    </figure>
                                  </div>
                                )}
                                {profile.document && profile.document.backImage && (
                                  <div className="col-4">
                                    <figure>
                                      <button
                                        type="button"
                                        className="btn btn-default p-0"
                                        data-toggle="modal"
                                      //data-target="#bottomModal"
                                      >
                                        <FigureCloudinayImage
                                          ratio={1}
                                          width={100}
                                          publicId={profile?.document?.backImage}
                                          className="img-box"
                                          editPage={true}
                                        />
                                        <div className="dv_appTxtClr txt-trans">
                                          {lang.back}
                                        </div>
                                      </button>
                                    </figure>
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </div>}
                      <div className="d-flex flex-column">
                        {!isAgency() && <p
                          className="txt-heavy dv_base_color dv__fnt15 cursorPtr"
                          style={{ width: "fit-content" }}
                          onClick={() =>
                            !isAgency() && open_dialog("ChangePassword", { closeAll: true })
                          }
                        >
                          {lang.changePassword}
                        </p>}
                        {!isAgency() && <p
                          className="txt-heavy base_reject_clr dv__fnt15 cursorPtr"
                          style={{ width: "fit-content" }}
                          onClick={() =>
                            !isAgency() && open_dialog("confirmDialog", {
                              title: lang.deactivateHeading,
                              subtitle: lang.deactivateMsg,
                              cancelT: lang.cancel,
                              submitT: lang.confirm,
                              yes: () => {
                                GetDeactivateReasons();
                              },
                              closeAll: true,
                            })
                          }
                        >
                          {lang.deactivateAccount}
                        </p>}
                        <p
                          className="txt-heavy dv_base_color dv__fnt15 cursorPtr"
                          style={{ width: "fit-content" }}
                          onClick={() => {
                            open_dialog("BlockedUser", { closeAll: true });
                          }}
                        >
                          {lang.blockedUser}
                        </p>
                      </div>
                    </div>
                    {/* <div className="col-auto" style={{ paddingTop: "32px" }}>

                  </div> */}
                  </div>
                  <style jsx>{`
                  :global(.mv_create_post_switch_toggler){
                    float:right!important;
                  }
                  :global(.editProfile_mainSection label){
                    padding-left: 10px;
                  }
                  :global(.bio_input::placeholder){
                    color:${props.bioValue ? 'var(--l_app_text)' : 'var(--l_light_grey)'} !important;
                  }
                  `}</style>
                </div>
              </>
            );
          }}
        </Formik >
      </div>
    </Wrapper >
  );
}
