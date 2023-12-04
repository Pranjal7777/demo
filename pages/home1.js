import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { returnLogin } from "../lib/global";
import useProfileData from "../hooks/useProfileData";

//Different navigation pages
const UserBottomNavigation = dynamic(() => import("../containers/timeline/bottom-navigation-user"), { ssr: false });
const ModelBottomNavigation = dynamic(() => import("../containers/timeline/bottom-navigation-model"), { ssr: false });
const GuestBottomNavigation = dynamic(() => import("../containers/timeline/bottom-navigation-guest"), { ssr: false });
const ProfilePage = dynamic(() => import("../containers/sub-pages/profilePage"), { ssr: false });
const ChatPage = dynamic(() => import("../containers/sub-pages/chatPage"), { ssr: false });
const HomePage = dynamic(() => import("../containers/sub-pages/homepage"), { ssr: false });
import CustomHead from "../components/html/head";
import { s3ImageLinkGen } from "../lib/UploadAWS/uploadAWS";

const Home = (props) => {
  const [profile] = useProfileData();
  const { query } = props;
  const { tabType = "timeline" } = query;
  const [activeNavigationTab, setActiveNavigationTab] = useState(tabType);
  // const IMAGE_LINK = useSelector((state) => state?.cloudinaryCreds?.IMAGE_LINK)
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);

  return (
    <div className="mv_wrap_home" id="home-page">
      {activeNavigationTab === "timeline" && (
        <>
          <CustomHead {...props.seoSettingData} />
          <HomePage />
        </>
      )}
      {activeNavigationTab === "profile" && (
        <>
          <CustomHead
            ogTitle={profile && profile.firstName + " " + profile.lastName}
            ogImage={s3ImageLinkGen(S3_IMG_LINK, profile.profilePic)}
            description={profile && profile.bio}
            pageTitle={profile && profile.firstName + " " + profile.lastName}
          />
          <ProfilePage query={query} />
        </>
      )}

      {activeNavigationTab === "chat" && <ChatPage />}

      {profile.userTypeCode === 1 && (
        <>
          <CustomHead {...props.seoSettingData} />
          <UserBottomNavigation
            setActiveState={(props) => {
              setActiveNavigationTab(props);
            }}
            tabType={activeNavigationTab}
          />
        </>
      )}
      {profile.userTypeCode === 2 && (
        <>
          <CustomHead {...props.seoSettingData} />
          <ModelBottomNavigation
            uploading={props.postingLoader}
            setActiveState={(props) => {
              setActiveNavigationTab(props);
            }}
            tabType={activeNavigationTab}
          />
        </>
      )}
      {profile.userTypeCode !== 1 && profile.userTypeCode !== 2 && (
        <>
          <CustomHead {...props.seoSettingData} />
          <GuestBottomNavigation
            setActiveState={(props) => {
              setActiveNavigationTab(props);
            }}
            tabType={activeNavigationTab}
          />
        </>
      )}

      {/* <div onClick={() => signOut()}>logout</div> */}
    </div>
  );
};

Home.getInitialProps = async ({ Component, ctx }) => {
  const { query = {}, req, res } = ctx;

  returnLogin(req, res);

  return { query: query };
};

export default Home;
