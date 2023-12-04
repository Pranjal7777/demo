import React from "react";
import { useSelector } from "react-redux";

import {
  PDP_BUTTON_BORDER,
  color7,
  DIAMOND_COLOR,
} from "../../../lib/config";
import Wrapper from "../chatWrapper/chatWrapper";
import { textdecode } from "../../../lib/chat";
import LazyLoad from "../../../components/imageLazy/imageLazy";
import Img from "../../ui/Img/Img";

const ImageSend = (props) => {
  const APP_IMG_LINK = useSelector((state) => state?.appConfig?.baseUrl);
  const imgUrl = `${APP_IMG_LINK}/${textdecode(props.message.payload)}`;

  return (
    <Wrapper
      index={props.index}
      message={props.message}
      profilePic={props.profilePic}
      user={props.user}
    >
      <div
        className="chat-block"
        onClick={() => props.onClick(imgUrl, "image")}
      >
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
            <LazyLoad
              effect="blur"
              className="chat-image-img"
              placeholder={"data:image/png;base64," + props.message.thumbnail}
              src={imgUrl || ""}
            />
          </div>
          {props.isVipMessage && !props.user
            ? <Img
              src={DIAMOND_COLOR}
              width={12}
              className={`vip_chat_icon ${props.user ? 'self' : 'self'}`}
              alt="Vip message icon" />
            : ""
          }
        </div>
      </div>

      <style jsx>{`
          .chat-image{
          width: 190px !imprtant;
            height: 176px !important;
          }
          :global(.chat-image-img img) {
            object-fit: cover;
            box-sizing: boreder-box;
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
            color: ${PDP_BUTTON_BORDER};
            font-weight: 500;
            font-size: 0.75rem;
            height: 100%;
            width: 100%;
            box-sizing: boreder-box;
            border-radius: 5px;
            border: 1px solid ${color7};
            overflow:hidden !important;
          }
        `}
      </style>
    </Wrapper>
  );
};

export default ImageSend;
