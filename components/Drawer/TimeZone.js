import React from 'react'
import { useState } from 'react';
import { TIMEZONE_LIST } from '../../lib/timezones'
import useLang from "../../hooks/language";
import dynamic from "next/dynamic";
const SearchBar = dynamic(
  () => import("../../containers/timeline/search-bar"),
  { ssr: false }
);
const Button = dynamic(() => import("../button/button"), { ssr: false });
import DVRadioButton from "..//DVformControl/DVradioButton";
import isMobile from '../../hooks/isMobile';
import Icon from '../image/icon';
import { CLOSE_ICON_WHITE } from '../../lib/config/logo';
import { Arrow_Left2 } from '../../lib/config/homepage';
import Header from '../header/header';

const TimeZone = (props) => {
  const timeZoneList = TIMEZONE_LIST;
  const [lang] = useLang();
  const [searchKey, setSearchKey] = useState("");
  const [timeZone, setTimeZone] = useState(props.isSceduleTime)
  const [mobileView] = isMobile();

  const handleSearch = (e) => {
    setSearchKey((e.target.value).toLowerCase())
  }

  const handlesetTimezone = () => {
    setTimeZone(props.setIsSceduleTime)
    props.onClose()
  }

  const searchData = timeZoneList.filter((data) =>
    data.label.toLowerCase().includes(searchKey)
  )

  return (
    <div>
      {/* <div > */}
      <div className="w-100 p-sm-3 text-center" style={mobileView ? {paddingTop: "72px"} : {}}>
        {mobileView && <Header
          icon={Arrow_Left2}
          iconId="#arrowleft2"
          iconClr="#000"
          back={() => props.onClose()}
          title={lang.selectTimeZone}
          Data={lang.selectTimeZone}
        />}
        {!mobileView &&
          <>
            <div className="text-right" >
              <Icon
                icon={`${CLOSE_ICON_WHITE}#close-white`}
                color={"var(--l_app_text)"}
                size={16}
                onClick={() => props.onClose()}
                alt="back_arrow"
                class="cursorPtr"
                viewBox="0 0 16 16"
              />
            </div>
            <h5 className="">
              {lang.selectTimeZone}
            </h5>
          </>}
        <div>
          <SearchBar
            onlySearch
            handleSearch={handleSearch.bind(this)}
          />
        </div>
      </div>
      <div className="max_height overflow-auto">
        {searchData.length === 0 ?
          <div className='d-flex justify-content-center align-items-center w-100 h-100'>
            <h5>{lang.noDataFound}</h5>
          </div> :
          searchData.map((time) => {
            return (<>
              <div className='d-flex justify-content-between pt-2 text-app'>
                <DVRadioButton
                  name={"timeZone"}
                  value={time.value}
                  label={time.label}
                  timezonelabel={time.label}
                  checked={timeZone?.value?.label === `${time.label}`}
                  onChange={(value, timezonelabel) => setTimeZone({ value, timezonelabel })}
                />
              </div>
            </>)
          })}
      </div>
      <div className='p-3'>
        <Button
          disabled={!timeZone}
          type="button"
          fclassname='btnGradient_bg rounded-pill py-2 px-4'
          onClick={() => handlesetTimezone()}
          children={lang.save}
        />
      </div>
      <style jsx>{`
        :global(.gender_container){
          width:100% !important;
        }
        :global(.gender_container .checkmark){
          left:100% !important;
        }
        .max_height{
          height: calc(calc(calc(var(--vhCustom, 1vh) * 100) - 100px) - ${mobileView ? "105px" : "200px"})
        }
      `}</style>
    </div>
  )
}

export default TimeZone