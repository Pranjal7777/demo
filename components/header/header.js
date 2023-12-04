import React from "react";
import { HUMBERGER_ICON, P_CLOSE_ICONS } from "../../lib/config";
import Router from "next/router";
import Wrapper from "../../hoc/Wrapper";
import Icon from "../image/icon";
import { useTheme } from "react-jss";
import { getCookie } from "../../lib/session";
import { useSelector } from "react-redux";
import { open_drawer } from "../../lib/global/loader";
import useProfileData from "../../hooks/useProfileData";
import dynamic from "next/dynamic";
import { s3ImageLinkGen } from "../../lib/UploadAWS/s3ImageLinkGen";
const Avatar = dynamic(() => import("@material-ui/core/Avatar"), { ssr: false });

const Header = (props) => {

  const ChangeTheme = useSelector((state) => state?.commonUtility?.changeThemeUtility);
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
  const auth = getCookie("auth");
  const [profile] = useProfileData();

  const {
    icon = P_CLOSE_ICONS,
    closeTrigger,
    back,
    title = "",
    subtitle = "",
    showMenu = false,
    isLeftIcon = true,
  } = props;

  const theme = useTheme();

  React.useEffect(() => {
    props.right && props.right();
  }, []);


  const handleNavigationMenu = () => {
    open_drawer(
      "SideNavMenu",
      {
        paperClass: "backNavMenu",
        setActiveState: props.setActiveState,
        changeTheme: ChangeTheme,
      },
      "right"
    );
    // close_drawer(Router.asPath.replace("/", "").charAt(0).toUpperCase() + Router.asPath.replace("/", "").slice(1) !== title)
  };

  const handleGuestNavigationMenu = () => {
    open_drawer("GuestSideNavMenu",
      { paperClass: "backNavMenu", setActiveState: props.setActiveState },
      "right"
    );
  };

  return (
    <Wrapper>
      <div className="global-nav-header borderBtm" id={props.id || "nav-bar"}>
        {props.children}
        <div className="row mx-0 d-flex justify-content-between pt-3 mb-3 align-items-center">
          {isLeftIcon ? <div className="col-2 d-flex">
            {/* <Image
              src={props.icon ? props.icon : P_CLOSE_ICONS}
              onClick={() => {
                closeTrigger && closeTrigger();
                back ? back() : Router.back();
              }}
              width="20"
              alt="close_icon"
              style={{ marginBottom: "4px" }}
            /> */}
            <Icon
              icon={`${props.icon ? props.icon : P_CLOSE_ICONS}${props.icon ? props?.iconId ? props?.iconId : "#left_back_arrow" : "#cross_btn"
                }`}
              color={props?.iconClr || theme.type === "light" ? "#000" : "#fff"}
              width={20}
              height={25}
              class="header__ico"
              style={{ marginBottom: "4px", }}
              alt="close_icon"
              onClick={() => {
                closeTrigger && closeTrigger();
                back ? back() : Router.back();
              }}
            />
          </div> : ""}
          <div className={`col txt-heavy text-truncate ${isLeftIcon ? "text-center" : "text-start"}`}>
            <p
              className={`m-0 sectionHeadingMobile ${theme.type === "light" ? "text-black4" : "text-white4"
                }`}
            >
              {title}
            </p>
            {subtitle && (
              <p className="m-0 w-400 fntSz15 text-muted">{subtitle}</p>
            )}
          </div>

          <div
            className={
              props.right
                ? "col-auto p-0 text-center txt-heavy fntSz18 mr-3 pointer"
                : 
                "col-2 p-0 text-center"
            }
          >
            {(auth && showMenu) ?
              <div
                className='pr-3 d-flex align-items-center justify-content-end'
                onClick={() => {
                  auth
                    ? handleNavigationMenu()
                    : handleGuestNavigationMenu();
                }}>
                {profile.profilePic ?
                  <Avatar
                    style={{ height: '36px', width: '36px' }}
                    className='profile-pic solid_circle_border'
                    alt={profile.firstName}
                    src={s3ImageLinkGen(S3_IMG_LINK, profile?.profilePic)}
                  />
                  :
                  <div
                    className="tagUserProfileImage solid_circle_border"
                    style={{ height: '36px', width: '36px' }}
                  >
                    {profile?.firstName[0] + (profile?.lastName && profile?.lastName[0])}
                  </div>
                }

              </div>
              : ""}
            <div className="w_40">{props.right ? props.right() : ""}</div>
          </div>
        </div>
        {/* <div style={{ height: "50px" }}></div> */}
      </div>
    </Wrapper>
  );
};
export default Header;
