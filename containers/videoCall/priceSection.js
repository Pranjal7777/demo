import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Wrapper from '../../hoc/Wrapper';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { useTheme } from 'react-jss';
import dynamic from "next/dynamic";
import useLang from '../../hooks/language';
import isMobile from '../../hooks/isMobile';
import { getSlotsAction, saveSlotsActions } from '../../redux/actions/videoCall/videoCallActions';
import { getVideoSlotDataHook } from '../../hooks/videoCallHooks';
import { open_dialog, open_drawer, startLoader, stopLoader, Toast } from '../../lib/global';
import useProfileData from '../../hooks/useProfileData';
import { close_dialog, drawerToast } from '../../lib/global/loader';
import { sendMail } from '../../lib/global/routeAuth';
import { isAgency, defaultCurrency } from '../../lib/config/creds';
import { NumberValidator } from '../../lib/validation/validation';
import { P_CLOSE_ICONS } from '../../lib/config';
import Icon from '../../components/image/icon';
import { useRouter } from 'next/router';
import ReactSelect from 'react-select';
import { updateVideoCallPrice } from '../../redux/actions/otherProfileData';
const Switch = dynamic(() => import("../../components/formControl/switch"), {
  ssr: false,
});
const Button = dynamic(() => import("../../components/button/button"), { ssr: false });

const slotOption  = [
  {
    value: "5 Mins",
    label: "5 Mins"
  },
  {
    value: "10 Mins",
    label: "10 Mins"
  },
  {
    value: "15 Mins",
    label: "15 Mins"
  },
  {
    value: "20 Mins",
    label: "20 Mins"
  },
  {
    value: "30 Mins",
    label: "30 Mins"
  },
  {
    value: "60 Mins",
    label: "60 Mins"
  }
]

const slotOptionsArr = [...new Array(61).keys()].slice(1).map((num) => ({
  extensionDuration: `${num} Mins`,
  extensionCharges: 0,
  value: num
}));



const slotExtensionOptions = (num) => slotOptionsArr.filter((item) => item.value % 5 === 0);

const priceSection = (props) => {
  const [btnEnable, setBtnEnable] = useState(false);
  const [needExtensionAddition, setNeedExtensionAddition] = useState(false);
  const [slotDataRedux] = getVideoSlotDataHook();
  const dispatch = useDispatch();
  const [slotData, setSlotData] = useState(null);
  const theme = useTheme();
  const [lang] = useLang();
  const [mobileView] = isMobile();
  const minVideoCallValue = useSelector(state => state.appConfig.minVideoCallValue);
  const maxVideoCallValue = useSelector(state => state.appConfig.maxVideoCallValue);
  const [profileData] = useProfileData();
  const [inputDisabled ,setInputDisabled] = useState(false);
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);
  const [disableBackMob, setDisableBack] = useState(false)
  const router = useRouter()

  const handleSlotChanger = (value) => {
    setSlotData((prev) => ({...prev, slotDuration: value, extensionAvailable: 0}));
  }

  const handleDialog = (type) => {
    const propsToUseSet_duration = {
      slotOption,
      handleSlotChanger,
      slot: slotData?.slotDuration
    }
    const propsToUseSet_schedule = {
      slotOption
    }
      switch (type) {
          case 'Set_duration':
              if (mobileView) {
                  open_drawer('Set_duration', propsToUseSet_duration, 'bottom');
              } else {
                  open_dialog('Set_duration', propsToUseSet_duration);
              }
              break;
          case 'Set_schedule':
              if (mobileView) {
                  open_drawer('Set_schedule', propsToUseSet_schedule, 'right');
              } else {
                  open_dialog('Set_schedule', propsToUseSet_schedule);
              }
              break;
          default:
              console.log('error');
      }
  };

  const handleChangeSlotPrice = (event) => {
    let value = event.target.value;
    const regex = /^[1-9][0-9]*$/.test(value);
    if (regex || !value) {
      setSlotData((prev) => ({ ...prev, slotChargesValues: value }));
    }

  }

  const handleExtensionChange = () => {
    if (slotData?.slotDuration) {
      setSlotData((prev) => ({ ...prev, extensionAvailable: +!prev?.extensionAvailable, slotExtensionCharges: !prev.extensionAvailable ? [slotExtensionOptions(parseInt(slotData.slotDuration))[0]] : [] }));
    }
  }

  const handleChangeExtensionPrice = (slotLabel, slotNewPrice) => {
    setSlotData((prev) => ({ ...prev, slotExtensionCharges: prev.slotExtensionCharges.map((item) => {
      if (item.extensionDuration === slotLabel) return { ...item, extensionCharges: slotNewPrice }
      else return item;
    })}));
  };

  const handleDeleteExtension = (slotLabel) => {
    setSlotData((prev) => ({
      ...prev,
      slotExtensionCharges: prev.slotExtensionCharges.filter((slot) => slot.extensionDuration !== slotLabel)
    })); 
  };

  React.useEffect(async () => {
    startLoader();

    if (router.query?.setupPrice) {
      setDisableBack(router.query?.setupPrice)
    }

    if (!slotDataRedux.fetchedAPI) dispatch(getSlotsAction({ isAPI: true, callBackFn: (apiData) => {
      setSlotData(apiData);
      stopLoader();
    }, userId: isAgency() ? selectedCreatorId : ""
    }));
    else {
      setSlotData(slotDataRedux.data);
      stopLoader();
    };

    if (profileData && [5, 6].includes(profileData.statusCode)) {
      setInputDisabled(true);
      return drawerToast({
        closing_time: 10000,
        title: lang.submitted,
        desc: lang.unverifiedProfile,
        closeIconVisible: true,
        button: {
          text: lang.contactUs,
          onClick: () => {
            sendMail();
          },
        },
        titleClass: "max-full",
        autoClose: true,
        isMobile: false,
      });
    };
  }, []);

  React.useEffect(() => {
    let isValid = !!+slotData?.slotChargesValues && parseInt(slotData.slotDuration);
    if (isValid && slotData?.extensionAvailable) {
      isValid = !slotData?.slotExtensionCharges.find((slot) => !+slot.extensionCharges);
    }
    setBtnEnable(isValid);
  }, [slotData]);

  const handleSaveSetting = () => {
    if (!btnEnable) return;
    startLoader();
    const payloadToSave = {...slotData, slotChargesCurrency: '$'};
    if (isAgency()) {
      payloadToSave["creatorId"] = selectedCreatorId;
    }
    dispatch(saveSlotsActions({ slotConfig: payloadToSave, callBackFn: () => {
      stopLoader();
      console.log(Object.keys(profileData.videoCallPrice).length === 0, Object.keys(profileData.videoCallPrice), "saijdsaijij")
      if (Object.keys(profileData.videoCallPrice).length === 0) {
        let payload = {
          currencyCode: "$",
          currencySymbol: "$",
          price: slotData.slotChargesValues,
          duration: slotData.slotDuration
        }
        console.log(payload, slotData, "asijdijijij")
        dispatch(updateVideoCallPrice(payload))
        close_dialog("videoCallSettings")
      }
      Toast('Setting Updated Successfully !');
    }
    }));
  };

  const addExtensionOption = (item) => {
    setSlotData((prev) => ({
      ...prev,
      slotExtensionCharges: [...prev.slotExtensionCharges, item]
    }));
  };


  const updateExtensionOption = (newExtension, previousExtension) => {
    setSlotData(prevSlots => {
      return {
        ...prevSlots,
        slotExtensionCharges: prevSlots.slotExtensionCharges.map(slot =>
          slot.value === previousExtension.value ? newExtension : slot
        )
      };
    });
  };

  const handleAddExtension = () => {
    const addedSlots = slotData?.slotExtensionCharges.map((item) => item.extensionDuration) || [];
    slotExtensionOptions(parseInt(slotData.slotDuration)).filter((item) => {
      !addedSlots.includes(item.extensionDuration)
    })
    const propsToPass = {
      extensionOptions: slotExtensionOptions(parseInt(slotData.slotDuration)).filter((item) => !addedSlots.includes(item.extensionDuration)),
      handleAddExtension: addExtensionOption
    };
    mobileView
      ? open_drawer('addExtensionVideo', propsToPass, 'bottom')
      : open_dialog('addExtensionVideo', propsToPass);
  };

  const handleUpdateSlot = (slot) => {
    const addedSlots = slotData?.slotExtensionCharges.map((item) => item.extensionDuration) || [];
    slotExtensionOptions(parseInt(slotData.slotDuration)).filter((item) => {
      console.log(item.extensionDuration, addedSlots, !addedSlots.includes(item.extensionDuration), "sadijsadijsaijij")
      !addedSlots.includes(item.extensionDuration)
    })
    const propsToPass = {
      extensionOptions: slotExtensionOptions(parseInt(slotData.slotDuration)).filter((item) => !addedSlots.includes(item.extensionDuration)),
      handleAddExtension: updateExtensionOption,
      slot
    };
    mobileView
      ? open_drawer('addExtensionVideo', propsToPass, 'bottom')
      : open_dialog('addExtensionVideo', propsToPass);
  }

  const handleBack = () => {
    router.back()
    setTimeout(() => {
      close_dialog("videoCallSettings")
    }, 50)
  }

  const showMinPriceError = !!(+slotData?.slotChargesValues < +minVideoCallValue || +slotData?.slotChargesValues > +maxVideoCallValue)
    return (
      <Wrapper>
            <div 
          className={`videoCall__setting_section  ${mobileView ? "pt-2 p-2" : "p-3"} `} style={{ paddingBottom: "77px" }}>
          <h3 className='text-center fntSz20'>{lang.setupSlots}</h3>
          {<div className='position-absolute pointer' style={{ borderRadius: "10px", padding: '6px 8px 6px 6px', top: mobileView ? '10px' : "12px", right: mobileView ? "18px" : "8px" }}>
            <Icon
              icon={`${P_CLOSE_ICONS}#cross_btn`}
              // hoverColor='var(--l_base)'
              color={'var(--l_app_text)'}
              width={20}
              height={20}
              onClick={() => { props.disableBack ? handleBack() : mobileView && disableBackMob == "true" ? router.push("/") : mobileView && disableBackMob != "true" ? router.back() : close_dialog("videoCallSettings") }}
              alt="Back Arrow"
            />
          </div>}
          <div className='mt-4'>

            <div>
                    <div className="d-flex justify-content-between mt-2">
                <div className='col-6'>
                  <div className="txt-heavy">{lang.duration}</div>


                  <div className="col-12 px-0">
                    <div className="zone__dropdown">
                      <ReactSelect
                        placeholder={slotData?.slotDuration || lang.SelectSlot}
                        classNamePrefix="mySelect"
                        styles={{
                          control: (provided) => ({
                            ...provided, backgroundColor: "none", borderColor: "var(--l_border)", borderWidth: "1.5px", color: "var(--l_light_grey)", borderRadius: '12px', border: '1.5px solid var(--l_border)',
                            boxShadow: 'none', '&:hover': {
                              border: '1.5px solid var(--l_border)',
                            }
                          }),
                          placeholder: (provided) => ({ ...provided, color: "var(--l_app_text)", fontSize: "15px", fontFamily: "Roboto" }),
                          option: (provided, state) => ({ ...provided, backgroundColor: state.isFocused ? "var(--l_base) !important" : "var(--l_drawer)", color: "var(--l_app_text)", fontFamily: "Roboto", fontSize: "15px", fontWeight: "400" }),
                          singleValue: (provided) => ({ ...provided, color: "var(--l_app_text)" }),
                          menuList: (provided) => ({ ...provided, backgroundColor: "var(--l_drawer)", color: "var(--l_app_text)" }),
                          menu: (provided) => ({ ...provided, zIndex: 2 })
                        }}
                        value={slotData?.slotDuration || lang.SelectSlot}
                        onChange={(time) => { handleSlotChanger(time.value) }}
                        options={slotOption}
                        components={{
                          IndicatorSeparator: () => null
                        }}

                      />
                    </div>
                  </div>
                </div>
                <div className='col-6'>
                  <div className="txt-heavy">{"Price"}</div>
                  <div className="d-flex mt-2 py-2 align-items-center justify-content-start slotBg background_none borderStroke " style={inputDisabled ? { pointerEvents: 'none', height: "44px" } : { height: "44px" }}>
                    <div className={`liteColorTxt txt-black fntSz16 d-inline-flex align-items-center  ${+slotData?.slotChargesValues ? 'theme_text' : ''}`}>{slotData?.slotChargesCurrency || '$'} <input type="number" onKeyPress={NumberValidator} min="1" inputMode="numeric" pattern="[0-9*]" value={slotData?.slotChargesValues} onChange={handleChangeSlotPrice} className=" ml-1 w-100 slotPriceInput" /></div>
                  </div>
                </div>
              </div>
            </div>
            {showMinPriceError && <p style={{ textAlign: "start" }} className="fntSz13 text-danger txt-book m-0 mt-1 pl-3">{lang.PleaseAddValuevideo} {defaultCurrency} {(+minVideoCallValue).toFixed(2)} {lang.maxText} {defaultCurrency} {maxVideoCallValue}</p>}
                  </div>
              </div>
              <div>

          <div className={`pb-3 videoCall__setting_section pb__65 pt-1 ${mobileView ? "px-2" : "px-3"}`} style={{}}>
            <div className="justify-content-between d-flex pb-2 px-3">
                    <div className="txt-heavy">{lang.ExtensionTime}</div>
                    <div>
                      <Switch 
                        checked={Boolean(slotData?.extensionAvailable)}
                        onChange={handleExtensionChange}
                      />
                    </div>
                  </div>
                  {
                    slotData?.extensionAvailable ? (
                      <>
                      {
                        slotData?.slotExtensionCharges?.length && slotData?.slotExtensionCharges.map((slot) => (
                          <div key={slot.extensionDuration}>
                            <div className="d-flex mt-2 px-3">
                              <div onClick={() => handleUpdateSlot(slot)} className="d-flex col-5 justify-content-between align-items-center pointer background_none borderStroke " style={{ borderRadius: "12px" }}>
                                <div className="liteColorTxt d-flex justify-content-between align-items-center ">
                                  <AccessTimeIcon style={{ width: '17px', color: theme.type === "light" ? "black" : "white" }} />
                                  <div className="theme_text pl-2 txt-heavy fntSz13">{slot.extensionDuration}</div>
                                </div>
                              </div>
                              <div className="d-flex col-5 py-2 align-items-center justify-content-center slotBg ml-auto pointer background_none borderStroke " style={{ height: "44px" }}>
                                <div className={`liteColorTxt txt-black fntSz13 d-inline-flex align-items-center ${+slot?.extensionCharges ? 'theme_text' : ''}`}>$
                                  <input type="number" onKeyPress={NumberValidator} min="1" inputMode="numeric" pattern="[0-9*]" onChange={(event) => handleChangeExtensionPrice(slot.extensionDuration, event.target.value)} value={slot?.extensionCharges === 0 ? "" : slot?.extensionCharges} className="ml-1 w-100 slotPriceInput" />
                                </div>
                              </div>
                              {slotData?.slotExtensionCharges?.length > 1  && <div className="col-auto d-flex align-items-center pl-1 pr-0 cursorPtr">
                                  <DeleteOutlineIcon onClick={() => handleDeleteExtension(slot.extensionDuration)} />
                              </div>}
                            </div>
                          </div>
                        ))
                      }
                     
                  <div onClick={handleAddExtension} className="txt-black cursorPtr fntSz12 mt-3 pl-3" style={{ color: 'var(--l_base)' }}>
                        + Add Extension Time
                  </div>
                      </>
                    ) : <></>
                  }
                  
                </div>
          <div className="col-12 confirmBtn borderStroke">
                    <Button
                      type="button"
              fclassname="rounded-pill btnGradient_bg py-2"
                      disabled={!(btnEnable && !showMinPriceError)}
                      onClick={handleSaveSetting}
                      // onClick={reportSubmitHandler}
                      // disabled={!value || (value == "Others" && !otherReason)}
                    >
                      {lang.save}
                    </Button>
          </div>
        </div>
        <style jsx>
          {`
          .border-bottom{
            border-bottom: 5px solid #F4F4F4;
          }
          .confirmBtn {
            position: absolute;
            width: 100%;
            bottom: 0;
            z-index: 999;
            left: 50%;
            transform: translate(-50%, 0);
            background: var(--l_profileCard_bgColor) !important;
            height: 73px;
            display: flex;
            align-items: center;
            border-radius: 0 0 12px 12px;
            border-top: none !important;
          }
          :global(.mySelect__control){
            height:44px;
            margin-top:8px;
          }
          :global(.mySelect_menu::hover){
            border:1.5px solid var(--l_border);
          }
          .slotPriceInput {
            border: none;
            background: none;
            font-size: inherit;
            font-family: inherit;
            color: inherit;
          }
          .pb__65 {
            padding-bottom: ${mobileView ? "77px !important" : "0"};
          }
          :global(.videoCallSettings){
            min-height: ${!mobileView && "90vh"};
            max-height:${mobileView && "90vh"}
          }
          `}
      </style>
      </Wrapper>
    )
}

export default priceSection
