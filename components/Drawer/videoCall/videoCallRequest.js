import React, { useState, useEffect } from 'react';
import moment from 'moment';
import dynamic from 'next/dynamic';
import Router from 'next/router';
import { useTheme } from 'react-jss';
import isMobile from '../../../hooks/isMobile';
import Header from '../../header/header';
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import { Calendar, utils } from 'react-modern-calendar-datepicker';
import * as config from "../../../lib/config";
import useLang from '../../../hooks/language';
import Icon from "../../../components/image/icon";
import Wrapper from '../../wrapper/wrapper';
import Image from '../../image/image';
import { open_dialog, open_drawer, startLoader, stopLoader, Toast } from '../../../lib/global';
import { getAllAvailableDatesMonthlyAPI, getAllSlotsOfDayAPI } from '../../../services/videoCall';
import DaySlotTile from './daySlotTile';
import FigureCloudinayImage from '../../cloudinayImage/cloudinaryImage';
import { useUserWalletBalance } from '../../../hooks/useWalletData';
import { handleContextMenu } from '../../../lib/helper';
import { CoinPrice } from '../../ui/CoinPrice';
const Button = dynamic(() => import("../../../components/button/button"), { ssr: false });

const videoCallRequest = (props) => {
    const { heading, onClose, creatorId = "", creatorName, creatorProfilePic, videoCallPrice = {} } = props;
    const defaultValue = {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate()
    };

    const theme = useTheme();
    const [mobileView] = isMobile();
    const [lang] = useLang();
    const [selectedDay, setSelectedDay] = useState(defaultValue);
    const [availableDates, setAvailableDates] = useState([]);
    const [availableSlotData, setAvailableSlots] = useState([]);
    const [selectedSlots, setSelectedSlots] = useState({});
    const [userWalletBalance] = useUserWalletBalance()

    const handleCalendarClick = (data) => {
        setSelectedDay(data);
    };

    const handleDialog = (type) => {
        const propstoUseconfirmVideoCall = {
            title: 'videocall',
            onClose: () => { }
        }
        switch (type) {
            case 'confirmVideoCall':
                if (mobileView) {
                    open_drawer('confirmVideoCall', propstoUseconfirmVideoCall, 'bottom');
                } else {
                    open_dialog('confirmVideoCall');
                }
                break;
            default:
                console.log('error');
        }
    };

    const fetchAllDates = async (dateOfMonth) => {
        try {
            const dateObj = dateOfMonth || selectedDay;
            let monthSelected = `${dateObj.year}-${dateObj.month < 10 ? `0${dateObj.month}` : dateObj.month}-${dateObj.day < 10 ? `0${dateObj.day}` : dateObj.day}`;
            const response = await getAllAvailableDatesMonthlyAPI({ dateOfMonth: monthSelected, userId: creatorId });
            if (response.status === 200 && response.data.data?.length) {
                const filteredData = response.data.data.filter((item) => item.available).map((item) => ({ ...item, className: 'customeDays' }));
                setAvailableDates(filteredData);
            }
        } catch (err) {
            console.error(err);
            setAvailableDates([]);
        } finally {
            stopLoader();
        }
    };


    const fetchSlotsOfDay = async (dateToFetch) => {
        startLoader();
        try {
            if (!dateToFetch) return;
            let daySelected = `${dateToFetch.year}-${dateToFetch.month < 10 ? `0${dateToFetch.month}` : dateToFetch.month}-${dateToFetch.day < 10 ? `0${dateToFetch.day}` : dateToFetch.day}`;
            const response = await getAllSlotsOfDayAPI({ dateToFetch: daySelected, userId: creatorId });
            if (response.status === 200 && response.data.data?.length) {
                setAvailableSlots(response.data.data);
            }
        } catch (err) {
            console.error(err);
            setAvailableSlots([]);
            stopLoader()
        } finally {
            stopLoader();
        }
    };

    useEffect(() => {
        fetchAllDates();
    }, []);

    useEffect(() => {
        setSelectedSlots({});
        setAvailableSlots([])
        fetchSlotsOfDay(selectedDay, 0);
    }, [selectedDay]);

    const goNextMonth = () => {
        if (selectedDay) {
            const nextMonth = selectedDay.month;
            if (nextMonth + 1 <= 12) {
                const nextDate = { ...selectedDay, day: 1, month: nextMonth + 1 };
                setSelectedDay({ ...nextDate });
                fetchAllDates(nextDate);
            } else {
                const nextDate = { ...selectedDay, day: 1, month: 1, year: selectedDay.year + 1 };
                setSelectedDay({ ...nextDate });
                fetchAllDates(nextDate);
            }
        }
    };

    const goPrevMonth = () => {
        if (selectedDay) {
            const nextMonth = selectedDay.month;
            if (nextMonth - 1 > 0) {
                const nextDate = { ...selectedDay, day: 1, month: nextMonth - 1 };
                setSelectedDay({ ...nextDate });
                fetchAllDates(nextDate);
            } else {
                const nextDate = { ...selectedDay, day: 1, month: 12, year: selectedDay.year - 1 };
                setSelectedDay({ ...nextDate });
                fetchAllDates(nextDate);
            }

        }
    };

    const handlePurchaseSuccess = () => {
        mobileView ? open_drawer("coinsAddedSuccess", {}, "bottom") : open_dialog("coinsAddedSuccess", {})
    }

    const bookSlotsHandler = () => {
        if (userWalletBalance < +videoCallPrice.price) {
            mobileView ? open_drawer("addCoins", { handlePurchaseSuccess: handlePurchaseSuccess }, "bottom") : open_dialog("addCoins", { handlePurchaseSuccess: handlePurchaseSuccess })
            return
        }
        const timeSlots = Object.values(selectedSlots);
        const propsToPass = {
            creatorId,
            isVideoCall: true,
            slotData: {
                scheduleDate: `${selectedDay.year}-${selectedDay.month < 10 ? `0${selectedDay.month}` : selectedDay.month}-${selectedDay.day < 10 ? `0${selectedDay.day}` : selectedDay.day}`,
                timeSlots,
                creatorName
            },
            price: timeSlots.length * (+videoCallPrice.price),
            currency: "$",
            updatePostPurchase: () => Router.push('/virtual-request'),
            closeAll: true,
            purchaseUsingCoins: true,
            title: lang.VideoCallRequest,
            description: lang.requestCallFor,
            button: lang.requestVideoCall
        };
        mobileView
            ? open_drawer("buyPost", propsToPass, "bottom")
            : open_dialog("buyPost", propsToPass);

    }


    return (
        <Wrapper>
            {mobileView ? (
                <Wrapper>
                    <div id='videoCallSlotsDiv' style={{ paddingTop: '60px', marginBottom: "4rem", overflowY: "auto", height: "90%" }}>
                        <div>
                            <Header title={heading} icon={config.backArrow} back={() => onClose()} />
                        </div>
                        <div className="p-2" style={{ position: "sticky", top: "-5px", zIndex: "25" }}>
                            <div className="d-flex justify-content-between header__section py-2 px-3 align-items-center text-white">
                                <div className="d-flex align-items-center callout-none" onContextMenu={handleContextMenu}>
                                    <FigureCloudinayImage
                                        publicId={creatorProfilePic}
                                        width={32}
                                        ratio={1}
                                        alt={creatorName}
                                        className="solid_circle_border rounded-circle"
                                    />
                                    <div className="pl-2 txt-heavy fntSz13">{creatorName}</div>
                                </div>
                                <div className="txt-heavy fntSz13">
                                    <span className="d-flex priceSection">
                                        <CoinPrice price={+videoCallPrice.price} showCoinText={true} size="16" iconSize="15" />
                                        <span className='pl-1'>
                                            / {videoCallPrice.duration}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="px-3 py-2">
                            <div className="txt-heavy dv_appTxtClr">{lang.selectDateAndTime}</div>
                        </div>
                        <div className="calendar_custom_header col-12 d-flex justify-content-between txt-black dv_appTxtClr">
                            <Icon
                                icon={`${config.backArrow}#left_back_arrow`}
                                color={theme.type === "light" ? "#000" : "#fff"}
                                width={20}
                                height={25}
                                alt="Previous Month"
                                class="cursorPtr"
                                onClick={goPrevMonth}
                            />
                            {moment(`${selectedDay.day}-${selectedDay.month}-${selectedDay.year}`, "DD-MM-YYYY").format('MMMM')}
                            <Icon
                                color={theme.type === "light" ? "#000" : "#fff"}
                                icon={`${config.backArrow}#left_back_arrow`}
                                width={20}
                                height={25}
                                style={{ transform: 'rotate(180deg)' }}
                                alt="Next Month"
                                onClick={goNextMonth}
                                class="cursorPtr"
                            />
                        </div>
                        <div className="border-bottom expireDate">
                            <Calendar
                                value={selectedDay}
                                onChange={handleCalendarClick}
                                shouldHighlightWeekends={false}
                                customDaysClassName={availableDates}
                                minimumDate={utils().getToday()}
                            />
                        </div>
                        {
                            availableSlotData?.length ? availableSlotData?.map((slots) => (
                                <DaySlotTile selectedSlots={selectedSlots} setSelectedSlots={setSelectedSlots} key={slots.seqId} slotData={slots} />
                            )) : (
                                <>
                                    <div className="d-flex flex-column align-items-center justify-content-between w-100 my-3">
                                            <img src={config.schedulePlacholderIcon} alt="No Overrides Added" className='callout-none' onContextMenu={handleContextMenu} />
                                        <span className="txt-black fntSz15 mt-3 dv_appTxtClr">{lang.noSlotsFound}</span>
                                    </div>
                                </>)
                        }
                        
                    </div>
                    <div className="col-12 bg-dark-custom m-auto" style={{  position:"fixed",bottom: "0", borderRadius: "15px", width: "99%",height:"8vh" }}>
                            <Button
                                type="button"
                                disabled={!Object.values(selectedSlots).length}
                                cssStyles={theme.blueButton}
                                onClick={bookSlotsHandler}
                            // disabled={!value || (value == "Others" && !otherReason)}
                            >
                            {lang.confirm}
                            </Button>
                    </div>
                </Wrapper>
            ) : (
                <Wrapper>
                    <div>
                        <div className="d-flex py-3 header_section">
                            <div className="icon_left back_arrow">
                                <Icon
                                    icon={`${config.backArrow}#left_back_arrow`}
                                    color={theme.type === "light" ? "#000" : "#fff"}
                                    width={20}
                                    height={25}
                                    style={{ marginBottom: "4px" }}
                                    alt="close_icon"
                                    onClick={() => props.onClose()}
                                />
                            </div>
                            <div className="d-flex justify-content-center w-100 txt-black dv_appTxtClr">{lang.videoCallRequest}</div>
                        </div>
                        {/*  */}
                            <div className="dialog__contain d-flex">

                            {/* this is time text start  */}
                                <div className="px-3 py-2 expireDate" style={{ width: "43%" }}  >

                                {/*  this is  name start  */}
                                <div className="p-2">
                                    <div className="d-flex justify-content-between header__section py-3 px-4 align-items-center text-white">
                                            <div className="d-flex align-items-center callout-none" onContextMenu={handleContextMenu}>
                                            <FigureCloudinayImage
                                                publicId={creatorProfilePic}
                                                width={32}
                                                ratio={1}
                                                alt={creatorName}
                                                className="solid_circle_border rounded-circle"
                                            />
                                            <div className="pl-2 txt-heavy fntSz13">{creatorName}</div>
                                        </div>
                                            <div className="txt-heavy fntSz13">
                                                <span className="d-flex priceSection">
                                                    <CoinPrice price={+videoCallPrice.price} showCoinText={true} size="16" iconSize="15" />
                                                    <span className='pl-1'>
                                                        / {videoCallPrice.duration}
                                                    </span>
                                                </span>
                                            </div>
                                    </div>
                                </div>
                                <div style={{ borderRadius: "9px" }} className="Calendardiv px-3" >
                                    {/* ... tis is name end */}
                                    <div className="px-3 py-2 text-center">
                                        <div className="txt-heavy dv_appTxtClr">{lang.selectDateAndTime}</div>
                                    </div>
                                    {/*  this is time text end */}
                                    {/* this is arrow start  */}
                                    <div style={{ background: "#ddd5d5", borderRadius: "9px" }} className="calendar_custom_header col-12 d-flex justify-content-between txt-black dv_appTxtClr p-2 my-1 ">
                                        <Icon
                                            icon={`${config.backArrow}#left_back_arrow`}
                                            color={theme.type === "light" ? "#000" : "#fff"}
                                            width={20}
                                            height={25}
                                            alt="Previous Month"
                                            class="cursorPtr"
                                            onClick={goPrevMonth}
                                        />
                                        {moment(`${selectedDay.day}-${selectedDay.month}-${selectedDay.year}`, "DD-MM-YYYY").format('MMMM')}
                                        <Icon
                                            color={theme.type === "light" ? "#000" : "#fff"}
                                            icon={`${config.backArrow}#left_back_arrow`}
                                            width={20}
                                            height={25}
                                            style={{ transform: 'rotate(180deg)' }}
                                            alt="Next Month"
                                            onClick={goNextMonth}
                                            class="cursorPtr"
                                        />
                                    </div>

                                    {/* this is arrow end  */}

                                    <div className='  '>
                                        <Calendar
                                            value={selectedDay}
                                            onChange={handleCalendarClick}
                                            shouldHighlightWeekends={false}
                                            customDaysClassName={availableDates}
                                            minimumDate={utils().getToday()}
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* button start */}
                                <div className="mt-3 position-relative" style={{ width: "57%", backgroundColor: "var(--l_app_bg)" }}>
                                {/* data start  */}
                                    <div id="videoCallSlotsDiv" className="allDaysSlot h-100 pb-5" style={{ overflowY: "auto" }}>
                                {
                                    availableSlotData?.length ? availableSlotData?.map((slots) => (
                                        <DaySlotTile selectedSlots={selectedSlots} setSelectedSlots={setSelectedSlots} key={slots.seqId} slotData={slots} />
                                    )) : (
                                        <>
                                                        <div className="d-flex flex-column align-items-center justify-content-center w-100 h-100">
                                                            <img src={config.schedulePlacholderIcon} className='callout-none' onContextMenu={handleContextMenu} alt="No Overrides Added" />
                                                <span className="txt-black fntSz15 mt-3 dv_appTxtClr">{lang.noSlotsFound}</span>
                                            </div>
                                        </>)
                                        }
                                    </div>
                                    <div className='position-absolute manageConfirmBtn bg-dark-custom'>
                                        <Button
                                            type="button"
                                            disabled={!Object.values(selectedSlots).length}
                                            cssStyles={theme.blueButton}
                                            onClick={bookSlotsHandler}
                                        // disabled={!value || (value == "Others" && !otherReason)}
                                        >
                                            {lang.confirm}
                                        </Button>
                                    </div>

                                </div>
                            </div>
                            {/* data end */}
                            {/* ...button end */}
                    </div>
                </Wrapper>
            )}
            <style jsx>
                {`
                 :global(.Calendardiv) {
                    background: var(--l_app_bg) !important;
                }
                    :global(.Calendar) {
                        background: var(--l_app_bg) !important;
                    }
                    :global(.Calendar__day.-ltr) {
                        color: var(--l_app_text);
                        min-height: ${mobileView ? "3rem" : "14%"};
                        height:14.286%;
                        width:14.286%;
                        aspect-ratio: 1;
                    }
                    :global(.Calendar__day.-today:not(.-selectedStart):not(.-selectedEnd):not(.-selectedBetween)) {
                        color: var(--l_app_text);
                    }
                    :global(.Calendar__day.-disabled) {
                        opacity: 0.5;
                    }
                    :global(.MuiDialog-paper) {
                        min-width: 550px !important;
                    }
                    :global(.expireDate .Calendar) {
                        box-shadow: none!important;
                        min-height: 100%!important;
                        min-width: 100%!important;
                        padding: 0;
                    }
                    :global(.priceSection .coinprice){
                        display: flex;
                        align-items: center;
                        padding-bottom: 2px;
                    }
                    :global(.priceSection .priceAmount){
                        margin-top:0 !important;
                    }
                    :global(.priceSection > span){
                        font-size:14px !important;
                    }
                    .dialog__contain{
                        height: 500px;
                        overflow: hidden;

                    }
                    :global(.Calendar__sectionWrapper){
                        min-height:30.8em !important;
                    }
                    global(.src){
                        overflow-y: ${mobileView && "hidden"};
                    }

                    :global(.customeDays:not(.-selectedStart):not(.-selectedBetween):not(.-selectedEnd):not(.-selected)::before) {
                        border: 2px solid var(--l_base)!important;
                        content: '';
                        height: 0px;
                        top: 0px;
                        border-radius: 85px;
                        position: absolute;
                        background: var(--l_base);
                        width: 0px;
                        color: var(--l_base);
                    }
                    .manageConfirmBtn{
                        bottom: 0px;
                        width: 92%;
                        left: 50%;
                        transform: translate(-50%, 0);
                    }
                    :global(.customeDays:not(.-selectedStart):not(.-selectedBetween):not(.-selectedEnd):not(.-selected)) {
                        position: relative;
                    }
                    :global(.Calendar__day:not(.-blank):not(.-selectedStart):not(.-selectedEnd):not(.-selectedBetween):not(.-selected):hover){
                        border-radius: 50%;
                    }
                    :global(.Calendar__day.-selected){
                        background: #fff;
                        color: var(--l_base);
                        font-weight: 700;
                        aspect-ratio: 1;
                    }

                    :global(.expireDate .Calendar__monthArrow) {
                        background-size: 100% 100%;
                    }
                    .back_arrow{
                      position: absolute;
                      left:20px;
                    }
                     .radio-toolbar input[type="radio"] {
                        opacity: 0;
                        position: fixed;
                        width: 146px;
                        height: 47px;
                        cursor: pointer;
                    }
                    .radio-toolbar input[type="radio"]:checked + label {
                        background-color: #FCFCFF;
                        border-color: #FF8F00;
                        color: blue;
                        cursor:pointer;
                    }

                    .nice-dates-day:before{
                        background-color: var(--l_base);
                    }
        
                    .radio-toolbar input[type="checkbox"] {
                      opacity: 0;
                      position: fixed;
                      width: 0;
                    }
                    .radio-toolbar input[type="checkbox"]:checked + label {
                        background: var(--l_base);
                        color: #fff;
                        cursor:pointer;
                    }

                    .confirmBtn{
                        position: sticky;
                        width: 100%;
                        bottom: 0;
                        z-index: 999;
                        background: #fff;
                    }
                    :global(.image__section){
                        background: #b0b1ff;
                        border-radius: 50px;
                    }
                    // .shift_timing:active{
                    //     background: var(--l_base);
                    //     color: #fff;
                    // }
                    .shift_timing{
                        border-radius: 2px;
                        // box-shadow: 0px 3px 6px #6f6f6f21;
                    }
                    .header__section{
                        border-radius: 10px;
                        background: var(--l_base);
                        border: 1px solid #cfcfcf;
                    }
                    .border-bottom{
                        border-bottom: 1px solid #DBDBDB;
                    }
                    :global(.Calendar__header) {
                        display: none !important;
                    }
                    :global(.MuiPaper-root) {
                        color: var(--l_app_text) !important;
                        background: var(--l_app_bg) ;
                    }

                  :global(.videoCallRequest .MuiDialog-paper) {
                        min-width: 1012px !important;
                        min-height: 570px;
                       }
                `}
            </style>
        </Wrapper>
    );
};

export default videoCallRequest;
