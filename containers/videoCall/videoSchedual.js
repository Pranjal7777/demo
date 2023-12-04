import React, { useEffect, useState } from "react";
import Select from 'react-select'
import { useRouter } from "next/router";
import { useTheme } from "react-jss";
import Wrapper from "../../hoc/Wrapper";
import Header from "../../components/header/header";
import useLang from "../../hooks/language";
import * as config from "../../lib/config";
import ScheduleSection from "./scheduleSection";
import { TIMEZONE_LIST } from "../../lib/timezones";
import Button from "../../components/button/button";

const timeZoneList = TIMEZONE_LIST;

const VideoSchedual = (props) => {
  const { selectedZone, handleZoneChange, refreshFunction, handleToggleView } = props;
  const theme = useTheme();
  const [lang] = useLang();
  const router = useRouter();

  const [value, setValue] = useState(props.videoTabValue || 0);

  const handleCloseDrawer = () => {
    router.back();
  };
  const setCustomVhToBody = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vhCustom', `${vh}px`);
  };

  useEffect(() => {
    setCustomVhToBody();
    window.addEventListener('resize', setCustomVhToBody);

    return () => {
      window.removeEventListener('resize', setCustomVhToBody);
    };
  }, []);


  return (
    <div className="mv_wrap_videoCall videoCall__setting_section dynamicHeight" id="home-page">
      <Wrapper>
        <Header
          title={`${lang.VideoSchedualSettings}`}
          icon={config.backArrow}
          back={handleToggleView}
        />
        <div style={{ marginTop: "90px" }}>
          <div className="zone__dropdown col-12">
            <Select
              placeholder="Select Timezone"
              styles={{
                control: (provided) => ({ ...provided, backgroundColor: "var(--l_drawer)", borderColor: "var(--l_base)", color: "var(--l_light_grey)", borderRadius: '20px' }),
                placeholder: (provided) => ({ ...provided, color: "var(--l_app_text)", fontSize: "15px", fontFamily: "Roboto" }),
                option: (provided) => ({ ...provided, backgroundColor: "var(--l_drawer)", color: "var(--l_app_text)", fontFamily: "Roboto", fontSize: "15px", fontWeight: "400" }),
                singleValue: (provided) => ({ ...provided, color: "var(--l_app_text)" }),
                menuList: (provided) => ({ ...provided, backgroundColor: "var(--l_drawer)", color: "var(--l_app_text)" }),
                menu: (provided) => ({ ...provided, zIndex: 2 })
              }}
              value={selectedZone}
              onChange={handleZoneChange}
              options={timeZoneList}
            />
          </div>
          <div className="col-12 mt-3">
            <Button
              type="button"
              cssStyles={theme.blueButton}
              fclassname="py-1 text-capitalize"
              onClick={handleToggleView}
            >

              {lang.viewSchedule}
            </Button>
          </div>
          <ScheduleSection refreshFunction={refreshFunction} />
        </div>
      </Wrapper>
      <style jsx>
        {`
          .confirmBtn {
            position: fixed;
            width: 100%;
            bottom: 0;
          }
          .dynamicHeight {
            height: calc(var(--vhCustom, 1vh) * 100) !important;
          }
        `}
      </style>
    </div>
  );
};

export default VideoSchedual;
