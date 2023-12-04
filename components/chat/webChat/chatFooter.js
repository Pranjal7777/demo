import Button from "../../ui/dialogButton/dialogButton";
import {
  MQTT_TOPIC,
  EMPTY_CHAT_PLACEHOLDER,
  PRIMARY,
  IMOGI,
  SEND_REVIEW,
  CHAT_BEEP,
  WHITE,
  RED,
} from "../../../lib/config";

import { Picker } from "emoji-mart";
import Img from "../../ui/Img/Img";
import React, { useState, useRef, useEffect } from "react";
// import { MessagePayload, sendChatMessage, textencode } from "../../utils/chat";
// import { fileUpload } from "../../services/chat";
import dialog from "../../../hoc/chatDalogHoc";
import { useTheme } from "react-jss";
import Icon from "../../image/icon";
import { getCookie } from "../../../lib/session";
// import { handleImageUpload } from "../../utils/chat";
// import { Toast } from "../../utils/eventEmiter";
// import ChatShare from "../Dialog/chatShare/chatShare";
// import ChatDrawer from "./chatShare/chatShareDrawer";
const ChatFooter = (props) => {
  const theme = useTheme();
  // let videoSelectDialog = () => {
  //   video && video.current.click();
  // };

  const { validateChat, bulkMsgDetail, chat } = props;
  const { assetDetail = {}, userName, userStatus = "" } = props.chatsData;
  const [input, setInput] = useState("");
  const [showPicker, togglePicker] = useState(false);
  React.useEffect(() => {
    props.chatFooterRef(hideImoji);
  });
  // console.log("chat footer", props);
  // let { chatsData } = props;
  // let { userData } = props;
  // let sendMessage = (message, type = 1) => {
  //   let receiverId =
  //     chatsData.senderId == userData._id
  //       ? chatsData.receiverId
  //       : chatsData.senderId;
  //   if (chatsData) {
  //     MessagePayload.username = userData.username;
  //     MessagePayload.client_id = userData._id;
  //     MessagePayload.senderId = userData._id;
  //     MessagePayload.receiverId = receiverId;
  //     MessagePayload.payload = textencode(message);
  //     MessagePayload.assetId = chatsData.assetId;
  //     MessagePayload.chatId = chatsData.chatId;
  //     MessagePayload.userImage = userData.profilePic || "";
  //     MessagePayload.messageType = type.toString();
  //     MessagePayload.topic = MQTT_TOPIC.Message + "/" + receiverId;
  //     console.log("PublishMessage", MessagePayload);
  //   }

  //   sendChatMessage(MessagePayload);
  //   // EventEmitter.dispatch("onMessage", MessagePayload);
  // };

  // const fileUpload = (url, type) => {
  //   if (type == "image") {
  //     url &&
  //       url.map((link) => {
  //         sendMessage(link, 2);
  //       });
  //   } else if (type == "video") {
  //     url &&
  //       url.map((link) => {
  //         sendMessage(link, 3);
  //       });
  //   }
  // };

  const hideImoji = () => {
    togglePicker(false);
  };

  const setInDiv = (email) => {
    document.getElementById("chat-input").innerText =
      document.getElementById("chat-input").innerText + email;
  };

  const sendMessages = (e) => {
    // const isLastVipMessage = chat.filter(message => message.senderId !== uid).slice(-1)[0]?.isVipMessage
    e && e.preventDefault();
    if (input.trim() != "") {
      var audio = document.getElementById("audio");
      audio.play();
      props.sendMessage(input.trim(), 1, {}, chat);
    }
    props.scrollToBottom();
    setInput("");
    document.getElementById("chat-input").innerText = "";
    togglePicker(false);
  };

  const handleEnterPress = (e) => {
    if (e.key !== "Enter") return
    e.preventDefault()
    sendMessages()
    setInput("")
  }
  // console.log('submit data', props);
  return (
    <React.Fragment>
      {
        !bulkMsgDetail &&
        <form className="d-flex align-items-center write-review-block mb-0 ">
          {/* <div className="d-flex justify-content-center align-items-center h-100 flex-column ">
          <Img src={EMPTY_CHAT_PLACEHOLDER}></Img>
          <div
            className="placeholder-text  mt-3 text-center text-color-blue w-500"
            style={{ fontSize: "0.8rem", maxWidth: "320px" }}
          >
            This is the beginning of your chat with{" "}
            <span className="w-700">{userName}</span>, please start a chat by
            entering some text below
          </div>
        </div> */}

          {validateChat && validateChat.block ? (
            <div className="product-sold-text">{validateChat.message}</div>
          ) : (
            <>
              <div className="input-review-block">
                <div className="position-relative">
                  <div className="imogi-block">
                    {showPicker && (
                      <div
                        tabIndex="-1"
                        onKeyDown={(e) => {
                          // console.log(e);
                          if (e.keyCode == 13) {
                            togglePicker(false);
                            sendMessages();
                          }
                        }}
                        style={{ position: "absolute", bottom: "125%" }}
                      >
                        <Picker
                          onClick={(imogi) => {
                            setInput(input + imogi.native);
                            setInDiv(imogi.native);
                          }}
                          color={PRIMARY}
                          showPreview={false}
                          showSkinTones={false}
                        />
                      </div>
                    )}
                    <Img
                      className="cursorPtr"
                      src={IMOGI}
                      onClick={() => {
                        if (props.authenticateChatUser(userStatus)) return;
                        props.isUserblock
                          ? props.unBlock()
                          : togglePicker(!showPicker);
                      }}
                    />
                  </div>
                  <div
                        className={props.isUserblock || props.isUserSuspendedOrDeleted ? "cursorPtr" : ""}
                    onClick={
                      (e) => {
                        if (props.authenticateChatUser(userStatus)) return;
                        props.isUserblock
                          ?
                          (props.unBlock(),
                            e.stopPropagation())
                          : {}
                      }
                    }
                  >
                    <div
                          contentEditable={!props.isUserSuspendedOrDeleted && !props.isUserblock}
                      disabled={props.isUserblock}
                      type="text"
                      id="chat-input"
                      autoComplete="off"
                      onFocus={() => {
                        togglePicker(false);
                      }}

                      value={input}
                      placeholder="Type your message.."
                      onKeyPress={handleEnterPress}
                      onInput={(e) => {
                        props.onMessageTyping(e);
                        setInput(e.currentTarget.innerText);
                      }}
                      className="input-review w-100 form-input"
                    ></div>
                  </div>
                </div>
              </div>

              <div
                className="send-button"
                onClick={
                  (e) => {
                    if (props.authenticateChatUser(userStatus)) return;
                    props.isUserblock
                      ?
                      (props.unBlock(),
                        e.stopPropagation())
                      : {}
                  }
                }
              >
                <Button
                      disabled={props.isUserblock || props.isUserSuspendedOrDeleted}
                  type="submit"
                  clickHandler={sendMessages}
                  classes="send-review-button"
                >
                  <Icon
                    icon={`${SEND_REVIEW}#send_review`}
                    size={40}
                    color={theme.palette.l_base}
                    viewBox="0 0 39.54 39.535"
                  />
                  {/* <Img className="send-review-icon" height="50px" src={SEND_REVIEW}></Img> */}
                </Button>
                <audio id="audio" src={CHAT_BEEP}></audio>
              </div>
            </>
          )}
        </form>
      }
      <style jsx>{`
    .chat-cat-lable{
      font-size: 0.7rem;
      font-weight: 500;
    }

    .product-sold-text{
      color:${WHITE};
      font-size:0.9rem;
    }
     .attechment-pin {
       position: absolute;
       top: 7px;
       right: 16px;
     }
     .imogi-block {
       position: absolute;
       top: 50%;
      left: 10px;
      transform: translateY(-50%)
      //  top: 7px;
      //  left: 10px;
     }
     :global(.send-review-icon) {
       height: 40px;
       cursor: pointer;
     }
    
     .write-review-block {
       padding: 0rem 2rem;
       background-color: ${validateChat && validateChat.block
          ? RED
          : theme.type === "light"
            ? theme.palette.l_app_bg
            : theme.palette.d_app_bg
        };
       -webkit-box-shadow: 0px 0px 8px -6px rgba(0, 0, 0, 0.75);
       -moz-box-shadow: 0px 0px 8px -6px rgba(0, 0, 0, 0.75);
       box-shadow: 0px 0px 8px -6px rgba(0, 0, 0, 0.75);
       border-bottom-left-radius: 5px;
       border-bottom-right-radius: 5px;
       position: absolute;
       bottom: 0px;
       width: 100%;
       height: 60px;
       z-index:1;
       margin-bottom: 7px !important;
     }
     :global(.write-review-block .send-review-button) {
       background-color: ${theme.type === "light"
          ? theme.palette.l_app_bg
          : theme.palette.d_app_bg
        } !important;
       border: none;
       border-radius: 100%;
     }
     :global(.send-review-button:disabled) {
      //  background-color: ${theme.palette.l_app_bg} !important;
       border: none;
       opacity: 0.5;
     }
     .input-review-block {
       flex: 1;
       margin-right: 1.5rem;
     }
     .chat-category>div{
       margin-right:20px;

     }
     .write-review-block .input-review {
      border-radius: 100px !important;
       border: 1px solid ${theme?.type === "light" ? "black" : theme?.palette?.d_input_bg
        };
       padding-left: 44px !important;
       background-color: ${theme?.type === "light" ? "#f1f2f6" : theme?.palette?.d_input_bg
        };
       min-height: 40px !important;
       max-height: 70px !important;
       overflow-y: auto;
       box-shadow: none !important;
       padding-top:6px;
       word-break: break-word;
       padding-right: 10px;
     }
     .input-review:placeholder {
       color: #ebebeb !important;
     }

     .input-review ::-webkit-scrollbar-track {
      background: #ffffff00 !important;
    }

    .input-review ::-webkit-scrollbar-thumb {
      background: #ffffff00 !important;
    }

   .input-review:placeholder {
     color: #ebebeb !important;
   }
   
   `}</style>
    </React.Fragment>
  );
};

export default dialog(ChatFooter);
