import React from "react";
import ProductImagechat from "../../productImagechat/productImage";
import {
  LIGHT_BLUE,
  WHITE,
  INPUT_BORDER,
  PDP_BUTTON_BORDER,
  PROFILE_IMAGE,
  color1,
  color7,
  EXCHANGE_ICON,
  PLACE_HOLDER,
} from "../../../lib/config";
import Button from "../../ui/dialogButton/dialogButton";

import Wrapper from "../chatWrapper/chatWrapper";
import Img from "../../ui/Img/Img";
import { textdecode } from "../../../lib/chat";
import UserAvatar from "../../userAvatar/userAvatar";
import product from "../../products/product/product";
const ExchangeCard = (props) => {
  let { productData, assetDetail = {} } = props;
  let { imageUrl } = assetDetail;
  return (
    <Wrapper
      index={props.index}
      message={props.message}
      profilePic={props.profilePic}
      user={props.user}
    >
      <div className="chat-block-exchange chat-exchange ">
        <div className="d-flex flex-column align-items-start">
          <div className="text-color-blue w-500 text-center w-100 mb-2 pb-1">
            {props.user ? "Exchage request sent" : "Exchage request received"}
          </div>
          <div className="d-flex m-0 justify-content-between align-items-center w-100 pb-3">
            <UserAvatar
              className="exchnage-avatr"
              src={imageUrl || PLACE_HOLDER}
            ></UserAvatar>

            <Img className="exchange-ucons" src={EXCHANGE_ICON}></Img>
            <UserAvatar
              className="exchnage-avatr"
              src={productData.image || PLACE_HOLDER}
            ></UserAvatar>
          </div>
          <div className="text-center chat-exchange-text">
            {textdecode(props.message.payload || "")}
          </div>
        </div>
      </div>
      <style jsx>{`
        :gloabl(.exchnage-avatr) {
          height: 3.3rem !important;
          width: 3.3rem !important;
        }
        :global(.exchange-ucons) {
          transform: rotate(90deg);
          height: 40px;
        }
        :global(.chat-block-exchange) .chat-time {
          white-space: nowrap;
          font-size: 0.6rem;
          width: fit-content;
          margin-left: auto;
          font-weight: 500;
          margin-top: 5px;
          // color: #dedee1;
        }
        .chat-block-exchange {
          width: fit-content;
          font-size: 0.8rem;
          min-width: 260px;
          max-width: 260px;
        }
        .chat-exchange {
          border: 1px solid ${color7};

          border-radius: 8px;
          font-weight: 500;
          border-top-left-radius: ${props.user ? "8px" : "0px"};
          border-top-right-radius: ${props.user ? "0px" : "8px"};
          padding: 7px 17px;
          font-size: 0.75rem;
          overflow: hidden;
        }
        .chat-exchange-text {
          background-color: ${color1};
          color: ${WHITE};
          margin: -0px -17px -7px -17px;
          padding: 10px 17px;
          min-width: 260px;
          max-width: 260px;
        }
      `}</style>
    </Wrapper>
  );
};

export default ExchangeCard;
