import * as React from 'react';
import { useCreatorInsights } from '../../components/creatorInsights/useCreatorInsights';
import Button from '../../components/button/button';
import useLang from '../../hooks/language';
import { InsightEarning } from './InsightEarning';
import Select from 'react-select'
import moment from 'moment-timezone';
import { parseISO } from 'date-fns';
import { enGB } from 'date-fns/locale';
import DVdatePickerInput from '../../components/DVformControl/DVdatePickerInput';
import InsightGeneral from './InsigntGeneral';
import isMobile from '../../hooks/isMobile';
import Header from '../../components/header/header';
import { Arrow_Left2 } from '../../lib/config/homepage';
import Icon from '../../components/image/icon';
import { CLOSE_ICON_BLACK, CLOSE_WHITE, calenderIcon } from '../../lib/config';
import { findDateDiff } from '../../lib/helper';
import { Toast } from '../../lib/global/loader';
import { useTheme } from 'react-jss';
import Image from '../../components/image/image';
import { defaultTimeZone } from '../../lib/config/creds';

const CreatorInsights = (props) => {
    const { activeTab, handleTabChange, startTime, endTime, setStartTime, setEndTime, getStartOftheDay, getEndOftheDay } = useCreatorInsights()
    const theme = useTheme()
    const [lang] = useLang()
    const [mobileView] = isMobile()
    const [showMbFilters, setShowMbFilters] = React.useState(false)

    const handleStartDateChange = (date) => {
        var start = new Date(date.replace(/-/g, "/"));
        start.setHours(0, 0, 0, 0);
        setStartTime(getStartOftheDay(start.getTime()))
        if (mobileView) {
            setShowMbFilters(false)
        }
    }
    const handleEndDateChange = (date) => {
        var end = new Date(date.replace(/-/g, "/"));
        end.setHours(23, 59, 59, 999);
        setEndTime(getEndOftheDay(end.getTime()))
        if (mobileView) {
            setShowMbFilters(false)
        }

    }

    const renderDateFilter = () => {
        return (<div className={`filter_dropdown insDateFilter ${mobileView ? 'insDateFilterMobile' : ''} w-fit-content`}>
            <div className={`${mobileView ? 'px-2 py-2' : 'px-3 py-0'}`}>
                <div className='date-range d-flex align-items-center'>
                    <div className='d-flex align-items-center'>
                        <p className='m-0 mr-2'>From:</p>
                        <DVdatePickerInput
                            // maxDate={getCurrentAge()}
                            value={new Date(startTime)}
                            onChange={(e) => handleStartDateChange(e.target.value)}
                            key={activeTab}
                        />
                    </div>
                    <span className='date-range_arrow' />
                    <div className='d-flex align-items-center'>
                        <p className='m-0 mr-2 ml-2'>To:</p>
                        <DVdatePickerInput
                            // maxDate={getCurrentAge()}
                            value={new Date(endTime)}
                            onChange={(e) => handleEndDateChange(e.target.value)}
                            key={activeTab}
                        />
                    </div>

                </div>
            </div>
        </div>)
    }

    return (
        <div className='creatorIns insWrap'>
            <div className={`topIns ${mobileView ? '' : 'borderBtm'}`}>
                <div className={`insHeaderWrap pb-0 ${mobileView ? 'py-3 px-3' : 'px-4 py-3'}`}>
                    {
                        mobileView ?
                            <Header
                                id="notificationHeader"
                                back={props.onClose}
                                closeTrigger={props.onCloseDrawer}
                                icon={Arrow_Left2}
                                iconId="#arrowleft2"
                                title={lang?.dashboard}

                            /> : ""
                    }
                    <div className='insHeader position-relative d-flex w-100 align-items-center justify-content-between'>
                        <div className='d-flex align-items-center'>
                            <Button
                                type="button"
                                fclassname={`borderStroke py-2 px-4 mr-2 rounded-pill w-auto ${activeTab === 1 ? "gradient_bg" : "background_none"}`}
                                onClick={() => handleTabChange(1)}
                            >
                                {lang.earnings}
                            </Button>
                            <Button
                                type="button"
                                fclassname={`borderStroke py-2 px-4 rounded-pill w-auto ${activeTab === 2 ? "gradient_bg" : "background_none"}`}
                                onClick={() => handleTabChange(2)}
                            >
                                {lang.generalStats}
                            </Button>
                        </div>
                        {renderDateFilter()}
                        {
                            mobileView ?
                                <div className='mbFilterIcon' onClick={() => { setShowMbFilters(!showMbFilters) }}>
                                    {
                                        showMbFilters ?
                                            <Image
                                                src={`${theme.type == "light" ? CLOSE_ICON_BLACK : CLOSE_WHITE}`}
                                                onClick={() => setShowMbFilters(false)}
                                                color="white"
                                                width="20"
                                                height="20"
                                                alt="close_icon"
                                            /> : <Icon
                                                icon={`${calenderIcon}#calender_icon`}
                                                alt="calender-icon"
                                                color={"var(--l_app_text)"}
                                                width={20}
                                                height={20}
                                                className="dv_setRgtPosAbs"
                                            />
                                    }

                                </div>
                                : ""
                        }
                    </div>
                </div>
            </div>

            <div className={`insTabContent ${mobileView ? "px-3 pt-3 pb-4" : 'px-4 py-3'}  overflowY-auto`} style={{ maxHeight: 'calc(calc(var(--vhCustom, 1vh) * 100) - 72px)' }}>
                {
                    activeTab === 1 ? <InsightEarning startTime={startTime} endTime={endTime} /> : ""
                }
                {
                    activeTab === 2 ? <InsightGeneral startTime={startTime} endTime={endTime} /> : ""
                }
            </div>

            <style jsx>
                {
                    `
                    .filter_dropdown {
                        min-width: 120px;
                    }
                    .creatorIns.insWrap {
                        max-width: 1180px;
                        margin-top: ${mobileView ? '74px' : '0px'}
                    }
                    .topIns {
                        position: sticky;
                        top: ${mobileView ? '74px' : '0px'};
                        z-index:2;
                        background-color: ${mobileView ? showMbFilters ? 'var(--l_lightgrey_bg)' : 'var(--l_app_bg)' : 'var(--l_app_bg)'};
                    }
                    :global(.creatorIns .secTitle) {
                        font-size: ${mobileView ? '18px' : '24px'};
                        font-weight: 500;
                        margin-bottom: 10px;
                    }
                    :global(.creatorIns .forminput-date-picker) {
                        min-width: 115px;
                        border-radius: 20px !important;
                    }
                    :global(.creatorIns .forminput-date-picker .MuiFormControl-root) {
                        padding: 0 0.5rem !important;
                    }
                    :global(.creatorIns .insDateFilterMobile) {
                        position: absolute;
                        background: var(--l_lightgrey_bg);
                        z-index: 2;
                        display: ${mobileView ? showMbFilters ? 'block' : 'none' : 'block'}
                    }
                    :global(.date-range .dv_form_control) {
                        background-color: var(--l_profileCard_bgColor) !important;
                        border-color: var(--l_border) !important;
                    }
                    .creatorIns .insHeaderWrap {
                        background-color: var(--l_profileCard_bgColor) !important;
                    }
                    
                    `
                }
            </style>
        </div>
    );
};

export default CreatorInsights;