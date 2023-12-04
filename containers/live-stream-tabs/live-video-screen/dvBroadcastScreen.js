import React from 'react';
import Router from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import useLang from '../../../hooks/language'
import VisibilityIcon from "@material-ui/icons/Visibility";
import * as config from '../../../lib/config';
import { getCurrentStreamAnalytics, leaveCurrentStream, postMessageAction, stopCurrentStreamAction, viewerJoinedStream, viewerLeftStream } from '../../../redux/actions/liveStream/liveStream';
import { getCurrentStreamMessagesHook, getCurrentStreamUserInfoHook } from '../../../hooks/liveStreamHooks';
import { fancyTimeFormat } from '../../../lib/liveStream';
import { textdecode, textencode } from '../../../lib/chat';
import AvatarImage from '../../../components/image/AvatarImage';
import { close_drawer, getTransformedImageUrl, open_dialog, open_drawer, startLoader, stopLoader, Toast } from '../../../lib/global';
import { UnSubscribeIsometrikTopic, addNewViewerStream, animateBroadcasterStream, removeThisViewerStream, subscribeTopic } from '../../../lib/rxSubject';
import Heart from '../LikeComponent/Heart';
import Icon from '../../../components/image/icon';
import { s3ImageLinkGen } from '../../../lib/UploadAWS/uploadAWS';
import { Picker } from 'emoji-mart';
import { CoinPrice } from '../../../components/ui/CoinPrice';
import Button from '../../../components/button/button';
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import { removeCookie } from '../../../lib/session';

const DVBroadcastScreen = (props) => {
  const intervalIDRef = React.useRef(null);
  const commentBoxRef = React.useRef(null);
  const { videoBoxRef, streamStarted, streamId, stopStreaming, stopDevices, enableCam, profileData, startTime, heartCount = 1, isScheduleStream = false, STREAM_SERVICE, room, resolutionToShow } = props;
  const dispatch = useDispatch();
  const [lang] = useLang()
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
  const [messages] = getCurrentStreamMessagesHook();
  const [comments, setComments] = React.useState([]);
  const [commentText, setCommentTxt] = React.useState('');
  const [tipAnimArr, setTipAnimArr] = React.useState([]);
  const [hearts, setHearts] = React.useState([]);
  const [timer, setTimer] = React.useState(null);
  const [tipReceived, setTipReceived] = React.useState(0);
  const [liveAudioMute, setLiveAudioMute] = React.useState(false);
  const [liveVideoMute, setLiveVideoMute] = React.useState(false);
  const [chatHidden, setIsChatHidden] = React.useState(false);
  const [viewersList] = getCurrentStreamUserInfoHook(false);
  const [showEmoji, togglePicker] = React.useState(false);
  const [animIndex, setAnimIndex] = React.useState(0)
  let animateSubscribeVar;
  let addViewerStreamVar;
  let removeViewerStreamVar;
  let bgTimeOut;
  let ntimeout;

  React.useEffect(() => {
    togglePicker(false);
    if (!streamStarted) return;
    if (messages.data.length) {
      const messagesToSet = messages.data.map((message) => ({ username: message.senderName || message.sender_identifier || message.senderIdentifier, message: textdecode(message.body), id: message.sentat || message.timestamp }));
      setComments(messagesToSet);
    }
  }, [messages.data]);

  React.useEffect(() => {
    if (timer) return;
    if (startTime) setTimer(+((new Date().getTime() - startTime) / 1000).toFixed(0));
  }, [startTime]);

  React.useEffect(() => {
    if (comments.length) {
      const scrollHeight = commentBoxRef.current?.scrollHeight;
      if (commentBoxRef.current) commentBoxRef.current.scrollTop = scrollHeight;
    }
  }, [comments]);

  React.useEffect(() => {
    if (streamStarted) {
      subscribeTopic.next(config.MQTT_TOPIC.streamSentTip + '/' + streamId);
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
      // animateBroadcasterStream.subscribe((action) => {
      //   console.log('Action Recieved ==>>', action);
      //   if (action.type === 'LIKED') {
      //     // DO LIKE ANIMATION
      //     animateLike();
      //   } else if (action.type === 'GOT TIP') {
      //     addTipGIF(action.data);
      //   }
      // })

      intervalIDRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      clearInterval(intervalIDRef.current);
      animateSubscribeVar?.unsubscribe?.();
      addViewerStreamVar?.unsubscribe?.();
      removeViewerStreamVar?.unsubscribe?.();
    }
  }, [streamStarted]);

  React.useEffect(() => {
    if (tipAnimArr?.length === animIndex) return
    const timeout = setTimeout(() => {
      setAnimIndex(prev => prev + 1)
    }, 3000);

    return () => clearTimeout(timeout)
  }, [animIndex, tipAnimArr.length])

  const handleViewersList = () => {
    if (!viewersList?.length) return;
    open_dialog("STREAM_VIEWER_LIST", { streamId, creator: true });
  };

  const handleSendComment = (e) => {
    e.preventDefault();
    setCommentTxt('');
    dispatch(postMessageAction(textencode(commentText), streamId));
    togglePicker(false);
  }


  const handleCloseStreamAPICall = async () => {
    // startLoader();
    if (STREAM_SERVICE === "LiveKit") {
      room.disconnect() 
    }
    removeCookie("activeStreamId")
    clearInterval(intervalIDRef.current);
    dispatch(stopCurrentStreamAction(streamId, () => {
      stopStreaming();
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
      isScheduleStream && close_drawer();
    }));
    UnSubscribeIsometrikTopic.next(config.ISOMETRIK_MQTT_TOPICS.NewMessageEvent + streamId)
  }

  const handleLiveStreamCancel = () => {
    open_dialog('LiveStreamCancel', {
      handleCloseStream: handleCloseStreamAPICall
    });
  }

  const handleShare = () => {
    open_dialog('SHARE_ITEMS', {
      shareType: 'stream',
      streamId
    })
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
        sentAmout: `${data.transferedAmount}`
      }]
    ));
  };

  const handleSettings = (settingType) => {
    switch (settingType) {
      case 'TOGGLE_AUDIO':
        if (STREAM_SERVICE === "LiveKit") {
          toggleAudio(room)
          setLiveAudioMute(!liveAudioMute)
        } else {
          if (window?.stream?.getAudioTracks()[0]) window.stream.getAudioTracks()[0].enabled = liveAudioMute;
          setLiveAudioMute(!liveAudioMute)
        }
        break;
      case 'TOGGLE_VIDEO':
        if (STREAM_SERVICE === "LiveKit") {
          toggleVideo(room)
          setLiveVideoMute(!liveVideoMute)
        }
        else {
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
        const trackPublication = await room.localParticipant.setCameraEnabled(true);
        if (trackPublication && trackPublication.videoTrack) {
          const videoTrack = trackPublication.videoTrack;
          videoTrack.attach(videoBoxRef.current);
        }
      } else {
        room.localParticipant.setCameraEnabled(false);
        const videoElement = videoBoxRef.current;
        if (videoElement) {
          videoElement.srcObject = null;
        }
      }
      setLiveVideoMute(!liveVideoMute);
    }
  };

  const openBroadcastSettings = () => {
    open_dialog('STREAM_SETTINGS', { audioDisabled: liveAudioMute, chatHidden: chatHidden, videoDisabled: liveVideoMute, handleSettings });
  }

  const handleEnterPress = (e) => {
    if (e.key !== "Enter") return
    e.preventDefault()
    handleSendComment(e)
  }


  return (
    <>
      <div className="broadcastScreen_video position-relative go-live-body">
        {/* {tipAnimArr.length ? tipAnimArr.map((item) => (
          <div key={item.key} className="d-flex flex-column align-items-center justify-content-center" style={{ position: 'absolute', top: `${item.top}%`, right: `${item.right}%`, zIndex: 2, fontFamily: 'Roboto', color: 'beige' }}>
            <img src={config.GO_LIVE_SCREEN.tipSentGif} onLoad={handleAnimEvent} className="my-n5" width={200} alt="TIP SENT ANIMATION" />
            {item.senderName} sent {item.sentAmout}
          </div>
        )) : <></>} */}
        {!!tipAnimArr.length && tipAnimArr?.[animIndex] && <div key={tipAnimArr[animIndex].key} className="d-flex flex-column align-items-center justify-content-center" style={{ position: 'absolute', top: `${tipAnimArr[animIndex].top}%`, right: `${tipAnimArr[animIndex].right}%`, zIndex: 100, fontFamily: 'Roboto', color: 'beige', fontSize: '14px' }}>
          <img src={config.GO_LIVE_SCREEN.tipSentGif} className="my-n5" width={150} alt="TIP SENT ANIMATION" />
          {tipAnimArr[animIndex].senderName} sent <CoinPrice price={tipAnimArr[animIndex].sentAmout} size="14" showCoinText={false} iconSize={14} />
        </div>}
        {streamStarted && (
          <>
            <Button
              type="button"
              fclassname='gradient_bg rounded-pill py-3 d-flex align-items-center justify-content-center text-white createBtn dv_stream_close'
              btnSpanClass='text-white'
              btnSpanStyle={{ lineHeight: '0px', paddingTop: '2.5px' }}
              onClick={handleLiveStreamCancel}
              children={lang.endStream}
            />


            <div className="dv_broadcast_tip d-flex align-items-center">
              <CoinPrice price={tipReceived} size="16" showCoinText={false} iconSize={17} />
            </div>

            <div
              className="d-flex viewerList_viewerScreen cursor-pointer"
              onClick={handleViewersList}
            >

              <div className="d-flex position-absolute viewer_count_screen viewer_box">
                <VisibilityIcon style={{ width: "13px" }} />{" "}
              </div>
            </div>

            <div
              className="d-flex dv_stream_info"
            >
              {profileData?.profilePic ? (
                <img
                  src={s3ImageLinkGen(S3_IMG_LINK, profileData?.profilePic, null, 40, 40)}
                  className="userProfileImgClass"
                />
              ) : (
                <AvatarImage
                  isCustom={true}
                  className="userProfileImgClass"
                  userName={profileData?.username}
                />
              )}

              <div className="col-auto pl-2">
                <p className="m-0 userNameCss font-weight-600">
                  {profileData?.username || "Username"}
                </p>
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
              </div>

              {/* <div className="col-auto ml-auto p-0">
              <img
                src={config.GO_LIVE_SCREEN.plusBlueIco}
                width={37}
                height={37}
              />
            </div> */}
            </div>

            <div className="input_position col-12 d-flex">
              <form
                className={`position-relative h-auto mt-auto ${chatHidden ? 'd-none' : ''}`}
                onSubmit={handleSendComment}
                style={{ zIndex: "9" }}
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
                    className="rec rec-pagination position-relative"
                    style={{ bottom: "100%", zIndex: "2" }}
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
                <img
                  className="cursor-pointer emojiPos "
                  onClick={() => togglePicker((prev) => !prev)}
                  src={config.IMOGI}
                  style={{
                    position: "absolute",
                    bottom: "12px",
                    left: "10px",
                    zIndex: 25
                  }}
                />
                <TextareaAutosize
                  type="text"
                  placeholder={"Say Something…"}
                  value={commentText}
                  rows={1}
                  rowsMax={4}
                  id="post-caption"
                  onFocus={() => togglePicker(false)}
                  onKeyPress={handleEnterPress}
                  className="py-2 inputCss"
                  onChange={(e) => setCommentTxt(e.target.value)}
                />
              </form>
              <div className="col-auto justify-content-end d-flex flex-column px-0 ml-auto">
                {props.isRotateEnable && <li
                  className="nav-item cursor-pointer go-live-live-option rounded-circle d-inline-flex align-items-center justify-content-center">
                  <img className="go-live-friends-invite-ico" id="rotate_camera_ico" src={config.GO_LIVE_SCREEN.photoCamera} />
                </li>}
                <div className="mt-3 position-relative" onClick={handleShare}>
                  <img className="cursor-pointer" src={config.SHARE_IMG} alt="share icon" />
                  {hearts.map(({ id, color }) => (
                    <Heart key={id} color={color} removeHeart={removeHeart} />
                  ))}
                </div>
                <div className="mt-3 position-relative" onClick={openBroadcastSettings}>
                  <div className="settings_ico d-flex align-items-center justify-content-center">
                    <Icon
                      icon={`${config.SETTINGS}#subscription_settings`}
                      color="#ffffff"
                      height={22}
                      width={22}
                      class="cursorPtr d-flex align-items-center justify-content-center"
                      viewBox="0 0 17.235 17.23"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={`comment__sec pl-3 ${chatHidden ? 'd-none' : ''}`} ref={commentBoxRef}>
              {comments?.length ? comments.map((comment, index) => (
                <p key={comment.id || index}><span><b style={{ color: 'bisque' }}>{comment.username}</b> : {comment.message}</span></p>
              )) : <> </>}
            </div>
          </>
        )}

        <video
          ref={videoBoxRef}
          controlsList="nodownload"
          muted={true}
          playsInline
          className="video__player__live dv__video_check"
        />
        <div>

        </div>
      </div>
      <style jsx="true">
        {`
        .broadcastScreen_video {
          width: 100%;
          height: 100vh;
          background: #3A343A;
        }
        :global(.dv_broadcast_tip){
          display: flex;
          align-items: center;
          gap: 8px;
        }

        :global(.video__player__live) {
          position: absolute;
          height: 100vh;
          ${streamStarted ? `aspect-ratio:${resolutionToShow.width / resolutionToShow.height};` : `width: 33vw;`}
          z-index: 0;
          background:${liveVideoMute && "black"}
        }
        .dv__video_check {
          object-fit: ${streamStarted ? "contain" : "cover"};
          left: 50%;
          transform: translateX(-50%);
        }
        :global(.dv_stream_close) {
          position: absolute;
          background: #00000070;
          border-radius: 50%;
          height: 33px;
          width:fit-content;
          padding: 8px 25px;
          cursor: pointer;
          left: 15px;
          top: 15px;
          z-index:1;
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
        .go-live-live-option {
          width: 45px;
          height: 45px;
          background-color: #00000069;
        }
        :global(.userProfileImgClass) {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1px solid white;
        }

        .userNameCss {
          color: white;
          font-size: 12px;
        }

        .liveLabelCss {
          color: #fff;
          background: #f22a2a;
          font-size: 11px;
        }
        .input_position {
          position: absolute;
          bottom: 15px;
        }
        :global(.inputCss) {
          border: none;
          border-radius: 23px;
          padding-left: 45px;
          width: 100%;
          padding-right: 13px;
          max-width: 26.962vw;
          min-width:22vw;
          z-index: 9;
          position: relative;
        }


        .comment__sec{
          // -webkit-mask-image: linear-gradient(180deg,rgba(0,0,0,.0001),#000 27.12%,#000 97.12%);
          // mask-image: linear-gradient(180deg,rgba(0,0,0,.0001),#000 27.12%,#000 97.12%);
          position: absolute;
          bottom: 65px;
          max-height: 300px;
          align-self: flex-end;
          overflow: hidden;
          overflow-y: auto;
        }
  
        .comment__sec::-webkit-scrollbar {
          display: none !important;
        }
  
        .comment__sec {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
  
        .comment__sec p{
          margin-bottom: 0 !important;
          position: relative;
          z-index: 7;
        }
  
        .comment__sec p span{
          color: #ffffff;
          font-size: 12px;
          font-family: 'Roboto',sans-serif !important;
          margin-bottom: 5px;
          background-color: rgb(0 0 0 / 50%);
          padding: 4px 13px;
          border-radius: 20px;
          display: inline-block;
          max-width: 31vw;
          word-break:break-word;
        }

        .viewerList_viewerScreen {
          position: absolute;
          top: 40px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1;
        }
        .viewer_box{
          border: 1px solid white;
          padding: 3px 8px;
          border-radius: 6px;
          background: #3531315e;
        }

        :global(.stream_viewer_pic) {
          width: 34px;
          height: 34px;
          border: 1px solid white;
          margin-left: -17px;
        }

        .settings_ico {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          background-color: #171517;
        }

        .viewer_count_screen {
          bottom: 100% ;
          font-family: "Roboto";
          color: white;
          font-size: 12px;
          align-items: center;
          left: calc(50% - 13px);
        }
        .dv_broadcast_tip {
          position: absolute;
          right: 1rem;
          top: 1rem;
          font-family: "Roboto";
          color: white;
          font-size: 12px;
        }
  
        @media (min-width: 700px) and (max-width: 991.98px){
          .video__player__live {
            width: 80vw !important;
          }
        }
        `}
      </style>
    </>
  )
}

export default DVBroadcastScreen;
