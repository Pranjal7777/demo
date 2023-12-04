import React, { useEffect, useState } from "react";
import Wrapper from "../../hoc/Wrapper";
import useLang from "../../hooks/language";
import useProfileData from "../../hooks/useProfileData";
import { useSelector } from "react-redux";
// Asstes
import * as env from "../../lib/config";
import {
  close_drawer,
  open_drawer,
} from "../../lib/global";
import CustomLink from "../Link/Link";
import FigureCloudinayImage from "../cloudinayImage/cloudinaryImage";
import Route, { useRouter } from "next/router";
import FanFollowersList from "../../containers/profile/followers-list";
import { getCookie } from "../../lib/session";
import { getRandomColor, handleContextMenu } from "../../lib/helper";
import Img from "../ui/Img/Img";
import Icon from "../../components/image/icon";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "react-jss";
import { CLOSE_ICON_WHITE, DASHBOARD_ICON, MY_VAULT_LOGO } from "../../lib/config/logo";
import { AGENCY_LOGO } from "../../lib/config/header";
import { isAgency } from "../../lib/config/creds";
import { SIDEBAR_WALLET } from "../../lib/config/profile";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "10px 0 !important",
    borderBottom: '1.5px solid var(--l_border)',
    color: "var(--l_border)",
  },
  listIconDiv: {
    minWidth: "40px !important",
    color: "var(--l_app_text) !important",
  },
  primary: (props) => ({
    fontSize: "4.266vw !important",
    fontFamily: "Roboto, sans-serif !important",
    opacity: "1 !important",
    color: "var(--l_app_text) !important",
    lineHeight: "0.8 !important",
    verticalAlign: "text-bottom !important"
  })
}));

export default function SideNavMenu(props) {
  const router = useRouter();
  const theme = useTheme();
  const classes = useStyles(theme);
  const [profile] = useProfileData();
  const [lang] = useLang();
  const userType = getCookie("userType");
  const [auth] = useState(getCookie("auth"));
  let orderCount = useSelector((state) => state?.profileData?.orderCount);
  const IsAgency = isAgency();
  const [toggleData, setToggleData] = useState({
    setting: false,
    others: false
  })

  useEffect(() => {
    handleDefaultAvatar();
  }, []);

  const setCustomVhToBody = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vhCustom', `${vh}px`);
  };

  useEffect(() => {
    setCustomVhToBody();
    window.addEventListener('resize', setCustomVhToBody);

    return () => {
      window.removeEventListener('resize', setCustomVhToBody);
    };
  }, []);

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
        : profileImage.append(intials);
      profileImage.style.backgroundColor = getRandomColor();
    }
  };

  const handleMenuToggle = (data) => {
    if (data === "setting") {
      setToggleData((prev) => ({
        ...prev,
        setting: !prev.setting
      }));
    } else if (data === "others") {
      setToggleData((prev) => ({
        ...prev,
        others: !prev.others
      }));
    }
  }

  return (
    <Wrapper>
      <div className="sideNavMenu card_bg">
        <div className="scr wrap-scr">
          <div className="header-top-secion p-3"
          >
            <div className="d-flex flex-row justify-content-between">
              <div className="d-flex align-items-center gap_12">
                {!IsAgency &&
                  <div className='borderStroke rounded-pill d-flex justify-content-center align-items-center'
                    style={{ width: "36px", height: "36px" }}
                    onClick={(e) => {
                      e.stopPropagation();
                      close_drawer();
                      router.push('/wallet');
                    }}>
                    <Img
                      src={SIDEBAR_WALLET}
                      width="24"
                      height="24"
                    />
                  </div>}
                <div className="borderStroke rounded-pill d-flex justify-content-center align-items-center"
                  style={{ width: "36px", height: "36px" }}>
                  {theme.type == "light"
                    ? <Img
                      src={env.Dark_moon}
                      height={20}
                      onClick={(e) => props?.changeTheme(e)}
                    />
                    : <Img
                      src={env.White_sunny}
                      height={20}
                      onClick={(e) => props?.changeTheme(e)}
                    />
                  }
                </div>
              </div>
              <div className="borderStroke rounded-pill d-flex justify-content-center align-items-center"
                onClick={() => close_drawer("SideNavMenu")}
                style={{ height: "36px", width: "36px" }}>
                <Icon
                  icon={`${CLOSE_ICON_WHITE}#close-white`}
                  color={theme.type !== "light" ? "#F5D0FF" : "#5F596B"}
                  width={16}
                  height={16}
                  viewBox="0 0 16 16"
                />
              </div>
            </div>
            <div className="gradient_bg radius_12 p-3 d-flex flex-column align-items-center mt-3">
              <div
                className={`d-flex flex-column align-items-center ${profile.userTypeCode === 2 && "pb-2"}`}
                onClick={() => {
                  close_drawer("SideNavMenu");
                  Route.push("/profile");
                }}
              >
                <div className="callout-none" onContextMenu={handleContextMenu}>
                  {profile.profilePic ? (
                    <FigureCloudinayImage
                      publicId={profile.profilePic}
                      errorImage={env.EMPTY_PROFILE}
                      style={{
                        borderRadius: "50%",
                        border: `1px solid ${theme.appColor}`,
                        width: "88px",
                        height: "88px"
                      }}
                      width="88"
                      height="88"
                      crop={"fill"}
                      threshold={1}
                    />
                  ) : (
                    <div id="profileImage"></div>
                  )}
                </div>

                <div className="text-center w-100" >
                  <h5 className="mt-2 mb-0 w-400 white">
                    {profile.fullName
                      ? profile.fullName
                      : `${profile.firstName} ${profile.lastName ? profile.lastName : ''}`}
                  </h5>
                  <div className="followText_clr">@{profile.username}</div>
                </div>
              </div>

              {profile.userTypeCode === 2 && <div
                className="d-flex flex-row gap_12 pt-2 text-center"
                style={{ borderTop: "1px solid rgba(255, 255, 255, 0.3)" }}
              >

                <FanFollowersList
                  followersCount={profile.totalFollower}
                  followingCount={profile.totalFollowing}
                  postCount={profile.postCount}
                  showPosts={profile.userTypeCode === 2 || userType == 2}
                  showFollowers={profile.userTypeCode === 2 || userType == 2}
                  showFollowings={true}
                  id={profile._id}
                  bio={profile.bio}
                  sideMenu={true}
                />
              </div>}
            </div>
          </div>
          <div className="px-3 overflowY-auto"
            style={{ maxHeight: profile?.userTypeCode === 2 ? "calc(calc(var(--vhCustom, 1vh) * 100) - 320px)" : "calc(calc(var(--vhCustom, 1vh) * 100) - 260px)" }}
          >
            <ul className="nav flex-column sidebar_bg px-3 py-1 my-3 radius_12">
              <li
                className="nav-item"
                onClick={() => {
                  Route.push('/');
                  close_drawer();
                }}
              >
                <ListItem button className={`${classes.root} border-0`}>
                  <ListItemIcon className={classes.listIconDiv}>
                    <Icon
                      icon={`${env.SIDEBAR_HOME}#homeicon`}
                      color={theme.type !== "light" ? "#F5D0FF" : "#5F596B"}
                      width={24}
                      height={22}
                      alt="home_icon"
                      viewBox="0 0 24 22"
                    />
                  </ListItemIcon>
                  <ListItemText
                    className={classes.primary}
                    primary={lang.home}
                  />
                </ListItem>
              </li>
            </ul>
            <h6 className="light_app_text">My Account</h6>
            <ul className="nav flex-column sidebar_bg px-3 py-2 mb-3 radius_12">
              {profile?.userTypeCode === 1 && <li>
                <ListItem button className={classes.root}
                  onClick={() => {
                    Route.push(Route.pathname, "/billing-history");
                    close_drawer();
                    setTimeout(() => {
                      open_drawer(
                        "BillingPlans",
                        {
                          handleCloseDrawer: Route.back,
                          homePageref: null,
                        },
                        "right"
                      );
                    }, 100);
                  }}>
                  <ListItemIcon className={classes.listIconDiv}>
                    <Icon
                      icon={`${env.Billing_And_Plans_Icon}#billing_address`}
                      color={theme.type !== "light" ? "#F5D0FF" : "#5F596B"}
                      width={24}
                      height={22}
                      alt="billing_plans_icon"
                      viewBox="0 0 24 22"
                    />
                  </ListItemIcon>
                  <ListItemText
                    className={classes.primary}
                    primary={lang.billingHistory}
                  />
                </ListItem>
              </li>}
              <li className="nav-item">
                <ListItem button className={classes.root}
                  onClick={() => {
                    Route.push("/collections");
                    setTimeout(() => {
                      close_drawer("SideNavMenu");
                    }, 100);
                  }}
                >
                  <ListItemIcon className={classes.listIconDiv}>
                    <Icon
                      icon={`${env.SIDEBAR_COLLECTION}#collectionIcon`}
                      color={theme.type !== "light" ? "#F5D0FF" : "#5F596B"}
                      width={24}
                      height={22}
                      alt="collection_outline_icon"
                      viewBox="0 0 21 21"
                    />
                  </ListItemIcon>
                  <ListItemText
                    className={classes.primary}
                    primary={lang.collections}
                  />
                </ListItem>
              </li>
              {profile?.userTypeCode === 1 && <li
                className="nav-item d-flex align-items-center"
              >
                <ListItem button className={classes.root}
                  onClick={() => {
                    Route.push(Route.pathname, "/cards");
                    close_drawer();
                    setTimeout(() => {
                      open_drawer(
                        "Cards",
                        {
                          handleCloseDrawer: Route.back,
                          homePageref: null,
                        },
                        "right"
                      );
                    }, 100);
                  }}>
                  <ListItemIcon className={classes.listIconDiv}>
                    <Icon
                      icon={`${env.Credit_Card_Icon}#credit-card`}
                      color={theme.type !== "light" ? "#F5D0FF" : "#5F596B"}
                      width={24}
                      height={22}
                      alt="cards_icon"
                      viewBox="0 0 24 22"
                    />
                  </ListItemIcon>
                  <ListItemText
                    className={classes.primary}
                    primary={lang.creditCards}
                  />
                </ListItem>
              </li>}
              <li className="nav-item">
                <ListItem button className={classes.root} onClick={() => {
                  Route.push("/favourites");
                  setTimeout(() => {
                    close_drawer("SideNavMenu");
                  }, 100);
                }}>
                  <ListItemIcon className={classes.listIconDiv}>
                    <Icon
                      icon={`${env.HEART_ICON}#like_`}
                      color={theme.type !== "light" ? "#F5D0FF" : "#5F596B"}
                      width={24}
                      height={22}
                      alt="heart_icon"
                      viewBox="0 0 19 19"
                    />
                  </ListItemIcon>
                  <ListItemText
                    className={classes.primary}
                    primary={lang.favourites}
                  />
                </ListItem>
              </li>
              {profile.userTypeCode == 2 && (
                <li className="nav-item">
                  <CustomLink href="/insights">
                    <ListItem button className={classes.root}
                      onClick={() => {
                        setTimeout(() => {
                          close_drawer("SideNavMenu");
                        }, 100);
                      }}
                    >
                      <ListItemIcon className={classes.listIconDiv}>
                        <Icon
                          icon={`${DASHBOARD_ICON}#dashboard_icon`}
                          color={theme.type !== "light" ? "#F5D0FF" : "#5F596B"}
                          width={24}
                          height={22}
                          alt="dashboard_icon"
                          viewBox="0 0 24 22"
                        />
                      </ListItemIcon>
                      <ListItemText
                        className={classes.primary}
                        primary={lang.dashboard}
                      />
                    </ListItem>
                  </CustomLink>
                </li>)}
              {profile.userTypeCode == 2 && (
                <li
                  className="nav-item d-flex align-items-center"
                >
                  <ListItem button className={classes.root} onClick={() => {
                    Route.push("/my_orders");
                    setTimeout(() => {
                      close_drawer();
                    }, 100);
                  }}>
                    <ListItemIcon className={classes.listIconDiv}>
                      <Icon
                        icon={`${env.SIDEBAR_ORDER}#bagicon`}
                        color={theme.type !== "light" ? "#F5D0FF" : "#5F596B"}
                        width={24}
                        height={22}
                        style={{ width: "5.128vw" }}
                        alt="My Subscriptions Icon"
                        viewBox="0 0 22.241 22.294"
                      />
                    </ListItemIcon>
                    <ListItemText
                      className={classes.primary}
                      primary={lang.myOrder}
                    />
                  </ListItem>
                  {Boolean(orderCount) && (
                    <div className="ml-3 orderCountLabelCss">
                      <span className="fntSz12 d-flex justify-content-center align-items-center">
                        {orderCount}
                      </span>
                    </div>
                  )}
                </li>
              )}
              {profile?.userTypeCode === 1 && <li className="nav-item">
                <CustomLink href="/purchased-gallery">
                  <ListItem button className={classes.root}
                    onClick={() => {
                      setTimeout(() => {
                        close_drawer("SideNavMenu");
                      }, 100);
                    }}
                  >
                    <ListItemIcon className={classes.listIconDiv}>
                      <Icon
                        icon={`${env.Purchased_Posts_Icon}#Group_50064`}
                        color={theme.type !== "light" ? "#F5D0FF" : "#5F596B"}
                        width={24}
                        height={22}
                        alt="exclusive_post_icons"
                        viewBox="0 0 24 22"
                      />
                    </ListItemIcon>
                    <ListItemText
                      className={classes.primary}
                      primary={lang.purchasedPosts}
                    />
                  </ListItem>
                </CustomLink>
              </li>}
              {profile?.userTypeCode === 2 &&
                <li className="nav-item">
                  <ListItem button className={classes.root}
                    onClick={() => {
                      Route.push(Route.pathname, "/my-subscribers");
                      close_drawer();
                      setTimeout(() => {
                        open_drawer(
                          "MySubscribersComponent",
                          {
                            handleCloseDrawer: Route.back,
                            homePageref: null,
                          },
                          "right"
                        );
                      }, 100);
                    }}>
                    <ListItemIcon className={classes.listIconDiv}>
                      <Icon
                        icon={`${env.MY_SUBSCRIBERS_SVG}#my_subscriber`}
                        color={theme.type !== "light" ? "#F5D0FF" : "#5F596B"}
                        width={24}
                        height={22}
                        alt="My Subscribers Icon"
                        viewBox="0 0 24 22"
                      />
                    </ListItemIcon>
                    <ListItemText
                      className={classes.primary}
                      primary={lang.subscribers}
                    />
                  </ListItem>
                </li>}
              {profile?.userTypeCode === 1 && <li className="nav-item">
                <ListItem button className={classes.root}
                  onClick={() => {
                    Route.push("/my-subscriptions");
                    close_drawer();
                    setTimeout(() => {
                      open_drawer(
                        "MySubsComponent",
                        {
                          handleCloseDrawer: Route.back,
                          homePageref: null,
                        },
                        "right"
                      );
                    }, 100);
                  }}>
                  <ListItemIcon className={classes.listIconDiv}>
                    <Icon
                      icon={`${env.MY_SUBSCRIPTION_SVG}#my_subscription`}
                      color={theme.type !== "light" ? "#F5D0FF" : "#5F596B"}
                      width={24}
                      height={22}
                      alt="My Subscriptions Icon"
                      viewBox="0 0 24 22"
                    />
                  </ListItemIcon>
                  <ListItemText
                    className={classes.primary}
                    primary={lang.subscriptions}
                  />
                </ListItem>
              </li>}
              {profile.userTypeCode == 2 && (
                <li className="nav-item">
                  <CustomLink href="/my-vault">
                    <ListItem button className={classes.root}
                      onClick={() => {
                        setTimeout(() => {
                          close_drawer("SideNavMenu");
                        }, 100);
                      }}
                    >
                      <ListItemIcon className={classes.listIconDiv}>
                        <Icon
                          icon={`${MY_VAULT_LOGO}#myVault`}
                          color={theme.type !== "light" ? "#F5D0FF" : "#5F596B"}
                          width={24}
                          height={22}
                          alt="myVault_logo"
                          viewBox="0 0 24 22"
                        />
                      </ListItemIcon>
                      <ListItemText
                        className={classes.primary}
                        primary={lang.vault}
                      />
                    </ListItem>
                  </CustomLink>
                </li>)}
              {profile.userTypeCode == 2 && (
                <li className="nav-item">
                  <CustomLink href="/video-schedule">
                    <ListItem button className={classes.root}
                      onClick={() => {
                        setTimeout(() => {
                          close_drawer("SideNavMenu");
                        }, 100);
                      }}
                    >
                      <ListItemIcon className={classes.listIconDiv}>
                        <Icon
                          icon={`${env.SIDEBAR_SCHEDULE}#scheduleicon`}
                          color={theme.type !== "light" ? "#F5D0FF" : "#5F596B"}
                          width={24}
                          height={22}
                          alt={lang.setupSchedule}
                          viewBox="0 0 24 22"
                        />
                      </ListItemIcon>
                      <ListItemText
                        className={classes.primary}
                        primary={lang.setupSchedule}
                      />
                    </ListItem>
                  </CustomLink>
                </li>)}
              {/* {profile?.userTypeCode === 2 &&
                <li className="nav-item">
                  <ListItem button className={classes.root}
                    onClick={() => {
                      Route.push(Route.pathname, "/video-call");
                      close_drawer();
                      setTimeout(() => {
                        open_drawer(
                          "PriceSection",
                          {
                            handleCloseDrawer: () => close_drawer("PriceSection"),
                            homePageref: null,
                          },
                          "right"
                        );
                      }, 100);
                    }}>
                    <ListItemIcon className={classes.listIconDiv}>
                      <Icon
                        icon={`${env.SIDEBAR_SCHEDULE}#scheduleicon`}
                        color={theme.type !== "light" ? "#F5D0FF" : "#5F596B"}
                        width={24}
                        height={22}
                        alt={lang.setupPrice}
                        viewBox="0 0 24 22"
                      />
                    </ListItemIcon>
                    <ListItemText
                      className={classes.primary}
                      primary={lang.setupPrice}
                    />
                  </ListItem>
                </li>} */}
              {profile?.userTypeCode === 1 && <li className="nav-item">
                <CustomLink href="/virtual-request">
                  <ListItem button className={classes.root}
                    onClick={() => {
                      setTimeout(() => {
                        close_drawer("SideNavMenu");
                      }, 100);
                    }}>
                    <ListItemIcon className={classes.listIconDiv}>
                      <Icon
                        icon={`${env.SIDEBAR_ORDER}#bagicon`}
                        color={theme.type !== "light" ? "#F5D0FF" : "#5F596B"}
                        width={24}
                        height={22}
                        alt="My Purchase Icon"
                        viewBox="0 0 24 22"
                      />
                    </ListItemIcon>
                    <ListItemText
                      className={classes.primary}
                      primary={lang.myPurchases}
                    />
                  </ListItem>
                </CustomLink>
              </li>}
              <li className="nav-item">
                <CustomLink href="/wallet">
                  <ListItem button className={`${classes.root} border-0`}
                    onClick={() => {
                      setTimeout(() => {
                        close_drawer("SideNavMenu");
                      }, 100);
                    }}
                  >
                    <ListItemIcon className={classes.listIconDiv}>
                      <Icon
                        icon={`${env.Wallet_Icon}#wallet`}
                        color={theme.type !== "light" ? "#F5D0FF" : "#5F596B"}
                        width={24}
                        height={22}
                        alt="wallet_icon"
                        viewBox="0 0 24 22"
                      />
                    </ListItemIcon>
                    <ListItemText
                      className={classes.primary}
                      primary={lang.wallet}
                    />
                  </ListItem>
                </CustomLink>
              </li>
            </ul>

            <div className={`d-flex flex-row flex-nowrap justify-content-between align-items-center my-2`} onClick={() => handleMenuToggle("setting")}>
              <h6 className="light_app_text mb-0">Settings</h6>
              <Icon
                icon={`${env.p_down_arrow}#Layer_1`}
                color={"var(--l_app_text)"}
                width={16}
                height={14}
                style={{ transform: toggleData?.setting ? "rotate(180deg)" : "", fontWeight: "600" }}
                viewBox='0 0 16 14'
              />
            </div>
            <div style={{ overflow: "hidden", transition: "max-height 1s ease-in-out", maxHeight: toggleData?.setting ? "500px" : "0px" }}>
              <ul className="nav flex-column flex-nowrap sidebar_bg px-3 py-2 mb-3 radius_12">
                {profile.userTypeCode == 2 && (
                  <li
                    className="nav-item d-flex align-items-center"
                  >
                    <ListItem button className={classes.root} onClick={() => {
                      Route.push("/myAgency");
                      setTimeout(() => {
                        close_drawer();
                      }, 100);
                    }}>
                      <ListItemIcon className={classes.listIconDiv}>
                        <Icon
                          icon={`${AGENCY_LOGO}#agency_logo`}
                          color={theme.type !== "light" ? "#F5D0FF" : "#5F596B"}
                          width={24}
                          height={22}
                          alt="agency_logo"
                          viewBox="0 0 24 22"
                        />
                      </ListItemIcon>
                      <ListItemText
                        className={classes.primary}
                        primary={lang.myAgency}
                      />
                    </ListItem>
                  </li>
                )}
                {profile.userTypeCode == 2 && (
                  <li className="nav-item">
                    <ListItem button className={classes.root}
                      onClick={() => {
                        Route.push("/automessage");
                        setTimeout(() => {
                          close_drawer("SideNavMenu");
                        }, 100);
                      }}>
                      <ListItemIcon className={classes.listIconDiv}>
                        <Icon
                          icon={`${env.creator_tool_icon}#noun_design_43765`}
                          color={theme.type !== "light" ? "#F5D0FF" : "#5F596B"}
                          width={22}
                          height={22}
                          style={{ width: "4.266vw" }}
                          alt="creator_tool_icon"
                          viewBox="0 0 20 20"
                        />
                      </ListItemIcon>
                      <ListItemText
                        className={classes.primary}
                        primary={lang.crmAutomation}
                      />
                    </ListItem>
                  </li>
                )}
                {profile.userTypeCode == 2 && (
                  <li className="nav-item">
                    <ListItem button className={classes.root} onClick={() => {
                      Route.push("/manage-list");
                      setTimeout(() => {
                        close_drawer("SideNavMenu");
                      }, 100);
                    }}>
                      <ListItemIcon className={classes.listIconDiv}>
                        <Icon
                          icon={`${env.MANAGE_LIST}#manageList`}
                          color={theme.type !== "light" ? "#F5D0FF" : "#5F596B"}
                          width={24}
                          height={22}
                          style={{ width: "4.8vw" }}
                          alt="lang_icon"
                          viewBox="0 0 18 18"
                        />
                      </ListItemIcon>
                      <ListItemText
                        className={classes.primary}
                        primary={lang.manageLists}
                      />
                    </ListItem>
                  </li>)}
                {profile.userTypeCode == 2 && (
                  <li className="nav-item">
                    <ListItem button className={`${classes.root}`}
                      onClick={() => {
                        Route.push(Route.pathname, "/subscription-settings");
                        close_drawer();
                        setTimeout(() => {
                          open_drawer(
                            "SubscriptionSettings",
                            {
                              handleCloseDrawer: Route.back,
                              homePageref: null,
                            },
                            "right"
                          );
                        }, 100);
                      }}>
                      <ListItemIcon className={classes.listIconDiv}>
                        <Icon
                          icon={`${env.SETTINGS_SVG}#subscription_settings`}
                          color={theme.type !== "light" ? "#F5D0FF" : "#5F596B"}
                          width={24}
                          height={22}
                          alt="Settings Icon"
                          viewBox="0 0 24 22"
                        />
                      </ListItemIcon>
                      <ListItemText
                        className={`${classes.primary} manageSubscription`}
                        primary={lang.subsSettings}
                      />
                    </ListItem>
                  </li>
                )}
                <li className="nav-item">
                  <ListItem button className={`${classes.root} border-0`}
                    onClick={() => {
                      Route.push("/notification-settings");
                      setTimeout(() => {
                        close_drawer();
                      }, 100);
                    }}>
                    <ListItemIcon className={classes.listIconDiv}>
                      <Icon
                        icon={`${env.NOTIFICATION_ICON_SVG}#notification_setting`}
                        color={theme.type !== "light" ? "#F5D0FF" : "#5F596B"}
                        width={24}
                        height={22}
                        alt="Settings Icon"
                        viewBox="0 0 24 22"
                      />
                    </ListItemIcon>
                    <ListItemText
                      className={classes.primary}
                      primary={lang.notificationsetting}
                    />
                  </ListItem>
                </li>
              </ul>
            </div>

            <div className={`d-flex flex-row flex-nowrap justify-content-between align-items-center my-2`} onClick={() => handleMenuToggle("others")}>
              <h6 className="light_app_text mb-0">Other</h6>
              <Icon
                icon={`${env.p_down_arrow}#Layer_1`}
                color={"var(--l_app_text)"}
                width={16}
                height={14}
                style={{ transform: toggleData?.others ? "rotate(180deg)" : "", fontWeight: "600" }}
                viewBox='0 0 16 14'
              />
            </div>
            <div style={{ overflow: "hidden", transition: "max-height 1s ease-in-out", maxHeight: toggleData?.others ? "500px" : "0px" }}>
              <ul className="nav flex-column flex-nowrap sidebar_bg px-3 py-2 mb-3 radius_12">
                <li className="nav-item"
                >
                  {profile.userTypeCode === 1 && (<li className="nav-item">
                    <ListItem button className={classes.root} onClick={() => {
                      Route.push("/become-creator");
                      setTimeout(() => {
                        close_drawer("SideNavMenu");
                      }, 100);
                    }}>
                      <ListItemIcon className={classes.listIconDiv}>
                        <Icon
                          icon={`${env.BECOME_CREATOR}#beacomeCreator`}
                          color={theme.type !== "light" ? "#F5D0FF" : "#5F596B"}
                          width={24}
                          height={22}
                          alt="heart_icon"
                          viewBox="0 0 24 22"
                        />
                      </ListItemIcon>
                      <ListItemText
                        className={classes.primary}
                        primary={'Become a creator'}
                      />
                    </ListItem>
                  </li>)}
                  <ListItem button className={classes.root} onClick={() => {
                    Route.push("/faqs");
                    setTimeout(() => {
                      close_drawer("SideNavMenu");
                    }, 100);
                  }}>
                    <ListItemIcon className={classes.listIconDiv}>
                      <Icon
                        icon={`${env.FAQs_Icon}#Group_10005`}
                        color={theme.type !== "light" ? "#F5D0FF" : "#5F596B"}
                        width={24}
                        height={22}
                        style={{ width: "4.266vw" }}
                        alt="faqs_icon"
                        viewBox="0 0 18 16"
                      />
                    </ListItemIcon>
                    <ListItemText
                      className={classes.primary}
                      primary={lang.faqs}
                    />
                  </ListItem>
                </li>
                {/* <li className="nav-item">
                  <ListItem button className={classes.root} onClick={() => {
                    Route.push(Route.pathname, "/change-language");
                    open_drawer(
                      "Language",
                      {
                        handleCloseDrawer: Route.back,
                        homePageref: null,
                      },
                      "right"
                    );
                    setTimeout(() => {
                      close_drawer("SideNavMenu");
                    }, 100);
                  }}>
                    <ListItemIcon className={classes.listIconDiv}>
                      <Icon
                        icon={`${env.SIDEBAR_LANGUAGE}#languageIcon`}
                        color={theme.type !== "light" ? "#F5D0FF" : "#5F596B"}
                        width={24}
                        height={22}
                        style={{ width: "4.8vw" }}
                        alt="lang_icon"
                        viewBox="0 0 18 18"
                      />
                    </ListItemIcon>
                    <ListItemText
                      className={classes.primary}
                      primary={lang.language}
                    />
                  </ListItem>
                </li> */}
                <li
                  className="nav-item"
                  onClick={() => {
                    close_drawer();
                    setTimeout(() => {
                      open_drawer("ReferFriends", {}, "right");
                    }, 100);
                  }}
                >
                  <ListItem button className={classes.root}>
                    <ListItemIcon className={classes.listIconDiv}>
                      <Icon
                        icon={`${env.SIDEBAR_REFER}#referalIcon`}
                        color={theme.type !== "light" ? "#F5D0FF" : "#5F596B"}
                        width={24}
                        height={22}
                        style={{ width: "5.333vw" }}
                        alt="refer_frnd_icon"
                        viewBox="0 0 20 20"
                      />
                    </ListItemIcon>
                    <ListItemText
                      className={classes.primary}
                      primary={lang.referYourFriends}
                    />
                  </ListItem>
                </li>
                <li className="nav-item">
                  <ListItem button className={classes.root} onClick={() => {
                    Route.push(Route.pathname, "/report-problem");
                    open_drawer(
                      "report_problem",
                      {
                        handleCloseDrawer: Route.back,
                        homePageref: null,
                      },
                      "right"
                    );
                    setTimeout(() => {
                      close_drawer("SideNavMenu");
                    }, 100);
                  }}>
                    <ListItemIcon className={classes.listIconDiv}>
                      <Icon
                        icon={`${env.SIDEBAR_REPORT_PROBLEM}#reportIcon`}
                        color={theme.type !== "light" ? "#F5D0FF" : "#5F596B"}
                        width={24}
                        height={22}
                        style={{ width: "5.466vw" }}
                        alt="report_problem_icon"
                        viewBox="0 0 20 20"
                      />
                    </ListItemIcon>
                    <ListItemText
                      className={classes.primary}
                      primary={lang.reportProblem}
                    />
                  </ListItem>
                </li>
                {profile.userTypeCode == 2 && (
                  <li className="nav-item">
                    <ListItem button className={`${classes.root} border-0`} onClick={() => {
                      Route.push(Route.pathname, "/review");
                      close_drawer();
                      setTimeout(() => {
                        open_drawer(
                          "reviewShoutout",
                          {
                            handleCloseDrawer: Route.back,
                            homePageref: null,
                          },
                          "right"
                        );
                      }, 100);
                    }}>
                      <ListItemIcon className={classes.listIconDiv}>
                        <Icon
                          icon={`${env.reviewTabIcon}#reviewTabIcon`}
                          color={theme.type !== "light" ? "#F5D0FF" : "#5F596B"}
                          width={20}
                          height={20}
                          style={{ width: "4.266vw" }}
                          alt="review tab"
                          viewBox="0 0 17.644 18.346"
                        />
                      </ListItemIcon>
                      <ListItemText
                        className={classes.primary}
                        primary={lang.reviews}
                      />
                    </ListItem>
                  </li>
                )}
              </ul>
            </div>

            <ul className="nav flex-column sidebar_bg px-3 py-1 my-3 radius_12">
              <li
                className="nav-item"
                onClick={() => {
                  open_drawer("Logout", {}, "bottom");
                }}
              >
                <ListItem button className={`${classes.root} border-0`}>
                  <ListItemIcon className={classes.listIconDiv}>
                    <Icon
                      icon={`${env.Logout_Icon_Black}#logout_icon`}
                      color={theme.type !== "light" ? "#F5D0FF" : "#5F596B"}
                      width={20}
                      height={22}
                      style={{ width: "4.8vw" }}
                      alt="logout_icon"
                      viewBox="0 0 16 19"
                    />
                  </ListItemIcon>
                  <ListItemText
                    className={classes.primary}
                    primary={lang.logout}
                  />
                </ListItem>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <style jsx>
        {`
          :global(.MuiDrawer-paper) {
          }
          :global(.MuiDrawer-paper > div) {
          }
          .sideNavMenu {
            width: 75vw;
            height: calc(var(--vhCustom, 1vh) * 100);
            position: relative;
            float: right;
          }
          .iconDiv {
            width: 9.506vw;
          }
          #profileImage {
            width: 88px;
            height: 88px;
            border-radius: 50%;
            font-size: 2rem;
            color: #fff;
            text-align: center;
            text-transform: uppercase;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          :global(.manageSubscription span){
            line-height:1 !important;
          }
          :global(.MuiListItemText-primary){
            font-size: 17px !important;
            font-family: "Roboto"; sans-serif !important;
            opacity: 1 !important;
            color: "var(--l_app_text) !important";
            line-height: 0.8 !important;
            vertical-align: text-bottom !important;
          }
          :global(.MuiTypography-body1){
            font-size: 16px !important;
            font-weight: 300;
          }
        `}
      </style>
    </Wrapper >
  );
}
