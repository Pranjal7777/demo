import React, { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import { createPortal } from 'react-dom';

const LottieAnimation = ({ animationFile, handleCompleteAnim }) => {
    const animationContainer = useRef(null);
    let animationInstance = null;

    useEffect(() => {
        animationInstance = lottie.loadAnimation({
            container: animationContainer.current,
            animationData: animationFile,
            renderer: 'svg',
            loop: false,
            autoplay: true,
        });
        animationInstance.addEventListener('complete', handleAnimationComplete);

        return () => {
            animationInstance.destroy();
        };
    }, []);

    const handleAnimationComplete = () => {
        handleCompleteAnim()
    };

    return createPortal(<div
        ref={animationContainer}
        style={{
            width: '100vw',
            height: '100vh',
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
        }}
    />, document.getElementById("animationId"))

};

export default LottieAnimation;