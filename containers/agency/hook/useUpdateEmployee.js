import React, { useEffect, useState } from 'react'
import { getProfile, phoneNumber, updateProfile } from '../../../services/auth';
import { ParseToken } from '../../../lib/parsers/token-parser';
import { getOwnerData } from '../../../redux/actions/agency';
import { useDispatch, useSelector } from 'react-redux';
import { getCookie } from '../../../lib/session';
import { getCognitoToken } from '../../../services/userCognitoAWS';
import { updateEmployee } from '../../../services/agency';
import { Toast, startLoader } from '../../../lib/global';
import { stopLoader } from '../../../lib/global/loader';
import { FOLDER_NAME_IMAGES } from '../../../lib/config/creds';

const useUpdateEmployee = () => {
  const dispatch = useDispatch();
  const uid = getCookie("uid");
  const token = getCookie("token");
  const ownerData = useSelector((state) => state?.ownerData)
  const [profilePic, setProfilePic] = useState(ownerData?.profilePic);
  const [firstName, setFirstName] = useState(ownerData?.firstName);
  const [lastName, setLastName] = useState(ownerData?.lastName);
  const [agencyUserId, setAgencyUserId] = useState(ownerData?._id);
  const [phoneInput, setPhoneInput] = useState();
  const [employeeData, setEmployeeData] = useState({ ...employeeData });
  console.log(phoneInput, "phoneInput")
  useEffect(() => {
    if (ownerData) {
      setProfilePic(ownerData?.profilePic)
      setFirstName(ownerData?.firstName),
        setLastName(ownerData?.lastName),
        setAgencyUserId(ownerData?._id)
    }
  }, [ownerData])
  const fecthProfileDetails = async () => {
    const res = await getProfile(uid, ParseToken(token));
    if (res.status === 200) {
      dispatch(getOwnerData(res.data.data))
      setEmployeeData(res.data.data);
    }
  };
  const onProfileImageChange = async (file, url) => {
    setProfilePic({
      file,
      url,
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
      Toast(e.res.data.message)
      return;
    }
  }
  const updateEmployeeData = async () => {
    const fileUploaderAWS = (await import('../../../lib/UploadAWS/uploadAWS')).default
    let payload = {
      profilePic: profilePic.url,
      lastName: lastName,
      firstName: firstName,
    }
    if (profilePic.file) {
      const cognitoToken = await getCognitoToken();
      const tokenData = cognitoToken?.data?.data;
      const imgFileName = `${Date.now()}_${firstName?.toLowerCase()}`;
      const folderName = `users/${FOLDER_NAME_IMAGES.profile}`;
      let url = await fileUploaderAWS(
        profilePic.file[0],
        tokenData,
        imgFileName,
        false,
        folderName,
        null, null, null, false
      );
      payload.profilePic = url;
    } else {
      payload.profilePic = profilePic;
    }
    if (ownerData?.phoneNumber !== phoneInput.phoneNo || ownerData.countryCode !== phoneInput.countryCode) {
      try {
        await updatePhone();
      } catch (e) {
        Toast(e?.response?.data?.message, "error");
        return;
      }
    }
    updateProfile(payload)
      .then((res) => {
        startLoader()
        let response = res;
        if (response.status == 200) {
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

  return (
    {
      employeeData,
      firstName,
      lastName,
      profilePic,
      phoneInput,
      setPhoneInput,
      setFirstName,
      setLastName,
      fecthProfileDetails,
      onProfileImageChange,
      updateEmployeeData
    }
  )
}

export default useUpdateEmployee