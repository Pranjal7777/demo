import dynamic from "next/dynamic";
import Route from "next/router";
import { useTheme } from "react-jss";
const Badge = dynamic(() => import("@material-ui/core/Badge"));
import { useSelector } from "react-redux";
import { drawerToast } from "../../lib/global/loader";
import { sendMail } from "../../lib/global/routeAuth";
import useLang from "../../hooks/language";
import isMobile from "../../hooks/isMobile";
import { isCameoTheme } from "../../lib/config/homepage";
import { EXPLORE_ICON, HOME_ACTIVE, markatePlacehomeIcon, NAV_CHAT_ICON, PLAY_ICON, POSTING_ICON } from "../../lib/config/logo";
import Icon from "../../components/image/icon";
import { open_drawer } from "../../lib/global";
import { SIDEBAR_HOME, SIDEBAR_LIVE, SIDEBAR_MESSAGE, SIDEBAR_SEARCH } from "../../lib/config";
const ProgressLoader = dynamic(() => import("../../components/loader/prograsLoader"), { ssr: false });

export default function BottomNavigation(props) {
  const theme = useTheme();
  //const [ tabType , setActiveState ] = useState("dashboard");
  const { tabType } = props;
  const [lang] = useLang();
  const profile = useSelector((state) => state.profileData);
  const chatNotificationCount = useSelector((state) => state?.chatNotificationCount)
  const [mobileView] = isMobile();


  const verifyAccount = (e) => {
    e.preventDefault();
    if (profile && profile.statusCode == 5) {
      return drawerToast({
        closing_time: 10000,
        title: lang.submitted,
        desc: lang.unverifiedProfile,
        closeIconVisible: true,
        button: {
          text: lang.contactUs,
          onClick: () => {
            sendMail();
          },
        },
        titleClass: "max-full",
        autoClose: true,
        isMobile: true,
      });
    } else {
      // props.setActiveState("post");
      // Route.push("/post");
      open_drawer('CREATE_POST', {}, 'bottom')
    }
  };

  return (
    <div className="mv_btm_nav_creator">
      {props.uploading && <ProgressLoader />}
      <div className="col-12">
        <div className="row justify-content-around align-items-center py-3">

          {/* Homepage */}
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

          {/* Popular/Latest Post */}
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
            <span className={`${props.tabType === "social" && "gradient_text"} w-500 fntSz13`}>Home</span>
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

          {/* Post Media */}
          {!isCameoTheme && <div
            className="col-auto d-flex flex-column align-items-center justify-content-end"
            onClick={(e) => {
              verifyAccount(e);
            }}
          >
            <Icon
              icon={`${POSTING_ICON}#posting`}
              color={tabType === "posting" ? "var(--l_base)" : (theme.type !== "light" ? "#F5D0FF" : "#5F596B")}
              width={24}
              height={22}
              alt="home_icon"
            />
            <span className={`${props.tabType === "posting" && "gradient_text"} w-500 fntSz13`}>Create</span>
          </div>}

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

          {/* Chat */}
          <div
            className="col-auto d-flex flex-column align-items-center justify-content-end"
            onClick={() => {
              props?.setActiveState("chat");
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
            <span className={`${props.tabType === "chat" && "gradient_text"} w-500 fntSz13`}>Messages</span>
          </div>
        </div>
      </div>
      <style jsx>{`
              :global(.dv__btm_nav_creator){
                  bottom:${mobileView && "55px"}
              }
        `}</style>
    </div>
  );
}
