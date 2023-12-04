import React, { useState } from 'react';
import dynamic from "next/dynamic";
import { useDispatch, useSelector } from 'react-redux';

import WbSunnyOutlinedIcon from '@material-ui/icons/WbSunnyOutlined';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import { makeStyles } from '@material-ui/core/styles';
import useLang from '../../hooks/language';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import AddIcon from '@material-ui/icons/Add';
import Button from '../../components/button/button';
import { useTheme } from 'react-jss';
import Wrapper from '../../hoc/Wrapper';
import { getVideoSlotDataHook } from '../../hooks/videoCallHooks';
import { open_dialog, startLoader, stopLoader, Toast } from '../../lib/global';
import { patchDailyAvailabiltyAction, postDailyAvailabilitAction } from '../../redux/actions/videoCall/videoCallActions';
import { validateTimeSlots } from '../../lib/validation/validateTimeSlots';
import { isAgency } from '../../lib/config/creds';
import Icon from '../../components/image/icon';
import { editScheduleIcon } from '../../lib/config';
import { changeWeekdayStatus } from '../../services/videoCall';
import isMobile from '../../hooks/isMobile';
import { open_drawer } from '../../lib/global/loader';

const Switch = dynamic(() => import("../../components/formControl/switch"), {
  ssr: false,
});

const useStyles = makeStyles((theme) => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap'
    },
    tabs: {
  
      "& .MuiTabs-indicator": {
        backgroundColor: "var(--l_base)",
        height: 3,
      },
      "& .MuiTab-root.Mui-selected": {
        color: '#151515'
      }
    },
    textField: {
      marginLeft: theme.spacing(0),
      marginRight: theme.spacing(0),
      //   width: '100%',
      '&.MuiTextField-root > div': {
        border: 'none !important',
        outline: 'none !important'
        // height: '38px'
      },
      '&.MuiTextField-root > div > input': {
        background: '#fff',
        borderRadius: '3px',
        fontSize: '10px',
        width: '74px',
        padding: '7px',
      },
      '&.MuiTextField-root > Mui-focused': {
        border: 'none !important',
        outline: 'none !important'
      },
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "transparent"
      },
    }
  }));

const scheduleSlot = (props) => {
    const { 
        data,
      onClose,
      setStepper,
      setDayIndex
     } = props;

    const theme = useTheme();
    const [lang] = useLang();
    const classes = useStyles();
  const [mobileView] = isMobile()
    const dispatch = useDispatch();
    const [slotDataRedux] = getVideoSlotDataHook();
    const [payloadState, setPayloadState] = React.useState(data);
    const [needToAdd, setNeedToAdd] = React.useState(true);
    const [disableAddBtn, setDisableAddBtn] = React.useState(false);
    const [btnEnable, setBtnEnable] = React.useState(false);
    const [startTime, setStartTime] = React.useState("");
    const [endTime, setEndTime] = React.useState("");
    const [isHide, setIsHide] = React.useState(!!data.available);
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

    React.useEffect(() => {
      if (needToAdd) return;
      setBtnEnable(!!startTime && !!endTime && !needToAdd && validateTimeSlots(startTime, endTime));
    }, [startTime, endTime, needToAdd]);


    // React.useEffect(() => {
    //   if (!needToAdd) setBtnEnable(!!startTime && !!endTime);
    //   else setBtnEnable(!!payloadState.slotDurations.length && !!payloadState.deletedSlots?.length);
    // }, [needToAdd, startTime, endTime, payloadState]);

    const handleAddStartTime = (slotId) => {
      open_dialog('rollerTimePicker', {
        txtToShow: 'Select Start Time',
        handleConfirmProp: slotId ? (timeString) => handleModifyTimePayload(slotId, "startTime", timeString) : setStartTime,
        minutesRange: parseInt(slotDataRedux?.data?.slotDuration)
      }, 'bottom');
    };
  
    const handleModifyTimePayload = (slotId, type = "startTime", timeString) => {
      setPayloadState((prev) => ({ ...prev, slotDurations: prev.slotDurations.map((slot) => {
        if (slot.slotId === slotId) return { ...slot, [type]: timeString };
        else return slot; 
      })}));
    };

    const handleAddEndTime = (slotId) => {
      open_dialog('rollerTimePicker', {
        txtToShow: 'Select End Time',
        handleConfirmProp: slotId ? (timeString) => handleModifyTimePayload(slotId, "endTime", timeString) : setEndTime,
        minutesRange: parseInt(slotDataRedux?.data?.slotDuration)
      }, 'bottom');
    };
  
    const apiCallBackSuccess = () => {
      stopLoader();
      Toast('schedule updated successfully!');
      onClose?.();
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
        console.log("first")
        dispatch(postDailyAvailabilitAction({ dayOfTheWeek: data.day, startTime, endTime, callBackSuccess: apiCallBackSuccess, callBackError: apiCallBackError, userId: isAgency() ? selectedCreatorId : "" }));
      } else {
        // Means Existing Slot Data is Changed and Need to Call PATCH API
        console.log("second")
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
    };
  
    const handleDeleteSlot = (slotId) => {
      setDisableAddBtn(true);
      setNeedToAdd(true);
      setPayloadState((prev) => ({ ...prev, slotDurations: prev.slotDurations.filter((item) => item.slotId !== slotId), deletedSlots: prev.deletedSlots ? [...prev.deletedSlots, slotId] : [slotId] }));
      setBtnEnable(true);
    };

    const handleAddField = () => {
      setNeedToAdd((prev) => !prev);
      // setBtnEnable(true);
    }

  const handleChangeStatus = async () => {
    const payload = {
      dayOfTheWeek: data.day,
      status: !isHide ? 1 : 0
    }
    startLoader()
    try {
      await changeWeekdayStatus(payload)
      props.fetchWeeklyAvailability()
      console.log(payloadState, "sihdaijjiij")
      setPayloadState(prev => ({ ...prev, available: !isHide ? 1 : 0 }))
      setIsHide(!isHide);
      stopLoader()
    } catch (error) {
      console.log(error)
      stopLoader()
    }
  }

  const toggleSwitch = async () => {
    if (!data.available && !data.slotDurations.length) {
      if (isHide && !payloadState.slotDurations?.length) {
        setBtnEnable(false);
        setNeedToAdd(true);
      }
      setIsHide(!isHide);
    } else {
      mobileView ? open_drawer("confirmationDrawer", {
        title: "Video Call",
        subtitle: !isHide ? lang.enableVideoCallSlot : lang.disableVideoCallSlot,
        yes: () => {
          handleChangeStatus()

        }
      }, "bottom")
        : open_dialog("confirmationDialog", {
          title: "Video Call",
          subtitle: !isHide ? lang.enableVideoCallSlot : lang.disableVideoCallSlot,
          yes: () => {
            handleChangeStatus()
          }
        })
    }

    };

  return (
    <Wrapper>
      <div className="slotBg mt-2 background_oversection" key={data.day}>
            <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                    <div className="liteColorTxt">
              <WbSunnyOutlinedIcon className="fntSz16" style={{ color: data.available ? "var(--l_base)" : "" }} />
                    </div>
                    <div className="pl-2">
                    <div className="txt-heavy fntSz13">{data.day}</div>
                    </div>
                </div>
                <div className="d-flex align-items-center">
            {needToAdd && !disableAddBtn && data.slotDurations.length <= 4 && <div className="d-flex pr-3 cursorPtr pb-2">
              <Icon
                icon={`${editScheduleIcon}#vector`}
                hoverColor='var(--l_base)'
                color={'var(--l_app_text)'}
                width={15}
                height={15}
                onClick={() => {
                  setDayIndex?.()
                  setStepper(1)
                }}
                class=""
                alt="editIcon"
              />
                    {/* <AddIcon style={{
                        background: theme.appColor,
                        borderRadius: "50%",
                        color: theme.theme,
                        fontSize: '14px',
                    }} /> */}
                    </div>}
                    <div>
                    <Switch
                        checked={isHide}
                        onChange={toggleSwitch}
                    />
                    </div>
                </div>
            </div>
        {console.log(payloadState, "sadijijij")}
        <div className="d-flex align-items-start justify-content-between pl-3">
                <div className="col-10 p-0">
            {payloadState.slotDurations?.length && !payloadState.available ?
              <div className="liteColorTxt fntSz13 pl-2 pt-3">Slots are disabled</div>
              : payloadState.slotDurations?.length && payloadState.available ? (
                payloadState.slotDurations.map((slot, index) => (
                    <>
                    <div className="col-auto px-0 pl-0 d-flex pr-2">
                            <form className={classes.container} noValidate={true}>
                                <div
                                  // onClick={() => handleAddStartTime(slot.slotId)}
                          className="faintGray d-flex txt-heavy justify-content-between align-items-center  p-1"
                                >
                          {slot.startTime}
                                </div>
                            </form>
                      <span className="faintGray fntSz12 px-0 liteColorTxt d-flex mx-1 align-items-center">-</span>
                        <div
                          // onClick={() => handleAddEndTime(slot.slotId)}
                        className="faintGray d-flex txt-heavy justify-content-between align-items-center   p-1"
                        >
                        {slot.endTime}

                      </div>
                        </div>
                    </>
                    ))
                    ) : (
                <div className="liteColorTxt fntSz13 pl-2 pt-3">Not available</div>
                    )}
                
                    {!needToAdd &&  <div className='mt-2'>
                        <div className="col-12 justify-content-between d-flex p-0">
                            <div className="col-auto pl-0 d-flex pr-2">
                                <div onClick={() => handleAddStartTime()} className="d-flex txt-heavy justify-content-between align-items-center video_cellBg px-2 p-1 cursorPtr">
                                    {startTime || "Start Time"} <AccessTimeIcon className="ml-auto" style={{ fontSize: '15px', color: 'var(--l_base)' }} />
                                </div>
                                <span className="fntSz10 liteColorTxt d-flex mx-3 align-items-center">To</span>
                                <div onClick={() => handleAddEndTime()} className="d-flex txt-heavy justify-content-between align-items-center video_cellBg px-2 p-1 cursorPtr">
                                    {endTime || "End Time"} <AccessTimeIcon className="ml-auto" style={{ fontSize: '15px', color: 'var(--l_base)' }} />
                                </div>
                                <div className="col-auto pr-0 d-flex align-items-center justify-content-end cursorPtr"
                                    // onClick={()=> setNeedToAdd(false)}
                                >
                                    <DeleteOutlineIcon
                                    onClick={handleAddField}
                                    style={{
                                        fontSize: '18px'
                                    }} />
                                </div>
                            </div>
                        </div>
                        {startTime && endTime && !validateTimeSlots(startTime, endTime) && <p className="fntSz13 txt-book mt-2 mb-0 text-danger">{lang.VideoEndStartError}</p>}
                    </div>
                    }
                </div>
                {btnEnable && (<div className='mt-2 align-self-end'>
                    <Button
                        type="button"
                        fclassname="w-auto"
                        cssStyles={theme.blueSlotButton}
                        disabled={!btnEnable}
                        onClick={handleSaveSettings}
                    >
                        {lang.confirm}
                    </Button>
                </div>)}
            </div>
        </div>
        <style jsx>
        {`
            .video_cellBg{
                border-radius: 7px;
                font-size: 13px;
                min-width: 110px;
            }
            .set_availability_border{
              border:1px solid var(--l_base)!important;
            }
            :global(.confirmationDialog .targetDialog .modal-content){
              background-color: var(--l_profileCard_bgColor) !important
            }
            
        `}
      </style>
    </Wrapper>
  );
};

export default scheduleSlot;
