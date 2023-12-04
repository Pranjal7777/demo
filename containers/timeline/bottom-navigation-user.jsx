import dynamic from "next/dynamic";
import Route from "next/router";
import { useTheme } from "react-jss";
const Badge = dynamic(() => import("@material-ui/core/Badge"));
import { useSelector } from "react-redux";
import { isCameoTheme } from "../../lib/config/homepage";
import { EXPLORE_ICON, HOME_ACTIVE, markatePlacehomeIcon, NAV_CHAT_ICON, PLAY_ICON } from "../../lib/config/logo";
import { SIDEBAR_HOME, SIDEBAR_LIVE, SIDEBAR_MESSAGE, SIDEBAR_SEARCH } from "../../lib/config";
const Icon = dynamic(() => import("../../components/image/icon"), { ssr: false });

export default function BottomNavigation(props) {
  const theme = useTheme();
  const { tabType } = props;
  const chatNotificationCount = useSelector((state) => state?.chatNotificationCount)

  return (
    <div className="mv_btm_nav_user">
      <div className="col-12">
        <div className="row justify-content-around align-items-center py-3">
          {/* Home */}
          {isCameoTheme && <div
            className="col-auto"
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

          {/* Popular/Latest Tab */}
          <div
            className="col-auto d-flex flex-column align-items-center justify-content-end"
            onClick={() => {
              props.setActiveState("social");
              Route.push("/social");
            }}
          >
            <Icon
              icon={`${SIDEBAR_HOME}#homeicon`}
              color={tabType === "social" ? "var(--l_base)" : (theme.type !== "light" ? "#F5D0FF" : "#5F596B")}
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
            <span className={`${tabType === "hashtag" && "gradient_text"} w-500 fntSz13`}>Explore</span>
          </div>

          {/* Live Stream */}
          <div
            className="col-auto d-flex flex-column align-items-center justify-content-end"
            onClick={() => {
              props?.setActiveState("live");
              Route.push("/live/popular");
            }}
          >
            <Icon
              icon={`${SIDEBAR_LIVE}#liveicon`}
              color={tabType === "live" ? "var(--l_base)" : (theme.type !== "light" ? "#F5D0FF" : "#5F596B")}
              width={24}
              height={22}
              alt="home_icon"
            />
            <span className={`${tabType === "live" && "gradient_text"} w-500 fntSz13`}>Live</span>
          </div>

          {/* Chat Icon */}
          <div
            className="col-auto d-flex flex-column align-items-center justify-content-end"
            onClick={() => {
              props.setActiveState("chat");
              Route.push("/chat");
            }}
          >
            <Badge badgeContent={chatNotificationCount} color="secondary">
              <Icon
                icon={`${SIDEBAR_MESSAGE}#messageicon`}
                color={tabType === "chat" ? "var(--l_base)" : (theme.type !== "light" ? "#F5D0FF" : "#5F596B")}
                width={24}
                height={22}
                alt="home_icon"
              />
            </Badge>
            <span className={`${tabType === "chat" && "gradient_text"} w-500 fntSz13`}>Messages</span>
          </div>
        </div>
      </div>
    </div>
  );
}
