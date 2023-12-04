import React, { useEffect, useState } from 'react'
import { CAMERA_AG } from '../../lib/config/homepage'
import Button from '../../components/button/button'
import PhoneNoInput from '../../components/formControl/phoneNoInput'
import { open_dialog } from '../../lib/global/loader'
import DvLabelInput from '../../components/DVformControl/DvLabelInput'
import useAgencyRegistration from './hook/useAgencyRegistration'
import { useSelector } from 'react-redux'
import { s3ImageLinkGen } from '../../lib/UploadAWS/s3ImageLinkGen'
import ImagePicker from '../../components/formControl/imagePicker'
import Image from '../../components/image/image'
import { handleContextMenu } from '../../lib/helper'

const AgencyMyprofile = () => {
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
  const { formik, lang, pic, isValid, onProfileImageChange, phoneRef, setPhoneInput, fecthProfileDetails, updateOwnerProfile
  } = useAgencyRegistration()
  useEffect(() => {
    fecthProfileDetails();
  }, [])
  return (
    <div className='card_bg vh-100 rightside px-4'>
      <div className='pt-4'>
        <h3 className='text-app bold'>My Profile</h3>
      </div>
      <div className='mt-4 borderall col-12' style={{ overflowX: "hidden", overflowY: "auto" }}>
        <div className='mt-3 d-flex flex-row'>
          <div className='col-1 position-relative mr-5 callout-none' onContextMenu={handleContextMenu}>
            {!pic?.url ? <img
              src={s3ImageLinkGen(S3_IMG_LINK, pic, 100, 200, 200)}
              className="imgBox"
            /> : <img
              src={pic.url}
              className="imgBox"
            />}
          </div>

          <div className='position-absolute camestyle'>
            <ImagePicker
              aspectRatio={1 / 1}
              cropRoundImg={false}
              onChange={onProfileImageChange}
              render={() => {
                return (
                  <span
                    className="camestyle"
                    style={{ cursor: "pointer" }}
                  >
                    <Image src={CAMERA_AG} width={35}
                      height={35} />
                  </span>
                );
              }}
            ></ImagePicker>
            {/* <img
              src={CAMERA_AG}
              width={35}
              height={35}
            /> */}
          </div>
          <div className='col-11 position-relative'>
            <div className=' position-absolute' style={{ top: "3%", left: "70%", zIndex: 1 }}>
              <Button
                type="submit"
                fclassname="py-1 btnGradient_bg radius_22"
                btnSpanClass="px-1 fntSz15"
                isDisabled={!isValid && !formik.values.phoneNumber && !formik.values.countryCode}
                onClick={updateOwnerProfile}
              >Save</Button>
            </div>
            <div className='col-5 text-dark'>
              <DvLabelInput
                required
                type='text'
                id="firstName"
                name="firstName"
                label={lang.firstNamePlaceholder}
                value={formik.values.firstName}
                onChange={formik.handleChange}
                errorIocnClass="tooltip-icon"
                errorClass="agencyPage"
                onBlur={formik.handleBlur}
                error={(formik.errors.firstName && formik.touched.firstName) && formik.errors.firstName}
              />
            </div>
            <div className='col-5 text-dark my-3'>
              <DvLabelInput
                required
                type='text'
                id="lastName"
                name="lastName"
                label={lang.lastNamePlaceholder}
                value={formik.values.lastName}
                onChange={formik.handleChange}
                errorIocnClass="tooltip-icon"
                errorClass="agencyPage"
                onBlur={formik.handleBlur}
                error={(formik.errors.lastName && formik.touched.lastName) && formik.errors.lastName}
              />
            </div>
            <div className='col-5 text-dark my-3' onClick={() =>
              open_dialog("ChangeEmail", { closeAll: true, isAgency: true })
            }>
              <DvLabelInput
                required
                type='email'
                id="email"
                name="email"
                value={formik.values.email}
                disabled
                onChange={formik.handleChange}
                label={lang.e_mail}
                errorIocnClass="tooltip-icon"
                errorClass="agencyPage"
                onBlur={formik.handleBlur}
                error={(formik.errors.email && formik.touched.email) && formik.errors.email}
              />
            </div>
            <div className='col-5 text-dark my-3'>

              <PhoneNoInput
                inputClass="dv_form_control"
                setRef={(childRef) => (phoneRef.current = childRef.current)}
                // errorMessage={errorMessage}
                iso2={formik.values.countryCode}
                countryCode={formik.values.countryCode}
                disabled={false}
                onChange={(data) => setPhoneInput(data)}
                phoneNo={
                  formik.values.countryCode + formik.values.phoneNumber
                }
                errorIocnClass="tooltip-icon"
                errorClass="agencyPage"
              // onChange={(data) => setPhoneInput(data)}
              ></PhoneNoInput>
              <p className='form__label'>Phone Number*</p>
            </div>
            <div className='col-5 d-flex flex-column pt-2'>
              <p className='bold cursorPtr' style={{ color: "var(--l_base)" }} onClick={() => { open_dialog("ChangePassword", { isAgency: true }) }} >Reset Password</p>
              <p className='bold cursorPtr' style={{ color: "var(--l_base)" }}
                onClick={() => { open_dialog("Logout",) }}
              > Logout</p>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
       .rightside{
        width:100%;
      }
      :global(.selected-dial-code){
        color:var(--l_app_text) !important;
      }
      :global(.agencyPage){
        right:1.8rem !important;
      }
      :global(.tooltip-icon){
        right:10px !important;
      }

      :global(.dv_form_control.dt__input),
      :global(.dv__phoneInput){
        background:var(--l_app_bg) !important;
        color:var(--l_app_text) !important;
        font-weight:normal !important;
        border:1px solid #ced4da !important;
        border-radius:10px !important;
      }
      :global(.arrow_on_right){
        top: 69%;
        right:4%;
      }
      .camestyle{
        top: 4.5rem;
    left: 5.6rem;
      }
      :global(.label__title){
        color:#000;
        font-weight:bold;
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
      `}</style>
    </div>
  )
}

export default AgencyMyprofile