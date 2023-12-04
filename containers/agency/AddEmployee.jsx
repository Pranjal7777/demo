import React, { useEffect } from 'react'

import { CAMERA_AG } from '../../lib/config/homepage'
import Button from '../../components/button/button'
import Image from '../../components/image/image'
import { useRouter } from 'next/router'
import DVphoneno from '../../components/DVformControl/DVphoneno'
import isMobile from '../../hooks/isMobile'
import useAddEmployee from './hook/useAddEmployee';
import { Paper } from '@material-ui/core'
import CheckOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import { s3ImageLinkGen } from '../../lib/UploadAWS/s3ImageLinkGen'
import ImagePicker from '../../components/formControl/imagePicker'
import { desktopIcon } from '../../lib/config/placeholder'
import DvLabelInput from '../../components/DVformControl/DvLabelInput'
import { useDispatch, useSelector } from 'react-redux'
import PhoneNoInput from '../../components/formControl/phoneNoInput'
import { PROFILE_BACK_ICON } from '../../lib/config/profile'
import Icon from '../../components/image/icon'
import { handleContextMenu } from '../../lib/helper'

const AddEmployee = () => {
  const router = useRouter();
  const [mobileView] = isMobile();
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
  const dispatch = useDispatch();
  const {
    formik,
    pic,
    uid,
    lang,
    phone,
    phoneRef,
    isPhoneValid,
    phoneInput,
    passwordValidationScreen,
    passwordCheck,
    isPasswordValid,
    isValid,
    setPic,
    setPassvalidScreen,
    addEmployeeHandler,
    validateEmailAddress,
    setPhone,
    setPhoneInput,
    validatePhoneNo,
    onProfileImageChange,
    fecthProfileDetails,
    updateEmployeeData
  } = useAddEmployee();
  const employeeData = useSelector((state) => state?.employeeData)

  useEffect(() => {
    if (router.query.id) {
      fecthProfileDetails(router.query.id)
    }
  }, [router.query.id])
  return (
    <div className='card_bg vh-100 rightside'>
      <div className='py-4 pl-5  d-flex ' >
        <Icon
          icon={`${PROFILE_BACK_ICON}#_Icons_Arrow_Left`}
          size={20}
          class='mr-2 mb-2 cursorPtr'
          alt="cross icon"
          viewBox="0 0 40 40"
          color="var(--l_app_text)"
          onClick={() => router.back()}
        />
        {router.query.id && <h5 className='text-app text-center mt-1'>Edit</h5>}
      </div>
      <div className='col-12 d-flex flex-row pt-4' >
        <div className='col-2 pr-0' style={{ maxWidth: "11.67%" }}>
          <div className='col-1 position-relative mr-5 callout-none' onContextMenu={handleContextMenu}>
            {router.query.id ? !pic?.url ? <img
              src={s3ImageLinkGen(S3_IMG_LINK, pic, 100, 200, 200)}
              className="imgBox"
            /> : <img src={pic.url} className="imgBox callout-none" />
              :
              pic?.url ? <img
                src={pic?.url}
                className="imgBox"
              /> : <img src={desktopIcon} className="imgBox" />
            }
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
                    <Image src={CAMERA_AG} width={30}
                      height={30} />
                  </span>
                );
              }}
            ></ImagePicker>
          </div>
          <p className='text-muted text-center py-2 fntSz12'>Add Profile Pic *</p>
        </div>
        <div className='col-10 position-relative pl-0'>
          <div className=' position-absolute' style={{ top: "-25%", left: "74%", zIndex: 1 }}>
            <Button
              type="submit"
              fclassname="py-1 btnGradient_bg radius_22"
              btnSpanClass="px-1 fntSz15"
              isDisabled={!router.query.id && (!isValid || !pic?.url || !isPasswordValid)}
              onClick={!router.query.id ? addEmployeeHandler : updateEmployeeData}
            >{!router.query.id ? "Add" : "Update"}</Button>
          </div>
          <div className='col-12 d-flex'>
            <div className='col-5 mb-4'>
              <DvLabelInput
                label={lang.employeefirstname}
                placeholder={lang.employeefirstname}
                id="firstName"
                name="firstName"
                errorIocnClass="tooltip-icon"
                errorClass="agencyPage"
                type="text"
                required
                error={(formik.errors.firstName && formik.touched.firstName) ? formik.errors.firstName : null}
                {...formik.getFieldProps('firstName')}
              />
            </div>
            <div className='col-5'>
              <DvLabelInput
                label={lang.employeelastname}
                placeholder={lang.employeelastname}
                id="lastName"
                name="lastName"
                errorClass="agencyPage"
                errorIocnClass="tooltip-icon"
                type="text"
                required
                error={(formik.errors.lastName && formik.touched.lastName) ? formik.errors.lastName : null}
                {...formik.getFieldProps('lastName')}
              />
            </div>

          </div>
          {/* <div className='col-12'>
            <div className='col-5 mb-4'>
              <DvLabelInput
                label={lang.usernamePlaceholder}
                placeholder={lang.usernamePlaceholder}
                name="username"
                {...formik.getFieldProps('username')}
              />
            </div>
          </div> */}
          <div className='col-12 d-flex'>
            <div className='col-5 mb-3'>
              <DvLabelInput
                label={lang.Email}
                placeholder={lang.Email}
                type="email"
                id="email"
                name="email"
                errorClass="agencyPage"
                onBlur={() => validateEmailAddress()}
                errorIocnClass="tooltip-icon"
                error={(formik.errors.email && formik.touched.email) ? formik.errors.email : null}
                value={formik.values.email}
                required
                {...formik.getFieldProps('email')}
              />
            </div>
            <div className='col-5'>
              {!router.query.id ? <DVphoneno
                labelTitle="Phone Number"
                setRef={(childRef) => (phoneRef.current = childRef.current)}
                setPhone={setPhone}
                setPhoneInput={setPhoneInput}
                placeholder='Phone Number'
                phoneInput={phoneInput}
                onBlur={() => validatePhoneNo()}
                isPhoneValid={isPhoneValid ? lang.validPhoneNumber : ""}
                typeCheck="phoneNumber"
              />
                :
                <div>
                  <PhoneNoInput
                    inputClass="dv_form_control"
                    setRef={(childRef) => (phoneRef.current = childRef.current)}
                    // errorMessage={errorMessage}
                    iso2={employeeData.countryCode}
                    countryCode={employeeData.countryCode}
                    onChange={(data) => setPhoneInput(data)}
                    phoneNo={
                      employeeData.countryCode + employeeData.phoneNumber
                    }
                    errorIocnClass="tooltip-icon"
                    errorClass="agencyPage"
                    typeCheck="phoneNumber"
                  ></PhoneNoInput>
                  <p className='form__label'>Phone Number</p>
                </div>
              }

            </div>

          </div>
          <div className='col-12'>
            <div className='col-5'>
              {!router.query.id && <DvLabelInput
                required
                ispassword
                label={lang.passwordPlaceholder}
                id="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onFocus={() => setPassvalidScreen(true)}
                onBlur={() => setPassvalidScreen(false)}
              />}
              {passwordValidationScreen && (
                <Paper
                  className={`position-absolute d-block bg-white ${isPasswordValid ? "text-success" : "text-danger"
                    }`}
                  style={!mobileView ? { zIndex: 2, width: "max-content" } : { zIndex: 2, width: 'auto', marginRight: '15px' }}
                >
                  {Object.values(passwordCheck).map((checker) => (
                    <div
                      key={checker.id}
                      className={`d-flex align-items-center p-1 mr-1 ${checker.state ? "text-success" : "text-danger"
                        }`}
                    >
                      <CheckOutlineIcon fontSize="small" className="mr-2" />
                      <p className="mb-0 font-weight-500 text-left" style={{ fontSize: '0.66rem' }}>
                        {checker.str}
                      </p>
                    </div>
                  ))}
                </Paper>
              )}
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
       .rightside{
        width:100%;
      }
      :global(.agencyPage){
        right:1.8rem !important;
      }
      :global(.tooltip-icon){
        right:10px !important;
      }
      :global(.selected-dial-code){
        color:var(--l_app_text) !important;
      }
      :global(.dt__input),
      :global(.dv__phoneInput){
        background:var(--l_app_bg) !important;
        color:var(--l_app_text) !important;
        border:1px solid #ced4da !important;
        border-radius:0.3rem !important;
      }
      :global(.agphone.dv__form_control_profile_input){
        height:2.5vw !important;
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
        background:var(--l_app_bg)  !important;
        color:var(--l_app_text) !important;
      }
      :global(input:-webkit-autofill){
        -webkit-box-shadow : 0 0 0px 1000px var(--l_app_bg) inset !important
      }
      .camestyle{
        top: 3.5rem;
    left: 5.6rem;
      }
      :global(.label__title){
        color:var(--l_app_text);
        font-weight:bold;
      }
      .imgBox{
        Width:90px;
        Height:90px;
        border-radius:50%;
        object-fit:fill;
      }
      :global(.borderall){
        border:1px solid #DCDCDC;
        border-radius:12px;
        height:88vh;
      }
      .form__label {
        background-color: var(--l_app_bg) ;
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

export default AddEmployee