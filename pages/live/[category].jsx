import React from "react";
import dynamic from "next/dynamic";
import isMobile from "../../hooks/isMobile";
import LiveStreamTabs from "../../containers/live-stream-tabs/live-stream-tabs";
import { getCookie } from "../../lib/session";
import Script from "next/script";
import { getStreamUserId } from "../../lib/global";
import { updateUserStatusAPI } from "../../services/liveStream";
import { useSelector } from "react-redux";
import DvHomeLayout from "../../containers/DvHomeLayout";
import { isAgency } from "../../lib/config/creds";
import { useRef } from "react";
const ModelBottomNavigation = dynamic(() => import("../../containers/timeline/bottom-navigation-model"), { ssr: false });
const UserBottomNavigation = dynamic(() => import("../../containers/timeline/bottom-navigation-user"), { ssr: false });

const liveStreamsAvailable = (props) => {
  const { category = 'popular' } = props.query;
  const [activeNavigationTab, setActiveNavigationTab] = React.useState('live');
  const [mobileView] = isMobile();
  const homePageref = useRef(null);
  const userType = getCookie("userType");
  const profile = useSelector((state) => state.profileData);

  React.useEffect(() => {
    if (typeof window !== 'undefined' && window?.stream) {
      window.stream?.getVideoTracks()[0]?.stop();
      window.stream?.getAudioTracks()[0]?.stop();
    }
    if (!isAgency()) {
      if (getStreamUserId()) updateUserStatusAPI(getStreamUserId());
    }
  }, []);

  return (
    <>
      <Script src="https://player.live-video.net/1.18.0/amazon-ivs-player.min.js" strategy="afterInteractive" />
      {/* {!mobileView && <MarkatePlaceHeader setActiveState={(props) => { setActiveNavigationTab(props); }} {...props} />} */}
      {mobileView && <LiveStreamTabs selectedCategory={category} changeTheme={props.changeTheme} />}
      {mobileView ? (
        profile?.userTypeCode === 2 || userType === 2
          ? <ModelBottomNavigation
            uploading={props.postingLoader}
            setActiveState={(props) => {
              setActiveNavigationTab(props);
            }}
            tabType={activeNavigationTab}
          />
          : <UserBottomNavigation
            setActiveState={(props) => {
              setActiveNavigationTab(props);
            }}
            tabType={activeNavigationTab}
          />
      ) : <DvHomeLayout
        category={category}
        changeTheme={props.changeTheme}
        featuredBar
        activeLink="Live"
        pageLink="/live/popular"
        homePageref={homePageref}
      />}
    </>
  )
};

liveStreamsAvailable.getInitialProps = async ({ ctx }) => {
  let { query = {} } = ctx;
  return { query };
};

export default liveStreamsAvailable;
