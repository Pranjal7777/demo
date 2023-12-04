import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import WbSunnyOutlinedIcon from '@material-ui/icons/WbSunnyOutlined';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import { useTheme } from 'react-jss';
import Header from '../../header/header';
import dynamic from "next/dynamic";
import * as config from "../../../lib/config";
import Wrapper from '../../wrapper/wrapper'
import useLang from '../../../hooks/language';
import { open_drawer, startLoader, stopLoader, Toast } from '../../../lib/global';
import { validateTimeSlots } from '../../../lib/validation/validateTimeSlots';
import { getVideoCallWeeklyScheduleHook, getVideoSlotDataHook } from '../../../hooks/videoCallHooks';
import { patchDailyAvailabiltyAction, postDailyAvailabilitAction } from '../../../redux/actions/videoCall/videoCallActions';
import { isAgency } from '../../../lib/config/creds';
import isMobile from '../../../hooks/isMobile';
import { open_dialog } from '../../../lib/global/loader';
import { Arrow_Left2 } from '../../../lib/config/homepage';
import Icon from '../../image/icon';
import { useEffect } from 'react';
import CustomTooltip from '../../customTooltip';
import { fetchSlotsSubject } from '../../../lib/rxSubject';
import { useRouter } from 'next/router';
const Button = dynamic(() => import("../../../components/button/button"), { ssr: false });

const setHours = (props) => {
  const { heading, selectedDayData, onClose } = props;
  const theme = useTheme();  
  const [lang] = useLang();
  const dispatch = useDispatch();
  const [slotDataRedux] = getVideoSlotDataHook();
  const [payloadState, setPayloadState] = React.useState(selectedDayData);
  const [needToAdd, setNeedToAdd] = React.useState(true);
  const [disableAddBtn, setDisableAddBtn] = React.useState(false);
  const [btnEnable, setBtnEnable] = React.useState(false);
  const [startTime, setStartTime] = React.useState("");
  const [endTime, setEndTime] = React.useState("");
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);
  const [mobileView] = isMobile();
  const [availabilityScheduleRedux] = getVideoCallWeeklyScheduleHook();
  const [daysArray, setDaysArray] = useState(["M", "T", "W", "T", "F", "S", "S"])
  const [selectedDayIndex, setDayIndex] = useState(props.selectedDayIndex)
  const Router = useRouter()

  React.useEffect(() => {
    if (needToAdd) return;
    console.log(!!startTime && !!endTime && !needToAdd && validateTimeSlots(startTime, endTime), "sadijijdij")
    setBtnEnable(!!startTime && !!endTime && !needToAdd && validateTimeSlots(startTime, endTime));
  }, [startTime, endTime, needToAdd]);
  console.log(needToAdd, btnEnable, payloadState.slotDurations.length, "asijdsijaijij")
  // React.useEffect(() => {
  //   if (!needToAdd) setBtnEnable(!!startTime && !!endTime);
  //   else setBtnEnable(!!payloadState.slotDurations.length && !!payloadState.deletedSlots?.length);
  // }, [needToAdd, startTime, endTime, payloadState]);

  useEffect(() => {
    setPayloadState(availabilityScheduleRedux.data[selectedDayIndex])
  }, [availabilityScheduleRedux.data])

  const handleAddField = () => {
    setStartTime("")
    setEndTime("")
    setNeedToAdd((prev) => !prev)
  };

  const handleAddStartTime = (slotId) => {
    mobileView ? open_drawer('rollerTimePicker', {
      txtToShow: 'Select Start Time',
      paperClass: "card_bg",
      handleConfirmProp: (startTime) => {
        slotId ? (startTime) => handleModifyTimePayload(slotId, "startTime", timeString) : setStartTime(startTime)
      },
      minutesRange: parseInt(slotDataRedux?.data?.slotDuration)
    }, 'bottom') :
      open_dialog('rollerTimePicker', {
        txtToShow: 'Select Start Time',
        paperClass: "card_bg",
        handleConfirmProp: (startTime) => {
          slotId ? (startTime) => handleModifyTimePayload(slotId, "startTime", timeString) : setStartTime(startTime)
        },
        minutesRange: parseInt(slotDataRedux?.data?.slotDuration)
      });
  };

  const handleModifyTimePayload = (slotId, type = "startTime", timeString) => {
    console.log('Hey I am working !!');
    setPayloadState((prev) => ({ ...prev, slotDurations: prev.slotDurations.map((slot) => {
      if (slot.slotId === slotId) return { ...slot, [type]: timeString };
      else return slot; 
    })}));
  };

  const handleAddEndTime = (slotId) => {
    mobileView ? open_drawer('rollerTimePicker', {
      txtToShow: 'Select End Time',
      paperClass: "card_bg",
      handleConfirmProp: (endTime) => {
        slotId ? (endTime) => handleModifyTimePayload(slotId, "endTime", timeString) : setEndTime(endTime)
      },
      minutesRange: parseInt(slotDataRedux?.data?.slotDuration)
    }, 'bottom') :
      open_dialog('rollerTimePicker', {
        txtToShow: 'Select End Time',
        paperClass: "card_bg",
        handleConfirmProp: (endTime) => {
          slotId ? (endTime) => handleModifyTimePayload(slotId, "endTime", timeString) : setEndTime(endTime)
        },
        minutesRange: parseInt(slotDataRedux?.data?.slotDuration)
    }, 'bottom');
  };

  const apiCallBackSuccess = () => {
    setStartTime("")
    setEndTime("")
    setBtnEnable(false)
    props.fetchWeeklyAvailability()
    stopLoader();
    if (mobileView) {
      Router.push("/video-schedule")
    }
    fetchSlotsSubject.next(true)
    Toast('schedule updated successfully!');
    onClose();
  };

  const apiCallBackError = (err) => {
    stopLoader();
    if (err.response?.data?.message) {
      Toast(err.response.data.message, 'error');
    }
  };

  const handleSaveSettings = () => {
    if (!needToAdd) {
      // Means New Slot is Added and Need to Call Post API
      startLoader();
      dispatch(postDailyAvailabilitAction({ dayOfTheWeek: payloadState.day, startTime, endTime, callBackSuccess: apiCallBackSuccess, callBackError: apiCallBackError, userId: isAgency() ? selectedCreatorId : "" }));
    } else {
      // Means Existing Slot Data is Changed and Need to Call PATCH API
      startLoader();
      const payload = {
        dayOfTheWeek: payloadState.day,
        slotDurations: payloadState.slotDurations,
        deletedSlots: payloadState.deletedSlots || []
      };
      if (isAgency()) {
        payload["creatorId"] = selectedCreatorId;
      }
      dispatch(patchDailyAvailabiltyAction({ payloadToSet: payload, callBackSuccess: apiCallBackSuccess, callBackError: apiCallBackError }));
    };
    setNeedToAdd(true);
    setDisableAddBtn(false)
  };

  const handleDeleteSlot = (slotId) => {
    setDisableAddBtn(true);
    if (!payloadState.slotDurations.length) setNeedToAdd(false);
    else setNeedToAdd(true)
    setPayloadState((prev) => ({ ...prev, slotDurations: prev.slotDurations.filter((item) => item.slotId !== slotId), deletedSlots: prev.deletedSlots ? [...prev.deletedSlots, slotId] : [slotId] }));
    setBtnEnable(true);
  };
  useEffect(() => {
    if (!selectedDayData.slotDurations.length) handleAddField()
  }, [selectedDayData.slotDurations.length])

  const handleChangeDay = (dayIndex) => {
    if (btnEnable || (startTime || endTime)) return Toast(lang.editingSlotWarning, "warning")
    // if (!payloadState?.slotDurations?.length && !needToAdd && (startTime || endTime)) return Toast(lang.editingSlotWarning, "warning")
    // else if (payloadState?.slotDurations?.length && !needToAdd) return Toast(lang.editingSlotWarning, "warning")
    setDayIndex(dayIndex)
    setPayloadState(props.scheduleReduxData[dayIndex])
    setStartTime("")
    setEndTime("")
    console.log(props.scheduleReduxData[dayIndex], "saijdijiij")
    if (props.scheduleReduxData[dayIndex].slotDurations?.length) setNeedToAdd(true)
    else setNeedToAdd(false)
  }

  const isSlotDisabled = () => {
    if (!availabilityScheduleRedux?.data?.[selectedDayIndex]?.available && availabilityScheduleRedux?.data?.[selectedDayIndex]?.slotDurations?.length) {
      Toast(lang.slotsDisabledWarning, "warning")
      return true
    }
    return false
  }

  const handleDeleteSlotConfirmation = (slotEntry) => {
    if (isSlotDisabled()) return
    mobileView ? open_drawer("confirmationDrawer", {
      title: lang.deleteSlot,
      subtitle: lang.deleteSlotConfirmation,
      yes: () => {
        handleDeleteSlot(slotEntry.slotId)
      }
    }, "bottom")
      : open_dialog("confirmationDialog", {
        title: lang.deleteSlot,
        subtitle: lang.deleteSlotConfirmation,
        yes: () => {
          handleDeleteSlot(slotEntry.slotId)
        }
      })
  }

    return (
      <div className="p-3">
        {mobileView && <Header title={"Select Schedule"} icon={config.backArrow} back={() => { props.setStepper(0) }} />}
        <div className="position-relative">
          <Icon
            icon={`${Arrow_Left2}#arrowleft2`}
            hoverColor='var(--l_base)'
            width={15}
            height={15}
            onClick={() => { props.setStepper(0) }}
            class="cursor-pointer position-absolute"
            alt="Back Arrow"
          />
        </div>
        <h3 className="text-center fntSz24">Select Hours</h3>

        <div className={`daysArrayMapping row m-0 d-flex justify-content-center my-4  ${mobileView && "mt-5"}`} style={{ gap: mobileView ? "calc( calc( 100% / 6 ) - 48px)" : "25px" }}>
          {daysArray?.map((day, index) => {
            return <div onClick={() => { handleChangeDay(index) }} className={`singleDay borderStroke pointer ${selectedDayIndex === index && "gradient_bg"}`}>{day}</div>
          })}
        </div>

        <div className="d-flex justify-content-start px-1" >
          <div>{lang.setupSlots}</div>
          <div>
            <CustomTooltip
              placement="bottom"
              tooltipTitle={lang.overlapSlotsWarning} />
          </div>
          <div>

          </div>
        </div>
        <div style={mobileView ? { marginTop: '60px' } : {}} className="text-app mt-3">

          {payloadState?.slotDurations?.length ? (
                  payloadState?.slotDurations.map((slotEntry) => (
                    <div key={slotEntry.slotId} className="d-flex my-2">
                      <div className="col-10 d-flex px-0 ">
                          <div
                          className="d-flex txt-heavy col-6  align-items-center background_none borderStroke radius_12" style={{ height: "52px" }}
                          >
                          <AccessTimeIcon style={{ width: '17px', color: theme.type === "light" ? "black" : "white" }} /> <span className='pl-2'>{slotEntry.startTime} </span>
                          </div>
                          <div
                          className="d-flex txt-heavy col-6 ml-3  align-items-center background_none borderStroke radius_12" style={{ height: "52px" }}
                          >
                          <AccessTimeIcon style={{ width: '17px', color: theme.type === "light" ? "black" : "white" }} /> <span className='pl-2'>{slotEntry.endTime}
                          </span>                         </div>
                      </div>
                      <div className="col-2 d-flex align-items-center pointer">
                        {needToAdd && <DeleteOutlineIcon style={{ marginLeft: "auto" }} onClick={() => handleDeleteSlotConfirmation(slotEntry)} />}
                      </div>
                    </div>
                  ))
                ) : <></>}
                {!needToAdd && (
                  <>
                  <div className="d-flex">
                <div className="col-10 d-flex px-0 ">
                  <div onClick={() => handleAddStartTime()} className="d-flex txt-heavy col-6  align-items-center slotBg text-app background_none borderStroke radius_12 pointer ">
                    <AccessTimeIcon style={{ width: '17px', color: theme.type === "light" ? "black" : "white" }} />    <div className='pl-2'>{startTime || "Start Time"} </div>
                          </div>
                  <div onClick={() => handleAddEndTime()} className="d-flex txt-heavy col-6 ml-3  align-items-center slotBg text-app background_none borderStroke radius_12 pointer">
                    <AccessTimeIcon style={{ width: '17px', color: theme.type === "light" ? "black" : "white" }} />       <div className='pl-2'> {endTime || "End Time"} </div>
                          </div>
                      </div>
                <div className="col-2 d-flex align-items-center pointer">
                  <DeleteOutlineIcon style={{ marginLeft: "auto" }} onClick={handleAddField} />
                      </div>
                  </div>
              {startTime && endTime && !validateTimeSlots(startTime, endTime) && <p className="fntSz16 txt-book mt-2 mb-0 text-danger col-12 px-0">{lang.VideoEndStartError}</p>}
                  </>
                )}
        </div>
        {needToAdd && !disableAddBtn && payloadState.slotDurations.length < 4 && (
          <div className="text-app txt-medium fntSz14 gradient_text font-weight-700 mt-3 pointer" style={{ width: "fit-content" }} onClick={() => {
            !isSlotDisabled() && handleAddField()
          }}>
            {`+ ${lang.Add}`}
          </div>
        )}
        <div className="confirmBtn">
                <Button
                    type="button"
                    cssStyles={theme.blueButton}
            fclassname="gradient_bg "
                    disabled={!btnEnable}
                    onClick={handleSaveSettings}
                >
                    {lang.confirm}
          </Button>
            </div>
            <style jsx>
                {`
                .singleDay{
                  width: 40px;
                  height: 40px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  border-radius: 50%;
              }
              :global(.ScheduleSection .targetDialog){
                min-height:90vh;
              }
              .confirmBtn{
                position: absolute;
                bottom: ${mobileView ? "20px" : "0"};
                width: 90%;
                left: 50%;
                transform: translate(-50%, 0px);
              }
                `}
            </style>
      </div>
    )
}

export default setHours
