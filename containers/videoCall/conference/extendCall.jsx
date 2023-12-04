import React from 'react';
import moment from 'moment';
import momentzone from "moment-timezone";
import isMobile from '../../../hooks/isMobile';
import { close_dialog, close_drawer, open_dialog, open_drawer, startLoader, stopLoader, Toast } from '../../../lib/global';
import useLang from "../../../hooks/language"
import { getSlotsInfoAPI } from '../../../services/videoCall';
import { defaultTimeZone } from '../../../lib/config';
import { useRouter } from 'next/router';

const extendCall = (props) => {
  const { callData = {}, isHost, handleDispose, extensionStatus, setExtensionStatus } = props;
  const [mobileView] = isMobile();
  const [slotArray, setSlotArray] = React.useState([]);
  const [currentTime,  setCurrentTime] = React.useState(moment(momentzone.tz(defaultTimeZone()).format('LLLL'), 'LLLL').unix());
  const [lang] = useLang();
  const router = useRouter();
  const { isExtensionRejected } = router.query;

  React.useEffect(async () => {
    const { hostProfileId } = callData;
    if (!hostProfileId || isHost) return;
    try {
      const response = await getSlotsInfoAPI(hostProfileId);
      if (response.status === 200 && response.data.data?.slotExtensionCharges?.length) {
        setSlotArray([...response.data.data.slotExtensionCharges]);
      } else setSlotArray([]);
    } catch (err) {
      console.error(err);
      setSlotArray([]);
    }

  }, [callData]);

  const handleExtendCall = async () => {
    if (!["unextended", "extended"].includes(extensionStatus) || !slotArray.length || isExtensionRejected === "true") return;
    const { virtualOrderId } = callData;
    const propsToPass = {
      slotArray,
      price: null,
      currency: "$",
      updatePostPurchase: () => {
        setExtensionStatus("waiting")
      },
      isCallExtension: true,
      virtualOrderId
    };
    mobileView
      ? open_drawer("buyPost", propsToPass, "bottom")
      : open_dialog("buyPost", propsToPass);
  };

  React.useEffect(() => {
    const intervalID = setInterval(() => {
      setCurrentTime(moment(momentzone.tz(defaultTimeZone()).format('LLLL'), 'LLLL').unix());
    }, 30000);

    return () => {
      clearInterval(intervalID);
    }
  }, []);

  // React.useEffect(() => {
  //   if ((callData.endTs - currentTime) <= 0) {
  //     Toast('Call Finished !', "warning");
  //     close_dialog();
  //     close_drawer();
  //     handleDispose?.();
  //   }
  // }, [currentTime]);

  const differenceCalc = (bigTimeStamp, smallTimeStamp) => {
    console.log(bigTimeStamp, smallTimeStamp);
    const differenceSeconds = bigTimeStamp - smallTimeStamp;
    const daydiff = ~~((differenceSeconds/3600)/24);
    const hrsdiff = ~~((differenceSeconds%86400)/3600);
    const minutesDiff = ~~((differenceSeconds%3600)/60);
    let str = '';
    if (daydiff > 0) str += `${daydiff}day `;
    if (hrsdiff > 0) str += `${hrsdiff}hr `;
    if (minutesDiff > 0) str += `${minutesDiff}min`;
    if (!str) str += 'Few Seconds'
    return str;
    // return `${daydiff < 10 ? '0' + daydiff : daydiff}: ${hrsdiff < 10 ? '0' + hrsdiff : hrsdiff}: ${minutesDiff < 10 ? '0' + minutesDiff : minutesDiff}`;
  }

  return (
      <>
        <div className="extension__feature txt-heavy text-white fntSz14 d-flex justify-content-between py-2 px-2">
            <span>
            {`${lang.callEnds} ${differenceCalc(callData.endTs, currentTime)}`}
            </span>
            {!isHost && !!slotArray.length && <span className={`text-uppercase ${["unextended", "extended"].includes(extensionStatus) ? 'cursorPtr' : ''}`} onClick={handleExtendCall}>
                {
            isExtensionRejected === "true"
              ? lang.extensionRejected
              : extensionStatus === "unextended"
                  ? lang.extend
                  : extensionStatus === "waiting"
                  ? lang.waitingAccept
                  : extensionStatus === "extended"
                  ? lang.extendMore
                  : extensionStatus === "rejected"
                  ? lang.extensionRejected
                  : ""
                }
            </span>}
        </div>
        <style jsx="true">
            {`
            .extension__feature {
                background-color: #EC187D8B;
                border: 1px solid #FF0079;
                border-radius: 5px;
            }
            
            `}
        </style>
      </>
  )
}

export default extendCall;