import dynamic from "next/dynamic";
const Tooltip = dynamic(() => import("@material-ui/core/Tooltip"));
import { useRouter } from "next/router";
import { useState } from "react";
import Icon from "../../components/image/icon";
import isMobile from "../../hooks/isMobile";
import { scrollToView } from "../../lib/global/scrollToView";
import { getCookie } from "../../lib/session";
import { useTheme } from "react-jss";
import useLang from "../../hooks/language";
import { collection_icon, EXCLUSIVE_ICON, EXCLUSIVE_ICON_BOLD, EXCLUSIVE_POST_ICON, GRID_ICON, Heart_Inactive, LIVE_ICON, PLAY_ICON_BOLD, REVIEWS_BOLD, Shopping_Bag_Inactive, SHOUTOUT_ICON_PROFILE_BOLD, TAGGED_ICON_BOLD } from "../../lib/config/profile";

const NavItem = ({
  icon,
  iconClass,
  color,
  tabname,
  size,
  setActiveState,
  mobileView,
  height,
  width,
  useHeight,
  useWidth,
  unit,
  label,
  viewBox,
  isOtherProfilePage = false,
  theme,
  activeStateBool = true,
  count,
  lastTab

}) => {
  const tabUi = () => {
    return <li
      className={`border__bottom__li nav-item cursorPtr d-flex align-items-center flex-column justify-content-center h-100 p-2`}
      onClick={() => {
        scrollToView(mobileView ? "profile_page_cont" : "scroll_to_top");
        setActiveState(tabname);
      }}
      style={{ borderRight: `${!lastTab && '1.5px solid var(--l_border)'}` }}
    >
      <div>
        <Icon
          height={height}
          width={width}
          icon={icon}
          color={activeStateBool ? 'var(--l_base)' : '#B7A6AE'}
          size={size}
          class={iconClass}
          useHeight={useHeight}
          useWidth={useWidth}
          viewBox={viewBox}
          unit={unit}
        />
      </div>
      {!mobileView &&
        <div className={`${!mobileView && "profileNavTabDv align-items-center"}`}>
          <div className={activeStateBool ? "w-500" : ""}
            style={{ color: `${activeStateBool ? 'var(--l_base)' : '#B7A6AE'}`, fontSize: '1rem' }}>
            {`${(count || count == 0) ? count : ""} ${label}`}
          </div>
        </div>}
      <style jsx>{`
        .profileNavTabDv{
          display:flex;
          gap:3px;
        }
      `}
      </style>
    </li>
  }
  return (
    mobileView ? tabUi() :
      <Tooltip title={label}>
        {tabUi()}
      </Tooltip>
  );
};
export default function ProfileNavigationTab(props) {
  const theme = useTheme();
  const router = useRouter();
  const [lang] = useLang();
  const { query = {} } = router;
  const [otherProfile] = useState(query && query.userId);
  const userId = getCookie("uid");
  const userType = props.userType || getCookie("userType") || 0;
  const { tabType, classes } = props;
  const [mobileView] = isMobile();
  const { tab } = router.query;
  const { count } = props

  return (
    <div
      className={`${mobileView
        ? `mt-3 overflow-hidden ${classes} 
          ${props.isSticky
          ? props.shareProfile
            ? "oth_prof_nav_sticky"
            : "oth_nav_sticky"
          : "sticky rounded-pill mx-3"
        }`
        : `${props.otherProfile || props.sharedProfile
          ? "dv__other_sticky websiteContainer other_profile mt-3"
          : "dv__sticky"
        } col-12 ${props.otherProfile ? "" : "mb-1 mt-2"}`
        } specific_section_bg borderStroke`}
      style={!mobileView ? { zIndex: "2", borderRadius: "12px" } : {}}
    >
      <div
        className={
          mobileView
            ? `${props?.isOtherProfilePage ? "dv_base_bg_dark_color" : "mv_proflie_gallery"} py-1 w-100 specific_section_bg`
            : `${props?.isOtherProfilePage ? "" : "dv__bg_light_color_profile"}`
        }
      >
        <div>
          {userType == 1 ? (
            // for normal users
            <ul
              style={!mobileView ? { height: "11vh", minHeight: '84px' } : {}}
              className="nav nav-pills nav-justified dv_profileUL align-items-center"
              role="tablist"
            >
              <NavItem
                icon={`${Heart_Inactive}#liked_post`}
                color={
                  tabType === "liked_post"
                    ? theme.appColor
                    : theme.otherprofileInactiveTabColor
                }
                size={25}
                width={25}
                height={25}
                // iconClass="mb-1 pb-1"
                setActiveState={props.setActiveState}
                tabname="liked_post"
                mobileView={mobileView}
                label="Liked"
                viewBox="0 0 25 25"
                activeStateBool={tabType === "liked_post"}
                theme={theme}
              />
              <NavItem
                icon={`${Shopping_Bag_Inactive}#purchased_post`}
                color={
                  tabType === "purchased_post"
                    ? theme.appColor
                    : theme.otherprofileInactiveTabColor
                }
                size={25}
                width={25}
                height={25}
                tabname="purchased_post"
                // iconClass="mb-2"
                setActiveState={props.setActiveState}
                mobileView={mobileView}
                label="Purchased"
                viewBox="0 0 25 25"
                activeStateBool={tabType === "purchased_post"}
                theme={theme}
              />
              <NavItem
                icon={`${collection_icon}#grid`}
                color={
                  tabType === "collection_post"
                    ? theme.appColor
                    : theme.otherprofileInactiveTabColor
                }
                size={25}
                width={25}
                height={25}
                // iconClass="p-2 mb-1"
                setActiveState={props.setActiveState}
                tabname="collection_post"
                mobileView={mobileView}
                label="Collection"
                lastTab={true}
                theme={theme}
                activeStateBool={tabType === "collection_post"}
                viewBox="0 0 25 2 5"
              />
            </ul>
          ) : (
            // for fanzly creators
            <ul
              style={!mobileView ? { height: "11vh", minHeight: '5rem' } : {}}
              className="nav nav-pills nav-justified dv_profileUL align-items-center"
              role="tablist"
            >
              <NavItem
                icon={`${GRID_ICON}#grid`}
                color={
                  tabType === "grid_post" || tabType === "video_post" || tabType === "image_post" || tabType === "text_post"
                    ? theme.appColor
                    : theme.otherprofileInactiveTabColor
                }
                size={25}
                width={25}
                height={25}
                // iconClass="p-2 mb-1"
                setActiveState={props.setActiveState}
                tabname="grid_post"
                mobileView={mobileView}
                label="Posts"
                viewBox={"0 0 25 25"}
                isOtherProfilePage={props?.isOtherProfilePage}
                theme={theme}
                activeStateBool={tabType === "grid_post" || tabType === "video_post" || tabType === "image_post" || tabType === "text_post" ? true : false}
                count={count?.postCount}
              />

              <NavItem
                icon={props?.isOtherProfilePage ? `${LIVE_ICON}#live` : `${PLAY_ICON_BOLD}#live`}
                color={
                  tabType === "streams_live"
                    ? theme.appColor
                    : theme.otherprofileInactiveTabColor
                }
                size={25}
                width={25}
                height={25}
                // unit={mobileView ? "px" : "vw"}
                // activeStateBool={tabType === "streams_live" ? true : false}
                theme={theme}
                mobileView={mobileView}
                activeStateBool={tabType === "streams_live" ? true : false}
                // iconClass="p-2 mt-1 mb-2"
                setActiveState={props.setActiveState}
                isOtherProfilePage={props?.isOtherProfilePage}
                tabname="streams_live"
                label="Lives"
                viewBox={"0 0 25 25"}
                count={count?.recordedStreamCount}
              />

              {!otherProfile && <NavItem
                tabname="exclusive_post"
                icon={`${EXCLUSIVE_POST_ICON}#lock`}
                color={
                  tabType === "exclusive_post"
                    ? theme.appColor
                    : theme.otherprofileInactiveTabColor
                }
                size={25}
                width={25}
                height={25}
                // unit={mobileView ? "px" : "vw"}
                setActiveState={props.setActiveState}
                mobileView={mobileView}
                label="Premium"
                activeStateBool={tabType === "exclusive_post" ? true : false}
                theme={theme}
                isOtherProfilePage={props?.isOtherProfilePage}
                viewBox={"0 0 25 25"}
                count={count?.exclusivePostCount}
              />}

              {props?.otherProfile && <NavItem
                icon={`${SHOUTOUT_ICON_PROFILE_BOLD}#shoutout`}
                color={
                  tabType === "shoutout_post"
                    ? theme.appColor
                    : theme.otherprofileInactiveTabColor
                }
                size={25}
                width={25}
                height={25}
                // unit={mobileView ? "px" : "vw"}
                // iconClass="p-2 mb-1"
                setActiveState={props.setActiveState}
                tabname="shoutout_post"
                mobileView={mobileView}
                label="Shoutouts"
                viewBox={"0 0 25 25"}
                isOtherProfilePage={props?.isOtherProfilePage}
                theme={theme}
                activeStateBool={tabType === "shoutout_post" ? true : false}
                count={count?.shoutoutCount}
              />}

              {/* lock_post */}
              {/* {!otherProfile && <NavItem
                tabname="lock_post"
                icon={props?.isOtherProfilePage ? `${EXCLUSIVE_POST_ICON}#lock` : `${EXCLUSIVE_POST_ICON}#lock`}
                color={
                  tabType === "lock_post"
                    ? theme.appColor
                    : theme.otherprofileInactiveTabColor
                }
                size={tabType === "lock_post" ? 26 : 26}
                width={mobileView ? 30 : 1.9}
                height={mobileView ? 25 : 1.9}
                unit={mobileView ? "px" : "vw"}
                // iconClass="p-2 mb-1"
                setActiveState={props.setActiveState}
                mobileView={mobileView}
                label={props?.isOtherProfilePage ? "Exclusive" : "Locked"}
                activeStateBool={tabType === "lock_post" ? true : false}
                theme={theme}

                // viewBox="0 0 20.088 20.088"
                isOtherProfilePage={props?.isOtherProfilePage}
                viewBox={props?.isOtherProfilePage ? "0 0 17.311 22.069" : "0 0 17.284 19.714"}
                count={props.isOtherProfilePage ? count?.exclusivePostCount : count?.lockedPostCount}
              />} */}



              {!props?.otherProfile && <NavItem
                icon={`${SHOUTOUT_ICON_PROFILE_BOLD}#shoutout`}
                color={tabType === "shoutout_post" ? theme.appColor : theme.otherprofileInactiveTabColor}
                width={25}
                height={25}
                // unit={mobileView ? "px" : "vw"}
                activeStateBool={tabType === "shoutout_post" ? true : false}
                setActiveState={props.setActiveState}
                tabname="shoutout_post"
                theme={theme}
                label="Shoutouts"
                viewBox={"0 0 25 25"}
                count={count?.shoutoutCount}
                mobileView={mobileView}
              ></NavItem>}

              <NavItem
                icon={`${TAGGED_ICON_BOLD}#tagged`}
                color={
                  tabType === "tagged_post"
                    ? theme.appColor
                    : theme.otherprofileInactiveTabColor
                }
                size={25}
                width={25}
                height={25}
                // unit={mobileView ? "px" : "vw"}
                theme={theme}
                mobileView={mobileView}

                activeStateBool={tabType === "tagged_post" ? true : false}
                // iconClass="p-2 mt-1 mb-2"
                setActiveState={props.setActiveState}
                isOtherProfilePage={props?.isOtherProfilePage}
                tabname="tagged_post"
                label="Tagged"
                viewBox={"0 0 25 25"}
                count={count?.taggedCount}
                lastTab={!props?.isOtherProfilePage && true}
              />

              {props?.isOtherProfilePage && <NavItem
                icon={`${REVIEWS_BOLD}#reviews`}
                color={
                  tabType === "review_tab"
                    ? theme.appColor
                    : theme.otherprofileInactiveTabColor
                }
                size={25}
                width={25}
                height={25}
                // unit={mobileView ? "px" : "vw"}
                activeStateBool={tabType === "review_tab" ? true : false}
                theme={theme}
                mobileView={mobileView}
                // activeStateBool={tabType === "review_tab" ? true : false}
                // iconClass="p-2 mt-1 mb-2"
                setActiveState={props.setActiveState}
                isOtherProfilePage={props?.isOtherProfilePage}
                tabname="review_tab"
                lastTab
                label={lang.reviews}
                viewBox="0 0 25 25"
                count={count?.reviewCount}
              />}
            </ul>
          )}
        </div>
      </div>
      <style jsx>{`
      
      .subPlanCss{
        box-shadow:   ${theme.type == "light" ? `0px 2px 4px ${theme.palette.l_boxshadow2}` : `none`} ;
        border: ${theme.type == "light" ? `1px solid ${theme.palette.l_boxshadow2}` : `none`} ;
        border-radius: 0;
        // background: var(--l_profileCard_bgColor) !important;
      } 
      .mv_proflie_gallery{
        background-color: var(--l_profileCard_bgColor) !important;
      }
      :global(.border__bottom__li){
        border-bottom: 3px solid transparent;
      }
      {
        padding:10px 0px;
      }
      `}</style>
    </div>
  );
}
