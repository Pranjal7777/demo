import { useEffect, useState } from "react"
import { Arrow_Left2 } from "../../../../lib/config/homepage"
import Icon from "../../../image/icon"
import { format } from "date-fns"
import { editScheduleIcon, schedulePlacholderIcon } from "../../../../lib/config"
import { deleteUnavailabilitySlotAPI, getUnavailabilityScheduleAPI } from "../../../../services/videoCall"
import { isAgency } from "../../../../lib/config/creds"
import { open_dialog, stopLoader } from "../../../../lib/global"
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { useTheme } from "react-jss"
import { open_drawer, startLoader } from "../../../../lib/global/loader"
import useLang from "../../../../hooks/language"
import isMobile from "../../../../hooks/isMobile"
import { handleContextMenu } from "../../../../lib/helper"
import { fetchSlotsSubject } from "../../../../lib/rxSubject"
import moment from "moment"

const ViewOverRideSlots = (props) => {

    const [activeType, setActiveType] = useState(1)
    const [unavailabilityActive, setUnavailabilityActive] = useState([]);
    const [unavailabilityExpire, setUnavailabilityExpire] = useState([]);
    const theme = useTheme();
    const [lang] = useLang()
    const [mobileView] = isMobile()

    const fetchActiveOverrides = async () => {
        try {
            const response = await getUnavailabilityScheduleAPI({ creatorId: isAgency() ? "" : "" })
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
            const response = await getUnavailabilityScheduleAPI({ creatorId: isAgency() ? "" : "", status: 3 });
            if (response.status === 200) setUnavailabilityExpire(response.data.data)
            stopLoader();
        }
        catch (err) {
            console.log(err, "is the error");
            stopLoader();
            setUnavailabilityExpire([]);
        };
    };

    const fetchSlots = () => {
        fetchActiveOverrides()
        fetchExpiredOverrides()
    }

    useEffect(() => {
        fetchSlots()
    }, [])

    const handleDateOverRide = (type) => {

        mobileView ? open_drawer('setAddOverride', { overRideType: type, handleVideoAvailibility: fetchActiveOverrides, sucessCallBack: fetchSlots }) : open_dialog('setAddOverride', { overRideType: type, handleVideoAvailibility: fetchActiveOverrides, sucessCallBack: fetchSlots })
    }
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
                console.log(propsToUseAddOverride, extraProps, "asdsadokokok")
                if (mobileView) {
                    open_drawer('setAddOverride', { propsToUseAddOverride, ...extraProps, fromEdit: true }, 'right');
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

    const handleDeleteSlot = async (item) => {
        startLoader()
        const slotId = item.slotId;

        try {
            const response = await deleteUnavailabilitySlotAPI(slotId, 4)

            if (response.status == 200) {
                stopLoader()
                fetchExpiredOverrides()
                fetchActiveOverrides()
                fetchSlotsSubject.next(true)
            }
        }
        catch (err) {
            console.log(err, "is the Error");
            stopLoader()
        }
    }

    return <div className="px-4 py-2 viewComp">
        <div className="position-relative">
            <Icon
                icon={`${Arrow_Left2}#arrowleft2`}
                hoverColor='var(--l_base)'
                width={15}
                height={15}
                onClick={() => { props.setStepper(0) }}
                class="cursor-pointer position-absolute top20"
                style={{ top: "20px" }}
                alt="Back Arrow"
            />
        </div>
        <h3 className={`text-center fntSz24 ${mobileView ? "py-3" : "pt-3"}`}>Time Off</h3>
        <div className="parent d-flex justify-content-between mb-3">
            <div className="overRideType d-flex" style={{ height: "34px" }}>
                <div className="mr-4 pointer manageTab" onClick={() => setActiveType(1)} style={activeType == 1 ? { borderBottom: "3px solid var(--l_base)" } : {}}>Active</div>
                <div className="pointer manageTab" onClick={() => setActiveType(2)} style={activeType == 2 ? { borderBottom: "3px solid var(--l_base)" } : {}}>Past</div>
            </div>
            {activeType === 1 && <div className="AddOverride textClass text-white gradient_bg pointer text-app" onClick={() => {
                mobileView ?
                    open_drawer("chooseOverRideType", { handleDateOverRide: handleDateOverRide }, "bottom") :
                    open_dialog("chooseOverRideType", { handleDateOverRide: handleDateOverRide })
            }}>+ Add</div>}


        </div>

        {activeType == 1 ? <div className={`${!mobileView && "col-12 py-2 px-0"}`}>
            <div className="container__borders py-2">
                <div className="subContainer">
                    <div className='pb-1 col-12 d-flex px-0 justify-content-between align-items-center'>
                    </div>
                    <div style={{ maxHeight: '40vh' }}>
                        {unavailabilityActive.length ? unavailabilityActive.map((item) => (
                            <div key={item.slotId} className="slotBg mb-2 background_oversection">
                                <div className="d-flex justify-content-between">
                                    <div className="d-flex p-2" style={{ gap: "5px" }}>
                                        {
                                            item.isMultipleDays == 1
                                                ? <div className="fntSz14">{moment(item.unavailabilityDate).format('MMM DD, yyyy')}</div>
                                                : <div className="text-app fntSz14">{moment(item.startDate).format('MMM DD, yyyy')} - {moment(item.endDate).format('MMM DD, yyyy')}</div>
                                        }
                                        {
                                            item.unavailabilitySlots && item.isMultipleDays == 1 &&
                                            item.unavailabilitySlots.map(slot => {
                                                return <div className="text-app fntSz14">{slot.startTime} - {slot.endTime}</div>
                                            })
                                        }
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <div
                                        >

                                            <Icon
                                                icon={`${editScheduleIcon}#vector`}
                                                hoverColor='var(--l_base)'
                                                color={'var(--l_app_text)'}
                                                width={15}
                                                height={15}
                                                onClick={() => handleDialog('setAddOverride', { unavailabilityData: item, sucessCallBack: fetchSlots, overRideType: !item.startDate?.length ? 1 : 0 })}
                                                class="mr-2 cursor-pointer"
                                                alt="editIcon"
                                            />
                                        </div>
                                        <div className="pl-2"
                                            onClick={
                                                mobileView ? () => open_drawer("confirmationDrawer", {
                                                    title: "Delete Confirmation",
                                                    subtitle: "Are you sure want to delete this Time Off?",
                                                    yes: () => {
                                                        handleDeleteSlot(item, 3)

                                                    }
                                                }, "bottom")
                                                    : () => open_dialog("confirmationDialog", {
                                                        title: "Delete Confirmation",
                                                        subtitle: "Are you sure want to delete this Time Off?",
                                                        yes: () => {
                                                            handleDeleteSlot(item, 3)

                                                        }
                                                    })
                                            }

                                        >
                                            <DeleteOutlineIcon style={{
                                                color: 'var(--l_app_text)',
                                                fontSize: '21px',
                                                cursor: "pointer"
                                            }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <>
                                <div className="d-flex flex-column align-items-center justify-content-between w-100 my-5">
                                        <img src={schedulePlacholderIcon} className="callout-none" onContextMenu={handleContextMenu} alt="No Overrides Added" />
                                    <span className="txt-black fntSz15 mt-3">No Overrides Active</span>
                                </div>
                            </>
                        )
                        }
                    </div>
                </div>
            </div>
        </div> :
            <div className={`${!mobileView && "col-12 py-2 px-0"}`}>
                <div className="container__borders py-2">
                    <div className="subContainer">
                        <div className='overflow-auto ' style={{ maxHeight: '59.5vh' }}>
                            {unavailabilityExpire.length ? unavailabilityExpire.map((item) => (
                                <div key={item.slotId} className="slotBg mb-2 background_oversection">
                                    <div className="d-flex justify-content-between">
                                        <div className="d-flex p-2" style={{ gap: "5px" }}>
                                            {
                                                item.isMultipleDays == 1
                                                    ? <div className="fntSz14">{moment(item.unavailabilityDate).format('MMM DD, yyyy')}</div>
                                                    : <div className="text-app fntSz14">{moment(item.startDate).format('MMM DD, yyyy')} - {moment(item.endDate).format('MMM DD, yyyy')}</div>
                                            }
                                            {
                                                item.unavailabilitySlots && item.isMultipleDays == 1 &&
                                                item.unavailabilitySlots.map(slot => {
                                                    return <div className="text-app fntSz14">{slot.startTime} - {slot.endTime}</div>
                                                })
                                            }
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <div className="pl-2" onClick={
                                                mobileView ? () => open_drawer("confirmationDrawer", {
                                                    title: "Delete Confirmation",
                                                    subtitle: "Are you sure want to delete this Time Off?",
                                                    yes: () => {
                                                        handleDeleteSlot(item, 4)
                                                    }
                                                }, "bottom")
                                                    : () => open_dialog("confirmationDialog", {
                                                        title: "Delete Confirmation",
                                                        subtitle: "Are you sure want to delete this Time Off?",
                                                        yes: () => {
                                                            handleDeleteSlot(item, 4)
                                                        }
                                                    })}
                                            >
                                                <DeleteOutlineIcon style={{
                                                    color: 'var(--l_app_text)',
                                                    fontSize: '21px',
                                                    cursor: "pointer"
                                                }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <>
                                    <div className="d-flex flex-column align-items-center justify-content-between w-100 my-5">
                                            <img src={schedulePlacholderIcon} className="callout-none" onContextMenu={handleContextMenu} alt="No Overrides Added" />
                                        <span className="txt-black fntSz15 mt-3">No Overrides Expired</span>
                                    </div>
                                </>)
                            }
                        </div>
                    </div>
                </div>
            </div>
        }

        <style jsx>{`
        :global(.viewOverRideSlots .targetDialog){
            min-height:90vh !important;
        }
        .manageTab{
            width: 50px;
    text-align: center;
    padding-bottom: 5px;
        }
        :global(.textClass){
            border-radius: 28px;
            padding: 10px;
            text-align: center;
            width: 76px;
        }
          .demoBack{
            background: rgb(37, 23, 42) !important;
          }
          :global(.top20){
            top:20px;
          }
        `}

        </style>
    </div>
}

export default ViewOverRideSlots