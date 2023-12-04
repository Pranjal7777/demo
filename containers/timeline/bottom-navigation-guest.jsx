import React from "react";
import Route from "next/router";
import { authenticate } from "../../lib/global/routeAuth";
import Icon from "../../components/image/icon";
import FixedBottonSnackbar from "../../components/snackbar/fixed-botton-snackbar";
import { useTheme } from "react-jss";
import { isCameoTheme } from "../../lib/config/homepage";
import { EXPLORE_ICON, HOME_ACTIVE, markatePlacehomeIcon, NAV_CHAT_ICON, PLAY_ICON, PROFILE_INACTIVE_ICON } from "../../lib/config/logo";
import { SIDEBAR_HOME, SIDEBAR_SEARCH } from "../../lib/config";
import { useRouter } from 'next/router';

export default function BottomNavigation(props) {
  const theme = useTheme();
  //const [ tabType , setActiveState ] = useState("dashboard");
  const { tabType } = props;
  const router = useRouter();

  return (
    <div className="mv_btm_nav_creator">
      <FixedBottonSnackbar />
      <div className="col-12">
        <div className="row justify-content-around align-items-center py-3">

          {/* Homepage */}
          {isCameoTheme && <div
            className="col-auto d-flex flex-column align-items-center justify-content-end"
            onClick={() => {
              props.setActiveState("timeline");
              Route.push("/");
            }}
          >
            <Icon
              icon={`${markatePlacehomeIcon}#HomeIcon`}
              color={props.tabType === "timeline" ? theme.appColor : theme.palette.l_light_grey1}
              size={props.tabType === "timeline" ? 24 : 24}
              height={27}
              viewBox="0 0 25.001 25"
            />
          </div>}


          {/* Popular/Latest page */}
          <div
            className="col-auto d-flex flex-column align-items-center justify-content-end"
            onClick={() => {
              props.setActiveState("login");
              Route.push(`/login?${router.asPath.slice(1)}`);
            }}
          >
            <Icon
              icon={`${SIDEBAR_HOME}#homeicon`}
              color={(theme.type !== "light" ? "#F5D0FF" : "#5F596B")}
              width={24}
              height={22}
              alt="home_icon"
              viewBox="0 0 24 22"
            />
            <span className={`${tabType === "social" && "gradient_text"} w-500 fntSz13`}>Home</span>
          </div>

          {/* Hashtag */}
          <div
            className="col-auto d-flex flex-column align-items-center justify-content-end"
            onClick={() => {
              props.setActiveState("hashtag");
              Route.push("/explore");
            }}
          >
            <Icon
              icon={`${SIDEBAR_SEARCH}#searchicon`}
              color={tabType === "hashtag" ? "var(--l_base)" : (theme.type !== "light" ? "#F5D0FF" : "#5F596B")}
              width={24}
              height={22}
              alt="home_icon"
            />
            <span className={`${props.tabType === "hashtag" && "gradient_text"} w-500 fntSz13`}>Explore</span>
          </div>

          {/* Profile */}
          <div
            className="col-auto d-flex flex-column align-items-center justify-content-end"
            onClick={() => { Route.push("/signup-as-user"); }}
          >
            <Icon
              icon={`${PROFILE_INACTIVE_ICON}#profile`}
              color={tabType === "profile" ? theme.appColor : theme.palette.l_light_grey1}
              size={tabType === "profile" ? 27 : 27}
            />
            <span className={`w-500 fntSz13`}>Signup</span>
          </div>
        </div>
      </div>

    </div>
  );
}
