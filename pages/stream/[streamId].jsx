import dynamic from "next/dynamic";
import Router, { useRouter } from "next/router";
import Script from "next/script";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
const Slider = dynamic(() => import("react-slick"));
import LiveStreamVideoWrapper from "../../containers/drawer/LiveStreamVideo/liveStreamVideoWrapper";
import StreamLockedOverlay from "../../containers/drawer/LiveStreamVideo/streamLockedOverlay";
import WarnBroadcaster from "../../containers/live-stream-tabs/live-video-screen/warnBroadcaster";
import ScheduleStreamWait from "../../containers/live-stream-tabs/scheduleStreamWait";
import StreamLoader from "../../containers/live-stream-tabs/streamLoader";
import isMobile from "../../hooks/isMobile";
import { getCurrentStreamUserInfoHook, getStreamsHook } from "../../hooks/liveStreamHooks";
import { getStreamUserId, startLoader, stopLoader, Toast } from "../../lib/global";
// import { stopStreamLoader } from "../../lib/global";
import { SubscribeIsometrikTopic, skipCurrentViewStream } from "../../lib/rxSubject";
import { getCookie } from "../../lib/session";
import { getLiveStreams, setLiveStreams } from "../../redux/actions/liveStream/liveStream";
import { getStreamDetailAPI, getStreamFromEventAPI, updateUserStatusAPI } from "../../services/liveStream";
import { useState } from "react";
import { isAgency } from "../../lib/config/creds";
import { ISOMETRIK_MQTT_TOPICS } from "../../lib/config";
import RouterContext from "../../context/RouterContext";

const ViewStreamComponent = (props) => {
  const auth = getCookie('auth');
  const uid = getCookie('uid')
  const [mobileView] = isMobile();
  const profileData = useSelector(state => state.profileData);
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
  const [viewersList] = getCurrentStreamUserInfoHook(false);
  const streamType = 3;
  const streamStatus = 1;
  const limit = 10;
  const [popularStream] = getStreamsHook('POPULAR_STREAMS');
  const dispatch = useDispatch();
  let { streamId, query } = props.query;
  const initialIndex = popularStream.data.length && popularStream.data.findIndex((stream) => stream.streamId == streamId) || 0;
  const [playerSet, setPlayerSet] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(initialIndex < 0 ? 0 : initialIndex);
  const [streamsToShow, setStreamsToShow] = React.useState([]);
  const [isRefreshed, setRefreshed] = React.useState(false); // Whether a Page Refresh
  const [isWarned, setIswarned] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [mediaLoaded, setMediaLoaded] = React.useState(false);
  const [isLocked, setIsLocked] = React.useState(false);
  const [loaderImg, setLoaderImg] = React.useState('');
  const [initialStreamId, setInitialStreamId] = React.useState('');
  const [isScheduleStarted, setScheduleStarted] = React.useState(true);
  const [scheduleStartTime, setScheduleStartTime] = React.useState();
  const [isMuted, setIsMuted] = React.useState(0);
  const [bufferLen, setBufferLen] = React.useState(0);
  const player =  useRef(null);
  const slickElem = useRef(null);
  const loadURLRef = useRef(null);
  const [livekitTok, setTok] = useState("")
  const router = useRouter()
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

  const handleChange = (index) => {
    setActiveIndex(index);
    if ((index + 1) === streamsToShow.length) { // Means at last slide
      //Checking whether streams available
      console.log('At Last Slide');
      if (popularStream.data.length < +popularStream.totalCount) { // Need to Call API
        dispatch(getLiveStreams(streamType, streamStatus, null, null, limit, popularStream.page * limit)); // Calling Action to Fetch More Streams
      }
    }
  }

  const handleBeforeChange = (current, after) => {
    setIsLocked(false);
    if (current !== after) skipCurrentViewStream.next(current)
  };

  useEffect(() => {
    setTok(router.query.streamId)
  }, [])

  const handleBufferUpdate = () => {
    // const bufferLenCalc = player.current?.getBufferDuration();
    // setBufferLen(Number(bufferLenCalc).toFixed(2));
    // if (isNaN(bufferLenCalc)) return;
    // if (bufferLenCalc > 8.0) {
    //   player.current.seekTo(player.current.getPosition() + bufferLenCalc - 2.0)
    // }
    // else if (bufferLenCalc > 7.0) {
    //     player.current.setPlaybackRate(1.5);
    // } else if (bufferLenCalc > 6.0) {
    //     player.current.setPlaybackRate(1.25);
    // } else if (bufferLenCalc > 5.0) {
    //     player.current.setPlaybackRate(1.1);
    // } else if (bufferLenCalc > 4.0) {
    //     player.current.setPlaybackRate(1.05);
    // } else {
    //     player.current.setPlaybackRate(1);
    // }
    };

  const handlePageBack = () => {
    // Action to Fetch Streams for Popular Tab
    dispatch(getLiveStreams(
        streamType,
        streamStatus,
        null,
        null,
        limit,
        0,
        null,
        false
      ));
    
    // Action to Remove all Following Tab Streams
    dispatch(setLiveStreams(5, 1, [], null, 0, false));
  };

  const setting = {
    dots: false,
    arrows: false,
    infinite: false,
    swipe: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: initialIndex < 0 ? 0 : initialIndex,
    vertical: mobileView,
    verticalSwiping: false,
    beforeChange: handleBeforeChange,
    afterChange: handleChange
  }

  const symbolReturn = (paymentCurrencyCode) => {
    switch (paymentCurrencyCode) {
      case 'INR':
        return '₹';
      case 'USD':
        return '$';
      default:
        break;
    }
  }

  const setCustomVhToBody = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vhCustom', `${vh}px`);
  };


  React.useEffect(() => {
    if (!mobileView) return;
    setCustomVhToBody();
    window.addEventListener('resize', setCustomVhToBody);

    return () => {
      window.removeEventListener('resize', setCustomVhToBody);
    };
  }, []);

  React.useEffect(() => {
    // if (!auth) {
    //   window.open('/login', '_self');
    //   return;
    // }
    // const { IVSPlayer } = window;
    // const { isPlayerSupported } = IVSPlayer;
    // const { PLAYING } = IVSPlayer?.PlayerState;
    // const { ERROR, BUFFER_UPDATE } = IVSPlayer?.PlayerEventType;
    // if (!isPlayerSupported) {
    //   Toast('Browser is Incompatible to Play Streams');
    //   Router.push('/');
    //   return;
    // }

    // player.current = IVSPlayer.create();
    // player.current?.setLiveLowLatencyEnabled(true);
    // player.current?.setRebufferToLive(true);
    // const handlePlayerPlaying = () => {
    //   setMediaLoaded(true);
    // };
    // const handlePlayerError = () => {
    //   setMediaLoaded(false);
    //   if (loadURLRef.current && player.current) {
    //     player.current.load(loadURLRef.current);
    //     player.current.play();
    //   };
    // };
    // player.current.addEventListener(PLAYING, handlePlayerPlaying);
    // player.current.addEventListener(ERROR, handlePlayerError);
    // player.current.addEventListener(BUFFER_UPDATE, handleBufferUpdate);
    // setPlayerSet(true);
    return () => {
      // player.current?.pause();
      // player.current?.removeEventListener(PLAYING, handlePlayerPlaying);
      // player.current?.removeEventListener(ERROR, handlePlayerError);
      // player.current?.removeEventListener(BUFFER_UPDATE, handleBufferUpdate);
    };
  }, []);



  const handleRejoinScheduleStream = async () => {
    startLoader();
    const response = await getStreamFromEventAPI(streamId);
    const scheduleData = response.data;
    if (scheduleData?.streamId) {
      streamId = scheduleData.streamId;
      setScheduleStarted(true);
    }
    else {
      Toast("Stream isn't started by Host Yet!", 'warning');
      stopLoader();
      return;
    }
    SubscribeIsometrikTopic.next(ISOMETRIK_MQTT_TOPICS.NewMessageEvent + streamId)
    const initialStream = {
      streamId
    };

   
    setInitialStreamId(streamId);
    setStreamsToShow([initialStream]); // Setting One Stream of the streamId from Route
    setRefreshed(true);
    dispatch(getLiveStreams(streamType, streamStatus, null, null, limit, popularStream.page * limit)); // Calling Action to Fetch More Streams
    stopLoader();
  };

  React.useEffect(async () => {
    if (!auth) return;
    if (!isAgency()) {
      if (!query) {
      SubscribeIsometrikTopic.next(ISOMETRIK_MQTT_TOPICS.NewMessageEvent + streamId)
      }
      updateUserStatusAPI(getStreamUserId());
    }
    if (popularStream.data.length === 0) { // Means Came to Page with Refresh No Redux Data
      if (query) {
        startLoader();
        const response = await getStreamFromEventAPI(streamId);
        const scheduleData = response.data;
        if (scheduleData?.streamId) {
          streamId = scheduleData.streamId;
        }
        else {
          setScheduleStarted(false);
          setScheduleStartTime(scheduleData.scheduleStartTime);
          stopLoader();
          return;
        }
        stopLoader();
      };

      // fetch live stream details
      const fetchStreams = async () => {
        const streamData = await getStreamDetailAPI(streamId);
        setStreamsToShow(streamData?.data?.stream)

      }

      fetchStreams()
      // const initialStream = {
      //   streamId
      //   // streamData
      // };
      setInitialStreamId(streamId);
      SubscribeIsometrikTopic.next(ISOMETRIK_MQTT_TOPICS.NewMessageEvent + streamId)
      // setStreamsToShow([initialStream]); // Setting One Stream of the streamId from Route
      // setRefreshed(true);
      dispatch(getLiveStreams(streamType, streamStatus, null, null, limit, popularStream.page * limit)); // Calling Action to Fetch More Streams
    } else {
      if (router.query.eventId === "true") {
        startLoader();
        const response = await getStreamFromEventAPI(streamId);
        const scheduleData = response.data;
        SubscribeIsometrikTopic.next(ISOMETRIK_MQTT_TOPICS.NewMessageEvent + scheduleData.streamId)
        stopLoader();
      }
      setStreamsToShow(popularStream.data)
      stopLoader();
    }
  }, []);

  React.useEffect(() => {
    if (!auth) return;
    if (popularStream.data.length) {
      if (isRefreshed) {
        const filteredStream = popularStream.data.filter((stream) => stream.streamId != initialStreamId);
        setStreamsToShow([{ streamId: initialStreamId }, ...filteredStream]);
        setRefreshed(filteredStream.length === popularStream.data.length);
      } else setStreamsToShow(popularStream.data);
    };
  }, [popularStream.data]);

  // React.useEffect(() => {
  //   if (!auth) return;
  //   const liveLatency = player.current?.getLiveLatency();
  //   console.log(liveLatency, 'is the latency updating ==>', player.current.getPlaybackRate());
  //   if (liveLatency > 10) {
  //     // player.current.seekTo(player.current.getPosition() + liveLatency - 4);
  //     player.current.setPlaybackRate(2);
  //   } else if (liveLatency > 7.5) {
  //     player.current.setPlaybackRate(1.75);
  //   } else if (liveLatency > 5) {
  //     player.current.setPlaybackRate(1.5);
  //   } else {
  //     player.current.setPlaybackRate(1);
  //   }
  // }, [player.current?.getLiveLatency()]);

  const swipeNext = () => {
    console.log('trying swipe ---->> Next', activeIndex, streamsToShow.length);
    if (activeIndex + 1 === streamsToShow.length) return;
    slickElem?.current?.slickGoTo?.slickGoTo(activeIndex + 1);
    // this.setState({ activeSlider: this.state.activeSlider + 1 });
  }

  const swipePrev = () => {
    console.log('trying swipe ---->> Prev', activeIndex);
    if (activeIndex === 0) return;
    slickElem?.current?.slickGoTo?.slickGoTo(activeIndex - 1);
  }

  React.useEffect(() => {
    if (!auth) return;
    console.log(activeIndex, 'is the activeindex changed ==>');
    if (streamsToShow[activeIndex]) setIsLocked(streamsToShow[activeIndex].isPaid && !streamsToShow[activeIndex].alreadyPaid);
  }, [activeIndex]);

  const updateLockedStream = (streamId) => {
    if (streamsToShow[activeIndex].streamId === streamId) setIsLocked(false);
  }

  const startStreamLoader = () => {
    setIsLoading(true);
  }

  const stopStreamLoader = () => {
    setIsLoading(false);
  }

  const toggleMute = () => {
    // player.current?.setMuted(isMuted ? 0 : 1);
    setIsMuted((prev) => prev ? 0 : 1 );
  }

  return (
    <RouterContext forLogin={true} forUser={true} forCreator={true} forAgency={true} {...props}>
    <>
      {/* <Script src="https://player.live-video.net/1.5.0/amazon-ivs-player.min.js" strategy="beforeInteractive" /> */}
        <>
          <Slider {...setting} ref={slickElem} className="livestream__slick">
            {streamsToShow.length > 0 ?
              streamsToShow.map((stream, index) => (
                <LiveStreamVideoWrapper
                  key={stream.streamId}
                  streamId={stream.streamId}
                  startStreamTime={stream.startDateTime} 
                  player={player.current || {}}
                  isActive={activeIndex === index}
                  streamIndex={index}
                  setLoaderImg={setLoaderImg}
                  // streamUrl={streamUrlArr[index % 3]}
                  swipeNext={swipeNext}
                  swipePrev={swipePrev}
                  isPrevAvailable={activeIndex !== 0}
                  isNextAvailable={activeIndex + 1 !== streamsToShow.length}
                  startStreamLoader={startStreamLoader}
                  stopStreamLoader={stopStreamLoader}
                  streamData={stream}
                  profileData={profileData}
                  S3_IMG_LINK={S3_IMG_LINK}
                  viewersList={viewersList}
                  handlePageBack={handlePageBack}
                  toggleMute={toggleMute}
                  isMuted={isMuted}
                  isLocked={isLocked}
                  bufferLen={bufferLen}
                  symbolReturn={symbolReturn}
                  loadURLRef={loadURLRef}
                  mediaLoaded={mediaLoaded}
                  setMediaLoaded={setMediaLoaded}
                  uid={uid}
                  />
                  )) : (
                    <>
                {
                  query && !isScheduleStarted && scheduleStartTime && (
                    <>
                    <ScheduleStreamWait handleRejoinScheduleStream={handleRejoinScheduleStream} scheduleStartTime={scheduleStartTime} />
                    </>
                  )
                }
                </>
              )}
              <div style={{ width: '100vw', height: mobileView ? 'calc(var(--vhCustom, 1vh) * 100)' : '100vh' }} />
              <div style={{ width: '100vw', height: mobileView ? 'calc(var(--vhCustom, 1vh) * 100)' : '100vh' }} />
              <div style={{ width: '100vw', height: mobileView ? 'calc(var(--vhCustom, 1vh) * 100)' : '100vh' }} />
          </Slider>
      </>

      {isLoading && (
        <>
        <StreamLoader loaderPic={loaderImg} />
        </>
      )}
      {
        isLocked && !isLoading && <StreamLockedOverlay swipeNext={swipeNext} swipePrev={swipePrev} handlePageBack={handlePageBack} streamData={streamsToShow[activeIndex]} updateLockedStream={updateLockedStream} />
      }
      <style jsx="true">
        {`
        :global(.livestream__slick .slick-list) {
          min-height: calc(var(--vhCustom, 1vh) * 100);
        }
        `}
      </style>
    </>
    </RouterContext>
  );
};

ViewStreamComponent.getInitialProps = async ({ ctx }) => {
  let { query = {} } = ctx;
  return { query };
};

export default ViewStreamComponent;
