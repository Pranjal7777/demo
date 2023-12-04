import React from 'react';
import { useSelector } from 'react-redux';
import Router from 'next/router';
import VisibilityIcon from "@material-ui/icons/Visibility";
import { Toast } from '../../../lib/global';
import StreamLoader from '../../live-stream-tabs/streamLoader';
import isMobile from '../../../hooks/isMobile';
import { CLOSE_ICON_WHITE, GO_LIVE_SCREEN } from '../../../lib/config';
import { s3ImageLinkGen } from '../../../lib/UploadAWS/uploadAWS';
import isTablet from '../../../hooks/isTablet';

const recordedStreamPlayer = (props) => {
    const { streamData = {}, onClose } = props;
    const [mobileView] = isMobile();
    const [tabletView] = isTablet();
    // const IMAGE_LINK = useSelector((state) => state?.cloudinaryCreds?.IMAGE_LINK)
    const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);

    // All States Managed
    const [isLoading, setIsLoading] = React.useState(false);
    const [playerSet, setPlayerSet] = React.useState(false);
    const [activeIndex, setActiveIndex] = React.useState(0);
    const recordLength = streamData?.recordedUrl?.length || 0;

    // All Necessary Ref Manages
    const player =  React.useRef(null);
    const videoBoxRef = React.useRef(null);

    // Initializing IVS Player
    React.useEffect(() => {
        const { IVSPlayer } = window;
        const { isPlayerSupported } = IVSPlayer;
        const { PLAYING } = IVSPlayer?.PlayerState;
        const { ERROR } = IVSPlayer?.PlayerEventType;
        if (!isPlayerSupported) {
          Toast('Browser is Incompatible to Play Streams',"warning");
          Router.push('/');
          return;
        }
    
        player.current = IVSPlayer.create();
        player.current?.setLiveLowLatencyEnabled(true);
        player.current?.setRebufferToLive(true);
        player.current.addEventListener(PLAYING, stopStreamLoader);
        player.current.addEventListener(ERROR, () => {
          player.current?.play();
          stopStreamLoader();
        });
        const videoBox = videoBoxRef.current;
        player.current.attachHTMLVideoElement(videoBox);
        setPlayerSet(true);
    
        return () => {
          player.current?.pause();
          player.current?.removeEventListener(PLAYING, stopStreamLoader);
          player.current?.removeEventListener(ERROR, stopStreamLoader);
          player.current?.delete();
        };
      }, []);

    React.useEffect(() => {
        if (playerSet) startPlaying(streamData.recordUrl ? streamData.recordUrl[activeIndex] : streamData.recordedUrl[activeIndex]);
    }, [activeIndex, playerSet]);

    const startStreamLoader = () => {
        setIsLoading(true);
    }

    const stopStreamLoader = () => {
        setIsLoading(false);
    }

    const startPlaying = (STREAM_URL) => {
        startStreamLoader();
        player.current.pause();
        player.current.load(STREAM_URL);
        player.current.play();
      };
    
    const handleNext = () => setActiveIndex(prev => prev + 1);

    const handlePrev = () => setActiveIndex(prev => prev - 1);

    return (
        <>
        <div className="col-12 position-relative overflow-hidden stream_bg" style={{ height: '100vh' }}>
                {!!activeIndex && (
            <div className="dv_scrollPrev cursor-pointer">
                <img
                    onClick={handlePrev}
                    src={GO_LIVE_SCREEN.streamNavigateArrow}
                    width={29}
                    height={29}
                />
            </div>
            )}
                {!!((activeIndex + 1) < recordLength) && (
            <div className="dv_scrollNext cursor-pointer">
                <img
                    onClick={handleNext}
                    src={GO_LIVE_SCREEN.streamNavigateArrow}
                    width={29}
                    height={29}
                />
            </div>
            )}
            <div className="streamHeader w-100 pt-2 pb-5">
                <div className="col-12 d-flex w-100">
                    <div className="d-inline-flex align-items-center">
                        {
                            streamData.userDetails.userProfile
                            ? (
                                <img
                                    src={s3ImageLinkGen(S3_IMG_LINK, streamData.userDetails.userProfile, false, 40, 40)}
                                    style={{ border: '1px solid #fff' }}
                                    className="profilePic_streamer"
                                    alt="Profile Picture"
                                />
                            )
                            : (
                                <AvatarImage
                                    isCustom={true}
                                    className="profilePic_streamer"
                                    userName={streamData.userDetails?.firstName}
                                />
                            )
                        }
                        
                        <div className="ml-2">
                            <span className="d-block text-white txt-book fntSz14">
                                {streamData.userDetails.firstName}
                            </span>
                            <span className="totalViewers_block text-white txt-book fntSz12">
                                <VisibilityIcon style={{ width: "13px", marginRight: "5px" }} />
                                {streamData.viewersCount} Viewed
                            </span>
                        </div>
                    </div>
                    <img onClick={onClose} className="ml-auto cursorPtr" src={CLOSE_ICON_WHITE} width={20} alt="Close" />
                </div>
                <div className="col-12 d-inline-flex align-items-center txt-book text-white fntSz12 mt-2">
                    <img className="mr-2" src={GO_LIVE_SCREEN.whiteDollarIco} width={16} height={16} alt="Dollar Icon" />
                    {streamData.coinsCount}
                </div>
            </div>
            <video ref={videoBoxRef} muted controls controlsList="nodownload nofullscreen" className={mobileView ? "video__player__live mv__video_check" : "video__player__live dv__video_check"} />
                {!!isLoading && <StreamLoader loaderPic={streamData.userDetails.userProfile} />}
        </div>


        <style jsx="true">
        {`
        .stream_bg {
            background: ${mobileView ? '' : '#3A343A'};
        }
        .dv_scrollPrev {
            position: absolute;
            top: 50%;
            left: ${mobileView ? '15px' : '50%'};
            transform: translate(${mobileView ? '0' : 'calc(-50% + -19.5vw)'}, -50%);
            z-index: 10;
        }
  
        .dv_scrollNext {
            position: absolute;
            top: 50%;
            right: ${mobileView ? '15px' : '50%'};
            transform: translate(${mobileView ? '0' : 'calc(50% + 19.5vw)'}, -50%) rotate(180deg);
            z-index: 10;
        }
        .streamHeader {
            position: absolute;
            top: 0;
            left: 0;
            z-Index: 10;
            background: ${mobileView ? 'linear-gradient(180deg, #000000C4, #00000000)' : 'unset'};
        }
        .video__player__live {
            position: absolute;
            width: ${mobileView ? tabletView ? '60vw':"100%" : "33vw"};
            height: calc(var(--vhCustom, 1vh) * 100);
            object-fit: ${mobileView ? "cover" : "contain"};
          }
        .mv__video_check {
            top: 0;
            left: 0;
        }
        .dv__video_check {
            left: 50%;
            transform: translateX(-50%);
          }
        .totalViewers_block {
            background-color: var(--l_base);
            padding: 3px 6px;
            border-radius: 3px;
        }
        :global(.profilePic_streamer) {
            width: 40px;
            height: 40px;
            border-radius: 50%;
        }
        `}
        </style>
        </>
    );
};

export default recordedStreamPlayer;
