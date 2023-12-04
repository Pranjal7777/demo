import React, { useEffect, useState, useRef, createRef } from "react";
import Text from "./chatTile/simpleText";
import AcceptOffer from "./chatTile/offerAccept";

// Bulk Message
import BulkMsgMedia from "./chatTile/bulkMsgMedia";
import LockedMsgMedia from "./chatTile/lockedMsgMedia";

import {
  WHITE,
  LIGHT_GRAY,
  color6,
  EXCHANGE_ICON,
  EMPTY_CHAT_PLACEHOLDER,
  PRIMARY,
  DIAMOND_COLOR,
  VIDEO_CALL_ICON,
} from "../../lib/config";
import Img from "./chatTile/images";
import HtmlImg from "../ui/Img/Img";
import Video from "./chatTile/video";

// import ProductImage from "../productImagechat/productImage";
// import ChatLoader from "../ui/loader/chatLoader";
import Loader from "../ui/loader/chatLoader";
// import Location from "./chatTile/location";
import ChatLightBox from "./chatLightBox/chatLightBox";
// import Buttons from "./chatButtons/chatButtons";
import Document from "./chatTile/document";
import PaymentMessage from "./chatTile/paymentMessage";
import DealConfirm from "./chatTile/dealConfirm";
import Route from "next/router";
import { getCookie } from "../../lib/session";
import { useTheme } from "react-jss";
import Icon from "../image/icon";
import NextImage from "../image/NextImage";
import Button from "../button/button";
import MuiButton from "../button/MuiButton";
import { open_drawer } from "../../lib/global";
const open_dialog = "";

const chatType = (
  messages,
  index,
  profilePic,
  userData,
  handlerLightBox,
  type,
  productData = {},
  assetDetail = {},
  chatId,
  isUserblock
) => {
  const uid = getCookie("uid");

  switch (messages.messageType?.toString()) {
    case "1":
      return (
        <Text
          index={index}
          key={messages.messageId}
          profilePic={profilePic}
          user={messages && messages.senderId == userData._id}
          message={messages && messages}
          isVipMessage={messages && messages.isVipMessage}
        />
      );
    case "2":
      return (
        <Img
          index={index}
          key={messages.messageId}
          profilePic={profilePic}
          user={messages && messages.senderId == userData._id}
          message={messages && messages}
          isVipMessage={messages && messages.isVipMessage}
          onClick={(url, type) => {
            handlerLightBox({
              type: type,
              open: true,
              url: url,
            });
          }}
        />
      );
    case "3":
      return (
        <Video
          index={index}
          key={messages.messageId}
          profilePic={profilePic}
          user={messages && messages.senderId == userData._id}
          message={messages && messages}
          isVipMessage={messages && messages.isVipMessage}
          onClick={(url, type) => {
            handlerLightBox({
              type: type,
              open: true,
              url: url,
            });
          }}
        />
      );
    case "4":
      return (
        <div></div>
        // <Location
        //   index={index}
        //   key={messages.messageId}
        //   profilePic={profilePic}
        //   user={messages && messages.senderId == userData._id}
        //   message={messages && messages}
        // ></Location>
      );
    case "10":
      return (
        <Document
          type={type}
          index={index}
          key={messages.messageId}
          profilePic={profilePic}
          user={messages && messages.senderId == userData._id}
          message={messages && messages}
          isVipMessage={messages && messages.isVipMessage}
        />
      );
    case "12":
      return (
        <Offer
          index={index}
          key={messages.messageId}
          profilePic={profilePic}
          user={messages && messages.senderId == userData._id}
          message={messages && messages}
        />
      );
    case "15":
      return (
        <Offer
          index={index}
          key={messages.messageId}
          profilePic={profilePic}
          user={messages && messages.senderId == userData._id}
          message={messages && messages}
        />
      );
    case "13":
      return (
        <AcceptOffer
          type={type}
          index={index}
          key={messages.messageId}
          profilePic={profilePic}
          user={messages && messages.senderId == userData._id}
          message={messages && messages}
        />
      );
    case "21":
      return (
        <DealConfirm
          type={type}
          index={index}
          key={messages.messageId}
          profilePic={profilePic}
          user={messages && messages.senderId == userData._id}
          message={messages && messages}
        />
      );
    case "16":
      return (
        <PaymentMessage
          type={type}
          index={index}
          key={messages.messageId}
          profilePic={profilePic}
          user={messages && messages.senderId == userData._id}
          message={messages && messages}
        />
      );
    // case "18":
    //   return (
    //     <BulkMsgMedia
    //       type={type}
    //       index={index}
    //       key={messages.messageId}
    //       profilePic={profilePic}
    //       user={messages && messages.senderId == userData._id}
    //       message={messages && messages}
    //     />
    //   );
    case "19":
    case "LOCKED_POST":
      return (
        <LockedMsgMedia
          index={index}
          key={messages.messageId}
          profilePic={profilePic}
          user={messages && messages.senderId == userData._id}
          message={messages && messages}
          chatId={chatId}
          isUserblock={isUserblock}
        />
      );
    case "20":
      return (
        <BulkMsgMedia
          type={type}
          index={index}
          key={messages.messageId}
          profilePic={profilePic}
          user={messages && messages.senderId == userData._id}
          message={messages && messages}
          isUserblock={isUserblock}
        />
      );
    case "17":
      return (
        <div></div>
        // <ExchnageCard
        //   index={index}
        //   key={messages.messageId}
        //   profilePic={profilePic}
        //   user={messages && messages.senderId == userData._id}
        //   message={messages && messages}
        //   productData={productData}
        //   assetDetail={assetDetail}
        // ></ExchnageCard>
      );
    default:
      return (
        <Text
          index={index}
          key={messages.messageId}
          profilePic={profilePic}
          user={messages && messages.senderId == userData._id}
          myText={messages && messages.senderId == uid}
          message={messages && messages}
          isVipMessage={messages && messages.isVipMessage}
        />
      );
  }
};

const ChatBody = (props) => {
  const theme = useTheme();
  // console.log('props - chatBody', props)
  let { productData = {}, validateChat } = props;
  const userType = getCookie("userType");
  const [LB, handlerLightBox] = useState({
    type: "",
    open: false,
  });
  let { assetDetail, profilePic, userName, userStatus = "" } = props.chatsData;
  let { lastOfferAmount } = props.reduxData;
  const refs = useRef({});
  const scrollContaner = useRef(null);
  refs.current = {};

  const addToRefs = (el, index) => {
    if (el && !refs.current[index]) {
      refs.current[index] = el;
    }
  };

  useEffect(() => {
    props.childRef(refs, scrollContaner);
  }, []);

  const handleClickVipPlans = () => {
    if (props.authenticateChatUser(userStatus)) return
    if (props.vipChatCount) return;
    // purchase plan here
    if (props.isUserblock) {
      return props.unBlock();
    } else {
      return open_drawer("VIP_MESSAGE_POPUP", {
        handleSubmit: (res) => {
          handleAfterPlanPurchase(res);
        },
        userName: props.userName,
        chatId: props.chatsData?.chatId,
        creatorId: props.chatsData?.recipientId,
      },
        "bottom"
      );
    }
  };

  const handleAfterPlanPurchase = (res) => {
    const chatCount = res.chatCount;
    props.handleChangeVipMessageCount?.(chatCount);
  };

  // console.log("this.props.userData" , this.props)
  const getChatTile = () => {
    if (props.type == "exchangeSend" || props.type == "exchangeRecived") {
      return productData.title || productData.image ? (
        <div className="row m-0 align-items-center">
          <div
            className="row m-0 align-items-center cursorPtr"
            onClick={() => {
              assetDetail &&
                assetDetail.title &&
                Route.push(
                  `/product/${assetDetail.title.replace(" ", "-")}/${assetDetail._id
                  }`
                );
            }}
          >
            {/* <ProductImage
              src={(assetDetail && assetDetail.imageUrl) || ""}
            ></ProductImage> */}

            <h1 className="mb-1 w-500 exchnage-line-clamp">
              {assetDetail && assetDetail.title}
            </h1>
          </div>
          <div className="product-image">
            <HtmlImg
              className="roted-exchnage-image"
              src={EXCHANGE_ICON}
            ></HtmlImg>
          </div>
          <div
            className="row m-0 align-items-center cursorPtr"
            onClick={() => {
              productData &&
                productData.title &&
                Route.push(
                  `/product/${productData.title.replace(" ", "-")}/${productData._id
                  }`
                );
            }}
          >
            <h1 className="mb-1 mr-2 w-500 exchnage-line-clamp">
              {productData && productData.title}
            </h1>
            {/* <ProductImage
              src={(productData && productData.image) || ""}
            ></ProductImage> */}
          </div>
        </div>
      ) : (
        <div></div>
      );
    } else {
      return (
        <div
          className="row m-0 align-items-center cursorPtr"
          onClick={() => {
            assetDetail &&
              assetDetail.title &&
              Route.push(
                `/product/${assetDetail.title.replace(" ", "-")}/${assetDetail._id
                }`
              );
          }}
        >
          {/* <ProductImage
            src={(assetDetail && assetDetail.imageUrl) || ""}
          ></ProductImage> */}
          <div className="ml-3">
            <h1 className="mb-1 w-500">{assetDetail && assetDetail.title}</h1>
            <div>
              Last Offer : &nbsp;
              <span className="text-color-black">
                {(assetDetail &&
                  assetDetail.units &&
                  assetDetail.units.symbol) +
                  " " +
                  (assetDetail && (lastOfferAmount || assetDetail.price))}
              </span>
            </div>
          </div>
        </div>
      );
    }
  };

  let chat = props.chat ? props.chat : [];
  // console.log("chat dtaata", props);
  return (
    <React.Fragment>
      <ChatLightBox
        open={LB.open}
        url={LB.url}
        userType={userType}
        type={LB.type}
        close_dialog={() => {
          handlerLightBox({
            ...LB,
            open: false,
          });
        }}
        refs={(open_dialog) => {
          // console.log("open_dialog_sadhuasdsa", open_dialog);
          open_dialog = open_dialog;
        }}
      />
      {/* {props.chatLoading ? 
      <div className="d-flex w-100" style={{position:"absolute",zIndex:"2",justifyContent:"center"}}>
          <Loader
            className="m-0"
            loading={true}
            size={30}
            color={WHITE}
          ></Loader>
      </div> : null} */}
      {/* <div className="chat-body-header">
        <div className="row m-0 chat-body-assets pl-0  h-100 align-items-center justify-content-between">
          {getChatTile()}
          <div className="row">
            {assetDetail && !validateChat.block && (
              <Buttons
                isUserblock={props.isUserblock}
                self={props.self}
                unBlock={props.unBlock}
                type={props.type}
                chatsData={props.reduxData}
              ></Buttons>
            )}
          </div>
        </div>
      </div> */}
      <div className="chat-body " ref={props.ref} style={{ background: theme.type === 'light' ? "var(--l_dialog)" : "" }}>
        {props.loadMore && (
          <div className="d-flex circle-loader w-100  like-view-circle-icon  justify-content-center align-items-center">
            <Loader
              className="m-0"
              loading={true}
              size={15}
              color={WHITE}
            ></Loader>
            {/* <i className="fa fa-circle-o-notch fa-spin"></i> */}
          </div>
        )}

        {/* <div className="background-blur-chat"></div> */}
        <div id={props.id} ref={scrollContaner}>
          {props.userTypeCode != 1 ? (
            <>
              <div className="p-2 vip_msg_plan">
                <div className="d-flex align-items-center py-1 vip_chat_count fntSz12">
                  <NextImage
                    href={DIAMOND_COLOR}
                    width={26}
                    height={16}
                    className="mr-1"
                    alt="Vip chat user icon"
                  />
                  <span className="text-uppercase">VIP MESSAGES :</span>
                  <span className="text-danger px-1">
                    {props.vipChatCount || "0"} Left
                  </span>
                  <MuiButton
                    className="ml-auto"
                    type="button"
                    disabled={props.vipChatCount}
                    onClick={handleClickVipPlans}
                    style={{
                      color: `${theme.type === 'light' ? theme.palette.l_app_text : theme.palette.d_app_text}`,
                      borderColor: `${theme.type === 'light' ? theme.palette.l_app_text : theme.palette.d_app_text}`,
                      borderRadius: "25px",
                      padding: "0px 20px",
                    }}
                  >
                    Buy
                  </MuiButton>
                </div>
                {/* <div className="col-12 my-2">
                  <button className="col-12 dv_videoCall_Btn py-1 white d-flex justify-content-center align-items-center">
                    <Icon
                      color={theme.l_app_text}
                      icon={`${VIDEO_CALL_ICON}#Icon_ionic-ios-videocam`}
                      viewBox="0 0 15.941 12.941"
                      alt="video-call-icon"
                    />
                    <div className="pl-3">
                        Start Video Call
                    </div>
                  </button>
                </div> */}
              </div>
            </>
          ) : (
            <></>
          )}
          {chat.map((messages, index) => {
            return (
              <div
                key={messages.messageId}
                ref={(el) => {
                  addToRefs(el, messages.messageId);
                }}
                id={`message_${messages.messageId}`}
              >
                {chatType(
                  messages,
                  index,
                  profilePic,
                  props.userData,
                  handlerLightBox,
                  props.type,
                  productData,
                  props.reduxData.assetDetail,
                  props.chatsData.chatId,
                  props?.isUserblock
                )}
              </div>
            );
          })}

          {props.chat && props.chat.length == 0 && (
            <div className="d-flex justify-content-center align-items-center flex-column placeholder-div ">
              {/* <HtmlImg src={EMPTY_CHAT_PLACEHOLDER}></HtmlImg> */}
              <Icon
                icon={`${EMPTY_CHAT_PLACEHOLDER}#No_chat`}
                color={theme.palette.l_base}
                width={104}
                height={110}
                viewBox="0 0 95.675 95.674"
              />
              <div
                className="placeholder-text  mt-3 text-center text-color-blue w-500 "
                style={{ fontSize: "0.8rem", maxWidth: "320px" }}
              >
                This is the beginning of your chat with{" "}
                <span className="w-700">'{userName}'</span>, please start a chat
                by entering some text below
              </div>
            </div>
          )}

          {/* {props.typing && (
            <div className="text-left chat-loader ml-auto">
              <ChatLoader loading={props.typing}></ChatLoader>
            </div>
          )} */}
        </div>

        {/* <Text></Text>
      <Text user></Text>
      <Text></Text>
      <Text user></Text>
      <Text></Text>
      <Text user></Text>
      <Text></Text>
      <Text user></Text> */}
        {/* <Offer></Offer>
      <Offer user></Offer>
      <ExchnageCard></ExchnageCard> */}
      </div>{" "}
      <style jsx>{`
				.background-blur-chat {
					position: absolute;
					left: 0px;
					top: 0px;
					border-bottom-left-radius: 7px;
					border-bottom-right-radius: 7px;
					background-color: rgba(0, 0, 0, 0.3);
					height: 100%;
					width: 100%;
					z-index: 1;
				}
				.circle-loader {
					font-size: 1rem;
					color: ${PRIMARY};
					font-size: 1.4rem;
					width: fit-content !important;
					height: fit-content;
					position: absolute;
					top: ${props.userTypeCode != 1 ? "50px" : "10px"};
					left: 45%;
					box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.1);
					padding: 6px !important;
					border-radius: 100%;
				}
				.chat-body-header {
					margin-top: 4px;
					background-color: ${color6} !important;
					height: 73px;
					overflow: hidden;
				}
				:global(.chat-loader > div) {
					text-align: left !important;
				}
				:global(.chat-body-assets > div > product-image-chat) {
					width: 35px !important;
					height: 25px !important;
				}
				:global(.exchnage-line-clamp) {
					max-width: 110px;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					overflow: hidden;
					line-height: 16px;
				}
				.placeholder-div {
					position: absolute;
					bottom: 1px;
					left: 0px;
					width: 100%;
					padding: 23px;
					top: 0;
					z-index: 1;
					background-color: ${theme.type == "light" ? "#f1f1f1" : theme.background};
				}
				:global(.roted-exchnage-image) {
					transform: rotate(90deg) !important;
					margin: 0px 16px;
				}
				.chat-body {
					position: relative;
					height: calc(100% - 130px);
					background-color: ${theme.type === "light"
          ? theme.palette.l_app_bg
          : theme.palette.d_app_bg
        } 
					display: flex;
					flex-direction: column;
					margin-top: 70px;
				}
				:global(.chat-body-assets > div > div > h1, .chat-body-assets
						> div
						> div
						> div) {
					font-size: 0.75rem !important;
				}

				.chat-body-header {
					padding: 5px 25px;
				}
				.chat-body-assets {
					padding: 5px 10px !important;
					border-radius: 2px;
				}

				:global(.chat-body-assets > div > div > h1) {
					font-weight: 600;
				}
				:global(.chat-body-assets > div > div > div) {
					color: ${LIGHT_GRAY};
					font-weight: 600;
					font-size: 0.65rem !important;
				}

				.chat-body-assets {
					display: flex;
					align-items: center;
				}
				.chat-body > div {
					// display: flex;
					// flex-direction: column-reverse;
					// flex-grow: 1;
					padding: ${props.userTypeCode != 1 ? "4rem" : "2rem" } 1.2rem 1.2rem 1.2rem;
					overflow-y: auto;
          overflow-x: hidden;
          max-height: calc(100% - 11px);
				}
				.vip_msg_plan {
					background: ${theme.type === "light" ? "#f1f2f6" : theme.palette.d_app_bg};
					position: fixed;
					top: 4.3em;
					width: 100%;
					left: 0;
					right: 0;
					z-index: 10;
				}
				:global(.MuiButton-root.Mui-disabled) {
					color: #6946ec66 !important;
					border-color: #6946ec66 !important;
				}
        .dv_videoCall_Btn {
          border: none;
          background: ${theme.appColor};
          border-radius: 10px;
        }
			`}</style>
    </React.Fragment>
  );
};
export default ChatBody;
