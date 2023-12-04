import React from "react";
import ChatHeader from "./chatHeader";
import ChatBody from "./chatBody";
import ChatFooter from "./chatFooter";
import {
  getChatMessages,
  ChangeReadCount,
  deleteChat,
  getProductDetails,
  setActiveChat,
} from "../../../redux/actions/chat/action";
import {
  sendAck,
  sendChatMessage,
  MessagePayload,
  textencode,
  blockUserPayload,
  sendBlockMessage,
} from "../../../lib/chat";
import { customAxios } from "../../../lib/request";
import {
  userStatus,
  userTypingStatus,
  subscribeTopic,
  unsubscribeTopic,
  sendTypeAck,
  userBlock,
} from "../../../lib/rxSubject";
import { MQTT_TOPIC } from "../../../lib/config";
import throttle from "lodash/throttle";
import defer from "lodash/defer";
import Contexthoc from "../../../hoc/context";
import {
  deleteChatService,
  blockChatUser,
  getblockChatUser,
} from "../../../services/chat";
import Router from "next/router";

import ChatContext from "../../../context/chat";
import moment from "moment";
import DialogHoc from "../../../hoc/chatDalogHoc";
import { LanguageSet } from "../../../translations/LanguageSet";
import { connect } from "react-redux";

// import { deleteChatDialog } from "../../utils/dialog";
import {
  close_dialog,
  open_dialog,
  Toast,
} from "../../../lib/global";
import { getCookie, getLocalStorage, removeLocalStorage } from "../../../lib/session";
import ConfirmDialog from "../../Drawer/confirmDialog";
class Chat extends React.Component {
  scrollHeight = 0;

  scrollContainer = null;
  ref = React.createRef(null);
  constructor(props) {
    super(props);
    this.state = {
      scrolling: true,
      paggingClose: false,
      chatData: props.chatData || {},
      online: undefined,
      typing: false,
      intialBottom: false,
      isUserblock: false,
      self: false,
      emptyChat: false,
      messageFatch: false,
      loadMore: false,
      vipChatCount: props.chatData.vipMessage,
      lang: LanguageSet[props.langCode || "en"]
    };
    let { chatData } = props;
    let clearTyping;

    // for online offline
    this.userStatusRxObject = userStatus.subscribe((data) => {
      this.setState((prevState) => {
        return {
          ...prevState,
          online: data.status,
        };
      });
      // console.log("usersttuassssss", data);
    });



    // user block
    this.userBlockRxObject = userBlock.subscribe((data) => {
      let opponentId =
        this.state.chatData.senderId == this.props.userData._id
          ? this.state.chatData.receiverId
          : this.state.chatData.senderId;
      // console.log("block user status", data, opponentId);
      if (data.from == opponentId) {
        this.setState((prevState) => {
          return {
            ...prevState,
            isUserblock: data.status == "block" ? true : false,
          };
        });
      }
      // console.log("usersttuassssss", data);
    });

    // typing
    this.userTypingStatusRXObject = userTypingStatus.subscribe((data) => {
      // console.log(
      //   "userTyping status",
      //   data,
      //   this.props.userData._id != data.to
      // );

      if (
        this.state.chatData &&
        this.props.userData._id &&
        this.props.userData._id != data.from &&
        this.state.chatData.chatId == data.secretId   //secretId chatId
      ) {
        this.setState((prevState) => {
          return {
            ...prevState,
            typing: true,
          };
        });
        clearTimeout(clearTyping);
        clearTyping = setTimeout(() => {
          this.setState((prevState) => {
            return {
              ...prevState,
              typing: false,
            };
          });
        }, 2000);
      }
    });

    this.onMessageTyping = throttle(this.onMessageTyping, 2000);
    this.handlerScroll = throttle(this.handlerScroll, 0);
  }
  gotoBottom = () => { };

  getscrollHeight = () => {
    return this.scrollContainer && this.scrollContainer.scrollHeight;
  };
  getclientHeight = () => {
    return this.scrollContainer && this.scrollContainer.clientHeight;
  };

  scrolledToBottom = () => {
    return (
      this.scrollContainer &&
      this.scrollContainer.clientHeight + this.scrollContainer.scrollTop ===
      this.scrollContainer.scrollHeight
    );
  };

  getSnapshotBeforeUpdate(prevProps, prevState) {
    const wasScrolledToBottom = this.scrolledToBottom();
    const scrollHeight = this.getscrollHeight();
    const clientHeight = this.getclientHeight();
    return {
      wasScrolledToBottom,
      scrollHeight,
      clientHeight,
    };
  }

  goToScroll = (top) => {
    this.scrollContainer &&
      (this.scrollContainer.scrollTo
        ? this.scrollContainer.scrollTo({
          top: top,
        })
        : (this.scrollContainer.scrollTop = top));
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    // console.log("componentDidUpdate", snapshot);
    let cid = this.props.cid;
    let chats = this.props.chats && this.props.chats;
    let Prevchats = prevProps.chats && prevProps.chats;

    if (
      chats.length !== Prevchats.length &&
      snapshot &&
      this.state.paggingClose
    ) {
      // console.log("[scroll] cs1 scroll to storing paging1", chats);
      const scrollHeight = this.getscrollHeight();
      this.goToScroll(scrollHeight - snapshot.scrollHeight);
      this.setState(
        (prevState) => {
          return {
            ...prevState,
            paggingClose: false,
            emptyChat: false,
          };
        },
        () => { }
      );
    } else if (chats.length !== Prevchats.length) {
      // console.log("[scroll] cs2 scroll to storing paging1");
      this.scrollToBottom();
    }

    // when new message came
    // if (
    //   chats &&
    //   Prevchats &&
    //   chats.length > 0 &&
    //   Prevchats.length > 0 &&
    //   chats[0].messageId != Prevchats[0].messageId
    // ) {
    //   // this.scrollToBottom();
    // }

    // when chat initialize

    // send read ack
    if (chats && chats.length > 0) {
      let lastMessage = chats[chats.length - 1];
      if (
        lastMessage.status != 3 &&
        lastMessage.senderId != this.props.userData._id
      ) {
        let reqPayload = {
          client_id: lastMessage.receiverId,
          chatId: this.props.chatData.chatId,
          senderId: lastMessage.receiverId,
          receiverId: lastMessage.senderId,
          status: 3,
          readTime: moment().valueOf(),
          assetId: this.state.chatData.chatId,
        };
        sendAck(reqPayload, this.props.dispatch);

        // console.log("send ack datasdhsdn", chats, this.props.changeReadStatus);
      } else if (!!this.state.chatData?.totalUnread && this.state.chatData?.status == 3) {
        let reqPayload = {
          client_id: getCookie('uid'),
          chatId: this.props.chatData.chatId,
          senderId: getCookie('uid'),
          receiverId: this.state.chatData.recipientId,
          status: 3,
          readTime: moment().valueOf(),
          assetId: this.state.chatData.chatId
        }
        sendAck(reqPayload, this.props.dispatch);
      }
    }
  }

  onMessageTyping = () => {
    let userId =
      this.state.chatData.senderId == this.props.userData._id
        ? this.state.chatData.receiverId
        : this.state.chatData.senderId;
    let secretId =
      this.state.chatData &&
      this.state.chatData.chatId;   //chatId
    sendTypeAck.next({
      from: this.props.userData._id,
      to: userId,
      secretId: secretId,
    });
  };
  handlerScroll = async (event) => {
    let element = document.getElementById("fanzly-chat-body");
    // element.scroll(element.scrollHeight * 2, 0);
    // console.log("scolly", element.scrollHeight);
    // console.log("scrollY ", this.ref.current.clientHeight);
    // console.log("offsetHeight ", element.offsetHeight);

    let chats = this.props.chats && this.props.chats;

    if (
      500 >= element.scrollTop &&
      this.state.scrolling &&
      chats &&
      chats.length > 0
    ) {
      let stateObjet = { ...this.state };
      stateObjet.scrolling = false;

      stateObjet.paggingClose = true;
      stateObjet.intialBottom = true;

      this.setState(
        (prevState) => {
          return {
            ...prevState,
            scrolling: false,
            intialBottom: true,
            paggingClose: true,
            loadMore: true,
          };
        },
        () => {
          let { getMessages, cid, type } = this.props;
          this.scrollHeight = element.scrollHeight;
          try {
            let lastMessage = chats[0];

            getMessages(
              getChatMessages({
                cid: cid,
                name: type,
                timestamp: lastMessage.createdAt,
              })
            );

            customAxios.interceptors.response.use(
              (response) => {
                if (response.config.url.includes("/messages")) {
                  // console.log("final response", response.data.data);
                  if (
                    response.status == 200 &&
                    typeof response.data.data.finalRes == "undefined"
                  ) {
                    this.setState((prevState) => {
                      return {
                        ...prevState,
                        scrolling: true,
                        loadMore: false,
                      };
                    });
                  } else {
                    this.setState((prevState) => {
                      return {
                        ...prevState,
                        paggingClose: false,
                        loadMore: false,
                      };
                    });
                  }
                }

                return response;
              },
              (e) => {
                return Promise.reject(e);
              }
            );
          } catch (e) {
            console.error("notification data", e);
          }
        }
      );
    }
  };

  checkUserBlocked = async () => {
    let userId =
      this.state.chatData.senderId == this.props.userData._id
        ? this.state.chatData.receiverId
        : this.state.chatData.senderId;
    try {
      let getBlockUser = await getblockChatUser(userId);
      let data = getBlockUser.data.data;
      // console.log("get User Block", getBlockUser);
      this.setState((prevState) => {
        return {
          ...prevState,
          isUserblock: data.blocked,
          self: data.self,
        };
      });
    } catch (e) {
      console.error("Get User Block", e, e.response);
    }
  };
  //delete it
  getProductData = (chat) => {
    if (chat.isExchange) {
      this.props.actionDispatch(getProductDetails(chat.exchangeAssetId));
    }
  };
  async componentDidMount() {
    // console.log("sadasddwdqwdad", this.props.chatData);

    // try {
    //   let data = await getPerticular(this.props.cid);
    //   console.log("getPerticular", data);
    // } catch (e) {}
    setTimeout(() => {
      subscribeTopic.next(MQTT_TOPIC.typ + "/" + this.props.userData._id);
      let element = document.getElementById("fanzly-chat-body");
      element && element.addEventListener("scroll", this.handlerScroll);
    }, 1000);

    let { getMessages, cid, type } = this.props;
    // console.log("sadasddwdqwdad", chat);
    cid && this.props.actionDispatch(setActiveChat(cid));

    if (Object.keys(this.props.chatData).length == 0) {
      let chatData = localStorage.getItem("chatData");
      if (chatData) {
        this.props.changeReadStatus(
          ChangeReadCount({
            key: type,
            chatId: cid,
          })
        );
        let chat = JSON.parse(chatData);

        if (chat.chatId != cid) {
          this.gotoChat();
        }

        this.getProductData(chatData);

        let messageFetch = false;
        if (chat.isNew) {
          messageFetch = true;
          let element = document.getElementById("chat-input");
          element && element.focus();
        }
        this.setState(
          {
            messageFatch: messageFetch,
            emptyChat: true,
            chatData: chat,
          },
          () => {
            this.checkUserBlocked();
            let userId =
              this.state.chatData.senderId == this.props.userData._id
                ? this.state.chatData.receiverId
                : this.state.chatData.senderId;

            setTimeout(() => {
              subscribeTopic.next(
                MQTT_TOPIC.blockUser + "/" + this.props.userData._id
              );
              !this.props.chat || this.props.chat.userList || this.props.chat.userList[userId] &&
                subscribeTopic.next(MQTT_TOPIC.OnlineStatus + "/" + userId);
            }, 1000);
          }
        );
      }
    } else {
      this.props.changeReadStatus(
        ChangeReadCount({
          key: type,
          chatId: cid,
        })
      );
      this.getProductData(this.props.chatData);
      this.checkUserBlocked();
      setTimeout(() => {
        let userId =
          this.state.chatData.senderId == this.props.userData._id
            ? this.state.chatData.receiverId
            : this.state.chatData.senderId;

        subscribeTopic.next(
          MQTT_TOPIC.blockUser + "/" + this.props.userData._id
        );
        subscribeTopic.next(MQTT_TOPIC.OnlineStatus + "/" + userId);
      }, 1000);
    }

    this.props.chats && Object.keys(this.props.chats).length > 19
      ? ""
      : getMessages(
        getChatMessages({
          cid: cid,
          name: type,
        })
      );

    this.scrollToBottom();
    defer(() => {
      this.scrollToBottom();
    });

    // customAxios.interceptors.response.use(
    //   (response) => {
    //     if (response.config.url.includes("/messages")) {
    //       this.setState({
    //         messageFatch: true,
    //       });
    //     }

    //     return response;
    //   },
    //   (e) => {
    //     return Promise.reject(e);
    //   }
    // );

    if (this.props.query?.p) {
      const vipChat = JSON.parse(getLocalStorage('vipChat')) || {}
      if (!this.state.vipChatCount && vipChat?.chatCount) {
        this.setState({ vipChatCount: vipChat?.chatCount })
      }
    }
  }

  scrollToBottom = () => {
    let element = document.getElementById("fanzly-chat-body");
    if (element) {
      element.scrollTop = element.scrollHeight + element.scrollTop;
    }
  };
  componentWillUnmount() {
    let element = document.getElementById("fanzly-chat-body");
    element && element.removeEventListener("scroll", this.handlerScroll);
    let { chatData } = this.props;
    try {
      // unsubscribeTopic.next(MQTT_TOPIC.OnlineStatus + "/" + this.props.userData._id);
      unsubscribeTopic.next(MQTT_TOPIC.typ + "/" + this.props.userData._id);
      if (this.userStatusRxObject) {
        this.userStatusRxObject.unsubscribe();
      }
      this.userTypingStatusRXObject.unsubscribe();

      this.userBlockRxObject && this.userBlockRxObject.unsubscribe();
    } catch (e) {
      console.error("rx unsubscribe error", userStatus);
    }
    removeLocalStorage('vipChat')
  }

  // deleteDialog = () => {
  //   this.props.open_dialog(
  //     "recoverWarningDialog",
  //     deleteChatDialog(this.deleteChatList, this.props.close_dialog)
  //   );
  // };

  deleteDialog = () => {
    open_dialog("DELETE_CHAT",
      this.deleteChatDialog(
        this.deleteChatList,
        close_dialog
      )
    )
  }

  deleteChatDialog = (success, cancel) => {
    return {
      title: "",
      subTitle: "Are you sure want to delete the chat?",

      button: [
        {
          class: "btn btn-default blueBgBtn",
          loader: true,
          text: "Yes",
          onClick: () => {
            success();
          },
        },
        {
          class: "btn btn-default blueBgBtn",
          text: "No",
          onClick: () => {
            cancel();
          },
        },
      ],
    };
  };

  blockUser = () => {
    open_dialog("deleteChatConfirm", {
      dialogTitle: "Block user",
      title1: "By blocking, user will not be allowed ",
      title2: "to send a message to you",
      b1Text: "Cancel",
      b2Text: "Block",
      dangerBtn: true,
      b2Click: async () => {
        let opponentId =
          this.state.chatData.senderId == this.props.userData._id
            ? this.state.chatData.receiverId
            : this.state.chatData.senderId;
        let requestPayload = {
          opponentUserId: opponentId,
          trigger: "BLOCK",
        };
        try {
          await blockChatUser(requestPayload)
            .then((res) => {
              Toast(res.data.message, "success");
            })
            .catch((e) => {
              console.error(e)
              Toast(
                e.response
                  ? e.response.data.message || e.response.data
                  : "Blocking Failed!",
                "error"
              );
            })
          let block = { ...blockUserPayload };

          block.to = opponentId;
          block.from = this.props.userData._id;
          block.status = "block";
          sendBlockMessage(block);
          this.setState(
            (prevState) => {
              return {
                ...prevState,
                isUserblock: true,
                self: true,
              };
            },
            () => {
              this.props.close_dialog("confirmDialog", {});
            }
          );
        } catch (e) {
          console.error("block issue", e, e.response);
        }
        // blockChatUser();
      },
    });

    // console.log("block user");
  };

  unBlock = () => {
    if (this.state.self) {
      open_dialog("deleteChatConfirm", {
        dialogTitle: "Unblock User",
        title1: "Unblock user to send a message",
        b1Text: "Cancel",
        b2Text: "Unblock",
        dangerBtn: false,
        b2Click: async () => {
          let opponentId =
            this.state.chatData.senderId == this.props.userData._id
              ? this.state.chatData.receiverId
              : this.state.chatData.senderId;
          let requestPayload = {
            opponentUserId: opponentId,
            trigger: "UNBLOCK",
          };
          try {
            await blockChatUser(requestPayload)
              .then((res) => {
                Toast(res.data.message, "success");
              })
              .catch((e) => {
                console.error(e)
                Toast(
                  e.response
                    ? e.response.data.message || e.response.data
                    : "Unblocking Failed!",
                  "error"
                );
              })
            let block = { ...blockUserPayload };
            // block.chatId = this.state.chatData.chatId;
            block.to = opponentId;
            block.from = this.props.userData._id;
            block.status = "unblock";
            sendBlockMessage(block);
            this.setState(
              (prevState) => {
                return {
                  ...prevState,
                  isUserblock: false,
                  self: false,
                };
              },
              () => {
                this.props.close_dialog("confirmDialog", {});
              }
            );
          } catch (e) {
            console.error("block issue", e, e.response);
          }
        },
      });
    } else {
      this.props.open_dialog("successOnly", {
        wraning: true,
        label: "You can't send a message to this user you're blocked.",
      });
    }
  };


  authenticateChatUser = (userStatus) => {
    if (userStatus === "SUSPENDED" || userStatus === "DELETED") {
      this.props.open_dialog("successOnly", {
        wraning: true,
        label: this.state.lang.isUserSuspendedOrDeletedText,
      });
      return true
    }
    return false
  }
  gotoChat = () => {
    Router.replace("/chat");
    // let type = this.props.type;
    // if (type == "shopping") {
    // Router.replace("/profile?type=message&p=shopping-message");
    // } else if (type == "sale") {
    //   Router.replace("/profile?type=message&p=sales-message");
    // } else if (type == "exchangeSend") {
    //   Router.replace("/profile?type=message&p=exchanage-send");
    // } else {
    //   Router.replace("/profile?type=message&p=exchange-recived");
    // }
  };
  deleteChatList = async () => {
    let type = this.props.type;
    let { chatId } = this.state.chatData;
    try {
      await deleteChatService({ chatId: chatId });
      Toast('All the chat history deleted successfully', 'info');
      this.props.deleteChat(deleteChat({ chatId: chatId, type }));
      close_dialog();
      Router.replace('/chat');
    } catch (e) {
      if (e.response) {
        Toast('Failed to delete chat history!', 'error')
        // Toast(e.response.data && e.response.data.message, "success");
      }
      close_dialog();
      console.error("delete chat list", e);
    }
  };

  sendMessage = (message, type = 1, extraPayload = {}, totalChats) => {

    let { userData, exchange } = this.props;
    let { chatData } = this.state;
    let SendMessage = { ...MessagePayload, ...extraPayload };
    let receiverId = chatData.senderId == userData._id
      ? chatData.receiverId
      : chatData.senderId;

    if (chatData) {
      // if (exchange) {
      //   SendMessage.exchangeAssetId = chatData.exchangeAssetId;
      //   SendMessage.isExchange = true;
      // }
      // if (this.props.type == "shopping" || this.props.type == "exchangeSend") {
      //   console.log("this is buyer");
      //   SendMessage.isBuyerMessage = true;
      // }
      // if(SendMessage){

      // }
      SendMessage.username = userData.username;
      // SendMessage.client_id = userData._id;
      SendMessage.senderId = userData._id;
      SendMessage.receiverId = receiverId;
      SendMessage.payload = textencode(message);
      // SendMessage.assetId = chatData.assetId;
      SendMessage.chatId = chatData.chatId;
      SendMessage.profilePic = userData.profilePic || "";
      SendMessage.messageType = parseInt(type) || 1;
      // SendMessage.topic = MQTT_TOPIC.Message + "/" + receiverId;
      SendMessage.isVipMessage = this.state.vipChatCount ? true : false
    }

    // console.log("[SendMessage]========== ===>", SendMessage)
    const isUserLastVipMessage = SendMessage.isVipMessage
    const isOpponentLastVipMessage = totalChats?.findLast(msj => getCookie("uid") === msj.receiverId)?.isVipMessage || false
    const isLastVipMessage = isUserLastVipMessage || isOpponentLastVipMessage || false
    SendMessage["isLastVipMessage"] = isLastVipMessage
    sendChatMessage(SendMessage);
    this.handleCheckVipMessage()
  };

  handleCheckVipMessage = () => {
    if (this.state.vipChatCount && this.state.vipChatCount > 0) {
      this.setState({ vipChatCount: this.state.vipChatCount - 1 })
    }

    let userId =
      this.state.chatData &&
        this.state.chatData.senderId == this.props.userData._id
        ? this.state.chatData.receiverId
        : this.state.chatData.senderId;

    if (this.state.vipChatCount === 1) {
      open_dialog("confirmDialog", {
        title: this.state.lang.vipMsgTitle,
        subtitle: this.state.lang.vipMsgSubTite,
        cancelT: this.state.lang.cancelT,
        submitT: this.state.lang.submitT,
        yes: () => setTimeout(() => {
          open_dialog("VIP_MESSAGE_POPUP", {
            userName: this.props.userData.username,
            chatId: this.state.chatData.chatId,
            isApplyPromo: true,
            applyOn: "VIP_PLAN",
            creatorId: userId,
            handleSubmit: (res) => {
              const chatCount = res.chatCount;
              this.setState({ vipChatCount: chatCount })
            },
          })
        }, 500)
      })
    }
  }

  render() {
    // console.log("chat bodyddydydshd", this.props, chatData);
    // let { imageUrl, description } = this.state.chatData.assetDetail;
    let { profilePic, userName, deliveredAt, userTypeCode, userStatus = "" } = this.state.chatData;
    let { chatData } = this.state;
    const validateChat = () => {
      let { chatData } = this.state;
      let { assetDetail = {} } = chatData;
      if (assetDetail.statusCode == 6 && chatData.dealStatus != 3) {
        return {
          block: true,
          message:
            this.props.type == "shopping" || this.props.type == "exchangeSend"
              ? "Oops.. This product is sold, try other products on Fanzly"
              : "Product has been sold",
        };
      } else if (assetDetail.statusCode == 5 && !chatData.orderId) {
        return {
          block: true,
          message:
            this.props.type == "shopping" || this.props.type == "exchangeSend"
              ? "Some other user has already bought this product, check out for alternative products on Fanzly"
              : "Product has been sold",
        };
      } else if (assetDetail.statusCode == 2) {
        return {
          block: true,
          message:
            this.props.type == "shopping" || this.props.type == "exchangeSend"
              ? "This product has been suspended due to some reason, try again later or check out other products !"
              : "Product has been suspended",
        };
      } else if (assetDetail.statusCode == 4) {
        return {
          block: true,
          message:
            this.props.type == "shopping" || this.props.type == "exchangeSend"
              ? "Oops.. This product has been removed, try try other products on Fanzly"
              : "Product has been deleted",
        };
      }

      // console.log(
      //   "sadsada",
      //   chatData.dealStatus,
      //   assetDetail.statusCode,
      //   assetDetail.statusCode == 6 && chatData.dealStatus != 3
      // );
      return {
        block: false,
        message: "",
      };
    };
    let userId =
      this.state.chatData &&
        this.state.chatData.senderId == this.props.userData._id
        ? this.state.chatData.receiverId
        : this.state.chatData.senderId;
    // let {} = this.props.chatData;

    return (
      <ChatContext.Consumer>
        {(data) => {
          return (
            chatData && (
              <div className="chat-screen position-relative w-100 h-100">
                {
                  <>
                    <ChatHeader
                      bulkMsgDetail={this.props.bulkMsgDetail}
                      groupChat={this.props.groupChat}
                      userName={userName}
                      profilePic={profilePic}
                      withChatUserId={userId}
                      userTypeCode={userTypeCode}
                      online={data?.chat.userList[userId]}
                      sendMessage={this.sendMessage}
                      deleteChatList={this.deleteDialog}
                      blockUser={this.blockUser}
                      unBlock={this.unBlock}
                      isUserblock={this.state.isUserblock}
                      self={this.state.self}
                      typing={this.state.typing}
                      type={this.props.type}
                      chatData={chatData}
                      validateChat={validateChat()}
                      reduxData={chatData}
                      hideEmoji={this.chatFooterRef}
                      vipChatCount={this.state.vipChatCount}
                      userData={this.props.userData}
                      handleChangeVipMessageCount={(count) => {
                        this.setState({ vipChatCount: count })
                      }}
                      bulkMsgListRef={this.props.bulkMsgListRef}
                      authenticateChatUser={this.authenticateChatUser}
                      isUserSuspendedOrDeleted={["SUSPENDED", "DELETED"].includes(userStatus)}
                    />

                    <ChatBody
                      bulkMsgDetail={this.props.bulkMsgDetail}
                      bulkMsgDetailRef={this.props.bulkMsgDetailRef}
                      groupChat={this.props.groupChat}
                      messageFatch={this.state.messageFatch}
                      isUserblock={this.state.isUserblock}
                      self={this.state.self}
                      productData={
                        (this.props.chatData.exchangeAssetId &&
                          this.props.chat &&
                          this.props.chat.productData &&
                          this.props.chat.productData[
                          this.props.chatData.exchangeAssetId
                          ]) ||
                        {}
                      }
                      loadMore={this.state.loadMore}
                      exchange={this.props.exchange ? this.props.exchange : false}
                      type={this.props.type}
                      id={"fanzly-chat-body"}
                      ref={this.ref}
                      reduxData={this.props.chatData}
                      childRef={(ref, scrollContainer) => {
                        this.childRef = ref;
                        this.scrollContainer = scrollContainer.current;
                      }}
                      key="fanzlybody"
                      userData={this.props.userData}
                      chat={this.props.chats ? this.props.chats : []}
                      chatsData={chatData}
                      typing={false}
                      unBlock={this.unBlock}
                      validateChat={validateChat()}
                      authenticateChatUser={this.authenticateChatUser}
                    />
                    <ChatFooter
                      bulkMsgDetail={this.props.bulkMsgDetail}
                      groupChat={this.props.groupChat}
                      chat={this.props.chats ? this.props.chats : []}
                      unBlock={this.unBlock}
                      isUserblock={this.state.isUserblock}
                      self={this.state.self}
                      chatType={this.props.type}
                      chatsData={chatData}
                      userData={this.props.userData}
                      sendMessage={this.sendMessage}
                      scrollToBottom={this.scrollToBottom}
                      onMessageTyping={this.onMessageTyping}
                      chatFooterRef={(ref) => this.chatFooterRef = ref}
                      validateChat={validateChat()}
                      authenticateChatUser={this.authenticateChatUser}
                      isUserSuspendedOrDeleted={["SUSPENDED", "DELETED"].includes(userStatus)}
                    />
                  </>
                }
                <div className="chat-input"></div>
              </div>
            )
          );
        }}
      </ChatContext.Consumer>
    );
  }
}
const mapStateToProps = (store) => {
  return {
    langCode: store?.language,
  };
};

export default connect(mapStateToProps)(Contexthoc(DialogHoc(Chat)));
