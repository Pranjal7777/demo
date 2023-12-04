import React, { useEffect, useState } from "react";
import {
  LIGHT_BLUE,
  WHITE,
  INPUT_BORDER,
  PDP_BUTTON_BORDER,
  PROFILE_IMAGE,
  color1,
  color7,
  APP_NAME,
} from "../../../lib/config";
import Wrapper from "../chatWrapper/chatWrapper";
import moment from "moment";
import { textdecode } from "../../../lib/chat";
import { useTheme } from "react-jss";

const DealConfirm = (props) => {
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
  title = "Payment released";
  if (!message.isExchange) {
    if (props.type == "sale") {
      prefix = `Buyer has confirmed the purchase and the payment of ${
        payloadData.currencySymbol
      } ${
        parseFloat(payloadData.offerAmount) - parseFloat(payloadData.commission)
      }  is now available in your main balance, the app has taken a commission of ${
        payloadData.currencySymbol
      } ${
        payloadData.commission
      } for this sale as per our agreement, thank you for using the ${APP_NAME} for selling your product!`;
    } else {
      title = "Purchase confirmed";
      prefix = `Thank you for confirming the purchase , we have released the payment of ${payloadData.currencySymbol} ${payloadData.offerAmount} to the seller`;
    }
  } else {
    title = "Exchange confirmed";
    prefix = `thank you for using the ${APP_NAME} for exchanging products`;
    // if (props.type == "exchangeSend") {
    //   title = "";
    //   title = "Exchange confirmed";
    //     prefix = `thank you for using the ${APP_NAME} for exchanging products`;
    //   if (user) {
    //     title = "QR Code Scanned";
    //     prefix =
    //       "Exchanger has scanned your QR code.Now your turn to scan exchanger's QR code.";
    //   } else {
    //     title = "Exchange confirmed";
    //     prefix = `thank you for using the ${APP_NAME} for exchanging products`;
    //   }

    //   // prefix = `thank you for using the ${APP_NAME} for exchanging products`;
    // } else {
    //   title = "QR Code Scanned";
    //   if (user) {
    //     prefix =
    //       "You have scanned QR Code.\nNow show your QR Code to Exchanger";
    //   } else {
    //     title = "Exchange confirmed";
    //     prefix = `thank you for using the ${APP_NAME} for exchanging products`;
    //   }
    //   // prefix = `thank you for using the ${APP_NAME} for exchanging products`;
    // }
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
      <div className="chat-block deal-accept">
        <div className="d-flex align-items-start">
          <div className="chat-text">
            <div className="offer-amount mb-1">{title}</div>
            <div className="offer-text">{prefix}</div>
          </div>
        </div>
      </div>

      <style jsx>
        {`
          .deal-accept .offer-amount {
            font-size: 0.9rem;
            margin-top: 2px;
            font-weight: 700;
          }
          .deal-accept .offer-text {
            font-weight: 500;
            font-size: 0.7rem;
          }
          .deal-accept .chat-time {
            white-space: nowrap;
            font-size: 0.6rem;
            width: fit-content;
            margin-left: auto;
            font-weight: 500;
            margin-top: 5px;
            // color: #dedee1;
          }
          .deal-accept .chat-block {
            width: fit-content;
            max-width: 60%;
          }
          .deal-accept {
            max-width: 42%;
          }
          .deal-accept .chat-text {
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

export default DealConfirm;
