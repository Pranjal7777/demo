import React, { useEffect, useState } from "react";
import { useTheme } from "react-jss";
import { useSelector } from "react-redux";

import {
  LIGHT_BLUE,
  WHITE,
  INPUT_BORDER,
  PDP_BUTTON_BORDER,
  PROFILE_IMAGE,
  color1,
  color7,
  CHAT_DOC,
  CHAT_XLS,
  CHAT_PDF,
  CHAT_TXT,
  color6,
  DEFAULT_DOC,
  CHAT_DOWNLOAD,
  DIAMOND_COLOR,
} from "../../../lib/config";
import Wrapper from "../chatWrapper/chatWrapper";
import { textdecode, downloadFile } from "../../../lib/chat";
import Img from "../../ui/Img/Img";

const Document = (props) => {
  const theme = useTheme();
  let { user, message, payload } = props;
  let { messageType, fileName } = message;

  const APP_IMG_LINK = useSelector((state) => state?.appConfig?.baseUrl);

  let messageString =
    (message.payload && textdecode(message.payload).split(",")) || "";

  let url = (typeof messageString[0] != "undefined" && messageString[0]) || "";

  url = `${APP_IMG_LINK}/${url}`;

  let type = (typeof messageString[0] != "undefined" &&
    messageString[1] && messageString[1]) || "";

  let image = CHAT_DOC;

  if (type.toString().includes("doc")) {
    image = CHAT_DOC;
  } else if (type.toString().includes("xls")) {
    image = CHAT_XLS;
  } else if (type.toString().includes("txt")) {
    image = CHAT_TXT;
  } else if (type.toString().includes("pdf")) {
    image = CHAT_PDF;
  } else {
    image = DEFAULT_DOC;
  }

  return (
    <Wrapper
      index={props.index}
      message={props.message}
      profilePic={props.profilePic}
      user={props.user}
    >
      <div className="chat-block document-share">
        <div className="d-flex align-items-start">
          {props.isVipMessage && props.user
            ? <Img
              src={DIAMOND_COLOR}
              width={12}
              className="vip_chat_icon self"
              alt="Vip message icon"
            />
            : ""
          }
          <div className="chat-text row m-0 align-items-center">
            <div className="mr-2 cursorPtr">
              <Img src={image} height={40} alt="image with cursor pointer" />
            </div>
            <div>
              <div className="offer-text-document w-600">
                {fileName || "title"}
              </div>
              <div className="offer-amount">{type || "file"}</div>
            </div>
            <div className="chat-download-icon cursorPtr ml-auto">
              <Img
                onClick={() => {
                  downloadFile(url, type, fileName);
                }}
                src={CHAT_DOWNLOAD}
                height={15}
                alt="chat download button"
              />
            </div>
          </div>
          {props.isVipMessage && !props.user
            ? <Img
              src={DIAMOND_COLOR}
              width={12}
              className={`vip_chat_icon ${props.user ? "self" : ""}`}
              alt="Vip message icon"
            />
            : ""
          }
        </div>
      </div>

      <style jsx>
        {`
          .offer-text-document {
            max-width: 120px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .chat-download-icon {
            margin-left: 14px !important;
            border-radius: 100%;
            padding: 8px 10px;
            background-color: ${color6};
          }

          .document-share .offer-amount {
            //   font-size: 1.1rem;
            //   margin-top: 2px;
            //   font-weight: 700;
            color: ${color7};
          }
          .document-share .offer-text {
            font-weight: 500;
          }
          .w-600 {
            font-weight: 600 !important;
          }
          .document-share .chat-time {
            white-space: nowrap;
            font-size: 0.6rem;
            width: fit-content;
            margin-left: auto;
            font-weight: 500;
            margin-top: 5px;
            // color: #dedee1;
          }
          .document-share .chat-block {
            width: fit-content;
            max-width: 60%;
          }
          .document-share .chat-text {
            background-color: ${theme.button.background};
            border: 1px solid ${color7};
            color: ${!props.user ? WHITE : "black"};
            border-radius: 8px;
            // text-align: ${props.user ? "right" : "left"};
            font-weight: 500;
            border-top-left-radius: ${props.user ? "8px" : "0px"};
            border-top-right-radius: ${props.user ? "0px" : "8px"};
            padding: 7px 17px 7px 5px !important;
            font-size: 0.75rem;
            min-width: 192px;
          }
        `}
      </style>
    </Wrapper>
  );
};

export default Document;
