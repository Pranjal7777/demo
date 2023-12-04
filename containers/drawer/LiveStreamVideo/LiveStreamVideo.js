import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSwipeable } from "react-swipeable";
import { Picker } from "emoji-mart";
import Skeleton from "@material-ui/lab/Skeleton";
import { BounceLoader } from "react-spinners";
import Router from "next/router";
import VisibilityIcon from "@material-ui/icons/Visibility";
import * as config from "../../../lib/config";
import VideoAction from "../../live-stream-tabs/video-action";
import {
  Room,
  RoomEvent,
  setLogLevel
} from "livekit-client";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";

import {
  getCurrentStreamUserInfo,
  leaveStreamViewerAction,
  likeCurrentStream,
  joinStreamViewerAction,
  leaveCurrentStream,
  getMessagesStreamAction,
  postMessageAction,
  FollowUserAction,
  UnfollowUserAction,
  // setCurrentStreamUserInfo,
  setCurrentStreamIdAction,
} from "../../../redux/actions/liveStream/liveStream";
import { isIOSDevice, open_dialog, open_drawer } from "../../../lib/global";
import {
  getCurrentStreamInfoHook,
  getCurrentStreamUserInfoHook,
} from "../../../hooks/liveStreamHooks";
import isMobile from "../../../hooks/isMobile";
import {
  SubscribeIsometrikTopic,
  UnSubscribeIsometrikTopic,
  animateBroadcasterStream,
  endCurrentViewStream,
  skipCurrentViewStream,
  subscribeTopic,
  unsubscribeTopic,
} from "../../../lib/rxSubject";
import { textencode } from "../../../lib/chat";
import StreamEndedOverlay from "./streamEndedOverlay";
import { fancyTimeFormat } from "../../../lib/liveStream";
import AvatarImage from "../../../components/image/AvatarImage";
import { s3ImageLinkGen } from "../../../lib/UploadAWS/uploadAWS";
import isTablet from "../../../hooks/isTablet";
import Icon from "../../../components/image/icon";
import { STREAM_SERVICE } from "../../../lib/config/creds";
import { CoinPrice } from "../../../components/ui/CoinPrice";
import { handleContextMenu } from "../../../lib/helper";
// import StreamLockedOverlay from "./streamLockedOverlay";

const LiveStreamVideo = (props) => {
  const [mobileView] = isMobile();
  const [tabletView] = isTablet();
  const intervalIDRef = useRef(null);
  const [resolutionToShow, setResolutionToShow] = useState({ width: null, height: null })
  const [wrapServers] = useState({ primaryServer: config.IVS_STREAM_DNS, liveKitServer: config.LIVEKIT_STREAM_DNS });
  const {
    streamId,
    player,
    isActive,
    streamIndex,
    swipeNext,
    swipePrev,
    startStreamTime,
    startStreamLoader,
    stopStreamLoader,
    setLoaderImg,
    profileData,
    S3_IMG_LINK,
    viewersList,
    handlePageBack,
    toggleMute,
    isMuted,
    streamData,
    isLocked,
    bufferLen,
    symbolReturn,
    openBroadcastSettings,
    isShowLatency,
    isNextAvailable,
    isPrevAvailable,
    loadURLRef,
    mediaLoaded,
    setMediaLoaded,
    uid,    
  } = props;
  const startingTimeSec = +(
    (new Date().getTime() - startStreamTime) /
    1000
  ).toFixed(0);


  const swipeHandler = useSwipeable({
    // To manage the swipe events in Mobile Device only
    onSwipedUp: swipeNext,
    onSwipedDown: swipePrev,
    trackMouse: false,
    trackTouch: true,
    preventDefaultTouchmoveEvent: true,
  });
  const videoBoxRef = useRef();
  const [currentStreamMeta] = getCurrentStreamInfoHook();
  const [currentStreamHostInfo] = getCurrentStreamUserInfoHook(true);
  // const [currentAnalytics] = getCurrentStreamAnalyticsHook();
  const dispatch = useDispatch();
  // const [text, setText] = useState("");
  // const [isEmojiShow, setIsEmojiShow] = useState(false);
  const [isStreamStopped, setStreamStopped] = useState(false);
  const [isStreamSkipped, setStreamSkipped] = useState(false);
  const [isComment, setIsComment] = useState(!mobileView);
  const [hostData, setHostData] = useState(null);
  const [commentText, setCommentTxt] = useState("");
  const [isFollowed, setIsFollowed] = useState();
  const [timer, setTimer] = useState(null);
  const [showEmoji, togglePicker] = useState(false);
  const [tipAnimArr, setTipAnimArr] = useState([]);
  const remoteVideoRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const [publisherController, setPublisherController] = useState({})
  const [animIndex, setAnimIndex] = useState(0)
  let endCurrentViewStreamVar;
  let skipCurrentViewStreamVar;
  let animateSubscribeVar;
  // const arr = [1, 2, 3, 4, 5, 6, 8, 9];
  const [room, setRoom] = useState({})
  const handleLike = () => {
    console.log("handling like");
    dispatch(likeCurrentStream(streamId, null, uid));
  };

  const toggleComment = () => setIsComment((prev) => !prev);

  const callBackEnd = () => {
    stopStreamLoader();
    Router.push("/live/popular");
    handlePageBack?.();
  };

  const handleCloseStreamView = () => {
    startStreamLoader();
    dispatch(
      postMessageAction(
        textencode("left the stream"),
        streamId,
        false,
        () => {
          room.disconnect()
          dispatch(leaveStreamViewerAction(streamId, callBackEnd, callBackEnd));
        },
        callBackEnd
      )
    );
  };

  const handleStopppedStreamClose = () => {
    dispatch(leaveCurrentStream());
    Router.push("/live/popular");
    handlePageBack?.();
  };

  // const handleOnChangeText = (inputText) => {
  //   setText(inputText);
  // };

  // const handleAddEmoji = () => {
  //   setIsEmojiShow(!isEmojiShow);
  // };


  const startStream = (STREAM_URL) => {
    // subscribe the senttip topic
    subscribeTopic.next(config.MQTT_TOPIC.streamSentTip + '/' + streamId);
    SubscribeIsometrikTopic.next(config.ISOMETRIK_MQTT_TOPICS.NewMessageEvent + streamId)
    player.pause();
    const videoBox = videoBoxRef.current;
    player.attachHTMLVideoElement(videoBox);
    loadURLRef.current = STREAM_URL;
    player.load(STREAM_URL);
    player.play();
    stopStreamLoader();
  }


  const joinIsometrikLiveStream = async (token) => {
    subscribeTopic.next(config.MQTT_TOPIC.streamSentTip + '/' + streamId);
    const room = new Room({
      logLevel: 'debug',
      adaptiveStream: false,
      dynacast: true
    });
    let serverPri = wrapServers.liveKitServer
    let wsUrl = `wss://${serverPri}`;

    // Access the local participant's tracks
    const localParticipant = room.localParticipant;
    const tracks = localParticipant.tracks;

    const videoTracks = Array.from(localParticipant.videoTracks.values());
    const audioTracks = Array.from(localParticipant.audioTracks.values());
    videoTracks.forEach((track) => {
      track.attach(remoteVideoRef.current);
    });

    audioTracks.forEach((track) => {
      track.attach(remoteAudioRef.current);
    });
    setRoom(room)
    room.on(RoomEvent.TrackSubscribed, (track, publication) => {
      if (track.kind === "video") {
        track.attach(remoteVideoRef.current);
        setResolutionToShow({
          width: publication.dimensions.width,
          height: publication.dimensions.height
        })
      }
      else if (track.kind === "audio") {
        track.attach(remoteAudioRef.current);
        setPublisherController(track)
      }
      stopStreamLoader();
    });

    room.on(RoomEvent.Disconnected, (track) => {
      room.disconnect()
      stopStreamLoader();
    });

    try {
      await room.connect(wsUrl, token, {
        autoSubscribe: true, // Enable auto-subscription
      });
      setLogLevel('debug');
      console.log("Stream Joined with", wsUrl, token)
    } catch (error) {
      console.log(error)
      stopStreamLoader();
    }
    setMediaLoaded(true)

  };
  const startViewStream = () => {
    if (isStreamStopped || (streamData.isPaid && !streamData.alreadyPaid)) {
      stopStreamLoader();
      setMediaLoaded(true);  // It Means Stream is Stopped and I can safely stop shimmer
      return;
    }
    startStreamLoader();
    setMediaLoaded(false); // Need to Enable Shimmer
    dispatch(
      joinStreamViewerAction(
        streamId,
        ({ playbackUrl, rtcToken }) => {
          dispatch(
            postMessageAction(
              textencode("joined the stream"),
              streamId,
              false,
              () => {
                setTimer(startingTimeSec);
                dispatch(getMessagesStreamAction(streamId, 20, null));
                if (STREAM_SERVICE === "LiveKit") {
                  joinIsometrikLiveStream(rtcToken)
                } else {
                  startStream(`${playbackUrl}?token=${rtcToken}`);
                }
                intervalIDRef.current = setInterval(() => {
                  console.log("Timer => Doing", streamId);
                  setTimer((prev) => prev + 1);
                }, 1000);
              },
              () => {
                dispatch(getMessagesStreamAction(streamId, 20, null));
                if (STREAM_SERVICE === "LiveKit") {
                  joinIsometrikLiveStream(rtcToken)
                } else {
                  startStream(`${playbackUrl}?token=${rtcToken}`);
                }
              }
            )
          );
        },
        () => {
          stopStreamLoader();
          setMediaLoaded(true); // It Means Stream is Stopped and I can safely stop shimmer
          clearInterval(intervalIDRef.current);
          setStreamStopped(true);
        }
      )
    );
  };

  const handleVisibilityChange = () => {
    if(!document.hidden) {
      player.play()
    }
  }

  // React.useEffect(() => {
  //   const playerState = player.getState()
  //   if (playerState === 'Playing') {
  //     setTimer(startingTimeSec);
  //     intervalIDRef.current = setInterval(() => {
  //       console.log("Timer => Doing", streamId, timer);
  //       setTimer((prev) => prev + 1);
  //     }, 1000);
  //   } else {
  //     clearInterval(intervalIDRef.current)
  //   }
  // }, [player?.getState()])


  const initialStreamStart = () => {
    Router.replace(`/stream/${streamId}`);
    setStreamSkipped(false);
    startStreamLoader();
    if (hostData) startViewStream();
    else {
      dispatch(
        getCurrentStreamUserInfo(streamId, null, () => {
          stopStreamLoader();
          startViewStream();
        })
      );
    }
  };

  React.useEffect(() => {
    togglePicker(false);
    if (isActive) {
      if (hostData) setLoaderImg(hostData.userProfileImageUrl);
      if (!(streamData.isPaid && !streamData.alreadyPaid)) initialStreamStart();
    }
  }, [isActive, isLocked]);

  // React.useEffect(() => {
  //   if (isStreamSkipped) dispatch(leaveCurrentStream());
  //   const streamUnlocked = streamData.isPaid ? streamData.alreadyPaid : true;
  //   if (isStreamSkipped && !isStreamStopped && streamUnlocked) {
  //     unsubscribeTopic.next(config.MQTT_TOPIC.streamSentTip + '/' + streamId);
  //     player.pause();
  //     dispatch(
  //       postMessageAction(
  //         textencode("left the stream"),
  //         streamId,
  //         false,
  //         () => {
  //           dispatch(leaveStreamViewerAction(streamId));
  //         }
  //       )
  //     );
  //   }
  // }, [isStreamSkipped]);


  const subscribeRxjs = () => {
    endCurrentViewStreamVar = endCurrentViewStream.asObservable().subscribe((streamIdToEnd) => {
      if (streamIdToEnd == streamId) {
        // Toast('This stream is stopped', 'warning');
        setStreamStopped(true);
        clearInterval(intervalIDRef.current);
        stopStreamLoader();
        // clearTimeout(timeoutId);
        player?.pause?.();
        unsubscribeTopic.next(config.MQTT_TOPIC.streamSentTip + '/' + streamId);
        UnSubscribeIsometrikTopic.next(config.ISOMETRIK_MQTT_TOPICS.NewMessageEvent + streamId)
      }
    });
    skipCurrentViewStreamVar = skipCurrentViewStream.asObservable().subscribe((streamIndexToSkip) => {
      if (streamIndex == streamIndexToSkip) {
        console.log("Skipped Stream", streamId);
        clearInterval(intervalIDRef.current);
        setStreamSkipped(true);
        // clearTimeout(timeoutId);
      }
    });

    animateSubscribeVar = animateBroadcasterStream.asObservable().subscribe((action) => {
      console.log('Action Recieved ==>>', action);
      if (action.type === 'GOT TIP' && action.topic?.includes(streamId)) {
        addTipGIF(action.data);
      }
    })
  };

  React.useEffect(() => {
    subscribeRxjs();
    return () => {
      clearInterval(intervalIDRef.current);
      // console.log('Calling these methods =>>');
      endCurrentViewStreamVar?.unsubscribe?.();
      skipCurrentViewStreamVar?.unsubscribe?.();
      unsubscribeTopic.next(config.MQTT_TOPIC.streamSentTip + '/' + streamId);
      UnSubscribeIsometrikTopic.next(config.ISOMETRIK_MQTT_TOPICS.NewMessageEvent + streamId)
      animateSubscribeVar?.unsubscribe?.();
      // clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (publisherController.attach) {
      if (isMuted) {
        remoteVideoRef.current.muted = true
        publisherController.detach()
      }
      else {
        publisherController.attach()
        remoteVideoRef.current.muted = false
      }
    }
  }, [isMuted, publisherController])

  React.useEffect(() => {
    if (currentStreamHostInfo && !hostData && isActive) {
      // Redux Fetched Host Data but State doesn't have
      console.log("calling isActive", streamId, isActive);
      setHostData(currentStreamHostInfo);
      setIsFollowed(Boolean(currentStreamHostInfo.followStatus));
      setLoaderImg(currentStreamHostInfo.userProfileImageUrl);
    }

    if (!currentStreamHostInfo && hostData && isActive) {
      // State has Host Data but Redux doesn't have
      // const dataToSet = {streamId};
      dispatch(setCurrentStreamIdAction(streamId));
      // console.log(dataToSet, 'is the data setting ==>');
      // console.log(isActive, 'is the active found ==>', streamId);
      // setLoaderImg(hostData.userProfileImageUrl);
      // dispatch(setCurrentStreamUserInfo(dataToSet));
    }
  }, [currentStreamHostInfo, isActive]);

  React.useEffect(() => {
    if (tipAnimArr?.length === animIndex) return
    const timeout = setTimeout(() => {
      setAnimIndex(prev => prev + 1)
    }, 3000);

    return () => clearTimeout(timeout)
  }, [animIndex, tipAnimArr.length])

  const handleSendComment = (e) => {
    e?.preventDefault();
    setCommentTxt("");
    dispatch(postMessageAction(textencode(commentText), streamId));
    togglePicker(false);
  };

  const handleFollowClicked = (isFollowing = false) => {
    if (isFollowing)
      dispatch(UnfollowUserAction(hostData.userId, () => setIsFollowed(false)));
    else dispatch(FollowUserAction(streamId, hostData?.isometrikUserId, () => setIsFollowed(true)));
  };

  const handleReport = () => {
    mobileView
      ? open_drawer(
        "REPORT_POST",
        {
          drawerData: {
            reportedId: hostData.userId,
            reportType: 2,
          },
          back: () => close_drawer(),
        },
        "bottom"
      )
      : open_dialog("REPORT_POST", {
        drawerData: {
          reportedId: hostData.userId,
          reportType: 2,
        },
        back: () => close_drawer(),
      });
  };

  const handleViewUser = () => {
    mobileView
      ? open_drawer(
        "USER_INFO_POPUP",
        {
          userInfo: hostData,
          streamId,
          isFollowed,
          handleFollowClicked,
          handleReport,
        },
        "bottom"
      )
      : open_dialog("USER_INFO_POPUP", {
        userInfo: hostData,
        streamId,
        isFollowed,
        handleFollowClicked,
        handleReport,
      });
  };

  // const handleViewersList = () => {
  //   mobileView
  //     ? open_drawer("STREAM_VIEWER_LIST", { streamId }, "bottom")
  //     : open_dialog("STREAM_VIEWER_LIST", { streamId });
  // };

  const handleTipSend = () => {
    mobileView ?
      open_drawer(
        "SentTip",
        {
          creatorId: hostData.userId,
          streamId: streamId,
          creatorName: hostData.userName
        },
        "bottom"
      ) : open_dialog("sendTip", {
        creatorId: hostData.userId,
        streamId: streamId,
        creatorName: hostData.userName
      });
  };


  const addTipGIF = (data) => {
    setTipAnimArr((prev) => (
      [...prev, {
        key: data.sentAt,
        top: 20,
        right: 10,
        senderName: data.senderName === profileData?.username ? 'You' : data.senderName,
        sentAmout: `${data.transferedAmount}`
      }]
    ));
  };

  const returnConfig = () => (mobileView ? swipeHandler : {});

  const handleViewersList = () => {
    if (!viewersList?.length) return;
    if (mobileView) {
      open_drawer('STREAM_VIEWER_LIST', { streamId, creator: false }, 'bottom');
    } else {
      open_dialog("STREAM_VIEWER_LIST", { streamId, creator: false });
    }
  };

  const handleEnterPress = (e) => {
    if (e.key !== "Enter") return
    e.preventDefault()
    handleSendComment(e)
  }

  return (
    <>
      <div className="contentPosition pg-bg" {...returnConfig()}>
        {isStreamStopped && (
          <StreamEndedOverlay
            hostData={hostData}
            isFollowed={isFollowed}
            handleFollowClicked={handleFollowClicked}
            handleStopppedStreamClose={handleStopppedStreamClose}
          />
        )}
        {/* {tipAnimArr.length ? tipAnimArr.map((item) => (
          <div key={item.key} className="d-flex flex-column align-items-center justify-content-center" style={{ position: 'absolute', top: `${item.top}%`, right: `${item.right}%`, zIndex: 100, fontFamily: 'Roboto', color: 'beige', fontSize: mobileView ? '14px' : '1rem' }}>
            <img src={config.GO_LIVE_SCREEN.tipSentGif} onLoad={handleAnimEvent} className="my-n5" width={mobileView ? 150 : 200} alt="TIP SENT ANIMATION" />
            {item.senderName} sent {item.sentAmout}
          </div>
        )) : <></>} */}
        {!!tipAnimArr.length && tipAnimArr?.[animIndex] && <div key={tipAnimArr[animIndex].key} className="d-flex flex-column align-items-center justify-content-center" style={{ position: 'absolute', top: `${tipAnimArr[animIndex].top}%`, right: `${tipAnimArr[animIndex].right}%`, zIndex: 100, fontFamily: 'Roboto', color: 'beige', fontSize: '14px' }}>
          <img src={config.GO_LIVE_SCREEN.tipSentGif} className="my-n5 callout-none" width={150} alt="TIP SENT ANIMATION" onContextMenu={handleContextMenu} />
          {tipAnimArr[animIndex].senderName} sent <CoinPrice price={tipAnimArr[animIndex].sentAmout} size="14" showCoinText={false} iconSize={14} />
        </div>}
        {/* {streamData.isPaid && !streamData.alreadyPaid && (
          <StreamLockedOverlay />
        )} */}
        {/* {!mobileView && isPrevAvailable && (
          <div className="dv_scrollPrev cursor-pointer" onClick={swipePrev}>
            <img
              src={config.GO_LIVE_SCREEN.streamNavigateArrow}
              width={29}
              height={29}
            />
          </div>
        )} */}
        {/* {!mobileView && isNextAvailable && (
          <div className="dv_scrollNext cursor-pointer" onClick={swipeNext}>
            <img
              src={config.GO_LIVE_SCREEN.streamNavigateArrow}
              width={29}
              height={29}
            />
          </div>
        )} */}
        <video
          ref={remoteVideoRef}
          playsInline
          controlsList="nodownload"
          autoPlay
          className={
            mobileView
              ? "video__player__live"
              : "video__player__live dv__video_check"
          }
        />

        {!mediaLoaded &&
          (<>
            <div className="exact__centre__spinner">
              <BounceLoader loading size={50} sizeUnit="px" />
            </div>
            <Skeleton animation="wave" variant="rect" className={mobileView ? "video__player__live" : "video__player__live dv__video_check"} style={{ zIndex: 0, backgroundColor: "rgb(255 255 255 / 30%)" }} />
          </>)
        }
        {!mobileView && (
          <img
            src={config.RIGHT_WHT_ARROW}
            height="20px"
            onClick={handleCloseStreamView}
            className="dv_stream_close"
            alt="close icon"
          />
        )}
        <div
          className="d-flex viewerList_viewerScreen cursor-pointer"
          onClick={handleViewersList}
        >
          <div className="d-flex position-absolute viewer_count_screen viewer_box">
            <VisibilityIcon style={{ width: "13px" }} />{" "}
          </div>
        </div>
        {isShowLatency && <div className="position-absolute bufferInfo">
          Buffer: {bufferLen}
          <br />
          latency: {player.getLiveLatency()}
        </div>}
        <div className="d-flex justifyi-content-center container pt-3">
          {mobileView && (
            <div className={`px-0 col-12 d-flex align-items-center justify-content-between ${isIOSDevice() ? "handleCrossForIos" : ""}`}>
              <div className="col-auto p-0 userNameCss d-flex align-items-center">
                <div>
                  <Icon
                    icon={`${config.CLOSE_ICON_WHITE}#close-white`}
                    color="var(--l_app_text)"
                    width={25}
                    class="broadcastScreen_video"
                    height={25}
                    onClick={handleCloseStreamView}
                    alt="backArrow"
                  />
                </div>
              </div>

              {/* <div
                style={{ opacity: 0 }}
                className="col-auto p-0 userNameCss d-flex align-items-center"
              >
                <div>
                  <img
                    src={config.CLOSE_ICON_WHITE} // Share Icon
                    height="20px"
                    // onClick={handleCloseStreamView}
                    alt="close icon"
                  />
                </div>
              </div> */}
            </div>
          )}
        </div>

        {!mobileView && (
          <div
            className="d-flex dv_stream_info cursor-pointer"
            onClick={handleViewUser}
          >
            {hostData?.userProfileImageUrl ? (
              <img
                src={s3ImageLinkGen(S3_IMG_LINK, hostData?.userProfileImageUrl, null, 40, 40)}
                className="userProfileImgClass callout-none"
                onContextMenu={handleContextMenu}
              />
            ) : (
              <AvatarImage
                isCustom={true}
                className="userProfileImgClass"
                userName={hostData?.userIdentifier}
              />
            )}

            <div className="col-auto pl-2">
              <p className="m-0 userNameCss font-weight-600">
                {hostData?.userIdentifier || "Username"}
              </p>
              {!isStreamStopped && (
                <p className="m-0 d-flex">
                  <span
                    className="userNameCss px-2 liveLabelCss"
                    style={{ paddingBottom: "2px" }}
                  >
                    LIVE
                  </span>
                  <span className="userNameCss pl-2">
                    {fancyTimeFormat(timer)}
                  </span>
                </p>
              )}
            </div>

            <div className="col-auto ml-auto p-0">
              <img
                src={isFollowed ? config.GO_LIVE_SCREEN.tickIco : config.GO_LIVE_SCREEN.plusBlueIco}
                width={37}
                className="callout-none"
                onContextMenu={handleContextMenu}
                height={37}
              />
            </div>
          </div>
        )}

        <div className="col-12 inputPosition">
          <VideoAction openBroadcastSettings={openBroadcastSettings} toggleMute={toggleMute} isMuted={isMuted} handleTipSend={handleTipSend} mobileView={mobileView} handleLike={handleLike} />
          {mobileView && !isComment && (
            <img
              width={45}
              height={45}
              className="cursor-pointer position-absolute callout-none"
              onContextMenu={handleContextMenu}
              src={config.GO_LIVE_SCREEN.chatIcon}
              onClick={toggleComment}
            />
          )}
          {mobileView && !isComment && (
            <div
              className="d-flex mv_stream_info cursor-pointer"
              onClick={handleViewUser}
            >
              {hostData?.userProfileImageUrl ? (
                <img
                  src={s3ImageLinkGen(S3_IMG_LINK, hostData?.userProfileImageUrl, null, 40, 40)}
                  className="userProfileImgClass"
                />
              ) : (
                <AvatarImage
                  isCustom={true}
                  className="userProfileImgClass"
                  userName={hostData?.userIdentifier}
                />
              )}
              <div className="col-auto pl-2">
                <p className="m-0 userNameCss font-weight-600">
                  {hostData?.userIdentifier || "Username"}
                </p>
                {!isStreamStopped && (
                  <p className="m-0 d-flex">
                    <span
                      className="userNameCss px-2 liveLabelCss"
                      style={{ paddingBottom: "2px" }}
                    >
                      LIVE
                    </span>
                    <span className="userNameCss pl-2">
                      {fancyTimeFormat(timer)}
                    </span>
                  </p>
                )}
              </div>

              <div className="col-auto ml-auto p-0">
                <img
                  src={isFollowed ? config.GO_LIVE_SCREEN.tickIco : config.GO_LIVE_SCREEN.plusBlueIco}
                  width={37}
                  height={37}
                  className="callout-none"
                  onContextMenu={handleContextMenu}
                />
              </div>
            </div>
          )}

          {/* <div className="d-flex pl-0 col-12 emojiDiv mb-1">
            {arr.map((icon, index) => (
              <div className="col-auto">
                <img src="/images/livestrem-static/fire.svg" />
                <p className="emo__title">$40</p>
              </div>
            ))}
          </div> */}
          {isComment && (
            <form
              style={mobileView ? { marginRight: "50px" } : { width: 'min-content' }}
              onSubmit={handleSendComment}
              className={mobileView ? "" : "position-relative"}
            >
              {showEmoji && (
                <div
                  tabIndex="-1"
                  onKeyDown={(e) => {
                    // console.log(e);
                    if (e.keyCode == 13) {
                      togglePicker(false);
                      handleSendComment()
                    }
                  }}
                  style={{ position: "absolute", bottom: "100%", zIndex: 1 }}
                >
                  <Picker
                    onClick={(imogi) => {
                      setCommentTxt(commentText + imogi.native);
                    }}
                    color={config.PRIMARY}
                    showPreview={false}
                    showSkinTones={false}
                  />
                </div>
              )}
              {mobileView ? (
                <>
                  <span onClick={toggleComment} className="position-absolute" style={{ bottom: "10px", left: "5px", zIndex: "2" }}>
                    {hostData?.userProfileImageUrl ? (
                      <img
                        src={s3ImageLinkGen(S3_IMG_LINK, hostData.userProfileImageUrl, null, 35, 35)}
                        className="commentUserProfile callout-none"
                        onContextMenu={handleContextMenu}
                      />
                    ) : (
                      <AvatarImage
                        isCustom={true}
                        className="commentUserProfile"
                        userName={hostData?.userIdentifier}
                      />
                    )}
                  </span>
                </>
              ) : (
                <>
                  <img
                      className="cursor-pointer emojiPos callout-none"
                    src={config.IMOGI}
                      onContextMenu={handleContextMenu}
                    onClick={() => togglePicker((prev) => !prev)}
                    style={{
                      position: "absolute",
                      bottom: "11px",
                      left: mobileView ? "24px" : "10px",
                      zIndex: 25
                    }}
                  />
                </>
              )}
              <div className="position-relative">
                <TextareaAutosize
                  type="text"
                  placeholder={"Say Something…"}
                  value={commentText}
                  rows={1.3}
                  rowsMax={4}
                  onFocus={() => togglePicker(false)}
                  onKeyPress={handleEnterPress}
                  className="py-2 inputCss"
                  onChange={(e) => setCommentTxt(e.target.value)}
                />
                <div className="position-absolute send_msg_icon cursor-pointer ">
                  <Icon
                    icon={`${config.sendMessageIcon}#demo787`}
                    color='var(--l_base)'
                    width={35}
                    height={35}
                    viewBox='0 0 24 24'
                    onClick={handleSendComment}
                  />

                </div>
              </div>
            </form>
          )}
        </div>
      </div>
      <style jsx>{`
        .contentPosition {
          position: absolute;
          top: 0;
          width: 100%;
          // height: 100vh;
          height: ${mobileView ? 'calc(var(--vhCustom, 1vh) * 100)' : '100vh'};
          background: ${mobileView
          ? "linear-gradient(#363434db, #1f1e1e05, #36343499)"
          : "#3A343A"};
        }
        // .videoCss {
        //   height: 100vh;
        //   overflow: hidden;
        //   overflow-y: auto;
        // }
        .userNameCss {
          color: white;
          font-size: 12px;
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
          transform: rotate(180deg);
        }
        .dv_stream_info {
          width: 26vw;
          border-radius: 4vw;
          background-color: #00000080;
          height: 54px;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          bottom: 15px;
          align-items: center;
          padding: 7px 10px;
          z-index: 1;
        }
        .mv_stream_info {
          border-radius: 50px;
          height: 47px;
          padding: 0 7px;
          background-color: #00000080;
          z-index: 1;
          align-items: center;
          margin: 0 50px;
        }
        .viewer_count_screen {
          bottom: 100%;
          font-family: "Roboto";
          color: white;
          font-size: 12px;
          align-items: center;
          left: calc(50% - 13px);
        }
        .dv_scrollPrev {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(calc(-50% + -19.5vw), -50%);
          z-index: 2;
        }

        .dv_scrollNext {
          position: absolute;
          top: 50%;
          right: 50%;
          transform: translate(calc(50% + 19.5vw), -50%) rotate(180deg);
          z-index: 2;
        }
        .handleCrossForIos{
          margin-top: 20px;
        }
        :global(.userProfileImgClass) {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid white;
        }
        :global(.commentUserProfile) {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          border: 1px solid white;
          position: absolute;
          bottom: 2px;
          left: 19px;
          z-index: 1;
        }
        :global(.stream_viewer_pic) {
          width: 34px;
          height: 34px;
          border: 1px solid white;
          margin-left: -17px;
        }
        .viewer_box{
          border: 1px solid white;
          padding: 3px 8px;
          border-radius: 6px;
          background: #3531315e;
        }
        .viewerList_viewerScreen {
          position: absolute;
          top: ${mobileView ? "3.5rem" : "40px"};
          left: 50%;
          transform: translateX(-50%);
          z-index: 1;
        }
        .viewCountCss {
          width: 94px;
          background: #5ab4e5;
          border-radius: 5px;
        }

        .liveLabelCss {
          color: #fff;
          background: #f22a2a;
          font-size: 11px;
        }

        :global(.inputCss) {
          border: none;
          border-radius: 23px;
          padding-left: 50px;
          width: ${mobileView ? "100%" : "250px"};
          padding-right: 50px;
          padding-top:${mobileView && "14px !important"};
          padding-bottom:${!mobileView && "0px !important"};
          position:relative;
          z-index:1;
        }

        .inputPosition {
          position: absolute;
          bottom: 15px;
        }

        .emojiDiv {
          overflow-x: auto;
        }
        .emojiDiv::-webkit-scrollbar {
          display: none !important;
        }

        .emo__title {
          font-size: 12px;
          font-family: "Avenir-Bold", sans-serif !important;
          color: #ffffff;
          margin: 0;
        }

        .pg-bg {
          position: relative;
        }
        :global(.video__player__live) {
          position: absolute;
          height:calc(var(--vhCustom, 1vh) * 100);
          max-height: calc(var(--vhCustom, 1vh) * 100);
          width:100vw;
          // aspect-ratio:${resolutionToShow.width / resolutionToShow.height};
          z-index: 0;
          object-fit: contain;
        }
        :global(.dv__video_check) {
          left: 50%;
          transform: translateX(-50%);
        }
        .exact__centre__spinner {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        :global(.planSliderDiv){
          overflow-x:${mobileView && "hidden"}
        }
        .bufferInfo {
          top: 15px;
          left: 50%;
          transform: translateX(-50%);
          z-Index: 99;
          background-color: #ffffff9e;
          padding: 5px 10px;
          border-radius: 30px;
        }
        .send_msg_icon {
          top: 44%;
          right: 10px;
          z-index: 1;
          transform: translateY(-50%);
        }
        :global(.broadcastScreen_video) {
          width: 100%;
          height: 100%;
          padding: 7px;
          border-radius: 50%;
          background: #3A343A;
        }
        // .pg-bg::before{
        //   content: '';
        //   position: absolute;
        //   left: 0;
        //   top: 0;
        //   right: 0;
        //   bottom: 0;
        //   background: url(https://3.bp.blogspot.com/--hr2gOLnusU/V4QDn1lYBcI/AAAAAAAAAeQ/_wuL5EmDiVYmEdvwphMWFdAKEZOKud-pQCLcB/s1600/Photos%2Bfor%2BYOGA%2Bposes%2B2016.jpg);
        //   background-repeat: no-repeat;
        //   background-size: cover;
        //   background-position: top center;
        // }
        @media (min-width: 700px) and (max-width: 991.98px){
          .video__player__live {
            width: 80vw !important;
          }
        }
      `}</style>
    </>
  );
};

export default LiveStreamVideo;
