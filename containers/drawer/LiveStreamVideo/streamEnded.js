import React from "react";
import Router from 'next/router';
import { useDispatch } from "react-redux";
import { GO_LIVE_SCREEN } from "../../../lib/config";
import { leaveCurrentStream } from "../../../redux/actions/liveStream/liveStream";
import { getCurrentStreamAnalyticsHook } from "../../../hooks/liveStreamHooks";
import AvatarImage from "../../../components/image/AvatarImage";
import isMobile from "../../../hooks/isMobile";
import { close_drawer } from "../../../lib/global";
import { CoinPrice } from "../../../components/ui/CoinPrice";

const streamEnded = (props) => {
  const [analyticsData] = getCurrentStreamAnalyticsHook();
  const [mobileView] = isMobile();
  const dispatch = useDispatch();
  const { onClose, profilePic, userName, isScheduleStream } = props;
  const handleClose = () => {
    onClose();
    dispatch(leaveCurrentStream());
    window.location.href = '/live/popular';
    (isScheduleStream || mobileView) && close_drawer();
  }
  return (
    <>
      <div className="live__stream__ended--overlay fixed-top" onClick={handleClose}>
        <div className="close__stream__div text-right px-4" style={mobileView ? {} : { margin: 'auto', width: '400px' }}>
          <img src={GO_LIVE_SCREEN.close} className={`close__ico cursor-pointer ${mobileView ? '' : 'position-absolute'}`} />
        </div>
        <div className="whole__sec__close__stream px-5 text-white text-center">
          <div className="profile__sec__close__stream">
            {
              profilePic ? (
                <img src={profilePic} className="profile__img__close__stream rounded-circle" />
              ) : (
                <AvatarImage isCustom={true} className="profile__img__close__stream mx-auto rounded-circle" userName={userName} />
              )
            }
          </div>
          <div className="live__stream__ended__txt__heading">Live stream ended</div>
          <div className="live__stream__money__coll font-weight-bold"> <CoinPrice price={analyticsData?.coinsCount} size="20" showCoinText={false} iconSize={19} /></div>
          {/* <div className="live__stream__real__money__heading">( Real money)</div> */}
        </div>
        <div className="live__stream__statistics px-5">
          <div className="live__stream__stats__data  h-100">

            <div className="d-flex justify-content-between flex-wrap" style={{ rowGap: "2rem" }}>
              <div className="d-flex flex-column w-50  align-items-center justify-content-between">
                <img
                  src={GO_LIVE_SCREEN.newFansIco}
                  className="new__fans__ico"
                />
                <div className="stats__describing__txt">New Followers</div>
                <div className="stats__data__txt">{analyticsData?.newFansCount}</div>
              </div>

              <div className="d-flex flex-column w-50 align-items-center justify-content-between">
                <img src={GO_LIVE_SCREEN.uCoinIco} className="uCoins_ico" />
                <div className="stats__describing__txt">Tip</div>
                <div className="stats__data__txt">  <CoinPrice price={analyticsData?.coinsCount} size="20" showCoinText={false} iconSize={19} /></div>
              </div>

              <div className="d-flex flex-column w-50  align-items-center justify-content-between">
                <img
                  src={GO_LIVE_SCREEN.heartStatIco}
                  className="heart__stat__ico"
                />
                <div className="stats__describing__txt">Heart count</div>
                <div className="stats__data__txt">{analyticsData?.totalHeartsCount}</div>
              </div>

              <div className="d-flex flex-column w-50 align-items-center justify-content-between">
                <img
                  src={GO_LIVE_SCREEN.viewerCountIcon}
                  className="new__fans__ico"
                />
                <div className="stats__describing__txt">Viewer count</div>
                <div className="stats__data__txt">{analyticsData?.uniqueViewsCount}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>
        {
          `
          :global(.go-live-body) {
            filter: blur(4px) !important;
          }
          :global(.MuiPaper-root), :global(.drawerBgColor) {
            background-color: transparent;
          }
          
          /* Live Stream Ended Overlay CSS  */
          .live__stream__ended--overlay {
            background-color: rgb(0 0 0 / 40%);
            height: 100vh;
            width: 100vw;
            padding-top: ${mobileView ? 'calc(24vw / 2.5)' : '100px'};
          }
          .close__stream__div .close__ico {
            width: ${mobileView ? 'calc(13vw / 2.5)' : '20px'};
            height: ${mobileView ? 'calc(13vw / 2.5)' : '20px'};
          }
          .profile__sec__close__stream {
            padding-top: ${mobileView ? 'calc(7.33vw / 2.5)' : 'unset'};
            padding-bottom: ${mobileView ? 'calc(13.33vw / 2.5)' : 'unset'};
          }
          :global(.profile__img__close__stream) {
            width: ${mobileView ? 'calc(47.33vw / 2.5)' : '75px'};
            height: ${mobileView ? 'calc(47.33vw / 2.5)' : '75px'};
            object-fit: cover;
            border: ${mobileView ? 'calc(0.6vw / 2.5)' : '2px'} solid white;
          }
          :global(.w-50) {
            width: 50% !important;
          }
          .live__stream__ended__txt__heading {
            font-size: ${mobileView ? 'calc(13.3vw / 2.5)' : '20px'};
            font-weight: 500;
          }
          .live__stream__money__coll {
            font-size: ${mobileView ? 'calc(10.66vw / 2.5)' : '16px'};
            padding-top: ${mobileView ? 'calc(4vw / 2.5)' : '10px'};
            padding-bottom: ${mobileView ? 'calc(3.33vw / 2.5)' : '10px'};
          }
          .live__stream__statistics {
            margin-top: ${mobileView ? 'calc(20vw / 2.5)' : '15px'};
          }
          .live__stream__stats__data {
            background-color: rgb(0 0 0 / 80%);
            border: ${mobileView ? 'none' : '1px solid white'};
            border-radius: ${mobileView ? 'unset' : '20px'};
            max-width: ${mobileView ? '100%' : '300px'};
            height: ${mobileView ? 'calc(145vw / 2.5)' : '260px'};
            margin: ${mobileView ? 'unset' : 'auto'};
            color: rgb(255 255 255 / 60%);
            padding-top: ${mobileView ? 'calc(20vw / 2.5)' : '40px'};
            width: 100%;
            padding-left: 20px;
            padding-right: 20px;
            padding-bottom: 20px;
          }
          .stats--panel--1 {
            padding-left: ${mobileView ? 'calc(17vw / 2.5)' : '11px'};
            padding-right: ${mobileView ? 'calc(36.66vw / 2.5)' : '38px'};
            margin-bottom: 50px;
          }
          .stats--panel--2 {
            padding-left: ${mobileView ? 'calc(22.66vw / 2.5)' : '21px'};
            padding-right: ${mobileView ? 'calc(16vw / 2.5)' : '9px'};
            padding-top: ${mobileView ? 'calc(14.139999999999999vw / 2.5)' : '20px'};
            padding-bottom: ${mobileView ? 'calc(13.66vw / 2.5)' : '20px'};
          }
          
          .new__fans__stats {
            height: ${mobileView ? 'calc(45.19vw / 2.5)' : '18px'};
          }
          .new__fans__ico {
            width: ${mobileView ? 'calc(12.425999999999998vw / 2.5)' : '25px'};
            height: ${mobileView ? 'calc(8.7733vw / 2.5)' : '18px'};
            margin-bottom: 10px;
          }
          .uCoins_ico {
            width: ${mobileView ? 'calc(10.66vw / 2.5)' : '25px'};
            height: ${mobileView ? 'calc(10.66vw / 2.5)' : '18px'};
            margin-bottom: 10px;
          }
          .heart__stat__ico {
            width: ${mobileView ? 'calc(11.133vw / 2.5)' : '25px'};
            height: ${mobileView ? 'calc(9.746599999999999vw / 2.5)' : '18px'};
            margin-bottom: 10px;
          }
          .stats__describing__txt {
            font-family: 'Roboto';
            font-size: ${mobileView ? 'calc(9.33vw / 2.5)' : '14px'};
          }
          .stats__data__txt {
            color: white;
            font-family: 'Roboto';
            font-size: ${mobileView ? 'calc(12vw / 2.5)' : '20px'};
          }
          // .stats__data__container::after {
          //   position: absolute;
          //   content: "";
          //   width: 100%;
          //   height: calc(0.6vw / 2.5);
          //   left: 0;
          //   bottom: 0;
          //   background-color: #707070;
          // }
          // .catchy__live__stream__end__msg__div {
          //   padding-top: calc(10.329999999999998vw / 2.5);
          //   padding-bottom: calc(10.66vw / 2.5);
          //   font-size: calc(9.333vw / 2.5);
          // }
          `
        }
      </style>
    </>
  );
};

export default streamEnded;
