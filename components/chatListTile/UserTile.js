import React, { useEffect, useState } from "react";
import { useTheme } from "react-jss";
import { useDispatch, useSelector } from "react-redux";

import {
  PRIMARY,
  LIGHT_GRAY,
  HIDE_PASSWORD,
  DIAMOND_COLOR,
  CLOUDINARY_BASE_URL,
} from "../../lib/config";
import moment from "moment";
import { textdecode } from "../../lib/chat";
import { ChatTick } from "../chat/chatWrapper/chatWrapper";
import Image from "../../components/image/image";
import { subscribeTopic } from "../../lib/rxSubject";

import { MQTT_TOPIC } from "../../lib/config";
import AvatarImage from "../image/AvatarImage";
import isMobile from "../../hooks/isMobile";
import { s3ImageLinkGen } from "../../lib/UploadAWS/uploadAWS";

const MessageTile = (props) => {
  const theme = useTheme();
  const [active, changeStatus] = useState(0);
  const [report, setReport] = useState(false);
  const [mobileView] = isMobile();
  const dispatch = useDispatch();

  const toggle = (flag) => {
    setReport(flag);
  };
  // const IMAGE_LINK = useSelector((state) => state?.cloudinaryCreds?.IMAGE_LINK);
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);

  let { imageUrl, description, title, statusCode } = props.assetDetail
    ? props.assetDetail
    : {};
  let {
    profilePic,
    userName,
    deliveredAt,
    totalUnread,
    payload,
    messageType,
    userData,
    senderId,
    status,
    chatId,
    isVipMessage,
  } = props;

  let messageStatus = (status) => {
    // console.log("scnasjda d", chatId, status);
    switch (status) {
      case 2:
        return (
          <React.Fragment>
            <ChatTick color={LIGHT_GRAY} />
            <ChatTick className="margin-left-minus" color={LIGHT_GRAY} />
          </React.Fragment>
        );

      case 3:
        return (
          <React.Fragment>
            <ChatTick color={PRIMARY} />
            <ChatTick className="margin-left-minus " color={PRIMARY} />
          </React.Fragment>
        );
      case 5:
        return (
          <React.Fragment />
        );
        break;
        break;
      default:
        return <ChatTick color={LIGHT_GRAY} />;
    }
  };

  let checkMessageType = (type) => {
    switch (type?.toString()) {
      case "1":
        return textdecode(payload);
      case "2":
        return "image";
      case "3":
        return "video";
      case "4":
        return "location";
      case "10":
        return "Document";
      case "13":
        return "Offer accepted";
      case "14":
        return "Offer rejected";
      case "18":
        return "Deal canceled";
      case "21":
        return "Deal success";
      case "17":
        return "Exchange offer";
      case "16":
        return "Payment escrowed";
      case "19":
      case "LOCKED_POST":
        return "Locked message";
      case "20":
        return "Bulk message";
      case "12":
        return "new offer";
      case "15":
        return "";

      default:
        return textdecode(payload);
    }
  };

  React.useEffect(() => {
    const chatUserIdLive =
      userData._id == props.receiverId ? props.senderId : props.receiverId;
    subscribeTopic.next(MQTT_TOPIC.OnlineStatus + "/" + chatUserIdLive);
  }, []);


  // console.log("sncjadnjc1111", props);

  const chatUserId =
    userData._id == props.receiverId ? props.senderId : props.receiverId;
  const isselected = props.active
    ? "nav-item userListStyle selectedUser"
    : "nav-item userListStyle";
  return (
    <li
      className={isselected}
      onClick={() => props.onClick11(props.chatId, props.chatType || "sale ")}
    >
      <a className="nav-link w-100 py-0" data-toggle="pill" href="#">
        <div className="row align-items-end">
          <div className="col-12 px-2 px-xl-3">
            <div className="form-row align-items-center">
              <div className="col-2 px-0">
                {/* {profilePic ? (
                <CImage
                  className="chatListUserImage"
                  publicId={profilePic || HIDE_PASSWORD}
                  crop="scale"
                  height={50}
                  width={50}
                />) : (
                  <AvatarImage userName={props.userName} />
                )} */}
                <AvatarImage
                  // src={getTransformedImageUrl({
                  // 	publicId: profilePic,
                  // 	height: 50,
                  // 	width: 50,
                  // })}
                  src={s3ImageLinkGen(S3_IMG_LINK, profilePic, 50, 50, 50)}
                  userName={props.userName}
                />

                {/* <Image className="chatListUserImage" src={profilePic || HIDE_PASSWORD} alt="img" /> */}
                {props.userlist[chatUserId] == 1 ? (
                  <span className="mv_online_true" />
                ) : (
                  <span className="mv_online_false" />
                )}
              </div>
              <div className="col pl-3 py-2" style={{ borderBottom: "1.5px solid var(--l_border)" }}>
                <div className="row justify-content-between">
                  <div className="col-auto row">
                    <div className="mv_chat_pro_name">{props.userName}</div>
                    {/* {props.chatType == "vipChat" || (isVipMessage && userData.userTypeCode == 2) ? ( */}
                    {!props.type || props.isLastVipMessage ? (
                      <Image
                        src={DIAMOND_COLOR}
                        width={12}
                        height={12}
                        className="ml-1"
                        alt="Vip chat user icon"
                      />
                    ) : (
                      ""
                    )}
                  </div>
                  {totalUnread != 0 && !props.active ? (
                    <div className="col-auto">
                      <span className="mv_chat_count bg-danger">
                        {totalUnread}
                      </span>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
                <div className="row justify-content-between">
                  <div className="col-9 px-0">
                    <div className="mv_chat_pro_status">
                      <div className="d-flex">
                        {senderId == userData._id && (
                          <div className="d-flex mt-1 mr-2">
                            {messageStatus(status)}
                          </div>
                        )}
                        <div
                          className="font-weight-500 gray c-message word-break text-app fntSz11"
                        >
                          {mobileView
                            ? checkMessageType(props.messageType).length > 25
                              ? `${checkMessageType(props.messageType).slice(
                                0,
                                25
                              )}...`
                              : checkMessageType(props.messageType)
                            : checkMessageType(props.messageType)?.length > 25
                              ? `${checkMessageType(props.messageType).slice(
                                0,
                                25
                              )}...`
                              : checkMessageType(props.messageType)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-3 pl-0 text-right">
                    <div className="mv_chat_pro_status text-app">
                      {moment(deliveredAt).format("DD MMMM")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </a>
      <style jsx>
        {`
          :global(.chatListUserImage) {
            height: 50px !important;
            border-radius: 50% !important;
            width: 50px !important;
            border: 2px solid ${theme.palette.l_base};
          }

          .mv_online_true {
            position: absolute;
            width: 10px;
            height: 10px;
            background: #51ca31;
            border-radius: 50%;
            bottom: 3px;
            right: 7px;
            z-index: 1;
          }
          .mv_online_false {
            position: absolute;
            width: 10px;
            height: 10px;
            background: #696969;
            border-radius: 50%;
            bottom: 3px;
            right: 7px;
            z-index: 1;
          }
          .mv_chat_count {
            background: ${theme.palette.l_base};
            width: 20px;
            height: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            font-family: "Roboto", sans-serif !important;
            font-size: 12px !important;
          }

          .mv_chat_pro_name {
            font-family: "Roboto", sans-serif !important;
            font-size: 18px !important;
          }

          .btmModal .mv_chat_pro_name {
            font-family: "Roboto", sans-serif !important;
            font-size: 14px !important;
            color: #242a37 !important;
          }

          .mv_chat_pro_status {
            font-family: "Roboto", sans-serif !important;
            font-size: 14px !important;
            color: #666666;
          }
          .userListStyle {
            list-style: none;
            // max-height: 66px;
            // text-overflow: ellipsis;
            // overflow: hidden;
          }
          .selectedUser {
            background-color: ${theme.type === "light"
            ? theme.palette.l_input_bg
            : theme.palette.d_input_bg};
          }
        `}
      </style>
    </li>
  );
};

export default MessageTile;
