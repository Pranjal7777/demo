// @flow 
import * as React from 'react';
import DvHomeLayout from '../../containers/DvHomeLayout';
import { getCookie, getCookiees } from '../../lib/session';
import { useRouter } from 'next/router';
import useProfileData from '../../hooks/useProfileData';
import Error from '../_error';
import isMobile from '../../hooks/isMobile';
import RouterContext from '../../context/RouterContext'
import CreatorInsights from '../../containers/creatorInsights/CreatorInsights';

const Insights = (props) => {
    const router = useRouter()
    const [profile] = useProfileData()
    const auth = getCookie('auth')
    const [mobileView] = isMobile()

    return (
        <RouterContext forLogin={true} forUser={false} forCreator={true} forAgency={true} {...props}>
        <div className='creatorInsPage'>
            {
                profile && (profile?.userTypeCode == 2 || profile?.userTypeCode == 3) ?
                    !mobileView ? <DvHomeLayout
                        activeLink="myInsights"
                        pageLink="/insights"
                        {...props}
                    /> : <CreatorInsights {...props} /> : ""
            }
            <style jsx>
                {
                    `
                   :global(.creatorInsPage .page_more_side_bar) {
                    padding: 0 !important;
                   }
                   `
                }
            </style>
        </div>
        </RouterContext>
    );
};

export default Insights