import React, { useState, useEffect, useRef } from "react";
import Wrapper from "../../hoc/Wrapper";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import moment from "moment";
import momentzone from "moment-timezone";
import Router from "next/router";
import {
  open_dialog,
  close_dialog,
  startLoader,
  stopLoader,
  Toast,
  open_progress,
  close_progress,
  timeDifferenceCalc,
} from "../../lib/global";
import dynamic from "next/dynamic";
import { useTheme } from "react-jss";
import {
  patchReqToShoutout,
  getVirtualOrderDetail,
} from "../../services/shoutout";
import { useRouter } from "next/router";
import FigureCloudinayImage from "../../components/cloudinayImage/cloudinaryImage";
import { useSelector } from "react-redux";
import isMobile from "../../hooks/isMobile";
import useLang from "../../hooks/language";
import Avatar from "@material-ui/core/Avatar";
import CustomDataLoader from "../../components/loader/custom-data-loading";
import Placeholder from "../profile/placeholder";
import { NO_ORDER_PLACEHOLDER, playIcon, ratingIcon, GO_LIVE_SCREEN, defaultTimeZone, MQTT_TOPIC, APP_NAME, DV_Reload_Icon } from "../../lib/config"
import Icon from "../../components/image/icon";
import Img from "../../components/ui/Img/Img";
import { patchVideoOrderAPI, startIsometrikCall } from "../../services/videoCall";
import { getCookie, setCookie } from "../../lib/session";
import { addCalendarEvent } from "../../lib/calendarEvent";
import { customMessageSubject } from "../../lib/rxSubject";
import { Tooltip } from '@material-ui/core'
import Refresh from '@material-ui/icons/Refresh'
import Head from "next/head";
import { isAgency } from "../../lib/config/creds";
import Image from "../../components/image/image";
import { handleContextMenu } from "../../lib/helper";
import { open_drawer } from "../../lib/global/loader";

const Button = dynamic(() => import("../../components/button/button"), { ssr: false });

const MyOrderDetail = (props) => {
  const [lang] = useLang();
  const [mobileView] = isMobile();
  const router = useRouter();
  const ordId = router?.query?.orderId;
  const theme = useTheme();
  const [purchaseListOrder, setPurchaseListOrder] = useState([]);
  const [initialOrder, setInitialLoader] = useState(true);
  const [currentOrder, setCurrentOrder] = useState([]);
  const [currentTimeStamp, setCurrentTimeStamp] = useState(moment(momentzone.tz(defaultTimeZone()).format('LLLL'), 'LLLL').unix());
  const { isPurchasePage } = props || false;
  const [orderRating, setOrderRating] = useState(0);
  const NON_TRANSMATION_URL = useSelector((state) => state?.appConfig?.nonTransformUrl);
  const uid = getCookie("uid")
  const creds = useSelector(({ appConfig: { isometrikLicenseKey, isometrikAppSecret } }) => ({ isometrikLicenseKey, isometrikAppSecret }));

  const APP_IMG_LINK = useSelector((state) => state?.appConfig?.baseUrl);
  const APP_IMG_LINK_BASE = useSelector((state) => state?.appConfig?.imageBaseUrl);
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);
  const scrolledPositionRef = useRef()

  const videoCallText = ({ isRefunded, user, creator, status, orderType }) => {
    if (isPurchasePage) {
      if (isRefunded) return "Money will be refunded to the original payment method"
      if (status === "CANCELLED") return `Reason - ${orderType == "VIDEO_SHOUTOUT" ? "Shoutout" : "Video Call"} Cancelled by You`
      if (status === "REJECTED") return `Reason - ${orderType == "VIDEO_SHOUTOUT" ? "Shoutout" : "Video Call"} Rejected by ` + creator?.firstName + " " + creator?.lastName
      return `Reason - ${orderType == "VIDEO_SHOUTOUT" ? "Shoutout" : "Video Call"} request expired`
    } else {
      if (isRefunded) return "80% of the call duration was not complete"
      if (status === "CANCELLED") return `Reason - ${orderType == "VIDEO_SHOUTOUT" ? "Shoutout" : "Video Call"} Cancelled by ` + user?.firstName + " " + user?.lastName
      if (status === "REJECTED") return `Reason - ${orderType == "VIDEO_SHOUTOUT" ? "Shoutout" : "Video Call"} Rejected by You`
      return `Reason - ${orderType == "VIDEO_SHOUTOUT" ? "Shoutout" : "Video Call"} request expired`
    }
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTimeStamp(moment(momentzone.tz(defaultTimeZone()).format('LLLL'), 'LLLL').unix());
    }, 30000);

    return () => {
      clearInterval(intervalId);
    }
  }, []);


  // const orderTimeUnix = (order) => moment(`${order.scheduleData?.scheduleDate} ${order?.scheduleData?.startTime}`, 'YYYY-DD-MM h:mm a').unix();
  const orderTimeUnix = (order) => moment(momentzone.unix(order.scheduleData.startTs).tz(defaultTimeZone()).format('LLLL'), 'LLLL').unix();

  const isTimeFinished = (request) => {
    const endTsZone = moment(momentzone.unix(request.scheduleData.endTs).tz(defaultTimeZone()).format('LLLL'), 'LLLL').unix();
    return endTsZone < currentTimeStamp;
  };

  const typeOobj = (param) => typeof param === 'object';

  useEffect(() => {
    getPurchaseOrder();
    return () => close_dialog("VDO_DRAWER")
  }, []);

  useEffect(() => {
    handleCurrentOrder();
  }, [purchaseListOrder]);

  const handleCallStart = async () => {
    if (orderTimeUnix(currentOrder[0]) - currentTimeStamp > 0) return;
    startLoader();
    let payload = {
      virtualOrderId: currentOrder[0]._id,
      status: "JOIN",
      orderType: "VIDEO_CALL",
      deviceId: uid
    };

    try {
      const res = await patchVideoOrderAPI(payload);
      if (res.status === 200) {
        const token = res.data.data.rtcToken;
        const meetingId = res.data.data.meetingId

        if (token) setCookie('AGORA_TOKEN', token);
        setCookie('MEETING_ID', meetingId)
        setCookie('AGORA_CHANNEL', currentOrder[0]?.orderId);
        // setCookie('CALL_END_TIME', currentOrder[0]?.scheduleData.endTs);
        setCookie('CALL_END_TIME', moment(momentzone.unix(currentOrder[0]?.scheduleData.endTs).tz(defaultTimeZone()).format('LLLL'), 'LLLL').unix());
        setCookie('AGORA_ORDER_ID', currentOrder[0]?._id);
        setCookie('CALL_HOST_ID', currentOrder[0]?.creator?._id);
        setCookie('CALL_HOST_USERNAME', currentOrder[0]?.creator?.username)
        if (token) {
          let isExtensionRejected = isPurchasePage ? `?isExtensionRejected=${currentOrder[0]?.isExtensionRejected}` : ""
          Router.push(`/conference${isExtensionRejected}`);
        } else {
          const isometrikPayload = {
            meetingId,
            deviceId: uid
          }
          const extraHeaders = {
            licenseKey: creds.isometrikLicenseKey,
            appSecret: creds.isometrikAppSecret,
            userToken: getCookie("isometrikToken"),
            "Content-Type": "application/json",
          }
          const response = await startIsometrikCall(isometrikPayload, extraHeaders)
          if (response.status === 400) {
            let payload = {
              virtualOrderId: currentOrder[0]._id,
              status: "JOIN",
              orderType: "VIDEO_CALL",
              deviceId: uid,
              isMeetingCreate: true
            };
            try {
              const res = await patchVideoOrderAPI(payload);
              if (res.status === 200) {
                const token = res.data.data.rtcToken;
                const meetingId = res.data.data.meetingId
                setCookie('AGORA_TOKEN', token);
                setCookie('MEETING_ID', meetingId)
                if (token) {
                  let isExtensionRejected = isPurchasePage ? `?isExtensionRejected=${currentOrder[0]?.isExtensionRejected}` : ""
                  Router.push(`/conference${isExtensionRejected}`);
                }
              }
            } catch (error) {
              console.log(error, "error")
            }
          } else if (response.status === 200) {
            const final = await response.json()
            const rtcToken = final.rtcToken
            setCookie('AGORA_TOKEN', rtcToken)
            if (response.status === 200) {
              let isExtensionRejected = isPurchasePage ? `?isExtensionRejected=${currentOrder[0]?.isExtensionRejected}` : ""
              if (rtcToken) Router.push(`/conference${isExtensionRejected}`);
            }
          }

        }
      }
      setInitialLoader(false);
      stopLoader();
      // getPurchaseOrder();
    } catch (err) {
      console.log(err, "error")
      Toast("Error in Starting Call", "error");
      setInitialLoader(false);
      stopLoader();
    };
  };

  const handleAcceptOrCancel = async (status, reason) => {
    startLoader();

    try {
      let payload = {
        virtualOrderId: currentOrder[0]._id,
        status: status,
        orderType: "VIDEO_SHOUTOUT",
        userId: isAgency() ? selectedCreatorId : getCookie("uid")
      };

      if (currentOrder[0]?.orderType === "VIDEO_CALL") {
        delete payload.orderThumbnailUrl;
        delete payload.orderUrl;
        delete payload.notes;
        payload.orderType = "VIDEO_CALL";
      }

      if (reason) {
        payload["reason"] = reason
      }

      const res = await patchReqToShoutout(payload);
      if (res.status === 200 && status === "COMPLETED" && currentOrder[0].orderType === "VIDEO_CALL") {
        const payloadToPublish = {
          "orderId": currentOrder[0]?.orderId,
          "orderType": "VIDEO_CALL",
          "userId": currentOrder[0]?.user?._id,
          "creatorId": currentOrder[0]?.creator?._id,
          "status": "COMPLETED"
        };
        const topicToSend = MQTT_TOPIC.virtualOrder + "/" + payloadToPublish.userId;
        customMessageSubject.next({ payloadToSend: payloadToPublish, topicToSend });
      }
      // if (res.status == 200) {
      //   getPurchaseOrder();
      // }
      stopLoader();
      getPurchaseOrder();
      close_dialog("my_orders");
    } catch (err) {
      Toast("Error in update", "error");
      close_dialog("my_orders");
      stopLoader();
    }
  };

  const handleVideoUpload = async (status, orderUrl, thumb, notes, showOnProfile, isImage) => {
    startLoader();
    try {
      let payload = {
        virtualOrderId: currentOrder[0]._id,
        status: status,
        allowProfileView: showOnProfile,
        orderUrl: orderUrl,
        orderThumbnailUrl: thumb,
        notes: notes,
        reason: "",
        orderType: "VIDEO_SHOUTOUT",
        orderUrlType: isImage ? "IMAGE" : "VIDEO"
      };
      if (isAgency()) {
        payload["userId"] = selectedCreatorId;
      }
      const res = await patchReqToShoutout(payload);
      if (res.status == 200) {
        getPurchaseOrder();
      }
      stopLoader();
    } catch (err) {
      close_dialog("upload_order_video");
      Toast("Error in update", "error");
      stopLoader();
    }
  };

  const cancelOrder = (orderType) => {
    open_dialog("my_orders", {
      handleAcceptOrCancel: handleAcceptOrCancel,
      isPurchasePage: isPurchasePage,
      orderType
    });
  };

  const UploadVideo = () => {
    open_dialog("upload_order_video", {
      handleVideoUpload: handleVideoUpload,
      allowProfileView: currentOrder[0]?.allowProfileView,
      orderId: currentOrder[0]?._id
    });
  };

  const handleCallCompleteAlert = () => {
    const propsToPass = {
      title: 'Finish This Call',
      // btn_class: "dangerBgBtn",
      cancelT: 'Cancel',
      submitT: 'Finish',
      yes: () => handleAcceptOrCancel("COMPLETED", ""),
      subtitle: 'You have to be on the call for at-least 80% of the booked duration , if you end the call sooner , the money will be returned to the customer',
    };
    open_dialog("confirmDialog", propsToPass);
  };

  const getPurchaseOrder = async (allowLoader = false) => {
    try {
      allowLoader && startLoader();
      let APIreponse = await getVirtualOrderDetail(ordId);
      let virtualOrderData = APIreponse?.data?.data;
      setCurrentOrder(virtualOrderData);
      allowLoader && stopLoader();

    } catch (e) {
      console.error("ERROR IN getPurchaseOrder", e);
      stopLoader();
    }
  };

  const handleCurrentOrder = () => {
    let order = purchaseListOrder?.filter((orders, index) => {
      return orders._id == ordId;
    });
    setCurrentOrder(order);
  };


  const downloadVideo = async (vdo, isOrderCompleted = false, isImageFlag = false) => {
    let extension = !isImageFlag ? "mp4" : "jpg";
    let video;
    if (isImageFlag) {
      video = `${NON_TRANSMATION_URL}/${vdo}`;
    }
    else {
      if (isOrderCompleted) {
        video = `${APP_IMG_LINK}/${vdo}`;
      }
    }
    mobileView ? startLoader() : open_progress();

    try {
      const vid = await fetch(isOrderCompleted || isImageFlag ? video : vdo);
      const videoBlog = await vid.blob();
      const videoURL = URL.createObjectURL(videoBlog);

      let link = document.createElement("a");
      link.href = videoURL;
      link.download = `${APP_NAME}_${moment().valueOf()}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      Toast(`${isImageFlag ? "Image" : "Video"} downloaded successfully!`);
      mobileView ? stopLoader() : close_progress();

    } catch (e) {
      Toast("Could not download video... Something went wrong", "error");
      console.error("ERROR IN downloadVideo", e);
      mobileView ? stopLoader() : close_progress();
    }
  };

  const openVideo = (videoUrl, tumbnail, isOrderCompleted = false) => {
    open_dialog("VDO_DRAWER", {
      vdoUrl: isOrderCompleted ? videoUrl : `${APP_IMG_LINK}/${videoUrl}`
      , thumbnail: tumbnail
    });
  };

  const handleImageClick = (order, isOrderCompleted = false) => {
    const beforeCompleteOrderAssets = [{
      id: 1,
      seqId: 1,
      mediaType: order?.type === "VIDEO_UPLOAD" ? "VIDEO" : "IMAGE",
      mediaThumbnailUrl: order?.thumbnail,
      mediaUrl: `${APP_IMG_LINK}/${order?.value}`,
    }]

    const orderCompletedAsset = [{
      id: 1,
      seqId: 1,
      mediaType: order?.orderUrlType,
      mediaThumbnailUrl: order?.orderThumbnailUrl,
      mediaUrl: order?.orderUrl?.includes("https://") ? order?.orderUrl : `${APP_IMG_LINK}/${order?.orderUrl}`,
    }]

    open_drawer("openMediaCarousel", {
      assets: isOrderCompleted ? orderCompletedAsset : beforeCompleteOrderAssets,
      selectedMediaIndex: 0,
      scrolledPositionRef: scrolledPositionRef,
      isLocked: false,
      isProfileShow: false,
      isThumbnailShow: false,
    }, "bottom")
  }

  const handleRating = (rating = 0) => {
    setOrderRating(rating);
  }

  const handelShoutoutRating = (profilePic, firstName, lastname, orderId, orderType) => {
    open_dialog("rateCreator", { profilePic, firstName, lastname, orderId, handleRating, orderType });
  }

  const handleAddToCalendar = () => {
    const timeZonedStartTs = orderTimeUnix(currentOrder[0]);
    const { startTs, endTs } = currentOrder[0].scheduleData;
    addCalendarEvent(new Date(timeZonedStartTs * 1000).toISOString(), endTs - startTs, APP_NAME + " Platform", APP_NAME, true);
  };

  return (
    <Wrapper>
      <Head>
        <script src="https://apis.google.com/js/api.js" type="text/javascript" />
        <script src="https://accounts.google.com/gsi/client" type="text/javascript" async defer></script>
      </Head>
      <div className="p-3 h-100 w-100 position-relative overflowY-auto">
        {currentOrder && currentOrder.length > 0 ? (
          currentOrder.map((order, index) => {
            return <>
              <div className="align-items-center fntSz22 d-flex p-0">
                <ArrowBackIcon
                  className="cursorPtr"
                  onClick={() => Router.back()}
                  style={{ color: `${theme?.text}` }}
                />
                <div className="fntWeight600 textColorCss pl-4">
                  #{order?._id}
                </div>
                <div className="cursor-pointer" onClick={() => { getPurchaseOrder(true) }}>
                  <Tooltip title={lang.refresh}>
                    <Refresh className='ml-2 dv_appTxtClr' fontSize={'medium'} />
                  </Tooltip>
                </div>
              </div>
              <div className="mt-4 pt-2 orderDetails">
                <div className="col-12 d-flex px-0">
                  {isPurchasePage ? (
                    <div className="col-auto p-0 TOsortName d-flex justify-content-center callout-none" onContextMenu={handleContextMenu}>
                      {order?.creator?.profilePic ? (
                        <FigureCloudinayImage
                          publicId={order?.creator.profilePic}
                          ratio={1}
                          className="order_and_profile mb-1"
                        />
                      ) : (
                        <Avatar className="dv_profile_logo_requestShoutout mb-1 h-100 w-100 solid_circle_border">
                          {order.creator &&
                            order?.creator?.firstName &&
                            order?.creator?.lastName && (
                              <span className="initials_order">
                                {order?.creator?.firstName[0] +
                                  order?.creator?.lastName[0]}
                              </span>
                            )}
                        </Avatar>
                      )}
                    </div>
                  ) : (
                    <div className="col-auto p-0 TOsortName d-flex justify-content-center callout-none" onContextMenu={handleContextMenu}>
                      {order?.user?.profilePic ? (
                        <FigureCloudinayImage
                          publicId={order?.user?.profilePic}
                          ratio={1}
                          className="order_and_profile mb-1"
                        />
                      ) : (
                        <Avatar
                          className="dv_profile_logo_requestShoutout mb-1 solid_circle_border"
                          style={{ width: "61px", height: "61px" }}
                        >
                          {order?.user && (
                            <span className="initials_order">
                              {order?.user?.firstName[0] +
                                order?.user?.lastName[0]}
                            </span>
                          )}
                        </Avatar>
                      )}
                    </div>
                  )}
                  <div className="col-auto d-flex flex-column">
                    <div>
                      <div className="col fntSz14 textColorCss p-0 reqFor">
                        {isPurchasePage
                          ? `${order?.orderType === "VIDEO_CALL" ? 'Video Call' : 'Shoutout'} request to`
                          : `${order?.orderType === "VIDEO_CALL" ? 'Video Call' : 'Shoutout'} request from`}
                      </div>
                      {/* {!isPurchasePage && (
                    <div className="col-auto earning fntWeight700 fntSz16 pr-0">
                      {lang.myEarnings}{" "}
                      {`${order?.price?.currencySymbol || "$"}${order?.finalAmount}`}
                    </div>
                  )} */}
                    </div>
                    <div className="d-flex px-0">
                      {isPurchasePage ? (
                        <div className="fntWeight800 textColorCss">
                          {order?.creator?.firstName} {order?.creator?.lastName}
                        </div>
                      ) : (
                        <div className="fntWeight800 textColorCss">
                          {order?.user ? `${order?.user?.firstName} ${order?.user?.lastName}` : order?.requestedFor?.fullName}
                        </div>
                      )}
                      {/* {order?.orderType !== "VIDEO_CALL" && <div className="pl-3 textColorCss">
                        {order?.price?.currencySymbol || "$"}
                        {isPurchasePage ? typeOobj(order?.price) ? order?.price?.price : order?.price : order?.finalAmount}
                      </div>} */}
                    </div>
                  </div>
                  <div
                    className="col pb-2 d-flex"
                    style={{ justifyContent: "flex-end" }}
                  >
                    {!isPurchasePage && (
                      <div className="col-auto earning fntWeight700 fntSz16 pr-0">
                        {lang.myEarnings}{" "}
                        {(["CANCELLED", "REJECTED", "FAILED"].includes(order?.status) || order?.isRefunded) ? "0.00" : `${order?.price?.currencySymbol || "$"}${order?.finalAmount.toFixed(2)}`}
                      </div>
                    )}
                    <div className="statusInfo fntWeight500">
                      {/* <p className="mb-0 statusDet">{order?.status}</p> */}
                    </div>
                  </div>
                  {isPurchasePage && <div className="fntWeight600 bold">
                    {order?.price?.currencySymbol} {(order?.price?.price + order?.tax).toFixed(2)}
                  </div>}
                </div>
                {/* {order?.orderType !== "VIDEO_CALL" && ( */}
                <div className="d-flex justify-content-end" style={{ height: "2.3rem" }}>
                  {order?.orderType !== "VIDEO_CALL" && <div className="d-flex col-9   align-items-center px-0 mt-3">
                    <div className="reqFor fntSz14 text-capitalize">{lang.RequestedFor}</div>
                    <div className="reqUser pl-4 fntSz14 textColorCss">
                      {order?.bookingFor && !order?.bookingFor?.startsWith("6") ? order?.bookingFor : `${order?.requestedFor?.fullName || order?.opponentUser?.firstName || order?.user?.firstName + " " +
                        order?.user?.lastName || order?.opponentUser?.lastName} (Myself)`}
                    </div>
                  </div>}
                  <Button type="button"
                    fclassname="col-3"
                    cssStyles={theme.dv_blueButton}
                    style={{
                      borderRadius: "6px", padding: "0px",
                      background: order?.status === 'COMPLETED' ? '#09CC4D' : ["CANCELLED", "FAILED", "REJECTED"].includes(order?.status) ? '#EC1818' : 'linear-gradient(96.81deg, #D33AFF 0%, #FF71A4 100%)'
                    }}
                  >{order?.status}</Button>
                </div>
                {/* )} */}
              </div>

              {/* when status is COMPLETD this section will be executed */}
              {order?.orderType !== "VIDEO_CALL" && order?.status == "COMPLETED" && (
                <div className="pt-4">
                  <p className="fntSz15 fntWeight700 textColorCss">
                    {order?.orderUrlType === "IMAGE" ? "SHOUTOUT IMAGE" : lang.ShoutOutVideo}
                  </p>
                  <div className="col-12 d-flex p-0">
                    {order?.orderUrlType === "IMAGE" ?
                      <div className="d-flex position-relative callout-none" onContextMenu={handleContextMenu}>
                        <FigureCloudinayImage
                          publicId={order?.orderThumbnailUrl}
                          ratio={1}
                          crop="thumb"
                          style={{
                            objectFit: "cover",
                            width: "6rem",
                            height: "6rem",
                          }}
                          className="pb-3 col-auto pl-0 cursorPtr"
                        />
                      </div>
                      :
                      <div className="col-auto pl-0 pr-1">
                        <div
                          style={{
                            height: "70px",
                            width: "70px",
                          }}
                          onClick={() => handleImageClick(order, true)}
                        >
                          <Image
                            src={`${APP_IMG_LINK_BASE}/${order?.orderThumbnailUrl}`}
                            ratio={1}
                            crop="thumb"
                            style={{
                              objectFit: "cover",
                              width: "100%",
                              height: "100%",
                              cursor: "pointer",
                            }}
                          />
                          <Img
                            src={playIcon}
                            className="videoplayIconCssShoutout cursorPtr"
                          />
                        </div>
                      </div>
                    }
                    <div className="col">
                      <div className="textColorCss">{order?.notes}</div>
                    </div>
                    {isPurchasePage && (
                      <div className="col-auto pr-0 statusInfo">
                        <button
                          className="downLoadVideoCss cursorPtr"
                          onClick={() => downloadVideo(order?.orderUrl, false, !(order?.orderUrl.startsWith("https")))}
                        // disabled={isImageFlag ? false : !(order?.orderUrl.startsWith("https"))}
                        >
                          {lang.download}
                        </button>
                      </div>
                    )}
                    {isPurchasePage && (order?.rating || orderRating) ? (
                      <div className="d-flex flex-column justify-content-end pl-3">
                        <div className="col-auto d-flex align-items-center pr-0 statusInfo">
                          <Icon
                            icon={`${ratingIcon}#ratingIcon`}
                            width={15}
                            height={15}
                            unit="px"
                            style={{ marginBottom: "4px" }}
                            viewBox="0 0 21.491 20.439"
                          />
                          <p className="m-0 fntSz14 appTextColor font-weight-500">{order?.rating || orderRating}</p>
                        </div>
                        <p className="m-0 fntSz12" style={{ color: "var(--l_breadcrum_deactive)" }}>{lang.youRated}</p>
                      </div>
                    ) : isPurchasePage && (
                      <div className="col-auto pr-0 statusInfo">
                        <div
                          className="rateNow cursor-pointer"
                          onClick={() => handelShoutoutRating(order?.creator?.profilePic, order?.creator?.firstName, order?.creator?.lastName, ordId, order?.orderType)}
                        >
                          {lang.rateNow}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* when status is CANCELLED this section will be executed */}
              {((order?.reason && order?.status == "CANCELLED") ||
                (order?.reason && order?.status == "REJECTED")) && (
                  <div className="pt-4">
                    <p style={{ color: "#EA1515" }} className="fntWeight600">
                      {lang.cancellationReason}
                    </p>
                    <p style={{ color: `${theme?.text}` }} className="fntSz15">
                      {order?.reason || "Change My Mind"}
                    </p>
                  </div>
                )}

              {order?.status !== "ACCEPTED" && (
                <div
                  className="mt-3"
                  style={{ border: "1px solid #c0c0c066" }}
                ></div>
              )}
              {!isPurchasePage ?
                <>
                  {!isPurchasePage && (["VIDEO_CALL", "VIDEO_SHOUTOUT"].includes(order?.orderType)) && (["CANCELLED", "FAILED", "REJECTED"].includes(order?.status) || order?.isRefunded) ? <div className="moneyRefunded rounded p-2 my-4  px-3">
                    <div className="d-flex justify-content-between">
                      <p className="mpner_Para_one fntWeight700 fntSz15 mt-2">{lang.refundOrder + order?.user?.firstName + " " +
                        order?.user?.lastName}</p>
                      <p className="fntWeight700 fntSz15" >{order?.price?.currencySymbol || "$"}{order?.price?.price + order?.tax}</p>
                    </div>
                    <p className="fntWeight700 fntSz12 fntlightGrey txt-medium mb-1 ">{videoCallText(order)}</p>
                  </div> : ""}
                </> :
                <>
                  {(["VIDEO_CALL", "VIDEO_SHOUTOUT"].includes(order?.orderType)) && (["CANCELLED", "FAILED", "REJECTED"].includes(order?.status) || order?.isRefunded) && <div className="moneyRefunded rounded py-1 my-4  px-3">
                    {console.log("{order?.price?.price", order?.tax)}
                    <p className="mpner_Para_one2 fntWeight700 fntSz15 mt-2 mb-2"> {order?.price?.currencySymbol} {order?.price?.price + order?.tax} Refunded</p>
                    <p className="fntWeight700 fntSz12 fntlightGrey txt-medium mb-2">{videoCallText(order)}</p>
                  </div>}
                </>}
              <div className="pt-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="fntWeight700 fntSz15 textColorCss">
                    {order?.orderType === "VIDEO_CALL" ? lang.requestDateTime : lang.requestDetails}
                  </div>
                  {order?.orderType === "VIDEO_CALL" && ["ACCEPTED", "JOIN"].includes(order?.status) && <span onClick={handleAddToCalendar} className="calendar_add_option d-flex align-items-center txt-heavy fntSz11 cursorPtr ml-2 dv_appTxtClr_we">
                    <img width={15} className="mr-2" src={GO_LIVE_SCREEN.calendarAddIcon} alt='Add Calendar' />
                    Add to calendar
                  </span>}
                </div>
                <div className="py-2" >
                  {order?.orderType !== "VIDEO_CALL" && order?.attribute?.map((attr) => (
                    <>
                      <div className="detailField pb-2">
                        {attr?.isImage ? "Image" : attr.attributeName}
                      </div>
                      {attr?.attributeName === "Video" ? (
                        attr.isImage ?
                          <div className="d-flex position-relative callout-none" onContextMenu={handleContextMenu}>
                            <FigureCloudinayImage
                              publicId={attr?.imageUrl}
                              ratio={1}
                              crop="thumb"
                              style={{
                                objectFit: "cover",
                                width: "6rem",
                                height: "6rem",
                              }}
                              className="pb-3 col-auto pl-0 cursorPtr"
                            />
                          </div>
                          : <div className="d-flex position-relative callout-none" onContextMenu={handleContextMenu} onClick={() => handleImageClick(attr)}>
                            <FigureCloudinayImage
                              publicId={attr?.thumbnail}
                              ratio={1}
                              crop="thumb"
                              style={{
                                objectFit: "cover",
                                width: "6rem",
                                height: "6rem",
                              }}
                              className="pb-3 col-auto pl-0 cursorPtr"
                            />
                            <Img
                              src={playIcon}
                              className="attributeVideoCss cursorPtr"
                            />
                            {/* {!isPurchasePage && (
                            <div className="col-auto d-flex align-items-end">
                              <div
                                className="downLoadVideoCss mb-3 cursorPtr"
                                onClick={() => downloadVideo(attr?.value, true)}
                              >
                                {lang.download}
                              </div>
                            </div>
                          )} */}
                          </div>
                      ) : (
                        <div className="detailAns pb-2 fntSz15">
                          {attr?.value}
                        </div>
                      )}
                    </>
                  ))}
                  {order?.orderType === "VIDEO_CALL" && order?.scheduleData?.scheduleDate && (
                    <>
                      <div className="col-12 mb-1 mt-2 d-flex fntSz14 txt-roman px-0">
                        {/* {moment(order?.scheduleData?.scheduleDate, "YYYY-DD-MM").format("Do MMMM YYYY")} */}
                        {moment(momentzone.unix(order.scheduleData.startTs).tz(defaultTimeZone()).format('LLLL'), 'LLLL').format("MMMM DD, YYYY")}
                      </div>
                      <div className="col-12 mb-1 d-flex fntSz14 txt-roman px-0">
                        {moment(momentzone.unix(order.scheduleData.startTs).tz(defaultTimeZone()).format('LLLL'), 'LLLL').format("h:mm a")}
                        <span className="ml-1">{defaultTimeZone()}</span>
                        {/* {order?.scheduleData?.startTime} */}
                      </div>
                      <div className="col-12 mb-1 d-flex fntSz14  text-capitalize txt-book reqFor px-0">
                        {lang.callDuration}{" : "}{timeDifferenceCalc(order?.scheduleData?.endTs, order?.scheduleData?.startTs)}
                        {["COMPLETED"].includes(order?.status) && isPurchasePage && (
                          <div
                            className={`ml-auto ${order?.rating || orderRating ? "" : "rateNow cursor-pointer"}`}
                            onClick={() => !(order?.rating || orderRating) && handelShoutoutRating(order?.creator?.profilePic, order?.creator?.firstName, order?.creator?.lastName, ordId, order?.orderType)}
                          >
                            {order?.rating || orderRating ? (<div className="d-flex flex-column justify-content-end pl-3">
                              <div className="col-auto d-flex align-items-center pr-0 statusInfo">
                                <Icon
                                  icon={`${ratingIcon}#ratingIcon`}
                                  width={15}
                                  height={15}
                                  unit="px"
                                  style={{ marginBottom: "4px" }}
                                  viewBox="0 0 21.491 20.439"
                                />
                                <p className="m-0 fntSz14 appTextColor font-weight-500 2">{order?.rating || orderRating}</p>
                              </div>
                              <p className="m-0 fntSz12 font-weight-400" style={{ color: "var(--l_breadcrum_deactive)" }}>{lang.youRated}</p>
                            </div>) : lang.rateNow}
                          </div>
                        )}
                      </div>
                      <span className="reqFor fntSz14">{lang.noteVideoCall}</span>
                    </>
                  )}
                </div>
                {isPurchasePage && (order?.status === "REQUESTED") &&
                  <div
                    className="earning cursorPtr"
                    style={{ fontSize: "13px" }}
                    onClick={() => cancelOrder(order?.orderType)}
                  >
                    {lang.cancelOrder}
                  </div>
                }
                {!isPurchasePage && order?.status == "REQUESTED" ? (
                  <div className="col-7 d-flex mx-auto px-0 pt-4">
                    <div className="col-6 px-2">
                      <Button
                        type="button"
                        fclassname="borderStrokeClr background_none rounded-pill py-2"
                        btnSpanClass="gradient_text w-700"
                        onClick={() => cancelOrder(order?.orderType)}
                      >
                        {lang.reject}
                      </Button>
                    </div>
                    <div className="col-6 px-2">
                      <Button
                        type="button"
                        fclassname="btnGradient_bg rounded-pill py-2 w-500"
                        onClick={() => handleAcceptOrCancel("ACCEPTED")}
                      >
                        {lang.accept}
                      </Button>
                    </div>
                  </div>
                ) : order?.status == "ACCEPTED" && !isPurchasePage && order?.orderType !== "VIDEO_CALL" ? (
                  <div className="col-7 d-flex mx-auto pt-3">
                    <Button
                      type="button"
                      cssStyles={theme.dv_blueButton}
                      onClick={() => {
                        UploadVideo();
                      }}
                    >
                      {lang.uploadMedia}
                    </Button>
                  </div>
                ) : (
                  ""
                )}
                {order?.orderType === "VIDEO_CALL" && ["ACCEPTED", "JOIN"].includes(order?.status) && !isPurchasePage && (
                  <div className="col-7 d-flex mx-auto pt-3">
                    <Button
                      type="button"
                      cssStyles={theme.dv_blueButton}
                      isDisabled={isAgency()}
                      onClick={isTimeFinished(order) ? handleCallCompleteAlert : handleCallStart}
                    >
                      {isTimeFinished(order) ? "Confirm Call Completion" : `${order?.status === "JOIN" ? 'Join Call' : `Start Call ${orderTimeUnix(order) - currentTimeStamp >= 0 ? `In ${timeDifferenceCalc(orderTimeUnix(order), currentTimeStamp)}` : ''}`}`}
                    </Button>
                  </div>
                )}

                {order?.orderType === "VIDEO_CALL" && ["ACCEPTED"].includes(order?.status) && isPurchasePage && (
                  <div className="col-7 d-flex mx-auto pt-3">
                    <Button
                      type="button"
                      cssStyles={theme.dv_blueButton}
                    // onClick={handleCallStart}
                    >
                      {orderTimeUnix(order) - currentTimeStamp <= 0 ? 'Please wait for call to start' : `Call Starts In ${timeDifferenceCalc(orderTimeUnix(order), currentTimeStamp)}`}
                    </Button>
                  </div>
                )
                }

                {order?.orderType === "VIDEO_CALL" && ["JOIN"].includes(order?.status) && isPurchasePage && !isTimeFinished(order) && (
                  <div className="col-7 d-flex mx-auto pt-3">
                    <Button
                      type="button"
                      cssStyles={theme.dv_blueButton}
                      onClick={handleCallStart}
                    >
                      Join Call
                    </Button>
                  </div>
                )}
              </div>
            </>
          })
        ) : (
          <div className="breakingDiv h-100">
            {!initialOrder && !mobileView && <Placeholder
              style={{ height: "20%" }}
              pageName="orderList"
              placeholderImage={NO_ORDER_PLACEHOLDER}
              alt="Collection Cover Placeholder"
              label={lang.noOrderFound}
            />}
            {initialOrder && <CustomDataLoader type="ClipLoader" loading={true} size={60} />}
          </div>
        )}
      </div>
      <style jsx>{`
        .calendar_add_option {
          border-radius: 3px;
          padding: 5px 8px;
          border: 1px solid var(--l_base);
          }
        .orderDetails {
          border-radius: 8px;
          box-shadow: 0 0.5rem 1rem rgb(0 0 0 / 15%);
          padding: 30px 22px;
          background: var(--l_section_bg);
        }

        :global(.textColorCss) {
          color: ${theme?.text};
        }

        .TOsortName {
          border-radius: 50%;
          height: 56px;
          width: 56px;
          align-items: center;
          display: flex;
          background: #e8ebfc;
          color: var(--l_base);
          border: 1px solid var(--l_base);
        }

        .statusInfo {
          display: flex;
          align-items: flex-end;
          justify-content: flex-end;
        }

        .statusDet {
          padding: 0px 5px;
          border-radius: 3px;
          font-size: 14px;
          font-weight: 600;
          color: ${(currentOrder && currentOrder[0]?.status == "CANCELLED") ||
          (currentOrder && currentOrder[0]?.status == "REJECTED")
          ? "#EC1818"
          : currentOrder && currentOrder[0]?.status == "COMPLETED"
            ? "#09CC4D"
            : "#4918ec"};
        }

        .downLoadVideoCss {
          border: 1px solid ${theme?.appColor};
          padding: 0px 5px;
          border-radius: 3px;
          font-size: 14px;
          font-weight: 600;
          color: #fff;
          background: ${theme?.appColor}
        }

        .rateNow {
          border: 1px solid ${theme?.appColor};
          padding: 0px 5px;
          border-radius: 3px;
          font-size: 14px;
          font-weight: 600;
          color: ${theme?.appColor};
        }

        :global(.earning) {
          color: ${theme?.appColor};
        }

        .reqFor {
          color: #b6b8ce;
          font-size: 12px;
        }

        .reqUser {
          font-size: 14px;
          font-weight: 500;
        }

        .detailField {
          color: #b6b8ce;
          font-size: 12px;
        }

        .detailAns {
          color: ${theme?.text};
        }

        .btnStyle {
          border: 1px solid black;
        }

        .cancelBtn {
          padding: 8px 10px;
          text-align: center;
          border-radius: 23px;
          border: 1px solid var(--l_base);
          color: var(--l_base);
        }

        .acceptBtn {
          padding: 8px 10px;
          text-align: center;
          border-radius: 23px;
          color: #fff;
          border: 1px solid var(--l_base);
          background: var(--l_base);
        }

        .breakingDiv {
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 19px;
          font-weight: 700;
        }

        .loaderCss{
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translateX(-50%) translateY(-50%);
        }
        .moneyRefunded{
          border: 1px solid ${!isPurchasePage ? "#ED3E3E" : "#09cc4d"};
        }

        .mpner_Para_one{
          color:#ED3E3E;
          line-height: 1;
        }
        .mpner_Para_one2{
          color:#09cc4d;
          line-height: 1;
        }
      `}</style>
    </Wrapper>
  );
};

export default MyOrderDetail;
