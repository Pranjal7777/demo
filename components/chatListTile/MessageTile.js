import React, { useState } from "react";
import ProductImagechat from "../chatImage/chatImage";
import {
  LIGHT_GRAY,
  PRIMARY,
  HIDE_PASSWORD,
  UP_MENU,
  REPORT_USER_SUCCES,
  PDP_BUTTON_BORDER,
  LIGHTGRAYCHAT,
  WHITE,
  LITE_BACKGROUND_COLOR,
} from "../../lib/config";
import moment from "moment";
import { textdecode } from "../../lib/chat";
import { ChatTick } from "../chat/chatWrapper/chatWrapper";
const MessageTile = (props) => {
  const [active, changeStatus] = useState(0);
  const [report, setReport] = useState(false);
  const toggle = (flag) => {
    setReport(flag);
  };

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
  } = props;

  let messageStatus = (status) => {
    // console.log("scnasjda d", chatId, status);
    switch (status) {
      case 2:
        return (
          <React.Fragment>
            <ChatTick color={LIGHT_GRAY}></ChatTick>
            <ChatTick
              className="margin-left-minus"
              color={LIGHT_GRAY}
            ></ChatTick>
          </React.Fragment>
        );

      case 3:
        return (
          <React.Fragment>
            <ChatTick color={PRIMARY}></ChatTick>
            <ChatTick
              className="margin-left-minus "
              color={PRIMARY}
            ></ChatTick>
          </React.Fragment>
        );
        break;
      case 5:
        return (
          <React.Fragment />
        );
      default:
        return <ChatTick color={LIGHT_GRAY}></ChatTick>;
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

  // console.log("sncjadnjc1111", props);
  return (
    <div
      onClick={props.onClick}
      className={`chat-list-tile d-flex card-shadow ${props.active && "chat-list-tile-active"
        }`}
    // onMouseOver={() => {
    //   changeStatus(1);
    // }}
    // onMouseLeave={() => {
    //   changeStatus(0);
    // }}
    >
      <div>
        <ProductImagechat
          profile={profilePic}
          chat
          src={profilePic || HIDE_PASSWORD}
          sold={statusCode == 6}
        ></ProductImagechat>
      </div>
      <div
        className="d-flex flex-column  ml-3"
        style={{
          overflow: "hidden",
        }}
      >
        <div className="font-weight-600 c-name" style={{ fontSize: "11px" }}>{props.userName}</div>
        {/* <div className="t-sm font-weight-500 gray c-message word-break">
          {description}
        </div> */}
        <div className="d-flex">
          {senderId == userData._id && (
            <div className="d-flex mt-1 mr-2">{messageStatus(status)}</div>
          )}
          <div className="font-weight-500 gray c-message word-break" style={{ fontSize: "11px" }}>
            {checkMessageType(props.messageType)}
          </div>
        </div>
      </div>
      <div className="d-flex flex-column align-items-center ml-auto">
        <div className="font-weight-500 lite-lite-gray message-date-active sale-message-date " style={{ "fontSize": "10px" }}>
          {moment(deliveredAt).format("DD MMMM")}
        </div>
        <div className="position-relative menu-icon-button cursorPtr d-flex align-items-center mr-3">
          {parseInt(totalUnread) > 0 && (
            <div className="red-pill mr-2">{totalUnread}</div>
          )}
          {/* <div
            onClick={(e) => {
              e.stopPropagation();
              toggle(true);
            }}
          >
            <Img src={UP_MENU} className="menu-icon"></Img>
          </div> */}
          {/* <Fade when={report}> */}
          {report && (
            <React.Fragment>
              <div className="position-absolute report-container button-shadow">
                <div
                  className="report-items"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggle(false);
                    // props.open_dialog("reportDialog", {
                    //   userId: props._id,
                    //   openDialog: props.open_dialog.bind(
                    //     null,
                    //     "successDialog",
                    //     {
                    //       dialogText: "Congratulations",
                    //       dialogSubText: "the user has been reported",
                    //       dialogImg: REPORT_USER_SUCCES,
                    //       textClass: "successText"
                    //     }
                    //   )
                    // });
                  }}
                >
                  Report user
                </div>
              </div>
              <div
                className="report-backdrop"
                onClick={toggle.bind(null, false)}
              ></div>
            </React.Fragment>
          )}
          {/* </Fade> */}
        </div>
      </div>
      <style jsx>{`
        .c-name {
          color: ${PDP_BUTTON_BORDER};
        }
        .red-pill{
          height:15px;
          width:15px;
          background-color: ${PRIMARY};
          border-radius: 100%;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.6rem;
        }
        .report-container {
          right: 100%;
          top: 0;
          white-space: nowrap;
          background-color: white;
          margin-right: 7px;
          border-radius: 4px;
          overflow: hidden;
          z-index: 5;
        }
        .report-items {
          font-size: 0.75rem;
          padding: 8px 39px 8px 15px;s
        }
        .report-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          height: 100vh;
          width: 100vw;
          z-index: 1;
        }
        :global(.menu-icon) {
          height: 15px;
        }
        .c-message {
          color: ${LIGHTGRAYCHAT} !important;
        }
        .menu-icon-button {
          margin-left: 17px;
        }
        .chat-list-tile {
          background-color: ${WHITE};
          border-radius: 6px;
          padding: 15px 0px;
        
          margin-bottom: 10px;
          cursor: pointer;
          transition: scale 1s;
          flex: 1;
        }

        .c-name {
          // -webkit-line-clamp: 1;
          // display: -webkit-box;
          // -webkit-line-clamp: 1;
          // -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .c-message {
          overflow: hidden;
          text-overflow: ellipsis;
          // -webkit-line-clamp: 1;
          // display: -webkit-box;
          // -webkit-line-clamp: 1;
          // -webkit-box-orient: vertical;
          width: 100%;
          white-space: nowrap;
        }

        .sale-message-date {
          white-space: nowrap;
          margin: 0px 10px;
        }
        .chat-list-tile-active .message-date-active {
          color: #000 !important;
        }
        .chat-list-tile-active .message-date-active {
          color: #000 !important;
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
          .chat-list-tile-active {
            transform: scale(1.01);
          }
        }
        .chat-list-tile-active {
          background-color: ${LITE_BACKGROUND_COLOR};
          border-radius: 8px !important;
          padding: 15px 0px;
          justify-content: space-around;
          margin-bottom: 10px;
          cursor: pointer;
          -webkit-box-shadow: -6px -2px 11px -5px rgba(186, 179, 186, 1);
          -moz-box-shadow: -6px -2px 11px -5px rgba(186, 179, 186, 1);
          box-shadow: -6px -2px 11px -5px rgba(186, 179, 186, 1);
          transform: scale(1.02);
        }

        .chat-list-tile-active {
          background-color: ${LITE_BACKGROUND_COLOR};
          border-radius: 12px;
          padding: 15px 0px;
          justify-content: space-around;
          margin-bottom: 10px;
          cursor: pointer;

          transform: scale(1.03);
        }
        .sales-msg-badge {
          background-color: ${PRIMARY};
          border-radius: 100%;
          height: 15px;
          margin-top: 5px;
          width: 15px;

          font-weight: 700;
          font-size: 0.5rem;
          color: ${WHITE};
        }
        .lite-lite-gray {
          color: #cacbcd !important;
        }
        .gray {
          color: #575f65;
        }
        .t-md {
          font-size: 0.65rem;
          line-height: 1rem;
        }
        .t-sm {
          font-size: 0.6rem;
          line-height: 1rem;
        }
        .chat-list-tile-active .c-message{
          color: #000 !important;

        }
      `}</style>
    </div>
  );
};

export default MessageTile;
