import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "react-jss";
import Wrapper from "../../hoc/Wrapper";
import isMobile from "../../hooks/isMobile";
import HomePLPpage from "../../containers/UserCategories/homePLPpage";
const TimelineHeader = dynamic(() => import("../../containers/timeline/timeline-header"));
const MarkatePlaceHeader = dynamic(() => import("../../containers/markatePlaceHeader/markatePlaceHeader"));
import { getCookie } from "../../lib/session";
import { useSelector } from "react-redux";
const ModelBottomNavigation = dynamic(() => import("../../containers/timeline/bottom-navigation-model"), { ssr: false });
const DesktopFooter = dynamic(() => import("../../containers/timeline/desktop_footer"))
const UserBottomNavigation = dynamic(() => import("../../containers/timeline/bottom-navigation-user"), { ssr: false });

const HomePageComp = (props) => {
  const [mobileView] = isMobile();
  const [activeNavigationTab, setActiveNavigationTab] = useState("homepage");
  const [renderFooter, setRenderFooter] = useState(false);
  const theme = useTheme();
  const userType = getCookie("userType");
  const profile = useSelector((state) => state.profileData);

  return (
    <Wrapper>
      <div id="top" className="pageScroll">
        {mobileView ? (
          <TimelineHeader
            setActiveState={(props) => {
              setActiveNavigationTab(props);
            }}
            scrollAndRedirect={async (e) => {
              let sc = await document.getElementById("top");
              sc.scrollIntoView({ behavior: "smooth" });
            }}
            {...props}
          />
        ) : (
          <>
            <MarkatePlaceHeader
              setActiveState={(props) => {
                setActiveNavigationTab(props);
              }}
              {...props}
            />
          </>
        )}

        <div
          className={`${mobileView ? "col-12 px-0 d-flex flex-column" : ""
            } web_main_div`}
          style={{ marginBottom: mobileView ? "auto" : "0" }}
        >
          <HomePLPpage displayFooter={(isRender) => setRenderFooter(isRender)} changeTheme={props?.changeTheme} />
        </div>
        <div style={{ height: mobileView ? "60px" : "0" }}></div>
        {mobileView && (
          <div
            className={`${mobileView ? "col-12 d-flex" : "websiteContainer"}`}
          >
            {profile?.userTypeCode === 2 || userType === 2 ? <ModelBottomNavigation
              setActiveState={(props) => {
                setActiveNavigationTab(props);
              }}
              tabType={activeNavigationTab}
            /> : <UserBottomNavigation
              setActiveState={(props) => {
                setActiveNavigationTab(props);
              }}
              tabType={activeNavigationTab}
            />
            }
          </div>
        )}
        {!mobileView && <DesktopFooter />}
      </div>
      <style jsx>
        {`
          .pageScroll {
            overflow-y: auto !important;
            height: 100%;
            background: ${theme?.markatePlaceBackground}
          }

          #top {
            scroll-behavior: smooth;
          }

          :global(.markatePlaceContainer){
            width: 92.359vw;
            margin: 0 auto;
          }

          .web_main_div {
            padding-top: ${mobileView ? "2px" : "80px"};
            padding-bottom: 20px;
          }
        `}
      </style>
    </Wrapper>
  );
};

export default HomePageComp;
