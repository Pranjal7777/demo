import * as React from 'react';
import { MessageFooter } from './MessageFooter';
import isMobile from '../../../hooks/isMobile';
import useLang from '../../../hooks/language';
import { useRouter } from 'next/router';
import useProfileData from '../../../hooks/useProfileData';

export const CustomMsgWrapper = ({ message, isSelf, allowDelete=false, wrapClass = 'wrapClass', coversation, messageMenu, setMenuOpen, ...props }) => {
    const [mobileView] = isMobile()
    const [lang] = useLang()
    const router = useRouter()
    const [profile] = useProfileData()

    var onlongtouch;
    var timer;
    var touchduration = 200; //length of time we want the user to touch before we do something

    function touchstart(e) {
        console.log("touch start")
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(onlongtouch, touchduration);
    }

    function touchend(e) {
        //stops short touches from firing the event
        if (timer)
            clearTimeout(timer);
        // setMenuOpen(false)
        // clearTimeout, not cleartimeout..
    }

    onlongtouch = function () { setMenuOpen(true) };

    return (
        <>
            <div className={`msgWrap ${wrapClass} ${isSelf ? 'user_self_chat' : 'user_chat'}`} onTouchStart={isSelf ? touchstart : () => { return }} onTouchEnd={isSelf ? touchend : () => { return }} onMouseLeave={() => setMenuOpen(false)}>
                {
                   (allowDelete || profile?.userTypeCode == 2) && isSelf ? <div className='deletedropDown'>{messageMenu}</div> : <></>
                }
                {props.children}
                <MessageFooter message={message} isSelf={isSelf} />
            </div>
            <style jsx>
                {`
             .msgWrap {
                padding:  ${mobileView ? '8px' : isSelf ? '20px 16px' : '16px'};
                border-radius: 20px;
                position: relative;
                max-width: ${mobileView ? '316px' : '382px'};
                min-width: ${mobileView ? '316px' : '382px'};
                margin-left: ${isSelf ? 'auto' : '0px'};
                margin-right: ${isSelf ? '0px' : 'auto'};
             }
             .msgWrap:hover .deletedropDown {
                display: block;
             }
              .deletedropDown {
                display: none;
                position: absolute;
                right: 7px;
                top: -3px;
              }
            `}
            </style>
        </>
    )
};