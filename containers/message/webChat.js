// // library import
// import React, { Component } from 'react';
// import { SEDAN_CAR, PROFILE_IMAGE ,HUMBERGER_ICON} from "../../lib/config";
// import * as env from '../../../Environment';
// import SalesMessageTIle from '../../../components/chatListTile/salesMessageTile';
// import Chat from '../../../components/chat/chat';
// import Route from 'next/router';
// import { getChatList } from '../../../store/reducer/chat/action';
// import customAxios from 'customAxios';
// import NoChat from '../noChat/noChat';
// import OrderShimmer from '../../../components/skeletonui/order';
// const chatType = 'sale';

// library import
import React, { Component } from "react";
import { SEDAN_CAR, PROFILE_IMAGE, HUMBERGER_ICON } from "../../lib/config";
import * as env from "../../lib/config";
import SalesMessageTIle from "../../components/chatListTile/MessageTile";
import UserTile from "../../components/chatListTile/UserTile";
import Chat from "../../components/chat/webChat/chat";
import Route from "next/router";
import { getChatList } from "../../redux/actions/chat/action";
import { getCookie, getLocalStorage } from "../../lib/session";
import { customAxios } from "../../lib/request";
import NoChat from "./noChat";
import OrderShimmer from "../../components/skeletonui/order";
import FigureImage from "../../components/image/figure-image";
import {
  authenticate,
  open_drawer,
  sleep,
  startLoader,
  startPageLoader,
  stopLoader,
  stopPageLoader,
} from "../../lib/global";
import PullToRefresh from "react-simple-pull-to-refresh";
import Tab from "../../components/tabs/tabs-web";
import { useSelector } from "react-redux";
import { onlineOfflineStatus } from "../../lib/chat";
const chatType = "sale";
import { palette } from "../../lib/palette";
import { connect } from "react-redux";
import BulkMessageUI from "./bulkMessageUI";
import UpdateListTile from "../../components/appUpdateBot/UpdateListTile";
import UpdateBot from "../../components/appUpdateBot/UpdateBot";
import { sendUpdatesAcknowledge } from "../../services/chat";
import { setUpdateAcknowledgementStatus } from "../../redux/actions/auth";

class SalesMessages extends Component {
  constructor(props) {
    super(props);
    this.bulkMsgListRef = React.createRef();
    this.bulkMsgDetailRef = React.createRef();
    this.userType = props.profile && props.profile.userTypeCode;
    this.setFlag = this.setFlag.bind(this)
    this.setPageCount = this.setPageCount.bind(this)
    this.handleBulkMessageTab = this.handleBulkMessageTab.bind(this)
    this.state = {
      chatTypeName: "bulkMessage",
      isTabSwitched: false,
      bulkMsgDetail: false,
      chatFetch: false,
      scrolling: true,
      endPage: false,
      firstUserChatId: "",
      product: [
        {
          id: 1,
          productImg: SEDAN_CAR,
          productName: "seat iviza blanco",
          productTitle: "jose Robies",
          productSubTitle: "Aun esta vento este pedaza d..",
          date: "30 May",
          isOnline: true,
          isSold: false,
          messageCount: "8",
          like: "1",
          watch: "120",
        },
      ],
      users: [
        {
          userData: {
            id: "1",
            userProfile: PROFILE_IMAGE,
            name: "jose javier",
            rate: 3,
            isOnline: true,
            messageCount: 2,
          },
          productData: {
            id: 1,
            productImg: SEDAN_CAR,
            productName: "seat iviza blanco",
            productTitle: "jose Robies",
            productSubTitle: "Aun esta vento este pedaza d..",
            date: "30 May",
            isOnline: true,
            isSold: false,
            messageCount: "8",
            like: "1",
            watch: "120",
          },
        },
      ],
      selectedProduct: {
        id: 1,
        productImg: SEDAN_CAR,
        productName: "seat iviza blanco",
        productTitle: "jose Robies",
        productSubTitle: "Aun esta vento este pedaza d..",
        date: "30 May",
        isOnline: true,
        isSold: false,
        messageCount: "8",
        like: "1",
        watch: "120",
      },
      botChat: false,
      pageCount: 0,
      flag: false,
      isBulkMessageActiveTab: false
    };
    this.disableTabSwitchState = this.disableTabSwitchState.bind(this);
  }

  handlerScroll = async () => {
    let element;

    if (this.state.chatTypeName === "bulkMessage") {
      element = document.getElementById("bulk-msg-pagination");
    } else {
      element = document.getElementById("chat-pagination");
    }

    if (
      element.scrollTop + element.clientHeight + 10 >= element.scrollHeight &&
      this.state.scrolling &&
      !this.state.endPage
    ) {
      let stateObjet = { ...this.state };
      stateObjet.scrolling = false;
      this.setState(stateObjet);

      try {
        let { getChats } = this.props;
        getChats(
          getChatList({
            name: "sale",
            type: env.TRIGGER_POINT.sale,
            offset: Object.keys(this.props.redux.chat["sale"]).length,
          })
        );

        customAxios.interceptors.response.use(
          (response) => {
            if (response.config.url.includes("chatList")) {
              if (response.status == 200) {
                this.setState((prevState) => {
                  return {
                    ...prevState,
                    scrolling: true,
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
        // setTimeout(() => {}, 500);
      } catch (e) {
        console.error("notification data", e);
      }
    }
  };

  setFlag = (flag) => {
    this.setState({
      flag: flag
    })
  }
  setPageCount = (count) => {
    this.setState({
      pageCount: count
    })
  }

  handleBulkMessageTab = (boolean) => {
    this.setState({
      isBulkMessageActiveTab: boolean
    })
  }

  disableTabSwitchState() {
    this.setState({
      isTabSwitched: false
    });
  }

  componentWillUnmount() {
    onlineOfflineStatus(false);

    let element;
    this.state.chatTypeName === "bulkMessage"
      ? element = document.getElementById("bulk-msg-pagination")
      : element = document.getElementById("chat-pagination");


    element && element.removeEventListener("scroll", this.handlerScroll);
    let { getChats } = this.props;
    getChats(
      getChatList({
        name: "sale",
        type:
          this.state.chatTypeName === "sale"
            ? env.TRIGGER_POINT.sale
            : env.TRIGGER_POINT.VIP_CHATS,
        initial: true,
      })
    );
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.chatTypeName !== this.state.chatTypeName) {
      this.setState({
        botChat: false
      })
    }
  }
  // componentDidUpdate(prevProps, prevState) {
  //   // console.log("SAdasd", this.props);
  //   if (
  //     Object.keys(this.props.redux.chat[chatType]).length > 0 &&
  //     !this.props.query.ct &&
  //     this.props.query.tab == "chat"
  //   ) {
  //     try {
  //       let firstChat = Object.values(this.props.redux.chat[chatType])[0];

  //       localStorage.setItem("chatData", JSON.stringify(firstChat));

  //       // Route.replace(`/chat?ct=${firstChat.chatId}`);
  //     } catch (e) {
  //       console.error("sdasdd", e);
  //     }
  //   }
  // }
  componentDidMount = () => {
    // const client = {}
    // onlineStatus(client);
    onlineOfflineStatus(true);
    // console.log('onlineStatus - true')

    let element;
    this.state.chatTypeName === "bulkMessage"
      ? element = document.getElementById("bulk-msg-pagination")
      : element = document.getElementById("chat-pagination");

    element && element.addEventListener("scroll", this.handlerScroll);
    let { getChats } = this.props;
    getChats(
      getChatList({
        name: "sale",
        type:
          this.state.chatTypeName === "sale"
            ? env.TRIGGER_POINT.sale
            : env.TRIGGER_POINT.VIP_CHATS,
        initial: true,
      })
    );
    setTimeout(() => {
      this.setState((prevState) => {
        return {
          ...prevState,
          chatFetch: true,
        };
      });
    }, 1500);
  };

  onClickHendler = (chatId) => {
    // startLoader()
    this.handleRefresh();
    this.setState({ botChat: false });
    // await sleep(2000)
    // stopLoader()
    try {
      localStorage.setItem(
        "chatData",
        JSON.stringify(this.props.redux.chat["sale"][chatId] || {})
      );
    } catch (e) { }

    Route.replace(`/chat?ct=${chatId}`);
  };

  handleRefresh = () => {
    return new Promise(async (resolve) => {
      let { getChats } = this.props;
      getChats(
        getChatList({
          name: "sale",
          type: env.TRIGGER_POINT.sale,
          initial: true,
        })
      );
      setTimeout(resolve, 1);
    });
  };

  handleGetVipChatUserList = (type) => {
    // Route.push('/chat')
    if (type === 0) {
      this.setState({ chatTypeName: "sale", bulkMsgDetail: false, isTabSwitched: true })
    } else if (type === 1) {
      this.setState({ chatTypeName: "vipChat", bulkMsgDetail: false, isTabSwitched: true })
    } else if (type === 2) {
      this.setState({ chatTypeName: "bulkMessage", bulkMsgDetail: true });
    }
    // this.setState({ chatTypeName: type ? "vipChat"  : "sale" });
    // return new Promise(async (resolve) => {
    let { getChats } = this.props;
    type !== 2 && getChats(
      getChatList({
        name: type ? "vipChat" : "sale",
        type: type ? env.TRIGGER_POINT.VIP_CHATS : env.TRIGGER_POINT.sale,
        initial: true,
      })
    );
    //   setTimeout(resolve, 1);
    // });
  };

  isBotChat = () => {
    this.setState({ botChat: true })
  }

  handleUpdatesAcknowledged = () => {
    sendUpdatesAcknowledge();
    this.props.dispatch(setUpdateAcknowledgementStatus(true));
  }
  resetText = () => {
    this.setState({
      searchText: ""
    })
    let { getChats } = this.props;
    getChats(
      getChatList({
        name: "sale",
        type:
          this.state.chatTypeName === "sale"
            ? env.TRIGGER_POINT.sale
            : env.TRIGGER_POINT.VIP_CHATS,
        initial: true,
        searchText: ""
      })
    );
  }
  render() {
    let { getMessages } = this.props;

    return (
      <div className="main-section chat-section row p-0 m-0 vh-50 w-100">
        {/* {this.props.redux.chat.saleFetch &&
        Object.keys(this.props.redux.chat["sale"]).length == 0 &&
        !this.props.query.ct ? (
          <div className="position-relative w-100">
            <NoChat left="45%" text="No conversation found !"></NoChat>
          </div>
        ) : ( */}
        <>
          {this.props.redux.chat.saleFetch
            ? <div className="section-1">
              <div
                className="row justify-content-left align-items-center"
                style={{ height: "70px" }}
              >
                <div className="col-auto">
                  <h6 className="mv_subHeader_title ml-3">Chats</h6>
                </div>
              </div>

              {this.userType == 2
                ? <Tab
                  handleChange={(v) => this.handleGetVipChatUserList(v)}
                  tabs={[{ label: "All Chats" }, { label: "VIP Chats" }, { label: "Bulk message" }]}
                  badge={true}
                  sale={this.props.redux.chat.sale}
                  tabContent={[{ content: "" }, { content: "" }]}
                />
                : ""
              }

              <PullToRefresh
                onRefresh={this.handleRefresh}
                fetchMoreThreshold={500}
              >
                <div className="chatList" id={`${this.state.chatTypeName === "bulkMessage" ? "bulk-msg-pagination" : "chat-pagination"}`}>

                  {["sale", "vipChat"].includes(this.state.chatTypeName) && <UpdateListTile handleUpdatesAcknowledged={this.handleUpdatesAcknowledged} active={this.state.botChat} isBotChat={this.isBotChat} />}

                  {this.userType == 2
                    ? <>
                      {/* Normal Chat */}
                      {this.state.chatTypeName == "sale" &&
                        (Object.keys(this.props.redux.chat.sale).length > 0
                          ? <>
                            {Object.keys(this.props.redux.chat.sale)
                              .map((item) => this.props.redux.chat.sale[item])
                              .filter((item) => (item.type == 1 && !item.isLastVipMessage))
                              .map((item) => {
                                return (
                                  <UserTile
                                    userData={this.props.redux.profileData}
                                    getMessages={this.props.getMessages}
                                    onClick11={this.onClickHendler}
                                    active={(!this.state.botChat && item.chatId == this.props.query?.ct)}
                                    key={item.chatId}
                                    userlist={this.props.redux.chat.userList}
                                    {...this.props.redux.chat.sale[item.chatId]}
                                  />
                                );
                              })}
                            {Object.keys(this.props.redux.chat.sale)
                              .map((item) => this.props.redux.chat.sale[item])
                              .filter((item) => item.type == 1).length == 0
                              ? <NoChat
                                left="25%"
                                text="No Chats Available !"
                              />
                              : ""
                            }
                          </>
                          : <NoChat
                            left="25%"
                            text="No Chats !"
                          />
                        )}

                      {/* VIP Chat */}
                      {this.state.chatTypeName == "vipChat" && (
                        Object.keys(this.props.redux.chat.sale).length > 0
                          ? <>
                            {Object.keys(this.props.redux.chat.sale)
                              .map((item) => this.props.redux.chat.sale[item])
                              .filter((item) => item.type == 0 || item.isLastVipMessage)
                              .map((item) => {
                                return (
                                  <UserTile
                                    userData={this.props.redux.profileData}
                                    getMessages={this.props.getMessages}
                                    onClick11={this.onClickHendler}
                                    active={(!this.state.botChat && item.chatId == this.props.query?.ct)}
                                    key={item.chatId}
                                    userlist={this.props.redux.chat.userList}
                                    {...this.props.redux.chat.sale[item.chatId]}
                                  ></UserTile>
                                );
                              })}
                            {Object.keys(this.props.redux.chat.sale)
                              .map((item) => this.props.redux.chat.sale[item])
                              .filter((item) => item.type == 0 || item.isLastVipMessage).length == 0
                              ? <NoChat
                                left="25%"
                                text="No Vip Chats Available !"
                              />
                              : ""
                            }
                          </>
                          : <NoChat
                            className=""
                            left="25%"
                            text="No Chats !"
                          />
                      )}

                      {/* Bulk Message */}
                      {this.state.chatTypeName === "bulkMessage" && <BulkMessageUI
                        bulkMsgListRef={this.bulkMsgListRef}
                        bulkMsgDetailRef={this.bulkMsgDetailRef}
                        flag={this.state.flag}
                        pageCount={this.state.pageCount}
                        setFlag={this.setFlag}
                        setPageCount={this.setPageCount}
                        handleBulkMessageTab={this.handleBulkMessageTab} 
                      />
                      }
                    </>
                    
                    : Object.keys(this.props.redux.chat.sale).length > 0
                      ? Object.keys(this.props.redux.chat.sale)
                        .map((item) => this.props.redux.chat.sale[item])
                        .map((item) => {
                          return (
                            <UserTile
                              userData={this.props.redux.profileData}
                              getMessages={this.props.getMessages}
                              onClick11={this.onClickHendler}
                              active={!this.state.botChat && item.chatId == this.props.query?.ct}
                              key={item.chatId}
                              userlist={this.props.redux.chat.userList}
                              {...this.props.redux.chat.sale[item.chatId]}
                            />
                          );
                        })
                      : <NoChat className="" left="25%" text="No Chats !" />
                  }
                </div>
              </PullToRefresh>
            </div>
            : <div className="section-1">
              {[...new Array(6)].map((data, index) => {
                return (
                  <div key={index}>
                    <OrderShimmer />
                  </div>
                );
              })}{" "}
            </div>
          }

          {this.state.botChat
            ? <div className="section-2 position-relative">
              <UpdateBot />
            </div>
            : <div className="section-2 position-relative">
              {/* <UserPostTile></UserPostTile> */}
              {
                // this.state.chatTypeName === 'bulkMessage' ?
                // <NoChat text="No Status to show"></NoChat> :
                <>
                  {
                    // this.state.chatTypeName === 'sale' ? (
                    this.props.redux.chat.saleFetch &&
                      this.props.query &&
                      this.props.query?.ct &&
                      (this.props.redux.chat.chats[this.props.query?.ct] ||
                        this.props.query?.ct) || this.state.chatTypeName === "bulkMessage"
                      ? <Chat
                        bulkMsgDetail={this.state.bulkMsgDetail}
                        actionDispatch={this.props.reduxDispatch}
                        getMessages={getMessages}
                        cid={this.props.query?.ct}
                        query={this.props.query}
                        userData={this.props.redux.profileData}
                        changeReadStatus={this.props.changeReadStatus}
                        deleteChat={this.props.deleteChat}
                        chatData={
                          this.props.redux.chat.sale[this.props.query?.ct]
                            ? this.props.redux.chat.sale[this.props.query?.ct]
                            : {}
                        }
                        chats={
                          this.props.redux.chat.chats[this.props.query?.ct]
                            ? this.props.redux.chat.chats[this.props.query?.ct]
                            : []
                        }
                        type="sale"
                        key={this.props.query?.ct}
                        className="h-100"
                        bulkMsgListRef={this.bulkMsgListRef.current}
                        bulkMsgDetailRef={this.bulkMsgDetailRef}
                      />
                      : <NoChat />
                    // ): (
                    //   this.props.redux.chat && this.props.redux.chat.vipChat &&
                    //   this.props.query && this.props.query.ct ? (
                    //     <Chat
                    //         actionDispatch={this.props.reduxDispatch}
                    //         getMessages={getMessages}
                    //         cid={this.props.query.ct}
                    //         userData={this.props.redux.profileData}
                    //         changeReadStatus={this.props.changeReadStatus}
                    //         deleteChat={this.props.deleteChat}
                    //         chatData={
                    //           this.props.redux.chat.sale[this.props.query.ct]
                    //             ? this.props.redux.chat.sale[this.props.query.ct]
                    //             : {}
                    //         }
                    //         chats={
                    //           this.props.redux.chat.chats[this.props.query.ct]
                    //             ? this.props.redux.chat.chats[this.props.query.ct]
                    //             : []
                    //         }
                    //         type="vipChat"
                    //         key={this.props.query.ct}
                    //         className="h-100"
                    //       ></Chat>
                    //   ):(<NoChat></NoChat>)

                    // )
                  }
                </>
              }
            </div>
          }
        </>

        <style jsx>{`
          .main-section {
            margin-left: -37px;
            width: 100%;
            margin-top: 1.5rem;
            height: calc(100vh - 5px);
            overflow-y: hidden;
          }
          .section-1 {
            width: 35%;
            height: 100%;
            overflow-x: hidden;
            overflow-y: hidden;
            border-right: 1px solid var(--l_border);
          }
          .chatList {
            padding-top: 10px;
            height: calc(100% - 130px);
            overflow-y: auto;
            overflow-x: hidden;
          }
          :global(.menu-icon) {
            height: 20px;
          }
          .section-2 {
            width: 65%;
            height: 100%;
            overflow-x: hidden;
            overflow-y: hidden;
          }

          @media (min-width: 700px) and (max-width: 991.98px){
            .section-1 {
              width: 38%;
            }
            .section-2 {
              width: 62%;
            }
          }
        `}</style>

        <HooksHelperComponent
          chatId={this.props.query?.ct}
          uId={this.props.query?.uid}
          chatData={this.props.redux.chat?.sale || {}}
          chatType={this.state.chatTypeName}
          isTabSwitched={this.state.isTabSwitched}
          disableTabSwitchState={this.disableTabSwitchState}
          userType={this.userType}
        />
      </div>
    );
  }
}

const mapStateToProps = (store) => {
  return {
    theme: store.theme,
  };
};

export default connect(mapStateToProps)(SalesMessages);

const HooksHelperComponent = (props) => {
  const { chatData, chatType, chatId, uId, isTabSwitched, disableTabSwitchState, userType } = props;
  const conditionToCheck = (item) => {
    if (chatType == "sale" && userType === 1) return item
    if (chatType == "sale") return !item.isVipMessage && item.type;
    else if (chatType == "vipChat") return !!item.isVipMessage || !item.type;
    return true;
  };

  React.useEffect(() => {
    const cData = Object.values(chatData)
    if (!chatId && cData.length) {
      if (uId) {
        const chatObj = cData.find(c => c.senderId === uId)
        if (chatObj) {
          Route.replace("/chat?ct=" + chatObj.chatId)
        }
        else {
          if (userType === 1) return Route.replace("/chat?ct=" + cData[0].chatId) 
          Route.replace("/chat?ct=" + cData.filter((item) => (item.type == 1))[0].chatId)
        }
      } else {
        const chatObj = Object.values(chatData).filter(item => conditionToCheck(item))[0];
        if (chatObj?.chatId) {
          Route.replace("/chat?ct=" + chatObj.chatId);
        }
      }
    }
    if (isTabSwitched && ["sale", "vipChat"].includes(chatType)) {
      disableTabSwitchState();
      const chatObj = Object.values(chatData).filter(item => conditionToCheck(item))[0];
      if (chatObj?.chatId) {
        Route.replace("/chat?ct=" + chatObj.chatId);
      } else {
        Route.replace("/chat");
      }
    }
  }, [chatId, chatData, chatType, uId]);
  return <div></div>;
};
