import dynamic from "next/dynamic";
import Router, { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useTheme } from "react-jss";
import { useSelector, useDispatch } from "react-redux";

import useLang from "../../hooks/language";
import isMobile from "../../hooks/isMobile";
import isTablet from "../../hooks/isTablet";
import useProfileData from "../../hooks/useProfileData";
import FigureCloudinayImage from "../../components/cloudinayImage/cloudinaryImage";
import Image from "../../components/image/image";
import Img from "../../components/ui/Img/Img";
import Wrapper from "../../hoc/Wrapper";
import { getRandomColor } from "../../lib/helper";
import Icon from "../../components/image/icon";
import { getCategoriesData } from "../../services/user_category";
import { handleHeaderCategories } from "../../redux/actions/shoutout";
import { getCookie } from "../../lib/session";
import { LOGO, DARK_LOGO } from "../../lib/config/logo";
import { isCameoTheme } from "../../lib/config/homepage";
import { PROFILE_White, Logout_Icon, Refer_Friends_Icon, Manage_Address_Icon, Collection_Icon, Credit_Card_Icon, Wallet_Icon, Dark_moon, White_sunny, EMPTY_PROFILE, downArrowIcons, upArrowIcon, NOTIFICATION_ICON_Blue, rightArrowSvg } from "../../lib/config/header";
import { drawerToast, open_dialog } from "../../lib/global/loader";
import { authenticate, sendMail } from "../../lib/global/routeAuth";
import DvHashtagSearch from '../../components/Drawer/hashtag/DvHashtagSearch';
const Badge = dynamic(() => import("@material-ui/core/Badge"));
const Button = dynamic(() => import("../../components/button/button"));
const ProfileDropdownMenu = dynamic(() => import("../../components/DropdownMenu/ProfileDropdownMenu"));
const NotificationDrawer = dynamic(() => import("../../components/DropdownMenu/notificationDrawer"));


const MarkatePlaceHeader = (props) => {
  const theme = useTheme();
  const params = useRouter();
  const dispatch = useDispatch()
  const auth = getCookie("auth");
  const [profile] = useProfileData();
  const [lang] = useLang();
  const [mobileView] = isMobile();
  const [tabletView] = isTablet();
  const current_theme = useSelector((state) => state.theme);
  const notificationCount = useSelector((state) => state?.notificationCount);
  const chatNotificationCount = useSelector((state) => state?.chatNotificationCount);
  const categoryLIST = useSelector((state) => state?.markateplaceData?.headerCategories);

  const userType = profile.userTypeCode;
  let pathname = params.pathname == "/[tab]" ? params.query.tab : params.pathname;

  const [nonHeroCategory, setNonHeroCategory] = useState([]);
  const [isProfileDropdownToggled, setIsProfileDropdownToggled] = useState(false);
  const [isCatDialogOpen, setIsCatDialogOpen] = useState(false);
  useEffect(() => {
    handleDefaultAvatar();
    handleCategories();
  }, []);

  const handleCategories = async () => {
    if (categoryLIST.length > 1) {
      setNonHeroCategory(categoryLIST);
      return;
    };
    try {
      const res = await getCategoriesData();
      const data = res?.data?.data
      setNonHeroCategory(data);
      dispatch(handleHeaderCategories(data))
    } catch (e) {
      console.error("Error in handleCategories", e);
    }
  }

  const handleDefaultAvatar = () => {
    if (auth && profile && !profile.profilePic) {
      var firstName =
        profile && profile.firstName ? profile.firstName.toString() : "";
      var lastName =
        profile && profile.lastName ? profile.lastName.toString() : "";
      var intials = firstName.charAt(0) + lastName.charAt(0);
      var profileImage = document.getElementById("profileImage");
      profileImage && profileImage.textContent
        ? ""
        : profileImage?.append(intials);
      if (profileImage) profileImage.style.backgroundColor = getRandomColor();
    }
  };

  const handleNavigation = (linkName) => {
    switch (linkName) {
      case lang.profile:
        Router.push("/profile");
        props.setActiveState && props.setActiveState("profile");
        break;

      case lang.collections:
        Router.push("/collections");
        break;
      case lang.wallet:
        Router.push("/wallet");
        break;

      case lang.debitCreditCard:
        Router.push("/cards");
        break;

      // case lang.manageAddress:
      //   Router.push("/address");
      //   break;

      case lang.referYourFriends:
        Router.push("/refer-friends");
        break;

      case lang.homepage:
        Router.push("/homepage");
        break;

      case lang.logout:
        open_dialog("Logout", {});
        break;
    }
  };

  const creatorProfileMenu = [
    {
      icon: PROFILE_White,
      iconWidth: "1.449",
      iconHeight: "1.449",
      label: lang.profile,
      onClick: handleNavigation,
      id: "profile_icon",
    },
    {
      icon: Wallet_Icon,
      iconWidth: "2",
      iconHeight: "2",
      label: lang.wallet,
      onClick: handleNavigation,
      id: "wallet",
    },
    {
      icon: Credit_Card_Icon,
      iconWidth: "1.7",
      iconHeight: "2",
      label: lang.debitCreditCard,
      onClick: handleNavigation,
      id: "credit-card",
    },
    {
      icon: Collection_Icon,
      iconWidth: "1.449",
      iconHeight: "1.449",
      label: lang.collections,
      onClick: handleNavigation,
      id: "Group_40704",
    },
    // {
    //   icon: Manage_Address_Icon,
    //   iconWidth: "2.5",
    //   iconHeight: "2.5",
    //   label: lang.manageAddress,
    //   onClick: handleNavigation,
    //   id: "Group_10002",
    // },
    {
      icon: Refer_Friends_Icon,
      iconWidth: "2.3",
      iconHeight: "2.3",
      label: lang.referYourFriends,
      onClick: handleNavigation,
      id: "refer_frnd",
    },
    {
      icon: Logout_Icon,
      iconWidth: "2",
      iconHeight: "2",
      label: lang.logout,
      onClick: handleNavigation,
      id: "Group_9997",
    },
  ];

  const profileMenu = [
    {
      icon: PROFILE_White,
      iconWidth: "1.8",
      iconHeight: "1.8",
      label: lang.profile,
      onClick: handleNavigation,
      id: "profile_icon",
    },
    {
      icon: Wallet_Icon,
      iconWidth: "2",
      iconHeight: "2",
      label: lang.wallet,
      onClick: handleNavigation,
      id: "wallet",
    },
    {
      icon: Credit_Card_Icon,
      iconWidth: "1.449",
      iconHeight: "1.449",
      label: lang.debitCreditCard,
      onClick: handleNavigation,
      id: "credit-card",
    },
    // {
    //   icon: Manage_Address_Icon,
    //   iconWidth: "1.449",
    //   iconHeight: "1.449",
    //   label: lang.manageAddress,
    //   onClick: handleNavigation,
    //   id: "Group_10002",
    // },
    {
      icon: Refer_Friends_Icon,
      iconWidth: "1.449",
      iconHeight: "1.449",
      label: lang.referYourFriends,
      onClick: handleNavigation,
      id: "refer_frnd",
    },
    {
      icon: Logout_Icon,
      iconWidth: "1.449",
      iconHeight: "1.449",
      label: lang.logout,
      onClick: handleNavigation,
      id: "Group_9997",
    },
  ];

  const verifyAccount = (e) => {
    e.preventDefault();
    setIsCatDialogOpen(false);
    if (profile && [5, 6].includes(profile.statusCode)) {
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
        isMobile: false,
      });
    } else {
      open_dialog("POST_DIALOG", {
        story: false,
      });
    }
  };

  const handelcatDialog = (e) => {
    setIsCatDialogOpen(!isCatDialogOpen);
  };

  return (
    <Wrapper>
      <div
        className="col-12 p-0 d-flex align-items-center position-fixed markatePlace__header managerBoxShadow"
      >
        <div className="markatePlaceHeader">
          <div className="row mx-3 mx-sm-0 mx-g-3 align-items-center">
            <div className="col-auto order-0 order-md-0 mb-3 mb-sm-0 p-0">
              <Image
                src={theme.type === "light" ? LOGO : DARK_LOGO}
                className="logoImg"
                onClick={() => {
                  props.setActiveState && props.setActiveState("timeline");
                  Router.push("/")
                }
                }
              />
            </div>
            {isCameoTheme && <div className={`ml-4 ml-sm-0 ml-lg-4 ${isCatDialogOpen ? "categoryActiveCss" : ""} d-flex align-items-center`}
              style={{ padding: "5px 11px" }}
              onClick={(e) => handelcatDialog(e)}>
              <div className="col-auto appTextColor labelFontSize fntWeight700 cursorPtr pr-0 px-0">
                {lang.categories}
              </div>
              <Icon
                icon={
                  !isCatDialogOpen
                    ? `${downArrowIcons}#Icon_feather-chevron-right`
                    : `${upArrowIcon}#uparrow`
                }
                color={theme.type == "light" ? "#666666" : "#fff"}
                width={mobileView ? 25 : 0.95}
                height={mobileView ? 25 : 0.95}
                unit={mobileView ? "px" : "vw"}
                class="cursorPtr pl-2"
                viewBox="0 0 10.048 5.624"
              />
            </div>}
            {isCatDialogOpen && (
              <Wrapper>
                <div className="wrapperCss" onClick={(e) => setIsCatDialogOpen(false)}></div>
                <div>
                  <div
                    id="scrollEventHashtag"
                    className={`categoryDialog py-2 ${isCatDialogOpen
                      ? ""
                      : "d-none"
                      }`}
                  >
                    <div className={`${isCatDialogOpen
                      ? "row flex-column mx-0"
                      : ""
                      } categoryCls`}
                      style={{
                        height: "35vh",
                        overflowX: "auto",
                        overflowY: "hidden",
                        marginRight: "-8px !important"
                      }}
                    >
                      {nonHeroCategory.length > 0 &&
                        nonHeroCategory.map((item, index) => (
                          <div className={`px-3 ${index % 6 !== index ? "" : "categoryLabelBorder"}`}>
                            <p key={item?._id} className="fntSz14 m-0 text-left cursorPtr catHoverClss"
                              style={{ padding: "6px 10px", color: theme?.markatePlaceLabelColor }}
                              onClick={() => { Router.push(`/homepage/user_categories?caterory_label=${item.title}&&id=${item._id}&&type=CategorySection&&isHeroCategory=${item?.heroCategory}`); setIsCatDialogOpen(false) }}
                            >
                              {item.title}
                            </p>
                          </div>
                        ))}
                      <div className="px-3">
                        <div className="fntSz14 d-flex m-0 justify-content-start text-left cursorPtr catHoverClss"
                          style={{ padding: "6px 10px" }}
                        >
                          <p className="m-0"
                            onClick={() => { Router.push(`/homepage/category_list?caterory_label=Categories&&id=0&&type=CATEGORY_SLIDER`); setIsCatDialogOpen(false) }}
                          >{lang.viewAll}</p>
                          <Icon
                            icon={`${rightArrowSvg}#Icon_feather-arrow-right`}
                            color={theme.text}
                            width={mobileView ? 25 : 0.95}
                            height={mobileView ? 25 : 0.95}
                            unit={mobileView ? "px" : "vw"}
                            class="cursorPtr pl-2"
                            viewBox="0 0 9.942 10.439"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Wrapper>
            )}
            <div className="d-flex align-items-center pl-2">
              <div className={`labelFontSize fntWeight700 ${isCameoTheme ? "" : "ml-5"} ${pathname == "/" ? "viewText" : "appTextColor"} cursorPtr`}
                onClick={() => {
                  props.setActiveState && props.setActiveState("timeline");
                  Router.push("/")
                }}
              >{lang.home}</div>

              {isCameoTheme && <div className={`pl-3 pl-md-2 pl-lg-3 labelFontSize fntWeight700 ${pathname == "/social" ? "viewText" : "appTextColor"} cursorPtr`}
                onClick={() => {
                  props.setActiveState && props.setActiveState("social");
                  Router.push("/social")
                }}
              >{lang.social}</div>}
              <div
                className={`pl-3 pl-md-2 pl-lg-3 labelFontSize fntWeight700 ${pathname.includes("/live") ? "viewText" : "appTextColor"} cursorPtr`}
                onClick={() =>
                  authenticate().then(() => {
                    props.setActiveState && props.setActiveState("live");
                    Router.push("/live/popular");
                  })
                }
              >
                {lang.liveLabel}
              </div>
              <div
                className={`pl-3 pl-md-2 pl-lg-3 labelFontSize fntWeight700 ${pathname === "/explore" ? "viewText" : "appTextColor"} cursorPtr`}
                onClick={() => {
                  props.setActiveState && props.setActiveState("hashtags");
                  Router.push("/explore");
                }}
              >
                {lang.explore}
              </div>
              <div className="d-flex align-items-center"
                onClick={() =>
                  authenticate().then(() => {
                    Router.push("/chat");
                  })
                }
              >
                <div className={`pl-3 pl-md-2 pl-lg-3 labelFontSize fntWeight700 cursorPtr ${pathname === "/chat" ? "viewText" : "appTextColor"}`}>
                  {lang.Chat}
                </div>
                {chatNotificationCount && chatNotificationCount !== 0 ? <p className="m-0 d-flex justify-content-center align-items-center fntSz9 chatCountCss white cursorPtr ml-2">{!profile.universalMessageRead ? chatNotificationCount+1 : chatNotificationCount}</p> : <></>}
              </div>
              <div className="mx-4 mx-md-3 mx-lg-4 searchbar__layout" >
                <div className="position-relative">
                  <DvHashtagSearch theme={theme} lang={lang} />
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-end col align-items-center pl-0 pr-3 pr-sm-0 pr-lg-3">
              <div className="col-auto order-2 order-md-2 px-3 px-sm-0 px-lg-3">
                <div className={`${tabletView ? 'form-row' : 'row'} align-items-center justify-content-between`}>
                  {/* Post Media  */}
                  {auth && userType == 2 && (
                      <div>
                        <Button
                          type="button"
                          cssStyles={theme.blueButton}
                          data-dismiss="modal"
                          data-toggle="modal"
                          onClick={(e) => verifyAccount(e)}
                        fclassname="w-700 px-4 px-sm-2 px-lg-4 postBtn__btn manageRadiusForPost"
                        >
                          +{lang.post}
                        </Button>
                    </div>
                  )}

                  {/* <div className="col-auto pr-0 pr-sm-2 pr-lg-0">
                    <div className="py-3 m-0 cursorPtr">
                        {current_theme == "light" ? (
                          <div>
                            <Img
                            src={Dark_moon}
                              width="22vw"
                              onClick={(e) => props?.changeTheme(e)}
                            />
                          </div>
                        ) : (
                          <div>
                            <Img
                              src={White_sunny}
                              width="22vw"
                              onClick={(e) => props?.changeTheme(e)}
                            />
                          </div>
                      )}
                    </div>
                  </div> */}
                  {/* Notification  */}
                    <div className="col-auto pr-0 pr-sm-2 pr-lg-0 notification_icon">
                      {auth ? (
                        <Badge badgeContent={notificationCount} color="secondary">
                          <NotificationDrawer
                            button={
                              <Icon
                              icon={`${NOTIFICATION_ICON_Blue}#notification_icon`}
                                color={
                                  theme.type == "light"
                                    ? theme.iconColor
                                    : "#fff"
                                }
                                hoverColor={theme.appColor}
                              width={mobileView ? 25 : 5}
                              height={mobileView ? 25 : 5}
                                unit={mobileView ? "px" : "vw"}
                                class="cursorPtr"
                                viewBox="0 0 23 23"
                              />
                            }
                          />
                        </Badge>
                    ) : ""
                      }
                  </div>
                  {/* Profile  */}
                    <div className="col-auto pr-0 pr-sm-2 pr-lg-0">
                      {auth ? (
                        <ProfileDropdownMenu
                          handleArow={(classBoll) =>
                            setIsProfileDropdownToggled(classBoll)
                          }
                          button={
                            profile?.profilePic ? (
                              <div className="d-flex align-items-center">
                                <FigureCloudinayImage
                                  publicId={profile.profilePic}
                                  errorImage={EMPTY_PROFILE}
                                  style={{
                                    borderRadius: "50%",
                                    border: "1px solid theme.l_base",
                                    width: `${tabletView ? "2.5vw" : "1.903vw"}`,
                                    height: `${tabletView ? "2.5vw" : "1.903vw"}`,
                                    cursor: "pointer",
                                  }}
                                  width="70"
                                  height="70"
                                  crop={"fill"}
                                />
                                <Icon
                                  icon={
                                    !isProfileDropdownToggled
                                      ? `${downArrowIcons}#Icon_feather-chevron-right`
                                      : `${upArrowIcon}#uparrow`
                                  }
                                  color={
                                    theme.type == "light" ? "#666666" : "#fff"
                                  }
                                  hoverColor={theme.appColor}
                                  width={mobileView ? 25 : 0.95}
                                  height={mobileView ? 25 : 0.95}
                                  unit={mobileView ? "px" : "vw"}
                                  class="cursorPtr pl-2"
                                  viewBox="0 0 10.048 5.624"
                                />
                              </div>
                            ) : (
                                <div id="profileImage">{profile?.firstName[0] + profile?.lastName[0]}</div>
                            )
                          }
                          menuItems={
                            userType == 1 ? profileMenu : creatorProfileMenu
                          }
                        />
                      ) : (
                        <>
                          <div
                            onClick={() =>
                              authenticate().then(() => { }).catch(err => console.log(err))
                            }
                          >
                            {
                              tabletView ?
                                <Icon
                                  icon={`${PROFILE_White}#profile_icon`}
                                  color={theme.type == "light" ? "#666666" : "#fff"}
                                  hoverColor={theme.appColor}
                                  width={2.5}
                                  height={2.5}
                                  unit={"vw"}
                                  class="cursorPtr"
                                  viewBox="0 0 24.785 24.785"
                                />
                                :
                                <Icon
                                  icon={`${PROFILE_White}#profile_icon`}
                                  color={theme.type == "light" ? "#666666" : "#fff"}
                                  hoverColor={theme.appColor}
                                  width={mobileView ? 25 : 1.5}
                                  height={mobileView ? 25 : 1.5}
                                  unit={mobileView ? "px" : "vw"}
                                  class="cursorPtr"
                                  viewBox="0 0 24.785 24.785"
                                />
                            }
                          </div>
                        </>
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>
        {`
          #profileImage {
            width: 1.903vw;
            height: 1.903vw;
            border-radius: 50%;
            font-size: 0.878vw;
            color: #fff;
            text-align: center;
            text-transform: uppercase;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: rgb(160, 245, 50);
          }
          :global(.profileDropdown > button),
          :global(.profileDropdown > button:hover),
          :global(.profileDropdown > button:active),
          :global(.profileDropdown > button:focus) {
            background: transparent !important;
            border: none;
            padding: 0;
          }
          :global(.active-notification > button > span > div > svg) {
            color: ${theme.appColor};
          }
          .wrapperCss {
            background-color: rgba(0, 0, 0, 0.5) !important;
            z-index: -1;
            position: fixed;
            top: 79px;
            left: 0;
            height: 100vh;
            width: 100vw;
          }
          .searchbar__layout{
            margin-left:2vw !important;
          }
          .categoryDialog {
            background-color: ${theme?.drawerBackground};
            position: absolute;
            top: 80px;
            left: 174px;
            border-radius: 5px;
            min-width: 25vw;
            max-width: 30vw;
            overflow-y: auto;
            z-index: 10;
          }
          .anchorCss {
            text-decoration: none;
            color: ${theme.text} !important;
          }
          .categoryCls::-webkit-scrollbar {
            height: 5px !important;
          }
          .catHoverClss:hover{
            background: ${theme.markatePlaceHoverColor} !important;
            color: ${theme.text} !important;
            border-radius: 5px;
          }
          .managerBoxShadow{
            box-shadow: ${theme.type === "light" ? "rgb(0 0 0 / 10%) 0px 0px 5px 0px, rgb(0 0 0 / 10%) 0px 0px 1px 0px" : "rgb(0 0 0 / 15%) 0px 5px 15px 0px;"}
          }
          .categoryActiveCss{
              background: ${theme?.type == "light" ? theme.markatePlaceHoverColor : "#2B262B"};
              border-radius: 18px;
              padding: 5px 11px;
            }
          :global(.postLabelCss){
            background: ${theme.appColor};
            border-radius: 14px;
          }
          .chatCountCss{
            background: ${theme.appColor};
            border-radius: 50%;
            height: 18px;
            width: 18px;
          }
          .labelFontSize{
            font-size: 1.17vw;
          }
          .searchbar__layout{
            width: 30vw;
          }
          :global(.manageRadiusForPost){
            border-radius:40px !important;
          }
          :global(.manageRadiusForPost >span){
           font-size:13px !important;
          }

          @media (min-width: 700px) and (max-width: 991.98px){
            .searchbar__layout{
              width: 18vw;
            }
            .categoryDialog {
              left: 100px;
            }
            :global(.postBtn__btn){
              padding: 6px 10px;
            }
          }
        `}
      </style>
    </Wrapper>
  );
};

export default MarkatePlaceHeader;