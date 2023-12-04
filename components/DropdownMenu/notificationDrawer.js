import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import { withStyles } from "@material-ui/core/styles";
import Router, { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { Avatar } from "@material-ui/core";

import {
  NOTIFICATION_PLACEHOLDER,
  P_CLOSE_ICONS,
  NOTIFICATION_ICON,
  sharpCornerIconLight,
  sharpCornerIconDark,
} from "../../lib/config";
import { findDayAgo } from "../../lib/date-operation/date-operation";
import { getUserNotifications, notificationUnreadCount } from "../../services/notification";
import FigureCloudinayImage from "../cloudinayImage/cloudinaryImage";
import Image from "../image/image";
import Loader from "../loader/loader";
import Img from "../ui/Img/Img";
import { close_drawer, open_drawer, open_progress } from "../../lib/global";
import useLang from "../../hooks/language";
import { useTheme } from "react-jss";
import Icon from "../image/icon";
import { getNotificationCount } from "../../redux/actions/auth";
import isMobile from "../../hooks/isMobile";
import PaginationIndicator from "../pagination/paginationIndicator";
import CustomDataLoader from "../loader/custom-data-loading";
import { getStories } from "../../services/assets";
import isTablet from "../../hooks/isTablet";
import { getCookie } from "../../lib/session";
import { isAgency } from "../../lib/config/creds";
import { handleContextMenu } from "../../lib/helper";


const styles = (theme) => ({
  buttonClass: {
    minWidth: "fit-content",
    width: "fit-content",
    padding: "0",
  },
  menuList: {
    padding: "0 !important",
    margin: "0 !important",
    width: "500px !important",
    overflow: "hidden !important",
  },
  menuPaper: {
    background: "#fff",
    padding: "0",
  },
  iconRoot: {
    minWidth: "2.928vw",
  },
  menuLabel: {
    color: "#fff",
    fontFamily: `"Roboto", sans-serif !important`,
    fontSize: "1.171vw",
  },
});

const NotificationMenu = (props) => {
  const [lang] = useLang();
  const theme = useTheme();
  const router = useRouter();
  let userId = getCookie("uid");
  const dispatch = useDispatch();
  const [mobileView] = isMobile();
  const [tabletView] = isTablet();
  const { button, classes } = props;

  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [loader, setLoader] = useState(true);
  const [pageCount, setPageCount] = useState(0)
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

  useEffect(() => {
    anchorEl && getNotifications();
  }, [anchorEl]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const getNotifications = async (page = 0) => {
    try {
      const payload = {
        skip: page * 10,
        limit: 10,
      }
      let data = await getUserNotifications(payload);

      if (page === 0) {
        setNotifications(data.data.data);
      } else {
        setNotifications([...notifications, ...data.data.data]);
      }
      setTotalCount(data.data.total_count);

      if (page === 0) {
        let notificationCnt = await notificationUnreadCount();
        dispatch(getNotificationCount(notificationCnt?.data?.unreadCount));
      }

      setPageCount(page + 1);
      setLoader(false);
      // stopLoader();
    } catch (err) {
      console.error("ERROR IN getNotifications", err);
      setLoader(false);
      // stopLoader();
    }
  };


  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpenStory = async (item) => {

    // API Call
    let payload = {
      skip: 0,
    }
    if (isAgency()) {
      payload["userId"] = selectedCreatorId;
    }
    const res = await getStories(payload);

    if (res.status === 200 && res.data?.data?.length) {
      const storyData = [...res.data.data];
      const activeIndex = storyData.findIndex((story) => story?.userId === item?.metaData?.userId);

      const propsToPass = {
        drawerData: storyData,
        activeStory: activeIndex,
        // setActiveState: setActiveState,
        theme: theme,
        back: () => close_drawer(),
      }
      open_drawer("STORY_CAROUSEL_DESKTOP", propsToPass, "right");
    };
  }

  const clickOnNotification = (item = {}) => {
    // This Notification Flow is for Desktop

    switch (item?.notifyType) {
      case 1:
      case 2:
      case 6:
      case 46:
        return Router.push(`/post/${item.metaData?.assetId || item.metaData?.id}`);

      case 0:
        return Router.push(`/live/popular`);

      case 3:
        if (item.metaData.userTypeCode === 2) {
          return Router.push(`/${item?.metaData?.userName} `);
        }
      // return item.metaData.userTypeCode === 2 && Router.push(`/${item?.metaData?.userName} `);

      case 13:
        handleOpenStory(item);
        break;

      case 16:
      case 41:
        return Router.push(`/post/${item.metaData?.postId}`)
      case 43:
      case 44:
        return Router.push(`/chat?uid=${item.metaData?.userId}`)



      case 14:
      case 15:
      case 25:
      case 26:
      case 27:
      case 28:
        return

      case 35:
      case 45:
      case 12:
      case 42:
        return Router.push('/wallet');

      case 36:
        return Router.push('/my-orders')

      case 37:
      case 38:
      case 39:
        return Router.push(`/virtual-request`)

      case 40:
        if (item?.userType == 1) {
          return Router.push('virtual-request')
        }
        else {
          return Router.push('/my-orders')
        }

      case 48:
        if (item?.metaData.purchasedById === userId) Router.push('/virtual-request');
        else Router.push('/my_orders');
        break;
      case 53:
      case 51:
        return Router.push('/profile')

      default:
        break;
    }
  };

  const getNotification = (data = {}) => {
    const { metaData = {} } = data;
    return (
      <div
        className="notification-tile d-flex col-12 align-content-center mx-0 mb-3 cursorPtr custom-bg-hover align-items-center"
        onClick={() => clickOnNotification(data)}
      >
        <div className="col-auto px-0 pr-3 callout-none" onContextMenu={handleContextMenu}>
          {!data?.body?.includes("anonymous")
            ? metaData?.userProfilePic || data?.metaData?.profilePic || data?.image
              ? <FigureCloudinayImage
                publicId={metaData?.userProfilePic || data?.metaData?.profilePic || data?.image}
                width={60}
                ratio={1}
                className="follow-profile"
              />
              : <Avatar className="mui-cust-avatar">
                <span>{metaData?.userName?.[0] || data?.userName?.[0]}</span>
              </Avatar>
            : <Avatar className="mui-cust-avatar" src="/not-pic-specified.jpg" />
          }
        </div>

        <div className="notification col px-0 pr-2 my-auto">
          <div className="d-flex justify-content-between">
            <p className="fntSz15 mb-0">{data.title}</p>
          </div>

          <p className="fntSz13 mb-0">{data.body}</p>
        </div>
        <div className="col-auto px-0 fntSz13">
          {data.createdtimestamp && findDayAgo(data?.createdtimestamp, true)}
        </div>
      </div>
    );
  };

  return (
    <div className={Boolean(anchorEl) ? "active-notification" : ""}>
      <Button
        aria-controls="customized-menu"
        aria-haspopup="true"
        color="primary"
        classes={{ root: classes.buttonClass }}
        onClick={handleClick}
      >
        <Icon
          icon={`${NOTIFICATION_ICON}#notification`}
          color={theme.type == "light" ? "#666666" : "#fff"}
          width={mobileView ? 25 : tabletView ? 2.2 : 1.5}
          height={mobileView ? 25 : tabletView ? 2.2 : 1.5}
          unit={mobileView ? "px" : "vw"}
          // style={{ marginTop: "0.5rem" }}
          hoverColor={theme.appColor}
          // onClick={handleClick}
          // class={{ root: classes.buttonClass }}
          alt="notification bell icon"
          viewBox="0 0 23 23"
        />
      </Button>

      <Menu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        elevation={5}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        className="notificationDrawer"
        classes={{ paper: classes.menuPaper, list: classes.menuList }}
      >
        <div
          className="notification-drawer d-flex flex-column h-100"
          style={{ overflow: "hidden", maxHeight: "420px" }}
        >
          {(router.pathname.includes("/")) &&
            <Image
              src={theme.type == "light" ? sharpCornerIconLight : sharpCornerIconDark}
              className="ml-2 sharpNotificationIcon"
              width={20}
              height={20}
            />}
          <div className="notification-header py-3 border-bottom ">
            <div className=" d-flex justify-content-between align-items-center col-12">
              <h4 className="w-700">{lang.notifications}</h4>

              <Icon
                icon={`${P_CLOSE_ICONS}#cross_btn`}
                color={theme.type == "light" ? "#000" : "#fff"}
                width={25}
                height={20}
                onClick={handleClose}
                class="cursorPtr"
                alt="close-icon"
              />
            </div>
          </div>

          <div id="notification-body" className="h-100 overflow-auto">
            <div className="pb-2 h-100">
              <div className="notification-list h-100 col-12 px-2 pt-3">
                {notifications && notifications.length > 0
                  ? notifications.map((notification, index) => {
                    return <div key={index}>{getNotification(notification)}</div>;
                  })
                  : notifications
                    ? <div className="d-flex py-5 flex-column justify-content-center h-75 align-items-center">
                      <Img
                        height="60px"
                        src={NOTIFICATION_PLACEHOLDER}
                        alt="Notification Placeholder image"
                      />
                      <p className="mt-3 text-app bold">
                        {lang.noNotifications}
                      </p>
                    </div>
                    : <div className="d-flex py-5 flex-column justify-content-center h-75 align-items-center">
                      <Loader />
                    </div>
                }
              </div>
            </div>

            {loader
              ? <div className="text-center">
                <CustomDataLoader type="normal" isLoading={loader} />
              </div>
              : ""
            }

            <PaginationIndicator
              id="notification-body"
              totalData={notifications}
              totalCount={totalCount}
              pageEventHandler={() => {
                if (totalCount !== notifications.length && !loader) {
                  setLoader(true);
                  getNotifications(pageCount);
                }
              }}
            />
          </div>
        </div>
      </Menu>
      <style jsx>{`
          :global(.notificationDrawer .MuiPopover-paper){
            top: 66px !important;
            // left: 763px !important;
            left: calc(100% - 570px)!important;
            background: var(--l_app_bg);
          }
          :global(.notification-drawer){
            background: var(--l_app_bg);
            color: var(--l_app_text);
          }
          :global(.notification-drawer){
            background: var(--l_app_bg);
            color: var(--l_app_text);
          }
          :global(.notification-drawer){
            background: var(--l_app_bg);
            color: var(--l_app_text);
          }
      `}</style>
    </div>
  );
};

export default withStyles(styles)(NotificationMenu);
