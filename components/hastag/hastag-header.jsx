import { Tooltip } from "@material-ui/core";
import Router from "next/router";
import { useRouter } from "next/router";
import isMobile from "../../hooks/isMobile";
import * as config from "../../lib/config";
import { useTheme } from "react-jss";

const NavItem = ({
  nav_color,
  tabname,
  style,
  label,
}) => {
  return (
    <>
      <Tooltip title={label}>
        <li
          className="header_item cursorPtr"
          style={style}
          onClick={() => {
            if (tabname == 'memories_nft')
              return window.open('https://memories.voyr.me/', '_blank');
            if (tabname == 'support')
              return window.open('https://support.voyr.me', '_blank');
            if (tabname == 'academy')
              return window.open('https://academy.voyr.me', '_blank');
            if (tabname != Router.pathname) {
              // setActiveState(tabname);
              // Router.push(tabname);
              tabname == "/"
                ? Router.push(`${tabname}`)
                : Router.push(`/${tabname}`)
            }
          }}
        >
          <p className='header_item_p p-0 m-0' style={{ color: `${nav_color}` }} >{label}</p>
        </li>
      </Tooltip>
      <style>
        {`
          .header_item_p {
            font-weight: 600;
          }
        `}
      </style>
    </>
  );
};
export default function ProfileNavigationTab(props) {
  const theme = useTheme();
  const router = useRouter();
  const { query = {} } = router;
  const { tabType, classes } = props;
  const [mobileView] = isMobile();
  let pathname =
    router.pathname == "/[tab]" ? router.query.tab : router.pathname;

  return (
    <div
      className={
        mobileView
          ? `col-12 mb-4 ${classes} 
          ${props.isSticky
            ? props.shareProfile
              ? "oth_prof_nav_sticky"
              : "oth_nav_sticky"
            : "sticky"
          }`
          : `${props.otherProfile || props.sharedProfile
            ? "dv__other_sticky websiteContainer other_profile"
            : "dv__sticky"
          } col-12`
      }
      style={!mobileView ? { zIndex: "3" } : {}}
    >
      <div
        className={
          mobileView
            ? "row dv_base_bg_dark_color py-1"
            : "row dv__bg_light_color py-1"
        }
      >
        <div
          style={{ width: '45%' }}
          className={props.otherProfile && !mobileView ? "col-12" : "container"}
        >
          <ul
            style={{ height: "8vh" }}
            className="nav nav-pills nav-justified dv_profileUL justify-content-between align-items-center"
            role="tablist"
          >
            <NavItem
              nav_color={
                pathname === "/"
                  ? 'var(--l_base)'
                  : '#000000'
              }
              style={
                pathname == "/"
                  ? {
                    color: 'var(--l_base) !important',
                    borderBottom: '3px solid var(--l_base)',
                    paddingBottom: '2vh',
                    paddingTop: '2.2vh',
                  }
                  : {
                    color: '#000000 !important',
                    paddingBottom: '15px',
                    paddingTop: '10px',
                  }
              }
              size={tabType === "grid_post" ? 23 : 23}
              // width={23}
              // height={23}
              // iconClass="p-2 mb-1"
              setActiveState={props.setActiveState}
              tabname="/"
              mobileView={mobileView}
              label="Home"
              viewBox="0 0 18.933 17.93"
              width={mobileView ? 20 : 1.5}
              height={mobileView ? 20 : 1.5}
              unit={mobileView ? "px" : "vw"}
            />
            <NavItem
              icon={`${config.IMAGE_ICON}#image`}
              nav_color={
                pathname === "/explore"
                  ? 'var(--l_base)'
                  : '#000000'
              }
              style={
                pathname == "/explore"
                  ? {
                    color: 'var(--l_base) !important',
                    borderBottom: '3px solid var(--l_base)',
                    paddingBottom: '2vh',
                    paddingTop: '2.2vh',
                  }
                  : {
                    color: '#000000 !important',
                    paddingBottom: '15px',
                    paddingTop: '10px',
                  }
              }
              size={tabType === "hashtag" ? 27 : 27}
              // width={27}
              // height={27}
              setActiveState={props.setActiveState}
              tabname="hashtags"
              mobileView={mobileView}
              label="Explore"
              viewBox="0 0 18.83 15.62"
              width={mobileView ? 20 : 1.5}
              height={mobileView ? 20 : 1.5}
              unit={mobileView ? "px" : "vw"}
            />
            <NavItem
              icon={`${config.VIDEO_ICON}#video`}
              nav_color={
                tabType === "/memories_nft"
                  ? 'var(--l_base)'
                  : '#000000'
              }
              style={
                pathname == "/memories_nft"
                  ? {
                    color: 'var(--l_base) !important',
                    borderBottom: '3px solid var(--l_base)',
                    paddingBottom: '2vh',
                    paddingTop: '2.2vh',
                  }
                  : {
                    color: '#000000 !important',
                    paddingBottom: '15px',
                    paddingTop: '10px',
                  }
              }
              size={tabType === "video_post" ? 30 : 30}
              // width={30}
              // height={30}
              tabname="memories_nft"
              // iconClass="p-2"
              setActiveState={props.setActiveState}
              mobileView={mobileView}
              label="Memories NFT"
              viewBox="0 0 19.801 13.521"
              width={mobileView ? 20 : 1.5}
              height={mobileView ? 20 : 1.5}
              unit={mobileView ? "px" : "vw"}
            />
            <NavItem
              tabname="faq"
              icon={`${config.EXCLUSIVE_POST_ICON}#lock`}
              nav_color={
                pathname === "/faq"
                  ? 'var(--l_base)'
                  : '#000000'
              }
              style={
                pathname == "/faq"
                  ? {
                    color: 'var(--l_base) !important',
                    borderBottom: '3px solid var(--l_base)',
                    paddingBottom: '2vh',
                    paddingTop: '2.2vh',
                  }
                  : {
                    color: '#000000 !important',
                    paddingBottom: '15px',
                    paddingTop: '10px',
                  }
              }
              size={tabType === "lock_post" ? 26 : 26}
              // width={26}
              // height={26}
              setActiveState={props.setActiveState}
              mobileView={mobileView}
              label="FAQ"
              viewBox="0 0 18.284 17.714"
              width={mobileView ? 20 : 1.5}
              height={mobileView ? 20 : 1.5}
              unit={mobileView ? "px" : "vw"}
            />
            <NavItem
              tabname="support"
              icon={`${config.EXCLUSIVE_POST_ICON}#lock`}
              nav_color={
                pathname === "/support"
                  ? 'var(--l_base)'
                  : '#000000'
              }
              style={
                pathname == "/support"
                  ? {
                    color: 'var(--l_base) !important',
                    borderBottom: '3px solid var(--l_base)',
                    paddingBottom: '2vh',
                    paddingTop: '2.2vh',
                  }
                  : {
                    color: '#000000 !important',
                    paddingBottom: '15px',
                    paddingTop: '10px',
                  }
              }
              size={tabType === "lock_post" ? 26 : 26}
              // width={26}
              // height={26}
              setActiveState={props.setActiveState}
              mobileView={mobileView}
              label="Support"
              viewBox="0 0 18.284 17.714"
              width={mobileView ? 20 : 1.5}
              height={mobileView ? 20 : 1.5}
              unit={mobileView ? "px" : "vw"}
            />
            <NavItem
              tabname="academy"
              icon={`${config.EXCLUSIVE_POST_ICON}#lock`}
              nav_color={
                pathname === "/academy"
                  ? 'var(--l_base)'
                  : '#000000'
              }
              style={
                pathname == "/academy"
                  ? {
                    color: 'var(--l_base) !important',
                    borderBottom: '3px solid var(--l_base)',
                    paddingBottom: '2vh',
                    paddingTop: '2.2vh',
                  }
                  : {
                    color: '#000000 !important',
                    paddingBottom: '15px',
                    paddingTop: '10px',
                  }
              }
              size={tabType === "lock_post" ? 26 : 26}
              // width={26}
              // height={26}
              setActiveState={props.setActiveState}
              mobileView={mobileView}
              label="Academy"
              viewBox="0 0 18.284 17.714"
              width={mobileView ? 20 : 1.5}
              height={mobileView ? 20 : 1.5}
              unit={mobileView ? "px" : "vw"}
            />
          </ul>
          {/* )} */}
        </div>
      </div>
      <style jsx>{`
          .dv__sticky {
            position: sticky;
            top: 80px;
            padding-top: 13px;
          }
          .dv__bg_light_color {
            background: ${theme.palette.l_base_o60};
          }
        `}
      </style>
    </div>
  );
}
