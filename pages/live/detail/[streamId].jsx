import Script from 'next/script';
import React from 'react';
import dynamic from "next/dynamic";
import { useSelector } from 'react-redux';
import isMobile from '../../../hooks/isMobile';
import { APP_NAME, GO_LIVE_SCREEN } from '../../../lib/config';
import Router from 'next/router';
import { getStreamDetailAPI } from '../../../services/liveStream';
import { Toast } from '../../../lib/global';
import { getCookiees } from '../../../lib/session';
import { ParseToken } from '../../../lib/parsers/token-parser';
import { LOGO } from '../../../lib/config/logo';
const StreamLoader = dynamic(() => import('../../../containers/live-stream-tabs/streamLoader'), { ssr: false });
const StreamInfoDrawer = dynamic(() => import('../../../containers/drawer/LiveStreamVideo/streamInfoDrawer'), { ssr: false });

const streamDetailPage = (props) => {
  const { streamId, q = false } = props.query;
  const [streamData, setStreamData] = React.useState(null);
  const profilePic = useSelector(state => state.profileData.profilePic);
  const token = useSelector(state => state.guestToken);
  const [isLoading, setIsLoading] = React.useState(true);
  const [mobileView] = isMobile();

  React.useEffect(async () => {
    try {
      const response = await getStreamDetailAPI(streamId, Boolean(q), props?.auth ? {} : { authorization: ParseToken(token) });
      if (response?.status == 204) {
        Toast('No Stream Found', 'warning');
      }
      if (response?.status == 200 && response.data?.stream) {
        setStreamData(response.data.stream[0]);
      }
      console.log(response, 'is the response');
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  }, []);

  const handleClose = () => {
    Router.push('/');
  };


  return (
    <>
      <Script src="https://player.live-video.net/1.5.0/amazon-ivs-player.min.js" strategy="afterInteractive" />
      <div className="vh-100 vw-100 bg_black position-relative">
        {!mobileView && <img className="fanzly_logo_detail" src={props?.auth ? LOGO : GO_LIVE_SCREEN.fanzlyLogoStreamDetail} width={props?.auth ? 200 : 260} alt={APP_NAME + " Logo"} />}
        <div className="streamdetailsPage__container overflow-auto">
          {
            streamData && <StreamInfoDrawer streamData={streamData} onClose={handleClose} isPage={!mobileView} enablePageStyle />
          }
        </div>
        {!mobileView && <img onClick={handleClose} className="close_option cursorPtr" src={GO_LIVE_SCREEN.crossIconWhite} width={24} height={24} alt="Close Option" />}
      </div>
      {isLoading && <StreamLoader loaderPic={profilePic} />}
      <style jsx="true">
        {`
      .bg_black {
        background: url(${GO_LIVE_SCREEN.WebBGLivestream});
        background-size: cover;
        background-repeat: no-repeat;
      }
      .streamdetailsPage__container {
        position: ${mobileView ? 'unset' : 'absolute'};
        left: ${mobileView ? 'unset' : '50%'};
        top: ${mobileView ? 'unset' : '50%'};
        transform: ${mobileView ? 'unset' : 'translate(-50%, -50%)'};
        width: ${mobileView ? '100vw' : '30%'};
        height: ${mobileView ? '100vh' : '83%'};
        border-radius: ${mobileView ? 'unset' : '12px'};
        max-width: ${mobileView ? 'unset' : '390px'};
        background:var(--l_drawer);
      }
      .close_option {
        position: absolute;
        top: 15px;
        right: 15px;
      }
      .fanzly_logo_detail {
        position: absolute;
        top: 15px;
        left: 15px;
      }
      `}
      </style>

    </>
  )
};

streamDetailPage.getInitialProps = async ({ ctx }) => {
  let { query = {},req } = ctx;
  const auth = getCookiees("auth", req);
  return { query, auth };
};

export default streamDetailPage;
