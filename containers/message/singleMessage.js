// library import
import React, { Component } from "react";
import { SEDAN_CAR, PROFILE_IMAGE, HUMBERGER_ICON } from "../../lib/config";
import * as env from "../../lib/config";
import SalesMessageTIle from "../../components/chatListTile/MessageTile";
import UserTile from "../../components/chatListTile/UserTile";
import Chat from "../../components/chat/chat";
import Route, { withRouter } from "next/router";
import { getChatList } from "../../redux/actions/chat/action";
import { getCookie, getLocalStorage } from "../../lib/session";
import { customAxios } from "../../lib/request";
import NoChat from "./noChat";
import Icon from "../../components/image/icon";
import OrderShimmer from "../../components/skeletonui/order";
import {
  authenticate,
  close_progress,
  open_drawer,
} from "../../lib/global";
import PullToRefresh from "react-simple-pull-to-refresh";
import Tab from "../../components/tabs/tabs";
import { palette } from "../../lib/palette";
import { connect } from "react-redux";
import { getBulkMessages } from "../../services/bulkMessage";
import BulkMessageUI from "./bulkMessageUI";
import UpdateListTile from "../../components/appUpdateBot/UpdateListTile";
import AddBulkMessage from "../../components/Drawer/bulkMessage/AddBulkMessage";
import { sendUpdatesAcknowledge } from "../../services/chat";
import { setUpdateAcknowledgementStatus } from "../../redux/actions/auth";

class SalesMessages extends Component {
  constructor(props) {
    super(props);
    this.userType = props.profile && props.profile.userTypeCode;
    this.setFlag = this.setFlag.bind(this)
    this.setPageCount = this.setPageCount.bind(this)
    this.handleBulkMessageTab = this.handleBulkMessageTab.bind(this)
    this.mobileView = props.isMobile;
    this.state = {
      auth: getCookie("auth"),
      chatTypeName: "sale",
      chatFetch: false,
      scrolling: true,
      endPage: false,
      tabType: 0,
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
      pageCount: 0,
      flag: false,
      isBulkMessageActiveTab: false
    };
  }

  handleNavigationMenu = () => {
    open_drawer("SideNavMenu", {
      paperClass: "backNavMenu",
      setActiveState: this.props.setActiveState,
      noBorderRadius: true,
      ...this.props,
    },
      "right"
    );
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

  handlerScroll = async () => {
    let element;
    this.state.tabType === 3
      ? element = document.getElementById("bulk-msg-pagination")
      : element = document.getElementById("chat-pagination");

    // element = document.getElementById("chat-pagination");

    if (
      element.scrollTop + element.clientHeight + 10 >= element.scrollHeight &&
      this.state.scrolling &&
      !this.state.endPage
    ) {
      let stateObjet = { ...this.state };
      stateObjet.scrolling = false;
      this.setState(stateObjet);

      try {
        // let { getChats } = this.props;
        // getChats(
        //   getChatList({
        //     name: "sale",
        //     type: env.TRIGGER_POINT.sale,
        //     offset: Object.keys(this.props.redux.chat.sale).length,
        //   })
        // );

        customAxios.interceptors.response.use(
          (response) => {
            if (response.config.url.includes("chatList")) {
              if (response.status == 200) {
                this.setState((prevState) => {
                  // console.log("sale messagess sadsbh", 200);
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
        console.error("notification data");
      }
    }
  };

  componentWillUnmount() {
    window.removeEventListener('resize', this.setCustomVhToBody);
    let element;
    this.state.tabType === 3
      ? element = document.getElementById("bulk-msg-pagination")
      : element = document.getElementById("chat-pagination");

    // element = document.getElementById("chat-pagination");

    element && element.removeEventListener("scroll", this.handlerScroll);
  }

  componentDidMount = () => {
    this.setCustomVhToBody();
    window.addEventListener('resize', this.setCustomVhToBody);
    let element;
    this.state.tabType === 3
      ? element = document.getElementById("bulk-msg-pagination")
      : element = document.getElementById("chat-pagination");

    // element = document.getElementById("chat-pagination");

    element && element.addEventListener("scroll", this.handlerScroll);
    let { getChats } = this.props;
    getChats(
      getChatList({
        name: "sale",
        type: env.TRIGGER_POINT.sale,
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

  onClickHendler = async (chatId, chatType = "sale") => {
    let chatData = this.props.redux.chat["sale"][chatId];
    if (
      this.userType == 1 &&
      !chatData &&
      (!chatData?.vipMessage || chatData?.vipMessage <= 0)
    ) {
      // purchase plan here
      return open_drawer("VIP_MESSAGE_POPUP", {
        handleSubmit: () => {
          this.handleAfterPlanPurchase(chatId, chatType);
        },
        userName: chatData.userName,
        chatId: chatId,
        creatorId: chatData.receiverId,
      },
        "bottom"
      );
    } else {
      this.handleAfterPlanPurchase(chatId, chatType);
    }
  };

  handleAfterPlanPurchase = async (chatId, chatType) => {
    this.handleRefresh();
    try {
      localStorage.setItem(
        "chatData",
        JSON.stringify(this.props.redux.chat["sale"][chatId] || {})
      );
    } catch (e) { }

    Route.push(`/chat?ct=${chatId}`);
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

  handleUpdatesAcknowledged = () => {
    sendUpdatesAcknowledge();
    this.props.dispatch(setUpdateAcknowledgementStatus(true));
  }

  handleGetVipChatUserList = (type) => {
    this.setState({ chatTypeName: type ? "vipChat" : "sale" });
  };

  UniversalMessage = () => {
    return (
      <UpdateListTile handleUpdatesAcknowledged={this.handleUpdatesAcknowledged} isBotChat={this.isBotChat} />
    )
  }

  handleBulkMessageTab = (boolean) => {
    this.setState({
      isBulkMessageActiveTab: boolean
    })
  }
  allChatUsersList = () => {
    return (
      <PullToRefresh
        onRefresh={() => this.handleRefresh(type)}
        fetchMoreThreshold={500}
      >
        <div
          className="row m-0 w-100"
          style={{ height: "90%", overflowY: "auto" }}
          id="chat-pagination"
        >
          {this.props.redux.chat.saleFetch ? (
            <div className="section-1 pl-2 pr-2 w-100">
              <ul className="nav flex-column nav-pills mv_chatUL">
                {Object.keys(this.props.redux.chat.sale || {}).length > 0 ? (
                  Object.keys(this.props.redux.chat.sale)
                    .map((item) => this.props.redux.chat.sale[item])
                    .map((item) => {
                      return (
                        <UserTile
                          userData={this.props.redux.profileData}
                          getMessages={this.props.getMessages}
                          onClick11={this.onClickHendler}
                          chatType="sale"
                          active={item.chatId == this.props.query.ct}
                          key={item.chatId}
                          userlist={this.props.redux.chat.userList}
                          {...item}
                        />
                      );
                    })
                ) : (
                  <NoChat className="" left="25%" text="No Chats Available !" />
                )}
              </ul>
            </div>
          ) : (
            <div className="section-1 pl-2 pr-2 w-100">
              {[...new Array(6)].map((data, index) => {
                return (
                  <div key={index}>
                    <OrderShimmer></OrderShimmer>
                  </div>
                );
              })}{" "}
            </div>
          )}
        </div>
      </PullToRefresh>
    );
  };

  setCustomVhToBody = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vhCustom', `${vh}px`);
  };

  chatUserList = (type) => {
    return (
      <PullToRefresh
        onRefresh={() => this.handleRefresh(type)}
        fetchMoreThreshold={500}
      >
        <div
          className="row m-0 w-100"
          style={{  height: "calc(100vh - 190px)", overflowY: "auto" }}
          id={`${type === 3 ? "bulk-msg-pagination" : "chat-pagination"}`}
        >
          {type == 1
            ? this.props.redux.chat.saleFetch
              ? <div className="section-1 pl-2 pr-2 w-100">
                <ul className="nav flex-column nav-pills mv_chatUL">
                  {this.UniversalMessage()}

                  {Object.keys(this.props.redux.chat.sale || {}).length > 0
                    ? <>
                      {Object.keys(this.props.redux.chat.sale)
                        .map((item) => this.props.redux.chat.sale[item])
                        .filter((item) => item.type == 1 && !item.isLastVipMessage)
                        .map((item) => {
                          return (
                            <UserTile
                              userData={this.props.redux.profileData}
                              getMessages={this.props.getMessages}
                              onClick11={this.onClickHendler}
                              chatType="sale"
                              active={item.chatId == this.props.query.ct}
                              key={item.chatId}
                              userlist={this.props.redux.chat.userList}
                              {...item}
                            />
                          );
                        })}
                      {Object.keys(this.props.redux.chat.sale)
                        .map((item) => this.props.redux.chat.sale[item])
                        .filter((item) => item.type).length == 0
                        ? <NoChat left="25%" text="No Chats Available !" />
                        : ""
                      }
                    </>
                    : <NoChat
                      className=""
                      left="25%"
                      text="No Chats Available !"
                    />
                  }
                </ul>
              </div>
              : <div className="section-1 pl-2 pr-2 w-100">
                {[...new Array(6)].map((data, index) => {
                  return (
                    <div key={index}>
                      <OrderShimmer></OrderShimmer>
                    </div>
                  );
                })}{" "}
              </div>
            : type == 2
              ? this.props.redux.chat.saleFetch
                ? <div className="section-1 pl-2 pr-2 w-100">
                  <ul className="nav flex-column nav-pills mv_chatUL">
                    {this.UniversalMessage()}

                    {Object.keys(this.props.redux.chat.sale || {}).length > 0
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
                                chatType="sale"
                                active={item.chatId == this.props.query.ct}
                                key={item.chatId}
                                userlist={this.props.redux.chat.userList}
                                {...item}
                              />
                            );
                          })}
                        {Object.keys(this.props.redux.chat.sale)
                          .map((item) => this.props.redux.chat.sale[item])
                          .filter((item) => !item.type).length == 0
                          ? <NoChat
                            left="25%"
                            text="No VIP Chats Available !"
                          />
                          : ""
                        }
                      </>
                      : <NoChat
                        className=""
                        left="25%"
                        text="No VIP Chats Available !"
                      />
                    }
                  </ul>
                </div>
                : <div className="section-1 pl-2 pr-2 w-100">
                  {[...new Array(6)].map((data, index) => {
                    return (
                      <div key={index}>
                        <OrderShimmer />
                      </div>
                    );
                  })}{" "}
                </div>
              :
              <BulkMessageUI flag={this.state.flag} pageCount={this.state.pageCount} setFlag={this.setFlag} setPageCount={this.setPageCount} handleBulkMessageTab={this.handleBulkMessageTab} />
          }
        </div>
      </PullToRefresh>
    );
  };

  handleOnUnmount = () => {
    this.handleRefresh(this.state.chatTypeName === "sale" ? 1 : 2);
  };

  onSuccess = () => {
    close_progress();
    this.setState({
      pageCount: 0
    }, () => {
      this.setState({
        flag: true
      })
    })
  }

  render() {
    let { getMessages } = this.props;
    return (
      <div
        className="main-section chat-section row p-0 m-0"
        style={{ height: "inherit" }}
      >
        {this.props.redux.chat.saleFetch &&
          Object.keys(this.props.redux.chat["sale"]).length == 0 &&
          !this.props.query.ct ? (
          <div className="dv_wrap_home w-100">
            <div className="col-12 pt-2" style={{ height: "100%" }}>
              <div className="row justify-content-between sticky-top">
                <div className="col-auto">
                    <h6 className="mv_subHeader_title mb-3">Chats</h6>
                </div>
                <div className="col-auto">
                  <div
                    className="mb-0 pointer"
                    style={{ marginLeft: "10px" }}
                    onClick={() => {
                      this.state.auth
                        ? this.handleNavigationMenu()
                        : authenticate().then();
                    }}
                  >
                    <Icon
                      icon={`${HUMBERGER_ICON}#humberger_menu`}
                      color={this.props.theme.text}
                      size={20}
                      width={24}
                      height={22}
                      viewBox="0 0 22.003 14.669"
                    />
                  </div>
                </div>
              </div>

              <div className="row dynamicHeight" style={{ height: "calc(100% - 120px)" }}>
                    {this.userType == 1
                      ? this.allChatUsersList()
                      : <Tab
                        handleChange={(v) => {
                          this.handleGetVipChatUserList(v);
                        }}
                        activeTab={this.state.chatTypeName == "sale" ? 0 : 1}
                        tabs={[{ label: "All Chats" }, { label: "VIP Chats" }, { label: "Bulk Message" }]}
                        sale={this.props.redux.chat.sale}
                        badge={true}
                        tabContent={[
                          { content: () => this.chatUserList(1) },
                          { content: () => this.chatUserList(2) },
                          { content: () => this.chatUserList(3) },
                        ]}
                      />
                    }
                  </div>

              <div className="row nochatstyle">
                <div className="position-relative w-100">
                  {this.UniversalMessage()}
                  <NoChat
                    className="mt-5"
                    left="30%"
                    text="No conversation found !"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {this.props.query.ct == undefined ? (
              <div className="dv_wrap_home w-100">
                <div className="col-12 pt-4" style={{ height: "100%" }}>
                  <div className="row justify-content-between">
                    <div className="col-auto">
                      <h6 className="mv_subHeader_title mb-3">Chats</h6>
                    </div>
                      <div className="col-auto d-flex" >
                        {this.mobileView && this.state.isBulkMessageActiveTab && <AddBulkMessage onSuccess={this.onSuccess} />}
                      <div
                        className="mb-0 pointer"
                        style={{ marginLeft: "10px" }}
                        onClick={() => {
                          this.state.auth
                            ? this.handleNavigationMenu()
                            : authenticate().then();
                        }}
                      >
                        <Icon
                          icon={`${HUMBERGER_ICON}#humberger_menu`}
                          color={this.props.theme.text}
                          width={24}
                          height={22}
                          viewBox="0 0 22.003 14.669"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row dynamicHeight" style={{ height: "calc(100% - 120px)" }}>
                    {this.userType == 1
                      ? this.allChatUsersList()
                      : <Tab
                        handleChange={(v) => {
                          this.handleGetVipChatUserList(v);
                        }}
                        activeTab={this.state.chatTypeName == "sale" ? 0 : 1}
                        tabs={[{ label: "All Chats" }, { label: "VIP Chats" }, { label: "Bulk Message" }]}
                        sale={this.props.redux.chat.sale}
                        badge={true}
                        tabContent={[
                          { content: () => this.chatUserList(1) },
                          { content: () => this.chatUserList(2) },
                          { content: () => this.chatUserList(3) },
                        ]}
                      />
                    }
                  </div>
                  {/* <div className="row ">
                      {this.props.redux.chat.saleFetch ? (
                        <div className="section-1 pl-2 pr-2" id="chat-pagination">
                          <ul className="nav flex-column nav-pills mv_chatUL">
                            {Object.keys(this.props.redux.chat.sale).length > 0
                              ? Object.keys(this.props.redux.chat.sale).map((chatId) => {
                                  return (
                                    <UserTile
                                      userData={this.props.redux.profileData}
                                      getMessages={getMessages}
                                      onClick11={this.onClickHendler}
                                      active={chatId == this.props.query.ct}
                                      key={chatId}
                                      {...this.props.redux.chat.sale[chatId]}
                                    ></UserTile>
                                  );
                                })
                            : ""}
                          </ul>
                        </div>
                      ) : (
                        <div className="section-1 pl-2 pr-2">
                          {[...new Array(6)].map((data, index) => {
                            return (
                              <div key={index}>
                                <OrderShimmer></OrderShimmer>
                              </div>
                            );
                          })}{" "}
                        </div>
                      )}
                    </div> */}
                </div>
              </div>
            ) : (
              <div className="section-2 position-relative">
                {this.props.redux.chat.saleFetch &&
                  this.props.query &&
                  this.props.query.ct &&
                  (this.props.redux.chat.chats[this.props.query.ct] ||
                    this.props.query.ct) && (
                    <Chat
                      actionDispatch={this.props.reduxDispatch}
                      getMessages={getMessages}
                      cid={this.props.query.ct}
                      query={this.props.query}
                      userData={this.props.redux.profileData}
                      changeReadStatus={this.props.changeReadStatus}
                      deleteChat={this.props.deleteChat}
                      chatData={
                        this.props.redux.chat.sale[this.props.query.ct]
                          ? this.props.redux.chat.sale[this.props.query.ct]
                          : {}
                      }
                      chats={
                        this.props.redux.chat.chats[this.props.query.ct]
                          ? this.props.redux.chat.chats[this.props.query.ct]
                          : []
                      }
                      type="sale"
                      key={this.props.query.ct}
                      className="h-100"
                      handleOnUnmount={this.handleOnUnmount}
                    ></Chat>
                  )}

                {(!this.props.redux.chat.saleFetch ||
                  (Object.keys(this.props.redux.chat.sale).length > 0 &&
                    !this.props.query.ct)) && (
                    <NoChat className="" left="25%"></NoChat>
                  )}
              </div>
            )}
          </>
        )}

        <style jsx>{`
        :global(.dynamicHeighttab) {
          height: calc(calc(var(--vhCustom, 1vh) * 100) - 15vh)!important;
        }
          .main-section {
            margin-left: -37px;
            width: 100%;
            margin-top: 1.5rem;
            height: 97vh;
            overflow-y: hidden;
          }
          .section-1 {
            width: 100%;
            overflow-y: auto;
            height: 100%;
            overflow-x: hidden;
          }
          :global(.menu-icon) {
            height: 15px;
          }
          :global(.nav-pills) {
            flex-wrap:unset;
          }
          .section-2 {
            width: 100%;
            height: 100%;
            overflow-x: hidden;
            overflow-y: hidden;
          }

          .chat-section {
            width: 100%;
          }
          .section-3 {
            width: 21%;
          }
          .nochatstyle {
            display: flex;
            justify-content: center;
            justify-items: center;
            height: calc(100vh - 200px);
          }
        `}</style>
        <HooksHelperComponent
          chatId={this.props.query.ct}
          uId={this.props.query.uid}
          chatData={this.props.redux.chat?.sale || {}}
          chatType={this.state.chatTypeName}
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

export default connect(mapStateToProps)(withRouter(SalesMessages));

const HooksHelperComponent = (props) => {
  const { chatData, chatType, chatId, uId, isTabSwitched, disableTabSwitchState } = props;
  React.useEffect(() => {
    if (!chatId) {
      const cData = Object.values(chatData)
      if (cData.length > 0) {
        if (uId) {
          const chatObj = cData.find(c => c.senderId === uId)
          if (chatObj) {
            Route.replace("/chat?ct=" + chatObj.chatId)
          }
        }
      }
    }
  }, [chatId, chatData, chatType, uId]);
  return <div></div>;
};
