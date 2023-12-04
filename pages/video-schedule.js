import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "react-jss";
import { getCookie, setCookie } from "../lib/session";
import isMobile from "../hooks/isMobile";
import Wrapper from "../hoc/Wrapper";
import VideoSchedual from "../containers/videoCall/videoSchedual";
import { TIME_ZONE_KEY_LABEL } from "../lib/timezones";
import ViewSchedule from "../containers/videoCall/viewSchedule";
import DvHomeLayout from "../containers/DvHomeLayout";
import { clock_icon_call } from "../lib/config/logo";
import { DOLLAR_ICON } from "../lib/config";
import { open_dialog, startLoader, stopLoader } from "../lib/global/loader";
import useProfileData from "../hooks/useProfileData";
import { getVideoCallSettingsAPI } from "../services/videoCall";
import { useRouter } from "next/router";
import RouterContext from "../context/RouterContext";

const timezone = () => getCookie('zone') || Intl.DateTimeFormat().resolvedOptions().timeZone;

function videoCall(props) {
  const { query } = props;
  const auth = getCookie("auth");
  const theme = useTheme();
  const homePageref = useRef(null);
  const [mobileView] = isMobile();
  const refreshFunction = useRef(null);
  const [selectedZone, setSelectedZone] = useState(TIME_ZONE_KEY_LABEL[timezone().toLowerCase()]);
  const [calendarView, setCalendarView] = useState(true);
  const router = useRouter()
  const [profileData] = useProfileData();

  const handleZoneChange = (option) => {
    setSelectedZone(option);
    setCookie('zone', option.value);
    refreshFunction.current?.();
  };

  const handleToggleView = () => setCalendarView(prev => !prev);

  const optionsData = [
    {
      title: "Price Settings",
      tab: "price",
      iconDetails: {
        icon: DOLLAR_ICON,
        id: "Dollar_tip",
        viewBox: "0 0 28 28",
        color: "var(--l_app_text)",
        size: 25
      },
      onClick: () => { open_dialog("videoCallSettings") }
    },
    {
      title: "Set Schedule",
      tab: "schedule",
      iconDetails: {
        icon: clock_icon_call,
        id: "clock_icon_call",
        viewBox: "0 0 20 20",
        color: "var(--l_app_text)",
        size: 20
      },
      onClick: () => { open_dialog("ScheduleSection") }
    }

  ]

  const handleVideoCallPriceDialog = async () => {
    startLoader();
    try {
      const data = await getVideoCallSettingsAPI(profileData._id)
      stopLoader()
    } catch (error) {
      console.log(error)
      stopLoader()
      mobileView ? router.push("/video-call?setupPrice=true") : open_dialog("videoCallSettings", { disableBack: true, onBackdropClick: true })
    }
  }

  useEffect(async () => {
    handleVideoCallPriceDialog()
  }, [])

  return (
    <RouterContext forLogin={true} forUser={false} forCreator={true} forAgency={true} {...props}>
      <div className={`mv_wrap_videoCall ${mobileView ? "bg_color" : ""}`} ref={homePageref} id="home-page">
        {mobileView ? (
          <Wrapper>
            {calendarView
              ? <ViewSchedule handleToggleView={handleToggleView} refreshFunction={refreshFunction} selectedZone={selectedZone} handleZoneChange={handleZoneChange} />
              : <VideoSchedual handleToggleView={handleToggleView} refreshFunction={refreshFunction} selectedZone={selectedZone} handleZoneChange={handleZoneChange} homePageref={homePageref} />
            }
          </Wrapper>
        ) : (
          <Wrapper>
            <DvHomeLayout
              activeLink="video-schedule"
              pageLink="/video-schedule"
              homePageref={homePageref}
              {...props}
            />
          </Wrapper>
        )}
        <style jsx>
          {`
        .confirmBtn{
          position: fixed;
          width: 100%;
          bottom: 0;
        }
        :global(.MuiFormControl-root.datepicker-active){
          opacity:0;
        }
        :global(.bg-dark-custom),
        :global(.bg_color){
          background:${mobileView ? "var(--l_profileCard_bgColor)" : ""} !important;
        }
        :global(.myAccount_sticky__section_header){
          top: -16px !important;
        }
        .manageBtn{
          position: fixed;
          bottom: 30px;
          right: 25px;
          z-index:10;
        }
        `}
        </style>
      </div>
    </RouterContext>
  );
}

export default videoCall;
