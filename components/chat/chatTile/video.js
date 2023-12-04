import React from "react";
import { useSelector } from "react-redux";

import {
  color7,
  CHAT_PLAY,
  DIAMOND_COLOR,
  FOLDER_NAME_IMAGES
} from "../../../lib/config";

import Wrapper from "../chatWrapper/chatWrapper";
import { textdecode } from "../../../lib/chat";
import Img from "../../ui/Img/Img";
import { s3ImageLinkGen } from "../../../lib/UploadAWS/uploadAWS";

const VideoSend = (props) => {
  const APP_IMG_LINK = useSelector((state) => state?.appConfig?.baseUrl);
  const videoURL = APP_IMG_LINK + '/' + textdecode(props.message.payload);
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);

  return (
    <Wrapper
      index={props.index}
      message={props.message}
      profilePic={props.profilePic}
      user={props.user}
    >
      <div className="chat-block">
        <div className="d-flex align-items-start">
          {props.isVipMessage && props.user
            ? <Img
              src={DIAMOND_COLOR}
              width={12}
              className={`vip_chat_icon self`}
              alt="Vip message icon" />
            : ""
          }
          <div className="chat-image position-relative cursorPtr">
            <Img
              className="chat-video-img"
              src={props.message.thumbnail.includes(FOLDER_NAME_IMAGES.crmMedia) ? s3ImageLinkGen(S3_IMG_LINK, props.message.thumbnail, null, 190, 176) : "data:image/png;base64," + props.message.thumbnail}
            />
            <div
              className="video-play-icon"
              onClick={() => props.onClick(videoURL, "video")}
            >
              <Img src={CHAT_PLAY} alt="play button" />
            </div>
          </div>
          {props.isVipMessage && !props.user
            ? <Img
              src={DIAMOND_COLOR}
              width={12}
              className={`vip_chat_icon ${props.user ? 'self' : 'self'}`}
              alt="Vip message icon" />
            : ""}
        </div>
      </div>

      <style jsx>{`
        :global(.video-play-icon){
          position: absolute;
          z-index: 1;
          top: 31%;
          left: 33%;
        }
        :global(.chat-video-img) {
          object-fit: cover;
          border: 1px solid ${color7};
          overflow: hidden;
          filter: blur(11px);
          flex: none;
          height: 100%;
          position: absolute;
          transform: scale(1.15);
          width: 100%;
          z-index: 1;
          background-position: 50% 50%;
          background-size: cover;
          box-sizing: boreder-box;
          border-radius: 5px;
        }
        .chat-time {
          white-space: nowrap;
          font-size: 0.6rem;
          width: fit-content;
          margin-left: auto;
          font-weight: 500;
          margin-top: 5px;
        }
        .chat-block {
          width: fit-content;
          max-width: 190px;
          width: 190px;
        }
        .chat-image {
          border-radius: 5px;
          border-radius: 8px;
          font-weight: 500;
          font-size: 0.75rem;
          height: 100%;
          width: 190px;
          height: 176px;
          box-sizing: border-box;
          border-radius: 5px;
          border: 1px solid ${color7};
          overflow:hidden !important;
        }
      `}
      </style>
    </Wrapper>
  );
};

export default VideoSend;
