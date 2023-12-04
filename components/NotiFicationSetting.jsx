import React, { useEffect, useState } from 'react';
import Switch from './formControl/switch';
import SlickSwitch from './formControl/slickSwitch';
import { useTheme } from 'react-jss';
import CustomTooltip from './customTooltip';
import isMobile from '../hooks/isMobile';
import Header from './header/header';
import Button from './button/button';
import { getProfile, updateProfile } from '../services/auth';
import { Toast } from '../lib/global/loader';
import { Arrow_Left2 } from '../lib/config/homepage';
import useProfileData from '../hooks/useProfileData';
import { useDispatch, useSelector } from 'react-redux';
import dynamic from 'next/dynamic';
import useLang from '../hooks/language';
import { isAgency } from '../lib/config/creds';
import { getCookie, setCookie } from '../lib/session';
import { ParseToken } from '../lib/parsers/token-parser';
import { setProfile } from '../redux/actions';

const NotificationSetting = (props) => {
  const theme = useTheme();
  const [mobileView] = isMobile();
  const [profile] = useProfileData();
  const [lang] = useLang();
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);
  const dispatch = useDispatch();
  const [pushNotifications, setPushNotifications] = useState({});
  const [emailnotifications, setEmailNotifications] = useState({});
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
  const togglePushNotification = (notificationKey) => {
    setPushNotifications({
      ...pushNotifications,
      [notificationKey]: !pushNotifications[notificationKey],
    });
  };
  const toggleAllNotificationsEmail = (notificationKey) => {
    setEmailNotifications({
      ...emailnotifications,
      [notificationKey]: !emailnotifications[notificationKey],
    });
  };

  useEffect(() => {
    setPushNotifications(profile.userTypeCode === 1
      ? {
        messages: profile?.userPreference?.pushNotifications?.messages || false,
        mentions: profile?.userPreference?.pushNotifications?.mentions || false,
        stories: profile?.userPreference?.pushNotifications?.stories || false,
        liveStreams: profile?.userPreference?.pushNotifications?.liveStreams || false,
        videoCall: profile?.userPreference?.pushNotifications?.videoCall || false,
        shoutout: profile?.userPreference?.pushNotifications?.shoutout || false,
      }
      : {
        messages: profile?.userPreference?.pushNotifications?.messages || false,
        stories: profile?.userPreference?.pushNotifications?.stories || false,
        liveStreams: profile?.userPreference?.pushNotifications?.liveStreams || false,
        comments: profile?.userPreference?.pushNotifications?.comments || false,
        likes: profile?.userPreference?.pushNotifications?.likes || false,
        videoCall: profile?.userPreference?.pushNotifications?.videoCall || false,
        shoutout: profile?.userPreference?.pushNotifications?.shoutout || false,
        purchases: profile?.userPreference?.pushNotifications?.purchases || false,
        mentions: profile?.userPreference?.pushNotifications?.mentions || false,
        follow: profile?.userPreference?.pushNotifications?.follow || false,
      })
    setEmailNotifications(
      profile.userTypeCode === 1 ? { purchases: profile?.userPreference?.emailNotifications?.purchases || false } :
        { virtualOrders: profile?.userPreference?.emailNotifications?.virtualOrders || false, purchases: profile?.userPreference?.emailNotifications?.purchases || false }
    );
    console.log("profileeeeeee", profile)
  }, [profile])

  const toggleAllNotifications = (value) => {
    const updatedPushNotifications = {};
    for (const key in pushNotifications) {
      updatedPushNotifications[key] = value;
    }
    setPushNotifications(updatedPushNotifications);
  };
  const toggleNotificationEmail = (value) => {
    const updatedPushNotifications = {};
    for (const key in emailnotifications) {
      updatedPushNotifications[key] = value;
    }
    setEmailNotifications(updatedPushNotifications);
  };
  const updatedPushNotifications = async () => {
    try {
      const data = {
        emailNotifications: { ...emailnotifications },
        pushNotifications: { ...pushNotifications }
      };
      const res = await updateProfile(data);
      if (res.status === 200) {
        fecthProfileDetails();
        Toast(res.data.message, "success");
      }

    } catch (error) {
      console.log(error)
      console.error("An error occurred:", error);
      Toast(error?.response?.data?.message || lang.anErrorOccured, "error");
    }
  }
  const fecthProfileDetails = async () => {
    const uid = isAgency() ? selectedCreatorId : getCookie("uid");
    const res = await getProfile(uid, getCookie("token"), getCookie('selectedCreatorId'));
    setCookie("profileData", JSON.stringify({
      ...res?.data?.data,
    }))
    setCookie("userPreference", JSON.stringify(
      res?.data?.data.userPreference,
    ))
    dispatch(
      setProfile({
        ...res?.data?.data,
        userPreference: { ...res?.data?.data.userPreference }
      })
    );
  };
  return (
    <div className='col-12 px-0'>
      {!mobileView ? <div className='d-flex justify-content-between'>
        <p className='sectionHeading m-0 font-weight-bold position-sticky'>{lang.notificationsetting}</p>
        <Button
          children="Save"
          fclassname="col-2 btnGradient_bg py-1 radius_22"
          onClick={updatedPushNotifications}
        />
      </div> :
        <Header
          id="notificationHeader"
          back={props.onClose}
          closeTrigger={props.onCloseDrawer}
          icon={Arrow_Left2}
          iconId="#arrowleft2"
          title={"Notifications"}

        />
      }

      <div className='col-12' style={{ paddingTop: mobileView ? "9vh" : "", height: mobileView ? "calc(calc(var(--vhCustom,1vh) * 100) - 64px)" : "80vh", overflow: "auto" }}>
        <div className='emailNotification-container'>
          <div className='col-12 col-lg-8 px-0 mt-4 d-flex align-items-center justify-content-between'>
            <p className='fntSz16 m-0 font-weight-bold'>Email Notifications</p>
            <div className='pt-3 pr-1 pr-md-2 mr-1 mr-md-2'>
              <SlickSwitch
                checked={Object?.values(emailnotifications).every(val => val)}
                onChange={() => toggleNotificationEmail(!Object.values(emailnotifications).every(val => val))}
              />            </div>
          </div>
          <div className='col-12 col-lg-8 px-0 mt-2 mt-md-3 d-flex flex-column radius_8' style={{ background: theme.dialogSectionBg }}>
            {Object?.entries(emailnotifications).map(([key, value], index, array) => {
              const isLastItem = index === array.length - 1;
              return (
                <div key={index} className={`d-flex justify-content-between p-2 p-md-2 align-items-center mx-1 mx-md-2 ${!isLastItem ? "border-bottom" : ""}`}>
                  <p className='fntSz14 m-0 font-weight-400 text-left text-capitalize'>{key === "virtualOrders" ? "My Orders" : key}</p>
                  <div className='pt-3'>
                    <SlickSwitch
                      checked={value}
                      onChange={() => toggleAllNotificationsEmail(key)}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <div className='pushNotification-container'>
          <div className='col-12 col-lg-8 px-0  mt-2 mt-md-3 d-flex align-items-center justify-content-between'>
            <div className='d-flex'>
              <p className='fntSz16 m-0 font-weight-bold'>Push Notifications</p>
              <CustomTooltip
                placement="top"
                tooltipTitle={lang.detailNotification}
              />
            </div>
            <div className='pt-3 pr-1 pr-md-2 mr-1 mr-md-2'>
              <SlickSwitch
                checked={Object.values(pushNotifications).every(val => val)}
                onChange={() => toggleAllNotifications(!Object.values(pushNotifications).every(val => val))}
              />                </div>
          </div>
          <div className='col-12 col-lg-8  px-0  mt-2 mt-md-3 d-flex flex-column radius_8' style={{ background: theme.dialogSectionBg }}>
            {Object.entries(pushNotifications).map(([key, value], index, array) => {
              const isLastItem = index === array.length - 1;
              return (
                <div key={index} className={`d-flex justify-content-between p-2 p-md-2 align-items-center  mx-1 mx-md-2 ${!isLastItem ? "border-bottom" : ""}`}>
                  <p className='fntSz14 m-0 font-weight-400 text-left text-capitalize'>
                    {key === "shoutout" ? "Custom Request Orders" : key === "videoCall" ? "Video Calls" : key === "liveStreams" ? "Live Streams" : key === "follow" ? "follows" : key}
                  </p>
                  <div className='pt-3'>
                    <SlickSwitch
                      checked={value}
                      onChange={() => togglePushNotification(key)}
                    />
                  </div>
                </div>
              )
            })}

          </div>
        </div>
      </div>
      {mobileView && <div className='col-12 px-0 d-flex align-items-center justify-content-center card_bg py-3'>
              <Button
                children="Save"
                fclassname="col-10 btnGradient_bg py-1 radius_22 px-0"
                onClick={updatedPushNotifications}
              />
      </div>}
      <style jsx>{`
      .border-bottom{
        border-bottom: 1px solid var(--l_border) !important;
      }
      .profile-pic{
        width:24px;
        height:24px;
      }
      `}</style>
    </div>
  );
}

export default NotificationSetting;
