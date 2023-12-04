import React, { useEffect, useRef, useState } from "react";
import Wrapper from "../../hoc/Wrapper";
import dynamic from "next/dynamic";
import useLang from "../../hooks/language";
import { useTheme } from "react-jss";
import PriceSection from "../videoCall/priceSection";
import ScheduleSection from "../videoCall/scheduleSection";
import { useSelector } from "react-redux";
import { open_dialog } from "../../lib/global/loader";
import CommonHeader from "../../components/commonHeader/commonHeader";

const Button = dynamic(() => import("../../components/button/button"), { ssr: false });
const Calendar = dynamic(() => import("../../components/calender/fullCalender"), { ssr: false });

export default function Dv_VideoCallSetting(props) {
  const [lang] = useLang();
  const theme = useTheme();
  const [Iscalendar, setIscalendar] = useState(true);
  const refreshFunction = useRef(null);
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

  useEffect(() => {
    props.homePageref && props.homePageref.current.scrollTo(0, 0);
  }, []);

  const setWeeklyHours = {
    label: 'Set Weekly Hours',
    active: true,
    clickAction: () => open_dialog("ScheduleSection")
  }

  const setPriceSetting = {
    label: 'Price Settings',
    active: false,
    clickAction: () => open_dialog("videoCallSettings")
  }

  return (
    <Wrapper>
      <div className="w-100">
        <div className="sticky-top borderBtm d-flex flex-row align-items-center mb-3">
          <CommonHeader
            title={props.isVideoCallPage ? lang.VideoCallSettings : lang.createSchedual}
            button1={setWeeklyHours}
            button2={setPriceSetting}
          />
        </div>
        {Iscalendar && !props.isVideoCallPage ? (
          <div>
            <Calendar theme={theme} refreshFunction={refreshFunction} selectedCreatorId={selectedCreatorId} />
          </div>
        ) : (
          <div style={{ height: "calc( 100vh - 50px - 62px - 54px)", overflowY: "auto" }}>
            {props.isVideoCallPage ? <PriceSection /> : <ScheduleSection refreshFunction={refreshFunction} />}
          </div>
        )}
      </div>
      <style jsx>
        {`
            :global(.MuiTab-root) {
              min-width: 100px !important;
            }
            :global(.MuiTab-textColorPrimary.Mui-selected){
              color: var(--l_base) !important;
            }
            :global(.MuiTab-textColorPrimary){
              color: var(--l_app_text);
            }
          `}
      </style>
    </Wrapper>
  );
}
