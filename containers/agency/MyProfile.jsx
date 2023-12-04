import React, { useEffect, useRef } from 'react'
import { CAMERA_AG } from '../../lib/config/homepage'
import DVinputText from '../../components/DVformControl/DVinputText'
import PhoneNoInput from '../../components/formControl/phoneNoInput'
import { open_dialog } from '../../lib/global/loader'
import { s3ImageLinkGen } from '../../lib/UploadAWS/s3ImageLinkGen'
import { useDispatch, useSelector } from 'react-redux'
import { getCreatorLinkedList, getCreatorList } from '../../services/agency'
import { getCreatorData } from '../../redux/actions/agency'
import useUpdateEmployee from './hook/useUpdateEmployee'
import ImagePicker from '../../components/formControl/imagePicker'
import Image from '../../components/image/image'
import Button from '../../components/button/button'

const MyProfile = () => {
  const { employeeData, firstName, lastName, profilePic, setPhoneInput, setFirstName, setLastName, fecthProfileDetails, onProfileImageChange, updateEmployeeData } = useUpdateEmployee();
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
  const dispatch = useDispatch()
  useEffect(() => {
    fecthProfileDetails()
    getCretorList();
  }, [])
  const phoneRef = useRef();
  const getCretorList = async () => {
    let payload = {
      offset: 0,
      limit: 10
    }
    const res = await getCreatorLinkedList(payload);
    if (res.status === 200) {
    dispatch(getCreatorData(res.data.data))
   }
  };
  return (
    <div className='card_bg vh-100 rightside px-4'>
      <div className='pt-4'>
        <h3 className='text-app bold'>My Profile</h3>
      </div>
      <div className='mt-4 borderall col-12 position-relative' style={{ overflowX: "hidden", overflowY: "auto" }}>   
        <div className='mt-3 d-flex flex-row'>
          <div className='col-1 position-relative mr-5'>
            {profilePic?.url ?
              <img
                src={profilePic.url}
                className="imgBox"
              />
              : <img
                src={s3ImageLinkGen(S3_IMG_LINK, profilePic, 100, 200, 200)}
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
                    <Image src={CAMERA_AG} width={30}
                      height={30} />
                  </span>
                );
              }}
            ></ImagePicker>
          </div>
          <div className='col-11 position-relative'>
            <div className=' position-absolute' style={{ top: "0", right: "10%", zIndex: 1 }}>
              <Button
                type="submit"
                fclassname="py-1 btnGradient_bg radius_22"
                btnSpanClass="px-1 fntSz15"
                isDisabled={!firstName || !lastName}
                onClick={updateEmployeeData}
              >{"Update"}</Button>
            </div>
            <div className='col-5 text-dark'>
              <DVinputText
                labelTitle="First Name*"
                className="form-control dv_form_control stopBack position-relative"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className='col-5 text-dark mt-2'>
              <DVinputText
                labelTitle="Last Name"
                className="form-control dv_form_control stopBack position-relative"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)} />
            </div>
            <div className='col-5 text-dark mt-2'>
              <DVinputText
                labelTitle="E-mail*"
                className="form-control dv_form_control cursor-pointer dv_appTxtClr"
                value={employeeData?.email}
              />
            </div>
            <div className='col-5 text-dark mt-2'>
              <p className='label__title mb-1'>Phone Number*</p>
              <PhoneNoInput
                inputClass="dv_form_control"
                // errorMessage={errorMessage}
                setRef={(childRef) => (phoneRef.current = childRef.current)}
                iso2={employeeData?.countryCode}
                countryCode={employeeData?.countryCode}
                phoneNo={
                  employeeData?.countryCode + employeeData?.phoneNumber
                }
                errorIocnClass="tooltip-icon"
                errorClass="agencyPage"
                typeCheck="phoneNumber"
                onChange={(data) => setPhoneInput(data)}
              ></PhoneNoInput>
            </div>
            <div className='col-5 d-flex flex-column pt-2'>
              <p className='bold gradient-text cursorPtr' onClick={() => { open_dialog("ChangePassword", { isAgency: true }) }} >Reset Password</p>
              <p className='bold gradient-text cursorPtr'
                onClick={() => open_dialog("Logout", {})}>
                Logout</p>
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
      .gradient-text {
        background-color: #f3ec78;
        background-image: linear-gradient(#FF71A4, #D33BFE);
        background-size: 100%;
        font-size:15px;
        text-align:left;
        -webkit-background-clip: text;
        -moz-background-clip: text;
        -webkit-text-fill-color: transparent; 
        -moz-text-fill-color: transparent;
        padding-left:0.6rem;
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
        background:var(--l_app_bg) !important;
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
        background:var(--l_app_bg) !important;
        color:var(--l_app_text) !important;
      }
      .camestyle{
        top: 4.5rem;
    left: 5.6rem;
      }
      :global(.label__title){
        color:var(--l_app_text);
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
        border:1px solid var(--l_profileCard_bgColor);
        border-radius:12px;
        height:88vh;
        background-color:var(--l_profileCard_bgColor);
      }
      `}</style>
    </div>
  )
}

export default MyProfile