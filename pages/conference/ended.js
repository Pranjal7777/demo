import React from 'react';
import Router from 'next/router';
import isMobile from '../../hooks/isMobile';
import Image from '../../components/image/image';
import { GO_LIVE_SCREEN, LOGO } from '../../lib/config';
import useProfileData from '../../hooks/useProfileData';
import RouterContext from '../../context/RouterContext';

const conferenceEnded = (props) => {
  const [mobileView] = isMobile();
  const [profile] = useProfileData();
  const handlePushHome = () => {
    if (profile.userTypeCode === 2) {
      if (mobileView) Router.push('/my_orders');
      else Router.push('/my-orders');
    } else {
      if (mobileView) Router.push('/virtual-requests');
      else Router.push('/virtual-request');
    }
  };
  return (
    <RouterContext forLogin={true} forUser={true} forCreator={true} forAgency={false} {...props}>
    <>
    <div className='w-100 vh-100 position-relative bg_black'>
        {!mobileView && <Image src={LOGO} width={150} className="set_top_left" />}
        <div onClick={handlePushHome} className="text-white fntSz20 h-100 w-100 d-flex justify-content-center align-items-center">
        Call has been ended
        </div>
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
}

export default conferenceEnded;