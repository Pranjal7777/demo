import Router from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AvatarImage from '../../../components/image/AvatarImage';
import { getCurrentStreamMessagesHook, getCurrentStreamUserInfoHook } from '../../../hooks/liveStreamHooks';
import { textdecode, textencode } from '../../../lib/chat';
import { GO_LIVE_SCREEN, MQTT_TOPIC, sendMessageIcon, } from '../../../lib/config';
import { close_drawer, open_drawer, startLoader, stopLoader, Toast } from '../../../lib/global';
import { fancyTimeFormat } from '../../../lib/liveStream';
import VisibilityIcon from "@material-ui/icons/Visibility";
import { addNewViewerStream, animateBroadcasterStream, currVideoDevId, localVideoCamera, removeThisViewerStream, subscribeTopic, switchCamera, unsubscribeTopic } from '../../../lib/rxSubject';
import { s3ImageLinkGen } from '../../../lib/UploadAWS/uploadAWS';
import { getCurrentStreamAnalytics, leaveCurrentStream, postMessageAction, stopCurrentStreamAction, viewerJoinedStream, viewerLeftStream } from '../../../redux/actions/liveStream/liveStream';
import { getStreamDetailAPI } from '../../../services/liveStream';
import StreamEndedOverlay from '../../drawer/LiveStreamVideo/streamEndedOverlay';
import Heart from '../LikeComponent/Heart';
import WarnBroadcaster from './warnBroadcaster';
import useLang from '../../../hooks/language';
import BrodcastAttention from './BrodcastAttention';
import { STREAM_SERVICE } from '../../../lib/config/creds';
import Icon from '../../../components/image/icon';
import { CoinPrice } from '../../../components/ui/CoinPrice';
import Button from '../../../components/button/button';
import { createLocalVideoTrack } from 'livekit-client';
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import { removeCookie } from '../../../lib/session';

const liveVideoScreen = (props) => {
  const intervalIDRef = useRef(null);
  const { streamData, videoBoxRef, enableCam, startStreaming, stopStreaming, stopDevices, switchCam, heartCount = 1, handleInfoLog, isScheduleStream = false } = props;
  const { streamId, ingestEndpoint, streamKey, startTime } = streamData;
  const dispatch = useDispatch();
  const [viewersList] = getCurrentStreamUserInfoHook(false);
  const [liveAudioMute, setLiveAudioMute] = useState(false);
  const [liveVideoMute, setLiveVideoMute] = useState(false);
  const [chatHidden, setIsChatHidden] = useState(false);
  const [isWarned, setIswarned] = React.useState(false);
  const [isNoteShown, setIsNoteShown] = React.useState(false);
  const [streamActive, setStreamActive] = React.useState(true);
  const commentBoxRef = useRef(null);
  const [messages] = getCurrentStreamMessagesHook();
  const [comments, setComments] = React.useState([]);
  const profileData = useSelector(state => state.profileData);
  // const IMAGE_LINK = useSelector((state) => state?.cloudinaryCreds?.IMAGE_LINK);
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
  const [timer, setTimer] = useState(+((new Date().getTime() - startTime) / 1000).toFixed(0))
  const [commentText, setCommentTxt] = React.useState('');
  const [tipAnimArr, setTipAnimArr] = React.useState([]);
  const [hearts, setHearts] = React.useState([]);
  const [tipReceived, setTipReceived] = React.useState(0);
  const [mobileRoom, setMobileRoom] = useState({})
  const [lang] = useLang()
  const [animIndex, setAnimIndex] = useState(0)
  const [resolutionToShow, setResolutionToShow] = useState({
    width: 0,
    height: 0
  })
  const autoSizerRef = React.useRef(null)
  const [adjustAutoSizer, setAutoSizer] = useState(false)
  const [localVideoCam, setCam] = useState(null)
  const [facing, setFacing] = useState(props.selectedFacingMode)
  const [isRotateEnable, setRotateEnable] = useState(false)
  const [vDevId, setVDevId] = useState(props.vDevID)
  let animateSubscribeVar;
  let addViewerStreamVar;
  let removeViewerStreamVar;
  let bgTimeOut;
  let ntimeout;

  const checkIsStreamActive = async () => {
    const response = await getStreamDetailAPI(streamId, false);
    if (response.data.stream?.[0]?.isStreamActive == false) {
      setStreamActive(false);
      stopStreaming();
      Toast('Stream got disconnected due to some issues.', 'warning');
    }
  };
  const broadcast = new BroadcastChannel('stream-channel');
  const handleVisibilityChange = () => {
    if (!document.hidden && streamActive) { // Means App came foreground from background
      checkIsStreamActive();
    }    
    if (document.hidden && streamActive) {
      broadcast.postMessage({type: "browser_closed", visibility: document.visibilityState})
      broadcast.onmessage = (e) => {
        if(e.data && e.data.type === "checkIsActive") {
          broadcast.postMessage({type: "streamActive", status: streamActive})
        }
      }
      if (window?.stream?.getVideoTracks()[0]) window.stream.getVideoTracks()[0].enabled = false;
      if (window?.stream?.getAudioTracks()[0]) window.stream.getAudioTracks()[0].enabled = false;
      if(!bgTimeOut) {
       bgTimeOut = setTimeout(() => {
         handleCloseStreamAPICall();
       }, 60000);
      }
       if(!ntimeout) {
       ntimeout = setTimeout(() => {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations[0].showNotification("Attention!", {
            body: lang.endBgNotify,
            icon: "/notification-icon.png",
            badge:"/notification-icon.png",
          })
        })
       }, 30000);
     }
     } else {
      if (!liveVideoMute) {
        if (window?.stream?.getVideoTracks()[0]) window.stream.getVideoTracks()[0].enabled = true;
      }
      if (!liveAudioMute) {
        if (window?.stream?.getAudioTracks()[0]) window.stream.getAudioTracks()[0].enabled = true;
      }
       if (ntimeout) {
         clearTimeout(ntimeout);
         ntimeout=null;
       }
       if (bgTimeOut) {
         clearTimeout(bgTimeOut);
         bgTimeOut=null;
       }
     }
  };

  React.useEffect(() => { 
    document.addEventListener("visibilitychange", handleVisibilityChange, false);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    }
  }, [streamActive, liveVideoMute, liveAudioMute]);

  const setDimensionCallBack = (videoTrackDetails) => {
    setResolutionToShow(videoTrackDetails)
    stopLoader()
  }
  React.useEffect(() => {
    startLoader()
    startStreaming(ingestEndpoint, streamKey, setMobileRoom, setDimensionCallBack)
    subscribeTopic.next(MQTT_TOPIC.streamSentTip + '/' + streamId);
    addViewerStreamVar = addNewViewerStream.asObservable().subscribe((viewer) => viewer.streamId == streamId && dispatch(viewerJoinedStream(viewer)));
    removeViewerStreamVar = removeThisViewerStream.asObservable().subscribe((viewer) => viewer.streamId == streamId && dispatch(viewerLeftStream(viewer)));
    animateSubscribeVar = animateBroadcasterStream.asObservable().subscribe((action) => {
      console.log('Action Recieved ==>>', action);
      if (action.type === 'LIKED') {
        // DO LIKE ANIMATION
        animateLike();
      } else if (action.type === 'GOT TIP') {
        addTipGIF(action.data);
        setTipReceived((prev) => (+prev + +action.data.transferedAmount));
      }
    })

    intervalIDRef.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(intervalIDRef.current);
      animateSubscribeVar?.unsubscribe?.();
      addViewerStreamVar?.unsubscribe?.();
      removeViewerStreamVar?.unsubscribe?.();
      unsubscribeTopic.next(MQTT_TOPIC.streamSentTip + '/' + streamId);
    }
  }, []);

  useEffect(async () => {
    localVideoCamera.subscribe((data) => {
      setCam(data)
    })
    currVideoDevId.subscribe((id) => {
      setVDevId(id)
    })
    try {
      const device = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = device.filter(device => device.kind === 'videoinput');
      if (videoDevices.length > 0) {
        setRotateEnable(true)
      }
    } catch (error) {
      console.log(error, "error")
    }
  }, [])

  useEffect(() => {
    if (autoSizerRef.current.scrollHeight >= 70) {
      setAutoSizer(true)
    }
    if (!commentText?.length) setAutoSizer(false)
  }, [commentText])

  const handleCam = async () => {
    localVideoCam.stop()
    await mobileRoom.localParticipant.unpublishTrack(localVideoCam)
    const localVideoTrack = await createLocalVideoTrack({
      facingMode: facing == "user" ? 'environment' : 'user',
      video: { width: { ideal: 1920 }, height: { ideal: 1080 } }
    });
    setCam(localVideoTrack)
    await mobileRoom.localParticipant.publishTrack(localVideoTrack);
    setFacing(prev => prev == "user" ? 'environment' : 'user')
    switchCamera.next(localVideoTrack)
  }


  React.useEffect(() => {
    if (messages.data.length) {
      const messagesToSet = messages.data.map((message) => ({ username: message.senderName || message.sender_identifier || message.senderIdentifier, message: textdecode(message.body), id: message.sentat || message.timestamp }));
      setComments(messagesToSet);
    }
  }, [messages.data]);

  React.useEffect(() => {
    if (comments.length) {
      const scrollHeight = commentBoxRef.current?.scrollHeight;
      if (commentBoxRef.current) commentBoxRef.current.scrollTop = scrollHeight;
    }
  }, [comments]);

  React.useEffect(() => {
    if (tipAnimArr?.length === animIndex) return
    const timeout = setTimeout(() => {
      setAnimIndex(prev => prev + 1)
    }, 3000);

    return () => clearTimeout(timeout)
  }, [animIndex, tipAnimArr.length])

  const handleCloseStreamAPICall = () => {
    startLoader();
    clearInterval(intervalIDRef.current);
    dispatch(stopCurrentStreamAction(streamId, () => {
      stopStreaming();
      removeCookie("activeStreamId")
      stopLoader();
      dispatch(getCurrentStreamAnalytics(streamId, () => {
        open_drawer('STREAM_ENDED', {
          profilePic: profileData?.profilePic ? s3ImageLinkGen(S3_IMG_LINK, profileData.profilePic, null, 75, 75) : null,
          userName: profileData.username,
          isScheduleStream
        }, 'bottom');
      }))
    }, () => {
      stopStreaming();
      stopLoader();
      dispatch(leaveCurrentStream());
      Toast('Stream Is Already Stopped', 'warning');
      Router.push('/live/popular');
      close_drawer();
    }));
  }

  const handleStopppedStreamClose = () => {
    dispatch(leaveCurrentStream());
    Router.push('/live/popular');
    close_drawer();
  };

  const handleLiveStreamCancel = () => {
    open_drawer('LiveStreamCancel', {
      handleCloseStream: handleCloseStreamAPICall
    }, 'bottom');
  }

  const handleSendComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setCommentTxt('');
    dispatch(postMessageAction(textencode(commentText), streamId));
  }

  const handleViewersList = () => {
    if (viewersList.length) {
      open_drawer('STREAM_VIEWER_LIST', { streamId, creator: true }, 'bottom');
    }
  }

  const handleShare = () => {
    open_drawer('SHARE_ITEMS', {
      shareType: 'stream',
      streamId
    }, "bottom");
  };


  const animateLike = () => {
    for (let i = 0; i < heartCount; i++) {
      setTimeout(() => {
        setHearts((hearts) => [...hearts, {
          id: Date.now(),
          color: 'red'
        }]);
      }, i * 200);
    }
  };

  const removeHeart = () => {
    const activeHearts = [...hearts];
    activeHearts.shift();

    setHearts(activeHearts);
  };

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

  const addTipGIF = (data) => {
    setTipAnimArr((prev) => (
      [...prev, {
        key: data.sentAt,
        top: 20,
        right: 10,
        senderName: data.senderName,
        sentAmout: `${symbolReturn(data.currencyCode)}${data.transferedAmount}`
      }]
    ));
  };

  const handleSettings = (settingType) => {
    switch (settingType) {
      case 'TOGGLE_AUDIO':
        if (STREAM_SERVICE === "LiveKit") {
          toggleAudio(mobileRoom)
          setLiveAudioMute(!liveAudioMute)
        } else {
          if (window?.stream?.getAudioTracks()[0]) window.stream.getAudioTracks()[0].enabled = liveAudioMute;
          setLiveAudioMute(room)
        }
        break;
      case 'TOGGLE_VIDEO':
        if (STREAM_SERVICE === "LiveKit") {
          toggleVideo(mobileRoom)
          setLiveVideoMute(!liveVideoMute)
          if (window?.stream.getVideoTracks()[0]) window.stream.getVideoTracks()[0].enabled = liveVideoMute;
        }
        else {
          if (window?.stream.getVideoTracks()[0]) window.stream.getVideoTracks()[0].enabled = liveVideoMute;
          setLiveVideoMute(!liveVideoMute);
        }
        break;
      case 'TOGGLE_CHAT':
        setIsChatHidden(!chatHidden);
        break;
      default:
        break;
    };
  };

  const toggleAudio = async (room) => {
    if (room) {
      if (liveAudioMute) {
        room.localParticipant.setMicrophoneEnabled(true)
      } else {
        room.localParticipant.setMicrophoneEnabled(false)
      }
      setLiveAudioMute(!liveAudioMute)
    }
  };

  const toggleVideo = async (room) => {
    if (room) {
      if (liveVideoMute) {
        room.localParticipant.setCameraEnabled(true)
      } else {
        room.localParticipant.setCameraEnabled(false)
      }
      setLiveVideoMute(!liveVideoMute)
    }
  };

  const openBroadcastSettings = () => {
    open_drawer('STREAM_SETTINGS', { audioDisabled: liveAudioMute, chatHidden: chatHidden, videoDisabled: liveVideoMute, handleSettings }, 'bottom');
  };

  const handleEnterPress = (e) => {
    if (e.key !== "Enter") return
    e.preventDefault()
    handleSendComment(e)
  }

  return (
    <>
      {!streamActive && <StreamEndedOverlay hostData={{ userProfileImageUrl: profileData.profilePic }} handleStopppedStreamClose={handleStopppedStreamClose} endTitle="Stream Disconnected" />}
      <div className="go-live-body w-100 h-100 position-relative">
        {/* {tipAnimArr.length ? tipAnimArr.map((item, index) => (
          <div hidden={((new Date().valueOf() - (item.onLoadTime * (index + 1))) >= 6500)} key={item.key} className="d-flex flex-column align-items-center justify-content-center" style={{ position: 'absolute', top: `${item.top}%`, right: `${item.right}%`, zIndex: 100, fontFamily: 'Roboto', color: 'beige', fontSize: '14px' }}>
            <img src={GO_LIVE_SCREEN.tipSentGif} onLoad={handleAnimEvent} className="my-n5" width={150} alt="TIP SENT ANIMATION" />
            {item.senderName} sent {item.sentAmout}
          </div>
        )) : <></>} */}
        {!!tipAnimArr.length && tipAnimArr?.[animIndex] && <div key={tipAnimArr[animIndex].key} className="d-flex flex-column align-items-center justify-content-center" style={{ position: 'absolute', top: `${tipAnimArr[animIndex].top}%`, right: `${tipAnimArr[animIndex].right}%`, zIndex: 100, fontFamily: 'Roboto', color: 'beige', fontSize: '14px' }}>
          <img src={GO_LIVE_SCREEN.tipSentGif} className="my-n5" width={150} alt="TIP SENT ANIMATION" />
          {tipAnimArr[animIndex].senderName} sent {tipAnimArr[animIndex].sentAmout}
        </div>}
        <video id="video__player__live" playsInline ref={videoBoxRef} muted autoPlay></video>
        {/* <!-- Top Header and Overlay Part --> */}
        <div className="go-live-bg-overlay-top position-absolute">
          <header className="go-live-top-section pt-4 px-3">
            <ul className="nav">
              <li className="nav-item go-live-user-profile d-inline-flex mr-3">
                {
                  profileData?.profilePic ? (
                    <img src={s3ImageLinkGen(S3_IMG_LINK, profileData.profilePic, null, '11vw', '11vw')} className="go-live-prof-logo rounded-circle" />
                  ) : (
                    <AvatarImage className="go-live-prof-logo rounded-circle" userName={profileData.username} />
                  )
                }
                <div className="go-live-prof-name-n-followers text-white ml-2 d-flex align-items-center">
                  <div className="go-live-prof-name">{profileData.username}</div>
                </div>
              </li>
              <li className="nav-item go-live-top-viewers ml-auto position-relative d-flex m-auto" style={{ height: "32px" }} onClick={handleViewersList}>
                <div className="d-flex position-absolute viewer_count_screen viewer_box">
                  <VisibilityIcon style={{ width: "13px" }} />{" "}
                </div>
                {/* <div className="go-live-other-viewers-prof-drawer rounded-circle customClass">
                  <img src={GO_LIVE_SCREEN.menuDrawer} className="go-live-top-viewers-drawer-ico w-100 h-100" />
                </div>
                {
                  viewersList.length ? viewersList?.slice(-6).map((viewer, index) => (
                    <div className="go-live-other-viewers-prof-logo" key={viewer.viewerId} style={{ zIndex: 6 - index }}>
                      {
                        viewer?.viewerProfilePic ? (
                          <img src={viewer.viewerProfilePic}
                            className="go-live-top-viewers-profile-pic rounded-circle" />
                        ) : (
                          <AvatarImage isCustom={true} className="go-live-top-viewers-profile-pic rounded-circle" userName={viewer?.viewerName} />
                        )
                      }
                    </div>
                  )) : <></>
                } */}
              </li>
              <li className="nav-item align-self-center">
                <Button
                  type="button"
                  fclassname='gradient_bg rounded-pill py-3 d-flex align-items-center justify-content-center text-white createBtn'
                  btnSpanClass='text-white'
                  btnSpanStyle={{ lineHeight: '0px', paddingTop: '2.5px' }}
                  onClick={handleLiveStreamCancel}
                  children={lang.endStream}
                />
              </li>
            </ul>
            <ul className="nav go-live-live-section pt-3 align-items-center" style={{ flexWrap: "inherit" }}>
              <li className="nav-item go-live-live-icon py-1 px-2">
                <div className="go-live-live-txt text-white">LIVE</div>
              </li>
              <li className="nav-item go-live-live-time text-white ml-2 mr-3">{fancyTimeFormat(timer)}</li>
              <li className="nav-item go-live-live-coin-gifted text-white d-inline-flex">
                <CoinPrice price={tipReceived} size="17" showCoinText={false} iconSize={17} />
              </li>
            </ul>
          </header>
        </div>

        {/* <!-- Bottom Part and it's Overlay --> */}
        <div className="go-live-bg-overlay-bottom position-absolute">
          <div className="go-live-bottom-cnts w-100 position-absolute pl-3 pb-3">
            {/* <!-- Side Options  --> */}
            <ul className="nav flex-column go-live-live-all-options justify-content-around position-absolute">
              {/* <li
            className="nav-item go-live-live-option rounded-circle d-inline-flex align-items-center justify-content-center position-relative">
            <img className="go-live-friends-invite-ico" id="friends_ico" src={GO_LIVE_SCREEN.friendsIco}/>
            <div className="go-live-num-of-rqst text-white d-inline-flex align-items-center justify-content-center position-absolute rounded-circle">5</div>
          </li>
          <li
            className="nav-item go-live-live-option rounded-circle d-inline-flex align-items-center justify-content-center">
            <img src={GO_LIVE_SCREEN.emoji} id="emoji_ico" className="go-live-friends-invite-ico"/>
          </li>
          <li
            className="nav-item go-live-live-option rounded-circle d-inline-flex align-items-center justify-content-center">
            <img className="go-live-friends-invite-ico" id="beautify_ico" src={GO_LIVE_SCREEN.beautifyIco}/>
          </li> */}
              <li
                onClick={openBroadcastSettings}
                className="nav-item go-live-live-option rounded-circle d-inline-flex align-items-center justify-content-center">
                <img className="go-live-friends-invite-ico" id="settings_ico" src={GO_LIVE_SCREEN.settingIco} />
              </li>
              <li
                className="nav-item go-live-live-option position-relative rounded-circle d-inline-flex align-items-center justify-content-center">
                <img className="go-live-friends-invite-ico" id="share_ico" src={GO_LIVE_SCREEN.shareIco} onClick={handleShare} />
                {hearts.map(({ id, color }) => (
                  <Heart key={id} color={color} removeHeart={removeHeart} />
                ))}
              </li>
              {isRotateEnable && <li
            className="nav-item go-live-live-option rounded-circle d-inline-flex align-items-center justify-content-center">
                <img className="go-live-friends-invite-ico" id="rotate_camera_ico" src={GO_LIVE_SCREEN.photoCamera} onClick={handleCam} />
              </li>}
            </ul>

            {/* <!-- Say Something Comment  --> */}
            <form onSubmit={handleSendComment}>
              <div className={`go-live-say-something-box align-items-center position-absolute ml-1 justify-content-between ${chatHidden ? 'd-none' : 'd-flex'}`}>
                <TextareaAutosize
                  type="text"
                  placeholder={"Say Something…"}
                  value={commentText}
                  ref={autoSizerRef}
                  rows={1.5}
                  rowsMax={3.7}
                  id="post-caption"
                  onKeyPress={handleEnterPress}
                  className="w-100 textArea"
                  onChange={(e) => setCommentTxt(e.target.value)}
                  style={{ paddingTop: "12px", wordBreak: "break-all", marginBottom: adjustAutoSizer && "40px" }}
                />
                {/* <img src={Right_Chevron_Base} onClick={handleSendComment} className="go-live-smile-ico position-absolute" /> */}
                <Icon
                  icon={`${sendMessageIcon}#demo787`}
                  color='var(--l_base)'
                  width={40}
                  height={40}
                  viewBox='0 0 24 24'
                  class="go-live-smile-ico position-absolute"
                  onClick={handleSendComment}
                />
              </div>
            </form>
          </div>
        </div>
        {/* <!-- User Comments Part --> */}
        <div className={`go-live-comment-text-component position-absolute overflow-auto ${chatHidden ? 'd-none' : ''}`} ref={commentBoxRef}>
          <div className="go-live-comment-mask align-self-end position-absolute">
            {
              comments.length ? comments.map((comment) => (
                <div className="go-live-user-comment d-block px-3 py-1 mb-1" key={comment.id} >
                  {/* <li className="nav-item"><img className="go-live-comment-delete-ico" src={GO_LIVE_SCREEN.deleteIco}/></li> */}
                  <b className="nav-item go-live-comment-user-name font-weight-bold text-white ">{comment.username} :</b>
                  <span className="nav-item go-live-user-comment-text ml-2 text-white"> {comment.message}</span>
                </div>
              )) : <></>
            }
            {/* <!-- Request Live Comment  --> */}
            {/* <div className="go-live-request-in-live">
          <ul className="nav go-live-request-in-live-comment align-items-center px-3">
            <li
            className="nav-item position-relative">
            <img src={GO_LIVE_SCREEN.emoji} className="request_live_emoji_ico" />
          </li>
          <li className="nav-item text-white go-live-request-sent-txt ml-4 mt-1">Sona sent a request to be in your live video</li>
          <li className="nav-item go-live-live-request-view-opt font-weight-bold align-self-center ml-auto">View</li>
          </ul>
        </div> */}
          </div>
        </div>
      </div>
      {!isWarned && <WarnBroadcaster handleDone={setIswarned} />}
      {!isNoteShown && isWarned && <BrodcastAttention handleClose={() => {setIsNoteShown(true)}} />}
      <style jsx="true">
        {
          `
      // .go-live-body {
      //   background-image: url("https://livejet.netlify.app/images/bg-image-go-live.jpeg");
      //   background-size: cover;
      //   background-repeat: no-repeat;
      //   z-index: 1;
      // }
      
      /* Header */
      .go-live-bg-overlay-top {
        width: calc(250vw / 2.5);
        height: calc(233.33333333333331vw / 2.5);
        background-image: linear-gradient(180deg, #000000c4, #00000000);
        top: 0;
      }
      
      .go-live-user-profile {
        // width: calc(80vw / 2.5);
        height: calc(26.666666666666664vw / 2.5);
        background-color: #ffffff4d;
        border: calc(0.7000000000000001vw / 2.5) solid #ffffff;
        border-radius: calc(13.333333333333332vw / 2.5);
        padding-right: 1rem;
      }
      :global(.go-live-prof-logo) {
        width: calc(26.666666666666664vw / 2.5);
        border: calc(0.7000000000000001vw / 2.5) solid #ffffff;
      }
      .go-live-prof-name,
      .gol-live-prof-followers {
        font-size: calc(7.33vw / 2.5);
      }
      .go-live-icon-awesome-user {
        width: calc(5.886666666666667vw / 2.5);
        height: calc(6.726666666666667vw / 2.5);
      }
      .go-live-other-viewers-prof-drawer {
        width: calc(26.666666666666664vw / 2.5);
        height: calc(26.666666666666664vw / 2.5);
      }
      
      :global(.go-live-top-viewers-profile-pic) {
        width: calc(26.666666666666664vw / 2.5);
        height: calc(26.666666666666664vw / 2.5);
        border: calc(0.7000000000000001vw / 2.5) solid #ffffff;
      }
      .go-live-other-viewers-prof-logo {
        margin-left: calc(-13.333333332vw / 2.5);
      }
      .go-live-other-viewers-prof-drawer {
        z-index: 7;
      }
      .go-live-close-ico {
        width: calc(10vw / 2.5);
        height: calc(10vw / 2.5);
      }
      .go-live-live-section {
        width: calc(100vw / 2.5);
        height: calc(14vw / 2.5);
      }
      .go-live-live-icon {
        background-color: #f22a2a;
        border-radius: calc(1.333vw / 2.5);
      }
      .go-live-live-txt {
        font-size: calc(6.66vw / 2.5);
        font-weight: 500;
      }
      .go-live-live-time,
      .go-live-live-coin-gifted {
        font-size: calc(8vw / 2.5);
      }
      :global(.go-live-live-coin-gifted .coinprice){
      display:flex;
      align-items:center;
      gap:2px;
      }
      :global(.go-live-live-coin-gifted .coinprice > span){
         margin-top:0 !important;
      }
      .go-live-coin-ico {
        width: calc(10.57vw / 2.5);
        height: calc(10.57vw / 2.5);
      }
      
      /* Bottom */
      .go-live-bg-overlay-bottom {
        width: calc(250vw / 2.5);
        height: calc(224vw / 2.5);
        background-image: linear-gradient(0deg, #000000, #00000000);
        bottom: 0;
      }
      .viewer_box{
        border: 1px solid white;
        padding: 3px 8px;
        border-radius: 6px;
        background: #3531315e;
      }
      .viewer_count_screen {
        bottom: 100% ;
        font-family: "Roboto";
        color: white;
        font-size: 12px;
        align-items: center;
        right: 0px;
        top: 1px;
        height: 100%;
      }
      
      .go-live-bottom-cnts {
        height: calc(266vw / 2.5);
        bottom: 0;
      }
      .go-live-live-all-options {
        width: calc(31.33vw / 2.5);
        height: ${isRotateEnable ? "calc(78.4vw / 1.8)" : "calc(78.4vw / 1.5)"};
        right: calc(10vw / 2.5);
        bottom: calc(46.3vw / 2.5);
      }
      .go-live-live-option {
        width: calc(30vw / 2.5);
        height: calc(30vw / 2.5);
        background-color: #00000069;
      }
      .go-live-num-of-rqst {
        width: calc(11.486vw / 2.5);
        height: calc(11.486vw / 2.5);
        background-color: #f22a2a;
        border: calc(0.66vw / 2.5) solid #fff;
        font-size: calc(7.66vw / 2.5);
        top: calc(-5vw / 2.5);
      }
      
      .go-live-friends-invite-ico#friends_ico {
        width: calc(15.753333333333332vw / 2.5);
        height: calc(11.119000000000002vw / 2.5);
      }
      .go-live-friends-invite-ico#emoji_ico {
        width: calc(18.733999999999998vw / 2.5);
        height: calc(17.24vw / 2.5);
      }
      .go-live-friends-invite-ico#beautify_ico {
        width: calc(14vw / 2.5);
        height: calc(14vw / 2.5);
      }
      .go-live-friends-invite-ico#settings_ico {
        width: calc(12.633000000000001vw / 2.5);
        height: calc(12.633000000000001vw / 2.5);
      }
      .go-live-friends-invite-ico#share_ico {
        width: calc(14vw / 2.5);
        height: calc(9vw / 2.5);
      }
      .go-live-friends-invite-ico#rotate_camera_ico {
        width: calc(17.646vw / 2.5);
        height: calc(14.139999999999999vw / 2.5);
      }
      
      .go-live-say-something-box {
        width: calc(220.66vw / 2.5);
        height: calc(28vw / 2.5);
        bottom: calc(10vw / 2.5);
      }
      :global(.go-live-say-something-box .textArea) {
        background-color: #e9e9e9;
        border: none;
        border-radius: calc(14vw / 2.5);
        padding: 0 calc(13.33vw / 2.5);
        padding-right: calc(35.33vw / 2.5);
      }
      :global(.go-live-say-something-box .textArea:focus) {
        outline: none;
      }
      :global(.go-live-say-something-box .textArea::placeholder) {
        color: #666666;
        font-size: calc(9.333vw / 2.5);
      }
      
      :global(.go-live-smile-ico) {
        width: calc(13.33vw / 2.5);
        right: calc(10vw / 1.5);
      }
      
      .go-live-emoji-react-ico {
        width: calc(13.33vw / 2.5);
        height: calc(13.33vw / 2.5);
      }
      .go-live-emoji-react-options {
        width: calc(181.32999999999998vw / 2.5);
        bottom: calc(48.7vw / 2.5);
      }
      
      /* Comment Text Component */
      
      .request_live_emoji_ico {
        width: calc(15.91vw / 2.5);
        height: calc(14.65vw / 2.5);
      }
      
      .go-live-comment-text-component {
        width: calc(198.67000000000002vw / 2.5);
        height: 37.6vh;
        bottom: calc(43.7vw / 2.5);
        z-index: 9;
        left: calc(10vw / 2.5);
        display: flex;
        align-items: end;
      }
      .go-live-comment-mask {
        max-height: calc(203.4vw / 2.5);
        height: min-content;
      }
      .go-live-request-in-live {
        width: calc(180vw / 2.5);
        height: calc(29.33vw / 2.5);
        background-color: #0000004b;
        border-radius: calc(14vw / 2.5);
      }
      .go-live-request-sent-txt {
        font-size: calc(8vw / 2.5);
        width: 57%;
      }
      .go-live-live-request-view-opt {
        color: #00b3ff;
        font-size: calc(8vw / 2.5);
      }
      .go-live-user-comment {
        width: max-content;
        border-radius: calc(14vw / 2.5);
        background-color: #0000004b;
        max-width: calc(188.67vw / 2.5);
      }
      .go-live-comment-delete-ico {
        width: calc(6.22vw / 2.5);
        height: calc(8vw / 2.5);
      }
      .go-live-comment-user-name {
        font-size: calc(9.333vw / 2.5);
      }
      .go-live-comment-text-component::-webkit-scrollbar {
        display: none !important;
      }
      .go-live-user-comment-text-emoji {
        width: calc(8vw / 2.5);
      }
      // .go-live-user-comment#go-live-comment-1,
      // .go-live-user-comment#go-live-comment-2 {
      //   opacity: 60%;
      // }
      .go-live-user-comment-text {
        font-size: calc(9.33vw / 2.5);
      }
      
      /* Flying Heart Reaction By Users */
      .go-live-heart-reaction-by-users {
        width: calc(38vw / 2.5);
        height: calc(93vw / 2.5);
        bottom: calc(64vw / 2.5);
        right: calc(34vw / 2.5);
        opacity: 50%;
      }
      
      .go-live-flying-heart-emoji-on-screen {
        width: calc(8.67vw / 2.5);
      }
      
      .go-live-flying-heart-circle-div#flying-heart-1 {
        bottom: 0;
        right: calc(4vw / 2.5);
      }
      .go-live-flying-heart-circle-div#flying-heart-2 {
        bottom: calc(5.33vw / 2.5);
        right: calc(12.66vw / 2.5);
      }
      .go-live-flying-heart-circle-div#flying-heart-3 {
        bottom: calc(14vw / 2.5);
        right: calc(6.66vw / 2.5);
      }
      
      .go-live-flying-heart-circle-div#flying-heart-4 {
        bottom: calc(18.700000000000003vw / 2.5);
        right: calc(14vw / 2.5);
      }
      
      .go-live-flying-heart-circle-div#flying-heart-5 {
        bottom: calc(25.33vw / 2.5);
        right: 0;
      }
      
      .go-live-flying-heart-circle-div#flying-heart-6 {
        top: calc(55vw / 2.5);
        right: calc(7vw / 2.5);
      }
      
      .go-live-flying-heart-circle-div#flying-heart-7 {
        top: calc(49.33vw / 2.5);
        right: calc(18vw / 2.5);
      }
      
      .go-live-flying-heart-circle-div#flying-heart-8 {
        top: calc(40.66vw / 2.5);
        right: calc(9.333vw / 2.5);
      }
      
      .go-live-flying-heart-circle-div#flying-heart-9 {
        top: calc(35.33vw / 2.5);
        right: calc(18vw / 2.5);
      }
      
      .go-live-flying-heart-circle-div#flying-heart-9 {
        top: calc(27.330000000000002vw / 2.5);
        right: calc(12vw / 2.5);
      }
      
      .go-live-flying-heart-circle-div#flying-heart-10 {
        top: calc(22.66vw / 2.5);
        right: calc(19.330000000000002vw / 2.5);
      }
      
      .go-live-flying-heart-circle-div#flying-heart-11 {
        top: calc(14.665999999999999vw / 2.5);
        right: calc(15.329999999999998vw / 2.5);
      }
      
      .go-live-flying-heart-circle-div#flying-heart-12 {
        top: calc(6vw / 2.5);
        left: calc(6.6000000000000005vw / 2.5);
      }
      
      .go-live-flying-heart-circle-div#flying-heart-13 {
        top: 0;
        left: 0;
      }
      #video__player__live {
        position: absolute;
        height: calc(var(--vhCustom, 1vh) * 100);
        width:100vw;
        object-fit: contain;
        aspect-ratio:${resolutionToShow.width / resolutionToShow.height};
        // -webkit-transform: scaleX(-1);
        // transform: scaleX(-1);
      }
      `
        }
      </style>
    </>
  )
};

export default liveVideoScreen;
