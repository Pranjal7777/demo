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
import { textdecode } from "../../../lib/chat";
import { useTheme } from "react-jss";

const PaymentMessage = (props) => {
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
    console.error("parsing error",e);
  }
  // if (user) {
  //   prefix = "You Accepted The Offer";
  // } else {
  title = `payment escrowed of ${payloadData.currencySymbol} ${payloadData.paymentAmount}`;
  if (!message.isExchange) {
    if (props.type == "sale") {
      prefix = `Payment is in your pending balance.payment will be released to your withdraw-able balance after the buyer scans the unique QR code for your deal`;
    } else {
      title = "payment escrowed";
      prefix = `You have made payment of ${payloadData.currencySymbol} ${payloadData.paymentAmount}`;
    }
  } else {
    title = "";
    if (props.type == "exchangeRecived") {
      prefix = "you accepted offer ";
    } else {
      prefix = "Seller accepted offer";
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
      <div className="chat-block payment-success">
        <div className="d-flex align-items-start">
          <div className="chat-text">
            <div className="offer-amount mb-1">{title}</div>
            <div className="offer-text">{prefix}</div>
          </div>
        </div>
      </div>

      <style jsx>
        {`
          .payment-success .offer-amount {
            font-size: 0.9rem;
            margin-top: 2px;
            font-weight: 700;
          }
          .payment-success .offer-text {
            font-weight: 500;
            font-size: 0.7rem;
          }
          .payment-success .chat-time {
            white-space: nowrap;
            font-size: 0.6rem;
            width: fit-content;
            margin-left: auto;
            font-weight: 500;
            margin-top: 5px;
            // color: #dedee1;
          }
          .payment-success .chat-block {
            width: fit-content;
            max-width: 60%;
          }
          .payment-success {
            max-width: 42%;
          }
          .payment-success .chat-text {
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

export default PaymentMessage;
