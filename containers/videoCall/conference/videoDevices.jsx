import React from 'react';
import { useTheme } from 'react-jss';
import isMobile from '../../../hooks/isMobile';
import useLang from '../../../hooks/language';
import { CLOSE_ICON_BLACK, BASE_COLOR, CLOSE_ICON_WHITE } from '../../../lib/config';

const VideoOptions = (props) => {
    const { onClose, videoDevicesList = [], handleChangeDevice } = props;
    const [mobileView] = isMobile();
    const theme = useTheme();
    const [lang] = useLang();

    const handleClicked = (deviceId) => {
        handleChangeDevice?.(deviceId);
        onClose();
    };
    
    return (
        <>
        <div className="col-12 py-3">
            {!mobileView && <img
                src={theme.type == "light" ? CLOSE_ICON_BLACK : CLOSE_ICON_WHITE}
                width="15"
                height="15"
                alt="Close Icon"
                className="close_option cursor-pointer"
                onClick={onClose}
            />}
            <p className={`m-0 txt-black mt-2 ${mobileView ? 'fntSz20' : 'fntSz24'}`} style={{color: BASE_COLOR}}>{lang.selectCamera}</p>
            <div className="options__div">
                
                {videoDevicesList.map((item) => (
                    <p key={item.deviceId} onClickCapture={() => handleClicked(item.deviceId)} style={{ backgroundColor: item.isSelected ? 'lavender' : '' }} className="mb-0 options_item cursor-pointer txt-book fntSz16 py-3 d-flex align-items-center">
                        {item.label}
                    </p>
                ))}
            </div>
        </div>
        <style jsx="true">
        {`
        
        .options_item {
            border-bottom: 1px solid #F0F0FA;
            color: var(--l_app_text) !important;
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

export default VideoOptions;