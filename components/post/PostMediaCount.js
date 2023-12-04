import * as React from 'react';
import { IMAGE_OUTLINE_ICON, VIDEO_OUTLINE_ICON } from '../../lib/config';
import Icon from '../image/icon';
import isMobile from '../../hooks/isMobile';

export const PostMediaCount = ({ imageCount, videoCount, iconSize = 20, fontSize, iconSizeMobile = 16 }) => {
    const [mobileView] = isMobile()
    return (
        <div className="d-flex align-items-cnter">
            {
                imageCount ? <div className="countItem d-flex align-items-center imgCount">
                    <Icon
                        icon={`${IMAGE_OUTLINE_ICON}#image_outline`}
                        width={mobileView ? iconSizeMobile : iconSize}
                        height={mobileView ? iconSizeMobile : iconSize}
                        color='#fff'
                        class='cursorPtr noLineHeight'
                        viewBox="0 0 88 88"
                        size={iconSize}
                    />
                    <div className='ml-2 d-flex noLineHeight align-items-cnter text-white'>{imageCount}</div>
                </div> : ""
            }

            {
                videoCount ? <div className={`${imageCount ?'ml-2' : ''} countItem d-flex align-items-cnter f vidCount`}>
                    <Icon
                        width={mobileView ? iconSizeMobile : iconSize}
                        height={mobileView ? iconSizeMobile : iconSize}
                        icon={`${VIDEO_OUTLINE_ICON}#video_outline`}
                        color='#ffffff'
                        class='cursorPtr noLineHeight'
                        viewBox="0 0 88 88"
                        size={iconSize}
                    />
                    <div className='ml-2 d-flex align-items-center text-white noLineHeight'>{videoCount}</div>
                </div> : ""
            }
            <style jsx>
                {`
                    .countItem {
                        padding: ${mobileView ? '8px 12px' : '12px 14px'};
                        background: var(--l_badge_light);
                        border-radius: 24px;
                    }
                    .countItem div{
                        font-size: ${fontSize ? fontSize : mobileView ? '12px' : '18px'};
                    }
                    .countItem {
                        line-height: 16px;
                    }
                    `}
            </style>
        </div>
    );
};