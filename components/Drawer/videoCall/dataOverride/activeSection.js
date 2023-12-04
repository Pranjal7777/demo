import React from 'react'
import { format } from 'date-fns'
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { useTheme } from 'react-jss';
import useLang from '../../../../hooks/language';
import EditIcon from '@material-ui/icons/Edit';
import dynamic from "next/dynamic";
import Wrapper from '../../../wrapper/wrapper'
import { deleteUnavailabilitySlotAPI, getUnavailabilityScheduleAPI } from '../../../../services/videoCall';
import { startLoader, stopLoader } from '../../../../lib/global';
import { schedulePlacholderIcon } from '../../../../lib/config';
import { isAgency } from '../../../../lib/config/creds';
import { useSelector } from 'react-redux';
import { handleContextMenu } from '../../../../lib/helper';
const Button = dynamic(() => import("../../../../components/button/button"), { ssr: false });

const activeSection = (props) => {
  const { handleDialog } = props;
  const [lang] = useLang();
  const theme = useTheme();
  const [unavailability, setUnavailability] = React.useState([]);
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

  React.useEffect(() => {
    getUnavailabilityScheduled()
  }, [])

  const getUnavailabilityScheduled = async () => {
    startLoader()
    try {
      const response = await getUnavailabilityScheduleAPI({ creatorId: isAgency() ? selectedCreatorId : "" })
      setUnavailability(response.data.data)
      stopLoader()
    }
    catch (err) {
      console.log(err, "is the error");
      stopLoader()
      setUnavailability([]);
    }
  }

  const handleDeleteSlot = async (item) => {
    startLoader()
    const slotId = item.slotId;
    
    try {
      const response = await deleteUnavailabilitySlotAPI(slotId, '3')
      
      if (response.status == 200) {
        stopLoader()
        getUnavailabilityScheduled()
      }
    }
    catch (err) {
      console.log(err, "is the Error");
      stopLoader()
    }
  }


  return (
    <Wrapper>
      <div className="d-flex pt-3 align-items-center justify-content-between">
        <div className="col-12">
          <Button
            type="button"
            cssStyles={theme.blueBorderButton}
            onClick={() => handleDialog('setAddOverride')}
          // disabled={!value || (value == "Others" && !otherReason)}
          >
            {lang.addDateOverride}
          </Button>
        </div>
      </div>
      <div className=''>
      {
        unavailability?.length ? unavailability.map(item => {
          return <div className="px-3 pt-3">
            <div className="slotBg">
              <div className="d-flex justify-content-between">
                <div>
                  {
                    item.isMultipleDays == 1
                      ? <div className="fntSz15">{format(new Date(item.unavailabilityDate), 'dd MMM yyyy')}</div>
                      : <div className="fntSz15">{format(new Date(item.startDate), 'dd MMM yyyy')} - {format(new Date(item.endDate), 'dd MMM yyyy')}</div>
                  }
                  {
                    item.unavailabilitySlots && item.isMultipleDays == 1 &&
                    item.unavailabilitySlots.map(slot => {
                      return <div className="liteColorTxt fntSz14">{slot.startTime} - {slot.endTime}</div>
                    })
                  }
                </div>
                <div className="d-flex align-items-center">
                  <div>
                    <EditIcon style={{
                      color: '#fff',
                      background: '#8C959D',
                      borderRadius: '50%',
                      fontSize: '21px',
                      padding: '4px'
                    }}
                    onClick={() => handleDialog('setAddOverride', { unavailabilityData: item })}
                    />
                  </div>
                  <div
                    className="pl-2"
                  >
                    <DeleteOutlineIcon
                      onClick={() => handleDeleteSlot(item)}
                      style={{
                        color: '#8C959D'
                      }} />
                  </div>
                </div>
              </div>
              <div className="liteColorTxt fntSz14 pt-2">{item.notes}</div>
            </div>
          </div>
        }) : (<>
        <div className="d-flex flex-column align-items-center justify-content-between w-100 mt-5">
                <img src={schedulePlacholderIcon} className='callout-none' onContextMenu={handleContextMenu} alt="No Overrides Added" />
          <span className="txt-black fntSz15 mt-3">No Overrides Active</span>
        </div>
        </>)
      }
      </div>
      {/* <div className="d-flex pt-3 confirmBtn align-items-center justify-content-between">
        <div className="col-12">
          <Button
            type="button"
            cssStyles={theme.blueButton}
          // onClick={reportSubmitHandler}
          // disabled={!value || (value == "Others" && !otherReason)}
          >
            {lang.confirm}
          </Button>
        </div>
      </div> */}
      <style jsx>
        {`
                .confirmBtn{
                  position: fixed;
                  width: 100%;
                  bottom: 20px;
                }
                :global(.dynamicHeightForIos){
                  height: ${navigator.userAgent.match(/Android/i) ? "100% !important" : "calc(100vh - 200px) !important"} 
                }
                `}
      </style>
    </Wrapper>
  )
}

export default activeSection
