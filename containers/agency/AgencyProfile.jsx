import React, { useEffect } from 'react'
import Image from '../../components/image/image'
import { CAMERA_AG, FACEBOOK_AG, INSTARGAM_AG, TWITTER_AG } from '../../lib/config/homepage'
import Button from '../../components/button/button'
import { s3ImageLinkGen } from '../../lib/UploadAWS/s3ImageLinkGen'
import { useDispatch, useSelector } from 'react-redux'
import DvLabelInput from '../../components/DVformControl/DvLabelInput'
import useAgencyRegistration from './hook/useAgencyRegistration'
import PhoneNoInput from '../../components/formControl/phoneNoInput'

const AgencyProfile = () => {
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
  const profileData = useSelector((state) => state?.agencyProfile)

  const dispatch = useDispatch()
  const {
    formik,
    lang,
    phoneRef,
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
    socialMediaLink,
    setSocialMediaLink,
    setPassvalidScreen,
    setPhone,
    setPic,
    setPhoneInput,
    setAgencyPhone,
    setAgencyPhoneInput,
    registerAgencyHandler,
    setPasswordCheck,
    setPhysicalAddress,
    changeBillingAddress,
    changePhysicalAddress,
    setSameAddress,
    setIsValid,
    blockInvalid,
    handleGetAgency,
    onProfileImageChange,
    updateAgProfile
  } = useAgencyRegistration();

  useEffect(() => {
    handleGetAgency()
  }, [])
  return (
    <div className='card_bg vh-100 rightside px-4'>
      <div className='pt-4'>
        <h3 className='text-app bold'>Agency Profile</h3>
      </div>
      <div className='mt-4 borderall col-12' style={{ overflowX: "hidden", overflowY: "auto" }}>
        <div className='mt-3 d-flex flex-row'>
          <div className='col-1 position-relative mr-5'>
            {!pic?.url ? <img
              src={s3ImageLinkGen(S3_IMG_LINK, pic, 100, 200, 200)}
              className="imgBox"
            /> : <img
              src={pic.url}
              className="imgBox"
            />}
          </div>
          <div className='position-absolute camestyle'>
            {/* <ImagePicker
              aspectRatio={1 / 1}
              cropRoundImg={false}
              disabled
              // onChange={onProfileImageChange}
              render={() => {
                return ( */}
            <span
              className="camestyle"
              style={{ cursor: "pointer" }}
            >
              <Image src={CAMERA_AG} width={35}
                height={35} />
            </span>
            {/* );
              }}
            ></ImagePicker> */}
          </div>
          <div className='col-11 position-relative'>
            <div className=' position-absolute' style={{ top: "0%", left: "70%", zIndex: 1 }}>
              <Button
                type="submit"
                fclassname="py-1 btnGradient_bg radius_22"
                btnSpanClass="px-1 fntSz15"
                onClick={updateAgProfile}
              >Save</Button>
            </div>
            <div className='col-5 text-app mb-4'>
              <DvLabelInput
                required
                type='text'
                disabled
                label={lang.agencyname}
                errorIocnClass="tooltip-icon"
                errorClass="agencyPage"
                id="agencyLegalName"
                name="agencyLegalName"
                value={formik.values.agencyLegalName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={(formik.errors.agencyLegalName && formik.touched.agencyLegalName) && formik.errors.agencyLegalName}
              />
            </div>
            <div className='col-5 mb-4'>
              <DvLabelInput
                required
                type='text'
                label={lang.agencyBrand}
                id="agencyBrandName"
                disabled
                name="agencyBrandName"
                errorIocnClass="tooltip-icon"
                errorClass="agencyPage"
                value={formik.values.agencyBrandName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={(formik.errors.agencyBrandName && formik.touched.agencyBrandName) && formik.errors.agencyBrandName}
              />
            </div>
            <div className='col-5 text-app mt-2 mb-4'>
              <DvLabelInput
                required
                type='email'
                id="agencyEmail"
                name="agencyEmail"
                disabled
                value={formik.values.agencyEmail}
                label={lang.e_mail}
                onChange={formik.handleChange}
                errorIocnClass="tooltip-icon"
                errorClass="agencyPage"
                onBlur={formik.handleBlur}
                error={(formik.errors.agencyEmail && formik.touched.agencyEmail) && formik.errors.agencyEmail}
              />
            </div>
            <div className='col-5 text-app mt-2 mb-4'>

              <PhoneNoInput
                inputClass="dv_form_control"
                setRef={(childRef) => (phoneRef.current = childRef.current)}
                // errorMessage={errorMessage}
                iso2={formik.values.agencyCountryCode}
                countryCode={formik.values.agencyCountryCode}
                disabled={false}
                onChange={(data) => setAgencyPhoneInput(data)}
                phoneNo={
                  formik.values.agencyCountryCode + formik.values.agencyPhoneNumber
                }
                errorIocnClass="tooltip-icon"
                errorClass="agencyPage"
              // onChange={(data) => setPhoneInput(data)}
              ></PhoneNoInput>
              <p className='form__label'>Phone Number*</p>
            </div>
            <div className='col-8 text-app mt-2 mb-3'>
              <DvLabelInput
                label="About Agency"
                multiline
                isTextArea
                id="aboutAgency"
                name="aboutAgency"
                onChange={formik.handleChange}
                value={formik.values.aboutAgency}
              />
            </div>
            <div className='col-5 text-app mt-2 mb-4'>
              <DvLabelInput
                required
                type='text'
                label={lang.website}
                id="website"
                name="website"
                disabled
                value={formik.values.website}
                onChange={formik.handleChange}
                errorIocnClass="tooltip-icon"
                errorClass="agencyPage"
                onBlur={formik.handleBlur}
                error={(formik.errors.website && formik.touched.website) && formik.errors.website}
              />
            </div>
            <div className='col-5 text-app mt-2 mb-4'>
              <p className='label__title'>Social Links</p>
              <div className='mb-4'>
                <DvLabelInput
                  label="Twitter"
                  name={`socialMediaLink.Twitter`}
                  value={formik.values.socialMediaLink.Twitter}
                  onChange={formik.handleChange}
                  isAgency
                />
                <img className='position-absolute' width="15px" height="15px" src={TWITTER_AG} style={{ top: "23%", left: "90%" }} />
              </div>
              <div className='mb-4'>
                <DvLabelInput
                  label="Instagram"
                  name={`socialMediaLink.Instagram`}
                  value={formik.values.socialMediaLink.Instagram}
                  onChange={formik.handleChange}
                  isAgency
                />
                <img className='position-absolute' width="15px" height="15px" src={INSTARGAM_AG} style={{ top: "54%", left: "90%" }} />
              </div>
              <div className='mb-4'>
                <DvLabelInput
                  label="Facebook"
                  name={`socialMediaLink.Facebook`}
                  value={formik.values.socialMediaLink.Facebook}
                  onChange={formik.handleChange}
                  isAgency
                />
                <img className='position-absolute' width="15px" height="15px" src={FACEBOOK_AG} style={{ top: "85%", left: "90%" }} />
              </div>
            </div>
            <div className='col-5 text-app mt-2 mb-4'>
              <DvLabelInput
                required
                type='number'
                label={lang.noofcreator}
                id="noOfCreators"
                name="noOfCreators"
                disabled
                value={formik.values.noOfCreators}
                onChange={formik.handleChange}
                errorIocnClass="tooltip-icon"
                errorClass="agencyPage"
                onBlur={formik.handleBlur}
                onWheel={(e) => {
                  e.target.blur()
                  e.stopPropagation()
                }}
                onKeyDown={blockInvalid}
                error={(formik.errors.noOfCreators && formik.touched.noOfCreators) && formik.errors.noOfCreators}
              />
            </div>
            <div className='col-5 text-app mt-2 mb-4'>
              <DvLabelInput
                required
                istext="%"
                type="number"
                label="Standard commisiion"
                id="standardCommission"
                name="standardCommission"
                disabled
                value={formik.values.standardCommission}
                onChange={formik.handleChange}
                errorIocnClass="tooltip-icon"
                errorClass="agencyPage"
                onBlur={formik.handleBlur}
                onWheel={(e) => {
                  e.target.blur()
                  e.stopPropagation()
                }}
                onKeyDown={blockInvalid}
                error={(formik.errors.standardCommission && formik.touched.standardCommission) && formik.errors.standardCommission}
              />
            </div>
            <div className='col-5 text-app mt-2 mb-4'>
              <DvLabelInput
                required
                type='number'
                label={lang.yearsinbusiness}
                id="yearInBusiness"
                name="yearInBusiness"
                disabled
                value={formik.values.yearInBusiness}
                onChange={formik.handleChange}
                errorIocnClass="tooltip-icon"
                errorClass="agencyPage"
                onWheel={(e) => {
                  e.target.blur()
                  e.stopPropagation()
                }}
                onKeyDown={blockInvalid}
                onBlur={formik.handleBlur}
                error={(formik.errors.yearInBusiness && formik.touched.yearInBusiness) && formik.errors.yearInBusiness}
              />
            </div>
            <div className='col-5 text-app mt-2 mb-4'>
              {/* <p className="text-muted mb-1">Tax Informations</p> */}
              {/* <div className="mb-3">
                <DvLabelInput
                  required={taxField?.mandatory}
                  type='text'
                  label="Field Name"
                  id="fieldName"
                  name="taxInformation.fieldName"
                  disabled
                  value={formik.values.taxInformation.fieldName}
                  errorIocnClass="tooltip-icon"
                  errorClass="agencyPage"
                /></div> */}
              <div className="mb-3">
                <DvLabelInput
                  required={taxField?.mandatory}
                  type='text'
                  label={taxField?.placeHolderText}
                  id="value"
                  disabled
                  name="taxInformation.value"
                  value={formik.values.taxInformation.value}
                  onChange={formik.handleChange}
                  errorIocnClass="tooltip-icon"
                  errorClass="agencyPage"
                  onBlur={formik.handleBlur}
                  error={(formik.errors.taxInformation?.value && formik.touched.taxInformation?.value) && formik.errors.taxInformation?.value}
                />
              </div>
            </div>
            <p className='label__title col-6 mb-3'>Billing Address*</p>
            <div className='col-12 text-app pl-3 d-flex'>
              <div className='col-3 pl-0'>
                <DvLabelInput
                  required
                  type='text'
                  label="Zipcode"
                  id="zipCode"
                  name="zipCode"
                  disabled
                  value={billingAddress.zipCode}
                  onChange={(e) => changeBillingAddress(e, 'zipCode')}
                  errorIocnClass="tooltip-icon"
                  errorClass="agencyPage"
                /></div>
              <div className='col-3 px-0'>
                <DvLabelInput
                  required
                  type='text'
                  label="City"
                  disabled
                  id="city"
                  name="city"
                  value={billingAddress.city}
                  onChange={changeBillingAddress}
                  errorIocnClass="tooltip-icon"
                  errorClass="agencyPage"
                /></div>
              <div className='col-3'>
                <DvLabelInput
                  required
                  type='text'
                  label="State"
                  id="state"
                  disabled
                  name="state"
                  value={billingAddress.state}
                  onChange={changeBillingAddress}
                  errorIocnClass="tooltip-icon"
                  errorClass="agencyPage"
                /></div>

            </div>
            <div className='col-12 d-flex pl-0 mt-3'>
              <div className='col-3 pl-3'>
                <DvLabelInput
                  required
                  type='text'
                  label="Country"
                  id="country"
                  name="country"
                  disabled
                  value={billingAddress.country}
                  onChange={changeBillingAddress}
                  errorIocnClass="tooltip-icon"
                  errorClass="agencyPage"
                /></div>
              <div className='col-5 pl-0 mb-3'>
                <DvLabelInput
                  required
                  type='text'
                  label="Address"
                  id="address"
                  name="address"
                  disabled
                  value={billingAddress.address}
                  onChange={changeBillingAddress}
                  errorIocnClass="tooltip-icon"
                  errorClass="agencyPage"
                />
              </div>

            </div>
            <p className='label__title col-6 mb-3'>Physical Address</p>
            <div className='col-12 text-app pl-0 d-flex'>

              <div className='col-3 mb-3'>
                <DvLabelInput
                  type='text'
                  label="Zipcode"
                  id="zipCode"
                  disabled
                  name="zipCode"
                  value={physicalAddress.zipCode}
                  onChange={(e) => changePhysicalAddress(e, 'zipCode')}
                /></div>
              <div className='col-3'>
                <DvLabelInput
                  type='text'
                  label="City"
                  id="city"
                  disabled
                  name="city"
                  value={physicalAddress.city}
                  onChange={changePhysicalAddress}
                /></div>
              <div className='col-3'>
                <DvLabelInput
                  type='text'
                  label="State"
                  id="city"
                  disabled
                  name="state"
                  value={physicalAddress.state}
                  onChange={changePhysicalAddress}
                /></div>

            </div>
            <div className='col-12 d-flex pl-0 mb-4'>
              <div className='col-3'>
                <DvLabelInput
                  type='text'
                  label="Country"
                  disabled
                  id="country"
                  name="physicalAddress.country"
                  value={physicalAddress.country}
                  onChange={changePhysicalAddress}
                /></div>
              <div className='col-5 pl-0 mb-3'>
                <DvLabelInput
                  type='text'
                  label="Address"
                  id="address"
                  name="address"
                  disabled
                  value={physicalAddress.address}
                  onChange={changePhysicalAddress}
                /></div>

            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
       .rightside{
        width:100%;
      }
      :global(.dv_form_control.dt__input),
      :global(.dv__phoneInput){
        background:var(--l_app_bg) !important;
        color:var(--l_app_text) !important;
        font-weight:normal !important;
        border:1px solid #ced4da !important;
        border-radius:10px !important;
      }
      :global(.dv_form_control:focus){
        background:var(--l_app_bg)  !important;
        color:var(--l_app_text) !important;
      }
      :global(.dv_form_control:focus){
        background:var(--l_app_bg)  !important;
        color:var(--l_app_text) !important;
      }
      :global(.arrow_on_right){
        top: 69%;
        right:4%;
      }
      :global(.dv_form_control::placeholder) {
        font-size: 0.8rem !important;
        text-transform:capitalize !important;
        color: var(--l_light_grey1) !important;
      }
      :global(.dv_form_control){
        background:#fff !important;
        color:#000 !important;
      }
      .camestyle{
        top: 4.5rem;
    left: 5.6rem;
      }
      .form__label {
        background-color: var(--l_app_bg);
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
      :global(.label__title){
        color:var(--l_app_text);
        font-weight:bold;
        font-size:16px;
      }
      .imgBox{
        Width:90px;
        Height:90px;
        padding:3px;
        border:2px solid #DCDCDC;
        border-radius:50%;
        object-fit:fill;
      }
      :global(.borderall){
        border:1px solid #DCDCDC;
        border-radius:12px;
        height:88vh;
      }
      :global(.agencyPage){
        right:1.8rem !important;
      }
      :global(.tooltip-icon){
        right:10px !important;
      }
      :global(.dv_form_control.dt__input){
        border-radius: 10px !important;
      }
      :global(.form__field){
        color:var(--l_app_text) !important;
      }
      `}</style>
    </div>
  )
}

export default AgencyProfile