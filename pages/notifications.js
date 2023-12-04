import Router from "next/router";
import dynamic from "next/dynamic";
import { useTheme } from "react-jss";
import { useDispatch, useSelector } from "react-redux";
import { Avatar } from "@material-ui/core";
import React, { useEffect, useState } from "react";

import useDetectHeaderHight from "../hooks/detectHeader-hight";
import { close_drawer, open_drawer, open_progress, returnLogin, startLoader, stopLoader } from "../lib/global";
import { getCookie, getCookiees } from "../lib/session";
import { getUserNotifications, notificationUnreadCount } from "../services/notification";
import { findDayAgo } from "../lib/date-operation/date-operation";
import {
  NOTIFICATION_PLACEHOLDER,
  Placeholder_PROFILE_IMG,
} from "../lib/config";
import useLang from "../hooks/language";
import { getNotificationCount } from "../redux/actions/auth";
import PaginationIndicator from "../components/pagination/paginationIndicator";
import CustomDataLoader from "../components/loader/custom-data-loading";
import { getStories } from "../services/assets";
import { isAgency } from "../lib/config/creds";
import { handleContextMenu } from "../lib/helper";

const FigureCloudinayImage = dynamic(() => import("../components/cloudinayImage/cloudinaryImage"), { ssr: false });
const Header = dynamic(() => import("../components/header/header"), { ssr: false });
const Img = dynamic(() => import("../components/ui/Img/Img"), { ssr: false });

const Notification = (props) => {
  const [lang] = useLang();
  const theme = useTheme();
  const dispatch = useDispatch();
  let userId = getCookie("uid");

  useDetectHeaderHight("notificationHeader", "notificationBody");

  const [loader, setLoader] = useState(true);
  const [pageCount, setPageCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0);
  const [notifications, setNotifications] = useState(null);
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

  useEffect(() => {
    getNotifications();
  }, []);

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
      open_drawer("STORY_CAROUSEL_MOB", propsToPass, "right");
    };
  }

  const clickOnNotification = (item = {}) => {
    // This Notification Flow is for MobileView

    switch (item?.notifyType) {

      case 1:
      case 2:
      case 6:
      case 44:
      case 46:
        return Router.push(`/post/${item.metaData?.assetId || item.metaData?.id}`);

      case 0:
        return Router.push(`/live/popular`);

      case 3:
        if (item.metaData.userTypeCode === 2) {
          return Router.push(`/${item?.metaData?.userName} `);
        }

      case 13:
        handleOpenStory(item);
        break;

      case 16:
      case 41:
        return Router.push(`/post/${item.metaData?.postId}`)
      case 43:
        return Router.push(`/chat`)

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
        return Router.push('/my-orders');

      case 37:
      case 38:
      case 39:
        return Router.push(`/virtual-request`);

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

      default:
        return close_drawer();
    }
  };

  const getNotification = (data = {}) => {
    const { metaData = {} } = data;
    return (
      <div
        className="notification-tile row align-content-center mx-0 mb-2"
        onClick={() => clickOnNotification(data)}
      >
        <div className="col-auto px-0 pr-3 d-flex align-items-center callout-none" onContextMenu={handleContextMenu} >
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

        <div className="notification col px-0 pr-2">
          <div className="d-flex justify-content-between">
            <p className="mb-1 fntSz14">{data.title}</p>
          </div>

          <p className="fntSz13 text-blue34">{data.body}</p>
        </div>
        <div className="col-auto px-0 text-blue34 fntSz11 d-flex align-items-center">
          {data.createdtimestamp && findDayAgo(data?.createdtimestamp, true)}
        </div>
      </div>
    );
  };

  const getNotifications = async (page = 0) => {

    page === 0 && startLoader();

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

      if (page === 0 && window['myPrevRoute'] && !window['myPrevRoute']?.includes?.('/login')) {
        let notificationCnt = await notificationUnreadCount();
        dispatch(getNotificationCount(notificationCnt?.data?.unreadCount));
      }

      setPageCount(page + 1);
      page === 0 && stopLoader();

      setLoader(false);

    } catch (err) {
      console.error("ERROR IN getNotifications", err);
      page === 0 && stopLoader();
      setLoader(false);
    }
  };

  return (
    <div className="text-app wrap bg-dark-custom d-flex flex-column h-screen">
      <div>
        <Header
          id="notificationHeader"
          back={props.onClose}
          closeTrigger={props.onCloseDrawer}
          title={"Notifications"}
        // title={lang.notifications}
        />
      </div>

      <div
        className="pb-4 h-100 overflow-auto"
        id="notificationBody"
        style={{ paddingTop: "60px" }}
      >
        <div className="notification-list h-100 col-12 px-2 pt-4">
          {notifications && notifications.length > 0
            ? notifications.map((notification, index) => {
              return <div key={index} className="borderBottom mt-2">{getNotification(notification)}</div>;
            })
            : notifications && (
              <div className="d-flex flex-column justify-content-center h-75 align-items-center">
                <Img
                  height="80px"
                  src={NOTIFICATION_PLACEHOLDER}
                  alt="Notification Placeholder image"
                />
                <p className="mt-3 text-app bold">
                  {lang.noNotifications}
                </p>
              </div>
            )}
        </div>

        <PaginationIndicator
          id="notificationBody"
          totalData={notifications}
          totalCount={totalCount}
          pageEventHandler={() => {
            if (totalCount !== notifications?.length && !loader) {
              setLoader(true);
              getNotifications(pageCount);
            }
          }}
        />

      </div>
    </div>
  );
};

Notification.getInitialProps = async ({ Component, ctx }) => {
  const { req, res } = ctx;

  const auth = getCookiees("auth", req);
  if (auth) return returnLogin(req, res);
  return {};
};

export default Notification;
