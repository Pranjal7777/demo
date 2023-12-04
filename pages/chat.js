import * as React from 'react';
import DvHomeLayout from '../containers/DvHomeLayout';
import isMobile from '../hooks/isMobile';
import { HUMBERGER_ICON } from '../lib/config/header';
import Icon from '../components/image/icon';
import dynamic from 'next/dynamic';
const ModelBottomNavigation = dynamic(() => import("../containers/timeline/bottom-navigation-model"), { ssr: false });
const GuestBottomNavigation = dynamic(() => import("../containers/timeline/bottom-navigation-guest"), { ssr: false });
const UserBottomNavigation = dynamic(() => import("../containers/timeline/bottom-navigation-user"), { ssr: false });
import { authenticate } from '../lib/global/routeAuth';
import { useRouter } from 'next/router';
import { getCookie } from '../lib/session';
import { open_drawer } from '../lib/global/loader';
import { useTheme } from 'react-jss';
import useProfileData from '../hooks/useProfileData';
import { getElementMaxHeight } from '../lib/helper';
import RouterContext from '../context/RouterContext';


const isoChat = (props) => {
    const mobileView = props?.isMobile
    const router = useRouter();
    const auth = getCookie('auth')
    const userType = getCookie('userType')
    const [activeState, setActiveState] = React.useState()
    const [showHeader, setShowHeader] = React.useState(true)
    const [activeNavigationTab, setActiveNavigationTab] = React.useState('chat')
    const theme = useTheme()
    const profile = useProfileData()

    const handleChatChange = (status) => {
        if (status) {
            setShowHeader(false)
        } else {
            setShowHeader(true)
        }
    }

    const handleNavigationMenu = () => {
        open_drawer("SideNavMenu", {
            paperClass: "backNavMenu",
            setActiveState: setActiveState,
            noBorderRadius: true
        },
            "right"
        );
    };
    return (
        <RouterContext forLogin={true} forUser={true} forCreator={true} forAgency={true} {...props}>
            <div>
                <DvHomeLayout
                    activeLink="chat"
                    pageLink="/chat"
                    onChatChange={handleChatChange}
                    {...props}
                // ctx={...ctx}
                />
                <div className='chat-bottom-nav'>
                    {mobileView
                        ? auth
                            ? !showHeader
                                ? ""
                                : profile?.userTypeCode == 2 || userType == 2
                                    ? <ModelBottomNavigation
                                        // uploading={props.postingLoader}
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
                </div>
            </div>
        </RouterContext>
    );
};

export default isoChat