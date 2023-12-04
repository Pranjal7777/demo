import React, { useEffect } from "react";
import Router from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { GO_LIVE_SCREEN, DOLLAR_IMG_ICON, IMAGE_LOCK_ICON } from "../../lib/config";
import { authenticateUserForPayment, close_dialog, close_drawer, open_dialog, open_drawer, startLoader, stopLoader } from "../../lib/global";
import AvatarImage from "../../components/image/AvatarImage";
import { removeStreamAction, unlockStreamAction } from "../../redux/actions/liveStream/liveStream";
import { deleteRecordedStreamAPI, deleteScheduleStreamAPI } from "../../services/liveStream";
import { s3ImageLinkGen } from "../../lib/UploadAWS/uploadAWS";
import Icon from "../../components/image/icon";
import useLang from "../../hooks/language";
import { isAgency } from "../../lib/config/creds";
import { useUserWalletBalance } from "../../hooks/useWalletData";
import { CoinPrice } from "../../components/ui/CoinPrice";
import { getCookie, setCookie } from "../../lib/session";
import { open_progress } from "../../lib/global/loader";
import { authenticate } from "../../lib/global/routeAuth";

const liveStreamCards = (props) => {
  const dispatch = useDispatch();
  const [lang] = useLang();
  const [userWalletBalance] = useUserWalletBalance()
  // const IMAGE_LINK = useSelector((state) => state?.cloudinaryCreds?.IMAGE_LINK);
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
  const { streamData, mobileView, isProfile = false, currentTimeStamp = 1635578754, isSelf = false, handleRemoveThisStream, handleUnlockThisStream, isUpcoming = false, isRecorded = false, setWarnStateIssue, callStreamFunction } = props;
  const unlocked = streamData.isPaid ? streamData.alreadyPaid : true;
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);
  const isomterikStateConnected = useSelector(state => state.liveStream.mqttState.connected);

  const openExclusiveLiveStream = () => {
    const isScheduledStream = Boolean(streamData.eventId && !streamData.streamId);
    const propsToPass = {
      creatorId: streamData.userDetails.walletUserId,
      streamId: streamData.streamId || streamData.eventId,
      isScheduledStream,
      price: streamData.paymentAmount,
      currency: streamData.paymentCurrencyCode || "$",
      updatePostPurchase: () => {
        if (isScheduledStream) {
          handleUnlockThisStream?.(streamData.eventId);
          dispatch(unlockStreamAction(streamData.eventId, true));
        }
        else dispatch(unlockStreamAction(streamData.streamId));
      },
      isStream: true,
      isApplyPromo: true,
      applyOn: "STREAM",
      purchaseUsingCoins: true,
      title: "Unlock Stream",
      description: "Unlock This Stream for",
      button: "Unlock"
    }
    mobileView
      ? open_drawer("buyPost", propsToPass, "bottom")
      : open_dialog("buyPost", propsToPass);
  };

  const handlePurchaseSuccess = () => {
    mobileView ? open_drawer("coinsAddedSuccess", {}, "bottom") : open_dialog("coinsAddedSuccess", {})
  }

  const handleStreamClick = (force = false, event) => {
    event && event.stopPropagation()
    authenticate(Router.asPath).then(() => {
      if (isAgency()) return;
      if (isRecorded) open_drawer('RECORDED_STREAM_PLAY', { streamData }, 'left');
      if ((streamData.eventId && !streamData.streamId) || isProfile || isRecorded) return;
      if (unlocked && force) {
        setWarnStateIssue(false)
        Router.push(`/stream/${streamData.streamId}`);
        return
      }
      if (unlocked && !isomterikStateConnected) return setWarnStateIssue(true)
      if (unlocked && isomterikStateConnected && !force) {
        Router.push(`/stream/${streamData.streamId}`);
      }
      else {
        openExclusiveLiveStream()
      }
    })
  }

  useEffect(() => {
    if (streamData.isScheduledStream && callStreamFunction) return handleJoinScheduleStream(true)
    if (callStreamFunction) return handleStreamClick(true)
  }, [callStreamFunction])

  const differenceCalc = (bigTimeStamp, smallTimeStamp) => {
    const differenceSeconds = bigTimeStamp - smallTimeStamp;
    const daydiff = ~~((differenceSeconds / 3600) / 24);
    const hrsdiff = ~~((differenceSeconds % 86400) / 3600);
    const minutesDiff = ~~((differenceSeconds % 3600) / 60);
    let str = '';
    if (daydiff > 0) str += `${daydiff}day `;
    if (hrsdiff > 0) str += `${hrsdiff}hr `;
    if (minutesDiff > 0) str += `${minutesDiff}min`;
    if (!str) str += 'Few Seconds'
    return str;
    // return `${daydiff < 10 ? '0' + daydiff : daydiff}: ${hrsdiff < 10 ? '0' + hrsdiff : hrsdiff}: ${minutesDiff < 10 ? '0' + minutesDiff : minutesDiff}`;
  }

  const handleGoLiveSchedule = () => {
    open_drawer('START_SCHEDULE_BROADCAST', { streamData }, 'bottom');
  };

  const handleDeleteSchedule = async () => {
    try {
      startLoader();
      await deleteScheduleStreamAPI(streamData.eventId || streamData.streamId, isAgency() ? selectedCreatorId : "");
      handleRemoveThisStream?.(streamData.eventId || streamData.streamId);
      dispatch(removeStreamAction(streamData.eventId || streamData.streamId, true));
    } catch (err) {
      console.error(err);
    } finally {
      if (mobileView) {
        close_drawer('STREAM_INFO_POPUP');
        close_drawer('confirmDrawer');
      } else {
        close_dialog('confirmDialog');
        close_dialog('STREAM_INFO_POPUP');
      }
      stopLoader();
    }
  };

  const handleDeleteRecorded = async () => {
    try {
      startLoader();
      await deleteRecordedStreamAPI(streamData.streamId);
      handleRemoveThisStream?.(streamData.streamId, true);
    } catch (err) {
      console.error(err);
    } finally {
      if (mobileView) {
        close_drawer('STREAM_INFO_POPUP');
        close_drawer('confirmDrawer');
      } else {
        close_dialog('confirmDialog');
        close_dialog('STREAM_INFO_POPUP');
      }
      stopLoader();
    }
  }

  const handleConfirmDeleteSchedule = () => {
    const propsToPass = {
      title: `${lang.delete} ${lang.scheduledStream}`,
      // btn_class: "dangerBgBtn",
      cancelT: lang.cancle,
      submitT: lang.delete,
      yes: handleDeleteSchedule,
      subtitle: streamData.isPaid ? lang.paidStreamDeleteAlert : lang.freeStreamDeleteAlert,
    };
    mobileView ? open_drawer("confirmDrawer", propsToPass, "bottom") : open_dialog("confirmDialog", propsToPass);
  };

  const handleSchedulePurchase = () => {
    authenticateUserForPayment(mobileView, lang.paymentDisabledForCreatorText).then(() => {
      if (userWalletBalance < streamData.paymentAmount) {
        return mobileView ? open_drawer("addCoins", { handlePurchaseSuccess: handlePurchaseSuccess }, "bottom") : open_dialog("addCoins", { handlePurchaseSuccess: handlePurchaseSuccess })
      }
      if (streamData.eventId && !streamData.streamId && !unlocked) openExclusiveLiveStream();
    })
  };

  const handleShareRecordedStream = (e) => {
    e.stopPropagation()
    mobileView
      ? open_drawer('SHARE_ITEMS', {
        shareType: 'stream',
        streamId: streamData.eventId || streamData.streamId,
      }, "bottom")
      : open_dialog('SHARE_ITEMS', {
        shareType: 'stream',
        streamId: streamData.eventId || streamData.streamId,
      });
    // Router.push(`/live/detail/${streamData.streamId}`)
  }


  const handleShareStream = (e) => {
    e.stopPropagation()
    mobileView
      ? open_drawer('SHARE_ITEMS', {
        shareType: 'stream',
        streamId: streamData.streamId || streamData.eventId,
        scheduledStream: true
      }, "bottom")
      : open_dialog('SHARE_ITEMS', {
        shareType: 'stream',
        streamId: streamData.streamId || streamData.eventId,
        scheduledStream: true
      });
  };

  const handleJoinScheduleStream = (force = false) => {
    if (!unlocked) handleSchedulePurchase();
    else {
      if (force) {
        setWarnStateIssue(false)
        Router.push(`/stream/${streamData.eventId || streamData.streamId}?query=1`);
        return
      }
      if (!force && isomterikStateConnected) {
        if (streamData.eventId) {
          return Router.push(`/stream/${streamData.eventId}?query=1&eventId=true`);
        }
        else if (streamData.streamId) {
          return Router.push(`/stream/${streamData.streamId}?query=1&streamId=true`);
        }
      }
      else setWarnStateIssue(true)
    }
  };

  const handleStreamInfo = (e) => {
    e?.stopPropagation();
    mobileView ? open_drawer('STREAM_INFO_POPUP', { streamData, handleConfirmDeleteSchedule, currentTimeStamp }, 'left') : open_dialog('STREAM_INFO_POPUP', { streamData, handleConfirmDeleteSchedule, currentTimeStamp });
  };

  const handleRecordedStreamDelete = (e) => {
    e?.stopPropagation?.();
    const propsToPass = {
      title: `${lang.delete} ${lang.recordedStream}`,
      cancelT: lang.cancle,
      submitT: lang.delete,
      yes: handleDeleteRecorded,
      subtitle: "",
    };
    mobileView ? open_drawer("confirmDrawer", propsToPass, "bottom") : open_dialog("confirmDialog", propsToPass);
  }

  const profileClickHandler = () => {
    if (getCookie("uid") == streamData.userDetails.walletUserId) {
      close_dialog();
      open_progress();
      Router.push(`/profile`);
    } else {
      close_dialog();
      open_progress();
      setCookie("otherProfile", `${streamData.userDetails.username || streamData.userDetails.userName}$$${streamData.userDetails.walletUserId}`)
      Router.push(`/${streamData.userDetails.username || streamData.userDetails.userName}`);
    }
  };

  return (
    <>
      <div
        onClick={(e) => handleStreamClick(false, e)}
        className="userStreamCardClass pt-2 d-flex flex-column justify-content-between position-relative overflow-hidden position-relative"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 1), rgba(30, 30, 30, 0), rgba(0, 0, 0, 1)), url('${s3ImageLinkGen(S3_IMG_LINK, streamData.streamImage, null, mobileView ? null : '16vw', mobileView ? 230 : 307)}')`,
        }}
      >
        {!unlocked && !isSelf && <div className="setMid__lyt" onClick={handleSchedulePurchase}>
          <div className="d-flex justify-content-center mb-2">
            <Icon
              class="locked__img d-flex justify-content-center align-items-center"
              icon={`${IMAGE_LOCK_ICON}#lock_icon`}
              color="#fff"
              size={30}
              unit="px"
              viewBox="0 0 68.152 97.783"
            />
          </div>
          <div className="curreny__lyt">
            <CoinPrice price={streamData.paymentAmount} size={14} iconSize='14' showCoinText={false} />
          </div>
        </div>}

        <div className={`${isProfile ? '' : ''} col-12 d-flex align-items-center position-absolute`} style={{ bottom: "1rem" }}>
          {isProfile && streamData.eventId && streamData.isScheduledStream && streamData.scheduleStartTime <= currentTimeStamp && currentTimeStamp <= streamData.scheduleStartTime + streamData.scheduleDuration && isSelf && <div onClick={handleGoLiveSchedule} className="goLiveDiv dv_base_bg_color ownProfileGoLive cursorPtr" style={{ color: "white" }}>

            <p className="mb-0 mt-0 fntSz14">{lang.goLive}</p>
          </div>}
          {
            isProfile
              ? (
                <>
                  {!isRecorded && streamData.scheduleStartTime <= currentTimeStamp && !isSelf && (
                    <button onClick={() => handleJoinScheduleStream(false)} className="btn go_live_schedule_btn w-100 txt-black text-white d-flex justify-content-between align-items-center mainGoLiveBtnCss" style={{ bottom: "0rem" }}>
                      {lang.joinLive}
                    </button>)}
                </>
              )
              : (
                <>
                </>
              )
          }


        </div>

        {/* Recorded Stream Delete Option */}
        {
          isRecorded && isSelf && (<div className="stickRightRecorded">

            <span onClick={handleRecordedStreamDelete} className="ml-auto d-inline-flex align-items-center justify-content-center rounded-circle block_circle_ico cursorPtr"><img src={GO_LIVE_SCREEN.deleteIco} width={12} /></span>
            {<span onClick={handleShareRecordedStream} className="cursorPtr d-inline-flex align-items-center justify-content-center rounded-circle block_circle_ico"><img src={GO_LIVE_SCREEN.shareIco} width={20} /> </span>}
          </div>
          )
        }
        {!isProfile && <>
          {
            isUpcoming && streamData.eventId && !streamData.streamId && (
              <>
                {streamData.scheduleStartTime <= currentTimeStamp && isSelf && (
                  <button onClick={handleGoLiveSchedule} style={{ height: "40px", zIndex: "77" }} disabled={isAgency()} className="btn col go_live_schedule_btn w-100 txt-black text-white d-flex justify-content-between align-items-center mainGoLiveBtnCss">
                    {lang.goLive}
                  </button>
                )}
              </>
            )
          }
          <div className={`d-flex ${!isRecorded && streamData.scheduleStartTime <= currentTimeStamp && !isSelf ? "align-items-center gap w-100" : "justify-content-end"} mainGoLiveBtnCss`}>
            {!isRecorded && isUpcoming && streamData.scheduleStartTime <= currentTimeStamp && !isSelf && (
              <button onClick={() => handleJoinScheduleStream(false)} className="btn go_live_schedule_btn w-100 txt-black text-white d-flex justify-content-center align-items-center" style={{ padding: "7px 10px" }}>
                {lang.joinLive}
              </button>)}

          </div>
          {/* </div> */}
        </>
        }

        {!isProfile && isUpcoming && streamData.eventId && !streamData.streamId && <>

          {streamData.scheduleStartTime > currentTimeStamp && (
            <div className="col px-0 upcomingTimeBtn">
              <div className="form-row">
                <div className="col-auto d-inline-flex align-items-center handleClockIcon">
                  <Icon
                    icon={`${GO_LIVE_SCREEN.clockIcon}#noun_clock_4334352`}
                    size={16}
                    alt="follow icon"
                    viewBox="0 0 15.639 15.639"
                    color="var(--white)" />
                </div>
                <div className="col d-inline-flex align-items-center">
                  <span className="txt-heavy fntSz12 text-white">{differenceCalc(streamData.scheduleStartTime, currentTimeStamp)}</span>
                </div>
              </div>
            </div>
          )}

        </>}

        {!isProfile && isUpcoming && streamData.eventId && !streamData.streamId && <>

          <img className="cursorPtr col-auto p-0 ml-auto upcomingInfoIcon" onClick={handleStreamInfo} src={GO_LIVE_SCREEN.infoIco} width={28} height={28} alt="info option" />

        </>}

        <div className="col-12 p-0 d-flex mt-2" style={{ position: "absolute", top: "0", left: "10px" }}>
          <div className="col-auto px-0 d-inline-flex align-items-center pointer" onClick={profileClickHandler}>
            {
              streamData?.userDetails?.userProfile ? (
                <img
                  src={s3ImageLinkGen(S3_IMG_LINK, streamData.userDetails?.userProfile, null, 30, 30)}
                  className="userProfileImgClass"
                />
              ) : (
                <AvatarImage isCustom={true} className="userProfileImgClass" userName={streamData.userDetails?.userName} />
              )
            }
          </div>
          <div className="col pr-0 px-2 ">
            <p className="m-0 fntSz14 text-white txt-roman pointer" onClick={profileClickHandler}>{streamData.userDetails?.userName}</p>
            <p className="mb-0 txt-roman text-ellip-one fntSz12 mt-n1 text-white">
              {streamData.streamTitle}
            </p>
          </div>
        </div>
        <div className="py-2 px-2 userNameCss position-absolute" style={mobileView ? { right: 0, top: 0 } : { right: 0, top: "40px" }} >
          {
            isProfile && !isRecorded && (
              <>
                <div className={`d-flex  align-items-center  mt-1 stickToRight ${!isSelf ? "justify-content-end" : "gap15"} `}>
                  {isSelf && <span onClick={handleConfirmDeleteSchedule} className="d-inline-flex align-items-center justify-content-center rounded-circle block_circle_ico cursorPtr"><img src={GO_LIVE_SCREEN.deleteIco} width={12} /></span>}
                  {isSelf && <span onClick={handleShareStream} className="cursorPtr d-inline-flex align-items-center justify-content-center rounded-circle block_circle_ico"><img src={GO_LIVE_SCREEN.shareIco} width={20} /> </span>}
                  {streamData.scheduleStartTime > currentTimeStamp && <img className="cursorPtr d-inline-flex align-items-center justify-content-center rounded-circle position-relative zIndex" onClick={handleStreamInfo} src={GO_LIVE_SCREEN.infoIco} width={40} height={40} alt="info option" />}
                </div>
              </>
            )}
        </div>
        {streamData.eventId && !streamData.streamId && streamData.scheduleStartTime > currentTimeStamp && isProfile && <div className="col-12 px-0 adjustGoLiveBtn">
          <div className="d-flex justify-content-center text-white" style={{ gap: "10px", border: "1px solid", padding: "7px 10px", borderRadius: "27px" }}>
            <div className="">
              <Icon
                icon={`${GO_LIVE_SCREEN.clockIcon}#noun_clock_4334352`}
                size={16}
                alt="go live icon"
                viewBox="0 0 15.639 15.639"
                color="var(--white)" />
            </div>
            <div className="">
              <span className="txt-heavy fntSz12">{differenceCalc(streamData.scheduleStartTime, currentTimeStamp)}</span>
            </div>
          </div>
        </div>}


      </div>
      <style jsx>
        {`
       .stickRightRecorded{
        margin: auto;
        width: 95%;
        height: 217px;
        display: flex;
        flex-direction: column;
        align-items: end;
        justify-content: start;
        gap: 10px;
       }

      .stickToRight{
        height: 150px;
        flex-direction: column;
        align-items: end !important;
        margin-bottom: -27px;
      }  
      .goLiveDiv{
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 27px;
        padding: 10px ;
      }  

      .insideCard {
        width: 26vw;
        border-radius: 3px;
      }
      .userStreamCardClass {
        min-height: ${mobileView ? '230px' : '307px'};
        width: ${mobileView ? 'unset' : '16vw'};
        box-shadow: inset 0px 0px 20px 10px #00000038;
        background-size: cover;
        background-repeat: no-repeat;
        border-radius: 12px;
        background-position: center top;
        cursor: ${streamData.eventId && !streamData.streamId ? 'unset' : 'pointer'};
      }

      :global(.userProfileImgClass) {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 1px solid #ffffff;
      }

      .upcomingTimeBtn{
        position: absolute;
        left: 50%;
        transform: translate(-50%, 0px);
        bottom: 1rem;
        border: 1px solid #fff;
        padding: 10px 15px;
        width: 9rem;
        display: flex;
        justify-content: center;
        border-radius: 20px;
      }
      :global(.curreny__lyt .coinprice){
        color:#000
      }

      .productCartImgCss {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 1px solid #ffffff;
      }
      :global(.handleClockIcon > div){
        line-height:1;
      }
      .gap{
        gap:5px;
      }
      .gap15{
        gap:15px;
      }

      .adjustGoLiveBtn{
        width: 8rem;
        position: absolute;
        bottom: 1rem;
        left: 50%;
        transform: translate(-50%, 0);
        cursor:pointer;
      }

      .upcomingInfoIcon{
        position: absolute;
        right: 10px;
        top: 10px;
        z-index:1;
      }

      .userNameCss {
        color: #ffffff;
        font-size: 14px;
      }

      .cardInfoCss {
        color: var(--l_base);
        font-size: 11px;
        font-weight: 600;
      }
      .zIndex{
        z-index:1
      }

      .cardInfoPrice {
        color: #707070;
        font-size: 11px;
        font-weight: 600;
        text-decoration: line-through;
      }

      .cardSlider {
        overflow-x: auto;
      }
      .cardSlider::-webkit-scrollbar {
        display: none !important;
      }

      .userNameCss__sec{
        margin-top: -5px !important;
      }

      .userNameCss__count {
        color: #ffffff;
        font-size: 10px;
        font-family: 'Roboto',sans-serif !important;
      }

      .text-ellip-two{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: initial;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .text-ellip-one{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: initial;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }

      .setMid__lyt{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 9;
        cursor: ${streamData.eventId && !streamData.streamId ? 'pointer' : 'unset'};
      }

      :global(.locked__img){
        background: rgb(255 255 255 / 30%);
        backdrop-filter: blur(4px);
        border-radius: 50%;
        padding: 10px;
        width: 55px;
        height: 55px;
      }
      .ownProfileGoLive{
        width: 8rem;
        margin: auto;
        display: flex;
        justify-content: center;
      }

      .mainGoLiveBtnCss{
        height: 38px;
        position: absolute;
        bottom: 1rem;
        width: 8rem !important;
        left: 50%;
        transform: translate(-50%, 0px);
        display: flex !important;
        justify-content: center !important;
      }

      .curreny__lyt{
        background: #ffffff;
        width: 75px;
        text-align: center;
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 24px;
      }

      .curr__amt{
        font-family: 'Roboto',sans-serif !important;
        color: #000000;
        font-size: 14px;
      }

      .btm__blur{
        background-image: linear-gradient(rgb(0 0 0 / 0%) 0%, rgb(0 0 0 / 30%) 40%, rgb(0 0 0 / 60%) 100%);
      }
      .go_live_schedule_btn {
        background-color: var(--l_base);
        padding: 11px;
        border-radius: 30px;
      }
      .block_circle_ico {
        width: 40px;
        height: 40px;
        background-color: #4b4848a1;
      }

      @media (min-width: 700px) and (max-width: 991.98px){
        .userStreamCardClass {
          width: 100%;
        }
      }
      
    `}
      </style>
    </>
  )
}

export default liveStreamCards;
