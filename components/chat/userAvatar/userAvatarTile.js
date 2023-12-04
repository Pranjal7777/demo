import React from "react";
import UserAvatar from "./userAvatar";
import Route, { useRouter } from "next/router";
import { backArrow, color3 } from "../../../lib/config";
import isMobile from "../../../hooks/isMobile";
import Img from "../../ui/Img/Img";
import { open_progress } from "../../../lib/global";
import Icon from "../../image/icon";
import { useTheme } from "react-jss";
import { setCookie } from "../../../lib/session";
import BlockIcon from "@material-ui/icons/Block";
import Tooltip from '@material-ui/core/Tooltip';

const userAvatarTile = (props) => {
  const params = useRouter();
  const { query = {} } = params || {};
  // console.log('userAvatarTile', query)
  const [mobileView] = isMobile();
  const chatData = localStorage.getItem("chatData") || "{}";
  let dummydata = JSON.parse(chatData);
  const theme = useTheme();

  const handleProfileClick = () => {
    if (props.isUserSuspendedOrDeleted) return
    if (props.isUserblock) {
      return props.unBlock();
    } else {
      if (props.userTypeCode == 2) {
        open_progress();
        setCookie("otherProfile", `${props?.username || props?.userName}$$${props?.withChatUserId || props?.userid || props?._id}`)

        Route.push(`${props.userName || props.username}`);
      }
      // Route.push(
      //   `otherProfile?userId=${props.withChatUserId}`,
      //   `user/${props.withChatUserId}`
      // );
    }
  };

  return (
    <div className="d-flex align-item-center">
      {mobileView ? (
        <Icon
          icon={`${backArrow}#left_back_arrow`}
          color={theme.type == "light" ? "#000" : "#fff"}
          width={25}
          height={25}
          onClick={() => {
            query.p ? Route.back() : Route.push("/chat");
          }}
          alt="backArrow"
          class="chat_back_arrow"
        />
      ) : (
        <></>
      )}
      <UserAvatar
        live={props.online}
        src={props.profilePic}
        userName={
          props.userName == undefined ? dummydata.username : props.userName
        }
        id={props.withChatUserId}
        userTypeCode={props.userTypeCode}
        isUserblock={props.isUserblock}
        unBlock={props.unBlock}
        userStatus={props.userStatus}
        authenticateChatUser={props.authenticateChatUser}
      />

      <div className={`ml-3 d-flex flex-column justify-content-center text-capitalize ${mobileView ? "chat_user_name" : ""}`}>
        <div className="d-flex align-items-center">
        <div
          onClick={handleProfileClick}
            className="t-ld font-weight-600 pointer chat_user_name_text text-truncate" style={{ maxWidth: mobileView ? "8em" : "18em", width: "fit-content" }}>
            {props.userName == undefined ? dummydata.username : props.userName}
          </div>
          {((props.isUserblock && props?.self) || props.isUserSuspendedOrDeleted) &&
            <Tooltip title={`${props.isUserblock && props?.self ? "User Blocked" : ""}`}>
              <BlockIcon className="fntSz14 ml-1 mb-1 text-danger cursorPtr my-auto" />
            </Tooltip>
          }
        </div>
        {!props.typing ? (
          <p className="online-offline-status p-0 m-0">
            {typeof props.online !== "undefined" && (props.online ? "Active" : "Offline")}
          </p>
        ) : (
          props.typing && <i className="typing-message pt-1">Typing...</i>
        )}
      </div>
      <style jsx>
        {`
          .user-avatar-tile {
            flex: 1;
          }

          :global(.user-avatar-tile .user-avatar-image) {
            height: 3rem;
            width: 3rem;
          }
          .typing-message {
            font-size: 0.65rem;
            margin-top: -4px;
            color: ${color3};
          }
          .online-offline-status {
            font-size: 0.65rem;
            margin-top: -4px;
            color: ${color3};
          }

          :global(.user-avatar-tile .chat-dot) {
            height: 11px;
            width: 11px;
            bottom: ${mobileView ? "-1px " : "5px "}!important;
            right: ${mobileView ? "0.5px " : "2.5px "}!important;
          }
          .gray {
            color: #575f65 !important;
          }
          .t-md {
            font-size: 0.75rem;
          }
          .t-lg {
            font-size: 0.7rem;
          }

          @media only screen and (max-width: 1269px) {
            .t-md {
              font-size: 0.55rem !important;
              line-height: 1rem !important;
            }
            .t-sm {
              font-size: 0.5rem !important;
              line-height: 1rem !important;
            }
            .t-lg {
              font-size: 0.6rem !important;
            }
          }
          .starIcon {
            height: 13px;
            width: 14px;
            margin-right: 2px;
            margin-top: -6px;
          }
        `}
      </style>
    </div >
  );
};

export default userAvatarTile;
