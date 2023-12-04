import React from 'react';
import { useDispatch } from 'react-redux';
import { useSwipeable } from "react-swipeable";
import Router from 'next/router';
import { CLOSE_ICON_WHITE, GO_LIVE_SCREEN } from '../../../lib/config';
import isMobile from "../../../hooks/isMobile";
import { leaveCurrentStream, unlockStreamAction } from '../../../redux/actions/liveStream/liveStream';
import { open_dialog, open_drawer } from '../../../lib/global';

const streamLockedOverlay = (props) => {
  const { swipeNext, swipePrev, handlePageBack, streamData, updateLockedStream } = props;
  const [mobileView] = isMobile();
  const swipeHandler = useSwipeable({
    // To manage the swipe events in Mobile Device only
    onSwipedUp: swipeNext,
    onSwipedDown: swipePrev,
    trackMouse: false,
    trackTouch: true,
    preventDefaultTouchmoveEvent: true,
  });
  const dispatch = useDispatch();
  const handleStopppedStreamClose = () => {
    dispatch(leaveCurrentStream());
    Router.push("/live/popular");
    handlePageBack?.();
  };
  const returnConfig = () => (mobileView ? swipeHandler : {});
  const symbolReturn = (paymentCurrencyCode) => {
    switch (paymentCurrencyCode) {
      case 'INR':
        return '₹';
      case 'USD':
        return '$';
      default:
        return paymentCurrencyCode;
    }
  };

  const openExclusiveLiveStream = () => {
    mobileView
        ? open_drawer(
          "buyPost",
          {
            creatorId: streamData.userDetails.walletUserId,
            streamId: streamData.streamId,
            price: streamData.paymentAmount,
            currency: streamData.paymentCurrencyCode || "$",
            updatePostPurchase: () => {
              dispatch(unlockStreamAction(streamData.streamId));
              updateLockedStream?.(streamData.streamId);
            },
            isStream: true,
          },
          "bottom"
        )
        : open_dialog("buyPost", {
          creatorId: streamData.userDetails.walletUserId,
          streamId: streamData.streamId,
          price: streamData.paymentAmount,
          currency: streamData.paymentCurrencyCode || "$",
          updatePostPurchase: () => {
            dispatch(unlockStreamAction(streamData.streamId));
            updateLockedStream?.(streamData.streamId);
          },
          isStream: true,
        });
    };

  return (
    <>
    <div className="streamLockedOverlay d-flex justify-content-center align-items-center flex-column" {...returnConfig()}>
      <img
        src={CLOSE_ICON_WHITE}
        onClick={handleStopppedStreamClose}
        height="20px"
        className="dv_stream_close"
        alt="close icon"
      />
      <div className="d-flex justify-content-center align-items-center">
      {!mobileView && (
          <div className="cursor-pointer mr-4" onClick={swipePrev}>
            <img
              src={GO_LIVE_SCREEN.streamNavigateArrow}
              width={29}
              height={29}
            />
          </div>
        )}
      <img src={GO_LIVE_SCREEN.streamLockIcon} onClick={openExclusiveLiveStream} className="streamLockImg cursor-pointer"  alt="Stream Lock Icon" />
        {!mobileView && (
          <div className="cursor-pointer ml-4" onClick={swipeNext}>
            <img
              src={GO_LIVE_SCREEN.streamNavigateArrow}
              width={29}
              height={29}
              style={{ transform: 'rotate(180deg)' }}
            />
          </div>
        )}
      </div>
      <div className="streamLockedPriceTag d-flex mt-3">
          <img src={GO_LIVE_SCREEN.dollarCoin} className="mr-2" width={24} height={24} alt="dollar coin" />
          {symbolReturn(streamData.paymentCurrencyCode)}{streamData.paymentAmount}
      </div>
    </div>
    <style jsx="true">
    {`
    :global(.slick-slider) {
      filter: blur(6px);
    }
    .streamLockedOverlay {
      position: absolute;
      width: 100vw;
      height: 100vh;
      top: 0;
      left: 0;
      background-color: ${mobileView ? '#00000070' : 'transparent'};
      z-index: 1;
    }
    .streamLockImg {
      width: 200px;
    }
    .streamLockedPriceTag {
      background: white;
      margin-top: 1rem;
      padding: 10px 20px;
      border-radius: 25px;
      font-family: 'Roboto';
    }
    .dv_stream_close {
      position: absolute;
      background: #00000070;
      border-radius: 50%;
      width: 33px;
      height: 33px;
      padding: 8px;
      cursor: pointer;
      left: 15px;
      top: 15px;
    }
    
    `}
    </style>
    </>
  )
}

export default streamLockedOverlay;
