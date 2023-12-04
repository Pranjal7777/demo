import React from 'react'
import DvHomeLayout from '../containers/DvHomeLayout'
import isMobile from '../hooks/isMobile';
import { useRef } from 'react';
import NotificationSetting from '../components/NotiFicationSetting';
import RouterContext from '../context/RouterContext';

const NotificationSettings = (props) => {
  const homePageref = useRef(null);
  const [mobileView] = isMobile();
  return (
    <RouterContext forLogin={true} forUser={true} forCreator={true} forAgency={true} {...props}>
      <div>
        {!mobileView ? <DvHomeLayout
          activeLink="notification-settings"
          pageLink="/notification-settings"
          homePageref={homePageref}
          withMore
          {...props}
        /> : <NotificationSetting />}
      </div>
    </RouterContext>
  )
}

export default NotificationSettings