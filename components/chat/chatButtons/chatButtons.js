import React, { useEffect } from "react";
import { WHITE, PRIMARY, MQTT_TOPIC } from "../../../lib/config";
import Dialog from "../../../hoc/dialogHoc";
import { getCookie } from "../../../lib/session";
// import { acceptOffer } from "../../../utils/dialog";
import Router from "next/router";
import {
  patchOffer,
  getRatingParamiters,
  getInvoice,
} from "../../../services/chat";
import {
  patchOfferType,
  textdecode,
  MessagePayload,
  textencode,
  sendChatMessage,
} from "../../../lib/chat";

import Route from "next/router";
// import { Toast } from "../../../utils/eventEmiter";
// import { appCommitionAssets } from "../../../services/payment";
const Button = ({ className, children, ...props }) => {
  return (
    <button className={`chat-buttons mr-3 ${className || ""}`} {...props}>
      {children}

      <style jsx>{`
        .chat-buttons {
          border: 1px solid ${PRIMARY};
          background-color: ${props.border ? WHITE : PRIMARY};
          height: 33px;
          color: ${props.border ? PRIMARY : WHITE};
          width: 105px;
          font-size: 0.75rem;
          border-radius: 4px;
          cursor: pointer;
        }
      `}</style>
    </button>
  );
};

const ChatButton = (props) => {
  // console.log("chatbuttons", props);
  let {
    assetDetail = {},
    profilePic,
    chatId,
    userName,
    offerId,
    offerReplyUserId,
    senderId,
    orderId,
    receiverId,
    lastOfferAmount,
  } = props.chatsData;
  let { type } = props;

  // const acceptOfferDialog = async () => {
  //   let amount = "0";
  //   let curruncy = assetDetail && assetDetail.units && assetDetail.units.symbol;
  //   if (props.isUserblock) {
  //     props.unBlock();
  //     return;
  //   }
  //   let titile2 = "Are you sure want to Accept the offer?";

  //   try {
  //     let data = await appCommitionAssets(
  //       assetDetail._id,
  //       lastOfferAmount,
  //       assetDetail && assetDetail.units && assetDetail.units.currency_code
  //     );
  //     let commission = data.data.data.appCommission;
  //     console.log("sdad", data);
  //     amount = commission;
  //   } catch (e) {
  //     console.log("sadasd", e);
  //   }
  //   if (type == "sale") {
  //     titile2 = `On accepting this deal you will be charged ${curruncy} ${amount} as app commission that will be billed once the deal is confirmed via QR code scan`;
  //   }

  //   // props.open_dialog(
  //   //   "recoverWarningDialog",
  //   //   acceptOffer(
  //   //     titile2,
  //   //     async () => {
  //   //       try {
  //   //         let reqPayload = {
  //   //           isExchange: false,
  //   //           offerId: offerId,
  //   //           amount: lastOfferAmount,
  //   //           currency:
  //   //             assetDetail &&
  //   //             assetDetail.units &&
  //   //             assetDetail.units.currency_code,
  //   //           offerType: patchOfferType.ACCEPTED,
  //   //         };

  //   //         let { isExchange, exchangeAssetId } = props.chatsData;
  //   //         if (isExchange) {
  //   //           reqPayload["isExchange"] = isExchange;
  //   //           reqPayload["exchangeAssetId"] = exchangeAssetId;
  //   //           delete reqPayload["amount"];
  //   //           delete reqPayload["currency"];
  //   //         }
  //   //         let message = "";
  //   //         if (type == "sale") {
  //   //           message = JSON.stringify({
  //   //             offerAmount: lastOfferAmount,
  //   //             commission: amount,
  //   //             currencySymbol: curruncy,
  //   //           });
  //   //         } else if (type == "shopping") {
  //   //           message = JSON.stringify({
  //   //             offerAmount: lastOfferAmount,
  //   //             commission: amount,
  //   //             currencySymbol: curruncy,
  //   //           });
  //   //         }

  //   //         props.close_dialog();

  //   //         console.log("patch offer paylaod", reqPayload);
  //   //         const acceptOffer = await patchOffer(reqPayload);
  //   //         let extraPayload = {
  //   //           commission: parseFloat(amount).toFixed(2),
  //   //           price: lastOfferAmount,
  //   //           productName: assetDetail && assetDetail.title,
  //   //         };
  //   //         let messageStatus = 13;
  //   //         if (isExchange) {
  //   //           console.log(
  //   //             "patch offer paylaod acceptOffer",
  //   //             acceptOffer.data.data
  //   //           );

  //   //           extraPayload["orderId"] = acceptOffer.data.data.orderId;
  //   //           extraPayload["dealStatus"] = 1;
  //   //         }

  //   //         sendMessage(messageStatus, 1, message, extraPayload);
  //   //       } catch (e) {
  //   //         console.log("patch offer paylaod", e);
  //   //       }

  //   //       console.log("accepts offerass");
  //   //     },
  //   //     props.close_dialog
  //   //   )
  //   // );
  // };

  const sendMessage = (type, offerType, payload = "", extraPayload = {}) => {
    // console.log("patch offer sendMessage", extraPayload);
    let chatPayload = { ...MessagePayload };
    let userId = getCookie("uid");
    let chatSenderId = userId;
    let chatReciverId = userId == senderId ? receiverId : senderId;
    chatPayload.username = userName;
    chatPayload.client_id = chatSenderId;
    chatPayload.senderId = chatSenderId;
    chatPayload.receiverId = chatReciverId;
    chatPayload.payload = textencode(payload.toString());
    chatPayload.assetId = assetDetail && assetDetail._id;
    chatPayload.chatId = chatId;
    chatPayload.messageType = parseInt(type);
    chatPayload.offerType = offerType.toString();
    if (offerId) {
      chatPayload.offerId = offerId;
    }

    if (props.type == "shopping" || props.type == "exchangeSend") {
      chatPayload.isBuyerMessage = true;
    }

    chatPayload.userImage = "";
    chatPayload.topic = MQTT_TOPIC.Message + "/" + chatReciverId;
    chatPayload.lastOfferAmount = lastOfferAmount || "";
    chatPayload.lastOfferCurrency = assetDetail.units.currency_code || "$";

    let { isExchange, exchangeAssetId, paymentStatus } = props.chatsData;
    if (isExchange) {
      chatPayload.isExchange = isExchange || "";
      chatPayload.exchangeAssetId = exchangeAssetId || "$";
    }

    // console.log("PublishMessage", chatPayload);
    sendChatMessage({ ...chatPayload, ...extraPayload });
  };
  const openOfferDialog = (type) => {
    if (props.isUserblock) {
      props.unBlock();
      return;
    }
    let userId = getCookie("uid");
    props.open_dialog("makeOffer", {
      counter: type,
      chatId: chatId,
      offerId: offerId,
      title: assetDetail.title,
      senderId: senderId,
      receiverId: receiverId,
      orignalAmount: assetDetail.price,
      amount: assetDetail
        ? assetDetail.units &&
          assetDetail.units.symbol + "" + (lastOfferAmount || assetDetail.price)
        : "00",
      price:
        typeof lastOfferAmount != "undefined"
          ? lastOfferAmount
          : assetDetail.price,
      symbol: assetDetail && assetDetail.units && assetDetail.units.symbol,
      currency_code:
        assetDetail && assetDetail.units && assetDetail.units.currency_code,
      img: (assetDetail && assetDetail.imageUrl && assetDetail.imageUrl) || "",
      sellername: userName,
      userId: userId,
      assetsId: (assetDetail && assetDetail._id) || "",
      sellerId: assetDetail.userId,
      offerReplyUserId: offerReplyUserId,
      redirection: true,
    });
  };

  const cancelDealDialog = (type) => {
    if (props.isUserblock) {
      props.unBlock();
      return;
    }
    // console.log("asdasdda", props.type);
    props.open_dialog("cancelDeal", {
      type: type,
      userType:
        props.type == "shopping" || props.type == "exchangeSend" ? 2 : 1,
      sendMessage: sendMessage,
      offerId: offerId,
      orderId: orderId,
      currency_code:
        assetDetail && assetDetail.units && assetDetail.units.currency_code,
      price: lastOfferAmount,
    });
  };
  const EditOffers = () => {
    let { isExchange } = props.chatsData;
    return (
      <React.Fragment>
        {!isExchange && (
          <Button onClick={openOfferDialog.bind(null, false)}>
            Edit offer
          </Button>
        )}
        {!isExchange ? (
          <Button border onClick={cancelDealDialog.bind(null, 1)}>
            {"cancel offer"}
          </Button>
        ) : (
          <Button border onClick={cancelDealDialog.bind(null, 2)}>
            {"cancel deal"}
          </Button>
        )}
      </React.Fragment>
    );
  };

  const AcceptsOffer = () => {
    let { isExchange } = props.chatsData;
    return (
      <React.Fragment>
        {/* <Button onClick={acceptOfferDialog}>
          {isExchange ? "Accept deal" : "Accept offer"}
        </Button> */}
        {!isExchange ? (
          <Button onClick={openOfferDialog.bind(null, true)} border>
            counter offer
          </Button>
        ) : (
          <Button border onClick={cancelDealDialog.bind(null, 2)}>
            cancel deal
          </Button>
        )}
      </React.Fragment>
    );
  };

  const Payment = () => {
    let {
      isExchange,
      offerId,
      assetDetail = {},
      paymentStatus,
    } = props.chatsData;
    let { _id } = assetDetail;
    return (
      <React.Fragment>
        {!isExchange && !paymentStatus && (
          <Button
            onClick={() => {
              if (props.isUserblock) {
                props.unBlock();
                return;
              }
              Route.push(
                `/payment?paymentType=${2}&sid=${_id}&offerId=${offerId}`,
                `/payment/offer/${_id}/${offerId}`
              );
            }}
          >
            Make payment
          </Button>
        )}
        <Button border onClick={cancelDealDialog.bind(null, 1)}>
          cancel offer
        </Button>
        {/* <Button border onClick={cancelDealDialog.bind(null, 2)}>
          Cancel Deal
        </Button> */}
      </React.Fragment>
    );
  };

  const RateUser = () => {
    // return {
    //   getRatingParamiters,
    // };
  };

  const CancelDeal = () => {
    let { isExchange, paymentStatus } = props.chatsData;
    return (
      <React.Fragment>
        {/* <Button onClick={cancelDealDialog.bind(null, 2)}>Cancel Deal</Button> */}
        <Button onClick={cancelDealDialog.bind(null, 1)}>cancel offer</Button>
        <div className="cancel-deal-button mr-3">
          {!isExchange && (
            <>
              <div className="text-success">Accepted offer</div>
              {paymentStatus ? (
                <div className="text-success">Payment escrowed</div>
              ) : (
                <div className="text-danger">Waiting for payment</div>
              )}
            </>
          )}
        </div>
      </React.Fragment>
    );
  };

  const openPDF = async () => {
    let { orderId } = props.chatsData;
    try {
      let pdf = "";
      let data = await getInvoice(orderId);
      let invoice = data.data.data;
      if (props.type == "shopping" || props.type == "exchangeSend") {
        pdf = invoice.buyerInvoiceUrl;
      } else {
        pdf = invoice.sellerInvoiceUrl;
      }
      window.open(pdf);
    } catch (e) {}

    return false;
  };
  const handlerRating = () => {
    let { orderId } = props.chatsData;

    if (orderId) {
      type = "";
      if (props.type == "shopping" || props.type == "exchangeSend") {
        type = "SELLER";
      } else {
        type = "BUYER";
      }
      getRatingParamiters(type)
        .then((data) => {
          props.open_dialog("rateDialog", {
            paramiters: data.data.data,
            chatData: props.chatsData,
            type: type,
            userId: getCookie("uid"),
          });
        })
        .catch((e) => {
          // Toast(e.response.data.message, "error");
        });
    }
  };
  const rating = () => {
    let {
      isExchange,
      paymentStatus,
      dealStatus,
      sellerReviewStatus,
      buyerReviewStatus,
    } = props.chatsData;
    let type = "";
    let text = "";
    let buttonshow = false;
    if (props.type == "shopping" || props.type == "exchangeSend") {
      type = "buyer";
      text = "seller";
      if (!sellerReviewStatus && (dealStatus == 3 || dealStatus == 2)) {
        buttonshow = true;
      }
    } else {
      type = "seller";
      text = "buyer";
      if (!buyerReviewStatus && (dealStatus == 3 || dealStatus == 2)) {
        buttonshow = true;
      }
    }

    return (
      <React.Fragment>
        {dealStatus == 3 && <Button onClick={openPDF}>Invoice</Button>}
        {dealStatus != 3 && dealStatus != 2 && (
          <React.Fragment>
            <Button onClick={cancelDealDialog.bind(null, 2)}>
              Cancel Deal
            </Button>
            <div className="cancel-deal-button mr-3">
              {!isExchange && type == "seller" && (
                <>
                  <div className="text-success">Accepted offer</div>
                  {paymentStatus ? (
                    <div className="text-success">Payment escrowed</div>
                  ) : (
                    <div className="text-danger">Waiting for payment</div>
                  )}
                </>
              )}
            </div>
          </React.Fragment>
        )}
        {buttonshow && <Button onClick={handlerRating}>Rate {text}</Button>}
      </React.Fragment>
    );
  };

  const getButtons = (type) => {
    let {
      offerReplyUserId,
      offerId,
      assetDetail = {},
      offerType,
      initiated,
      isDealCancel,
      offerCancelled,
      isExchange,
      orderId,
      sellerReviewStatus,
      buyerReviewStatus,
      dealStatus,
    } = props.chatsData;
    let userId = getCookie("uid");
    let editOffer = offerReplyUserId == userId;
    // accept

    // console.log("sadasddad", props);
    if (
      assetDetail.statusCode != 6 &&
      !isDealCancel &&
      !offerCancelled &&
      !orderId
    ) {
      if (offerId && offerType == 1) {
        if (props.type == "shopping" || props.type == "exchangeSend") {
          return Payment();
        } else {
          return CancelDeal();
        }
      } else if (offerId && editOffer) {
        return EditOffers();
      } else if (offerId && !editOffer) {
        return AcceptsOffer();
      }
    }
    if (!offerId && !orderId && props.type == "shopping") {
      if (assetDetail.isNegotiable) {
        return (
          <Button onClick={openOfferDialog.bind(null, false)}>
            Make offer
          </Button>
        );
      } else {
        return (
          <Button
            onClick={() => {
              Router.push(
                `/payment?paymentType=${3}&sid=${assetDetail._id}`,
                `/payment/direct/${assetDetail._id}`
              );
            }}
          >
            Buy now
          </Button>
        );
      }
    }

    if (orderId) {
      return rating();
    }
    //  else if (initiated && type == 3) {
    //   return Payment();
    // } else if (initiated && type == 4) {
    //   return CancelDeal();
    // }
  };
  return (
    <div className="row">
      {getButtons(2)}
      <style jsx>{`
        :global(.cancel-deal-button > div) {
          font-size: 0.6rem !important;
        }
      `}</style>
    </div>
  );
};

export default Dialog(ChatButton);
