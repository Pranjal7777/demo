import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from 'react-jss';
import { makeStyles } from '@material-ui/core/styles';
import dynamic from "next/dynamic";
import { open_dialog, open_drawer, startLoader, stopLoader, Toast } from '../../lib/global';
import { P_CLOSE_ICONS } from '../../lib/config';
import Wrapper from '../../hoc/Wrapper'
import isMobile from '../../hooks/isMobile';
import useLang from '../../hooks/language';
import { getVideoSlotDataHook, getVideoCallWeeklyScheduleHook } from '../../hooks/videoCallHooks';
import { getScheduleAvailabilityAction, getSlotsAction } from '../../redux/actions/videoCall/videoCallActions';
import { deleteUnavailabilitySlotAPI, getUnavailabilityScheduleAPI } from '../../services/videoCall';
import ScheduleSlot from './scheduleSlot';
import { isAgency } from '../../lib/config/creds';
import CustomTooltip from '../../components/customTooltip';
import SetHours from "../../components/Drawer/videoCall/setHours.js"
import Icon from '../../components/image/icon';
import { useRouter } from 'next/router';
import { close_dialog, close_drawer } from '../../lib/global/loader';
import { backArrow } from '../../lib/config/homepage.js';


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
      color: 'var(--l_base)'
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

const Switch = dynamic(() => import("../../components/formControl/switch"), {
  ssr: false,
});

const scheduleSection = (props) => {
  const { refreshFunction } = props;
  const router = useRouter()
  const [isHide, setIsHide] = useState(false);
  const [slotDataRedux] = getVideoSlotDataHook();
  const [availabilityScheduleRedux] = getVideoCallWeeklyScheduleHook();
  const [mobileView] = isMobile();
  const dispatch = useDispatch();
  const [lang] = useLang();
  const theme = useTheme();
  const classes = useStyles();
  const [unavailabilityActive, setUnavailabilityActive] = useState([]);
  const [unavailabilityExpire, setUnavailabilityExpire] = useState([]);
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);
  const [step, setStepper] = useState(0)
  const [selectedDayIndex, setDayIndex] = useState(null)

  const [value, setValue] = useState(0);

  const fetchWeeklyAvailability = () => {
    startLoader();
    dispatch(getScheduleAvailabilityAction({ isAPI: true, callBackFn: stopLoader, userId: isAgency() ? selectedCreatorId : "" }));
  }

  useEffect(async () => {
    startLoader()
    if (!slotDataRedux.fetchedAPI) {
      dispatch(getSlotsAction({
        isAPI: true, callBackFn: (apiData) => {
          stopLoader();
          if (!apiData?.slotDuration) return;
          handleLoadScheduleDays();
        },
        userId: isAgency() ? selectedCreatorId : ""
      }))
    } else {
      stopLoader();
      if (!slotDataRedux?.data?.slotDuration) return;
      handleLoadScheduleDays();
    };

  }, []);

  const handleLoadScheduleDays = () => {
    if (availabilityScheduleRedux.fetchedAPI) return;
    fetchWeeklyAvailability();
  };

  const fetchAllOverrides = () => {
    fetchActiveOverrides();
    fetchExpiredOverrides();
  };


  useEffect(() => {
    if (value == 0) {
      if (refreshFunction) refreshFunction.current = fetchWeeklyAvailability;
    } else {
      if (refreshFunction) refreshFunction.current = fetchAllOverrides;
      fetchAllOverrides();
    }

    return () => {
      if (refreshFunction) refreshFunction.current = null;
    }
  }, [value]);


  const fetchActiveOverrides = async () => {
    try {
      const response = await getUnavailabilityScheduleAPI({ creatorId: isAgency() ? selectedCreatorId : "" })
      if (response.status === 200) setUnavailabilityActive(response.data.data)
      stopLoader()
    }
    catch (err) {
      console.log(err, "is the error");
      stopLoader()
      setUnavailabilityActive([]);
    }
  };

  const fetchExpiredOverrides = async () => {
    try {
      const response = await getUnavailabilityScheduleAPI({ creatorId: isAgency() ? selectedCreatorId : "", status: 3 });
      if (response.status === 200) setUnavailabilityExpire(response.data.data)
      stopLoader();
    }
    catch (err) {
      console.log(err, "is the error");
      stopLoader();
      setUnavailabilityExpire([]);
    };
  };

  const handleDeleteSlot = async (item, deleteStatus) => {
    startLoader()
    const slotId = item.slotId;

    try {
      const response = await deleteUnavailabilitySlotAPI(slotId, deleteStatus)

      if (response.status == 200) {
        stopLoader()
        if (deleteStatus === 3) fetchActiveOverrides();
        fetchExpiredOverrides();
      }
    }
    catch (err) {
      console.log(err, "is the Error");
      stopLoader()
    }
  }

  const handleTab = (e, newValue) => {
    setValue(newValue);
  };

  const TabPanel = (props) => {
    const { children, value, index } = props;
    return <>{value === index && <div>{children}</div>}</>;
  };

  const handleDialog = (type, extraProps = {}) => {
    const propsToUseSetHours = {
      heading: lang.SetYourHours
    };
    const propsToUseOverRide = {
      heading: lang.SetYourHours
    }
    const propsToUseAddOverride = {
      heading: lang.SetYourHours
    };
    const propsToUsevideoCallRequest = {
      heading: lang.VideoCallRequest
    }
    switch (type) {
      case 'Set_hours':
        if (mobileView) {
          open_drawer('Set_hours', { ...propsToUseSetHours, ...extraProps }, 'right');
        } else {
          open_dialog('Set_hours', { ...propsToUseSetHours, ...extraProps });
        }
        break;
      case 'dataOverride':
        if (mobileView) {
          open_drawer('dataOverride', propsToUseOverRide, 'right');
        } else {
          open_dialog('dataOverride', propsToUseOverRide);
        }
        break;
      case 'setAddOverride':
        if (mobileView) {
          open_drawer('setAddOverride', { ...propsToUseAddOverride, ...extraProps }, 'right');
        } else {
          open_dialog('setAddOverride', { propsToUseAddOverride, handleVideoAvailibility: fetchActiveOverrides, ...extraProps, fromEdit: true });
        }
        break;
      case 'callRequest':
        if (mobileView) {
          open_drawer('videoCallRequest', propsToUsevideoCallRequest, 'right');
        } else {
          open_dialog('videoCallRequest', propsToUsevideoCallRequest);
        }
        break;
      default:
        console.log('error');
    }
  };

  return (
    <Wrapper>
      {
        step === 0 && slotDataRedux.fetchedAPI && slotDataRedux?.data?.slotDuration ? (
          <div className="position-relative">
            <h3 className={`text-center pt-3 mb-3 ${mobileView ? "fntSz22" : "fntSz20"}`}>{lang.callAvailability}</h3>
            <Icon
              icon={`${backArrow}#left_back_arrow`}
              size={20}
              unit={"px"}
              viewBox="0 0 20 20"
              class="position-absolute pointer"
              color={'var(--l_app_text)'}
              style={{ top: "15px", left: "15px" }}
              onClick={() => mobileView ? router.back() : close_dialog("ScheduleSection")}
            />



            <div className='d-flex justify-content-between px-3 pt-2'><div>Weekly Hours</div> <div className='d-flex gradient_text font-weight-bold '><span className="pointer" onClick={() => {
              mobileView ? open_drawer("viewOverRideSlots", { setStepper: () => { close_drawer("viewOverRideSlots") } }) : open_dialog("viewOverRideSlots", { setStepper: () => { close_dialog("viewOverRideSlots") } })
            }}
            >Set Time Off  </span>  <CustomTooltip
                tooltipTitle={"You can set your unavailability by using Set Time Off"}
                placement="bottom"
              />

            </div></div>
            <div className="col-12 px-2">
              <div className="py-2">
                <div className='overflow-auto px-2 scroll-hide'>
                  {console.log(availabilityScheduleRedux?.data?.[0], "asijdaijijij")}
                  {availabilityScheduleRedux.data?.length && availabilityScheduleRedux.data?.map((data, index) => (
                    <ScheduleSlot
                      data={data}
                      setStepper={setStepper}
                      setDayIndex={() => {
                        setDayIndex(index)
                      }}
                      fetchWeeklyAvailability={fetchWeeklyAvailability}
                    />
                  ))}
                  <div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        ) :
          step === 1 ?
            <SetHours selectedDayData={availabilityScheduleRedux.data[selectedDayIndex]} selectedDayIndex={selectedDayIndex} setDayIndex={setDayIndex} setStepper={setStepper} fetchWeeklyAvailability={fetchWeeklyAvailability} scheduleReduxData={availabilityScheduleRedux.data} /> :
            (
              <div className="text-center txt-black fntSz15 py-5 text-capitalize">
                Please setup slots and price first!
              </div>
            )
      }
      <style jsx>
        {`
            .subContainer{
                padding-top:10px;
            }
            .subContainer:first-child{
                padding-top:0px!important;
            }
            .container__borders{
                border:1px solid #DBDBDB;
                border-radius: 10px;
            }
            :global(.mv_create_post_switch_toggler .slider:before) {
                height: 12px;
                width: 12px;
                left: 2px;
                bottom: 2px;
            }
            :global(.custom_blue_radio .checkmark){
                top: 2px;
            }
            :global(.mv_create_post_switch_toggler) {
                width: 27px;
                height: 16px;
            }
            `}
      </style>
    </Wrapper>
  )
}

export default scheduleSection
