import React, { useEffect } from 'react';
import moment from 'moment';
import Router from 'next/router';
import Head from 'next/head';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from "react-jss";
import { authenticateUserForPayment, formatDuration, open_dialog, open_drawer, Toast } from '../../../lib/global';
import isMobile from "../../../hooks/isMobile";
import Button from '../../../components/button/button';
import Icon from '../../../components/image/icon';
import { CHAT_PLAY, CLOSE_ICON_WHITE, GO_LIVE_SCREEN } from '../../../lib/config';
import { s3ImageLinkGen } from '../../../lib/UploadAWS/uploadAWS';
import { getCookie } from '../../../lib/session';
import { addCalendarEvent } from '../../../lib/calendarEvent';
import { unlockStreamAction } from '../../../redux/actions/liveStream/liveStream';
import AvatarImage from '../../../components/image/AvatarImage';
import useLang from "../../../hooks/language"
import Img from '../../../components/ui/Img/Img';
import { isAgency } from '../../../lib/config/creds';
import { CoinPrice } from '../../../components/ui/CoinPrice';
import ReactCountryFlag from 'react-country-flag';
import { close_dialog, close_drawer } from '../../../lib/global/loader';
import { commentParser } from '../../../lib/helper/userRedirection';

const streamInfoDrawer = (props) => {
    const { streamData, onClose, isPage, enablePageStyle, handleConfirmDeleteSchedule } = props;
    const auth = getCookie('auth');
    const [mobileView] = isMobile();
    const dispatch = useDispatch();
    const [isPaid, setIsPaid] = React.useState(streamData.isPaid && !streamData.alreadyPaid);
    const selfUserName = useSelector((state) => state?.profileData?.username);
    const isMyStream = selfUserName === streamData.userDetails.userName;
    const isScheduledStream = Boolean(streamData.eventId && !streamData.streamId);
    const [currentTime, setCurrentTime] = React.useState(moment().unix());
    const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
    const [lang] = useLang()
    const theme = useTheme();
    const [parsedDescription, setParsedDescription] = React.useState("");

    const openExclusiveLiveStream = () => {
        if (!auth) {
            window.open('/login', '_self');
            return;
        };
        const propsToPass = {
          creatorId: streamData.userDetails.walletUserId,
          streamId: streamData.streamId || streamData.eventId,
          isScheduledStream,
          price: streamData.paymentAmount,
          currency: streamData.paymentCurrencyCode || "$",
          updatePostPurchase: () => {
            if (isScheduledStream) {
            //   handleUnlockThisStream?.(streamData.eventId);
                setIsPaid(false);
                dispatch(unlockStreamAction(streamData.eventId, true));
            }
            else dispatch(unlockStreamAction(streamData.streamId));
          },
          isStream: true,
        }
          mobileView
              ? open_drawer("buyPost", propsToPass, "bottom")
              : open_dialog("buyPost", propsToPass);
    };

    const handleJoinStream = () => {
        if (!auth) window.open('/login', '_self');
        if (isAgency()) return;
        if (isPaid) {
            authenticateUserForPayment(mobileView, lang.paymentDisabledForCreatorText).then(() => {
                openExclusiveLiveStream()
            });
            return;
        }
        if (streamData.scheduleStartTime <= currentTime) {
            onClose();
            setTimeout(() => {
                const URLToPush = `/stream/${streamData.streamId || streamData.eventId}${isScheduledStream ? '?query=1' : ''}`;
                Router.push(URLToPush);
            }, 500);
        }
    };
    const startTimeFormatter = (bigTimeStamp, smallTimeStamp) => {
        const differenceSeconds = bigTimeStamp - smallTimeStamp >= 0 ? bigTimeStamp - smallTimeStamp : 0 ;
        const daydiff = ~~((differenceSeconds/3600)/24);
        const hrsdiff = ~~((differenceSeconds%86400)/3600);
        const minutesDiff = ~~((differenceSeconds%3600)/60);
        const secondsDiff = ~~(differenceSeconds%60);
        // if (daydiff > 0) return `${daydiff} day${daydiff > 1 ? 's': ''}`;
        return daydiff > 0 ? `in ${daydiff} day${daydiff > 1 ? 's': ''}` : (hrsdiff > 0 ? `in ${hrsdiff} hr${hrsdiff > 1 ? 's': ''}` : secondsDiff === 0 ? 'Now' : (`in ${minutesDiff} min${minutesDiff > 1 ? 's' : ''}`));
    };

    const handleShareStream = () => {
        mobileView
          ? open_drawer('SHARE_ITEMS', {
            shareType: 'stream',
            streamId: streamData.streamId || streamData.eventId,
            scheduledStream: isScheduledStream
          }, "bottom")
          : open_dialog('SHARE_ITEMS', {
            shareType: 'stream',
            streamId: streamData.streamId || streamData.eventId,
            scheduledStream: isScheduledStream
          });
      };

    const handleGoLiveSchedule = () => {
        if (isAgency()) return;
        open_drawer('START_SCHEDULE_BROADCAST', { streamData }, 'bottom');
      };

    React.useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(moment().unix());
        }, 30000);
        showMoreDescText(streamData.streamDescription, true);
        return () => clearInterval(intervalId);
    }, []);

    const handleJoinButtonText = (isScheduled = false) => {
        if (isScheduled) {
            if (isPaid) return <CoinPrice price={streamData.paymentAmount} prefixText={"Unlock for"} showCoinText={true} size={14} />;
            return `Starts ${startTimeFormatter(streamData.scheduleStartTime, currentTime)}`;
        } else {
            if (!auth) return 'Login to view';
            if (streamData.streamId && !streamData.isStreamActive) return 'Stream Ended';
            if (isPaid) return `View stream for $${streamData.paymentAmount}`;
            return 'View Stream';   
        }
    };

    const handleAddToCalendar = () => {
        addCalendarEvent(new Date(streamData.scheduleStartTime * 1000).toISOString(), streamData.scheduleDuration, window.location.href, streamData.streamTitle);
    };

    const handleUserOpen = () => {
        if (!enablePageStyle) onClose();
        Router.push(`/${streamData.userDetails.userName}`);
    };
    const handleRecorded = ()=>{
        open_drawer('RECORDED_STREAM_PLAY', { streamData }, 'left');
    }
    const showMoreDescText = (text, flag) => {
        const count = mobileView ? 80 : 100;
        if (!text || text.length <= count || !flag) {
            setParsedDescription(text);
        } else {
            let nText = [...text].splice(0, count - 10).join("");
            setParsedDescription(nText);
        }
    };

    return (
        <>
        <Head>
            <script src="https://apis.google.com/js/api.js" type="text/javascript" />
        </Head>
            {mobileView ? <div className="col-12 p-0 position-relative px-3" style={{ height: "calc(var(--vhCustom, 1vh) * 100)" }}>
                <Icon
                    icon={`${CLOSE_ICON_WHITE}#close-white`}
                    viewBox="0 0 24 24"
                    width="15"
                    height="15"
                    color="var(--l_app_text)"
                    style={{ position: "absolute", top: "15px", right: "15px", cursor: "pointer" }}
                    onClick={() => {
                        Router.query?.q === "true" ? Router.push("/") : !mobileView ? close_dialog("STREAM_INFO_POPUP") : close_drawer("STREAM_INFO_POPUP")
                    }}
                />
                <h3 className='text-app pt-3 pb-2 text-center fntSz22'>{lang.streamDesc}</h3>
                <div style={{ height: "calc( 100% - 58px - 70px ", overflowY: "auto" }}>
                    <label className="txt-book fntSz16 dv__lightGrey_color mb-1">{lang.streamTitle}</label>
                    <div className="streamTitle_field txt-heavy fntSz16  mb-2 dv_appTxtClr_web fntWeight600">
                        {streamData.streamTitle}
                    </div>
                    <label className="txt-book fntSz16 dv__lightGrey_color mb-1">{lang.description}</label>
                    <div className="streamTitle_field  txt-roman fntSz15  mb-2 fntWeight600 dv_appTxtClr_web">
                        <p className="mb-0 overflow-auto text-break" style={{ maxHeight: "60px" }} >
                            {streamData.streamDescription && commentParser(parsedDescription)}
                            {streamData.streamDescription &&
                                streamData.streamDescription.length > 80 &&
                                (parsedDescription.length > 80 ? (
                                    <a onClick={() => showMoreDescText(streamData.streamDescription, true)}
                                        className="cursorPtr"
                                    >{lang.showLess}
                                    </a>
                                ) : (
                                    <a onClick={() => showMoreDescText(streamData.streamDescription, false)}
                                        className="cursorPtr"
                                    >  {lang.showMore}
                                    </a>
                                ))}
                        </p>
                    </div>
                    {streamData.scheduleStartTime ? (
                        <>
                            <label className="txt-book fntSz16 dv__lightGrey_color mb-1">{lang.streamingOn}</label>
                            <div className=" txt-roman fntSz15  fntWeight600 dv_appTxtClr_web mb-2">
                                {moment.utc(moment.unix(streamData.scheduleStartTime)).local().format('ddd, MMM Do h:mm a')}
                            </div>
                        </>) : <></>}
                    <label className="txt-book fntSz16 dv__lightGrey_color mb-1">{lang.duration}</label>
                    <div className="streamTitle_field txt-heavy fntSz16  mb-3 dv_appTxtClr_web fntWeight600">
                        {formatDuration(streamData.scheduleDuration)}
                    </div>

                    <div className="position-relative mb-2" style={{ width: "75%", margin: "auto", height: "345px" }}>
                        <div className="position-absolute d-flex flex-column" style={{ top: "15px", right: "15px", cursor: "pointer", gap: "10px", zIndex: 1 }}>
                            <img onClick={handleAddToCalendar} width={38} src={GO_LIVE_SCREEN.addToCalendar} alt='Add Calendar' />
                            <img onClick={handleShareStream} src={GO_LIVE_SCREEN.share_stream_icon} height={38} alt="Share Option" />
                            {isMyStream && <img onClick={handleConfirmDeleteSchedule} src={GO_LIVE_SCREEN.delete_stream_icon} height={38} alt="deelte Option" />}
                        </div>
                        <div className='shadowTopBottom'></div>
                        <div className="position-absolute streamTitle_field  align-items-center txt-roman fntSz15 pb-2 mb-1 d-flex" style={{ bottom: "0", left: "15px" }}>
                    {
                        streamData.userDetails?.userProfile
                            ? (<img
                                src={s3ImageLinkGen(S3_IMG_LINK, streamData.userDetails.userProfile, null, 36, 36)}
                                width="36"
                                height="36"
                                className="userProfileImgClass cursorPtr"
                                onClick={handleUserOpen}
                            />)
                            : (
                                <AvatarImage
                                    isCustom={true}
                                    className="userProfileImgClass cursorPtr"
                                    userName={streamData.userDetails.firstName}
                                    onClick={handleUserOpen}
                                />
                            )
                    }
                    <div className="col-auto cursorPtr" onClick={handleUserOpen}>
                                <div className="txt-roman fntSz15 text-white">{streamData.userDetails.firstName} {streamData.userDetails.lastName}</div>
                                <div className="txt-book fntSz12 text-white mt-n1 ">@{streamData.userDetails.userName}</div>
                    </div>
                        </div>
                    </div>
                </div>

                <div className={enablePageStyle ? 'streamPagebuttonFix' : 'streamPagebuttonSticky pb-1 mb-2'}>
                    {streamData.streamId && <Button disabled={auth && !streamData.isStreamActive} onClick={handleJoinStream} fclassname={enablePageStyle ? "txt-black my-2 cursorPtr" : "txt-black cursorPtr"} fixedBtnClass={"active"}>{handleJoinButtonText(false)}</Button>}
                    {isScheduledStream && !isMyStream && <Button onClick={handleJoinStream} fixedBtnClass={"active"} fclassname={enablePageStyle ? "txt-black mb-3 cursorPtr" : "txt-black cursorPtr"} >{handleJoinButtonText(true)}</Button>}
                    {isScheduledStream && isMyStream && <Button disabled={streamData.scheduleStartTime >= currentTime} onClick={handleGoLiveSchedule} fclassname={enablePageStyle ? "txt-black mb-3 cursorPtr" : "txt-black cursorPtr"} fixedBtnClass={"active"}>Go Live {startTimeFormatter(streamData.scheduleStartTime, currentTime)}</Button>}
                </div>
            </div> :
                <div className="col-12 p-0 position-relative" style={{ minHeight: "82vh" }}>
                    <Icon
                        icon={`${CLOSE_ICON_WHITE}#close-white`}
                        viewBox="0 0 24 24"
                        width="15"
                        height="15"
                        color="var(--l_app_text)"
                        style={{ position: "absolute", top: "15px", right: "15px", cursor: "pointer" }}
                        onClick={() => {
                            Router.query.q === "true" ? Router.push("/") : !mobileView ? close_dialog("STREAM_INFO_POPUP") : close_drawer("STREAM_INFO_POPUP");
                        }}
                    />
                    <h3 className='text-app pt-4 pb-3 text-center fntSz24'>{lang.streamDesc}</h3>
                    <div style={{ height: "calc(82vh - 132px)", overflow: "auto" }}>
                        <div className='d-flex justify-content-center' style={{ gap: "10px" }} >
                            <div className=" position-relative" style={{ width: "45%", height: "245px" }}>
                                <img className='w-100' style={{ borderRadius: "17px", height: "100%", objectFit: 'cover' }} src={s3ImageLinkGen(S3_IMG_LINK, streamData.streamImage, null, false, '52vh')} alt='stream image' />
                                <div className='shadowTopBottom'></div>
                                <div className="position-absolute d-flex flex-column" style={{ top: "15px", right: "15px", cursor: "pointer", gap: "8px" }}>
                                    <img onClick={handleAddToCalendar} width={30} src={GO_LIVE_SCREEN.addToCalendar} alt='Add Calendar' />
                                    <img onClick={handleShareStream} src={GO_LIVE_SCREEN.share_stream_icon} height={30} alt="Share Option" />
                                    {isMyStream && <img onClick={handleConfirmDeleteSchedule} src={GO_LIVE_SCREEN.delete_stream_icon} height={30} alt="delete Option" />}
                                </div>
                                <div className='position-absolute col-12 px-3 pb-2 specific_section_bg modal-content handleStreamProfileBackground overflow-auto w-100 justify-content-between' style={{ bottom: "0" }}>
                            <div className="streamTitle_field  align-items-center txt-roman fntSz15 pb-1 d-flex">
                                {
                                    streamData.userDetails?.userProfile
                                        ? (<img
                                            src={s3ImageLinkGen(S3_IMG_LINK, streamData.userDetails.userProfile, null, 36, 36)}
                                            width="36"
                                            height="36"
                                            className="userProfileImgClass cursorPtr"
                                            onClick={handleUserOpen}
                                        />)
                                        : (
                                            <AvatarImage
                                                isCustom={true}
                                                className="userProfileImgClass cursorPtr"
                                                userName={streamData.userDetails.firstName}
                                                onClick={handleUserOpen}
                                            />
                                        )
                                }
                                <div className="pl-2 cursorPtr" onClick={handleUserOpen}>
                                            <div className="txt-roman fntSz15 text-white">{streamData.userDetails.firstName} {streamData.userDetails.lastName}</div>
                                    <div className='d-flex flex-row '>
                                        <ReactCountryFlag
                                            countryCode={props?.countryCodeName || "us"}
                                            aria-label={props?.countryName || "United States"}
                                            title={props?.countryCodeName || "us"}
                                            svg
                                            style={{
                                                width: '20px',
                                                height: "14px"
                                            }}
                                        />
                                                <div className='pl-2 text-truncate fntSz10 text-white w-700' >{props?.countryName || "USA"}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {streamData.isRecorded && streamData.streamId && <div className='w-100 h-100 bg-dark d-flex justify-content-center align-items-center ' style={{ opacity: "65%" }}>
                                    <div onClick={handleRecorded} className="cursorPtr">
                                        <Img src={CHAT_PLAY} alt="play button" width="70px" />
                                    </div>
                                </div>}
                                {!isPage && <div className="col-12 d-flex align-items-center justify-content-center">
                                </div>}
                                {streamData.isRecorded && streamData.streamId && <span className="ml-auto txt-medium text-white fntSz10 p-2 position-absolute" style={{ backgroundColor: '#EC30CF', borderRadius: '4px', left: '15px', bottom: '15px' }}>
                                    RECORDED
                                </span>}
                                {streamData.streamId && <span className="ml-auto txt-medium text-white fntSz10 p-2 position-absolute gradient_bg " style={{ borderRadius: '4px', left: '15px', top: '15px' }}>
                                    {streamData.isStreamActive ? 'LIVE' : 'ENDED'}
                                </span>}
                            </div>
                            <div className='' style={{ width: "45%" }}>
                                <label className="txt-book fntSz16 dv__lightGrey_color mb-1">{lang.streamTitle}</label>
                                <div className="streamTitle_field txt-heavy fntSz16  mb-2 dv_appTxtClr_web fntWeight600">
                                    {streamData.streamTitle}
                                </div> {streamData.scheduleStartTime ? (
                                    <>
                                        <label className="txt-book fntSz16 dv__lightGrey_color mb-1">{lang.streamingOn}</label>
                                        <div className=" txt-roman fntSz15  fntWeight600 dv_appTxtClr_web mb-2">
                                            {moment.utc(moment.unix(streamData.scheduleStartTime)).local().format('ddd, MMM Do h:mm a')}
                                        </div>
                                    </>) : <></>}
                                {streamData.scheduleDuration ? <><label className="txt-book fntSz16 dv__lightGrey_color mb-1">{lang.duration}</label>
                                <div className="streamTitle_field txt-heavy fntSz16  mb-3 dv_appTxtClr_web fntWeight600">
                                    {formatDuration(streamData.scheduleDuration)}
                                </div>
                                </> : null}
                                    </div>
                        </div>
                        <div className='px-3 mt-2'>
                            <label className="txt-book fntSz16 dv__lightGrey_color mb-1">{lang.description}</label>
                            <div className="streamTitle_field  txt-roman fntSz15  mb-2 fntWeight600 dv_appTxtClr_web">
                                <p className="mb-0 overflow-auto text-break" style={{ maxHeight: "60px" }} >
                                    {streamData.streamDescription && commentParser(parsedDescription)}
                                    {streamData.streamDescription &&
                                        streamData.streamDescription.length > (mobileView ? 100 : 100) &&
                                        (parsedDescription.length > (mobileView ? 100 : 100) ? (
                                            <a onClick={() => showMoreDescText(streamData.streamDescription, true)}
                                                className="cursorPtr"
                                            >{lang.showLess}
                                            </a>
                                        ) : (
                                            <a onClick={() => showMoreDescText(streamData.streamDescription, false)}
                                                className="cursorPtr"
                                            >  {lang.showMore}
                                            </a>
                                        ))}
                                </p> 
                            </div>
                        </div>
                    </div>
                    <div className={enablePageStyle ? 'streamPagebuttonFix' : 'streamPagebuttonSticky pb-1'}>
                        {streamData.streamId && <Button disabled={auth && !streamData.isStreamActive} onClick={handleJoinStream} fclassname={enablePageStyle ? "txt-black my-2 cursorPtr" : "txt-black cursorPtr"} fixedBtnClass={"active"}>{handleJoinButtonText(false)}</Button>}
                        {isScheduledStream && !isMyStream && <Button onClick={handleJoinStream} fixedBtnClass={"active"} fclassname={enablePageStyle ? "txt-black mb-3 cursorPtr" : "txt-black cursorPtr"} >{handleJoinButtonText(true)}</Button>}
                        {isScheduledStream && isMyStream && <Button disabled={streamData.scheduleStartTime >= currentTime} onClick={handleGoLiveSchedule} fclassname={enablePageStyle ? "txt-black mb-3 cursorPtr" : "txt-black cursorPtr"} fixedBtnClass={"active"}>Go Live {startTimeFormatter(streamData.scheduleStartTime, currentTime)}</Button>}
                    </div>
                </div >
            }
        <style jsx="true">
        {`
        :global(.STREAM_INFO_POPUP .MuiDialog-paper) {
            min-width: 450px !important;
            max-width: 450px !important;
            min-height:82vh;
        }
        :global(.STREAM_INFO_POPUP){
            border-radius: ${mobileView && "0 !important"};
        }
        .streamCover_img {
            background: url(${s3ImageLinkGen(S3_IMG_LINK, streamData.streamImage, null, false, '52vh')});
            height: 52vh;
            background-repeat: no-repeat;
            background-size: contain;
            background-position: center;
        }
      .shadowTopBottom{
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 100%;
        border-radius: 15px;
        background: linear-gradient(rgb(0, 0, 0), rgba(30, 30, 30, 0), rgb(0, 0, 0));
      }
      .handleStreamProfileBackground{
        background:transparent !important;
      }
        .header_stream_info {
            padding-top: 20px;
            padding-bottom: 20px;
            background: linear-gradient(180deg, black, #686C7600);
        }
        .streamInfo_field {
            color: var(theme.text)
        }
        :global(.userProfileImgClass) {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 1px solid ${theme.labelbg};
        }
        .relative__center {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
        .streamPagebuttonFix {
            position: fixed;
            left: 0px;
            bottom: 0;
            width: 100%;
            background: var(--l_drawer);
            padding: 0px 15px;
        }
        .streamPagebuttonSticky {
            position:absolute;
            left: 50%;
            transform: translate(-50%, 0);
            bottom: 15px;
            width: 95%;
        }
        .calendar_add_option {
            border-radius: 3px;
            padding: 5px 8px;
        }
        :global(.MuiDialogContent-root){
            overflow-y: hidden;
        }
        @media (max-width: 768px) {
            /* Override global styles for ::-webkit-scrollbar */
            :global(::-webkit-scrollbar) {
              display: initial !important;
            }
          }
        `}
        </style>
        </>
    )
}

export default streamInfoDrawer;
