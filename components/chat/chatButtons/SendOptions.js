// @flow 
import * as React from 'react';
import { CHAT_CAMERA, CHAT_DOC, CHAT_GALLERY } from '../../../lib/config/chat';
import Img from '../../ui/Img/Img';
import isMobile from '../../../hooks/isMobile';
import Image from '../../image/image';
import { CLOSE_ICON_BLACK, CLOSE_WHITE } from '../../../lib/config';
import { useTheme } from 'react-jss';
export const SendOptions = ({ options, handleOpenClose, showOptions, onOptionClick, onMediaSelect }) => {
    const [mobileView] = isMobile();
    const theme = useTheme()
    const attachOptions = [{ id: 0, title: 'Camera', imageUrl: window.origin + CHAT_CAMERA }, { id: 'media', title: 'Photos & Videos', imageUrl: window.location.origin + CHAT_GALLERY, onClick: onMediaSelect }, { id: 1, title: 'Document', imageUrl: window.origin + CHAT_DOC }];
    
    React.useEffect(() => {
        if(showOptions)
        onMediaSelect()
    }, [showOptions])
    
    if (!showOptions) return <></>
    return (
        <div className='sendOptions'>
            {/* {mobileView ? <div className='clos_icon cursorPtr d-flex justify-content-end mr-3 mt-2'>
                <Image
                    src={`${theme.type == "light" ? CLOSE_ICON_BLACK : CLOSE_WHITE}`}
                    onClick={() => handleOpenClose(false)}
                    color="white"
                    width="20"
                    alt="close_icon"
                    style={{ marginBottom: "4px" }}
                />
            </div> : <></>}
            {
                attachOptions.map((option) => (<div className='attachItem d-flex align-items-center px-3 py-2 cursorPtr' onClick={() => option.onClick ? option.onClick(option) : onOptionClick(option)}>
                    <div className='attachIcon'>
                        <Img
                            src={option.imageUrl}
                            height={28}
                            height={28}
                        />
                    </div>
                    <div className='attachTitle ml-2 dv_appTxtClr'>{option.title}</div>
                </div>))
            } */}
            {/* <style jsx>
                {
                    `
                // .sendOptions {
                //    position: absolute;
                //    bottom: ${mobileView ? '0' : '60px'};
                //    right: ${mobileView ? '0' : '20px'};
                //    background-color: var(--l_app_bg);
                //    z-index: 200;
                //    border-radius: 18px;
                //    padding: 10px 0;
                //    box-shadow: 0px 4px 4px 0px #00000040;
                //    width: ${mobileView ? '100vw' : 'auto'};
                // }
                .attachItem {
                    justify-content: ${mobileView ? 'center' : 'flex-start'};
                    -webkit-justify-content: ${mobileView ? 'center' : 'flex-start'};
                }
                .attachTitle {
                    white-space: nowrap;
                }
                `
                }
            </style> */}
        </div>
    );
};