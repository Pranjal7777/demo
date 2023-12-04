import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import momentzone from 'moment-timezone';
import Host from './Host';
import Participant from './Participant';
import useLivekit from '../../../hooks/useLiveKit';
import CallEndIcon from '@material-ui/icons/CallEnd';
import { IconButton } from '@material-ui/core';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideocamIcon from '@material-ui/icons/Videocam';
import FlipCameraAndroidIcon from '@material-ui/icons/FlipCameraAndroid';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import { getCookie, removeCookie, setCookie } from '../../../lib/session';
import ExtendCall from './extendCall';
import { postVideoCallStatusAPI, stopIsometrikCall } from '../../../services/videoCall';
import { pushMessageToConferenceSubject } from '../../../lib/rxSubject';
import { close_dialog, close_drawer, open_dialog, open_drawer, startLoader, stopLoader, Toast } from '../../../lib/global';
import { IVS_STREAM_DNS, LIVEKIT_STREAM_DNS, defaultTimeZone } from '../../../lib/config';
import { Room, createLocalVideoTrack, createLocalAudioTrack, RoomEvent, setLogLevel } from 'livekit-client';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import useProfileData from '../../../hooks/useProfileData';
// import { IVS_STREAM_DNS, LIVEKIT_STREAM_DNS } from '../lib/config';

// import Timer from './Timer';

// const client = AgoraRTC.createClient({ codec: 'h264', mode: 'rtc' });

const Conference = (props) => {
    const { MEETING_ID, isometrikVideoCallToken, mobileView = false, AGORA_TOKEN, AGORA_APP_ID, hostUserName, AGORA_CHANNEL_NAME, handlePushHome, callData, virtualOrderId, isHost = false, setCallData } = props;
    const creds = useSelector(({ appConfig: { isometrikLicenseKey, isometrikAppSecret } }) => ({ isometrikLicenseKey, isometrikAppSecret }));
    const videoBoxRef = useRef(null)
    const [resolutionToShow, setResolutionToShow] = useState({ width: null, height: null })
    const [wrapServers] = useState({ primaryServer: IVS_STREAM_DNS, liveKitServer: LIVEKIT_STREAM_DNS });
    const [profileData] = useProfileData();
    const {
        // remoteUsers,
        join,
        joinState,
        leave,
        localAudioTrack,
        localVideoTrack,
        client,
        removeLocalVideoTrack,
        removeLocalAudioTrack,
        joinLocalVideoTrack,
        joinLocalAudioTrack,
        changeVideoDevice
    } = useLivekit();

    const [remoteUsers, setRemoteUsers] = useState([])
    const [room, setRoom] = useState(null)
    const remoteVideoRef = useRef(null)
    const [localMedia, setLocalMedia] = useState({ audio: false, video: true });
    const [gridSize, setGridSize] = useState();
    // This state is to manage extension events
    const [extensionStatus, setExtensionStatus] = useState("unextended");
    const [remoteVideoTrack, setRemoteVideoTrack] = useState(null);
    // This state is to manage video turned off placeholder
    const [isVideoTrackMuted, setVideoTracksMuted] = useState({
        host: false,
        remoteUser: false
    })
    const [localVideoCameraTrack, setLocalVideoCameraTrack] = useState(null)
    const [isRotatationEnable, setRotatation] = useState(false)
    const [facing, setFacing] = useState("user")

    // This state is to manage full screen for mobile view.
    const [isFullScreen, setFullScreen] = useState(false);

    const pushCameraOnStatus = () => {
        postVideoCallStatusAPI({
            orderId: virtualOrderId,
            status: "CAMERA_ON"
        });
    };

    const pushCameraOffStatus = () => {
        postVideoCallStatusAPI({
            orderId: virtualOrderId,
            status: "CAMERA_OFF"
        });
    };

    const pushAudioOffStatus = () => {
        postVideoCallStatusAPI({
            orderId: virtualOrderId,
            status: "MUTED"
        });
    };

    const pushAudioOnStatus = () => {
        postVideoCallStatusAPI({
            orderId: virtualOrderId,
            status: "UNMUTED"
        });
    };

    const acceptExtensionRequest = async (extensionId = "") => {
        try {
            startLoader();
            const response = await postVideoCallStatusAPI({
                orderId: virtualOrderId,
                status: "EXTENSION_ACCEPTED",
                extensionId
            });
            if (response.status === 200 && response.data.data?.endTs) {
                const newEndTimeStamp = moment(momentzone.unix(response.data.data?.endTs).tz(defaultTimeZone()).format('LLLL'), 'LLLL').unix();
                setCallData((prev) => ({ ...prev, endTs: newEndTimeStamp }));
                setCookie("CALL_END_TIME", newEndTimeStamp);
            }
            stopLoader();
        } catch (err) {
            console.error(err);
            stopLoader();
        }
    }

    const declineExtensionRequest = () => {
        postVideoCallStatusAPI({
            orderId: virtualOrderId,
            status: "EXTENSION_REJECTED"
        });
    }

    const getVideoDevices = async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter((device) => device.kind === 'videoinput');
            setRotatation(videoDevices.length >= 2); // Check if the user has at least two cameras
        } catch (error) {
            console.error('Error while getting video devices:', error);
        }
    };

    const handlePushFromMqtt = ({ status, username, extensionCharge, extensionTime, endTs, extensionId, orderId }) => {
        if (status === "EXTENSION_REQUESTED" && isHost) {
            const propsToPass = {
                title: `${username} wants to extend the call for ${extensionTime} mins. Do you want to continue ?`,
                subtitle: `You can earn $${Number(extensionCharge).toFixed(2)}`,
                yes: () => acceptExtensionRequest(extensionId),
                noHandler: declineExtensionRequest,
                onBackdropClick: true
            };
            if (mobileView) open_drawer("confirmDrawer", propsToPass, "bottom");
            else open_dialog("confirmDialog", propsToPass);
        } else if (status === "EXTENSION_ACCEPTED" && !isHost) { // It Means This Push is Telling Creator Accepted Extension
            setExtensionStatus("extended");
            // const propsToPass = {
            //     title: "Extension Request Accepted",
            // };
            Toast("Extension Request Accepted", "success");
            // Showing Success Dialog/Drawer
            // if (mobileView) open_drawer("drawerToaster", propsToPass, "bottom");
            // else open_dialog("successfullDialog", propsToPass);

            // Increasing the Call End Time, as got endTs timestamp from MQTT
            const newEndTimeStamp = moment(momentzone.unix(endTs).tz(defaultTimeZone()).format('LLLL'), 'LLLL').unix();
            setCallData((prev) => ({ ...prev, endTs: newEndTimeStamp }));
            setCookie("CALL_END_TIME", newEndTimeStamp);

        } else if (status === "EXTENSION_REJECTED" && !isHost) {
            setExtensionStatus("rejected");
            Toast("Extension Request Rejected !", "error");
        } else if (status === "COMPLETED" && orderId === AGORA_CHANNEL_NAME) { // Means Call got finished
            Toast('Call Finished !', "warning");
            close_dialog();
            close_drawer();
            handleDispose();
        }
    }

    React.useEffect(() => {
        let subscriberState = pushMessageToConferenceSubject.asObservable().subscribe(handlePushFromMqtt);
        getVideoDevices()
        return async () => {
            subscriberState.unsubscribe();
            try {
            const extraHeaders = {
                licenseKey: creds.isometrikLicenseKey,
                appSecret: creds.isometrikAppSecret,
                userToken: getCookie("isometrikToken"),
                "Content-Type": "application/json",
            }
                await stopIsometrikCall({ meetingId: MEETING_ID }, extraHeaders)
            } catch (error) {
                console.log(error)
            }
            window.location.reload()
        }
    }, []);

    React.useEffect(() => {
        setGridSize(() => {
            const containerWidth = document.getElementById("large_video_container")?.offsetWidth;
            const containerHeight = document.getElementById("large_video_container")?.offsetHeight;
            const size = parseInt(containerWidth / (remoteUsers?.length || 1) - 5);
            if (containerHeight < size && remoteUsers?.length == 1) {
                return parseInt(containerHeight)
            }
            return size
        })
        const options = { ...localMedia };
        const callBacks = {
            videoSuccess: pushCameraOnStatus,
            audioSuccess: pushAudioOnStatus
        }
        // join(AGORA_APP_ID, AGORA_CHANNEL_NAME, AGORA_TOKEN, null, options, callBacks)
        // join(props.ProfileData.username, AGORA_CHANNEL_NAME, callBacks)
        joinIsometrikVideoCall(props.ProfileData.username, AGORA_CHANNEL_NAME)
    }, [])

    React.useEffect(() => {
        setGridSize(() => {
            const containerWidth = document.getElementById("large_video_container")?.offsetWidth;
            const containerHeight = document.getElementById("large_video_container")?.offsetHeight;
            const size = parseInt(containerWidth / (remoteUsers?.length || 1) - 5);
            if (containerHeight < size && remoteUsers?.length == 1) {
                return parseInt(containerHeight)
            }
            return size
        })
    }, [remoteUsers])

    const handleAudioClick = async () => {
        if (!localMedia.audio) {
            setLocalMedia(prev => ({ ...prev, audio: true }));
            room.localParticipant.setMicrophoneEnabled(true)
            pushAudioOnStatus();
        } else {
            setLocalMedia(prev => ({ ...prev, audio: false }));
            room.localParticipant.setMicrophoneEnabled(false)
            pushAudioOffStatus();
        }
    }

    const handleVideoClick = () => {
        if (!localMedia.video) {
            setLocalMedia(prev => ({ ...prev, video: true }));
            room.localParticipant.setCameraEnabled(true)
            // joinLocalVideoTrack()
            pushCameraOnStatus();
        } else {
            setLocalMedia(prev => ({ ...prev, video: false }));
            room.localParticipant.setCameraEnabled(false)
            // removeLocalVideoTrack();
            pushCameraOffStatus();
        }
    }

    const clearAgoraCreds = () => {
        removeCookie("AGORA_CHANNEL");
        removeCookie("AGORA_TOKEN");
        removeCookie("AGORA_TOKEN");
        removeCookie("AGORA_CHANNEL");
        removeCookie("CALL_END_TIME");
        removeCookie("AGORA_ORDER_ID");
        removeCookie("CALL_HOST_ID");
    };

    const handleCallCompleteAlert = () => {
        const propsToPass = {
            title: 'Finish This Call',
            cancelT: 'Cancel',
            submitT: 'Finish',
            yes: handleDispose,
            subtitle: 'You have to be on the call for at-least 80% of the booked duration , if you end the call sooner , the money will be returned to the customer',
        };
        mobileView
            ? open_drawer("confirmDrawer", propsToPass, "bottom")
            : open_dialog("confirmDialog", propsToPass);
    };

    const confirmCallEnd = () => {
        if (isHost) handleCallCompleteAlert();
        else handleDispose();
    };

    const handleDispose = async () => {
        try {
            room.localParticipant.setMicrophoneEnabled(false)
            room.localParticipant.setCameraEnabled(false)
            room.disconnect()
            setRemoteVideoTrack(null)
            const extraHeaders = {
                licenseKey: creds.isometrikLicenseKey,
                appSecret: creds.isometrikAppSecret,
                userToken: getCookie("isometrikToken"),
                "Content-Type": "application/json",
            }

            stopIsometrikCall({ meetingId: MEETING_ID }, extraHeaders)
        } catch (error) {
            console.log(error, "error")
        }
        leave();
        setLocalMedia({ video: false, audio: false });
        postVideoCallStatusAPI({ orderId: virtualOrderId, status: "LEFT" });
        clearAgoraCreds();
        handlePushHome?.();
    }

    const handleCameraSwitch = async () => {
        localVideoCameraTrack.stop()
        await localVideoCameraTrack.restartTrack({
            facingMode: facing == "user" ? 'environment' : 'user',
        });
        setFacing(prev => prev == "user" ? 'environment' : 'user')
    }

    const handleFullScreenToggle = () => mobileView && setFullScreen((prev) => !prev);

    const handleTrackPublished = (track) => {

    };
    const handleTrackUnpublished = (track) => {

    };

    const handleLocalTrackPublished = () => {

    }
    const handleTrackMuted = (trackPublication, participant) => {
        if (trackPublication.kind === "video") {
            if (participant.name == profileData.username) {
                setVideoTracksMuted((prev) => ({ ...prev, host: true }))
            } else {
                setVideoTracksMuted((prev) => ({ ...prev, remoteUser: true }))
            }
        }
    };
    const handleTrackUnMuted = (trackPublication, participant) => {
        if (trackPublication.kind === "video") {
            if (participant.name == profileData.username) {
                setVideoTracksMuted((prev) => ({ ...prev, host: false }))
            } else {
                setVideoTracksMuted((prev) => ({ ...prev, remoteUser: false }))
            }
        }
    };

    const handleParticipantConnected = (track, publication) => {
        if (track.kind === "video") {
            setRemoteVideoTrack(track);
            track.attach(remoteVideoRef.current);
            setResolutionToShow({
                width: publication.dimensions.width,
                height: publication.dimensions.height
            })
        }
    }
    const handleParticipantDisconnected = () => {
        remoteVideoRef.current = null
        setRemoteVideoTrack(null)
        setVideoTracksMuted({
            host: false,
            remoteUser: false
        })
    }


    const handleTrackSubscribed = (track, publication) => {
        if (track?.kind === 'video') {
            setRemoteVideoTrack(track);
            track.attach(remoteVideoRef.current);
            setResolutionToShow({
                width: publication.dimensions.width,
                height: publication.dimensions.height
            })
        }
        else if (track?.kind === "audio") {
            track.attach()
        }
    }

    const handleReSubscribe = async (track, error) => {
        console.log('Track subscription failed:', track, error);

        // Identify the participant associated with the failed track
        const failedParticipant = track.participantSid;

        // Attempt to re-subscribe to the track
        console.log('Attempt to re-subscribe to the track', track);
        try {
            const participant = room.participants.get(failedParticipant);
            if (participant) {
                const subscribedTrack = await participant.subscribeTrack(track);
                console.log('Successfully re-subscribed to the track:', subscribedTrack);
            } else {
                console.error('Participant not found');
            }
        } catch (reSubscribeError) {
            console.error('Failed to re-subscribe to the track:', reSubscribeError);
        }
    }

    const joinIsometrikVideoCall = async (userName, roomName, callBacks) => {

        const room = new Room({
            logLevel: 'debug',
            audioCaptureDefaults: {
                autoGainControl: true,
                deviceId: '',
                echoCancellation: true,
                noiseSuppression: true,
            },
            videoCaptureDefaults: {
                deviceId: '',
                facingMode: 'user',
            },
            publishDefaults: {
                videoEncoding: {
                    maxBitrate: 5_000_000,
                    maxFramerate: 30,
                },
                audioBitrate: 20_000
            }
        });


        let serverPri = wrapServers.liveKitServer
        let wsUrl = `wss://${serverPri}`;
        try {

            room?.on(RoomEvent.TrackPublished, handleTrackPublished);
            room?.on(RoomEvent.TrackUnpublished, handleTrackUnpublished);
            room?.on(RoomEvent.LocalTrackPublished, handleLocalTrackPublished);
            room?.on(RoomEvent.TrackSubscribed, handleTrackSubscribed);
            room?.on(RoomEvent.ParticipantConnected, handleParticipantConnected);
            room?.on(RoomEvent.TrackMuted, handleTrackMuted);
            room?.on(RoomEvent.TrackUnmuted, handleTrackUnMuted);
            room?.on(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected);
            room.on(RoomEvent.TrackSubscriptionFailed, handleReSubscribe);

            await room.connect(wsUrl, AGORA_TOKEN || "", { autoSubscribe: true });
            setLogLevel('debug');
            setRoom(room);
            const localVideoTrack = await createLocalVideoTrack({
                facingMode: "user",
                resolution: "hd720"
            });
            setLocalVideoCameraTrack(localVideoTrack)
            localVideoTrack.attach(videoBoxRef.current)
            const isPublisher = isHost ? true : false;
            await room.localParticipant.publishTrack(localVideoTrack, { isPublisher });
            room.localParticipant.setCameraEnabled(true)

        }
        catch (error) {
            console.error(error);
        }

    };

    return (
        <React.Fragment>
            <div id="large_video_container" className="container row col-12 m-0 p-0 dynamicHeight vw-100 player-container d-flex justify-content-center position-relative">
                {!isFullScreen && (
                    <div className={mobileView ? "col-12 position-absolute timer__notice" : "col-3 position-absolute timer__dv__notice"}>
                        <ExtendCall extensionStatus={extensionStatus} setExtensionStatus={setExtensionStatus} handleDispose={handleDispose} isHost={isHost} callData={callData} />
                    </div>
                )}

                <div className="d-flex flex-wrap remote-player-wrapper" onClick={handleFullScreenToggle}>
                    {remoteVideoTrack ? <Participant
                        videoTrack={remoteVideoRef}
                        audioTrack={remoteVideoRef}
                        isVideoTrackMuted={isVideoTrackMuted.remoteUser}
                        client={client}
                    ></Participant>
                        : <div className="empty_room d-flex align-items-center text-muted">
                            <h2 className="empty_room_text text-center text-white px-2">
                                You are the only one in the room!
                            </h2>
                        </div>
                    }
                </div>
                <div className={`local-player-wrapper ml-auto ${isFullScreen ? 'bottom_0' : ''}`}>
                    {<Host isVideoTrackMuted={isVideoTrackMuted.host} client={client} localAudioTrack={localAudioTrack} localVideoTrack={videoBoxRef}></Host>}
                </div>

                {!isFullScreen && <div className={mobileView ? "controller_icons col-12 p-0 justify-content-center py-2 bg-dark" : "controller_icons"}>
                    <IconButton
                        className="p-2 m-2 controller-icon"
                        onClick={handleAudioClick}
                        style={{ background: localMedia.audio ? "#4dcef7" : "#808080" }}>
                        {localMedia.audio ? (
                            <MicIcon color="primary" style={{ color: '#fff' }} />
                        ) : (
                            <MicOffIcon color="primary" style={{ color: '#fff' }} />
                        )}
                    </IconButton>
                    <IconButton
                        onClick={handleVideoClick}
                        className="p-2 m-2 controller-icon"
                        style={{ background: localMedia.video ? '#40ad40d9' : "#808080" }}>
                        {localMedia.video ? (
                            <VideocamIcon style={{ color: '#fff' }} />
                        ) : (
                            <VideocamOffIcon style={{ color: '#fff' }} />
                        )}
                    </IconButton>
                    {isRotatationEnable && <IconButton onClick={handleCameraSwitch} className="p-2 m-2 controller-icon" style={{ background: 'green' }}>
                        <FlipCameraAndroidIcon style={{ color: '#fff' }} />
                    </IconButton>}
                    <IconButton onClick={confirmCallEnd} className="p-2 m-2 controller-icon" style={{ background: 'red' }}>
                        <CallEndIcon style={{ color: '#fff' }} />
                    </IconButton>

                </div>}

            </div>
            <style jsx="true">{`
                :global(.controller-icon) {
                    width: 40px;
                    height: 40px;
                }
                .timer_position {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                }
                .local-player-wrapper{
                    height: 150px;
                    width: 150px;
                    position: absolute;
                    bottom: ${mobileView ? '72px' : '0'};
                    right: 10px;
                    transition: all 0.5s;
                }
                .bottom_0 {
                    bottom: 10px;
                    transition: all 0.5s;
                }
                .remote-player-wrapper{
                    // height: calc(100vh - (70px + 40px + 60px));
                    height: 100%;
                    width: 100%;
                    justify-content: center;
                    overflow: auto;
                }
                .participant_grid{
                    height: ${gridSize}px;
                    width: ${gridSize}px;
                    min-width: 20vw;
                    min-height: 20vw; 
                    // flex-grow: 1;
                }
                .controller_icons{
                    height: fit-content;
                    position: absolute;
                    bottom: 0;
                    display: flex;
                    border-radius: 20px 20px 0 0;
                }
                .empty_room_text{
                    font-size: 2rem;
                }
                .timer__notice {
                    top: 15px;
                    z-index: 1;
                }
                .timer__dv__notice {
                    right: 15px;
                    top: 15px;
                    z-index: 1;
                }
                .status__panel {
                    display: ${isFullScreen ? 'none' : 'unset'};
                    position: absolute;
                    z-index: 1;
                    top: ${mobileView ? 60 : 15}px;
                    left: 15px;
                    padding: 0.5rem;
                    background: #00000066;
                    border-radius: 10px;
                }
                .dynamicHeight {
                    height: ${mobileView ? 'calc(var(--vhCustom, 1vh) * 100)' : '100vh'} !important;
                  }
            `}</style>
        </React.Fragment>
    )
}

export default Conference
