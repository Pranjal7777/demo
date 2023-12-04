import { ClickAwayListener, Tooltip } from '@material-ui/core'
import React, { useState } from 'react'
import Icon from './image/icon'
import { DV_CHAT_ICON } from '../lib/config/profile'
import isMobile from '../hooks/isMobile'
import Img from './ui/Img/Img'

const CustomTooltip = (props) => {
    const { tooltipTitle, placement, icon = "", iconId = "", image = "", size = 14 } = props;
    const [mobile] = isMobile();
    const [openToolTip, setOpenToolTip] = useState(false);


    return (
        <>
            {mobile ? <>
                <ClickAwayListener onClickAway={() => setOpenToolTip(false)} >
                    <Tooltip open={openToolTip} onClick={(e) => {
                        e.stopPropagation();
                        setOpenToolTip(!openToolTip)
                    }} placement={placement || "bottom"} title={tooltipTitle}>
                        <div>
                            {image ?
                                <Img
                                    src={image || DV_CHAT_ICON}
                                    width={size || 16}
                                    alt="Vip chat user icon"
                                /> :
                                <Icon
                                    icon={`${icon || DV_CHAT_ICON}#${iconId || "info"}`}
                                    size={size || 14}
                                    class="pl-2 pointer adjustSvg"
                                    alt="follow icon"
                                    viewBox="0 0 40 40"
                                    color="var(--l_app_text)"
                                />}
                        </div>
                    </Tooltip>
                </ClickAwayListener>
            </> :
                <Tooltip placement={placement || "bottom"} title={tooltipTitle}>
                    <div>
                        {image ?
                            <Img
                                src={image || DV_CHAT_ICON}
                                width={size || 16}
                                alt="Vip chat user icon"
                            /> :
                            <Icon
                                icon={`${icon || DV_CHAT_ICON}#${iconId || "info"}`}
                                size={size || 14}
                                class="pl-2 pointer adjustSvg"
                                alt="follow icon"
                                viewBox="0 0 40 40"
                                color="var(--l_app_text)"
                            />}
                    </div>
                </Tooltip>}
            <style jsx>{`
                    :global(.MuiTooltip-tooltipPlacementBottom){
                        background:var(--l_input_bg_color);
                        color:var(--l_app_text);
                        opacity:1;
                      }
                `}</style>
        </>
    )
}

export default CustomTooltip