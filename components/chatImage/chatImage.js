import React from "react";
import {
  PROFILE_IMAGE,
  SOLD,
  PRIMARY,
  WHITE,
} from "../../lib/config";
import Img from "../ui/Img/Img";
import Avatar from "../ui/Avatar/avatar";

import { display } from "@material-ui/system";
const chatImage = (props) => {
  return (
    <div className="product-image-chat" style={{ position: "relative" }}>
      <Img className="product-image" src={props.src}></Img>
      {props.chat && (
        <div className="product-avataricon">
          {/* <Avatar
            src={props.profile || PROFILE_IMAGE}
            classes="c-profile-image"
          ></Avatar> */}
        </div>
      )}
      {(props.sold || props.like) && <div className="overlay-block"></div>}
      {props.live && <div className="chat-dot"></div>}
      {props.bedges && <div className="product-image-badge">1</div>}
      <div
        className="position-absolute product-image-container"
        style={{ height: "fit-content", width: "fit-content" }}
      >
        {props.sold && (
          <Img className="product-sold-image-chat" src={SOLD}></Img>
        )}
        {props.like && (
          <Img className="product-sold-image-chat" src={SOLD}></Img>
        )}
      </div>
      <style jsx>{`
        .product-avataricon {
          position: absolute;
          right: -5px;
          z-index: 2;
          bottom: -9px;
        }

        :global(.c-profile-image) {
          height: 25px;
          width: 25px;
        }
        .product-image-chat {
          width: ${props.width || "80px"};
          object-fit: cover;
          height: ${props.height || "53px"};
          margin: 0px 10px;
        }

        @media only screen and (max-width: 1269px) {
          .product-image-chat {
            width: 54px;
            margin-left: 1px;
            height: 43px;
          }
        }

        .product-image-badge {
          background-color: ${PRIMARY};
          border-radius: 100%;

          position: absolute;
          padding: 1.5px 6px;
          font-weight: 700;
          font-size: 0.5rem;
          color: ${WHITE};
          top: -5px;
          right: -5px;
        }
        .product-avataricon {
          position: absolute;
          right: -5px;
          bottom: -9px;
        }
        .overlay-block {
          height: inherit;
          width: inherit;
          border: 1px solid #f6f6f6;
          border-radius: 8px;
          z-index: 1;
          background-color: black;
          position: absolute;
          top: 0;
          opacity: 0.5;
        }

        :global(.product-sold-image-chat) {
          height: auto;
          width: 28px;
          z-index: 2;
        }

        .product-image-container {
          top: 27%;
          left: 34%;
          z-index: 2;
        }

        .product-sold-image-chat {
          height: 100px;
          width: 100px;
        }
        :global(.product-image) {
          height: inherit;
          width: inherit;
          // border: 1.6px solid #f6f6f6;
          border-radius: 8px;
          object-fit: cover;
        }
        .chat-dot {
          background-color: ${props.live ? "#01fe92" : "#696969"};
          z-index: 2;
          border-radius: 100%;
          height: 7px;
          width: 7px;
          position: absolute;
          bottom: 2px;
          right: -2px;
        }
      `}</style>
    </div>
  );
};

export default chatImage;
