import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Head from 'next/head';
import Router from "next/router";
import moment from "moment";
import { useTheme } from "react-jss";
import Creatable from 'react-select/creatable';
import { components } from "react-select";
// import TaggedProduct from "../containers/addProducts/taggedProduct";
import { open_drawer, getStreamUserId, Toast, isIOSDevice } from "../../../lib/global";
import * as config from "../../../lib/config";
import ImagePicker from "../../../components/formControl/imagePicker";
import Button from "../../../components/button/button";
import { startLoader, stopLoader, UploadImage } from "../../../lib/global";
import { createNewStream, getLiveStreams, leaveCurrentStream, stopCurrentStreamAction } from "../../../redux/actions/liveStream/liveStream";
import { getCurrentStreamInfoHook } from "../../../hooks/liveStreamHooks";
import isMobile from "../../../hooks/isMobile";
import DVBroadcastScreen from "../../../containers/live-stream-tabs/live-video-screen/dvBroadcastScreen";
import { updateUserStatusAPI } from "../../../services/liveStream";
import { getCognitoToken } from "../../../services/userCognitoAWS";
import { getCookie, removeCookie, setCookie } from "../../../lib/session";
import fileUploaderAWS from "../../../lib/UploadAWS/uploadAWS";
import useLang from "../../../hooks/language"
import Icon from "../../../components/image/icon";
import WarnStateNotConnected from "../live-video-screen/warnStateNotConnected";
import DateRangeOutlinedIcon from '@material-ui/icons/DateRangeOutlined';


import {
  Room,
  createLocalVideoTrack,
  createLocalAudioTrack,
  RoomEvent,
  setLogLevel
} from "livekit-client";
import { FOLDER_NAME_IMAGES, isAgency } from "../../../lib/config/creds";
import { STREAM_SERVICE } from "../../../lib/config/creds";
import { SubscribeIsometrikTopic, currVideoDevId, localVideoCamera, switchCamera } from "../../../lib/rxSubject";
import { DateAndTimePicker } from "../../../components/DateAndTimePicker";
import { PostPlaceHolder } from "../../../components/post/PostPlaceHolder";
import { getFileType } from "../../../lib/helper";
import { close_dialog, close_drawer, open_dialog } from "../../../lib/global/loader";

const Input = props => {
  return <components.Input {...props} type="number" />;
};

const BroadcastPage = ({ isScheduleStream = false, onClose, scheduleStreamData = {} }) => {
  const isomterikStateConnected = useSelector(state => state.liveStream.mqttState.connected);
  const [warnStateIssue, setWarnStateIssue] = useState(false);
  // const recordedChunks = [];
  const theme = useTheme();
  const minPurchasePostVal = useSelector(state => state.appConfig.minStreamValue);
  const maxStreamValue = useSelector(state => state.appConfig.maxStreamValue);
  const videoBoxRef = useRef();
  const mediaRef = useRef();
  const profileData = useSelector(state => state.profileData);
  const [mobileView] = isMobile();
  const wsRef = useRef();
  const mediaRecorder = useRef();
  const [vDevID, setVDevID] = useState(""); // To Mange Video Device ID
  const [aDevID, setADevID] = useState(""); // To Manage Audio Device ID
  const [devices, setDevices] = useState({ videoin: [], audioin: [] });
  const [isHdEnable, setHdEnable] = useState(false);
  const [scheduleTime, setScheduleTime] = useState(null);
  const constraints = isHdEnable
    ? { audio: { autoplay: true, deviceId: aDevID }, video: { width: 1920, height: 1080, deviceId: vDevID } }
    : { audio: { autoplay: true, deviceId: aDevID }, video: mobileView ? { width: { ideal: 1920 }, height: { ideal: 1080 }, deviceId: vDevID } : { width: { max: 852 }, height: { max: 480 }, deviceId: vDevID } };

  const [streamData] = getCurrentStreamInfoHook();
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imgFile, setImgFile] = useState({});
  const [goPremium, setGoPremium] = useState(false);
  const [wantSchedule, setWantSchedule] = useState(false);
  const [scheduleDuration, setScheduleDuration] = useState({ value: 5, label: '5 mins' });
  const [devSwitched, setDevSwitched] = useState(false);
  const [isCamera, setIsCamera] = useState(true);
  const [isRecord, setIsRecord] = useState(false);
  const [paymentCurrencyCode, setPaymentCurrencyCode] = useState("USD");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [wrapServers] = useState({ primaryServer: config.IVS_STREAM_DNS, liveKitServer: config.LIVEKIT_STREAM_DNS });
  const [streamStarted, setStreamStarted] = useState(false);
  const [lang] = useLang();
  const [room, setRoom] = useState({})
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [streamService, setStreamService] = useState("LiveKit")
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);
  const [isRotateEnable, setRotateEnable] = useState(false)
  const [resolutionToShow, setResolutionToShow] = useState({ width: null, height: null })
  const [selectedFacingMode, selectFacingMode] = useState("user")
  const [selectedFiles, setSelectedFiles] = useState([]);
  let creatorId = isAgency() ? selectedCreatorId : "";

  const isLive = useRef(false);

  const handleImgChange = (file, url) => setImgFile({ file, url });
  const enableCam = async (callBackFn, callForSwitchCam = false, updatedConstraints) => {

    try {
      await navigator.mediaDevices.getUserMedia(
        callForSwitchCam ? updatedConstraints : constraints
      ).then(function (mediaStream) {
        window.stream = mediaStream;
        mediaRef.current = mediaStream;
        var stream = videoBoxRef.current;
        stream.srcObject = mediaStream;
        stream.onloadedmetadata = async function (e) {
          const videoDimensions = {
            width: stream.videoWidth,
            height: stream.videoHeight,
          };
          setResolutionToShow(videoDimensions);
          await stream.play();
          callBackFn?.(videoDimensions);
        };
      })
        .catch(error => {
          console.error("Error in EnCam", error);
        });
    } catch (error) {
      console.error("Error in EnCam", error);
    }
  };

  const createAndConnectRoom = async (setRoomForDrawer, setDimensionCallBack) => {
    const room = new Room({
      logLevel: 'debug',
      adaptiveStream: false,
      dynacast: false,
      audioCaptureDefaults: {
        autoGainControl: true,
        deviceId: '',
        echoCancellation: true,
        noiseSuppression: true,
      },
      videoCaptureDefaults: {
        deviceId: '',
        facingMode: selectedFacingMode,
      },
      publishDefaults: {
        videoEncoding: {
          maxBitrate: isHdEnable ? 5_000_000 : 3_000_000,
          maxFramerate: 30,
        },
        audioBitrate: 20_000
      }
    });

    let serverPri = wrapServers.liveKitServer
    let wsUrl = `wss://${serverPri}`;
    try {
      await room.connect(wsUrl, streamData.rtcToken || "");
      setLogLevel('debug');
      setRoom(room);
      if (setRoomForDrawer) setRoomForDrawer(room)
      const localVideoTrack = await createLocalVideoTrack({
        facingMode: selectedFacingMode,
        video: { width: { ideal: 1920 }, height: { ideal: 1080 } }
      });
      videoBoxRef.current.srcObject = localVideoTrack.mediaStream
      videoBoxRef.current.play()
      const videoSettings = localVideoTrack.mediaStreamTrack.getSettings()
      setDimensionCallBack?.({
        width: videoSettings.width,
        height: videoSettings.height
      })
      localVideoCamera.next(localVideoTrack)
      const localAudioTrack = await createLocalAudioTrack();
      const isPublisher = true;
      await room.localParticipant.publishTrack(localVideoTrack, { isPublisher });
      await room.localParticipant.publishTrack(localAudioTrack, { isPublisher });

      setStreamStarted(true)
    } catch (e) {
      Toast("Error while creating stream", "error")
      console.log("create stream err", e)
    }
  };

  const switchCam = async (prevId) => {
    const elemIndex = devices.videoin.findIndex((dev) => dev.id == prevId);
    const indexToSet = (elemIndex + 1) == devices.videoin.length ? 0 : (elemIndex + 1);
    const devIDSwicthed = devices.videoin[indexToSet]?.id;
    currVideoDevId.next(devIDSwicthed)
    setVDevID(devIDSwicthed);

    const updatedConstraints = {
      ...constraints,
      video: {
        ...constraints.video,
        deviceId: devIDSwicthed,
      },
    };
    enableCam(null, true, updatedConstraints)
  }

  const stopDevices = () => {
    window.stream?.getVideoTracks()[0]?.stop();
    window.stream?.getAudioTracks()[0]?.stop();
    window.stream?.getTracks().forEach(function (track) {
      track.stop();
    });
  }

  const stopStreaming = (isReConnect = false) => {
    isLive.current = isReConnect;
    if (mediaRecorder.current?.state === 'recording') {
      mediaRecorder.current?.removeEventListener('dataavailable', sendMediaToWS);
      mediaRecorder.current.stop();
      if (!isReConnect) stopDevices();
      wsRef.current.close();
    }
    if (isReConnect) startStreaming(streamData.ingestEndpoint, streamData.streamKey);
  };

  const sendMediaToWS = e => {
    // recordedChunks.push(e.data);
    console.log(wsRef.current, 'is the current ws conn ==>');
    wsRef.current.send(e.data);
  };

  const handleStreamPublish = () => {
    mediaRecorder.current = null;
    try {
      mediaRecorder.current = new MediaRecorder(mediaRef.current, {
        mimeType: 'video/webm',
        // videoBitsPerSecond: 100000,
        videoBitsPerSecond: isHdEnable ? 8200000 : 1200000,
        // videoBitsPerSecond: 500000,
      });
    } catch (err) {
      // Fallback for IOS
      mediaRecorder.current = new MediaRecorder(mediaRef.current, {
        mimeType: 'video/mp4',
        // videoBitsPerSecond: 100000,
        videoBitsPerSecond: isHdEnable ? 8200000 : 1200000,
        // videoBitsPerSecond: 500000,
      });
    }
    mediaRecorder.current.addEventListener('dataavailable', sendMediaToWS);
    mediaRecorder.current.start(1000);

    if (!mobileView) setStreamStarted(true);
  }

  const startStreaming = async (rtmpURL, streamKey, setRoomForDrawer, setDimensionCallBack) => {
    // const hrtmp = '';
    // const hstreamKey = '';
    if (STREAM_SERVICE === "LiveKit") {
      createAndConnectRoom(setRoomForDrawer, setDimensionCallBack)
    } else {
      console.log("got SERVERS!", wrapServers.primaryServer);
      isLive.current = true; // Setting Live Status To True
      let serverPri = wrapServers.primaryServer
      let protocol = window.location.protocol.replace('http', 'ws');
      let wsUrl = `${protocol}//${serverPri}/rtmps/${rtmpURL}${streamKey}?${isHdEnable}`;

      wsRef.current = new WebSocket(wsUrl)
      console.log("como esta o wsRef", wsRef)

      wsRef.current.onerror = err => {
        console.error("Got a error!!!", err, wsRef.current);
      }

      wsRef.current.onclose = e => {
        console.log("Fallback 1", e.reason);
        const isReConnect = isLive.current;
        stopStreaming(isReConnect);
      }

      wsRef.current.onmessage = evt => {
        console.log("MSG!!", evt)
        // setdebugMSG(evt.data)
      }

      wsRef.current.addEventListener('open', async function open(data) {
        console.log("Open!!!", data);
        handleStreamPublish();
      });
    }
  }


  // const selectTagHandler = () => {
  //   open_drawer(
  //     "selectTag",
  //     {
  //       close: () => close_drawer("selectTag"),
  //     },
  //     "right"
  //   );
  // };
  const handleOpenGoLive = async () => {
    open_drawer('GO_LIVE_STREAM', {
      streamData,
      videoBoxRef,
      enableCam,
      startStreaming,
      stopStreaming,
      switchCam,
      handleInfoLog,
      stopDevices,
      isScheduleStream,
      room,
      selectedFacingMode,
      selectFacingMode,
      vDevID,
      noBorderRadius: true
    }, 'left');
  }

  const handleGoPremium = (e) => {
    setGoPremium(e.target.checked);
    setIsRecord(false);
  };


  // const handleCameraEnable = (e) => {
  //   setIsCamera(e.target.checked);
  // };

  const handleRecordEnable = (e) => {
    setIsRecord(e.target.checked);
  };

  const handleHDEnable = (e) => {
    setHdEnable(e.target.checked);
  };

  const handleScheduleToggle = (e) => {
    if (wantSchedule && goPremium && e.target.value === 'on') {
      setWantSchedule(e.target.checked);
      setGoPremium(false)
      return
    }
    !goPremium && setWantSchedule(e.target.checked);
    setScheduleTime(null)
  };

  const handleCreateStream = async () => {
    if (!getStreamUserId()) {
      Toast("Stream user id is missing for this account !", "warning");
      return;
    }
    if (title) {
      if (goPremium && !paymentAmount) return;
      const userId = isAgency() ? selectedCreatorId : getCookie('uid');
      startLoader();
      const payload = {
        audioOnly: !isCamera,
        multiLive: STREAM_SERVICE === "LiveKit",
        country: "INDIA",
        isPaid: goPremium,
        isPublicStream: false,
        isRecorded: isRecord,
        isScheduledStream: wantSchedule,
        members: [],
        paymentAmount: 0,
        paymentCurrencyCode,
        paymentType: 0,
        streamDescription: description,
        streamTags: ["#Ok"],
        streamImage: selectedFiles?.[0]?.file || "placeholderImages/streamPlaceholder.png",
        streamTitle: title,
        userId: isAgency() ? profileData?.isometrikUserId : getStreamUserId(),
        isSelfHosted: STREAM_SERVICE === "LiveKit",
        userName: profileData?.username || "marika_jack",
        userType: profileData?.userTypeCode,
        enableRecording: isRecord,
        lowLatencyMode: true,
        hdBroadcast: isHdEnable,
        products: [],
        customType: "test",
        rtmpIngest: false,
        persistRtmpIngestEndpoint: false
      };
      if (goPremium) payload.paymentAmount = +(+paymentAmount).toFixed(2);
      if (wantSchedule) {
        payload.scheduleStartTime = scheduleTime;
        payload.scheduleDuration = +scheduleDuration.value * 60;
      }
      if (isAgency()) {
        payload["creatorId"] = selectedCreatorId
      }
      dispatch(leaveCurrentStream());
      dispatch(createNewStream(payload, (success) => {
        stopLoader();
        console.log(streamData, 'is the stream Data fetched ==>>');
        if (!payload.isScheduledStream) return;
        if (success) {
          dispatch(getLiveStreams(4, 1, null, null, 10, 0, () => { }, false, creatorId)); // calling api for upcoming stream to get leatest data 
          Router.push('/live/popular');
          Toast('Stream Scheduled Successfully!', 'success');
        } else Toast('Some Error Occurred!', 'error');
      }));
    }
  };

  const handleScheduleGoLive = () => {
    // if (!vDevID) return;
    startLoader();
    const payload = {
      streamTitle: scheduleStreamData.streamTitle,
      audioOnly: scheduleStreamData.audioOnly,
      enableRecording: scheduleStreamData.isRecorded,
      eventId: scheduleStreamData.eventId,
      hdBroadcast: isHdEnable,
      isPaid: scheduleStreamData.isPaid,
      isPublicStream: false,
      lowLatencyMode: true,
      members: scheduleStreamData.members,
      multiLive: scheduleStreamData.multiLive,
      paymentAmount: scheduleStreamData.paymentAmount,
      paymentCurrencyCode: scheduleStreamData.paymentCurrencyCode,
      streamDescription: scheduleStreamData.streamDescription,
      streamImage: scheduleStreamData.streamImage,
      userId: scheduleStreamData.userId,
      userName: scheduleStreamData.userDetails.userName,
      userType: scheduleStreamData?.userType,
      customType: "test",
      multiLive: true,
      isSelfHosted: true,
      products: [],
      rtmpIngest: false,
      persistRtmpIngestEndpoint: false
    };
    dispatch(leaveCurrentStream());
    dispatch(createNewStream(payload, (success) => {
      stopLoader();
      console.log(streamData, 'is the stream Data fetched ==>>');
      if (!payload.isScheduledStream) return;
      if (!success) Toast('Some Error Occurred!', 'error');
    }));

  };

  useEffect(() => {
    if (streamData?.streamId) {
      setCookie("activeStreamId", streamData?.streamId)
      SubscribeIsometrikTopic.next(config.ISOMETRIK_MQTT_TOPICS.NewMessageEvent + streamData.streamId)
      if (mobileView) handleOpenGoLive();
      else startStreaming(streamData.ingestEndpoint, streamData.streamKey);
    };
  }, [streamData?.streamId]);

  useEffect(() => {
    if (goPremium) {
      setWantSchedule(true)
    }
    if (!goPremium) {
      setWantSchedule(false)
    }
  }, [goPremium])

  const handleStopPreviousStream = () => {
    const previousStreamId = getCookie("activeStreamId")
    if (previousStreamId?.length) {
      dispatch(stopCurrentStreamAction(previousStreamId, () => removeCookie("activeStreamId")))
    }
  } 

  const handleList = (gotDevices) => {
    console.log("List Cam", gotDevices.length)
    let vidin = [];
    let auin = [];
    gotDevices.forEach(function (gotDevice) {
      let i = 0
      if (gotDevice.kind === 'audioinput') {
        auin.push({ label: gotDevice.label, id: gotDevice.deviceId, len: i++ })
      } else if (gotDevice.kind === 'videoinput') {
        vidin.push({ label: gotDevice.label, id: gotDevice.deviceId })
      } else { console.log('Some other kind of source/device: ', gotDevice); }
    })
    setRotateEnable(vidin.length > 1)
    console.log("Como esta aqui??", vidin, auin);
    setDevices({ audioin: auin, videoin: vidin });
    if (!mobileView) enableCam();
  }

  const handleDevChange = (event) => {
    /// if audio if video 
    event.preventDefault();
    if (event.target.id === 'videoin') {
      console.log('Video =>', event.target.value);
      setVDevID(event.target.value)
      const selectedIndex = event.target.selectedIndex;
      const selectedOption = event.target.options[selectedIndex];
      if (selectedOption.getAttribute('facingMode').includes("facing front")) selectFacingMode("user")
      else if (selectedOption.getAttribute('facingMode').includes("facing back")) selectFacingMode("environment")
    }
    if (event.target.id === 'audioin') {
      console.log('Audio =>', event.target.value);
      setADevID(event.target.value)
    }
  }

  const updateDeviceList = async () => {
    console.log('Changed Permission ==>>');
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      const gotDevices = await navigator.mediaDevices.enumerateDevices()
      handleList(gotDevices, mediaStream);
    } catch (e) {
      handleList([]);
      console.error('Device Error', e);
    }
  }
  useEffect(() => {
    handleStopPreviousStream()
    switchCamera.subscribe((newLocalVideoTrack) => {
      videoBoxRef.current.srcObject = newLocalVideoTrack.mediaStream;
      videoBoxRef.current.play();
    })
    if (!isAgency()) {
      updateUserStatusAPI(getStreamUserId());
    }
    updateDeviceList();
    return () => {
      try {
        stopDevices();
      } catch (err) {
        console.log('This is the error');
      }
    }
  }, []);

  useEffect(() => {
    if (!mobileView) enableCam();
  }, [vDevID, aDevID, isHdEnable]);

  const handleInfoLog = () => {
    console.log(window.stream?.getVideoTracks()[0]?.getSettings(), 'is the settings obtained');
  };

  const handleScheduleStreamPost = (e) => {
    e?.preventDefault?.();
    handleCreateStream();
  };

  const handleScheduleTimeChange = (dateObj) => {
    setScheduleTime(moment(dateObj.target?.value).unix());
  }

  // const downloadStream = () => {
  //   const blob = new Blob(recordedChunks, {type: "video/webm"});
  //   const url =  URL.createObjectURL(blob);
  //   const a = document.createElement("a");
  //   document.body.appendChild(a);
  //   a.style = "display: none";
  //   a.href = url;
  //   a.download = 'test.webm';
  //   a.click();
  //   // setTimeout() here is needed for Firefox.
  //   setTimeout(function() { URL.revokeObjectURL(url); }, 100);
  // }

  const symbolReturn = (paymentCurrencyCode) => {
    switch (paymentCurrencyCode) {
      case 'INR':
        return '₹';
      case 'USD':
        return '$';
      case 'Eur':
        return '€';
      default:
        return paymentCurrencyCode;
    }
  };

  const handleNumberOnlyInput = e => {
    if (e.nativeEvent.code === "KeyE" || e.nativeEvent.code === "Minus") {
      e.preventDefault();
    }
  };

  const handleDurationChange = (option) => {
    let modOption = option;
    if (option.__isNew__) modOption = { ...option, label: `${option.value} min${option.value > 1 ? 's' : ''}` };
    setScheduleDuration(modOption);
  };

  const handleRefreshDevices = (event) => {
    event?.preventDefault?.();
    updateDeviceList();
  };

  const startStreamHandle = (force = false) => {
    if (!getStreamUserId()) {
      Toast("Stream user id is missing for this account !", "warning");
      return;
    }
    const funtionToCall = isScheduleStream ? handleScheduleGoLive : handleCreateStream;
    if (force) {
      funtionToCall();
      setWarnStateIssue(false);
      return;
    };
    if (isomterikStateConnected && !force) funtionToCall();
    else setWarnStateIssue(true);
  }


  const handleRemoveFile = (id) => {
    const currentFile = selectedFiles.find(f => f.id === id);
    const currentFileIndex = selectedFiles.findIndex(f => f.id === id);
    if (currentFile) {
      const allFiles = [...selectedFiles]
      allFiles.splice(currentFileIndex, 1)
      setSelectedFiles([...allFiles])
    }
  }

  return (
    <>
      <Head>
        <script defer={true} src="https://sdk.amazonaws.com/js/aws-sdk-2.19.0.min.js" />
      </Head>
      <div className="d-flex">
        <div className={`${mobileView ? "col-12" : "col-4"} pg__scrl ${streamStarted && !mobileView ? 'd-none' : ''}`}>
          <div className="pb-3 pt-2 cursorPtr">
            <Icon
              color={theme.l_app_text}
              width={isScheduleStream ? 18 : 26}
              height={!isScheduleStream && 25}
              icon={`${config.backArrow_black}#backArrow`}
              onClick={isScheduleStream ? onClose : Router.back}
              viewBox="0 0 64 64"
              class="position-absolute"
              alt="back-arrow"
              style={{ top: "22px" }}
            />
            <h5 className={`mt-3 text-center pg__title w-700 `} onClick={handleInfoLog}>{isScheduleStream ? 'Go Live Now' : 'Set up your broadcast'}</h5>
          </div>

          <form>
            {!isScheduleStream && <div className="col-12 d-flex position-relative streamPost_image">
              <PostPlaceHolder
                isEdit
                showTitle={false}
                isSingle
                setFiles={setSelectedFiles}
                handleRemoveFile={handleRemoveFile}
                onClick={() => mobileView ? open_drawer(
                  "AttachVaultMedia",
                  {
                    currenStep: 2,
                    selectedFiles: (files) => setSelectedFiles(files),
                    targetId: "streamMedia",
                    fileTypes: ['image/*'],
                    isTransForm: true,
                    folderName: "streamMedia",
                  },
                  "bottom"
                ) :
                  open_dialog(
                    "AttachVaultMedia",
                    {
                      currenStep: 2,
                      selectedFiles: (files) => setSelectedFiles(files),
                      targetId: "streamMedia",
                      fileTypes: ['image/*'],
                      isTransForm: true,
                      folderName: "streamMedia",
                    }
                  )}
                files={selectedFiles}
              />
            </div>}
            {!isScheduleStream && <div className="form-group">
              <label className="lbl__brod">{lang.title}</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                className="form-control ipt__brod mv_form_control_Input borderStroke"
                placeholder={lang.enterTitle}
              />
            </div>}

            {!isScheduleStream && <div className="form-group">
              <label className="lbl__brod">{lang.description}</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                type="text"
                className="form-control textArea mv_form_control_Input borderStroke"
                placeholder="Enter Description"
              />
            </div>}
            {!devices.videoin?.length && (
              <div>
                <p className="fntSz14 txt-book mt-2 col-12 mb-0 text-danger px-0">{lang.fetchYourDevicesCameraAndMic}</p>
                <button className="btn fetchdevices__btn my-2" onClick={handleRefreshDevices}>{lang.fetchDevices}</button>
              </div>
            )}
            <div className="form-group">
              <label className="lbl__brod">{lang.camera}</label>
              <div className="position-relative">
                <select id="videoin" className="form-control ipt__brod pr-4 mv_form_control_Input borderStroke" onChange={handleDevChange}>
                  <option disabled selected>{lang.selectCamera}</option>
                  {devices.videoin.map((videoin, index) =>
                    <option selected={index === 0} facingMode={videoin.label} key={videoin.id} value={videoin.id}>{videoin.label}</option>)}
                </select>
                <img
                  src={config.Chevron_Right_Darkgrey}
                  height="17"
                  className="setPosRht"
                  alt="right-arrow"
                />
              </div>
            </div>
            <div className="form-group">
              <label className="lbl__brod">{lang.mic}</label>
              <div className="position-relative">
                <select id="audioin" className="form-control ipt__brod pr-4 mv_form_control_Input borderStroke" onChange={handleDevChange}>
                  <option disabled selected>{lang.selectMic}</option>
                  {devices.audioin.map((audioin) =>
                    <option selected key={audioin.id} value={audioin.id}>{audioin.label}</option>)}
                </select>
                <img
                  src={config.Chevron_Right_Darkgrey}
                  height="17"
                  className="setPosRht"
                  alt="right-arrow"
                />
              </div>
            </div>

            {!isScheduleStream && <div className="row align-items-end justify-content-between mb-3">
              <div className="col-auto">
                <span className={`switch__opt__title ${goPremium ? 'text-muted' : ''}`}>{lang.recordStream}</span>
              </div>
              <div className="col-auto switch__opt__toggler">
                <label className="switch">
                  <input
                    disabled={goPremium}
                    type="checkbox"
                    checked={isRecord}
                    onChange={handleRecordEnable}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              {goPremium && <p className="fntSz11 txt-book mt-2 col-12 mb-0 text-danger">{lang.recordingPaidStreams}</p>}
            </div>}

            <div className="row align-items-end justify-content-between mb-3">
              <div className="col-auto">
                <span className="switch__opt__title">{lang.hdStream}</span>
              </div>
              <div className="col-auto switch__opt__toggler">
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={isHdEnable}
                    onChange={handleHDEnable}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
            {!isScheduleStream && <div className="row align-items-end justify-content-between mb-3">
              <div className="col-auto">
                <span className="switch__opt__title">{lang.goPremium}</span>
              </div>
              <div className="col-auto switch__opt__toggler">
                <label className="switch">
                  <input
                    checked={goPremium}
                    onChange={handleGoPremium}
                    type="checkbox"
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>}

            {goPremium ? (
              <div className="form-group mt-3">
                <div className="position-relative">
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="form-control ipt__brod ipt__selTag mv_form_control_Input borderStroke"
                    placeholder={lang.enterAmount}
                    style={{ paddingLeft: '38px', paddingBottom: "7px" }}
                    pattern="\d*"
                    onWheel={(e) => {
                      e.target.blur()
                      e.stopPropagation()
                    }}
                  />
                  <div className="setPosRhtdPDN">
                    <div className="dropdown">
                      <button
                        type="button"
                        className=" border-0 mv_form_control_Input  fntSz15 ml-3"
                        data-toggle="dropdown"
                      >
                        {symbolReturn(paymentCurrencyCode)}
                      </button>
                    </div>
                  </div>
                </div>
                {(paymentAmount < minPurchasePostVal || paymentAmount > maxStreamValue) && <p className="fntSz13 text-danger txt-book mt-2">{lang.PleaseAddValue}{" "} {symbolReturn(paymentCurrencyCode)}{" "}{(+minPurchasePostVal).toFixed(2)} {lang.maxText}  {symbolReturn(paymentCurrencyCode)}{" "}{(+maxStreamValue).toFixed(2)}</p>}
              </div>
            ) : (
              <></>
            )}

            {!isScheduleStream && (
              <>
                <div className="row align-items-end justify-content-between">
                  <div className="col-auto">
                    <span className="switch__opt__title">{lang.scheduleStream}</span>
                  </div>
                  <div className="col-auto switch__opt__toggler">
                    <label className="switch">
                      <input
                        checked={wantSchedule}
                        onChange={handleScheduleToggle}
                        type="checkbox"
                      />
                      <span className="slider round"></span>
                    </label>
                  </div>
                </div>
                {wantSchedule && (
                  <>
                    <div className="form-group mt-2">
                      <label className="lbl__brod">{lang.scheduleTime}</label>
                      {mobileView ?
                        <div className="dateTimePickerContainer">
                          <DateAndTimePicker selectedDateTimeStamp={scheduleTime} dateTimeStamp={scheduleTime} setDateTimeStamp={(time) => { setScheduleTime(time) }} setAutoMeridium={true} />
                        </div>

                        :
                        <div className="dateTimePickerContainer">
                          <DateAndTimePicker selectedDateTimeStamp={scheduleTime} dateTimeStamp={scheduleTime} setDateTimeStamp={(time) => { setScheduleTime(time) }} setAutoMeridium={true} />
                        </div>
                      }
                      {scheduleTime ? scheduleTime <= moment().unix() && (
                        <span className="txt-book fntSz12 text-danger">{lang.TimeAndSchedul}</span>
                      ) : <></>}
                    </div>

                    <div className="form-group mt-2">
                      <label className="lbl__brod">{lang.liveDuration}</label>
                      <Creatable
                        menuPlacement="top"
                        components={{ Input }}
                        placeholder={lang.durationMin}
                        styles={{
                          control: (provided) => ({ ...provided, backgroundColor: "var(--l_drawer)", border: "1.5px solid var(--l_border)", color: "var(--l_light_grey)", borderRadius: mobileView ? "8px" : "12px", height: "45px" }),
                          placeholder: (provided) => ({ ...provided, color: "var(--l_app_text)", fontSize: "16px", fontFamily: "Roboto" }),
                          option: (provided) => ({ ...provided, backgroundColor: "var(--l_drawer)", color: "var(--l_app_text)", fontFamily: "Roboto", fontSize: "15px", fontWeight: "400" }),
                          singleValue: (provided) => ({ ...provided, color: "var(--l_app_text)" }),
                          menuList: (provided) => ({ ...provided, backgroundColor: "var(--l_drawer)", color: "var(--l_app_text)" }),
                        }}
                        value={scheduleDuration}
                        onChange={handleDurationChange}
                        onKeyDown={handleNumberOnlyInput}
                        options={[
                          { value: 5, label: '5 mins' },
                          { value: 30, label: '30 mins' },
                          { value: 60, label: '1 hr' },
                          { value: 60 * 2, label: '2 hrs' },
                        ]}
                      />
                    </div>
                  </>
                )}
              </>
            )}

            <div className="w-100 my-4">
              {
                wantSchedule
                  ? (<Button onClick={handleScheduleStreamPost} disabled={!(title && description && (goPremium ? +paymentAmount >= +minPurchasePostVal : !goPremium) && scheduleTime > moment().unix())} fclassname="txt-black gradient_bg rounded-pill" >{lang.createStream}</Button>)
                  : (<Button onClick={() => startStreamHandle(false)} disabled={!(((isScheduleStream && title === "" && description === "")) || !isScheduleStream && title && description && (goPremium ? +paymentAmount >= +minPurchasePostVal : !goPremium) && !isAgency())} fclassname="txt-black gradient_bg rounded-pill" >{lang.goLive}</Button>)
              }
            </div>
          </form>
        </div>
        {
          !mobileView && (
            <div className={streamStarted ? 'col-12 p-0' : 'col-8 p-0'}>
              <DVBroadcastScreen profileData={profileData} isScheduleStream={isScheduleStream} stopStreaming={stopStreaming} stopDevices={stopDevices} enableCam={enableCam} streamId={streamData?.streamId} startTime={streamData?.startTime} videoBoxRef={videoBoxRef} streamStarted={streamStarted} STREAM_SERVICE={STREAM_SERVICE} room={room} resolutionToShow={resolutionToShow} isRotateEnable={isRotateEnable} />
            </div>
          )
        }
      </div>
      {warnStateIssue && <WarnStateNotConnected handleNo={() => setWarnStateIssue(false)} handleYes={() => startStreamHandle(true)} />}
      <style jsx>
        {`
            .fetchdevices__btn {
              background-color: var(--l_base);
              padding: 6px 10px;
              border-radius: 23px;
              color: #fff;
              font-size: 12px;
            }
            .lbl__brod {
              color: var(--l_app_text);
              font-size: 14px;
              font-family: "Roboto", sans-serif !important;
            }
            .scheduleGoBtn {
              background-color: var(--l_base);
              padding: 6px;
              border-radius: 23px;
            }
            .livebtnn__design {

            }
            .ipt__brod {
              border-radius: ${mobileView ? "8px" : "12px"};
              border-color: #f1f2f6;
              height: 45px;
              border: none
            }
            .ipt__brod::placeholder {
              color: #a5a5a5 !important;
              font-size: 15px !important;
              opacity: 0.7 !important;
            }

            .ipt__brod:-ms-input-placeholder {
              color: #a5a5a5 !important;
              font-size: 15px !important;
              opacity: 0.7 !important;
            }

            .ipt__brod::-ms-input-placeholder {
              color: #a5a5a5 !important;
              font-size: 15px !important;
              font-family: "Roboto", sans-serif !important;
              opacity: 0.7 !important;
            }

            .backArr__img {
              position: absolute;
              width: ${isScheduleStream ? 15 : 18}px;
              z-index: 1;
              cursor: pointer;
              right: ${isScheduleStream ? '15px' : 'unset'};
              color: var(--l_app_text);
            }

            .pg__title {
              color: var(--l_app_text);
              font-size: 18px;
              font-family: "Roboto", sans-serif !important;
            }

            .switch__opt__toggler .switch {
              position: relative;
              display: inline-block;
              width: 31px;
              height: 19px;
              margin-bottom: 0;
            }

            .switch__opt__toggler .switch input {
              opacity: 0;
              width: 0;
              height: 0;
            }

            .switch__opt__toggler .slider {
              position: absolute;
              cursor: pointer;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background-color: #b5b5b5;
              -webkit-transition: 0.4s;
              transition: 0.4s;
            }

            .switch__opt__toggler .slider:before {
              position: absolute;
              content: "";
              height: 17px;
              width: 17px;
              left: 1px;
              bottom: 1px;
              background-color: white;
              -webkit-transition: 0.4s;
              transition: 0.4s;
            }

            .switch__opt__toggler input:checked + .slider {
              background-color: #1477f2;
            }

            .switch__opt__toggler input:focus + .slider {
              box-shadow: 0 0 1px #1477f2;
            }

            .switch__opt__toggler input:checked + .slider:before {
              -webkit-transform: translateX(13px);
              -ms-transform: translateX(13px);
              transform: translateX(13px);
            }

            .switch__opt__toggler .slider.round {
              border-radius: 34px;
            }

            .switch__opt__toggler .slider.round:before {
              border-radius: 50%;
            }

            .switch__opt__title {
              color: var(--l_app_text);
              font-size: 14px;
              font-family: "Roboto", sans-serif !important;
              opacity: 0.8;
              font-weight: 600;
            }
            :global(.dateTimePickerContainer .form-group){
              margin-bottom:0 !important;
            }
            :global(.dateTimePickerContainer .pickerBoxLayout::placeholder){
              color:#7C787D !important;
              font-weight:500;
            }

            .switch__opt__tag {
              color: var(l_app_text);
              font-size: 16px;
              font-family: "Roboto", sans-serif !important;
              opacity: 0.8;
            }

            .setPosRht {
              position: absolute;
              cursor: pointer;
              right: 15px;
              top: 50%;
              width: 12px;
              transform: translateY(-50%);
              z-index: 1;
            }

            .rot__cus {
              transform: translateY(-50%) rotate(90deg);
            }

            .pg__scrl {
              overflow-y: scroll;
              height: ${isScheduleStream ? '100%' : 'calc(var(--vhCustom, 1vh) * 100)'};
              position: relative;
              z-index: 9;
              background:  ${theme.type === "light" ? "var(--white)" : "var(--l_lightgrey_bg)"} ;
            }
            :global(.mv_form_control_Input){
              border-color:var(--l_border) !important;
              border-radius: ${mobileView ? "8px" : "12px"} !important;
            }

            // .pg__scrl::-webkit-scrollbar {
            //   display: none;
            // }

            // .pg__scrl {
            //   -ms-overflow-style: none;
            //   scrollbar-width: none;
            // }

            select {
              width: 100%;
              text-overflow: ellipsis;
            }

            .ipt__selTag {
              border-radius: ${mobileView ? "8px" : "12px"} !important;
            }

            .setPosRhtdPDN {
              position: absolute;
              cursor: pointer;
              left: 0;
              top: 50%;
              transform: translateY(-50%);
              z-index: 1;
            }

            .setPosRhtdPDN button {
              color: ${theme.text};
              font-size: 12px;
            }

            .setPosRhtdPDN .dropdown-menu {
              min-width: auto !important;
              background: var(--l_drawer);
            }

            .slider__cus {
              overflow-y: auto;
              flex-wrap: nowrap;
            }
            .defultImg{
              object-fit: cover;
              border-radius: 10px;
              border: 1px solid;  
            }
            .textArea{
              border-radius: 10px;
              border: none;
            }
            .textArea::placeholder{
              color:${theme.type === "light" ? "#12121236" : "gray"};
            }
            :global(.css-tlfecz-indicatorContainer .css-1gn7ac-control) {
              background-color: ${theme.palette.l_drawer_bg};
              color: ${theme.text};
            }
            :global(.css-1uccc91-singleValue){
              color: ${theme.text};
            }

            :global(input[type=datetime-local]::-webkit-calendar-picker-indicator){
              filter: ${theme.type === "light" ? "" : "invert(1)"};
              cursor:pointer;

            }
            .pointerEvent{
              pointer-events: none !important;
            }
            :global(.dateForMobile:before){
              left:30% !important;
              top:0.1rem !important;
            }
            :global(.streamPost_image .contentBox) {
              background: ${theme.type === "light" ? "#fff" : "#36223C"} !important;
              border: 1.5px solid var(--l_border)
            }
            :global(.pickerBoxLayout){
              border-radius: ${mobileView ? "8px !important" : "12px !important"} ;
            }
          `}
      </style>
    </>
  );
};
export default BroadcastPage;
