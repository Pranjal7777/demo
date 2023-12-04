import React, { useState } from 'react';
import { useTheme } from 'react-jss';
import isMobile from '../../../hooks/isMobile';
import { CLOSE_ICON_BLACK, GO_LIVE_SCREEN, BASE_COLOR, CLOSE_ICON_WHITE } from '../../../lib/config';

const streamSettings = (props) => {
    const { onClose, audioDisabled = false, chatHidden = false, videoDisabled = false, handleSettings, viewerSide = false, latencyInfoHidden = false } = props;
    const [mobileView] = isMobile();
    const theme = useTheme();
    // const [optionsArray, setOptionsArray] = useState([]);
    // const [isAudioDisabled, setIsAudioDisabled] = useState(audioDisabled);
    // const [isChatHidden, setIsChatHidden] = useState(chatHidden);
    // const [isVideoDisabled, setIsVideoDisabled] = useState(videoDisabled);

    const handleAudioMuteOption = () => {
        handleSettings('TOGGLE_AUDIO');
        onClose();
        // setIsAudioDisabled((prev) => !prev);
    };

    const handleHideChatOption = () => {
        handleSettings('TOGGLE_CHAT');
        // setIsChatHidden((prev) => !prev);
        onClose();
    };

    const handleVideoMuteOption = () => {
        handleSettings('TOGGLE_VIDEO');
        onClose();
        // setIsVideoDisabled((prev) => !prev);
    };

    const handleLatencyInfoOption = () => {
        handleSettings('TOGGLE_LATENCY_INFO');
        onClose();
    }

    // React.useEffect(() => {
    //     const optionsToShow = [
    //         {
    //             icon: GO_LIVE_SCREEN.audioMuteIco,
    //             label: 'Mute My Audio',
    //             handleClick: () => {},
    //             isSelected: audioDisabled
    //         },
    //         {
    //             icon: GO_LIVE_SCREEN.chatHideIco,
    //             label: 'Hide Chat Messages',
    //             handleClick: () => {},
    //             isSelected: chatHidden
    //         },
    //     ];
    //     setOptionsArray(optionsToShow);
    // }, []);

    return (
        <>
            <div className="col-12 py-3 card_bg">
                {!mobileView && <img
                    src={theme.type == "light" ? CLOSE_ICON_BLACK : CLOSE_ICON_WHITE}
                    width="15"
                    height="15"
                    alt="Close Icon"
                    className="close_option cursor-pointer"
                    onClick={onClose}
                />}
                <p className={`m-0 txt-black mt-2 ${mobileView ? 'fntSz20' : 'fntSz24'}`} style={{ color: BASE_COLOR }}>Settings</p>
                <div className="options__div text-app">
                    {!viewerSide && <p onClick={handleAudioMuteOption} style={{ backgroundColor: audioDisabled ? 'lavender' : '', color: audioDisabled ? 'black' : '' }} className={` ${audioDisabled ? "text-black" : ""} $ mb-0 options_item cursor-pointer txt-book fntSz16 py-3 d-flex align-items-center`}>
                        <img className={mobileView ? "mr-3" : "mx-3"} src={GO_LIVE_SCREEN.audioMuteIco} height={24} alt="Mute My Audio" />
                        Mute My Audio
                    </p>}
                    {!viewerSide && <p onClick={handleVideoMuteOption} style={{ backgroundColor: videoDisabled ? 'lavender' : '' }} className={` ${videoDisabled ? "text-black" : ""} $ mb-0 options_item cursor-pointer txt-book fntSz16 py-3 d-flex align-items-center`}>
                        <img className={mobileView ? "mr-3" : "mx-3"} src={GO_LIVE_SCREEN.audioMuteIco} height={24} alt="Mute My Video" />
                        Mute My Video
                    </p>}
                    <p onClick={handleHideChatOption} style={{ backgroundColor: chatHidden ? 'lavender' : '' }} className={` ${chatHidden ? "text-black" : ""} $ mb-0 options_item cursor-pointer txt-book fntSz16 py-3 d-flex align-items-center`}>
                        <img className={mobileView ? "mr-3" : "mx-3"} src={GO_LIVE_SCREEN.chatHideIco} height={24} alt="Hide Chat Messages" />
                        Hide Chat Messages
                    </p>
                    {/* {viewerSide && <p onClick={handleLatencyInfoOption} style={{ backgroundColor: latencyInfoHidden? 'lavender' : '' }} className="mb-0 options_item cursor-pointer txt-book fntSz16 py-3 d-flex align-items-center">
                    <img className={mobileView ? "mr-3" : "mx-3"} src={GO_LIVE_SCREEN.chatHideIco} height={24} alt="Show Latency" />
                    Show Latency Info
                </p>} */}
                    {/* {optionsArray.map((item) => (
                    <p style={{ backgroundColor: item.isSelected ? 'lavender' : '' }} className="mb-0 options_item cursor-pointer txt-book fntSz16 py-3 d-flex align-items-center" onClick={item.handleClick}>
                        <img className={mobileView ? "mr-3" : "mx-3"} src={item.icon} height={24} alt={item.label} />
                        {item.label}
                    </p>
                ))} */}
                </div>
            </div>
            <style jsx="true">
                {`
        
        .options_item {
            border-bottom: 1px solid #F0F0FA;
            color: var(--l_app_text) ;
        }
        .close_option{
            position: absolute;
            top: 1.5rem;
            right: 1rem;
        }
        `}
            </style>
        </>
    )
}

export default streamSettings;
