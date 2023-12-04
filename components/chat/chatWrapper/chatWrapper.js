import React, { useEffect, useState } from "react";
import {
  PDP_BUTTON_BORDER,
  PRIMARY,
  LIGHT_GRAY,
} from "../../../lib/config";
import { dateFormate } from "../../../lib/chat";

export const ChatTick = ({ color }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      id="Capa_1"
      enableBackground="new 0 0 515.556 515.556"
      height="10px"
      width="10px"
      viewBox="0 0 515.556 515.556"
      className=""
    >
      <g>
        <path
          d="m-0 274.226 176.549 176.886 339.007-338.672-48.67-47.997-290.337 290-128.553-128.552z"
          data-original="#000000"
          className="active-path"
          data-old_color="#000000"
          fill={color || PRIMARY}
        />
      </g>
    </svg>
  );
};

const ChatWrapper = (props) => {
  const [loader, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  let {
    userImage,
    timestamp,
    createdAt,
    status,
    messageId,
    deliveredAt,
  } = props.message;
  let { profilePic } = props;

  let messageStatus = (status) => {
    switch (status) {
      case 1:
        return (
          <React.Fragment>
            <ChatTick color={LIGHT_GRAY} />
          </React.Fragment>
        );
      case 2:
        return (
          <React.Fragment>
            <ChatTick color={LIGHT_GRAY} />
            <ChatTick
              className="margin-left-minus"
              color={LIGHT_GRAY}
            />
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
      default:
        return <ChatTick color={LIGHT_GRAY} />;
    }
  };

  return (
    <div className="chat-wrapper chat-message">
      <div className={`d-flex${props.user ? " chat-right" : " chat-left"}`}>
        <div className={`w-100 flex-column d-flex${!props.user ? " align-items-start" : " align-items-end"}`}>
          {props.children}
          <div className="chat-time">
            {props.user && messageStatus(status)}
            <span className="ml-1">
              {!props.user &&
                (deliveredAt
                  ? dateFormate(parseInt(deliveredAt))
                  : dateFormate(parseInt(timestamp)))}
              {props.user &&
                (createdAt
                  ? dateFormate(parseInt(createdAt))
                  : dateFormate(parseInt(timestamp)))}

              {/* {moment(
                timestamp ? parseInt(timestamp) : parseInt(createdAt)
              ).format("hh:mm a")} */}
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .margin-left-minus {
          margin-left: -4px;
        }

        .chat-time {
          white-space: nowrap;
          font-size: 0.6rem;
          width: fit-content;
          float: ${props.user ? "right" : "left"};
          font-weight: 500;
          margin-top: 5px;
          // color: #dedee1;
        }
        :global(.chat-right) {
          display: flex;
          justify-content: flex-end;
          animation-duration: 0.3s;
          animation-name: ${loader ? "fly-right" : ""};
        }
        .chat-wrapper {
          // direction: ltr;
          // transform: rotate(180deg);
          margin: 10px 0px;
        }
        :global(.chat-left) {
          display: flex;
          animation-duration: 0.3s;
          animation-name: ${loader ? "fly-left" : ""};
        }
        @keyframes fly-left {
          0% {
            transform: scale(0.85) translateX(-10%);
            opacity: 0;
          }
          100% {
            transform: scale(1) translateX(0);
            opacity: 1;
          }
        }
        @keyframes fly-right {
          0% {
            transform: scale(0.85) translateX(10%);
            opacity: 0;
          }
          100% {
            transform: scale(1) translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default ChatWrapper;
