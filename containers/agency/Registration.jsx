import React, { useEffect, useRef, useState } from 'react';
import useLang from '../../hooks/language';
import { BANNER_AG } from '../../lib/config/homepage';
import Button from '../../components/button/button';
import DvSelect from '../../components/DropdownMenu/DvSelect';
import DVphoneno from '../../components/DVformControl/DVphoneno';
import DvLabelInput from '../../components/DVformControl/DvLabelInput';
import DvCheckBox from '../../components/DVformControl/DvCheckBox';
import useAgencyRegistration from './hook/useAgencyRegistration';
import { values } from 'lodash';
import { Paper } from '@material-ui/core';
import CheckOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import isMobile from '../../hooks/isMobile';
import DvAgencyImagePicker from '../../components/DVformControl/DvAgencyImagePicker';
import { handleContextMenu } from '../../lib/helper';
import FigureImage from '../../components/image/figure-image';
import { CLOSE_ICON_WHITE, JUICY_HEADER_DARK_LOGO } from '../../lib/config/logo';
import Icon from '../../components/image/icon';
import { useRouter } from 'next/router';


const Registration = () => {
  const [mobileView] = isMobile();
  const router = useRouter();
  const {
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
  } = useAgencyRegistration();

  const phoneRef = useRef({});
  const phoneownerRef = useRef({});
  return (
    <div className={`h-screen overflow-hidden`}>
      <Icon
        icon={`${CLOSE_ICON_WHITE}#close-white`}
        color={"var(--l_app_text)"}
        width={16}
        height={16}
        viewBox="0 0 12 12"
        class="pointer"
        style={{ position: "fixed", top: "20px", right: "20px", zIndex: "10" }}
        onClick={() => router.back()}
      />
      <div className={`col-12 row p-0 align-items-center justify-content-center m-0 overflow-hidden vh-100`}>
        <div className="vh-100 col-4 px-0 pt-4 overflow-auto scroll-hide card_bg">
          <div className="m-auto text-center ">
            <div className="text-center pt-0">
              <FigureImage
                src={JUICY_HEADER_DARK_LOGO}
                width="190"
                height='75'
                fclassname="m-0 mb-4"
                id="logoUser"
                alt="logoUser"
              />
              <h3 className='text-app bold'>{lang.btnSignUp}</h3>
              <div className='text-muted'>{lang.signupToAdmin}</div>
            </div>
          </div>
          <div className="col-9 d-flex flex-column m-auto pt-4">
            <label className="text-muted">Agency Details</label>
            <div className='mb-3'>
              <DvLabelInput
                required
                type='text'
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
            <div className='mb-3'>
              <DvLabelInput
                required
                type='text'
                label={lang.agencyBrand}
                id="agencyBrandName"
                name="agencyBrandName"
                errorIocnClass="tooltip-icon"
                errorClass="agencyPage"
                value={formik.values.agencyBrandName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={(formik.errors.agencyBrandName && formik.touched.agencyBrandName) && formik.errors.agencyBrandName}
              />
            </div>
            <div className='mb-3'>
              <DvLabelInput
                required
                type='email'
                id="agencyEmail"
                name="agencyEmail"
                value={formik.values.agencyEmail}
                label={lang.e_mail}
                onChange={formik.handleChange}
                errorIocnClass="tooltip-icon"
                errorClass="agencyPage"
                onBlur={formik.handleBlur}
                error={(formik.errors.agencyEmail && formik.touched.agencyEmail) && formik.errors.agencyEmail}
              />
            </div>
            <div className='mb-1'>
              <DVphoneno
                labelTitle="Phone Number"
                setRef={(childRef) => (phoneRef.current = childRef.current)}
                // setPhoneNo={setPhoneNo}
                setPhone={setAgencyPhone}
                setPhoneInput={setAgencyPhoneInput}
                placeholder='Phone Number'
                phoneInput={agencyPhoneInput}
                // onBlur={() => ValidatePhoneNo()}
                isPhoneValid={isPhoneValid ? lang.validPhoneNumber : ""}
                typeCheck="phoneNumber"
              />
            </div>
            <div className='mb-3'>
              <label className="text-muted">Upload Logo <span className='text-danger'>*</span></label>
              <DvAgencyImagePicker
                setPic={setPic}
                agencySignup={true}
                pic={pic?.url}
              />
            </div>
            <div className='mb-3'>
              <DvLabelInput
                required
                label="About Agency"
                multiline
                isTextArea
                id="aboutAgency"
                name="aboutAgency"
                onChange={formik.handleChange}
                value={formik.values.aboutAgency}
              />
            </div>
            <div className='mb-3'>
              <DvLabelInput
                required
                type='link'
                label={lang.website}
                id="website"
                name="website"
                value={formik.values.website}
                onChange={formik.handleChange}
                errorIocnClass="tooltip-icon"
                errorClass="agencyPage"
                onBlur={formik.handleBlur}
                error={(formik.errors.website && formik.touched.website) && formik.errors.website}
              />
            </div>
            <div className='mb-1'>
              <DvSelect
                id="socialMediaLink"
                name="socialMediaLink"
                // setSocialMediaLink={setSocialMediaLink}
                socialMediaLink={formik.values.socialMediaLink}
                formik={formik}
              />
            </div>
            <div className='mb-3'>
              <DvLabelInput
                required
                type='number'
                label={lang.noofcreator}
                id="noOfCreators"
                name="noOfCreators"
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
            <div className='mb-3'>
              <DvLabelInput
                required
                type='number'
                label={lang.yearsinbusiness}
                id="yearInBusiness"
                name="yearInBusiness"
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
            <label className="text-muted">Owner Details</label>

            <div className='mb-3'>
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
            <div className='mb-3'>
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
            <div className='mb-3'>
              <DvLabelInput
                required
                type='email'
                id="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                label={lang.e_mail}
                errorIocnClass="tooltip-icon"
                errorClass="agencyPage"
                onBlur={formik.handleBlur}
                error={(formik.errors.email && formik.touched.email) && formik.errors.email}
              />
            </div>
            <div className="mb-3">
              <DVphoneno
                labelTitle="Phone Number"
                setRef={(childRef) => (phoneownerRef.current = childRef.current)}
                setPhone={setPhone}
                setPhoneInput={setPhoneInput}
                // placeholder='Phone Number'
                id="ownerPhone"
                phoneInput={phoneInput}
                // onBlur={() => ValidatePhoneNo()}
                isPhoneValid={isPhoneValid ? lang.validPhoneNumber : ""}
                typeCheck="phoneNumber"
              />
            </div>
            <div className="mb-3">
              <DvLabelInput
                required
                ispassword
                label="Create Password"
                id="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onFocus={() => setPassvalidScreen(true)}
                onBlur={() => setPassvalidScreen(false)}
              />
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
            <label className="text-muted">Business Details</label>
            <div className="mb-3">
              <DvLabelInput
                required
                istext="%"
                type="number"
                label="Standard commisiion"
                id="standardCommission"
                name="standardCommission"
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
            <p className="text-muted mb-1">Tax Information</p>
            {/* <div className="mb-3">
              <DvLabelInput
              required={taxField?.mandatory}
              type='text'
              label="Field Name"
              id="fieldName"
              name="taxInformation.fieldName"
                value={taxField?.fieldName}
              disabled
              errorIocnClass="tooltip-icon"
              errorClass="agencyPage"
            /></div> */}
            <div className="mb-3">
              <DvLabelInput
                required={taxField?.mandatory}
                type='text'
                label={taxField?.placeHolderText}
                id="value"
                name="taxInformation.value"
                value={formik.values.taxInformation.value}
                onChange={formik.handleChange}
                errorIocnClass="tooltip-icon"
                errorClass="agencyPage"
                onBlur={formik.handleBlur}
                error={(formik.errors.taxInformation?.value && formik.touched.taxInformation?.value) && formik.errors.taxInformation?.value}
              />
            </div>
            <label className="text-muted mb-3">Billing Address *</label>
            <div className='col-12 px-0 d-flex flex-row'>
              <div className='col-6 pl-0 mb-3'>
                <DvLabelInput
                  required
                  type='text'
                  label="Zipcode"
                  id="zipCode"
                  name="zipCode"
                  value={billingAddress.zipCode}
                  // onChange={formik.handleChange}
                  onChange={(e) => changeBillingAddress(e, 'zipCode')}
                  errorIocnClass="tooltip-icon"
                  errorClass="agencyPage"
                />
              </div>
              <div className='col-6 pr-0 mb-3'>
                <DvLabelInput
                  required
                  type='text'
                  label="City"
                  id="city"
                  name="city"
                  value={billingAddress.city}
                  onChange={changeBillingAddress}
                  errorIocnClass="tooltip-icon"
                  errorClass="agencyPage"
                />
              </div>

            </div>
            <div className='col-12 px-0 d-flex flex-row pb-2'>
              <div className='col-6 pl-0 mb-3'>
                <DvLabelInput
                  required
                  type='text'
                  label="State"
                  id="state"
                  name="state"
                  value={billingAddress.state}
                  onChange={changeBillingAddress}
                  errorIocnClass="tooltip-icon"
                  errorClass="agencyPage"
                />
              </div>
              <div className='col-6 pr-0 mb-3'>
                <DvLabelInput
                  required
                  type='text'
                  label="Country"
                  id="country"
                  name="country"
                  value={billingAddress.country}
                  onChange={changeBillingAddress}
                  errorIocnClass="tooltip-icon"
                  errorClass="agencyPage"
                />
              </div>
            </div>
            <div className="mb-3">
              <DvLabelInput
                required
                type='text'
                label="Address"
                id="address"
                name="address"
                value={billingAddress.address}
                onChange={changeBillingAddress}
                errorIocnClass="tooltip-icon"
                errorClass="agencyPage"
              />
            </div>
            <label className="text-muted">Physical Address </label>
            <div className='d-flex flex-row align-items-center mb-3'>
              <p className='text-muted mb-0 pr-2'>Same As Billing Address</p>
              <DvCheckBox
                checked={sameAddress}
                disabled={!billingAddress.address || !billingAddress.zipCode || !billingAddress.city || !billingAddress.state || !billingAddress.country}
                onChange={() => setSameAddress(!sameAddress)}
              />
            </div>
            <div className='col-12 px-0 d-flex flex-row'>
              <div className='col-6 pl-0 mb-3'>
                <DvLabelInput
                  type='text'
                  label="Zipcode"
                  id="zipCode"
                  name="zipCode"
                  disabled={sameAddress}
                  value={physicalAddress.zipCode}
                  onChange={(e) => changePhysicalAddress(e, 'zipCode')}
                />
              </div>
              <div className='col-6 pr-0 mb-3'>
                <DvLabelInput
                  type='text'
                  label="City"
                  id="city"
                  name="city"
                  disabled={sameAddress}
                  value={physicalAddress.city}
                  onChange={changePhysicalAddress}
                />
              </div>

            </div>
            <div className='col-12 px-0 d-flex flex-row'>
              <div className='col-6 pl-0 mb-3'>
                <DvLabelInput
                  type='text'
                  label="State"
                  id="city"
                  name="state"
                  disabled={sameAddress}
                  value={physicalAddress.state}
                  onChange={changePhysicalAddress}
                />
              </div>
              <div className='col-6 pr-0 mb-3'>
                <DvLabelInput
                  type='text'
                  label="Country"
                  id="country"
                  disabled={sameAddress}
                  name="country"
                  value={physicalAddress.country}
                  onChange={changePhysicalAddress}
                />
              </div>
            </div>
            <div className='mb-3'>
              <DvLabelInput
                type='text'
                label="Address"
                id="address"
                name="address"
                disabled={sameAddress}
                value={physicalAddress.address}
                onChange={changePhysicalAddress}
              />
            </div>
            <Button
              fclassname="mt-4 btnGradient_bg radius_22"
              isDisabled={!pic?.url || !isValid || !isPasswordValid || !billingAddress.address || !billingAddress.city || !billingAddress.state || !billingAddress.zipCode || !billingAddress.state || !billingAddress.country}
              onClick={registerAgencyHandler}
            >
              {lang.btnSignUp}
            </Button>
            <div><p className='text-muted text-center py-2 '>{lang.alreadyagency} <a href='/agencyLogin' className='bold gradient_text'>{lang.logoinAsAgency}</a></p></div>
          </div>
        </div>
      </div>
      <style jsx>{`
      
      :global(.MuiOutlinedInput-input){
        padding: 0.6rem 1rem!important;
      }
      .textDark{
        color:#000;
      }
      :global(.agencyPage){
        right:1.8rem !important;
      }
      :global(.tooltip-icon){
        right:10px !important;
      }
      `}</style>
    </div >
  )
}

export default Registration