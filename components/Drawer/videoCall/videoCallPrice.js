import React, { useEffect, useRef, useState } from "react";
import Select from 'react-select'
import Wrapper from "../../../hoc/Wrapper";
import dynamic from "next/dynamic";
import useLang from "../../../hooks/language";
import { useTheme } from "react-jss";
import PriceSection from "../../../containers/videoCall/priceSection";
import ScheduleSection from "../../../containers/videoCall/scheduleSection";
import { TIMEZONE_LIST, TIME_ZONE_KEY_LABEL } from "../../../lib/timezones";
import { getCookie, setCookie } from "../../../lib/session";

const Button = dynamic(() => import("../../../components/button/button"), { ssr: false });
const Calendar = dynamic(() => import("../../../components/calender/fullCalender"), { ssr: false });


const timeZoneList = TIMEZONE_LIST;
const timezone = () => getCookie('zone') || Intl.DateTimeFormat().resolvedOptions().timeZone;

export default function Dv_VideoCallPriceSetting(props) {
  const [lang] = useLang();
  const theme = useTheme();
  const [Iscalendar, setIscalendar] = useState(true);
  const refreshFunction = useRef(null);
  const [selectedZone, setSelectedZone] = useState(TIME_ZONE_KEY_LABEL[timezone().toLowerCase()]);


  useEffect(() => {
    props.homePageref && props.homePageref.current.scrollTo(0, 0);
  }, []);


  const reportSubmitHandle = () => {
    setIscalendar(!Iscalendar);
  }

  const handleZoneChange = (option) => {
    setSelectedZone(option);
    setCookie('zone', option.value);
    refreshFunction.current?.();
  };

  return (
    <Wrapper>
      <div>
        <div className="myAccount_sticky__section_header px-3">
          <div className="d-flex align-items-center">
            <div className="content_heading fntSz20 fntWeight800 px-1 py-3 m-0 col content_heading__dt">
              {props.isVideoCallPage ? lang.VideoCallSettings : lang.createSchedual}
            </div>
          </div>
          <div className="d-flex flex-row">
          {!props.isVideoCallPage && <div className="d-flex pb-3">
              <div className="zone__dropdown" style={{ width: '22rem' }}>
              <Select
                placeholder="Select Timezone"
                styles={{
                  control: (provided) => ({ ...provided, backgroundColor: "var(--l_drawer)", borderColor: "var(--l_base)", color: "var(--l_light_grey)", borderRadius: '20px' }),
                  placeholder: (provided) => ({ ...provided, color: "var(--l_app_text)", fontSize: "15px", fontFamily: "Roboto" }),
                  option: (provided) => ({ ...provided, backgroundColor: "var(--l_drawer)", color: "var(--l_app_text)", fontFamily: "Roboto", fontSize: "15px", fontWeight: "400" }),
                  singleValue: (provided) => ({ ...provided, color: "var(--l_app_text)" }),
                  menuList: (provided) => ({ ...provided, backgroundColor: "var(--l_drawer)", color: "var(--l_app_text)" }),
                }}
                value={selectedZone}
                onChange={handleZoneChange}
                options={timeZoneList}
              />
            </div>
              <div className="d-flex mx-3">
              <Button
                type="button"
                cssStyles={theme.blueButton}
                fclassname="py-1 text-capitalize"
                onClick={reportSubmitHandle}
              >

                {`${Iscalendar ? lang.set : lang.view} ${lang.schedule}`}
              </Button>
            </div>
          </div>}
          </div>
          {/* <div style={{ borderBottom: "3px solid #F1F2F7" }}>
                    <div className="col-5 p-0">
                        <Tabs
                        className={classes.tabs}
                        value={value}
                        variant="fullWidth"
                        onChange={handleTab}
                        style={{
                            background: `${mobileView ? theme.background : ""}`,
                        }}
                        indicatorColor="primary"
                        textColor="primary"
                        >
                        <Tab
                            className="text-capitalize font-weight-bold fntSz16"
                            label={lang.Price}
                        />
                        <Tab
                            className="text-capitalize font-weight-bold fntSz16"
                            label={lang.Schedule}
                        />
                        </Tabs>
                    </div>
                </div> */}
        </div>
        {Iscalendar && !props.isVideoCallPage ? (
          <div>
            <Calendar theme={theme} refreshFunction={refreshFunction} />
          </div>
        ) : (
          <div>
            {props.isVideoCallPage ? <PriceSection /> : <ScheduleSection refreshFunction={refreshFunction} />}
            {/* <TabPanel value={value} index={0}>
                    <PriceSection />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <ScheduleSection />
                </TabPanel> */}
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
