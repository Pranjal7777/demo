import React from 'react';
import Router from 'next/router';
import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import isMobile from '../../hooks/isMobile';
import Image from '../../components/image/image';
import { DARK_LOGO, GO_LIVE_SCREEN, LOGO } from '../../lib/config';
import { getCookie } from '../../lib/session';
import useProfileData from '../../hooks/useProfileData';
import RouterContext from '../../context/RouterContext';
const Conference = dynamic(() => import("../../containers/videoCall/conference"), { ssr: false });

const conference = (props) => {
  const [mobileView] = isMobile();
  const [profile] = useProfileData();
  const token = getCookie('AGORA_TOKEN');
  const orderId = getCookie('AGORA_CHANNEL');
  const callEndTime = getCookie('CALL_END_TIME');
  const virtualOrderId = getCookie('AGORA_ORDER_ID');
  const hostProfileId = getCookie('CALL_HOST_ID');
  const hostUserName = getCookie('CALL_HOST_USERNAME')
  const MEETING_ID = getCookie("MEETING_ID")
  const [callData, setCallData] = React.useState({});

  const handlePushHome = () => {
    if (hostProfileId === profile._id) {
      if (mobileView) Router.push('/my_orders');
      else Router.push('/my-orders');
    } else {
      if (mobileView) Router.push('/virtual-requests');
      else Router.push('/virtual-request');
    }
  };

  React.useEffect(() => {
      setCallData({
        endTs: callEndTime,
        hostProfileId,
        virtualOrderId
      });

  }, []);

  const AGORA_APP_ID = useSelector((state) => state.appConfig.videoCallAppId) || "134fa256850342f0a6edf55dd273d1d4";

  const setCustomVhToBody = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vhCustom', `${vh}px`);
  };

  React.useEffect(() => {
    if (!mobileView) return;
    setCustomVhToBody();
    window.addEventListener('resize', setCustomVhToBody);

    return () => {
      window.removeEventListener('resize', setCustomVhToBody);
    };
  }, []);

  return (
    <RouterContext forLogin={true} forUser={true} forCreator={true} forAgency={false} {...props}>
    <>
    <div className='w-100 h-100 position-relative bg_black'>
        {!mobileView && <Image src={DARK_LOGO} width={150} className="set_top_left" />}
        <Conference ProfileData={profile} MEETING_ID={MEETING_ID} isHost={hostProfileId === profile._id} hostUserName={hostUserName} virtualOrderId={virtualOrderId} hostProfileId={hostProfileId} callData={callData} setCallData={setCallData} AGORA_TOKEN={token} AGORA_APP_ID={AGORA_APP_ID} AGORA_CHANNEL_NAME={orderId} mobileView={mobileView} handlePushHome={handlePushHome} />
      </div>
      <style jsx>
      {`
      .bg_black {
        background: url(${GO_LIVE_SCREEN.WebBGLivestream});
        background-size: cover;
        background-repeat: no-repeat;
      }
      
      `}
      </style>
    </>
    </RouterContext>
  )
};

// conference.getInitialProps = async ({ ctx }) => {
//   let { query = {} } = ctx;
//   return { query };
// };

export default conference;