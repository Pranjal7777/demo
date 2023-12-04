import dynamic from 'next/dynamic';
import React from 'react'
import { useRef } from 'react';
import Notification from '../components/notification';
import Wrapper from '../hoc/Wrapper';
import isMobile from '../hooks/isMobile';
import DvHomeLayout from "../containers/DvHomeLayout"

function notification(props) {
    const [mobileView] = isMobile();
    const homePageref = useRef(null);

    return (
        <div ref={homePageref} id="home-page">
            {mobileView ? (
                <div>
                    <Notification />
                </div>
            ) : (
                <Wrapper>
                    {/* <DvMyAccountLayout
                setActiveState={(props) => {
                  setActiveNavigationTab(props);
                }}
                activeLink="video-schedule"
                homePageref={homePageref}
                {...props}
              ></DvMyAccountLayout> */}
                    <DvHomeLayout
                        activeLink="Notification"
                        pageLink="/notification"
                        homePageref={homePageref}
                        featuredBar
                        {...props}
                    />
                    </Wrapper>
            )}
        </div>
    )
}

export default notification;
