import React, { useEffect, useState } from 'react';
import moment from "moment";
import { format, parseISO } from 'date-fns'
import { enGB } from 'date-fns/locale'
import dynamic from "next/dynamic";
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import { useTheme } from 'react-jss'
import { DatePickerCalendar, DateRangePickerCalendar, START_DATE } from 'react-nice-dates'
import Header from '../../../header/header'
import * as config from "../../../../lib/config";
import Wrapper from '../../../wrapper/wrapper'
import Icon from '../../../../components/image/icon'
import useLang from '../../../../hooks/language';
import InputField from '../../../../containers/profile/edit-profile/label-input-field';
import isMobile from '../../../../hooks/isMobile';
import { close_dialog, close_drawer, open_dialog, open_drawer, startLoader, stopLoader } from '../../../../lib/global';
import { getVideoSlotDataHook } from '../../../../hooks/videoCallHooks';
import { postUnavailabilityAPI, patchUnavailabilityAPI } from '../../../../services/videoCall';
import { validateTimeSlots } from '../../../../lib/validation/validateTimeSlots';
import { isAgency } from '../../../../lib/config/creds';
import { useSelector } from 'react-redux';
import { fetchSlotsSubject } from '../../../../lib/rxSubject';
const Button = dynamic(() => import("../../../../components/button/button"), { ssr: false });


const setAddOverride = (props) => {
  const { unavailabilityData = {}, fromEdit, sucessCallBack } = props;
  const { onClose } = props;
  const [lang] = useLang();
  const theme = useTheme();
  const [mobileView] = isMobile();
  const [date, setDate] = useState(unavailabilityData?.unavailabilityDate ? parseISO(unavailabilityData.unavailabilityDate) : undefined);
  const [startDate, setStartDate] = useState(unavailabilityData?.startDate ? parseISO(unavailabilityData.startDate) : undefined)
  const [endDate, setEndDate] = useState(unavailabilityData?.endDate ? parseISO(unavailabilityData.endDate) : undefined)
  const [focus, setFocus] = useState(START_DATE);
  const [slotDataRedux] = getVideoSlotDataHook();
  const [needToAdd, setNeedToAdd] = React.useState(fromEdit ? false : true);
  const [startTime, setStartTime] = React.useState(unavailabilityData.unavailabilitySlots?.[0]?.startTime || "");
  const [endTime, setEndTime] = React.useState(unavailabilityData.unavailabilitySlots?.[0]?.endTime || "");
  const [reason, setReason] = React.useState(unavailabilityData.notes || "");
  const [btnEnable, setBtnEnable] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(moment().format('hh:mm a'));
  const [startTimeError, setStartTimeError] = useState(false)
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);
  const dateTypes = [
    {
      value: 1,
      label: lang.SingleDay
    },
    {
      value: 2,
      label: lang.MultipleDays
    }
  ]
  const [selectedRadio, setSelectedRadio] = useState(dateTypes[unavailabilityData?.isMultipleDays == 0 ? 1 : 0]);

  React.useEffect(() => {
    if (needToAdd) return;
    setBtnEnable(!!startTime && !!endTime && !needToAdd && validateTimeSlots(startTime, endTime));
  }, [startTime, endTime, needToAdd]);

  useEffect(() => {
    if (date && startTime) {
      const dateObject = new Date(date);
      const today = new Date()
      if (dateObject.toDateString() === today.toDateString() && moment(startTime, 'hh:mm a').unix() <= moment(currentTime, 'hh:mm a').unix()) {
        setStartTimeError(true)
      } else {
        setStartTimeError(false)
      }
    }

  }, [date, startTime])

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(moment().format('hh:mm a'));
    }, 30000);

    return () => clearInterval(intervalId);
  }, []);

  // function to handler
  const handleAddField = () => {
    if (!props.fromEdit) {
    setStartTime("");
    setEndTime("");
   }
    setNeedToAdd(false)
    setStartTimeError(false)
  };

  const handleAddStartTime = () => {
    mobileView ?
      open_drawer('rollerTimePicker', {
        txtToShow: 'Select Start Time',
        handleConfirmProp: setStartTime,
        minutesRange: parseInt(slotDataRedux?.data?.slotDuration)
      }, 'bottom') : open_dialog('rollerTimePicker', {
        txtToShow: 'Select Start Time',
        handleConfirmProp: setStartTime,
        minutesRange: parseInt(slotDataRedux?.data?.slotDuration)
      });
  };

  const handleAddEndTime = () => {
    mobileView ?
      open_drawer('rollerTimePicker', {
        txtToShow: 'Select End Time',
        handleConfirmProp: setEndTime,
        minutesRange: parseInt(slotDataRedux?.data?.slotDuration)
      }, 'bottom') : open_dialog('rollerTimePicker', {
        txtToShow: 'Select End Time',
        handleConfirmProp: setEndTime,
        minutesRange: parseInt(slotDataRedux?.data?.slotDuration)
      });
  };

  const submitSingleUnavilalityHandler = async () => {
    startLoader()
    const payload = {
      isMultipleDays: 1,
      unavailabilityDate: format(date, 'yyyy-MM-dd', { locale: enGB }),
      startDate: "",
      endDate: "",
      unavailabilitySlots: [
        {
          startTime: startTime,
          endTime: endTime
        }
      ],
      notes: reason
    }
    if (isAgency()) {
      payload["creatorId"] = selectedCreatorId;
    }
    if (unavailabilityData.slotId) payload.slotId = unavailabilityData.slotId;
    try {
      if (unavailabilityData.slotId) await patchUnavailabilityAPI(payload);
      else await postUnavailabilityAPI(payload);
      sucessCallBack?.()
      stopLoader()
    }
    catch (err) {
      stopLoader()
      console.log(); (err)
    }
    if (mobileView) {
      close_drawer("setAddOverride")
      close_drawer("chooseOverRideType")
    } else {
      handleDestopSetOverride();
    }
  }

  const submitMultiUnavilalityHandler = async () => {
    startLoader()
    const payload = {
      isMultipleDays: 0,
      unavailabilityDate: "",
      startDate: format(startDate, 'yyyy-MM-dd', { locale: enGB }),
      endDate: format(endDate, 'yyyy-MM-dd', { locale: enGB }),
      unavailabilitySlots: [],
      notes: reason
    }
    if (unavailabilityData.slotId) payload.slotId = unavailabilityData.slotId;
    try {
      if (unavailabilityData.slotId) await patchUnavailabilityAPI(payload);
      else await postUnavailabilityAPI(payload);
      sucessCallBack?.()
      stopLoader();
    }
    catch (err) {
      stopLoader()
      console.log(); (err)
    }
    if (mobileView) {
      close_drawer("setAddOverride")
      close_drawer("chooseOverRideType")
    } else {
      handleDestopSetOverride();
    }
  }

  const handleDestopSetOverride = () => {
    props.handleVideoAvailibility();
    fetchSlotsSubject.next(true)
    close_dialog("setAddOverride")
  }

  const handleCloseDrawer = () => {
    onClose();
  }
  const changeInputHandler = (value) => {
    setSelectedRadio(value);
  };
  const handleFocusChange = newFocus => {
    setFocus(newFocus || START_DATE)
  }
  const webInoutStyle = {
    background: "var(--l_input_bg)",
    color: "var(--l_app_text)",
    borderRadius: '6px'
  };
  const handleStartDateChange = (date) => {
    setEndDate(undefined)
    setStartDate(date)
  }

  useEffect(() => {
    if (props.overRideType == 1) return handleAddField()
  }, [])

  return (
    <Wrapper>
      {mobileView ? (
        <Wrapper>
          <Header title={`${lang.addDateOverride}`} icon={config.backArrow} back={handleCloseDrawer} />
          <div style={{ paddingTop: '70px' }}>

            {props.overRideType == 1 ? (
              <Wrapper>
                <div className="mb-5">
                  <div className="px-3 py-2 manageColorCalendar">
                    <DatePickerCalendar minimumDate={parseISO(moment().format('YYYY-MM-DD'))} date={date} onDateChange={setDate} locale={enGB} />
                  </div>
                  <div className="px-3 py-2 ">
                    <div className="d-flex justify-content-between">
                      <div className="txt-heavy text-app">{lang.hoursAvailable} <span className="text-danger">*</span></div>
                      {/* <div className="anchorTag" onClick={() => handleDialog('rollerTimePicker')}>{`+ ${lang.Add}`}</div> */}
                      {props.overRideType === "2" && <div className="gradient_text cursorPtr font-weight-700" onClick={handleAddField}>{`+ ${lang.Add}`}</div>}
                    </div>
                    {!needToAdd || unavailabilityData?.unavailabilitySlots?.length
                      ? <div className="d-flex">
                        <div className="col-10 px-0">
                          <div className='d-flex w-100 mt-3' style={{ height: "44px" }}>
                            <div style={{ borderRadius: "10px" }} onClick={() => handleAddStartTime()} className="d-flex txt-heavy col-6  align-items-center pointer background_none borderStroke ">
                              <AccessTimeIcon className="mx-2" style={{ fontSize: '22px', color: 'var(--l_base)', color: theme.type === "light" ? "black" : "white" }} /> {startTime || "Start Time"}
                          </div>
                            <div style={{ borderRadius: "10px" }} onClick={() => handleAddEndTime()} className="d-flex txt-heavy col-6 ml-3 align-items-center pointer background_none borderStroke ">
                              <AccessTimeIcon className="mx-2" style={{ fontSize: '22px', color: 'var(--l_base)', color: theme.type === "light" ? "black" : "white" }} />     {endTime || "End Time"}
                          </div>
                          </div>
                          {startTimeError && <p className="pl-1" style={{ fontSize: "12px", fontWeight: "bold", color: "red" }}>{lang.dateOverRideTimeError}</p>}

                        </div>
                        <div className="col-2 d-flex align-items-center mt-3 ml-2">
                          <DeleteOutlineIcon className="cursorPtr" onClick={handleAddField} style={{ color: 'var(--l_app_text)', marginBottom: "auto", marginTop: "10px" }} />
                        </div>
                      </div>
                      : <div className="liteColorTxt pt-3">{lang.unavailable}</div>
                    }
                    {startTime && endTime && !validateTimeSlots(startTime, endTime) && <p className="fntSz14 mt-2 mb-0 text-danger col-12">{lang.VideoEndStartError}</p>}
                  </div>
                </div>
                <div className="d-flex pt-3 pb-2 confirmBtn align-items-center justify-content-between">
                  <div className="col-12">
                    <Button
                      type="button"
                      // cssStyles={theme.blueButton}
                      fclassname="rounded-pill gradient_bg"
                      onClick={submitSingleUnavilalityHandler}
                      disabled={!date || !startTime || !endTime || needToAdd || !btnEnable || startTimeError}
                    // disabled={!value || (value == "Others" && !otherReason)}
                    >
                      {lang.confirm}
                    </Button>
                  </div>
                </div>
              </Wrapper>
            ) : (
              <Wrapper>
                <div className="mb-5">
                    <div className="px-3 py-2 ">
                    <DateRangePickerCalendar
                      startDate={startDate}
                      endDate={endDate}
                      focus={focus}
                        onStartDateChange={handleStartDateChange}
                      onEndDateChange={setEndDate}
                      onFocusChange={handleFocusChange}
                      minimumDate={parseISO(moment().format('YYYY-MM-DD'))}
                      locale={enGB}
                      />
                    </div>
                </div>
                <div className="d-flex pt-3 pb-2 confirmBtn align-items-center justify-content-between">
                  <div className="col-12">
                    <Button
                      type="button"
                      cssStyles={theme.blueButton}
                      onClick={submitMultiUnavilalityHandler}
                        fclassname="gradient_bg"
                        disabled={!startDate || !endDate}
                    // disabled={!value || (value == "Others" && !otherReason)}
                    >
                      {lang.confirm}
                    </Button>
                  </div>
                </div>
              </Wrapper>
            )}
          </div>
        </Wrapper>
      ) : (
        <Wrapper>
          <Wrapper>
            <div className="d-flex py-3 header_section">
              <div className="icon_left dv_modal_close">
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
              <div className="d-flex justify-content-center w-100 txt-black">Add Date Override</div>
            </div>
            <div style={{ paddingTop: '10px' }}>

                {props.overRideType == 1 ? (
                <Wrapper>
                  <div className="">
                      <div className="px-3 py-2 manageColorCalendar">
                      <DatePickerCalendar minimumDate={parseISO(moment().format('YYYY-MM-DD'))} date={date} onDateChange={setDate} locale={enGB} />
                    </div>
                      <div className="px-3 py-2 ">
                      <div className="d-flex justify-content-between">
                        <div className="txt-heavy text-app">{lang.hoursAvailable} <span className="text-danger">*</span></div>
                          {props.overRideType === "2" && <div className="gradient_text cursorPtr font-weight-700" onClick={handleAddField}>{`+ ${lang.Add}`}</div>}
                      </div>
                      {!needToAdd || unavailabilityData?.unavailabilitySlots?.length
                        ? <div className="d-flex">
                            <div className="col-10 pl-0">
                              <div className="d-flex mt-3" style={{ height: "44px" }}>
                                <div style={{ borderRadius: "10px" }} onClick={() => handleAddStartTime()} className="d-flex txt-heavy col-6 align-items-center pointer background_none borderStroke  ">
                                  <AccessTimeIcon className="mx-2" style={{ fontSize: '21px', color: theme.type === "light" ? "black" : "white" }} /> {startTime || "Start Time"} 
                            </div>
                                <div onClick={() => handleAddEndTime()} style={{ borderRadius: "10px" }} className="d-flex txt-heavy col-6 ml-3 align-items-center pointer background_none borderStroke ">
                                  <AccessTimeIcon className="mx-2" style={{ fontSize: '21px', color: theme.type === "light" ? "black" : "white" }} />     {endTime || "End Time"} 
                            </div>
                              </div>
                              <div>
                                {startTimeError && <p className="pl-1" style={{ fontSize: "12px", fontWeight: "bold", color: "red" }}>{lang.dateOverRideTimeError}</p>}
                              </div>
                            </div>

                            <div className="col-2 d-flex align-items-center mt-3">
                              <DeleteOutlineIcon className="cursorPtr" onClick={handleAddField} style={{ color: 'var(--l_app_text)', marginBottom: "auto", marginTop: "10px" }} />
                          </div>
                        </div>
                          : ""
                        // <div className="liteColorTxt pt-3">{lang.unavailable}</div>
                      }
                      {startTime && endTime && !validateTimeSlots(startTime, endTime) && <p className="fntSz14 mt-2 mb-0 text-danger col-12">{lang.VideoEndStartError}</p>}
                      </div>
                  </div>
                  <div className="d-flex pt-3 pb-2 align-items-center justify-content-between">
                      <div className="col-12 pb-2">
                      <Button
                        type="button"
                          fclassname="rounded-pill gradient_bg "
                        onClick={submitSingleUnavilalityHandler}
                          disabled={!date || !startTime || !endTime || needToAdd || !btnEnable || startTimeError}
                      >
                          {lang.save}
                      </Button>
                    </div>
                  </div>
                </Wrapper>
              ) : (
                <Wrapper>
                  <div className="">
                        <div className="px-3 py-2 ">
                      <DateRangePickerCalendar
                        startDate={startDate}
                        endDate={endDate}
                        focus={focus}
                            onStartDateChange={handleStartDateChange}
                        minimumDate={parseISO(moment().format('YYYY-MM-DD'))}
                        onEndDateChange={setEndDate}
                        onFocusChange={handleFocusChange}
                        locale={enGB}
                      />
                        </div>
                  </div>
                  <div className="d-flex pt-3 pb-2 align-items-center justify-content-between">
                        <div className="col-12 pb-2">
                      <Button
                        type="button"
                            fclassname="rounded-pill gradient_bg"
                        onClick={submitMultiUnavilalityHandler}
                            disabled={!startDate || !endDate}
                      // disabled={!value || (value == "Others" && !otherReason)}
                      >
                        {lang.confirm}
                      </Button>
                    </div>
                  </div>
                </Wrapper>
              )}
            </div>
          </Wrapper>
        </Wrapper>
      )}
      <style jsx>
        {`
            .radio-toolbar {
                margin: 10px 10px;
            }
            .radio-toolbar input[type="radio"] {
                opacity: 0;
                position: fixed;
                width: 0px;
                height: 47px;
                cursor: pointer;
            }

            .radio-toolbar label {
                width: auto;
                display: inline-block;
                background-color: #FCFCFF;
                padding: 8px 20px;
                font-family: Gotham-Book;
                font-size: 16px;
                border: 2px solid #E4E5EB;
                border-radius: 50px;
                color:#242424!important;
                cursor:pointer;
            }
            .radio-toolbar input[type="radio"]:checked + label {
                background-color: ${theme.appColor};
                border-color: ${theme.appColor};
                color: ${theme.palette.white} !important;
                cursor: pointer;
            }
            :global(.manageColorCalendar>div){
              background:var(--l_background_oversection)
            }

            .radio-toolbar input[type="checkbox"] {
                opacity: 0;
                position: fixed;
                width: 0;
            }
            .radio-toolbar input[type="checkbox"]:checked + label {
                background-color: #FCFCFF;
                border-color: #FF8F00;
                color: blue;
                cursor:pointer;
            }

            .header_section{
                box-shadow: -2px -1px 10px 0px #0000004f;
            }
            .icon_left{
                margin-bottom: 4px;
                position: absolute;
                left: 20px;
            }
            .override__sections{
                border-bottom: 7px solid #F4F4F4;
            }
            :global(.MuiDialogContent-root){
                border-radius: 9px;
            }
            :global(.nice-dates-navigation, .nice-dates-day) {
                color: var(--l_app_text);
                font-weight: 600;
            }
            :global(.nice-dates-popover) {
                box-shadow: none;
                border: 1px solid #ddd;
                border-radius: 2px;
                max-width: 480px;
                transition: none;
            }
            :global(.nice-dates-day:before) {
                background-color: var(--l_base);
            }
            :global(.nice-dates-day_date){
              color: var(--l_app_text);
            }
            :global(.nice-dates-day.-disabled){
              opacity: 0.3;
            }
            :global(.nice-dates-day.-selected){
              opacity: 1;
            }
            .confirmBtn{
                position: fixed;
                width: 100%;
                bottom: 0;
            }

            .switch-field {
              display: flex;
              overflow: hidden;
            }
            .switch-field input {
              position: absolute !important;
              clip: rect(0, 0, 0, 0);
              height: 1px;
              width: 1px;
              border: 0;
              overflow: hidden;
            }
            .switch-field label {
              background-color: ${theme.type === 'light' ? 'var(--l_white)' : 'var(--white)'};
              color: ${theme.type === 'light' ? `${theme.palette.l_app_text}!important` : `${theme.palette.l_app_text}!important`};
              font-size: 14px;
              line-height: 1;
              text-align: center;
              padding: 1rem 1rem;
              border: 1px solid rgba(0, 0, 0, 0.2);
              box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3), 0 1px rgba(255, 255, 255, 0.1);
              transition: all 0.1s ease-in-out;
              border-radius: 2rem !important;
            }
            .switch-field label:hover {
              cursor: pointer;
            }
            .switch-field input:checked + label {
              background-color: var(--l_base);
              color: var(--white) !important;
              box-shadow: none;
            }
            `}
      </style>
    </Wrapper>
  )
}

export default setAddOverride
