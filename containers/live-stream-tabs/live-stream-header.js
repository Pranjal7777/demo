import React, { useEffect } from "react";
import { useTheme } from "react-jss";
import isMobile from "../../hooks/isMobile";
import * as config from "../../lib/config";
import Router from 'next/router';

import InputBox from "../../components/input-box/input-box";
import Icon from "../../components/image/icon";
import { open_drawer } from "../../lib/global";
import VideocamIcon from "@material-ui/icons/Videocam";
import { Tooltip } from "@material-ui/core";
import Button from "../../components/button/button";
import useProfileData from "../../hooks/useProfileData";
import { getCookie } from "../../lib/session";
import { HUMBERGER_ICON } from "../../lib/config/header";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { s3ImageLinkGen } from "../../lib/UploadAWS/s3ImageLinkGen";
const Avatar = dynamic(() => import("@material-ui/core/Avatar"), { ssr: false });

const LiveStreamHeader = (props) => {
  const { activeTab } = props;
  const [mobileView] = isMobile();
  const [profileData] = useProfileData();
  const auth = getCookie("auth");
  const theme = useTheme();
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);

  const handleNavigationMenu = () => {
    open_drawer("SideNavMenu", {
      paperClass: "backNavMenu",
      setActiveState: props.setActiveState,
      noBorderRadius: true,
      ...props,
    }, "right"
    );
  };
  useEffect(() => {
    try {
      $('[data-toggle="tooltip"]')?.tooltip();
    } catch (error) {
      console.log(error, "error")
    }
  }, [])

  return (
    <>
      <div className={`d-flex flex-row justify-content-between align-items-center px-3 pt-3 pt-md-0`}>
        <div className="d-flex flex-row gap_8">
          <div>
            <Button
              type="button"
              fclassname={`rounded-pill borderStroke py-2 ${activeTab === 'popular' ? "btnGradient_bg" : "background_none"}`}
              onClick={() => Router.push('/live/popular')}
              children={"Popular"}
            />
          </div>
          <div>
            <Button
              type="button"
              fclassname={`rounded-pill borderStroke py-2 ${activeTab === 'following' ? "btnGradient_bg" : "background_none"}`}
              onClick={() => Router.push('/live/following')}
              children={"Following"}
            />
          </div>
          <div>
            <Button
              type="button"
              fclassname={`rounded-pill borderStroke py-2 ${activeTab === 'upcoming' ? "btnGradient_bg" : "background_none"}`}
              onClick={() => Router.push('/live/upcoming')}
              children={"Upcoming"}
            />
          </div>
        </div>


        <div className="d-flex flex-row align-items-center gap_8" style={mobileView ? { position: "absolute", left: "calc(50% - 46px)", bottom: "13vh", zIndex: "9" } : {}}>
          {!mobileView && props?.profileData?.userTypeCode == 2 && <div className="d-flex align-items-center">
            <Tooltip title={props.lang.liveStreamCreatorInfo} classes={{ popper: "custom-stream-tooltip" }}>
              <img className="cursorPtr col-auto p-0 ml-auto upcomingInfoIcon" src={config.GO_LIVE_SCREEN.infoIco} width={32} height={32} alt="info option" />

            </Tooltip>
          </div>}
          {props?.profileData?.userTypeCode == 2 && <div>
            <Button
              type="button"
              fclassname={`rounded-pill py-2 btnGradient_bg`}
              onClick={(e) => props.verifyAccount(e)}
            >
              <span>
                <VideocamIcon style={{ color: "#fff" }} />
              </span>
              <span className="pl-2 font-weight-600 text-white">Live</span>
            </Button>
          </div>}
        </div>
        {mobileView && (
          <div
            className="col-auto pr-0"
            onClick={handleNavigationMenu}
          >
            {auth ? profileData.profilePic ? <Avatar style={{ height: '32px', width: '32px' }} className='profile-pic base-border-1' alt={profileData.firstName} src={s3ImageLinkGen(S3_IMG_LINK, profileData?.profilePic)} />
              : <div className="tagUserProfileImage base-border-1">{profileData?.firstName?.[0] + (profileData?.lastName && profileData?.lastName?.[0])}</div>
              : <Icon
                icon={`${HUMBERGER_ICON}#humberger_menu`}
                color={theme.type === "light" ? theme.markatePlaceLabelColor : theme.text}
                width={24}
                height={22}
                class="mr-3"
                alt="humnerger_menu"
                viewBox="0 0 22.003 14.669"
              />}
          </div>
        )}
      </div>
      {mobileView && <div className="position-relative container mx-0 py-3  d-flex justify-content-center align-items-center w-100">
        <div className=" position-relative" style={{ width: props?.profileData?.userTypeCode == 2 ? "85%" : "100%" }}>
          <InputBox
            placeholder="Search"
            autoComplete="off"
            cssStyles={theme.search_input}
          />
          <Icon
            icon={`${config.SEARCHBAR_ICON}#searchBar`}
            color={"#4e586e"}
            width={mobileView ? 18 : 13}
            height={22}
            class={mobileView ? "mv_search_icon" : "dv__search_icon"}
            viewBox="0 0 511.999 511.999"
          />
        </div>
        {props?.profileData?.userTypeCode == 2 && <img data-toggle="tooltip" data-placement="bottom"
          className="cursorPtr col-auto p-0 ml-auto upcomingInfoIcon d-flex align-items-center custom-tooltip" data-class="custom-tooltip" title={props.lang.liveStreamCreatorInfo} src={config.GO_LIVE_SCREEN.infoIco} width={32} height={32} alt="info option" />
        }
      </div>}
      <style jsx>{`
        .liveStreamTab {
          border: 1px solid black;
          border-radius: 30px;
          padding: 5px 3px;
        }
        .tabCss {
          background: #f1f2f6;
          color: #b1b6d1;
          border: none;
          font-size: 14px;
          font-weight: 600;
        }
        .activeTab {
          background: var(--l_base);
          color: #fff;
          border: none;
          font-size: 14px;
          font-weight: 600;
        }
        .headerCss {
          position: sticky;
          top: 0px;
          z-index: ${mobileView ? 99 : 2};
          background: var(--l_app_bg);
          border-bottom: ${mobileView && '1px solid #3D3B45'}
        }
        .content__UL{
          // justify-content: space-around;
        }
        .content__UL li{
          flex-basis: 13%;
          flex-grow: 0;
          margin: ${mobileView ? '0.4rem' : '0.5rem'}
        }
        .content__UL li a{
          background: ${theme.palette.l_drawer_bg};
          color: ${theme.d_label} !important;
          border: none;
          font-size: 14px;
          font-weight: 600;
          border-radius: 30px;
          padding-top: ${mobileView ? 5 : 9}px;
          padding-bottom: ${mobileView ? 7 : 11}px;
          width: 100%;
        }
        .content__UL li a.active{
          background: ${theme.palette.l_base};
          color: #fff !important;
          border: none;
          font-size: 14px;
          font-weight: 600;
        }
        :global(.mv_search_icon){
          left:8%
        }
        :global(.tooltip-inner) {
          max-width: 260px !important;  
        }
        :global(.custom-tooltip .arrow::before) {
          border-top-width: 0.4rem;
          border-bottom-width: 0.4rem;
          border-top-color: #000;
        }
        :global(.custom-stream-tooltip > div){
          background:#000;
          text-align:left;
        }
      `}</style>
    </>
  );
};

export default LiveStreamHeader;
