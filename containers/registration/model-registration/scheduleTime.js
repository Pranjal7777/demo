import React, { useState, useEffect } from 'react'
import Select from "react-select";
import { TIMEZONE_LIST, TIME_ZONE_KEY_LABEL } from '../../../lib/timezones';
import Button from "../../../components/button/button";
import useLang from '../../../hooks/language';
import { useTheme } from "react-jss";
import { defaultTimeZone } from '../../../lib/config';
const sheduleTime = (props) => {
  const { setStap, title } = props;
  const [lang] = useLang()
  const theme = useTheme()
  const [isSceduleTime, setIsSceduleTime] = useState(TIME_ZONE_KEY_LABEL[defaultTimeZone().toLowerCase()]);
  const handleTimeScedule = (event) => {
    setIsSceduleTime(event);
  }
  const goToNext = (event) => {
    event.preventDefault()
    setStap(isSceduleTime);
  }

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
    <>
      {
        title && (
          <div className="w-330 mx-auto content-secion pt-3">
            <div className="col-12 text-center">
              {/* <h4 className="titleH4 mb-4">{title}</h4> */}
            </div>
          </div>
        )
      }
      <div className='mx-5' style={{ height: "calc(var(--vhCustom, 1vh) * 76)" }}>
        <Select
          styles={{
            control: (provided) => ({ ...provided, backgroundColor: "var(--l_drawer)", borderColor: "#000", color: "var(--l_light_grey)", borderRadius: '20px' }),
            placeholder: (provided) => ({ ...provided, color: "var(--l_app_text)", fontSize: "15px", fontFamily: "Roboto" }),
            option: (provided) => ({ ...provided, backgroundColor: "var(--l_drawer)", color: "var(--l_app_text)", fontFamily: "Roboto", fontSize: "15px", fontWeight: "400" }),
            singleValue: (provided) => ({ ...provided, color: "var(--l_app_text)" }),
            menuList: (provided) => ({ ...provided, backgroundColor: "var(--l_drawer)", color: "var(--l_app_text)" }),
          }}
          value={isSceduleTime}
          options={TIMEZONE_LIST}
          onChange={handleTimeScedule}
        />
      </div>
      <div className="posBtm">
        <Button
          disabled={!isSceduleTime?.value}
          type="button"
          onClick={goToNext}
          cssStyles={theme.blueButton}
          id="scr6"
        >
          {lang.next}
        </Button>
      </div>
      <style jsx>{`
            :global(.posBtm){
              position:${props.name === "TimeZone" && "relative"};
            }
      `}</style>
    </>
  )
}

export default sheduleTime;