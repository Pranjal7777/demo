import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Router from 'next/router';
import StreamCardsPopular from "./stream-cards-popular";
import StreamCardsFollowing from "./stream-cards-following";
import StreamCardsUpcoming from "./stream-cards-upcoming";
import { leaveCurrentStream } from "../../redux/actions/liveStream/liveStream";
import isMobile from "../../hooks/isMobile";
import { useTheme } from "react-jss";
import isTablet from "../../hooks/isTablet";
import useLang from "../../hooks/language";
import { drawerToast, sendMail } from "../../lib/global";
import WarnStateNotConnected from "./live-video-screen/warnStateNotConnected";
import Button from "../../components/button/button";
import CommonHeader from "../../components/commonHeader/commonHeader";

const LiveStreamTabs = (props) => {
  const dispatch = useDispatch();
  const [warnStateIssue, setWarnStateIssue] = useState(false);
  const [callStreamFunction, setCallStreamFunction] = useState(false)
  const profileData = useSelector(state => state.profileData);
  const [activeTab, setActiveTab] = React.useState(props.selectedCategory);
  const [mobileView] = isMobile();
  const [tabletView] = isTablet();
  const theme = useTheme();
  const [lang] = useLang();

  React.useEffect(() => {
    setActiveTab(props.selectedCategory);
  }, [props.selectedCategory]);

  React.useEffect(() => {
    dispatch(leaveCurrentStream());
  }, []);
  const verifyAccount = (e) => {
    e.preventDefault();
    // setIsCatDialogOpen(false);
    if (profileData && [5, 6].includes(profileData.statusCode)) {
      return drawerToast({
        closing_time: 10000,
        title: lang.submitted,
        desc: lang.unverifiedProfile,
        closeIconVisible: true,
        button: {
          text: lang.contactUs,
          onClick: () => {
            sendMail();
          },
        },
        titleClass: "max-full",
        autoClose: true,
        isMobile: false,
      });
    } else {
      Router.push('/broadcast')
    }
  };

  const goLiveBtn = {
    label: 'Go Live',
    active: true,
    clickAction: verifyAccount
  }

  return (
    <div className="position-relative overflowY-auto" style={{ height: mobileView ? "100vh" : "auto" }}>
      <div className="sticky-top borderBtm">
        <CommonHeader
          title={lang.liveLabel}
          isProfilePic
          button1={profileData?.userTypeCode === 2 ? goLiveBtn : false}
        />
      </div>
      <div
        id="stream__cards_page"
        className="tab-content overflowY-auto"
        style={{ height: `calc(calc(var(--vhCustom, 1vh) * 100) - 64px ${mobileView ? "- 74px" : ""})` }}
      >
        <div className="d-flex flex-row gap_8 pl-3 pt-3">
          <div>
            <Button
              type="button"
              fixedBtnClass={activeTab === 'popular' ? "active" : "inactive"}
              fclassname='headerBtnPadding'
              onClick={() => Router.push('/live/popular')}
              children={"Popular"}
            />
          </div>
          <div>
            <Button
              type="button"
              fixedBtnClass={activeTab === 'following' ? "active" : "inactive"}
              fclassname='headerBtnPadding'
              onClick={() => Router.push('/live/following')}
              children={"Following"}
            />
          </div>
          <div>
            <Button
              type="button"
              fixedBtnClass={activeTab === 'upcoming' ? "active" : "inactive"}
              fclassname='headerBtnPadding'
              onClick={() => Router.push('/live/upcoming')}
              children={"Upcoming"}
            />
          </div>
        </div>
        <div id="Popular" className={`tab-pane ${activeTab === 'popular' ? 'active' : 'fade'}`}>
          {activeTab === 'popular' && <StreamCardsPopular setWarnStateIssue={setWarnStateIssue} callStreamFunction={callStreamFunction} />}
        </div>
        <div id="Following" className={`tab-pane ${activeTab === 'following' ? 'active' : 'fade'}`}>
          {activeTab === 'following' && <StreamCardsFollowing setWarnStateIssue={setWarnStateIssue} callStreamFunction={callStreamFunction} />}
        </div>
        <div id="Upcoming" className={`tab-pane ${activeTab === 'upcoming' ? 'active' : 'fade'}`}>
          {activeTab === 'upcoming' && <StreamCardsUpcoming setWarnStateIssue={setWarnStateIssue} callStreamFunction={callStreamFunction} />}
        </div>
      </div>
      {warnStateIssue && <WarnStateNotConnected handleNo={() => {
        setCallStreamFunction(false)
        setWarnStateIssue(false)
      }} handleYes={() => setCallStreamFunction(true)} />}
      <style jsx>{`
        .goLive {
          position: fixed;
          bottom: 45px;
          left: 50%;
          transform: translateX(-50%) translateY(-50%);
          border-radius: 25px;
          background: ${theme.palette.l_base};
          color: #fff;
          z-index: 2;
        }
        .goLiveDV {
          position: absolute;
          border-radius: 25px;  
          background: ${theme.palette.l_base};
          color: #fff;
          top: 11vh;
          z-index: 2;
          right: 1rem;
          padding-left: 38px;
          padding-right: 38px;
          box-shadow: 0px 3px 6px #00000029;
          cursor: pointer;
        }
        .live_moblie_btn{
          position: absolute;
          bottom: 5rem;
          right: calc(50% - 3.8rem);
        }
        :global(.warn_message_broadcast_popup){
          bottom: ${mobileView && activeTab !== 'upcoming' && "70px !important"};
        }
        @media (min-width: 700px) and (max-width: 991.98px){
          .goLiveDV {
            top: 8vh;
          }
        }
      `}</style>
    </div>
  );
};

export default LiveStreamTabs;