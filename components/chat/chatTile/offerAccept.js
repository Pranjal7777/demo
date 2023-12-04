import React, { useEffect, useState } from "react";
import {
  LIGHT_BLUE,
  WHITE,
  INPUT_BORDER,
  PDP_BUTTON_BORDER,
  PROFILE_IMAGE,
  color1,
  color7,
} from "../../../lib/config";
import Wrapper from "../chatWrapper/chatWrapper";
import moment from "moment";
import { useTheme } from "react-jss";
import { textdecode } from "../../../lib/chat";

const OfferAccept = (props) => {
  const theme = useTheme();
  let prefix = "";
  let title = "";
  let { user, message } = props;
  let { messageType, payload } = message;
  // console.log("sndjsndjnd", payload);
  let payloadData = {};
  try {
    payloadData = JSON.parse(textdecode(payload));
  } catch (e) {
    console.error("parsing error", e);
  }
  // if (user) {
  //   prefix = "You Accepted The Offer";
  // } else {
  title = "Offer Accepted for";
  if (!message.isExchange) {
    if (props.type == "sale") {
      prefix = user
        ? `You will get charged amount ${payloadData.currencySymbol} ${payloadData.commission} as App Commission. please don't release the goods till the payment is escrowed`
        : `The buyer has accepted your offer. you will get charged amount ${payloadData.currencySymbol} ${payloadData.commission} as App Commission.please don't release the goods till the payment is escrowed`;
    } else {
      prefix = `${user ? "You " : "The seller has "
        } accepted your offer please make a payment to confirm the deal , by clicking on the Make Payment button on the top of the chat page`;
    }
  } else {
    title = "Offer Accepted";
    if (props.type == "exchangeRecived") {
      prefix = "you accepted exchange offer ";
    } else {
      prefix = "Seller has accepted your exchange offer";
    }
  }
  // }

  // console.log("sndjsndjnd", payloadData);
  return (
    <Wrapper
      index={props.index}
      message={props.message}
      profilePic={props.profilePic}
      user={props.user}
    >
      <div className="chat-block offer-accept">
        <div className="d-flex align-items-start">
          <div className="chat-text">
            <div className="offer-amount mb-1">
              {title} {payloadData.currencySymbol}&nbsp;
              {payloadData.offerAmount}
            </div>
            <div className="offer-text">{prefix}</div>
          </div>
        </div>
      </div>

      <style jsx>
        {`
          .offer-accept .offer-amount {
            font-size: 0.9rem;
            margin-top: 2px;
            font-weight: 700;
          }
          .offer-accept .offer-text {
            font-weight: 500;
            font-size: 0.7rem;
          }
          .offer-accept .chat-time {
            white-space: nowrap;
            font-size: 0.6rem;
            width: fit-content;
            margin-left: auto;
            font-weight: 500;
            margin-top: 5px;
            // color: #dedee1;
          }
          .offer-accept .chat-block {
            width: fit-content;
            max-width: 60%;
          }
          .offer-accept {
            max-width: 42%;
          }
          .offer-accept .chat-text {
            background-color: ${props.user ? WHITE : theme.l_base};
            border: 1px solid ${props.user ? color7 : theme.l_base};
            color: ${!props.user ? WHITE : "black"};
            border-radius: 8px;
            text-align: ${props.user ? "left" : "left"};
            font-weight: 500;
            border-top-left-radius: ${props.user ? "8px" : "0px"};
            border-top-right-radius: ${props.user ? "0px" : "8px"};
            padding: 7px 17px 13px 17px;
            font-size: 0.75rem;
            min-width: 136px;
          }
        `}
      </style>
    </Wrapper>
  );
};

export default OfferAccept;
