import React, { useEffect, useState } from 'react';
import HashtagPage from '../../containers/sub-pages/hashtagPage';
import dynamic from 'next/dynamic';
import isMobile from "../../hooks/isMobile";
import { getCookie } from '../../lib/session';
import { returnLogin } from '../../lib/global';
import { useSelector } from 'react-redux';
import DvHomeLayout from '../../containers/DvHomeLayout';
const ModelBottomNavigation = dynamic(() => import("../../containers/timeline/bottom-navigation-model"), { ssr: false });
const UserBottomNavigation = dynamic(() => import("../../containers/timeline/bottom-navigation-user"), { ssr: false });
const GuestBottomNavigation = dynamic(() => import("../../containers/timeline/bottom-navigation-guest"), { ssr: false });

const HashtagsPage = (props) => {
  const auth = getCookie("auth");
  const [mobileView] = isMobile();
  const { query } = props;
  const [activeNavigationTab, setActiveNavigationTab] = useState('hashtag');
  const userType = getCookie("userType");
  const profile = useSelector((state) => state.profileData);
  useEffect(() => {
    setActiveNavigationTab('hashtag')
  }, []);

  return <>
    <DvHomeLayout
      activeLink="Explore"
      pageLink="/explore"
      featuredBar
      {...props}
    />
    {mobileView
      ? auth
        ? profile?.userTypeCode=== 2 || userType === 2
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
        : <GuestBottomNavigation
          setActiveState={(props) => {
            setActiveNavigationTab(props);
          }}
          tabType={activeNavigationTab}
        />

      : null
    }
  </>
}

HashtagsPage.getInitialProps = async ({ Component, ctx }) => {
  const { query = {}, req, res } = ctx;
  // returnLogin(req, res);
  return { query: query };
};

export default HashtagsPage;
