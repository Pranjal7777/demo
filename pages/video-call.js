import React, { useRef, useState } from "react";
import { useTheme } from "react-jss";
import { getCookie } from "../lib/session";
import isMobile from "../hooks/isMobile";
import Wrapper from "../hoc/Wrapper";
import useLang from "../hooks/language";
import Homepage from "../containers/videoCall";
import dynamic from "next/dynamic";
import DvHomeLayout from "../containers/DvHomeLayout";
import RouterContext from "../context/RouterContext";

function videoCall(props) {
  const { query } = props;
  const auth = getCookie("auth");
  const theme = useTheme();
  const homePageref = useRef(null);
  const [mobileView] = isMobile();

  // const { tab = "timeline" } = query;
  const [activeNavigationTab, setActiveNavigationTab] = useState("timeline");

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
    <RouterContext forLogin={true} forUser={false} forCreator={true} forAgency={true} {...props}>
      <div className={`mv_wrap_videoCall ${mobileView ? "bg_color" : ""} dynamicHeight`} ref={homePageref} id="home-page">
        {mobileView ? (
          <Wrapper>
            {activeNavigationTab === "timeline" && (
              <Homepage homePageref={homePageref} />
            )}
          </Wrapper>
        ) : (
          <Wrapper>
            <DvHomeLayout
              setActiveState={(props) => {
                setActiveNavigationTab(props);
              }}
              activeLink="video-call"
              homePageref={homePageref}
              withMore
              {...props}
            ></DvHomeLayout>
          </Wrapper>
        )}
        <style jsx>
          {`
        .confirmBtn{
          position: fixed;
          width: 100%;
          bottom: 0;
        }
        .dynamicHeight {
          height: calc(var(--vhCustom, 1vh) * 100) !important;
        }
        `}
        </style>
      </div>
    </RouterContext>
  );
}

export default videoCall;
