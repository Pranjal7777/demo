import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";
import moment from "moment";
import momentzone from "moment-timezone";
import Router from "next/router";
import dynamic from "next/dynamic";
import { useTheme } from "react-jss";
import { useDispatch, useSelector } from "react-redux";
import {
  close_drawer,
  close_progress,
  cloudanaryVideoUrl,
  open_drawer,
  open_progress,
  startLoader,
  stopLoader,
  timeDifferenceCalc,
  Toast,
} from "../../../lib/global";
import { patchReqToShoutout, getVirtualOrderDetail } from "../../../services/shoutout";
import * as config from "../../../lib/config";
import useLang from "../../../hooks/language";
import isMobile from "../../../hooks/isMobile";
import Header from "../../header/header";
import CustButton from "../../button/button";
import { customMessageSubject, shoutoutIncoming, shoutoutOutgoing } from "../../../lib/rxSubject";
import { getCookie, setCookie } from "../../../lib/session";
import Img from "../../ui/Img/Img";
import { handleShoutoutOrderCount } from "../../../redux/actions/shoutout";
import Icon from "../../image/icon";
import { patchVideoOrderAPI, startIsometrikCall } from "../../../services/videoCall";
import { addCalendarEvent } from "../../../lib/calendarEvent";
import Head from "next/head";
import Refresh from "@material-ui/icons/Refresh";
import { isAgency } from "../../../lib/config/creds";
import { getDeviceId } from "../../../lib/helper/detectDevice";
import { handleContextMenu } from "../../../lib/helper";

const FigureCloudinayImage = dynamic(
  () => import("../../cloudinayImage/cloudinaryImage"),
  { ssr: false }
);
const Avatar = dynamic(() => import("@material-ui/core/Avatar"), {
  ssr: false,
});

const Order = (props) => {
  const [mobileView] = isMobile();
  const [lang] = useLang();
  const [request, setRequest] = useState(props.requestData);
  const [refresh, setRefresh] = useState(false);
  const [orderRating, setOrderRating] = useState(0);
  const isPurchaseSection = props.isPurchasePage;
  const orderCount = useSelector((state) => state?.profileData?.orderCount);
  const dispatch = useDispatch();
  const theme = useTheme();
  const [currentTimeStamp, setCurrentTimeStamp] = useState(moment(momentzone.tz(config.defaultTimeZone()).format('LLLL'), 'LLLL').unix());
  const UPLOADED_SHOUOTOUT_VIDEO = useSelector((state) => state?.appConfig?.virtualBaseUrl);
  const APP_IMG_LINK = useSelector((state) => state?.appConfig?.baseUrl);
  const VIDEO_LINK = useSelector((state) => state?.cloudinaryCreds?.VIDEO_LINK);
  const NON_TRANSFORM_URL = useSelector((state) => state?.appConfig?.nonTransformUrl);
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);
  const uid = isAgency() ? selectedCreatorId : getCookie("uid")
  const creds = useSelector(({ appConfig: { isometrikLicenseKey, isometrikAppSecret } }) => ({ isometrikLicenseKey, isometrikAppSecret }));
  const [isImage, setIsImage] = useState(false)
  const scrolledPositionRef = useRef()

  const back = () => close_drawer("Order");

  // const VideoCallText = {
  //   "REJECTED": "Video Call Rejected by ",
  //   "CANCELLED": "Video Call Cancelled by ",
  //   "userCOMPLETED": "Money will be refunded to the original payment method",
  //   "creatorCOMPLETED": "80% of the call duration was not complete"
  // }


  const videoCallText = ({ isRefunded, user, creator, status, orderType }) => {
    if (props?.isPurchasePage) {
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
      setCurrentTimeStamp(moment(momentzone.tz(config.defaultTimeZone()).format('LLLL'), 'LLLL').unix());
    }, 30000);

    return () => {
      clearInterval(intervalId);
    }
  }, []);

  useEffect(() => {
    // request?.isViewed == false && orderCount >= 0 && dispatch(handleShoutoutOrderCount(orderCount - 1));
    props?.isFromMqtt && getUpdatedOrderDetail()
    getUpdatedOrderDetail();
  }, [])

  shoutoutIncoming.subscribe((data) => {
    request?.status != data?.status && getUpdatedOrderDetail(data?._id)
  });

  const handleAcceptOrCancel = async (status, reason) => {
    startLoader();

    try {
      let payload = {
        virtualOrderId: request._id,
        status: status,
        orderType: "VIDEO_SHOUTOUT"
      };

      if (request.orderType === "VIDEO_CALL") {
        delete payload.orderThumbnailUrl;
        delete payload.orderUrl;
        delete payload.notes;
        payload.orderType = "VIDEO_CALL";
      }

      if (reason) {
        payload["reason"] = reason;
      }
      if (isAgency()) {
        payload["userId"] = selectedCreatorId;
      }
      const res = await patchReqToShoutout(payload);
      if (res.status == 200 && !props.isPurchasePage) {
        shoutoutOutgoing.next({
          shoutoutOrderId: request?.orderId,
          shoutoutOrder: request,
          shoutoutUserId: getCookie("uid"),
          shoutoutBookingForId: request?.requestedFor?._id,
          status
        });
      }
      res.status == 200 && getUpdatedOrderDetail();
      if (res.status === 200 && status === "COMPLETED" && request.orderType === "VIDEO_CALL") {
        const payloadToPublish = {
          "orderId": request?.orderId,
          "orderType": "VIDEO_CALL",
          "userId": request?.user?._id,
          "creatorId": request?.creator?._id,
          "status": "COMPLETED"
        };
        const topicToSend = config.MQTT_TOPIC.virtualOrder + "/" + payloadToPublish.userId;
        customMessageSubject.next({ payloadToSend: payloadToPublish, topicToSend });
      }
      stopLoader();
    } catch (err) {
      Toast("Error in update", "error");
      stopLoader();
    }
  };

  const getUpdatedOrderDetail = async (allowLoader = false) => {
    allowLoader && startLoader()
    try {
      let APIreponse = await getVirtualOrderDetail(request._id);
      let virtualOrderData = APIreponse?.data?.data[0];
      setRequest(virtualOrderData);
      const isImageFlag = APIreponse?.data?.data[0].attribute.filter((elem) => elem.isImage).length
      setIsImage(isImageFlag)
      if (APIreponse.status == 200) {
        props.getShoutoutData?.(0, false, "", true)
      };
      stopLoader()
    } catch (e) {
      console.error(e)
      stopLoader()
    }
  }
  const handleRating = (rating = 0) => {
    setOrderRating(rating);
    props?.isPurchasePage && props?.getShoutoutData(0, false, "", true);
  }

  const handelShoutoutRating = (profilePic, firstName, lastname, orderId, orderType) => {
    open_drawer("rateCreator", { profilePic, firstName, lastname, orderId, handleRating, orderType }, "right");
  }

  const handleVideoUpload = async (status, orderUrl, thumb, notes, showOnProfile, isImage) => {
    startLoader();
    let payload = {
      virtualOrderId: request._id,
      status: status,
      allowProfileView: showOnProfile,
      orderUrl: orderUrl,
      orderThumbnailUrl: thumb,
      notes: notes,
      reason: "",
      orderType: "VIDEO_SHOUTOUT",
      orderUrlType: isImage ? "IMAGE" : "VIDEO"
    };

    patchReqToShoutout(payload).then((res) => {
      stopLoader();
      setRefresh(!refresh);
      shoutoutOutgoing.next({
        shoutoutOrderId: request?.orderId,
        shoutoutOrder: request,
        shoutoutUserId: getCookie("uid"),
        shoutoutBookingForId: request?.requestedFor?._id,
        status
      });
      getUpdatedOrderDetail();

    }).catch((e) => {
      Toast("Error in update", "error");
      stopLoader();
    });
  };

  const downloadVideo = async (vdo, isOrderCompleted = false, isImageFlag = false) => {
    let extension = !isImageFlag ? "mp4" : "jpg";
    let video;
    if (isImageFlag) {
      video = `${NON_TRANSFORM_URL}/${vdo}`;
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
      link.download = `${config.APP_NAME}_${moment().valueOf()}.${extension}`;
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

  const getCreatorName = (request) => {
    if (request?.opponentUser) {
      return `${request?.opponentUser?.firstName} ${request?.opponentUser?.lastName}`
    } else if (request?.user) {
      return `${request?.user?.firstName} ${request?.user?.lastName}`
    }
    else {
      return `${request?.requestedFor?.fullName}`
    }
  }

  const orderTimeUnix = (order) => moment(momentzone.unix(order.scheduleData.startTs).tz(config.defaultTimeZone()).format('LLLL'), 'LLLL').unix();
  const isTimeFinished = (request) => {
    const endTsZone = moment(momentzone.unix(request.scheduleData.endTs).tz(config.defaultTimeZone()).format('LLLL'), 'LLLL').unix();
    return endTsZone < currentTimeStamp;
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
    open_drawer("confirmDrawer", propsToPass, "bottom");
  };

  const handleCallStart = async () => {
    if (orderTimeUnix(request) - currentTimeStamp > 0) return;
    let payload = {
      virtualOrderId: request._id,
      status: "JOIN",
      orderType: "VIDEO_CALL",
      deviceId: getDeviceId() || uid
    };

    startLoader();
    try {
      const res = await patchVideoOrderAPI(payload);
      if (res.status === 200) {
        close_drawer();
        const token = res.data.data.rtcToken;
        const meetingId = res.data.data.meetingId
        if (token) setCookie('AGORA_TOKEN', token);
        setCookie('AGORA_CHANNEL', request?.orderId);
        // setCookie('CALL_END_TIME', request?.scheduleData.endTs);
        setCookie('MEETING_ID', meetingId)
        setCookie('CALL_END_TIME', moment(momentzone.unix(request?.scheduleData.endTs).tz(config.defaultTimeZone()).format('LLLL'), 'LLLL').unix());
        setCookie('AGORA_ORDER_ID', request?._id);
        setCookie('CALL_HOST_ID', request?.creator?._id);
        setCookie('CALL_HOST_USERNAME', request?.creator?.username)
        if (token) {
          let isExtensionRejected = props.isPurchasePage ? `?isExtensionRejected=${request?.isExtensionRejected}` : ""
          Router.push(`/conference${isExtensionRejected}`);
        } else {
          const isometrikPayload = {
            meetingId,
            deviceId: getDeviceId() || uid
          }
          const extraHeaders = {
            licenseKey: creds.isometrikLicenseKey,
            appSecret: creds.isometrikAppSecret,
            userToken: getCookie("isometrikToken"),
            "Content-Type": "application/json",
          }
          try {
            const response = await startIsometrikCall(isometrikPayload, extraHeaders)

            if (response.status === 400) {
              let payload = {
                virtualOrderId: request._id,
                status: "JOIN",
                orderType: "VIDEO_CALL",
                deviceId: getDeviceId() || uid,
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
                    let isExtensionRejected = props.isPurchasePage ? `?isExtensionRejected=${request?.isExtensionRejected}` : ""
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
                let isExtensionRejected = props.isPurchasePage ? `?isExtensionRejected=${request?.isExtensionRejected}` : ""
                if (rtcToken) Router.push(`/conference${isExtensionRejected}`);
              }
            }
          } catch (error) {
            console.log(error, "error")
          }
        }
      }
      stopLoader();
      // getUpdatedOrderDetail();
    } catch (err) {
      console.log(err, "error")
      Toast("Error in Starting Call", "error");
      stopLoader();
    };
  };

  const handleAddToCalendar = () => {
    const timeZonedStartTs = orderTimeUnix(request);
    const { startTs, endTs } = request.scheduleData;
    addCalendarEvent(new Date(timeZonedStartTs * 1000).toISOString(), endTs - startTs, config.APP_NAME + " Platform", config.APP_NAME, true);
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

  return (
    <div>
      <Head>
        <script src="https://apis.google.com/js/api.js" type="text/javascript" />
        <script src="https://accounts.google.com/gsi/client" type="text/javascript" async defer></script>
      </Head>
      {mobileView ? (
        <>
          <Header title={`#${request.orderId}`} icon={config.backArrow} back={back} />
          <div
            className="w-100 d-flex flex-column align-items-center text-center pb-5 mb-5"
            style={{ position: "absolute", top: "75px", background: `${theme?.drawerBackground}` }}
          >
            <div
              className={`d-flex flex-column aligh-items-center rounded position-relative ${!isPurchaseSection && "pt-2"
                } mb-4`}
              style={{ width: "90%", background: `${theme.type == "light" ? "#f7f8fa" : theme?.sectionBackground}`, border: `2px solid ${theme.type == "light" ? "#eaedf9" : theme?.perticularShoutoutSectionBg}` }}
            >
              <div className="cursor-pointer" style={{ position: "absolute", right: "10px", top: "10px" }} onClick={getUpdatedOrderDetail}>
                <Refresh className='ml-2 dv_appTxtClr' fontSize={'medium'} />
              </div>
              {!props.isPurchasePage ? (
                <>
                  <div className="pb-2 mb-2" style={{ borderBottom: `2px solid ${theme.type == "light" ? "#eaedf9" : theme?.perticularShoutoutSectionBg}` }}>
                    <p
                      className="p-0 m-0 font-weight-800"
                      style={{
                        fontSize: "4.3vw",
                        color: `${theme?.shoutout_success}`,
                      }}
                    >
                      {lang.myEarnings}
                      {(["CANCELLED", "REJECTED", "FAILED"].includes(request?.status) || request?.isRefunded) ? " 0.00" : ` ${request?.price?.currencySymbol || "$"}${request?.finalAmount.toFixed(2)}`}
                    </p>
                  </div>
                  <div className="d-flex flex-column justify-content-center rounded-bottom p-2">
                    <p
                      className="p-0 m-0 textOrderColor"
                      style={{ fontSize: "3.3vw", fontWeight: "600", color: `${theme?.text}` }}
                    >
                      {request?.orderType === "VIDEO_CALL" ? lang.videoCallRequestFrom : lang.shoutOut}
                    </p>
                    <div className="my-2 mx-auto text-center callout-none" onContextMenu={handleContextMenu}>
                      {(request?.opponentUser?.profilePic || request?.user?.profilePic) ? (
                        <FigureCloudinayImage
                          publicId={request?.opponentUser?.profilePic || request?.user?.profilePic}
                          ratio={1}
                          className="orderImgCss mb-1"
                        />
                      ) : (
                        <Avatar className="mv_profile_shoutout mb-1">
                          {request?.opponentUser ?
                            (
                              <span className="profileName">
                                {request?.opponentUser?.firstName[0] +
                                  request?.opponentUser?.lastName[0]}
                              </span>
                            ) : request?.user && <span className="profileName">
                              {request?.user?.firstName[0] +
                                request?.user?.lastName[0]}
                            </span>}
                        </Avatar>
                      )}
                    </div>
                    <div className="d-flex priceCss flex-column justify-content-center ml-2">
                      <p
                        className="p-0 m-0 textOrderColor"
                        style={{
                          fontSize: "4.3vw",
                          fontWeight: "700",
                          textTransform: "capitalize",
                          color: `${theme.type == "light" ? "#141415" : theme?.text}`
                        }}
                      >
                        {getCreatorName(request)?.toUpperCase()}
                      </p>
                      <span className="font-weight-700"
                        style={{
                          fontSize: "3.2vw",
                          fontWeight: "600",
                          marginTop: "-3px",
                          textTransform: "capitalize",
                          color: `${request.status === "COMPLETED"
                            ? "green"
                            : ["CANCELLED", "REJECTED", "FAILED"].includes(request?.status)
                              ? "red"
                              : "blue"
                            }`,
                        }}
                      >
                        {/* {request.status} */}
                      </span>
                    </div>
                    <div className="col-12 d-flex px-0 pt-3">
                      {request.orderType !== "VIDEO_CALL" && <div className="col px-0">
                        <div className="text-left fntSz12"
                          style={{ color: "#aaa6a6" }}
                        >{lang.RequestedFor}</div>
                        <div className="text-left textOrderColor fntSz18">
                          {/* {request?.requestedFor?.fullName} */}
                          {request?.bookingFor && !request?.bookingFor.startsWith("6") ? request?.bookingFor : `${request?.requestedFor?.fullName || request?.opponentUser?.firstName + " " +
                            request?.opponentUser?.lastName} (Myself)`}
                        </div>
                      </div>}
                      <div className="d-flex align-items-center col-auto ml-auto">
                        <div className="statusCss px-2">{request.status}</div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="d-flex flex-column justify-content-center rounded-bottom p-2 position-relative">
                    <div className="cursor-pointer" style={{ position: "absolute", right: "10px", top: "10px" }} onClick={getUpdatedOrderDetail}>
                      <Refresh className='ml-2 dv_appTxtClr' fontSize={'medium'} />
                    </div>
                    <p
                      className="p-0 m-0 textOrderColor"
                      style={{ fontSize: "3.3vw", fontWeight: "600", color: `${theme?.text}` }}
                    >
                      {request?.orderType === "VIDEO_CALL" ? lang.videoCallRequestto : lang.shououtRequestWith}
                    </p>
                    <div className="my-2 mx-auto text-center callout-none" onContextMenu={handleContextMenu}>
                      {(request?.opponentUser?.profilePic || request?.creator?.profilePic) ? (
                        <FigureCloudinayImage
                          publicId={`${request?.opponentUser?.profilePic || request?.creator?.profilePic}`}
                          ratio={1}
                          className="orderImgCss mb-1"
                        />
                      ) : (
                        <Avatar className="mv_profile_shoutout mb-1">
                          {request?.opponentUser ?
                            (
                              <span className="profileName">
                                {request?.opponentUser?.firstName[0] +
                                  request?.opponentUser?.lastName[0]}
                              </span>
                            ) : request?.creator && <span className="profileName">
                              {request?.creator?.firstName[0] +
                                request?.creator?.lastName[0]}
                            </span>}
                        </Avatar>
                      )}
                    </div>
                    <div className="d-flex flex-column justify-content-center ml-2">
                      <p
                        className="p-0 m-0 textOrderColor"
                        style={{
                          fontSize: "4.3vw",
                          fontWeight: "700",
                          textTransform: "capitalize",
                          color: `${theme?.text}`
                        }}
                      >
                        {request.opponentUser ? (request?.opponentUser?.username) : (request?.opponentUser?.username || (request?.creator?.firstName + " " + request?.creator?.lastName))}
                      </p>
                      <div className="priceCss textOrderColor">
                        {request?.price?.currencySymbol} {request?.price?.price}
                      </div>
                      <div className="col-12 d-flex px-0 pt-3">
                        {request.orderType !== "VIDEO_CALL" && <div className="col px-0">
                          <div className="text-left fntSz12"
                            style={{ color: "#aaa6a6" }}
                          >{lang.RequestedFor}</div>
                          <div className="text-left textOrderColor fntSz18">
                            {/* {request?.requestedFor?.fullName} */}
                            {request?.bookingFor && !request?.bookingFor.startsWith("6") ? request?.bookingFor : `${request?.requestedFor?.fullName || request?.opponentUser?.firstName + " " +
                              request?.opponentUser?.lastName} (Myself)`}
                          </div>
                        </div>}
                        <div className="d-flex align-items-center col-auto ml-auto">
                          <div className="statusCss px-2">{request.status}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            {(request?.status !== "ACCEPTED" && request?.status !== "REQUESTED" && request?.status !== "FAILED" &&
              ((request?.status == "REJECTED" && request?.orderType == "VIDEO_CALL") || (request?.orderType !== "VIDEO_CALL"))) &&
              <div
                className="mt-1"
                style={{ width: "100%", height: "7px", background: `${theme.border}` }}
              ></div>}
            {["CANCELLED", "REJECTED", "FAILED"].includes(request?.status) ? (
              <>
                <div className="text-left p-2" style={{ width: "91%" }}>
                  <p
                    className="p-0 m-0 mb-2"
                    style={{ fontSize: "4vw", color: "red", fontWeight: "600" }}
                  >
                    {lang.cancellationReason}
                  </p>
                  <p className="p-0 m-0 textOrderColor" style={{ fontSize: "3.8vw" }}>
                    {request.reason}
                  </p>
                </div>
              </>
            ) : (
              <></>
            )}
            {request.status === "COMPLETED" && request?.orderType !== "VIDEO_CALL" && (
              <div className="d-flex px-3 pt-3 flex-column justify-content-start w-100">
                <div
                  className="col-12 px-1 d-flex textOrderColor font-weight-700"
                  style={{ color: `${theme?.text}`, fontSize: "4vw" }}
                >
                  {request?.orderType === "VIDEO_CALL" ? "VIDEO CALL REQUEST" : lang.ShoutOutVideo}
                </div>
                <div className="d-flex py-3">
                  <div className="col-auto">

                    <div className="callout-none" onContextMenu={handleContextMenu}>
                      {request.orderUrlType === "IMAGE" ?
                        <FigureCloudinayImage
                          publicId={`${request?.orderThumbnailUrl}`}
                          crop="thumb"
                          ratio={1}
                          style={{
                            objectFit: "cover",
                            width: "20vw",
                            height: "20vw",
                          }}
                          alt="video thumbnail"
                        />
                        :
                        <div
                          onClick={(e) => {
                            e && e.stopPropagation();
                            // open_drawer(
                            //   "VDO_DRAWER",
                            //   { vdoUrl: `${request?.orderUrl}` },
                            //   "right"
                            // );
                            handleImageClick(request, true)
                          }}
                        >
                          <p className="mb-0 callout-none" onContextMenu={handleContextMenu}
                            style={{
                              fontSize: "3.9vw",
                              fontWeight: "600",
                              color: "#515151",
                            }}
                          >
                            <FigureCloudinayImage
                              publicId={`${request?.orderThumbnailUrl}`}
                              crop="thumb"
                              ratio={1}
                              style={{
                                objectFit: "cover",
                                width: "20vw",
                                height: "20vw",
                              }}
                              alt="video thumbnail"
                            />
                            <Img
                              src={config.playIcon}
                              className="videoIconCenterCss"
                              height="50px"
                            />
                          </p>
                        </div>
                      }
                    </div>
                  </div>
                  <div className="col d-flex flex-column align-items-start px-0 justify-content-between">
                    <div
                      className="fntSz14 text-left textOrderColor"
                      style={{ fontWeight: "500", color: `${theme?.text}` }}
                    >
                      {request?.notes}
                    </div>
                    {props.isPurchasePage && (request?.rating || orderRating) ?
                      <div className="d-flex align-items-center">
                        <button className="downLoadBtn mt-3"
                          onClick={() => downloadVideo(request?.orderUrl)}
                          disabled={request.orderUrlType === "IMAGE" ? false : !(request?.orderUrl.startsWith("https"))}
                        >
                          {lang.download}
                        </button>
                        <div className="d-flex flex-column justify-content-end pl-3">
                          <div className="col-auto d-flex align-items-center pr-0 statusInfo">
                            <Icon
                              icon={`${config.ratingIcon}#ratingIcon`}
                              width={15}
                              height={15}
                              unit="px"
                              style={{ marginBottom: "4px" }}
                              viewBox="0 0 21.491 20.439"
                            />
                            <p className="m-0 fntSz14 appTextColor font-weight-500">{request?.rating || orderRating}</p>
                          </div>
                          <p className="m-0 fntSz12" style={{ color: "var(--l_breadcrum_deactive)" }}>{lang.youRated}</p>
                        </div>
                      </div>
                      : props.isPurchasePage && <div className="d-flex">
                        <button className="downLoadBtn mt-3"
                          onClick={() => downloadVideo(request?.orderUrl, false, request.orderUrlType === "IMAGE")}
                          disabled={request.orderUrlType === "IMAGE" ? false : !(request?.orderUrl.startsWith("https"))}
                        >
                          {lang.download}
                        </button>
                        <div className="ratingCss ml-2 mt-3" onClick={() => handelShoutoutRating(request?.creator?.profilePic, request?.creator?.firstName, request?.creator?.lastName, request._id, request?.orderType)}>{lang.rateNow}</div>
                      </div>}
                  </div>
                </div>
              </div>
            )}
            {(request?.status !== "ACCEPTED" && request?.status !== "REQUESTED") && <div
              className="mt-1"
              style={{ width: "100%", height: "7px", background: `${theme.border}` }}
            ></div>
            }
            <div className="w-100"
              style={{ background: `${theme?.drawerBackground}`, borderTop: request?.status == "REQUESTED" && `4px solid ${theme.border}` }}
            >
              <div
                className="w-100 text-left px-4 py-3"
                style={{ height: "90%" }}
              >
                {!props.isPurchasePage ? <>
                  {(["VIDEO_CALL", "VIDEO_SHOUTOUT"].includes(request?.orderType)) && (["CANCELLED", "REJECTED", "FAILED"].includes(request?.status) || request?.isRefunded) ? <div className="moneyRefunded rounded p-2 mb-4  px-3 d-flex align-content-center">
                    <div className="w-75">
                      <p className="mpner_Para_one fntWeight700 fntSz15 mt-2">{lang.refundOrder + request?.user?.firstName + " " +
                        request?.user?.lastName}</p>
                      <p className="fntWeight700 fntSz13 fntlightGrey txt-medium mb-2">{videoCallText(request)}</p>
                    </div>
                    <div className=" d-flex align-content-center justify-content-center  w-25">
                      <p className="mpner_Para_one fntWeight700 fntSz18 my-auto" >{request?.price?.currencySymbol || "$"}{request?.price?.price + request?.tax}</p>
                    </div>
                  </div> : ""}
                </> :
                  <>
                    {(["VIDEO_CALL", "VIDEO_SHOUTOUT"].includes(request?.orderType)) && (["CANCELLED", "REJECTED", "FAILED"].includes(request?.status) || request?.isRefunded) && <div className="moneyRefunded rounded p-2 mb-4  px-3 d-flex align-content-center"
                      style={{ width: "100%", background: `${theme.type == "light" ? "#f7f8fa" : theme?.sectionBackground}` }}>

                      <div className="w-100">
                        <p className="mpner_Para_one2 fntWeight700 fntSz15 mt-2"> {request?.price?.currencySymbol || "$"}{request?.price?.price + request?.tax} Refunded </p>
                        {!!request.creator?._id && <p className="fntWeight700 fntSz13 fntlightGrey txt-medium mb-2">{videoCallText(request)}</p>}
                      </div>
                    </div>}
                  </>}

                <div className="d-flex align-items-center justify-content-between mb-2">
                  <p style={{ fontSize: "4vw", color: `${theme?.text}` }} className="textOrderColor mb-0 font-weight-700">
                    {request?.orderType === "VIDEO_CALL" ? lang.requestDateTime : lang.requestDetails}
                  </p>
                  {/* {request?.orderType === "VIDEO_CALL" && ["ACCEPTED", "JOIN"].includes(request?.status)  && <span className="calendar_add_option d-flex align-items-center txt-heavy fntSz11 cursorPtr ml-2 dv_appTxtClr_we">
                      <img width={15} className="mr-2" src={config.GO_LIVE_SCREEN.calendarAddIcon} alt='Add Calendar' />
                      Add to calendar
                  </span>} */}
                </div>
                {request.attribute &&
                  request.attribute.map((SinglAttribute) => {
                    return SinglAttribute.type !== "VIDEO_UPLOAD" ? (
                      <div key={SinglAttribute.attributeId} className="pb-3">
                        <div>
                          <p
                            className="p-0 m-0"
                            style={{ fontSize: "3.4vw", color: "#8D8B99" }}
                          >
                            {SinglAttribute.attributeName}
                          </p>
                          <p className="mb-0"
                            style={{
                              fontSize: "3.9vw",
                              fontWeight: "600",
                              color: theme.text,
                            }}
                          >
                            {SinglAttribute.value}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div>
                          <p
                            className="p-0 m-0"
                            style={{ fontSize: "3.4vw", color: "#8D8B99" }}
                          >
                            {SinglAttribute.attributeName}
                          </p>
                          <div className="d-flex">
                            <p className="pt-1 mb-0 pl-0 col-auto"
                              style={{
                                fontSize: "3.9vw",
                                fontWeight: "600",
                                color: theme.text,
                                marginBottom: "11vw",
                              }}
                              
                              onClick={(e) => {
                                e && e.stopPropagation();
                                handleImageClick(SinglAttribute)
                              }}
                            >
                              <div className="position-relative callout-none" onContextMenu={handleContextMenu}>
                                {SinglAttribute.isImage ?
                                  <FigureCloudinayImage
                                    publicId={SinglAttribute?.imageUrl}
                                    crop="thumb"
                                    ratio={1}
                                    style={{
                                      objectFit: "cover",
                                      width: "30vw",
                                      height: "30vw",
                                    }}
                                    alt="video thumbnail"
                                  />
                                  :
                                  <>
                                    <FigureCloudinayImage
                                      publicId={SinglAttribute?.thumbnail}
                                      crop="thumb"
                                      ratio={1}
                                      style={{
                                        objectFit: "cover",
                                        width: "30vw",
                                        height: "30vw",
                                      }}
                                      alt="video thumbnail"
                                    />
                                    <Img
                                      src={config.playIcon}
                                      className="videoIconCenterCss"
                                      height="65px"
                                    />
                                  </>
                                }
                              </div>
                            </p>
                            {/* {!props.isPurchasePage && <div className="col-auto pl-0 d-flex align-items-end">
                                <div className="downLoadBtn " onClick={() => downloadVideo(SinglAttribute?.value, true, isImage)}>{lang.download}</div>
                            </div>} */}
                          </div>
                        </div>
                      </div>
                    )
                  })}

                {request?.orderType === "VIDEO_CALL" && request?.scheduleData?.scheduleDate && (
                  <>
                    <div className="col-12 mb-1 mt-2 d-flex fntSz14 txt-roman px-0 text-app">
                      {moment(momentzone.unix(request?.scheduleData.startTs).tz(config.defaultTimeZone()).format('LLLL'), 'LLLL').format("MMMM DD, YYYY")}
                    </div>
                    <div className="col-12 mb-1 d-flex fntSz14 txt-roman px-0 text-app">
                      {moment(momentzone.unix(request?.scheduleData.startTs).tz(config.defaultTimeZone()).format('LLLL'), 'LLLL').format("h:mm a")}
                      <span className="ml-1">{config.defaultTimeZone()}</span>
                    </div>
                    <div className="col-12 mb-1 d-flex align-items-end justify-content-between fntSz14 text-muted text-capitalize txt-book px-0">
                      {lang.callDuration}{" : "}{timeDifferenceCalc(request?.scheduleData?.endTs, request?.scheduleData?.startTs)}
                      {["COMPLETED"].includes(request?.status) && isPurchaseSection && (
                        <div
                          className={`${request?.rating || orderRating ? "" : "ratingCall"} ml-auto`}
                          onClick={() => !(request?.rating || orderRating) && handelShoutoutRating(request?.creator?.profilePic, request?.creator?.firstName, request?.creator?.lastName, request._id, request?.orderType)}
                        >
                          {request?.rating || orderRating ?
                            (<div className="d-flex flex-column justify-content-end pl-3">
                              <div className="col-auto d-flex align-items-center pr-0 statusInfo">
                                <Icon
                                  icon={`${config.ratingIcon}#ratingIcon`}
                                  width={15}
                                  height={15}
                                  unit="px"
                                  style={{ marginBottom: "4px" }}
                                  viewBox="0 0 21.491 20.439"
                                />
                                <p className="m-0 fntSz14 appTextColor font-weight-500">{request?.rating || orderRating}</p>
                              </div>
                              <p className="m-0 fntSz12" style={{ color: "var(--l_breadcrum_deactive)" }}>{lang.youRated}</p>
                            </div>) : lang.rateCall
                          }
                        </div>
                      )}
                      {request?.orderType === "VIDEO_CALL" && ["ACCEPTED", "JOIN"].includes(request?.status) && <div onClick={handleAddToCalendar} className="calendar_add_option txt-heavy fntSz11 cursorPtr ml-2 dv_appTxtClr_web">
                        <img width={15} className="mr-2 callout-none" src={config.GO_LIVE_SCREEN.calendarAddIcon} alt='Add Calendar' contextMenu={handleContextMenu} />
                        Add to calendar
                      </div>}
                    </div>
                    <span className="text-muted fntSz14">{lang.noteVideoCall}</span>
                  </>
                )}

              </div>
              {props.isPurchasePage && <div
                className="p-0"
                style={{ width: "100%", height: "7px", background: `${theme.border}` }}
              ></div>}
              <div
                className={`${props.isPurchasePage
                  ? "col-12 d-flex justify-content-start pb-4"
                  : "col-12 d-flex justify-content-center pb-4"
                  } `}
              >
                {request.status === "COMPLETED" || request?.orderType === "VIDEO_CALL" ? (
                  <></>
                ) : request.status === "CANCELLED" ? (
                  <></>
                ) : request.status === "FAILED" ? (
                  <></>
                ) : request.status === "REJECTED" ? (
                  <></>
                ) : request.status === "ACCEPTED" ?
                  (
                    <>
                      {!isPurchaseSection && <CustButton
                        type="submit"
                        style={{
                          position: "fixed",
                          width: "85%",
                          textAlign: "center",
                          margin: "auto",
                          bottom: "10px",
                        }}
                        onClick={() =>
                          open_drawer(
                            "VideoUpload",
                            { handleVideoUpload: handleVideoUpload, allowProfileView: request?.allowProfileView, orderId: request?._id },
                            "bottom"
                          )
                        }
                        cssStyles={theme.blueButton}
                      >
                        {lang.uploadMedia}
                      </CustButton>}
                    </>
                  ) : (
                    <>
                      {!props.isPurchasePage ? (
                        <>
                          <CustButton
                            type="submit"
                            style={{
                              position: "fixed",
                              left: "8%",
                              width: "40%",
                              textAlign: "center",
                              margin: "auto",
                              bottom: "10px",
                            }}
                            onClick={() =>
                              open_drawer(
                                "OrderCancel",
                                {
                                  handleAcceptOrCancel: handleAcceptOrCancel,
                                  isPurchasePage: props.isPurchasePage,
                                  orderType: request?.orderType
                                },
                                "bottom"
                              )
                            }
                            cssStyles={theme.blueButton}
                          >
                            {lang.reject}
                          </CustButton>
                          <CustButton
                            type="submit"
                            style={{
                              position: "fixed",
                              right: "8%",
                              width: "40%",
                              textAlign: "center",
                              margin: "auto",
                              bottom: "10px",
                            }}
                            onClick={() => handleAcceptOrCancel("ACCEPTED")}
                            cssStyles={theme.blueButton}
                          >
                            {lang.accept}
                          </CustButton>
                        </>
                      ) : (
                        <CustButton
                          type="submit"
                          style={{
                            right: "8%",
                            width: "40%",
                            textAlign: "left",
                            bottom: "10px",
                          }}
                          onClick={() =>
                            open_drawer(
                              "OrderCancel",
                              {
                                handleAcceptOrCancel: handleAcceptOrCancel,
                                isPurchasePage: props.isPurchasePage,
                                orderType: request?.orderType
                              },
                              "bottom"
                            )
                          }
                          cssStyles={theme.blueButton}
                        >
                          {lang.cancelOrder}
                        </CustButton>

                      )}
                    </>
                  )}

                {
                  request?.orderType === "VIDEO_CALL" && ["REQUESTED"].includes(request?.status) && (
                    <>
                      {
                        !isPurchaseSection ? (
                          <>
                            <CustButton
                              type="submit"
                              style={{
                                position: "fixed",
                                left: "8%",
                                width: "40%",
                                textAlign: "center",
                                margin: "auto",
                                bottom: "10px",
                              }}
                              onClick={() =>
                                open_drawer(
                                  "OrderCancel",
                                  {
                                    handleAcceptOrCancel: handleAcceptOrCancel,
                                    isPurchasePage: props.isPurchasePage,
                                    orderType: request?.orderType
                                  },
                                  "bottom"
                                )
                              }
                              cssStyles={theme.blueButton}
                            >
                              {lang.reject}
                            </CustButton>
                            <CustButton
                              type="submit"
                              style={{
                                position: "fixed",
                                right: "8%",
                                width: "40%",
                                textAlign: "center",
                                margin: "auto",
                                bottom: "10px",
                              }}
                              onClick={() => handleAcceptOrCancel("ACCEPTED")}
                              cssStyles={theme.blueButton}
                            >
                              {lang.accept}
                            </CustButton>
                          </>
                        ) : (
                          <>
                            <div className="col-7 d-flex mx-auto pt-3">
                              <div className="py-4" style={{
                                position: "fixed",
                                width: "100%",
                                bottom: "0",
                                left: "0",
                                background: theme?.drawerBackground
                              }}>
                                <CustButton
                                  type="button"
                                  style={{
                                    width: "85%",
                                    textAlign: "center",
                                    margin: "auto",
                                  }}
                                  cssStyles={theme.blueButton}
                                  onClick={() =>
                                    open_drawer(
                                      "OrderCancel",
                                      {
                                        handleAcceptOrCancel: handleAcceptOrCancel,
                                        isPurchasePage: props.isPurchasePage,
                                        orderType: request?.orderType
                                      },
                                      "bottom"
                                    )}
                                >
                                  {lang.cancelOrder}
                                </CustButton>
                              </div>
                            </div>
                          </>
                        )
                      }
                    </>
                  )
                }

                {request?.orderType === "VIDEO_CALL" && ["ACCEPTED", "JOIN"].includes(request?.status) && !isPurchaseSection && (
                  <div className="col-7 d-flex mx-auto pt-3">
                    <CustButton
                      type="button"
                      style={{
                        position: "fixed",
                        width: "85%",
                        textAlign: "center",
                        margin: "auto",
                        bottom: "10px",
                        left: "9%"
                      }}
                      cssStyles={theme.blueButton}
                      onClick={isTimeFinished(request) ? handleCallCompleteAlert : handleCallStart}
                    >
                      {isTimeFinished(request) ? "Confirm Call Completion" : `${request?.status === "JOIN" ? 'Join Call' : `Start Call ${orderTimeUnix(request) - currentTimeStamp >= 0 ? `In ${timeDifferenceCalc(orderTimeUnix(request), currentTimeStamp)}` : ''}`}`}
                    </CustButton>
                  </div>
                )}

                {request?.orderType === "VIDEO_CALL" && ["ACCEPTED"].includes(request?.status) && isPurchaseSection && (
                  <div className="col-7 d-flex mx-auto pt-3">
                    <div className="py-4" style={{
                      position: "fixed",
                      width: "100%",
                      bottom: "0",
                      left: "0",
                      background: theme?.drawerBackground
                    }}>
                      <CustButton
                        type="button"
                        style={{
                          width: "85%",
                          textAlign: "center",
                          margin: "auto",
                        }}
                        cssStyles={theme.blueButton}
                      >
                        {orderTimeUnix(request) - currentTimeStamp <= 0 ? 'Please wait for call to start' : `Call Starts In ${timeDifferenceCalc(orderTimeUnix(request), currentTimeStamp)}`}
                      </CustButton>
                    </div>
                  </div>
                )}

                {request?.orderType === "VIDEO_CALL" && ["JOIN"].includes(request?.status) && isPurchaseSection && !isTimeFinished(request) && (
                  <div className="col-7 d-flex mx-auto pt-3">
                    <CustButton
                      type="button"
                      style={{
                        position: "fixed",
                        width: "85%",
                        textAlign: "center",
                        margin: "auto",
                        bottom: "10px",
                        left: "9%"
                      }}
                      cssStyles={theme.blueButton}
                      onClick={handleCallStart}
                    >
                      Join Call
                    </CustButton>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <h5 className="content_heading px-1 m-0 myAccount_sticky_header">
            Desktop Screen
          </h5>
          <p>Work in progress</p>
        </>
      )}
      <style jsx>
        {`
        .calendar_add_option {
          border-radius: 20px;
          padding: 5px 8px;
          border: 1px solid ${theme.type == "light" ? "#D9D9D9" : "var(--l_base)"};
          }
          // :global(.MuiDrawer-paper) {
          //   overflow: scroll !important;
          // }
          .initials {
            font-size: 30px;
            color:${theme?.appColor};
            letter-spacing: 3px;
            font-weight: bold;
            text-transform: uppercase;
          }
          .priceCss {
            padding-bottom: 16px;
            border-bottom: 2px solid #d7d7d7;
            font-weight: 700;
          }
          .statusCss {
            font-size: 14px;
            color: ${request?.status == "COMPLETED"
            ? "#09CC4D"
            : ["CANCELLED", "REJECTED", "FAILED"].includes(request?.status)
              ? "#EC1818"
              : "#4918ec"};
            font-weight: 600;
            border: 1px solid
              ${request?.status == "COMPLETED"
            ? "#09CC4D"
            : ["CANCELLED", "REJECTED", "FAILED"].includes(request?.status)
              ? "#EC1818"
              : "#4918ec"};
            padding: 5px 2px;
            border-radius: 5px;
          }
          .downLoadBtn {
            padding: 2px 5px;
            border: 1px solid ${theme.appColor};
            color: #fff;
            border-radius: 4px;
            font-size: 14px;
            background: ${theme.appColor};
          }
          .ratingCss {
            padding: 2px 5px;
            border: 1px solid #d12d49;
            color: #d12d49;
            border-radius: 4px;
            font-size: 14px;
          }
          .ratingCall {
            padding: 5px 15px;
            border-radius: 17px;
            font-weight: 900;
            border: 1px solid ${theme.appColor};
            color: ${theme.appColor};
            font-size: 14px;
          }
          .textOrderColor{
            color : ${theme?.text}
          }
          .border-top{
            border-top : 1px solid #434659 !important;
          }
          :global(.MuiDrawer-paper) {
            overflow-y: auto !important;
          }
          :global(.MuiPaper-root),
          :global(.my-subscribers.card_bg){
            background:${theme?.drawerBackground} !important;
          }
          :global(.MuiRating-label){
            top:${mobileView ? "0.1em" : ""}
          }
          :global(.mv_profile_shoutout){
            width: 71px !important;
            height: 71px !important;
            border-radius: 50% !important;
            object-fit: cover;
            background-color: ${theme.type == "light" ? "#eef0f8" : "var(--l_app_bg)"} !important;
          }
          .profileName {
            font-size: 30px;
            color: ${theme.type == "light" ? "#11378f" : "var(--l_base)"};
            font-family: "Roboto";
            font-weight: bold;
            text-transform: uppercase;
            border: ${theme.type == "light" ? `2px solid "#eaedf9"` : "none"};
          }
          .moneyRefunded{
            border: 1px solid ${!props.isPurchasePage ? "#ED3E3E" : "#09cc4d"};
           
          }
          .mpner_Para_one{
            color:#ED3E3E;
            line-height: 1;
          }
         
          .mpner_Para_one2{
            color:#09cc4d;
            line-height: 1;
          }
        `}
      </style>
    </div>
  );
};

export default Order;
