import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { useTheme } from 'react-jss';
const IconButton = dynamic(() => import('@material-ui/core/IconButton'));
import ScrollTopEvent from '../pagination/ScrollTopEvent';
import Icon from '../image/icon';
import { Arrow_Left2, BACK_TO_TOP } from '../../lib/config/homepage';
import isMobile from '../../hooks/isMobile';
import { useSelector } from 'react-redux';
const ScrollToTop = () => {
    const theme = useTheme();
    const [mobileView] = isMobile();
    const [scrollToTop, setScrollToTop] = useState(false);
    const statusCode = useSelector((state) => state.profileData.statusCode)

    const handleScroller = (flag) => {
        if (flag != scrollToTop) {
            setScrollToTop(flag);
        }
    };

    return (
        <div className='position-reltive'>
            {/* Back To Top Button */}
            <ScrollTopEvent
                scrollerEvent={(flag) => handleScroller(flag)}
            />
            {scrollToTop && (
                <div className='dynamicButtom'
                    style={{
                        position: "fixed",
                    }}
                >
                    <div
                        className="rounded-pill cursorPtr"
                        style={{background: "linear-gradient(96.81deg, #D33AFF 0%, #FF71A4 100%)"}}
                        onClick={(e) => {
                            document
                                .getElementById("top")
                                .scrollIntoView({ behavior: "smooth" });
                        }}>
                        <Icon
                            icon={Arrow_Left2 + "#arrowleft2"}
                            color={"#fff"}
                            width={24}
                            height={24}
                            style={{ padding: '12px', lineHeight: "0px", transform: "rotatez(90deg)" }}
                            viewBox="0 0 24 24"
                        />
                    </div>
                </div>
            )}
            <style jsx>{`
            .dynamicButtom{
                bottom: ${mobileView ? "80px" : statusCode === 1 ? "40px" : "8vh"};
                right: ${mobileView ? "20px" : statusCode === 1 ? "40px" : "40px"};
                z-index: 1100;
            }
            `}</style>
        </div>
    )
}

export default ScrollToTop;