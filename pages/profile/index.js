import React, { useEffect, useRef, useState } from 'react'
import Script from 'next/script';
import ProfilePage from '../../containers/sub-pages/profilePage';
import useProfileData from "../../hooks/useProfileData";
import { useDispatch, useSelector } from "react-redux";
import isMobile from "../../hooks/isMobile";
import { getCookie } from '../../lib/session';
import dynamic from 'next/dynamic';
import CustomHead from '../../components/html/head';
import { APP_NAME } from '../../lib/config';
// import { s3ImageLinkGen } from '../../lib/UploadAWS/uploadAWS';
import { returnLogin } from '../../lib/global';
import { getSeoSettings } from '../../services/auth';
import { s3ImageLinkGen } from '../../lib/UploadAWS/uploadAWS';
const ModelBottomNavigation = dynamic(() => import("../../containers/timeline/bottom-navigation-model"), { ssr: false });

const Profile = (props) => {
    const homePageref = useRef(null);
    const [profile] = useProfileData();
    const { query } = props;
    const [mobileView] = isMobile();
    const auth = getCookie("auth");
    const [activeNavigationTab, setActiveNavigationTab] = useState('profile');
    // const IMAGE_LINK = useSelector((state) => state?.cloudinaryCreds?.IMAGE_LINK);
    const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);

    useEffect(() => {
        setActiveNavigationTab('profile')
    }, []);

    return (
        <React.Fragment>
            <Script src="https://player.live-video.net/1.18.0/amazon-ivs-player.min.js" strategy="lazyOnload" />
            <CustomHead
                ogTitle={`${profile && profile.username} - Profile | ${APP_NAME}`}
                ogImage={s3ImageLinkGen(S3_IMG_LINK, profile.profilePic)}
                // ogImage={`${IMAGE_LINK}${profile && profile.profilePic}`}
                description={profile && profile.bio}
                pageTitle={`${profile && profile.username} - Profile | ${APP_NAME}`}
                // metaTags={[profile && profile?.firstName + " " + profile?.lastName, ...props?.seoSettingData?.metaTags]}
                metaTags={props?.seoSettingData?.metaTags
                    ? [profile && profile?.firstName + " " + profile?.lastName, ...props?.seoSettingData?.metaTags]
                    : [profile?.firstName + " " + profile?.lastName]
                }
            />
            <div
                className="mv_wrap_home pb-0"
                id="home-page"
                ref={homePageref}
                style={{
                    overflowX: "hidden",
                }}
            >
                <ProfilePage
                    query={query}
                    setActiveState={(props) => { }}
                    homePageref={homePageref}
                    {...props}
                />
            </div>
            {/* {mobileView
                ? <ModelBottomNavigation
                    uploading={props.postingLoader}
                    setActiveState={(props) => {
                        setActiveNavigationTab(props);
                    }}
                    tabType={activeNavigationTab}
                />
                : null
            } */}
        </React.Fragment>
    )
}
Profile.getInitialProps = async ({ Component, ctx }) => {
    const { query = {}, req, res } = ctx;
    if (query.tab == "profile") {
        returnLogin(req, res);
    }
    return { query: query };
};
export default Profile
