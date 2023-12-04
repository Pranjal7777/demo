import React from "react";
import LiveVideoScreen from "../../live-stream-tabs/live-video-screen/live-video-screen";

const goLiveScreen = (props) => {
  
  const setCustomVhToBody = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vhCustom', `${vh}px`);
  };

  React.useEffect(() => {
    setCustomVhToBody();
    window.addEventListener('resize', setCustomVhToBody);

    return () => {
      window.removeEventListener('resize', setCustomVhToBody);
    };
  }, []);

  return (
    <div className="body__screen" style={{width: '100vw', height: 'calc(var(--vhCustom, 1vh) * 100)'}}>
      <LiveVideoScreen {...props} />
    </div>
  );
};
export default goLiveScreen;